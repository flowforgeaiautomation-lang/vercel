import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePost from './CreatePost';
import './HomeDashboard.css';

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const CompassIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
  </svg>
);

const RocketIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const BookmarkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

const ImageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const BarChartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

const TagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const CommentIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"></line>
    <polyline points="5 12 12 5 19 12"></polyline>
  </svg>
);

const HomeDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('for-you');
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [userRole, setUserRole] = useState<'ARCHITECT' | 'EXPLORER' | 'CATALYST'>('ARCHITECT');
  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole');
    if (savedRole) {
      setUserRole(savedRole.toUpperCase() as 'ARCHITECT' | 'EXPLORER' | 'CATALYST');
    }
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <aside className={`left-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-brand" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <div className="brand-logo-v">V</div>
            {!sidebarCollapsed && <span className="brand-name">TRIVEON</span>}
          </div>

          <nav className="sidebar-nav">
            <div className="nav-item active">
              <HomeIcon />
              {!sidebarCollapsed && <span>Home</span>}
            </div>
            <div className="nav-item">
              <CompassIcon />
              {!sidebarCollapsed && <span>Explore</span>}
            </div>
            <div className="nav-item">
              <RocketIcon />
              {!sidebarCollapsed && <span>Startups</span>}
            </div>
            <div className="nav-item">
              <UsersIcon />
              {!sidebarCollapsed && <span>Investors</span>}
            </div>
            <div className="nav-item">
              <MessageIcon />
              {!sidebarCollapsed && <span>Messages</span>}
            </div>
            <div className="nav-item">
              <BookmarkIcon />
              {!sidebarCollapsed && <span>Bookmarks</span>}
            </div>
            <div className="nav-item">
              <BellIcon />
              {!sidebarCollapsed && <span>Notifications</span>}
            </div>
            <div className="nav-item" onClick={() => navigate('/profile')}>
              <UserIcon />
              {!sidebarCollapsed && <span>Profile</span>}
            </div>
          </nav>

          {!sidebarCollapsed && (
            <div className="sidebar-promo-card">
              <div className="promo-content">
                <h4>Build. Accelerate. Ascend.</h4>
                <p>The ecosystem where ideas become ventures.</p>
                <div className="promo-artifact">
                  <div className="crystal-glow"></div>
                </div>
                <button className="promo-cta">Create Startup</button>
              </div>
            </div>
          )}
        </aside>

        <main className="center-feed">
          <header className="feed-header">
            <div className="search-bar">
              <SearchIcon />
              <input type="text" placeholder="Search startups, people, ideas…" />
              <SearchIcon />
            </div>

            <div className="profile-section" onClick={() => setProfileDrawerOpen(!profileDrawerOpen)}>
              <div className="notification-badge">
                <BellIcon />
              </div>
              <div className="user-avatar">AP</div>
              <div className="user-info">
                <div className="user-name">Arjun Patel</div>
                <div className="user-role">Architect</div>
              </div>
              <div className="dropdown-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </header>

          <div className="premium-create-card">
            <button className="create-signal-button" onClick={() => setCreatePostOpen(true)}>
              <div className="button-icon">🚀</div>
              <div className="button-text">
                <span className="button-title">Create Signal</span>
                <span className="button-subtitle">Share an update with the ecosystem</span>
              </div>
              <svg className="button-arrow" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

          <div className="feed-tabs">
            <div className={`tab ${activeTab === 'for-you' ? 'active' : ''}`} onClick={() => setActiveTab('for-you')}>
              For You
            </div>
            <div className={`tab ${activeTab === 'following' ? 'active' : ''}`} onClick={() => setActiveTab('following')}>
              Following
            </div>
            <div className={`tab ${activeTab === 'trending' ? 'active' : ''}`} onClick={() => setActiveTab('trending')}>
              Trending
            </div>
            <div className={`tab ${activeTab === 'top-startups' ? 'active' : ''}`} onClick={() => setActiveTab('top-startups')}>
              Top Startups
            </div>
          </div>

          <div className="feed-posts">
            <article className="feed-post">
              <div className="post-header">
                <div className="post-author">
                  <div className="author-avatar">RS</div>
                  <div className="author-info">
                    <div className="author-name">
                      Riya Sharma
                      <span className="role-badge gold">Architect</span>
                    </div>
                    <div className="post-time">2h ago</div>
                  </div>
                </div>
              </div>
              
              <div className="post-content">
                <h3 className="post-title">Building Nebula AI — Your AI Co-Founder for Smarter Startups</h3>
                <div className="post-tags">
                  <span className="post-tag">#ArtificialIntelligence</span>
                </div>
                <p className="post-text">
                  We're building an AI co-founder that helps early-stage teams validate ideas, build strategies, and ship products faster. Looking for feedback from the community!
                </p>
                <div className="post-image nebula-image">
                  <div className="stars">
                    {[...Array(50)].map((_, i) => (
                      <div 
                        key={i} 
                        className="star" 
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          width: `${Math.random() * 3 + 1}px`,
                          height: `${Math.random() * 3 + 1}px`,
                          animationDelay: `${Math.random() * 3}s`,
                          opacity: Math.random() * 0.5 + 0.5
                        }}
                      />
                    ))}
                  </div>
                  <div className="nebula-cloud nebula-cloud-1"></div>
                  <div className="nebula-cloud nebula-cloud-2"></div>
                  <div className="nebula-cloud nebula-cloud-3"></div>
                  <div className="planet-atmosphere"></div>
                  <div className="nebula-planet"></div>
                  <div className="planet-ring"></div>
                  <div className="nebula-text">NEBULA AI</div>
                  <div className="image-gradient"></div>
                </div>
              </div>

              <div className="post-actions">
                <div className="post-action">
                  <HeartIcon />
                  <span>126</span>
                </div>
                <div className="post-action">
                  <CommentIcon />
                  <span>34</span>
                </div>
                <div className="post-action">
                  <ShareIcon />
                  <span>Share</span>
                </div>
              </div>
            </article>

            <article className="feed-post">
              <div className="post-header">
                <div className="post-author">
                  <div className="author-avatar">AM</div>
                  <div className="author-info">
                    <div className="author-name">
                      Arjun Malhotra
                      <span className="role-badge green">Catalyst</span>
                    </div>
                    <div className="post-time">5h ago</div>
                  </div>
                </div>
              </div>
              
              <div className="post-content">
                <h3 className="post-title">Looking for Fintech Startups in Seed Stage</h3>
                <div className="post-tags">
                  <span className="post-tag">#FundingRequest</span>
                </div>
                <p className="post-text">
                  We are actively investing in fintech startups solving real-world problems in India and SE Asia.
                </p>
                <div className="investor-metrics">
                  <div className="metric-tag">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 7h-3a2 2 0 0 1-2-2V2"></path>
                      <path d="M20 17h-3a2 2 0 0 0-2 2v3"></path>
                      <path d="M4 7h3a2 2 0 0 0 2-2V2"></path>
                      <path d="M4 17h3a2 2 0 0 1 2 2v3"></path>
                    </svg>
                    <span>Stage</span>
                    <span className="metric-value">Seed</span>
                  </div>
                  <div className="metric-tag">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>Ticket Size</span>
                    <span className="metric-value">$250K - $1M</span>
                  </div>
                  <div className="metric-tag">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>Focus</span>
                    <span className="metric-value">Fintech, SaaS, Infra</span>
                  </div>
                </div>
              </div>

              <div className="post-actions">
                <div className="post-action">
                  <HeartIcon />
                  <span>89</span>
                </div>
                <div className="post-action">
                  <CommentIcon />
                  <span>23</span>
                </div>
                <div className="post-action">
                  <ShareIcon />
                  <span>Share</span>
                </div>
              </div>
            </article>

            <article className="feed-post">
              <div className="post-header">
                <div className="post-author">
                  <div className="author-avatar">KM</div>
                  <div className="author-info">
                    <div className="author-name">
                      Kabir Mehta
                      <span className="role-badge cyan">Explorer</span>
                    </div>
                    <div className="post-time">7h ago</div>
                  </div>
                </div>
              </div>
              
              <div className="post-content">
                <h3 className="post-title">Thoughts on the future of Web3 Social?</h3>
                <div className="post-tags">
                  <span className="post-tag">#Insight #Thought</span>
                </div>
                <p className="post-text">
                  Curious to know what builders and investors think about the next wave of decentralized social platforms.
                </p>
              </div>

              <div className="post-actions">
                <div className="post-action">
                  <HeartIcon />
                  <span>64</span>
                </div>
                <div className="post-action">
                  <CommentIcon />
                  <span>18</span>
                </div>
                <div className="post-action">
                  <ShareIcon />
                  <span>Share</span>
                </div>
              </div>
            </article>
          </div>
        </main>

        <aside className="right-sidebar">
          <div className="signal-card">
            <div className="card-header">
              <h4>Today's Signal</h4>
              <span className="view-all">View all</span>
            </div>
            <div className="signal-items">
              <div className="signal-item">
                <div className="signal-dot gold"></div>
                <div className="signal-text">Sequoia India invests in healthtech startup Niramai</div>
              </div>
              <div className="signal-item">
                <div className="signal-dot green"></div>
                <div className="signal-text">AI tools market to reach $126B by 2025</div>
              </div>
              <div className="signal-item">
                <div className="signal-dot purple"></div>
                <div className="signal-text">Web3 funding increased 42% this quarter</div>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-header">
              <h4>Ecosystem Overview</h4>
            </div>
            <div className="overview-metrics">
              <div className="overview-metric">
                <div className="metric-label">Startups</div>
                <div className="metric-value-row">
                  <span className="metric-number">2,451</span>
                  <span className="metric-change positive">
                    <ArrowUpIcon />
                    +12%
                  </span>
                </div>
                <div className="metric-chart gold-chart"></div>
              </div>
              <div className="overview-metric">
                <div className="metric-label">Active Investors</div>
                <div className="metric-value-row">
                  <span className="metric-number">523</span>
                  <span className="metric-change positive">
                    <ArrowUpIcon />
                    +8%
                  </span>
                </div>
                <div className="metric-chart green-chart"></div>
              </div>
              <div className="overview-metric">
                <div className="metric-label">Community Members</div>
                <div className="metric-value-row">
                  <span className="metric-number">18,732</span>
                  <span className="metric-change positive">
                    <ArrowUpIcon />
                    +15%
                  </span>
                </div>
                <div className="metric-chart purple-chart"></div>
              </div>
              <div className="overview-metric">
                <div className="metric-label">Capital Deployed</div>
                <div className="metric-value-row">
                  <span className="metric-number">$42.6M</span>
                  <span className="metric-change positive">
                    <ArrowUpIcon />
                    +18%
                  </span>
                </div>
                <div className="metric-chart gold-chart"></div>
              </div>
            </div>
            <button className="view-report-btn">View full report →</button>
          </div>

          <div className="trending-card">
            <div className="card-header">
              <h4>Trending Startups</h4>
              <span className="view-all">View all</span>
            </div>
            <div className="trending-startups">
              <div className="trending-item">
                <div className="startup-icon purple">N</div>
                <div className="startup-info">
                  <div className="startup-name">Nebula AI</div>
                  <div className="startup-sub">AI Co-Founder Platform</div>
                </div>
                <div className="startup-rating">
                  <span>★</span>
                  <span>4.8</span>
                </div>
              </div>
              <div className="trending-item">
                <div className="startup-icon cyan">C</div>
                <div className="startup-info">
                  <div className="startup-name">ClipPay</div>
                  <div className="startup-sub">Fintech Infrastructure</div>
                </div>
                <div className="startup-rating">
                  <span>★</span>
                  <span>4.6</span>
                </div>
              </div>
              <div className="trending-item">
                <div className="startup-icon green">G</div>
                <div className="startup-info">
                  <div className="startup-name">GreenGrid</div>
                  <div className="startup-sub">Clean Energy Tech</div>
                </div>
                <div className="startup-rating">
                  <span>★</span>
                  <span>4.7</span>
                </div>
              </div>
              <div className="trending-item">
                <div className="startup-icon gold">S</div>
                <div className="startup-info">
                  <div className="startup-name">Shopora</div>
                  <div className="startup-sub">E-commerce Platform</div>
                </div>
                <div className="startup-rating">
                  <span>★</span>
                  <span>4.5</span>
                </div>
              </div>
              <div className="trending-item">
                <div className="startup-icon blue">H</div>
                <div className="startup-info">
                  <div className="startup-name">HealthyAI</div>
                  <div className="startup-sub">AI Health Assistant</div>
                </div>
                <div className="startup-rating">
                  <span>★</span>
                  <span>4.6</span>
                </div>
              </div>
            </div>
          </div>

          <div className="follow-card">
            <div className="card-header">
              <h4>Who to Follow</h4>
              <span className="view-all">View all</span>
            </div>
            <div className="follow-users">
              <div className="follow-user">
                <div className="follow-avatar">RS</div>
                <div className="follow-info">
                  <div className="follow-name">Riya Sharma</div>
                  <div className="follow-role">Architect</div>
                </div>
                <button className="follow-btn">Follow</button>
              </div>
              <div className="follow-user">
                <div className="follow-avatar">AM</div>
                <div className="follow-info">
                  <div className="follow-name">Arjun Malhotra</div>
                  <div className="follow-role">Catalyst</div>
                </div>
                <button className="follow-btn">Follow</button>
              </div>
              <div className="follow-user">
                <div className="follow-avatar">KM</div>
                <div className="follow-info">
                  <div className="follow-name">Kabir Mehta</div>
                  <div className="follow-role">Explorer</div>
                </div>
                <button className="follow-btn">Follow</button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {profileDrawerOpen && (
        <div className="profile-drawer-overlay" onClick={() => setProfileDrawerOpen(false)}>
          <div className="profile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-avatar">AP</div>
              <div className="drawer-name">Arjun Patel</div>
              <div className="drawer-role">Architect</div>
            </div>
            <div className="drawer-menu">
              <div className="drawer-item">Profile Settings</div>
              <div className="drawer-item">Account</div>
              <div className="drawer-item">Billing</div>
              <div className="drawer-item">Help Center</div>
              <div className="drawer-item divider">Log Out</div>
            </div>
          </div>
        </div>
      )}

      {createPostOpen && (
        <CreatePost 
          role={userRole} 
          onClose={() => setCreatePostOpen(false)} 
        />
      )}
    </div>
  );
};

export default HomeDashboard;
