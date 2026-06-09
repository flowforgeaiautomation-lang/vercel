import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import CreatePost from './CreatePost';
import './HomeDashboard.css';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import PrestigeStarBadge from './PrestigeStarBadge';
import AICopilot from './AICopilot';
import PostMenu from './PostMenu';

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

const getRoleColor = (role: string): string => {
  const roleUpperCase = role.toUpperCase();
  if (roleUpperCase === 'ARCHITECT') return '#FFD700';
  if (roleUpperCase === 'CATALYST') return '#00C896';
  if (roleUpperCase === 'EXPLORER') return '#06b6d4';
  return '#9CA3AF';
};

const HomeDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('following');
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [showEcosystemOverview, setShowEcosystemOverview] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [discoverDropdownOpen, setDiscoverDropdownOpen] = useState(false);
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { userData } = useUser();
  const { logout } = useAuth();
  const { posts, demoUsers, likePost, addComment, savePost, unsavePost, savedPosts } = usePosts();
  const feedPosts = posts;
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [animatingPostId, setAnimatingPostId] = useState<string | null>(null);

  const handleLikePost = (postId: string) => {
    setAnimatingPostId(postId);
    likePost(postId, userData?.uid || 'current-user');
    setTimeout(() => setAnimatingPostId(null), 600);
  };

  const handleSubmitComment = (postId: string) => {
    if (commentText.trim()) {
      addComment(postId, {
        id: Date.now().toString(),
        userId: userData?.uid || 'current-user',
        userName: getUserName(),
        userRole: getUserRole(),
        text: commentText,
        timestamp: new Date(),
        likes: [],
        replies: []
      });
      setCommentText('');
      setCommentingPostId(null);
    }
  };

  // Close discover dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setDiscoverDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Get initials for default avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserName = () => {
    return userData?.profile?.name || 'Arjun Patel';
  };

  const getUserRole = () => {
    return userData?.mainRole || 'ARCHITECT';
  };

  const getUserProfileImage = () => {
    return userData?.profile?.profileImage || '';
  };

  return (
    <div className="dashboard-container">
        <div className="dashboard-content">
          <aside className="left-sidebar">
            <div className="sidebar-scroll-wrapper">
              <div className="sidebar-brand" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                <div className="brand-logo-v">V</div>
                {!sidebarCollapsed && <span className="brand-name">TRIVEON</span>}
              </div>

              <nav className="sidebar-nav">
                <div className="nav-item active" onClick={() => navigate('/home')}>
                  <HomeIcon />
                  {!sidebarCollapsed && <span>Home</span>}
                </div>
                <div className="nav-item" onClick={() => navigate('/startups')}>
                  <RocketIcon />
                  {!sidebarCollapsed && <span>Startups</span>}
                </div>
                <div className="nav-item" onClick={() => navigate('/investors')}>
                  <UsersIcon />
                  {!sidebarCollapsed && <span>Investors</span>}
                </div>
                <div className="nav-item" onClick={() => navigate('/explorers')}>
                  <CompassIcon />
                  {!sidebarCollapsed && <span>Explorer</span>}
                </div>
                {/* Discover Dropdown */}
                <div className="nav-item discover-nav-item" onClick={(e) => {
                      e.stopPropagation();
                      setDiscoverDropdownOpen(!discoverDropdownOpen);
                    }}>
                  <CompassIcon />
                  {!sidebarCollapsed && <span>Discover</span>}
                  {!sidebarCollapsed && (
                    <svg 
                      className={`discover-chevron ${discoverDropdownOpen ? 'open' : ''}`}
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  )}
                  {!sidebarCollapsed && discoverDropdownOpen && (
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
                        onClick={() => {
                          setDiscoverDropdownOpen(false);
                          navigate('/exchange');
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                        <span>Exchange</span>
                      </div>
                      <div 
                        className="discover-dropdown-item"
                        onClick={() => {
                          setDiscoverDropdownOpen(false);
                          navigate('/circles');
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        <span>Circles</span>
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
                <div className="nav-item" onClick={() => navigate('/messages')}>
                  <MessageIcon />
                  {!sidebarCollapsed && <span>Messages</span>}
                </div>
                <div className="nav-item" onClick={() => navigate('/bookmarks')}>
                  <BookmarkIcon />
                  {!sidebarCollapsed && <span>Bookmarks</span>}
                </div>
                <div className="nav-item" onClick={() => navigate('/notifications')}>
                  <BellIcon />
                  {!sidebarCollapsed && <span>Notifications</span>}
                </div>
                <div className="nav-item" onClick={() => navigate('/profile')}>
                  <UserIcon />
                  {!sidebarCollapsed && <span>Profile</span>}
                </div>
              </nav>

              {!sidebarCollapsed && (
                <div className="sidebar-promo-card" onClick={() => setCopilotOpen(true)}>
                  <div className="promo-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" /></svg>
                  </div>
                  <div className="promo-content">
                    <h4>AI Copilot</h4>
                    <p>Your ecosystem assistant</p>
                  </div>
                </div>
              )}
            </div>
          </aside>

        <main className="center-feed">
          <header className="feed-header">
            <div className="search-bar">
              <SearchIcon />
              <input type="text" placeholder="Search startups, people, ideas…" />
            </div>

            <div className="profile-section" onClick={() => setProfileDrawerOpen(!profileDrawerOpen)}>
            <div className="notification-badge">
              <BellIcon />
            </div>
            <div className="user-avatar">
              {getUserProfileImage() ? (
                <img 
                  src={getUserProfileImage()} 
                  alt={getUserName()} 
                  style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} 
                />
              ) : (
                getInitials(getUserName())
              )}
              <div className="star-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </div>
            <div className="user-info">
              <div className="user-name">{getUserName()}</div>
              <div className="user-role">
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
            <div className="dropdown-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
          </header>

          <div className="ecosystem-overview-card">
            <h1 className="eco-overview-title">Welcome to TRIVEON</h1>
            <p className="eco-overview-subtitle">The Operating System of Ambition. Everything you need to build, invest, and discover — in one place.</p>
            <div className="eco-pillars">
              <div className="eco-pillar" onClick={() => navigate('/startups')}>
                <div className="eco-pillar-icon" style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                </div>
                <div className="eco-pillar-content">
                  <h3>Startups</h3>
                  <p>Build and launch your venture with tools, support, and resources.</p>
                </div>
              </div>
              <div className="eco-pillar" onClick={() => navigate('/investors')}>
                <div className="eco-pillar-icon" style={{ background: 'linear-gradient(135deg, #00C896, #00A876)' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="eco-pillar-content">
                  <h3>Investors</h3>
                  <p>Discover promising startups and deploy capital strategically.</p>
                </div>
              </div>
              <div className="eco-pillar" onClick={() => navigate('/explorers')}>
                <div className="eco-pillar-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891B2)' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                  </svg>
                </div>
                <div className="eco-pillar-content">
                  <h3>Explorer</h3>
                  <p>Discover opportunities, give feedback, and contribute to the ecosystem.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="startup-premium-create-card">
            <button className="startup-create-signal-button" onClick={() => setCreatePostOpen(true)}>
              <div className="startup-button-icon">🚀</div>
              <div className="startup-button-text">
                <span className="startup-button-title">Create Signal</span>
                <span className="startup-button-subtitle">Share an update with the ecosystem</span>
              </div>
              <svg className="startup-button-arrow" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

          <div className="feed-tabs">
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
            {feedPosts.map(post => (
              <article className="feed-post" key={post.id}>
                <div className="post-header">
                  <div className="post-author">
                    <div className="author-avatar" style={{ cursor: 'pointer' }} onClick={() => {
                      if (demoUsers[post.userId]) {
                        setProfileDrawerOpen(true);
                      }
                    }}>
                      {post.userAvatar ? (
                        <img src={post.userAvatar} alt={post.userName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        getInitials(post.userName)
                      )}
                    </div>
                    <div className="author-info">
                      <div className="author-name">
                        {post.userName}
                        <span className={`role-badge ${post.userRole === 'ARCHITECT' ? 'gold' : post.userRole === 'CATALYST' ? 'green' : 'cyan'}`}>
                          {post.userRole === 'ARCHITECT' ? 'Architect' : post.userRole === 'CATALYST' ? 'Catalyst' : 'Explorer'}
                        </span>
                        {demoUsers[post.userId]?.prestigeSystem && (
                          <PrestigeStarBadge
                            starId={demoUsers[post.userId].prestigeSystem.currentStarId}
                            size="small"
                            color={getRoleColor(post.userRole)}
                          />
                        )}
                      </div>
                      <span className="post-time">2h ago</span>
                    </div>
                  </div>
                  <button 
                    className="post-menu-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuPostId(post.id);
                    }}
                  >
                    ⋮
                  </button>
                </div>

                <div className="post-content">
                  <h3 className="post-title">{post.postType}</h3>
                  <div className="post-tags">
                    {post.tags.map(tag => <span key={tag} className="post-tag">#{tag}</span>)}
                  </div>
                  <p className="post-text">{post.description}</p>
                </div>

                <div className="post-actions">
                  <div
                    className="post-action"
                    onClick={() => handleLikePost(post.id)}
                    style={{
                      color: post.likedBy.includes(userData?.uid || 'current-user')
                        ? '#FFD700'
                        : 'rgba(255,255,255,0.6)'
                    }}
                  >
                    <HeartIcon />
                    <span>{post.likes}</span>
                  </div>
                  <div className="post-action" onClick={() => setCommentingPostId(commentingPostId === post.id ? null : post.id)}>
                    <CommentIcon />
                    <span>{post.comments.length}</span>
                  </div>
                  <div className="post-action">
                    <ShareIcon />
                    <span>Share</span>
                  </div>
                  <div 
                    className="post-action" 
                    onClick={() => {
                      if (savedPosts.includes(post.id)) {
                        unsavePost(post.id);
                      } else {
                        savePost(post.id);
                      }
                    }}
                    style={{
                      color: savedPosts.includes(post.id)
                        ? '#FFD700'
                        : 'rgba(255,255,255,0.6)'
                    }}
                  >
                    <BookmarkIcon />
                  </div>
                </div>

                {post.likedBy.length > 0 && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    {post.likedBy.slice(0, 3).map((userId, index) => {
                      const user = demoUsers[userId];
                      if (!user) return null;
                      return (
                        <span
                          key={userId}
                          style={{
                            fontSize: '0.8rem',
                            color: 'rgba(255,255,255,0.7)',
                            cursor: 'pointer'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setProfileDrawerOpen(true);
                          }}
                        >
                          {index > 0 ? ', ' : ''}{user.userName}
                        </span>
                      );
                    })}
                    {post.likedBy.length > 3 && (
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                        +{post.likedBy.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {commentingPostId === post.id && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'flex-end'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      color: '#fff',
                      flexShrink: 0
                    }}>
                      {getInitials(getUserName())}
                    </div>
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment(post.id)}
                      style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        outline: 'none',
                        fontSize: '0.9rem'
                      }}
                    />
                    <button
                      onClick={() => handleSubmitComment(post.id)}
                      disabled={!commentText.trim()}
                      style={{
                        padding: '0.75rem 1.25rem',
                        background: commentText.trim() ? 'linear-gradient(135deg, #B8860B, #DAA520)' : 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        fontWeight: 600,
                        cursor: commentText.trim() ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Post
                    </button>
                  </div>
                )}

                {commentingPostId === post.id && post.comments.length > 0 && (
                  <div className="post-comments" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    {post.comments.map(comment => (
                      <div key={comment.id} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          color: '#fff',
                          flexShrink: 0
                        }}>
                          {getInitials(comment.userName)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>{comment.userName}</span>
                            <span className={`role-badge ${comment.userRole === 'ARCHITECT' ? 'gold' : comment.userRole === 'CATALYST' ? 'green' : 'cyan'}`}>
                              {comment.userRole === 'ARCHITECT' ? 'Architect' : comment.userRole === 'CATALYST' ? 'Catalyst' : 'Explorer'}
                            </span>
                          </div>
                          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: 0 }}>{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </main>
      </div>

      {createPostOpen && <CreatePost onClose={() => setCreatePostOpen(false)} />}

      {/* Profile Drawer */}
      {profileDrawerOpen && (
        <div className="profile-drawer-overlay" onClick={() => setProfileDrawerOpen(false)}>
          <div className="profile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-avatar">
                {userData?.profile?.profileImage ? (
                  <img src={getUserProfileImage()} alt={getUserName()} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
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
            {showEcosystemOverview ? (
              <div className="drawer-eco">
                <button onClick={() => setShowEcosystemOverview(false)} className="back-btn">← Back</button>
                <h3 className="eco-title">Ecosystem Overview</h3>
                <div className="eco-metrics">
                  <div className="eco-metric">
                    <div className="metric-label">Total Startups</div>
                    <div className="metric-value">1,247</div>
                  </div>
                  <div className="eco-metric">
                    <div className="metric-label">Active Investors</div>
                    <div className="metric-value">523</div>
                  </div>
                  <div className="eco-metric">
                    <div className="metric-label">Community Members</div>
                    <div className="metric-value">18,732</div>
                  </div>
                  <div className="eco-metric">
                    <div className="metric-label">Capital Deployed</div>
                    <div className="metric-value">$42.6M</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="drawer-menu">
                <div className="drawer-item" onClick={() => {navigate('/profile'); setProfileDrawerOpen(false);}}>Profile</div>
                <div className="drawer-item" onClick={() => setShowEcosystemOverview(true)}>Ecosystem Overview</div>
                <div className="drawer-item" onClick={() => {navigate('/settings'); setProfileDrawerOpen(false);}}>Settings</div>
                <div className="drawer-item">Account</div>
                <div className="drawer-item">Upgradation</div>
                <div className="drawer-item">Support & Feedback</div>
                <div className="drawer-item divider" onClick={() => {logout(); setProfileDrawerOpen(false);}}>Log Out</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Copilot Component */}
      <AICopilot isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />

      {/* Post Menu */}
      {openMenuPostId && (
        <PostMenu 
          post={feedPosts.find(p => p.id === openMenuPostId)!}
          onClose={() => setOpenMenuPostId(null)}
        />
      )}
    </div>
  );
};

export default HomeDashboard;