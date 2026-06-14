
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { usePosts } from '../contexts/PostContext';
import AICopilot from './AICopilot';
import './BookmarksDashboard.css';
import PrestigeStarBadge from './PrestigeStarBadge';

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

const getRoleColor = (role: string): string => {
  const roleUpperCase = role.toUpperCase();
  if (roleUpperCase === 'ARCHITECT') return '#FFD700';
  if (roleUpperCase === 'CATALYST') return '#00C896';
  if (roleUpperCase === 'EXPLORER') return '#06b6d4';
  return '#9CA3AF';
};

interface Bookmark {
  id: string;
  avatar?: string;
  name: string;
  role: string;
  roleType: 'gold' | 'green' | 'blue' | 'purple';
  text: string;
  time: string;
  folder: string;
  action: string;
}

const BookmarksDashboard = () => {
  const { profile } = useAuth();
  const { userData } = useUser();
  const { getSavedPosts, unsavePost, savedCollections, createCollection, addToCollection, demoUsers } = usePosts();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('All');
  const [activeNav, setActiveNav] = useState('all');
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState<'ARCHITECT' | 'EXPLORER' | 'CATALYST'>('ARCHITECT');
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [discoverDropdownOpen, setDiscoverDropdownOpen] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole');
    if (savedRole) {
      setUserRole(savedRole.toUpperCase() as 'ARCHITECT' | 'EXPLORER' | 'CATALYST');
    }
  }, []);

  // Close discover dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setDiscoverDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getUserName = () => {
    return userData?.profile?.name || profile?.name || "Unnati Chaudhary";
  };

  const getUserRole = () => {
    return userData?.mainRole || profile?.role || "Explorer";
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const savedPosts = getSavedPosts();

  return (
    <div className="bk-container">
      <div className="bk-left-sidebar">
        <div className="bk-logo" onClick={() => navigate('/home')}>
          <div className="bk-logo-icon">
            <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="logoGradBk" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#FFD700'}} />
                  <stop offset="100%" style={{stopColor:'#FFA500'}} />
                </linearGradient>
              </defs>
              <polygon points="20,80 50,20 80,80" fill="url(#logoGradBk)" />
              <text x="50" y="72" textAnchor="middle" fill="#000" fontSize="28" fontWeight="800" fontFamily="Arial">T</text>
            </svg>
          </div>
          <span className="bk-logo-text">TRIVEON</span>
        </div>

        <div className="bk-section-title">Vault</div>

        <nav className="bk-nav">
          <div className="bk-nav-item" onClick={() => navigate('/home')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
            <span>Home</span>
          </div>
          <div className="bk-nav-item" onClick={() => navigate('/startups')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            <span>Architects</span>
          </div>
          <div className="bk-nav-item" onClick={() => navigate('/investors')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            <span>Catalysts</span>
          </div>
          <div className="bk-nav-item" onClick={() => navigate('/explorers')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>
            <span>Explorers</span>
          </div>
          <div className="bk-nav-item" onClick={(e) => {
                      e.stopPropagation();
                      setDiscoverDropdownOpen(!discoverDropdownOpen);
                    }}>
            <SearchIcon />
            <span>Discover</span>
            <svg 
                      className={`discover-chevron ${discoverDropdownOpen ? 'open' : ''}`}
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                    {discoverDropdownOpen && (
                      <div className="discover-dropdown-content">
                        <div 
                        className="discover-dropdown-item"
                        onClick={() => {
                          setDiscoverDropdownOpen(false);
                          navigate('/atlas');
                        }}
                      >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                          <span>Atlas</span>
                        </div>
                        <div 
                          className="discover-dropdown-item"
                          style={{ opacity: 0.6, cursor: 'not-allowed' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Don't navigate, just keep dropdown open
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                          <span>Exchange</span>
                          <span style={{ 
                            fontSize: '0.65rem', 
                            padding: '3px 8px', 
                            background: 'rgba(255,215,0,0.15)', 
                            color: '#FFD700', 
                            borderRadius: '999px',
                            fontWeight: 600
                          }}>Soon</span>
                        </div>
                        <div 
                          className="discover-dropdown-item"
                          style={{ opacity: 0.6, cursor: 'not-allowed' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Don't navigate, just keep dropdown open
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                          <span>Circles</span>
                          <span style={{ 
                            fontSize: '0.65rem', 
                            padding: '3px 8px', 
                            background: 'rgba(255,215,0,0.15)', 
                            color: '#FFD700', 
                            borderRadius: '999px',
                            fontWeight: 600
                          }}>Soon</span>
                        </div>
                        <div 
                          className="discover-dropdown-item"
                          onClick={() => {
                            setDiscoverDropdownOpen(false);
                            navigate('/insights');
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"></path><path d="m19 9 12 16 5 9"></path></svg>
                          <span>Insights</span>
                        </div>
                      </div>
                    )}
          </div>
        </nav>

        <div className="bk-copilot-card" onClick={() => setCopilotOpen(true)}>
          <div className="bk-copilot-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"></polygon>
            </svg>
          </div>
          <div className="bk-copilot-content">
            <strong>AI Copilot</strong>
            <span>Find, summarize & organize your saves</span>
          </div>
          <button className="bk-copilot-btn">Ask AI Copilot</button>
        </div>
      </div>

      <div className="bk-main">
        <div className="bk-content">
          <div className="bk-main-col">
            <div className="bk-page-header">
              <div className="bk-title">
                <h1>Vault</h1>
                <p>Everything you've bookmarked across the ecosystem.</p>
              </div>
            </div>

            <div className="bk-filters">
              <div className="bk-tabs">
                {['All', 'Recent', 'Important', 'Startups', 'Investments', 'People', 'Posts', 'Articles', 'Opportunities'].map(tab => (
                  <div key={tab} className={`bk-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                    {tab}
                  </div>
                ))}
              </div>
              <div className="bk-sort">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="3" y1="6" x2="3" y2="6"></line><line x1="12" y1="12" x2="21" y2="12"></line><line x1="3" y1="12" x2="3" y2="12"></line><line x1="16" y1="18" x2="21" y2="18"></line><line x1="3" y1="18" x2="3" y2="18"></line></svg>
                <span>Newest</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>

            <div className="bk-bookmarks-list">
              {savedPosts.length === 0 ? (
                <div className="bk-end-message" style={{ padding: '4rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'block' }}>No saved posts yet</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Save posts you want to revisit later</span>
                </div>
              ) : (
                savedPosts.map((post) => (
                  <div key={post.id} className="bk-bookmark-card">
                    <div className="bk-bookmark-avatar">
                      {post.userAvatar ? (
                        <img src={post.userAvatar} alt={post.userName} style={{width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover'}} />
                      ) : (
                        <div className={`bk-avatar-initials ${
                          post.userRole === 'ARCHITECT' ? 'gold' : 
                          post.userRole === 'CATALYST' ? 'green' : 'blue'
                        }`}>
                          {getInitials(post.userName)}
                        </div>
                      )}
                    </div>
                    <div className="bk-bookmark-content">
                      <div className="bk-bookmark-header">
                        <div className="bk-bookmark-name">
                            <strong>{post.userName}</strong>
                            {post.userRole && (
                              <span className={`bk-role-badge ${
                                post.userRole === 'ARCHITECT' ? 'gold' : 
                                post.userRole === 'CATALYST' ? 'green' : 'blue'
                              }`}>
                                {post.userRole === 'ARCHITECT' ? 'Architect' : 
                                 post.userRole === 'CATALYST' ? 'Catalyst' : 'Explorer'}
                              </span>
                            )}
                            {demoUsers[post.userId]?.prestigeSystem && (
                              <PrestigeStarBadge
                                starId={demoUsers[post.userId].prestigeSystem.currentStarId}
                                size="small"
                                color={getRoleColor(post.userRole)}
                              />
                            )}
                          </div>
                        <div className="bk-bookmark-actions">
                          <button 
                            className="bk-action-btn" 
                            onClick={() => unsavePost(post.id)}
                            style={{ background: 'rgba(255,100,100,0.2)', color: '#ff6b6b' }}
                          >
                            Unsave
                          </button>
                          <button className="bk-more-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                          </button>
                        </div>
                      </div>
                      <p className="bk-bookmark-text">{post.description}</p>
                      <div className="bk-bookmark-meta">
                        <span className="bk-time">{getTimeAgo(post.timestamp)}</span>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: 'auto' }}>
                          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                            👏 {post.likes}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                            💬 {post.comments.length}
                          </span>
                        </div>
                      </div>
                      {post.tags.length > 0 && (
                        <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {post.tags.map(tag => (
                            <span key={tag} style={{ 
                              fontSize: '0.75rem', 
                              padding: '0.25rem 0.75rem', 
                              background: 'rgba(255,215,0,0.1)', 
                              color: '#FFD700', 
                              borderRadius: '999px' 
                            }}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              
              {savedPosts.length > 0 && (
                <div className="bk-end-message">
                  <span>That's all your saved items ✨</span>
                </div>
              )}
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
              <div className="drawer-item">Support&Feedback</div>
              <div className="drawer-item divider">Log Out</div>
            </div>
          </div>
        </div>
      )}

      {copilotOpen && <AICopilot isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />}
    </div>
  );
};

export default BookmarksDashboard;
