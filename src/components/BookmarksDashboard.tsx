
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { usePosts } from '../contexts/PostContext';
import AICopilot from './AICopilot';
import './BookmarksDashboard.css';

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

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
  const { getSavedPosts, unsavePost, savedCollections, createCollection, addToCollection } = usePosts();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('All');
  const [activeNav, setActiveNav] = useState('all');
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

        <div className="bk-section-title">Bookmarks</div>

        <nav className="bk-nav">
          <div className={`bk-nav-item ${activeNav === 'all' ? 'active' : ''}`} onClick={() => setActiveNav('all')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            <span>All Saved</span>
            <div className="bk-badge">24</div>
          </div>
          <div className={`bk-nav-item ${activeNav === 'startups' ? 'active' : ''}`} onClick={() => setActiveNav('startups')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
            <span>Startups</span>
            <div className="bk-badge-small">10</div>
          </div>
          <div className={`bk-nav-item ${activeNav === 'investments' ? 'active' : ''}`} onClick={() => setActiveNav('investments')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            <span>Investments</span>
            <div className="bk-badge-small">6</div>
          </div>
          <div className={`bk-nav-item ${activeNav === 'people' ? 'active' : ''}`} onClick={() => setActiveNav('people')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span>People</span>
            <div className="bk-badge-small">7</div>
          </div>
          <div className={`bk-nav-item ${activeNav === 'posts' ? 'active' : ''}`} onClick={() => setActiveNav('posts')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>Posts & Signals</span>
            <div className="bk-badge-small">12</div>
          </div>
          <div className={`bk-nav-item ${activeNav === 'feedback' ? 'active' : ''}`} onClick={() => setActiveNav('feedback')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>Feedback & Reviews</span>
            <div className="bk-badge-small">3</div>
          </div>
          <div className={`bk-nav-item ${activeNav === 'articles' ? 'active' : ''}`} onClick={() => setActiveNav('articles')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            <span>Knowledge & Articles</span>
            <div className="bk-badge-small">5</div>
          </div>
          <div className={`bk-nav-item ${activeNav === 'marketplace' ? 'active' : ''}`} onClick={() => setActiveNav('marketplace')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span>Marketplace Listings</span>
            <div className="bk-badge-small">4</div>
          </div>
          <div className={`bk-nav-item ${activeNav === 'opportunities' ? 'active' : ''}`} onClick={() => setActiveNav('opportunities')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span>Opportunities</span>
            <div className="bk-badge-small">5</div>
          </div>
          <div className={`bk-nav-item ${activeNav === 'collections' ? 'active' : ''}`} onClick={() => setActiveNav('collections')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <span>Collections</span>
            <div className="bk-badge-small">6</div>
          </div>
          <div className={`bk-nav-item ${activeNav === 'archived' ? 'active' : ''}`} onClick={() => setActiveNav('archived')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
            <span>Archived</span>
            <div className="bk-badge-small">2</div>
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
        <header className="feed-header">
          <div className="search-bar">
            <SearchIcon />
            <input type="text" placeholder="Search startups, people, articles, investments..." />
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

        <div className="bk-content">
          <div className="bk-main-col">
            <div className="bk-page-header">
              <div className="bk-title">
                <h1>All Saved</h1>
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
              <div className="drawer-role">{getUserRole()}</div>
            </div>
            <div className="drawer-menu">
              <div className="drawer-item" onClick={() => navigate('/profile')}>Profile</div>
              <div className="drawer-item">Settings</div>
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
