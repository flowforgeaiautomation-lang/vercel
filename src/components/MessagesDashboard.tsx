import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { UserProfile, usePosts } from '../contexts/PostContext';
import AICopilot from './AICopilot';
import PrestigeStarBadge from './PrestigeStarBadge';
import './MessagesDashboard.css';

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const getRoleColor = (role: string): string => {
  const roleUpperCase = role.toUpperCase();
  if (roleUpperCase === 'ARCHITECT') return '#FFD700';
  if (roleUpperCase === 'CATALYST') return '#00C896';
  if (roleUpperCase === 'EXPLORER') return '#06b6d4';
  return '#9CA3AF';
};

const MessagesDashboard = () => {
  const { profile } = useAuth();
  const { userData } = useUser();
  const { demoUsers } = usePosts();
  const navigate = useNavigate();
  const [activeConversation, setActiveConversation] = useState('all');
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState<'ARCHITECT' | 'EXPLORER' | 'CATALYST'>('EXPLORER');
  const [viewProfilePopUp, setViewProfilePopUp] = useState<UserProfile | null>(null);
  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole');
    if (savedRole) {
      setUserRole('EXPLORER');
    }
  }, []);

  const getUserName = () => {
    return userData?.profile?.name || profile?.name || 'Jimit Chaudhary';
  };

  const getUserRole = () => {
    return userData?.mainRole || profile?.role || 'Explorer';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserProfileImage = () => {
    if (userData?.profile?.profileImage) {
      return userData.profile.profileImage;
    }
    const defaultImages: Record<string, string> = {
      ARCHITECT: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&h=180&fit=crop&crop=face',
      CATALYST: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=180&h=180&fit=crop&crop=face',
      EXPLORER: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=180&h=180&fit=crop&crop=face'
    };
    return defaultImages[userRole] || defaultImages['EXPLORER'];
  };

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
          <span className="md-logo-text">TRIVEON</span>
        </div>

        <div className="md-messaging-header">
          <span className="md-messaging-title">Messaging</span>
        </div>

        <nav className="md-nav">
          <div className="md-nav-item" onClick={() => navigate('/home')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
            <span>Home</span>
          </div>
          <div className="md-nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            <span>Signals</span>
          </div>
          <div className="md-nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            <span>Circles</span>
          </div>
          <div className="md-nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            <span>Connections</span>
          </div>
        </nav>

        <div className="md-copilot-card" onClick={() => setCopilotOpen(true)}>
          <div className="md-copilot-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" /></svg>
          </div>
          <div className="md-copilot-content">
            <strong>AI Copilot</strong>
            <span>Your messaging assistant</span>
          </div>
          <button className="md-copilot-btn">Ask AI Copilot</button>
        </div>
      </div>

      <div className="md-main">
        <header className="md-feed-header">
          <div className="md-search-bar">
            <SearchIcon />
            <input type="text" placeholder="Search messages, people, startups..." />
          </div>

          <div className="md-user-section" onClick={() => setProfileDrawerOpen(!profileDrawerOpen)}>
            <div className="md-user-avatar">
              {userData?.profile?.profileImage ? (
                <img src={getUserProfileImage()} alt={getUserName()} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                getInitials(getUserName())
              )}
            </div>
          </div>
        </header>

        <div className="md-content">
          <div className="md-conversations-list">
            <div className="md-conversations-header">
              <div className="md-conversations-search">
                <SearchIcon />
                <input type="text" placeholder="Search conversations" />
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
                  <div className="md-conversation-preview">Arjun: Pitch deck updated</div>
                </div>
                <div className="md-conversation-meta">
                  <span className="md-time">9:45 AM</span>
                  <span className="md-unread-badge">3</span>
                </div>
              </div>

              <div className="md-conversation-item">
                <div className="md-conversation-avatar" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)' }}>AM</div>
                <div className="md-conversation-info">
                  <div className="md-conversation-name">
                    <strong>Arjun Mehta</strong>
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
                    <strong>Neeraj Patel</strong>
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
                <button className="md-view-profile" onClick={() => setViewProfilePopUp({
                  userId: 'demo-1',
                  userName: 'Riya Sharma',
                  userRole: 'ARCHITECT',
                  userTitle: 'Founder & CEO @ Nebula AI',
                  userBio: 'Passionate entrepreneur building the future of AI-powered startup tools. Previously at Google and Stripe.',
                  userLocation: 'San Francisco, CA',
                  userLinks: { linkedin: 'linkedin.com/in/riyasharma', website: 'nebula.ai' },
                  userCredibility: {
                    score: 92,
                    startups: 2,
                    verified: true,
                    years: 5,
                    companies: 3
                  },
                  stats: { followers: 1240, following: 320, endorsements: 89 },
                  tags: ['AI', 'Fintech', 'SaaS'],
                  prestigeSystem: {
                    currentStarId: 7,
                    currentStarName: 'VEGA',
                    progressPercent: 30
                  }
                })}>
                  View Profile
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
        </div>
      </div>

      {profileDrawerOpen && (
        <div className="profile-drawer-overlay" onClick={() => setProfileDrawerOpen(false)}>
          <div className="profile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-avatar">
                {userData?.profile?.profileImage ? (
                  <img src={getUserProfileImage()} alt={getUserName()} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  getInitials(getUserName())
                )}
              </div>
              <div className="drawer-name">{getUserName()}</div>
              <div className="drawer-role">
                <span className={`role-badge ${getUserRole() === 'ARCHITECT' ? 'gold' : getUserRole() === 'CATALYST' ? 'green' : 'cyan'}`}>
                  {getUserRole().charAt(0).toUpperCase() + getUserRole().slice(1).toLowerCase()}
                </span>
                {userData?.prestigeSystem && (
                  <PrestigeStarBadge
                    starId={userData.prestigeSystem.currentStarId}
                    size="small"
                    color={getRoleColor(getUserRole())}
                  />
                )}
              </div>
            </div>
            <div className="drawer-menu">
              <div className="drawer-item" onClick={() => navigate('/profile')}>Profile</div>
              <div className="drawer-item" onClick={() => navigate('/settings')}>Settings</div>
              <div className="drawer-item">Account</div>
              <div className="drawer-item">Upgradation</div>
              <div className="drawer-item">Support & Feedback</div>
              <div className="drawer-item divider">Log Out</div>
            </div>
          </div>
        </div>
      )}

      {copilotOpen && <AICopilot isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />}

      {viewProfilePopUp && (
        <div className="profile-drawer-overlay" onClick={() => setViewProfilePopUp(null)} style={{ zIndex: 1000 }}>
          <div className="profile-drawer" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%', backgroundColor: '#0a0e1a', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '16px' }}>
            <button onClick={() => setViewProfilePopUp(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.5rem', zIndex: 10 }}>×</button>
            <div style={{ padding: '2rem 1.5rem 1.5rem', textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #B8860B, #DAA520)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                  {viewProfilePopUp.userAvatar ? (
                    <img src={viewProfilePopUp.userAvatar} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} alt="" />
                  ) : getInitials(viewProfilePopUp.userName)}
                </div>
              </div>
              <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                <span className={`role-badge ${viewProfilePopUp.userRole === 'ARCHITECT' ? 'gold' : viewProfilePopUp.userRole === 'CATALYST' ? 'green' : 'cyan'}`}>
                  {viewProfilePopUp.userRole.charAt(0).toUpperCase() + viewProfilePopUp.userRole.slice(1).toLowerCase()}
                </span>
                {viewProfilePopUp.prestigeSystem && (
                  <PrestigeStarBadge
                    starId={viewProfilePopUp.prestigeSystem.currentStarId}
                    size="small"
                    color={getRoleColor(viewProfilePopUp.userRole)}
                  />
                )}
              </div>
              <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, marginBottom: '0.3rem' }}>{viewProfilePopUp.userName}</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '1.5rem' }}>{viewProfilePopUp.userTitle}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesDashboard;
