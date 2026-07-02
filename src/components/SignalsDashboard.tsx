import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import PrestigeStarBadge from './PrestigeStarBadge';
import './SignalsDashboard.css';

const getRoleColor = (role: string): string => {
  const roleUpperCase = role.toUpperCase();
  if (roleUpperCase === 'ARCHITECT') return '#FFD700';
  if (roleUpperCase === 'CATALYST') return '#00C896';
  if (roleUpperCase === 'EXPLORER') return '#06b6d4';
  return '#9CA3AF';
};

type SignalType = 'message' | 'connection_request' | 'mention' | 'funding' | 'startup_update' | 'community';

interface Signal {
  id: string;
  type: SignalType;
  senderId?: string;
  receiverId?: string;
  avatar?: string;
  name: string;
  role: string;
  roleType: 'gold' | 'green' | 'blue' | 'purple';
  text: string;
  time: string;
  action?: { label: string; type: 'view_profile' | 'reply' | 'view_startup' | 'view_investor' | 'open_post' | 'open_message' | 'join_event' | 'save_opportunity' | 'accept_connection' };
  isUnread: boolean;
  isArchived?: boolean;
  referenceId?: string;
  createdAt?: Date;
}

const connectionRequests = [
  {
    id: '1',
    avatar: undefined,
    name: 'Riya Sharma',
    role: 'Architect',
    roleType: 'gold',
    title: 'Founder @ Vega AI',
    mutualConnections: 18,
    time: '2 hours ago'
  },
  {
    id: '2',
    avatar: undefined,
    name: 'Karan Malhotra',
    role: 'Catalyst',
    roleType: 'green',
    title: 'Partner @ Elevation Capital',
    mutualConnections: 24,
    time: '4 hours ago'
  },
  {
    id: '3',
    avatar: undefined,
    name: 'Ananya Iyer',
    role: 'Explorer',
    roleType: 'blue',
    title: 'Product Reviewer',
    mutualConnections: 6,
    time: '1 day ago'
  },
  {
    id: '4',
    avatar: undefined,
    name: 'Vikram Singh',
    role: 'Architect',
    roleType: 'gold',
    title: 'Co-founder @ QuickOps',
    mutualConnections: 11,
    time: '2 days ago'
  }
];

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const SignalsDashboard = () => {
  const { userName, userRole, userData } = useUser();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'signals' | 'connections'>('signals');
  const [activeTab, setActiveTab] = useState('All');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSignalMenu, setShowSignalMenu] = useState<string | null>(null);
  const [signals, setSignals] = useState<Signal[]>([
    { id: '1', type: 'connection_request', name: 'Arjun Sharma', role: 'Architect', roleType: 'gold', text: 'accepted your connection request', time: '2m ago', action: { label: 'View Profile', type: 'view_profile' }, isUnread: true },
    { id: '2', type: 'message', name: 'Maya Verma', role: 'Architect', roleType: 'gold', text: 'sent you a message', time: '5m ago', action: { label: 'Reply', type: 'reply' }, isUnread: true },
    { id: '3', type: 'mention', name: 'Priya Singh', role: 'Architect', roleType: 'gold', text: 'mentioned you in a post', time: '10m ago', action: { label: 'Open Post', type: 'open_post' }, isUnread: true },
    { id: '4', type: 'funding', name: 'FutureFund Capital', role: '', roleType: 'purple', text: 'posted a new funding opportunity', time: '30m ago', action: { label: 'Save Opportunity', type: 'save_opportunity' }, isUnread: true },
    { id: '5', type: 'startup_update', name: 'Nebula AI', role: 'Startup', roleType: 'purple', text: 'launched a new product "Nebula Copilot"', time: '1h ago', action: { label: 'View Startup', type: 'view_startup' }, isUnread: false },
    { id: '6', type: 'community', name: 'AI Innovators Community', role: '', roleType: 'blue', text: 'someone replied to your comment', time: '2h ago', action: { label: 'View Reply', type: 'open_post' }, isUnread: false },
    { id: '7', type: 'startup_update', name: 'Nebula AI', role: 'Startup', roleType: 'purple', text: 'reached funding goal', time: '5h ago', action: { label: 'View Startup', type: 'view_startup' }, isUnread: false },
    { id: '8', type: 'community', name: 'TRIVEON Community', role: '', roleType: 'blue', text: 'announced a community event', time: '1d ago', action: { label: 'Join Event', type: 'join_event' }, isUnread: false },
    { id: '9', type: 'connection_request', name: 'Vikas Rao', role: 'Architect', roleType: 'gold', text: 'wants to connect with you', time: '1d ago', action: { label: 'Accept Connection', type: 'accept_connection' }, isUnread: false },
    { id: '10', type: 'message', name: 'Startup Team', role: '', roleType: 'purple', text: 'mentioned you in a message', time: '2d ago', action: { label: 'Open Message', type: 'open_message' }, isUnread: false },
    { id: '11', type: 'funding', name: 'Rohan Kapoor', role: 'Catalyst', roleType: 'green', text: 'invited you to join a syndicate', time: '3d ago', action: { label: 'View Opportunity', type: 'save_opportunity' }, isUnread: false },
    { id: '12', type: 'startup_update', name: 'Nebula AI', role: 'Startup', roleType: 'purple', text: 'changed valuation', time: '4d ago', action: { label: 'View Startup', type: 'view_startup' }, isUnread: false },
    { id: '13', type: 'startup_update', name: 'Nebula AI', role: 'Startup', roleType: 'purple', text: 'published pitch deck', time: '5d ago', action: { label: 'View Startup', type: 'view_startup' }, isUnread: false },
    { id: '14', type: 'community', name: 'TRIVEON Community', role: '', roleType: 'blue', text: 'poll results are available', time: '1w ago', action: { label: 'View Results', type: 'open_post' }, isUnread: false },
    { id: '15', type: 'connection_request', name: 'Anjali Desai', role: 'Explorer', roleType: 'blue', text: 'started following you', time: '1w ago', action: { label: 'View Profile', type: 'view_profile' }, isUnread: false },
  ]);

  const [settings, setSettings] = useState({
    connections: true,
    messages: true,
    mentions: true,
    fundingAlerts: true,
    startupUpdates: true,
    communityUpdates: true,
    emailSignals: false,
    pushSignals: true
  });

  const getSortedSignals = () => {
    const priorityOrder: SignalType[] = ['message', 'connection_request', 'mention', 'funding', 'startup_update', 'community'];
    return [...signals].sort((a, b) => priorityOrder.indexOf(a.type) - priorityOrder.indexOf(b.type));
  };

  const markAllAsRead = () => {
    setSignals(prev => prev.map(signal => ({ ...signal, isUnread: false })));
  };

  const markAsRead = (id: string) => {
    setSignals(prev => prev.map(signal => signal.id === id ? { ...signal, isUnread: false } : signal));
  };

  const archiveSignal = (id: string) => {
    setSignals(prev => prev.map(signal => signal.id === id ? { ...signal, isArchived: true } : signal));
  };

  const deleteSignal = (id: string) => {
    setSignals(prev => prev.filter(signal => signal.id !== id));
  };

  const handleAction = (action: Signal['action'], id: string) => {
    if (!action) return;
    markAsRead(id);
  };

  return (
    <div className="sd-container">
      <div className="sd-left-sidebar">
        <div className="sd-logo">
          <div className="sd-logo-icon">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="logoGradSd" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
              </defs>
              <polygon points="20,80 50,20 80,80" fill="url(#logoGradSd)" />
              <text x="50" y="72" textAnchor="middle" fill="#000" fontSize="28" fontWeight="800" fontFamily="Arial">T</text>
            </svg>
          </div>
          <span className="sd-logo-text">TRIVEON</span>
        </div>

        <div className="sd-messaging-header">
          <span className="sd-messaging-title">Signals</span>
        </div>

        <nav className="sd-nav">
          <div className="sd-nav-item" onClick={() => navigate('/home')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
            <span>Home</span>
          </div>

          <div className={`sd-nav-item ${activeView === 'signals' ? 'active' : ''}`} onClick={() => setActiveView('signals')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            <span>Signals</span>
          </div>
          <div className={`sd-nav-item ${activeView === 'connections' ? 'active' : ''}`} onClick={() => setActiveView('connections')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            <span>Connections</span>
            <span className="sd-badge">12</span>
          </div>
        </nav>
      </div>

      <div className="sd-main">
        <div className="sd-content">
          {activeView === 'signals' ? (
            <div className="sd-main-col">
              <div className="sd-page-header">
                <h1 className="sd-page-title">All Signals</h1>
                <div className="sd-page-actions">
                  <div className="sd-mark-all-read" onClick={markAllAsRead}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                    Mark all as read
                  </div>
                  <div className="sd-settings-btn" onClick={() => setShowSettingsModal(true)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    Settings
                  </div>
                </div>
              </div>

              <div className="sd-tabs">
                {['All', 'Unread', 'Important', 'Today', 'This Week'].map(tab => (
                  <div key={tab} className={`sd-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                    {tab}
                    {tab === 'Unread' && <span className="sd-tab-badge">{signals.filter(s => s.isUnread).length}</span>}
                  </div>
                ))}
              </div>

              <div className="sd-signals-list">
                {getSortedSignals().filter(signal => !signal.isArchived).map((signal) => (
                  <div key={signal.id} className={`sd-signal-card ${signal.isUnread ? 'unread' : ''}`}>
                    {signal.isUnread && <div className="sd-unread-dot"></div>}
                    <div className="sd-signal-avatar">
                      {signal.avatar ? (
                        <img src={signal.avatar} alt={signal.name} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                      ) : (
                        <div className={`sd-avatar-initials ${signal.roleType}`}>
                          {getInitials(signal.name)}
                        </div>
                      )}
                    </div>
                    <div className="sd-signal-content">
                      <div className="sd-signal-header">
                        <div className="sd-signal-name">
                          <strong>{signal.name}</strong>
                          {signal.role && <span className={`sd-role-badge ${signal.roleType}`}>{signal.role}</span>}
                        </div>
                        <div className="sd-signal-right">
                          <span className="sd-signal-time">{signal.time}</span>
                          <button 
                            className="sd-signal-menu-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowSignalMenu(showSignalMenu === signal.id ? null : signal.id);
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="6" r="1" />
                              <circle cx="12" cy="18" r="1" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="sd-signal-text">{signal.text}</p>
                      {signal.action && (
                        <button 
                          className="sd-action-button"
                          onClick={() => handleAction(signal.action, signal.id)}
                        >
                          {signal.action.label}
                        </button>
                      )}
                      {showSignalMenu === signal.id && (
                        <div className="sd-signal-menu">
                          <button onClick={() => { markAsRead(signal.id); setShowSignalMenu(null); }}>Mark as {signal.isUnread ? 'Read' : 'Unread'}</button>
                          <button onClick={() => { archiveSignal(signal.id); setShowSignalMenu(null); }}>Archive</button>
                          <button onClick={() => { deleteSignal(signal.id); setShowSignalMenu(null); }}>Delete</button>
                          <button onClick={() => setShowSignalMenu(null)}>Turn off similar signals</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="sd-connections-view">
              <div className="cd-main-col">
                <div className="cd-page-header">
                  <h1 className="cd-page-title">Connection Requests</h1>
                  <p className="cd-page-subtitle">Build meaningful relationships across the ecosystem.</p>
                </div>

                <div className="cd-stats">
                  <div className="cd-stat-card">
                    <div className="cd-stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div className="cd-stat-info">
                      <div className="cd-stat-number">12</div>
                      <div className="cd-stat-label">Incoming Requests</div>
                      <div className="cd-stat-sub">New this week: 5</div>
                    </div>
                  </div>

                  <div className="cd-stat-card">
                    <div className="cd-stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div className="cd-stat-info">
                      <div className="cd-stat-number">4</div>
                      <div className="cd-stat-label">Sent Requests</div>
                      <div className="cd-stat-sub">Pending responses</div>
                    </div>
                  </div>

                  <div className="cd-stat-card">
                    <div className="cd-stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <div className="cd-stat-info">
                      <div className="cd-stat-number">8</div>
                      <div className="cd-stat-label">Accepted This Week</div>
                      <div className="cd-stat-sub">Great going! 🎉</div>
                    </div>
                  </div>
                </div>

                <div className="cd-tabs">
                  {['All', 'Architects', 'Catalysts', 'Explorers', 'Mutual Connections', 'Recently Received'].map(tab => (
                    <div 
                      key={tab} 
                      className={`cd-tab ${activeTab === 'All' && tab === 'All' ? 'active' : ''}`} 
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </div>
                  ))}
                </div>

                <div className="cd-connections-list">
                  {connectionRequests.map(request => (
                    <div key={request.id} className="cd-connection-card">
                      <div className="cd-connection-avatar">
                        {request.avatar ? (
                          <img src={request.avatar} alt={request.name} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                        ) : (
                          getInitials(request.name)
                        )}
                      </div>
                      <div className="cd-connection-content">
                        <div className="cd-connection-header">
                          <div className="cd-connection-name">
                            <strong>{request.name}</strong>
                            <span className={`cd-role-badge ${request.roleType}`}>{request.role}</span>
                          </div>
                          <div className="cd-connection-mutual">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                            </svg>
                            <span>{request.mutualConnections} Mutual Connections</span>
                          </div>
                        </div>
                        <p className="cd-connection-title">{request.title}</p>
                        <div className="cd-connection-time">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {request.time}
                        </div>
                        <div className="cd-connection-actions">
                          <button className="cd-accept-btn">Accept</button>
                          <button className="cd-decline-btn">Decline</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showSettingsModal && (
        <div className="sd-modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="sd-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="sd-modal-header">
              <h2>Signal Settings</h2>
              <button className="sd-modal-close" onClick={() => setShowSettingsModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="sd-modal-body">
              <div className="sd-setting-item">
                <span>Connections</span>
                <label className="sd-toggle">
                  <input type="checkbox" checked={settings.connections} onChange={(e) => setSettings(prev => ({ ...prev, connections: e.target.checked }))} />
                  <span className="sd-toggle-slider"></span>
                </label>
              </div>
              <div className="sd-setting-item">
                <span>Messages</span>
                <label className="sd-toggle">
                  <input type="checkbox" checked={settings.messages} onChange={(e) => setSettings(prev => ({ ...prev, messages: e.target.checked }))} />
                  <span className="sd-toggle-slider"></span>
                </label>
              </div>
              <div className="sd-setting-item">
                <span>Mentions</span>
                <label className="sd-toggle">
                  <input type="checkbox" checked={settings.mentions} onChange={(e) => setSettings(prev => ({ ...prev, mentions: e.target.checked }))} />
                  <span className="sd-toggle-slider"></span>
                </label>
              </div>
              <div className="sd-setting-item">
                <span>Funding Alerts</span>
                <label className="sd-toggle">
                  <input type="checkbox" checked={settings.fundingAlerts} onChange={(e) => setSettings(prev => ({ ...prev, fundingAlerts: e.target.checked }))} />
                  <span className="sd-toggle-slider"></span>
                </label>
              </div>
              <div className="sd-setting-item">
                <span>Startup Updates</span>
                <label className="sd-toggle">
                  <input type="checkbox" checked={settings.startupUpdates} onChange={(e) => setSettings(prev => ({ ...prev, startupUpdates: e.target.checked }))} />
                  <span className="sd-toggle-slider"></span>
                </label>
              </div>
              <div className="sd-setting-item">
                <span>Community Updates</span>
                <label className="sd-toggle">
                  <input type="checkbox" checked={settings.communityUpdates} onChange={(e) => setSettings(prev => ({ ...prev, communityUpdates: e.target.checked }))} />
                  <span className="sd-toggle-slider"></span>
                </label>
              </div>
              <div className="sd-setting-divider"></div>
              <div className="sd-setting-item">
                <span>Email Signals</span>
                <label className="sd-toggle">
                  <input type="checkbox" checked={settings.emailSignals} onChange={(e) => setSettings(prev => ({ ...prev, emailSignals: e.target.checked }))} />
                  <span className="sd-toggle-slider"></span>
                </label>
              </div>
              <div className="sd-setting-item">
                <span>Push Signals</span>
                <label className="sd-toggle">
                  <input type="checkbox" checked={settings.pushSignals} onChange={(e) => setSettings(prev => ({ ...prev, pushSignals: e.target.checked }))} />
                  <span className="sd-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignalsDashboard;