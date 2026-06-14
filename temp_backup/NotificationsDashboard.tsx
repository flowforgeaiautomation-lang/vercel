
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import AICopilot from './AICopilot';
import './NotificationsDashboard.css';

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

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

const NotificationsDashboard = () => {
  const { profile } = useAuth();
  const { userData } = useUser();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('All');
  const [activeCategory, setActiveCategory] = useState('all');
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState<'ARCHITECT' | 'EXPLORER' | 'CATALYST'>('ARCHITECT');
  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole');
    if (savedRole) {
      setUserRole(savedRole.toUpperCase() as 'ARCHITECT' | 'EXPLORER' | 'CATALYST');
    }
  }, []);

  const getUserName = () => {
    return userData?.profile?.name || profile?.name || "Umat Chaudhary";
  };

  const getUserRole = () => {
    return userData?.mainRole || profile?.role || "Investor";
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const notifications: Notification[] = [
    {
      id: '1',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&h=180&fit=crop&crop=face',
      name: 'Arjun Mehta',
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
        <div className="nd-logo" onClick={() => navigate('/home')}>
          <div className="nd-logo-icon">
            <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="logoGradNd" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#FFD700'}} />
                  <stop offset="100%" style={{stopColor:'#FFA500'}} />
                </linearGradient>
              </defs>
              <polygon points="20,80 50,20 80,80" fill="url(#logoGradNd)" />
              <text x="50" y="72" textAnchor="middle" fill="#000" fontSize="28" fontWeight="800" fontFamily="Arial">T</text>
            </svg>
          </div>
          <div className="nd-logo-text-group">
            <span className="nd-logo-text">TRIVEON</span>
            <span className="nd-logo-subtext">EXPLORER</span>
          </div>
        </div>

        <div className="nd-section-title">Notifications</div>

        <nav className="nd-nav">
          <div className={`nd-nav-item ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span>All Notifications</span>
            <div className="nd-badge">6</div>
          </div>
          <div className={`nd-nav-item ${activeCategory === 'important' ? 'active' : ''}`} onClick={() => setActiveCategory('important')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.88L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            <span>Important</span>
          </div>
          <div className={`nd-nav-item ${activeCategory === 'connections' ? 'active' : ''}`} onClick={() => setActiveCategory('connections')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span>Connections</span>
          </div>
          <div className={`nd-nav-item ${activeCategory === 'messages' ? 'active' : ''}`} onClick={() => setActiveCategory('messages')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>Messages</span>
            <div className="nd-badge">2</div>
          </div>
          <div className={`nd-nav-item ${activeCategory === 'startups' ? 'active' : ''}`} onClick={() => setActiveCategory('startups')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
            <span>Startups</span>
          </div>
          <div className={`nd-nav-item ${activeCategory === 'investments' ? 'active' : ''}`} onClick={() => setActiveCategory('investments')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            <span>Investments</span>
          </div>
          <div className={`nd-nav-item ${activeCategory === 'communities' ? 'active' : ''}`} onClick={() => setActiveCategory('communities')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span>Communities</span>
          </div>
          <div className={`nd-nav-item ${activeCategory === 'mentions' ? 'active' : ''}`} onClick={() => setActiveCategory('mentions')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>
            <span>Mentions</span>
          </div>
          <div className={`nd-nav-item ${activeCategory === 'saved' ? 'active' : ''}`} onClick={() => setActiveCategory('saved')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            <span>Saved Alerts</span>
          </div>
          <div className={`nd-nav-item ${activeCategory === 'archived' ? 'active' : ''}`} onClick={() => setActiveCategory('archived')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
            <span>Archived</span>
          </div>
        </nav>

        <div className="nd-copilot-card" onClick={() => setCopilotOpen(true)}>
          <div className="nd-copilot-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"></polygon>
            </svg>
          </div>
          <div className="nd-copilot-content">
            <strong>AI Copilot</strong>
            <span>Your smart assistant</span>
          </div>
        </div>
      </div>

      <div className="nd-main">
        <header className="feed-header">
          <div className="search-bar">
            <SearchIcon />
            <input type="text" placeholder="Search startups, people, investors, tools..." />
          </div>

          <div className="header-actions">
            <button className="create-signal-btn" onClick={() => navigate('/home')}>
              <span className="create-signal-icon">✨</span>
              <span className="create-signal-text">Create Signal</span>
              <span className="create-signal-subtext">Share an update with the ecosystem</span>
              <svg className="create-signal-arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>

            <button className="header-icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
            <button className="header-icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </button>
            <div className="profile-section" onClick={() => setProfileDrawerOpen(!profileDrawerOpen)}>
              <div className="user-avatar">
                {userData?.profile?.profileImage ? (
                  <img src={userData.profile.profileImage} alt={getUserName()} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                ) : (
                  getInitials(getUserName())
                )}
              </div>
              <div className="user-info">
                <div className="user-name">{getUserName()}</div>
                <div className="user-role">{getUserRole().charAt(0).toUpperCase() + getUserRole().slice(1).toLowerCase()}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="nd-content">
          <div className="nd-main-col">
            <div className="nd-page-header">
              <h1 className="nd-page-title">All Notifications</h1>
              <div className="nd-mark-all-read" onClick={() => {}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
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
        </div>
      </div>

      {profileDrawerOpen && (
        <div className="profile-drawer-overlay" onClick={() => setProfileDrawerOpen(false)}>
          <div className="profile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-avatar">
                {userData?.profile?.profileImage ? (
                  <img src={userData.profile.profileImage} alt={getUserName()} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                ) : (
                  getInitials(getUserName())
                )}
              </div>
              <div className="drawer-name">{getUserName()}</div>
              <div className="drawer-role">{getUserRole()}</div>
            </div>
            <div className="drawer-menu">
              <div className="drawer-item" onClick={() => navigate('/profile')}>Profile</div>
              <div className="drawer-item">Settings</div>
              <div className="drawer-item">Account</div>
              <div className="drawer-item">Upgradation</div>
              <div className="drawer-item">Support & Feedback</div>
              <div className="drawer-item divider">Log Out</div>
            </div>
          </div>
        </div>
      )}

      {copilotOpen && <AICopilot isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />}
    </div>
  );
};

export default NotificationsDashboard;


