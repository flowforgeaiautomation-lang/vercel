import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import PrestigeStarBadge from './PrestigeStarBadge';
import './NotificationsDashboard.css';

const getRoleColor = (role: string): string => {
  const roleUpperCase = role.toUpperCase();
  if (roleUpperCase === 'ARCHITECT') return '#FFD700';
  if (roleUpperCase === 'CATALYST') return '#00C896';
  if (roleUpperCase === 'EXPLORER') return '#06b6d4';
  return '#9CA3AF';
};

interface Notification {
  id: string;
  avatar?: string;
  name: string;
  role: string;
  roleType: 'gold' | 'green' | 'blue' | 'purple';
  text: string;
  time: string;
  action?: string;
  isUnread: boolean;
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
    roleType: 'cyan',
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

const NotificationsDashboard = () => {
  const { profile } = useAuth();
  const { userData } = useUser();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'notifications' | 'connections'>('notifications');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole');
    if (savedRole) {
      // setUserRole(savedRole.toUpperCase() as 'ARCHITECT' | 'EXPLORER' | 'CATALYST');
    }
  }, []);

  const getUserName = () => {
    return localStorage.getItem('triveon-name') || userData?.profile?.name || profile?.name || 'Umat Chaudhary';
  };

  const getUserRole = () => {
    return userData?.mainRole || profile?.role || 'Investor';
  };

  const notifications: Notification[] = [
    {
      id: '1',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&h=180&fit=crop&crop=face',
      name: 'Unnati Chaudhary',
      role: 'Investor',
      roleType: 'green',
      text: 'accepted your connection request.',
      time: '2m ago',
      action: 'View Profile',
      isUnread: true
    },
    {
      id: '2',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=180&h=180&fit=crop&crop=face',
      name: 'Maya Verma',
      role: 'Architect',
      roleType: 'gold',
      text: 'sent you a message.',
      time: '5m ago',
      action: 'Reply',
      isUnread: true
    },
    {
      id: '3',
      avatar: undefined,
      name: 'Nebula AI',
      role: 'Startup',
      roleType: 'purple',
      text: 'launched a new product "Nebula Copilot".',
      time: '1h ago',
      action: 'View Startup',
      isUnread: false
    },
    {
      id: '4',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=180&h=180&fit=crop&crop=face',
      name: 'Rohan Kapoor',
      role: 'Investor',
      roleType: 'green',
      text: 'invited you to join a syndicate.',
      time: '2h ago',
      action: 'View Opportunity',
      isUnread: false
    },
    {
      id: '5',
      avatar: undefined,
      name: 'AI Innovators Community',
      role: '',
      roleType: 'blue',
      text: 'someone replied to your comment.',
      time: '3h ago',
      action: 'View Reply',
      isUnread: false
    },
    {
      id: '6',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=180&h=180&fit=crop&crop=face',
      name: 'Priya Singh',
      role: 'Architect',
      roleType: 'gold',
      text: 'mentioned you in a post.',
      time: '5h ago',
      action: 'Open Post',
      isUnread: false
    },
    {
      id: '7',
      avatar: undefined,
      name: 'FutureFund Capital',
      role: '',
      roleType: 'gold',
      text: 'posted a new funding opportunity.',
      time: '1d ago',
      action: 'View Opportunity',
      isUnread: false
    },
    {
      id: '8',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&h=180&fit=crop&crop=face',
      name: 'Vikas Rao',
      role: 'Architect',
      roleType: 'blue',
      text: 'started following you.',
      time: '1d ago',
      action: 'View Profile',
      isUnread: false
    }
  ];

  return (
    <div className="nd-container">
      <div className="nd-left-sidebar">
        <div className="nd-logo">
          <div className="nd-logo-icon">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="logoGradNd" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#8B5CF6'}} />
                  <stop offset="100%" style={{stopColor: '#A78BFA'}} />
                </linearGradient>
              </defs>
              <polygon points="20,80 50,20 80,80" fill="url(#logoGradNd)" />
              <text x="50" y="72" textAnchor="middle" fill="#000" fontSize="28" fontWeight="800" fontFamily="Arial">T</text>
            </svg>
          </div>
          <span className="nd-logo-text">TRIVEON</span>
        </div>

        <div className="nd-messaging-header">
          <span className="nd-messaging-title">Notifications</span>
        </div>

        <nav className="nd-nav">
          <div className="nd-nav-item" onClick={() => navigate('/home')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
            <span>Home</span>
          </div>

          <div className={`nd-nav-item ${activeView === 'notifications' ? 'active' : ''}`} onClick={() => setActiveView('notifications')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            <span>Notifications</span>
          </div>
          <div className={`nd-nav-item ${activeView === 'connections' ? 'active' : ''}`} onClick={() => setActiveView('connections')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            <span>Connections</span>
            <span className="nd-badge">12</span>
          </div>
        </nav>
      </div>

      <div className="nd-main">
        <div className="nd-content">
          {activeView === 'notifications' ? (
            <div className="nd-main-col">
              <div className="nd-page-header">
                <h1 className="nd-page-title">All Notifications</h1>
                <div className="nd-mark-all-read" onClick={() => {}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                  Mark all as read
                </div>
              </div>

              <div className="nd-tabs">
                {['All', 'Unread', 'Important', 'Today', 'This Week', 'Earlier'].map(tab => (
                  <div key={tab} className={`nd-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                    {tab}
                    {tab === 'Unread' && <span className="nd-tab-badge">6</span>}
                  </div>
                ))}
              </div>

              <div className="nd-notifications-list">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`nd-notification-card ${notif.isUnread ? 'unread' : ''}`}>
                    {notif.isUnread && <div className="nd-unread-dot"></div>}
                    <div className="nd-notification-avatar">
                      {notif.avatar ? (
                        <img src={notif.avatar} alt={notif.name} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                      ) : (
                        <div className={`nd-avatar-initials ${notif.roleType}`}>
                          {notif.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="nd-notification-content">
                      <div className="nd-notification-header">
                        <div className="nd-notification-name">
                          <strong>{notif.name}</strong>
                          {notif.role && <span className={`nd-role-badge ${notif.roleType}`}>{notif.role}</span>}
                        </div>
                        <span className="nd-notification-time">{notif.time}</span>
                      </div>
                      <p className="nd-notification-text">{notif.text}</p>
                      {notif.action && (
                        <button className="nd-action-button">{notif.action}</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="nd-connections-view">
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
                  <button className="cd-filter-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="22 3 2 3 10 12.46V19 14 21 14 12.46L22 3" />
                    </svg>
                  </button>
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
                      <div className="cd-connection-extra">
                        <button className="cd-extra-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button className="cd-extra-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cd-load-more">
                  <span>Load more requests</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsDashboard;
