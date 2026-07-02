import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import PrestigeStarBadge from './PrestigeStarBadge';
import './MessagesDashboard.css';

const getRoleColor = (role: string): string => {
  const roleUpperCase = role.toUpperCase();
  if (roleUpperCase === 'ARCHITECT') return '#FFD700';
  if (roleUpperCase === 'CATALYST') return '#00C896';
  if (roleUpperCase === 'EXPLORER') return '#06b6d4';
  return '#9CA3AF';
};

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

const MessagesDashboard = () => {
  const { profile } = useAuth();
  const { userData } = useUser();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'messages' | 'connections'>('messages');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole');
  }, []);

  return (
    <div className="md-container">
      <div className="md-left-sidebar">
        <div className="md-logo">
          <div className="md-logo-icon">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="logoGradMd" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#8B5CF6' }} />
                  <stop offset="100%" style={{ stopColor: '#A78BFA' }} />
                </linearGradient>
              </defs>
              <polygon points="20,80 50,20 80,80" fill="url(#logoGradMd)" />
              <text x="50" y="72" textAnchor="middle" fill="#000" fontSize="28" fontWeight="800" fontFamily="Arial">T</text>
            </svg>
          </div>
          <span className="md-logo-text">TRIARCORA</span>
        </div>

        <div className="md-messaging-header">
          <span className="md-messaging-title">Messaging</span>
        </div>

        <nav className="md-nav">
          <div className="md-nav-item" onClick={() => navigate('/home')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
            <span>Home</span>
          </div>
          <div className={`md-nav-item ${activeView === 'messages' ? 'active' : ''}`} onClick={() => setActiveView('messages')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            <span>Messages</span>
          </div>

          <div className={`md-nav-item ${activeView === 'connections' ? 'active' : ''}`} onClick={() => setActiveView('connections')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            <span>Connections</span>
            <span className="md-badge">12</span>
          </div>
        </nav>
      </div>

      <div className="md-main">
        <div className="md-content">
          {activeView === 'messages' ? (
            <>
              <div className="md-conversations-list">
                <div className="md-conversations-header">
                  <div className="md-conversations-search" style={{ opacity: 0.5, pointerEvents: 'none' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input type="text" placeholder="Search conversations" disabled />
                  </div>
                  <button className="md-filter-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46V19 14 21 14 12.46L22 3" /></svg>
                  </button>
                </div>

                <div className="md-pinned-section">
                  <span className="md-pinned-label">Pinned</span>
                </div>

                <div className="md-conversations-scroll">
                  <div className="md-conversation-item active">
                    <div className="md-conversation-avatar" style={{ background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)' }}>RS</div>
                    <div className="md-conversation-info">
                      <div className="md-conversation-name">
                        <strong>Riya Sharma</strong>
                        <span className="md-role-badge">Founder</span>
                      </div>
                      <div className="md-conversation-preview">Let's schedule a call tomorrow.</div>
                    </div>
                    <div className="md-conversation-meta">
                      <span className="md-time">10:30 AM</span>
                      <span className="md-unread-badge">3</span>
                    </div>
                  </div>

                  <div className="md-recent-label">Recent</div>

                  <div className="md-conversation-item">
                    <div className="md-conversation-avatar" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>FT</div>
                    <div className="md-conversation-info">
                      <div className="md-conversation-name">
                        <strong>Finovate Team</strong>
                        <span className="md-role-badge">Group</span>
                      </div>
                      <div className="md-conversation-preview">Unnati: Pitch deck updated</div>
                    </div>
                    <div className="md-conversation-meta">
                      <span className="md-time">9:45 AM</span>
                      <span className="md-unread-badge">3</span>
                    </div>
                  </div>

                  <div className="md-conversation-item">
                    <div className="md-conversation-avatar" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)' }}>UC</div>
                    <div className="md-conversation-info">
                      <div className="md-conversation-name">
                        <strong>Unnati Chaudhary</strong>
                        <span className="md-role-badge">Investor</span>
                      </div>
                      <div className="md-conversation-preview">Thanks! Looking forward.</div>
                    </div>
                    <div className="md-conversation-meta">
                      <span className="md-time">9:20 AM</span>
                      <span className="md-unread-badge">1</span>
                    </div>
                  </div>

                  <div className="md-conversation-item">
                    <div className="md-conversation-avatar" style={{ background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' }}>GO</div>
                    <div className="md-conversation-info">
                      <div className="md-conversation-name">
                        <strong>GreenOrbit</strong>
                        <span className="md-role-badge">Startup</span>
                      </div>
                      <div className="md-conversation-preview">Great progress team 🔥</div>
                    </div>
                    <div className="md-conversation-meta">
                      <span className="md-time">Yesterday</span>
                    </div>
                  </div>

                  <div className="md-conversation-item">
                    <div className="md-conversation-avatar" style={{ background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)' }}>MV</div>
                    <div className="md-conversation-info">
                      <div className="md-conversation-name">
                        <strong>Maya Verma</strong>
                        <span className="md-role-badge">Mentor</span>
                      </div>
                      <div className="md-conversation-preview">📎 Shared a resource</div>
                    </div>
                    <div className="md-conversation-meta">
                      <span className="md-time">Yesterday</span>
                    </div>
                  </div>

                  <div className="md-conversation-item">
                    <div className="md-conversation-avatar" style={{ background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)' }}>ES</div>
                    <div className="md-conversation-info">
                      <div className="md-conversation-name">
                        <strong>EduSphere Team</strong>
                        <span className="md-role-badge">Group</span>
                      </div>
                      <div className="md-conversation-preview">Priya: Noted, Thanks!</div>
                    </div>
                    <div className="md-conversation-meta">
                      <span className="md-time">Mon</span>
                    </div>
                  </div>

                  <div className="md-conversation-item">
                    <div className="md-conversation-avatar" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}>QR</div>
                    <div className="md-conversation-info">
                      <div className="md-conversation-name">
                        <strong>Quanta Robotics</strong>
                        <span className="md-role-badge">Startup</span>
                      </div>
                      <div className="md-conversation-preview">You: Let's connect this week.</div>
                    </div>
                    <div className="md-conversation-meta">
                      <span className="md-time">Mon</span>
                    </div>
                  </div>

                  <div className="md-conversation-item">
                    <div className="md-conversation-avatar" style={{ background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)' }}>NP</div>
                    <div className="md-conversation-info">
                      <div className="md-conversation-name">
                        <strong>Rahul Sharma</strong>
                        <span className="md-role-badge">Investor</span>
                      </div>
                      <div className="md-conversation-preview">📎 Deal analysis attached</div>
                    </div>
                    <div className="md-conversation-meta">
                      <span className="md-time">Sun</span>
                    </div>
                  </div>

                  <div className="md-load-more">
                    <span>Load more conversations</span>
                  </div>
                </div>
              </div>

              <div className="md-chat-area">
                <div className="md-chat-header">
                  <div className="md-chat-user">
                    <div className="md-chat-avatar" style={{ background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)' }}>RS</div>
                    <div className="md-chat-user-info">
                      <div className="md-chat-name">
                        <strong>Riya Sharma</strong>
                        <span className="md-chat-role">Founder</span>
                      </div>
                      <div className="md-chat-status">Nebula AI</div>
                    </div>
                  </div>
                  <div className="md-chat-actions">
                    <button className="md-chat-action">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    </button>
                    <button className="md-chat-action">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" /></svg>
                    </button>
                    <button className="md-chat-menu">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                    </button>
                  </div>
                </div>

                <div className="md-chat-date-label">
                  <span>Today</span>
                </div>

                <div className="md-chat-messages">
                  <div className="md-message md-message-sent">
                    <div className="md-message-bubble">
                      <div className="md-message-content">Hey Riya! 👋</div>
                      <div className="md-message-time">10:28 AM ✓✓</div>
                    </div>
                  </div>
                  <div className="md-message md-message-received">
                    <div className="md-chat-avatar-small" style={{ background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)' }}>RS</div>
                    <div className="md-message-bubble">
                      <div className="md-message-content">Loved your update on Nebula AI.</div>
                      <div className="md-message-time">10:29 AM</div>
                    </div>
                  </div>
                  <div className="md-message md-message-received">
                    <div className="md-chat-avatar-small" style={{ background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)' }}>RS</div>
                    <div className="md-message-bubble">
                      <div className="md-message-content">Thank you so much! 😊<br/>We're building something big.<br/>Excited to share more soon.</div>
                      <div className="md-message-time">10:30 AM</div>
                    </div>
                  </div>
                  <div className="md-message md-message-received">
                    <div className="md-chat-avatar-small" style={{ background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)' }}>RS</div>
                    <div className="md-message-bubble md-message-preview">
                      <div className="md-startup-preview">
                        <div className="md-startup-preview-img">
                          <div className="md-startup-preview-gradient"></div>
                        </div>
                        <div className="md-startup-preview-info">
                          <div className="md-startup-preview-name">
                            <strong>Nebula AI</strong>
                            <span className="md-preview-role">Startup</span>
                          </div>
                          <div className="md-startup-preview-desc">AI Copilot for Enterprise Automation</div>
                          <div className="md-startup-preview-meta">
                            <span className="md-preview-tag">Seed Stage</span>
                            <span className="md-preview-tag">India</span>
                          </div>
                          <button className="md-preview-btn">View Startup</button>
                        </div>
                      </div>
                      <div className="md-message-time">10:31 AM</div>
                    </div>
                  </div>
                  <div className="md-message md-message-sent">
                    <div className="md-message-bubble">
                      <div className="md-message-content">Looks amazing! Let's connect this week.</div>
                      <div className="md-message-time">10:32 AM ✓✓</div>
                    </div>
                  </div>
                  <div className="md-message-seen">
                    <span>Seen 10:32 AM</span>
                  </div>
                </div>

                <div className="md-chat-input-area">
                  <textarea placeholder="Message..."></textarea>
                  <div className="md-chat-input-actions">
                    <button className="md-input-action">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48z" /></svg>
                    </button>
                    <button className="md-input-action">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                    </button>
                    <button className="md-input-action">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    </button>
                    <button className="md-input-action">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.2 9.2a1 1 0 0 0-1.4-1.4 4 4 0 0 1-5.6 0 1 1 0 0 0-1.4 1.4 6 6 0 0 0 8.4 0z" /><path d="M21 10v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10" /><path d="M7 10V5a5 5 0 0 1 10 0v5" /></svg>
                    </button>
                    <button className="md-input-action">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="2" /><line x1="12" y1="22" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="4.93" y2="4.93" /><line x1="19.07" y1="19.07" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="2" y2="12" /><line x1="22" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="4.93" y2="19.07" /><line x1="19.07" y1="4.93" x2="19.78" y2="4.22" /></svg>
                    </button>
                    <button className="md-send-btn">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="md-connections-view">
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
                      className={`cd-tab ${activeTab === 'all' && tab === 'All' ? 'active' : ''}`} 
                      onClick={() => setActiveTab(tab.toLowerCase())}
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

export default MessagesDashboard;
