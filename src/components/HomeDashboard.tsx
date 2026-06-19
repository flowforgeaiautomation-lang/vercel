import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import CreatePost from './CreatePost';
import './HomeDashboard.css';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile, usePosts } from '../contexts/PostContext';
import PrestigeStarBadge from './PrestigeStarBadge';
import AICopilot from './AICopilot';
import PostMenu from './PostMenu';

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

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

const formatTimestamp = (timestamp: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return timestamp.toLocaleDateString();
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
  const [viewProfilePopUp, setViewProfilePopUp] = useState<UserProfile | null>(null);
  const [showDetailedProfile, setShowDetailedProfile] = useState(false);
  const [verificationCenterOpen, setVerificationCenterOpen] = useState(false);
  const navigate = useNavigate();

  const { 
    userName, 
    userRole, 
    userProfileImage, 
    userData,
    getProfileCompletionPercentage,
    getVerificationCompletionPercentage
  } = useUser();
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  useEffect(() => {
    // Check if user has visited today
    const today = new Date().toDateString();
    const lastVisitDate = localStorage.getItem('triarcora-last-visit-date');
    
    if (lastVisitDate !== today) {
      setShowWelcomeBack(true);
      // Update last visit date
      localStorage.setItem('triarcora-last-visit-date', today);
      // Auto-hide after 5 seconds if we want
      setTimeout(() => setShowWelcomeBack(false), 5000);
    } else {
      setShowWelcomeBack(false);
    }
  }, []);
  const { logout } = useAuth();
  const { 
    posts, 
    demoUsers, 
    likePost, 
    addComment, 
    savePost, 
    unsavePost, 
    savedPosts, 
    hiddenPosts, 
    mutedUsers,
    followDemoUser,
    unfollowDemoUser
  } = usePosts();
  const feedPosts = posts.filter(post => !hiddenPosts.includes(post.id) && !mutedUsers.includes(post.userId));
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [animatingPostId, setAnimatingPostId] = useState<string | null>(null);

  const handleLikePost = (postId: string) => {
    setAnimatingPostId(postId);
    likePost(postId);
    setTimeout(() => setAnimatingPostId(null), 600);
  };

  const handleSubmitComment = (postId: string) => {
    if (commentText.trim()) {
      addComment(postId, {
        userId: userData?.uid || 'current-user',
        userName: userName,
        userRole: userRole,
        content: commentText
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
  const getInitials = (name?: string) => {
    const safeName = name || 'User';
    return safeName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="dashboard-container">
        <div className="dashboard-content">
          <aside className="left-sidebar">
            <div className="sidebar-scroll-wrapper">
              <div className="sidebar-brand" onClick={() => navigate('/home')}>
                <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
                  <defs>
                    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor:'#FFD700'}} />
                      <stop offset="100%" style={{stopColor:'#FFA500'}} />
                    </linearGradient>
                  </defs>
                  <polygon points="20,80 50,20 80,80" fill="url(#brandGrad)" />
                  <text x="50" y="72" textAnchor="middle" fill="#000" fontSize="28" fontWeight="800" fontFamily="Arial">T</text>
                </svg>
                {!sidebarCollapsed && <span className="brand-name">TRIARCORA</span>}
              </div>

              <nav className="sidebar-nav">
                <div className="nav-item active" onClick={() => navigate('/home')}>
                  <HomeIcon />
                  {!sidebarCollapsed && <span>Home</span>}
                </div>
                <div className="nav-item" onClick={() => navigate('/startups')}>
                  <RocketIcon />
                  {!sidebarCollapsed && <span>Architects</span>}
                </div>
                <div className="nav-item" onClick={() => navigate('/investors')}>
                  <UsersIcon />
                  {!sidebarCollapsed && <span>Catalysts</span>}
                </div>
                <div className="nav-item" onClick={() => navigate('/explorers')}>
                  <CompassIcon />
                  {!sidebarCollapsed && <span>Explorers</span>}
                </div>
                {/* Discover Dropdown */}
                <div className="nav-item discover-nav-item" onClick={(e) => {
                      e.stopPropagation();
                      setDiscoverDropdownOpen(!discoverDropdownOpen);
                    }}>
                  <SearchIcon />
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
                <div className="nav-item" onClick={() => navigate('/messages')}>
                  <MessageIcon />
                  {!sidebarCollapsed && <span>Inbox</span>}
                </div>
                <div className="nav-item" onClick={() => navigate('/signals')}>
            <BellIcon />
            {!sidebarCollapsed && <span>Signals</span>}
          </div>
          <div className="nav-item" onClick={() => navigate('/bookmarks')}>
            <BookmarkIcon />
            {!sidebarCollapsed && <span>Vault</span>}
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
            <div className="user-avatar">
              {userProfileImage ? (
                <img 
                  src={userProfileImage} 
                  alt={userName} 
                  style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} 
                />
              ) : (
                getInitials(userName)
              )}
            </div>
            <div className="user-info">
              <div className="user-name">{userName}</div>
              <div className="user-role">
                <span className={`role-badge ${userRole === 'ARCHITECT' ? 'gold' : userRole === 'CATALYST' ? 'green' : 'cyan'}`}>
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase()}
                </span>
                {userData?.prestigeSystem && (
                  <PrestigeStarBadge
                    starId={userData.prestigeSystem.currentStarId}
                    size="small"
                    color={getRoleColor(userRole)}
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

          {showWelcomeBack && (
            <div className="welcome-section">
              <h1 className="welcome-title">Welcome back, {userName}👋</h1>
            </div>
          )}

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
                        setViewProfilePopUp(demoUsers[post.userId]);
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
                        <span style={{ cursor: 'pointer' }} onClick={() => {
                          if (demoUsers[post.userId]) {
                            setViewProfilePopUp(demoUsers[post.userId]);
                          }
                        }}>
                          {post.userName}
                        </span>
                        <span className="author-username" style={{ color: 'rgba(255,255,255,0.6)', marginLeft: '8px', fontSize: '14px' }}>@{post.userUsername}</span>
                        <span className={`role-badge ${post.userRole === 'ARCHITECT' ? 'gold' : post.userRole === 'CATALYST' ? 'green' : 'cyan'}`} style={{ marginLeft: '8px' }}>
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
                      <span className="post-time">{formatTimestamp(post.timestamp)}</span>
                    </div>
                  </div>
                  {/* Follow Button on Post Card */}
                  {demoUsers[post.userId] && demoUsers[post.userId].userId !== (userData?.uid || 'demo-user') && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const currentUserId = userData?.uid || 'demo-user';
                        const user = demoUsers[post.userId];
                        const isFollowing = user.followers.includes(currentUserId);
                        if (isFollowing) {
                          unfollowDemoUser(user.userId);
                        } else {
                          followDemoUser(user.userId);
                        }
                      }}
                      style={{
                        padding: '0.4rem 1rem',
                        background: demoUsers[post.userId].followers.includes(userData?.uid || 'demo-user') 
                          ? 'rgba(255,255,255,0.1)' 
                          : post.userRole === 'ARCHITECT' 
                            ? 'linear-gradient(135deg, #B8860B, #DAA520)' 
                            : post.userRole === 'CATALYST' 
                              ? 'linear-gradient(135deg, #00C896, #34D399)' 
                              : 'linear-gradient(135deg, #3B82F6, #60A5FA)',
                        border: demoUsers[post.userId].followers.includes(userData?.uid || 'demo-user') ? '1px solid rgba(255,255,255,0.2)' : 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {demoUsers[post.userId].followers.includes(userData?.uid || 'demo-user') ? 'Following' : 'Follow'}
                    </button>
                  )}
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
                            setViewProfilePopUp(user);
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
                      {getInitials(userName)}
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
                {userProfileImage ? (
                  <img src={userProfileImage} alt={userName} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                ) : (
                  getInitials(userName)
                )}
              </div>
              <div className="drawer-name">{userName}</div>
              <div className="drawer-role" style={{ marginBottom: '1rem' }}>
                <span className={`role-badge ${userRole === 'ARCHITECT' ? 'gold' : userRole === 'CATALYST' ? 'green' : 'cyan'}`}>
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase()}
                </span>
                {userData?.prestigeSystem && (
                  <PrestigeStarBadge
                    starId={userData.prestigeSystem.currentStarId}
                    size="small"
                    color={getRoleColor(userRole)}
                  />
                )}
              </div>
              {userData?.verification && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.75rem 1rem', 
                  background: 'rgba(255,215,0,0.05)', 
                  borderRadius: '8px',
                  border: '1px solid rgba(255,215,0,0.2)',
                  cursor: 'pointer'
                }} onClick={() => { setProfileDrawerOpen(false); setVerificationCenterOpen(true); }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    background: `conic-gradient(#FFD700 0% ${userData.verification.trustScore}%, rgba(255,255,255,0.1) ${userData.verification.trustScore}% 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      background: '#0a0e1a', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center'
                    }}>
                      <span style={{ color: '#FFD700', fontSize: '14px', fontWeight: 700 }}>
                        {userData.verification.trustScore}
                      </span>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#FFD700', fontSize: '13px', fontWeight: 700 }}>
                      {userData.verification.verificationLevel}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>
                      Trust Score
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>→</div>
                </div>
              )}
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

      {/* Simple Profile Pop-up */}
      {viewProfilePopUp && !showDetailedProfile && (
        <div 
          className="profile-drawer-overlay" 
          onClick={() => setViewProfilePopUp(null)}
          style={{ zIndex: 1000 }}
        >
          <div 
            className="profile-drawer" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              maxWidth: '400px', 
              width: '90%', 
              backgroundColor: '#0a0e1a',
              border: '1px solid rgba(255,215,0,0.2)',
              borderRadius: '16px'
            }}
          >
            <button 
              onClick={() => setViewProfilePopUp(null)}
              style={{ 
                position: 'absolute', 
                top: '1rem', 
                right: '1rem', 
                background: 'transparent', 
                border: 'none', 
                color: '#fff',
                cursor: 'pointer',
                fontSize: '1.5rem',
                zIndex: 10
              }}
            >
              ×
            </button>

            {/* Profile Header */}
            <div style={{ padding: '2rem 1.5rem 1.5rem', textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  background: viewProfilePopUp.userRole === 'ARCHITECT' ? 'linear-gradient(135deg, #B8860B, #DAA520)' : viewProfilePopUp.userRole === 'CATALYST' ? 'linear-gradient(135deg, #00C896, #34D399)' : 'linear-gradient(135deg, #3B82F6, #60A5FA)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto',
                  position: 'relative'
                }}>
                  {viewProfilePopUp.userAvatar ? (
                    <img 
                      src={viewProfilePopUp.userAvatar} 
                      alt={viewProfilePopUp.userName} 
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                      {getInitials(viewProfilePopUp.userName)}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ 
                  display: 'inline-block', 
                  padding: '0.3rem 0.8rem', 
                  borderRadius: '20px', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  background: viewProfilePopUp.userRole === 'ARCHITECT' ? 'rgba(255,215,0,0.15)' : viewProfilePopUp.userRole === 'CATALYST' ? 'rgba(0,200,150,0.15)' : 'rgba(59,130,246,0.15)', 
                  color: viewProfilePopUp.userRole === 'ARCHITECT' ? '#FFD700' : viewProfilePopUp.userRole === 'CATALYST' ? '#00C896' : '#3B82F6'
                }}>
                  {viewProfilePopUp.userRole}
                </span>
              </div>

              <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, marginBottom: '0.3rem' }}>
                {viewProfilePopUp.userName}
              </h2>

              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '1.5rem' }}>
                {viewProfilePopUp.userTitle}
              </p>

              {/* Follow/Unfollow Button */}
              {viewProfilePopUp.userId !== (userData?.uid || 'demo-user') && (
                <button 
                  onClick={() => {
                    const currentUserId = userData?.uid || 'demo-user';
                    const isFollowing = viewProfilePopUp.followers.includes(currentUserId);
                    if (isFollowing) {
                      unfollowDemoUser(viewProfilePopUp.userId);
                    } else {
                      followDemoUser(viewProfilePopUp.userId);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.6rem 1.2rem',
                    background: viewProfilePopUp.followers.includes(userData?.uid || 'demo-user') 
                      ? 'rgba(255,255,255,0.1)' 
                      : viewProfilePopUp.userRole === 'ARCHITECT' 
                        ? 'linear-gradient(135deg, #B8860B, #DAA520)' 
                        : viewProfilePopUp.userRole === 'CATALYST' 
                          ? 'linear-gradient(135deg, #00C896, #34D399)' 
                          : 'linear-gradient(135deg, #3B82F6, #60A5FA)',
                    border: viewProfilePopUp.followers.includes(userData?.uid || 'demo-user') ? '1px solid rgba(255,255,255,0.2)' : 'none',
                    borderRadius: '10px',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginBottom: '0.75rem'
                  }}
                >
                  {viewProfilePopUp.followers.includes(userData?.uid || 'demo-user') ? 'Following' : 'Follow'}
                </button>
              )}
              
              <button 
                onClick={() => setShowDetailedProfile(true)}
                style={{
                  width: '100%',
                  padding: '0.9rem 1.5rem',
                  background: viewProfilePopUp.userRole === 'ARCHITECT' ? 'linear-gradient(135deg, #B8860B, #DAA520)' : viewProfilePopUp.userRole === 'CATALYST' ? 'linear-gradient(135deg, #00C896, #34D399)' : 'linear-gradient(135deg, #3B82F6, #60A5FA)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                See Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Profile Pop-up */}
      {viewProfilePopUp && showDetailedProfile && (
        <div 
          className="profile-drawer-overlay" 
          onClick={() => {
            setShowDetailedProfile(false);
            setViewProfilePopUp(null);
          }}
          style={{ zIndex: 1001 }}
        >
          <div 
            className="profile-drawer" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              maxWidth: '500px', 
              width: '90%', 
              maxHeight: '90vh', 
              overflowY: 'auto',
              backgroundColor: '#0a0e1a',
              border: '1px solid rgba(255,215,0,0.2)',
              borderRadius: '16px'
            }}
          >
            <button 
              onClick={() => {
                setShowDetailedProfile(false);
                setViewProfilePopUp(null);
              }}
              style={{ 
                position: 'absolute', 
                top: '1rem', 
                right: '1rem', 
                background: 'transparent', 
                border: 'none', 
                color: '#fff',
                cursor: 'pointer',
                fontSize: '1.5rem',
                zIndex: 10
              }}
            >
              ×
            </button>

            {/* Profile Header */}
            <div style={{ padding: '2rem 1.5rem 1rem', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  background: viewProfilePopUp.userRole === 'ARCHITECT' ? 'linear-gradient(135deg, #B8860B, #DAA520)' : viewProfilePopUp.userRole === 'CATALYST' ? 'linear-gradient(135deg, #00C896, #34D399)' : 'linear-gradient(135deg, #3B82F6, #60A5FA)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto',
                  position: 'relative'
                }}>
                  {viewProfilePopUp.userAvatar ? (
                    <img 
                      src={viewProfilePopUp.userAvatar} 
                      alt={viewProfilePopUp.userName} 
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff' }}>
                      {getInitials(viewProfilePopUp.userName)}
                    </span>
                  )}
                  {/* Verification Badge */}
                  {viewProfilePopUp.userCredibility?.verified && (
                    <div style={{
                      position: 'absolute',
                      bottom: '5px',
                      right: '5px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00C896, #34D399)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 0C5.37 0 0 5.37 0 12C0 18.63 5.37 24 12 24C18.63 24 24 18.63 24 12C24 5.37 18.63 0 12 0ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#fff"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ 
                  display: 'inline-block', 
                  padding: '0.4rem 1rem', 
                  borderRadius: '20px', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  background: viewProfilePopUp.userRole === 'ARCHITECT' ? 'rgba(255,215,0,0.15)' : viewProfilePopUp.userRole === 'CATALYST' ? 'rgba(0,200,150,0.15)' : 'rgba(59,130,246,0.15)', 
                  color: viewProfilePopUp.userRole === 'ARCHITECT' ? '#FFD700' : viewProfilePopUp.userRole === 'CATALYST' ? '#00C896' : '#3B82F6'
                }}>
                  {viewProfilePopUp.userRole}
                </span>
              </div>

              <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, marginBottom: '0.3rem' }}>
                {viewProfilePopUp.userName}
              </h1>

              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', marginBottom: '0.5rem' }}>
                {viewProfilePopUp.userTitle}
              </p>

              {viewProfilePopUp.userLocation && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '1rem' }}>
                  <LocationIcon />
                  <span>{viewProfilePopUp.userLocation}</span>
                </div>
              )}

              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', lineHeight: '1.6' }}>
                {viewProfilePopUp.userBio || 'No bio yet.'}
              </p>
            </div>

            {/* Stats */}
            <div style={{ 
              padding: '1.5rem', 
              display: 'flex', 
              justifyContent: 'space-around', 
              borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#fff', fontSize: '24px', fontWeight: 700 }}>{viewProfilePopUp.stats.followers}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Followers</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#fff', fontSize: '24px', fontWeight: 700 }}>{viewProfilePopUp.stats.following}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Following</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#fff', fontSize: '24px', fontWeight: 700 }}>{viewProfilePopUp.stats.endorsements}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Endorsements</div>
              </div>
            </div>

            {/* Follow/Unfollow Button for Detailed Profile */}
            {viewProfilePopUp.userId !== (userData?.uid || 'demo-user') && (
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <button 
                  onClick={() => {
                    const currentUserId = userData?.uid || 'demo-user';
                    const isFollowing = viewProfilePopUp.followers.includes(currentUserId);
                    if (isFollowing) {
                      unfollowDemoUser(viewProfilePopUp.userId);
                    } else {
                      followDemoUser(viewProfilePopUp.userId);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1.5rem',
                    background: viewProfilePopUp.followers.includes(userData?.uid || 'demo-user') 
                      ? 'rgba(255,255,255,0.1)' 
                      : viewProfilePopUp.userRole === 'ARCHITECT' 
                        ? 'linear-gradient(135deg, #B8860B, #DAA520)' 
                        : viewProfilePopUp.userRole === 'CATALYST' 
                          ? 'linear-gradient(135deg, #00C896, #34D399)' 
                          : 'linear-gradient(135deg, #3B82F6, #60A5FA)',
                    border: viewProfilePopUp.followers.includes(userData?.uid || 'demo-user') ? '1px solid rgba(255,255,255,0.2)' : 'none',
                    borderRadius: '10px',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '15px',
                    cursor: 'pointer'
                  }}
                >
                  {viewProfilePopUp.followers.includes(userData?.uid || 'demo-user') ? 'Following' : 'Follow'}
                </button>
              </div>
            )}

            {/* Credibility Score */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 600, marginBottom: '1rem' }}>Credibility Score</h4>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.5rem'
              }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  background: `conic-gradient(${viewProfilePopUp.userRole === 'ARCHITECT' ? '#B8860B' : viewProfilePopUp.userRole === 'CATALYST' ? '#00C896' : '#3B82F6'} 0% ${viewProfilePopUp.userCredibility.score}%, rgba(255,255,255,0.1) ${viewProfilePopUp.userCredibility.score}% 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    background: '#0a0e1a', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: viewProfilePopUp.userRole === 'ARCHITECT' ? '#FFD700' : viewProfilePopUp.userRole === 'CATALYST' ? '#00C896' : '#3B82F6', fontSize: '22px', fontWeight: 700 }}>
                      {viewProfilePopUp.userCredibility.score}
                    </span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  {viewProfilePopUp.userCredibility.startups !== undefined && (
                    <div style={{ marginBottom: '0.4rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Startups Built: </span>
                      <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{viewProfilePopUp.userCredibility.startups}</span>
                    </div>
                  )}
                  {viewProfilePopUp.userCredibility.investeeCount !== undefined && (
                    <div style={{ marginBottom: '0.4rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Investee Count: </span>
                      <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{viewProfilePopUp.userCredibility.investeeCount}</span>
                    </div>
                  )}
                  {viewProfilePopUp.userCredibility.years !== undefined && (
                    <div style={{ marginBottom: '0.4rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Years Active: </span>
                      <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{viewProfilePopUp.userCredibility.years}</span>
                    </div>
                  )}
                  {viewProfilePopUp.userCredibility.companies !== undefined && (
                    <div style={{ marginBottom: '0.4rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Companies: </span>
                      <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{viewProfilePopUp.userCredibility.companies}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Verification Score */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 600, margin: 0 }}>Verification Score</h4>
                <button 
                  onClick={() => { setViewProfilePopUp(null); setVerificationCenterOpen(true); }}
                  style={{
                    padding: '0.4rem 0.8rem',
                    background: 'rgba(255,215,0,0.1)',
                    border: '1px solid rgba(255,215,0,0.3)',
                    borderRadius: '8px',
                    color: '#FFD700',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Verification Center
                </button>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.5rem'
              }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  background: `conic-gradient(#FFD700 0% ${viewProfilePopUp.verification.trustScore}%, rgba(255,255,255,0.1) ${viewProfilePopUp.verification.trustScore}% 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    background: '#0a0e1a', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: '#FFD700', fontSize: '22px', fontWeight: 700 }}>
                      {viewProfilePopUp.verification.trustScore}
                    </span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '0.4rem' }}>
                    <span style={{ color: 'rgba(255,215,0,0.8)', fontSize: '14px', fontWeight: 600 }}>
                      {viewProfilePopUp.verification.verificationLevel}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {viewProfilePopUp.verification.emailVerified && (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(0,200,150,0.2)',
                        borderRadius: '4px',
                        color: '#00C896',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        Email Verified
                      </span>
                    )}
                    {viewProfilePopUp.verification.phoneVerified && (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(0,200,150,0.2)',
                        borderRadius: '4px',
                        color: '#00C896',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        Phone Verified
                      </span>
                    )}
                    {viewProfilePopUp.verification.identityVerified && (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(0,200,150,0.2)',
                        borderRadius: '4px',
                        color: '#00C896',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        Identity Verified
                      </span>
                    )}
                    {viewProfilePopUp.verification.linkedinVerified && (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(0,200,150,0.2)',
                        borderRadius: '4px',
                        color: '#00C896',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        LinkedIn Verified
                      </span>
                    )}
                    {viewProfilePopUp.verification.websiteVerified && (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(0,200,150,0.2)',
                        borderRadius: '4px',
                        color: '#00C896',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        Website Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {viewProfilePopUp.tags && viewProfilePopUp.tags.length > 0 && (
              <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 600, marginBottom: '1rem' }}>Interests</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {viewProfilePopUp.tags.map(tag => (
                    <span key={tag} style={{ 
                      padding: '0.5rem 1rem', 
                      borderRadius: '20px', 
                      background: viewProfilePopUp.userRole === 'ARCHITECT' ? 'rgba(255,215,0,0.1)' : viewProfilePopUp.userRole === 'CATALYST' ? 'rgba(0,200,150,0.1)' : 'rgba(59,130,246,0.1)', 
                      color: viewProfilePopUp.userRole === 'ARCHITECT' ? 'rgba(255,215,0,0.9)' : viewProfilePopUp.userRole === 'CATALYST' ? 'rgba(0,200,150,0.9)' : 'rgba(59,130,246,0.9)', 
                      fontSize: '14px',
                      fontWeight: 500
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {viewProfilePopUp.userLinks && Object.keys(viewProfilePopUp.userLinks).length > 0 && (
              <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 600, marginBottom: '1rem' }}>Links</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {viewProfilePopUp.userLinks.linkedin && (
                    <a 
                      href={viewProfilePopUp.userLinks.linkedin.startsWith('http') ? viewProfilePopUp.userLinks.linkedin : `https://${viewProfilePopUp.userLinks.linkedin}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '20px', 
                        background: 'rgba(255,255,255,0.1)', 
                        color: 'rgba(255,255,255,0.9)', 
                        fontSize: '14px',
                        fontWeight: 500,
                        textDecoration: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      LinkedIn
                    </a>
                  )}
                  {viewProfilePopUp.userLinks.website && (
                    <a 
                      href={viewProfilePopUp.userLinks.website.startsWith('http') ? viewProfilePopUp.userLinks.website : `https://${viewProfilePopUp.userLinks.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '20px', 
                        background: 'rgba(255,255,255,0.1)', 
                        color: 'rgba(255,255,255,0.9)', 
                        fontSize: '14px',
                        fontWeight: 500,
                        textDecoration: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Website
                    </a>
                  )}
                  {viewProfilePopUp.userLinks.twitter && (
                    <a 
                      href={viewProfilePopUp.userLinks.twitter.startsWith('http') ? viewProfilePopUp.userLinks.twitter : `https://${viewProfilePopUp.userLinks.twitter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '20px', 
                        background: 'rgba(255,255,255,0.1)', 
                        color: 'rgba(255,255,255,0.9)', 
                        fontSize: '14px',
                        fontWeight: 500,
                        textDecoration: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Twitter
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Verification Center Popup */}
      {verificationCenterOpen && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.8)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 2000 
        }} onClick={() => setVerificationCenterOpen(false)}>
          <div style={{ 
            background: '#0a0e1a', 
            borderRadius: '16px', 
            maxWidth: '600px', 
            width: '90%', 
            maxHeight: '90vh', 
            overflowY: 'auto',
            border: '1px solid rgba(255,215,0,0.2)',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setVerificationCenterOpen(false)}
              style={{ 
                position: 'absolute', 
                top: '1rem', 
                right: '1rem', 
                background: 'transparent', 
                border: 'none', 
                color: '#fff', 
                fontSize: '1.5rem', 
                cursor: 'pointer' 
              }}
            >
              ×
            </button>
            
            <div style={{ padding: '2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Verification Center
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0 }}>
                  Build trust across the TRIVEON ecosystem
                </p>
              </div>

              {userData && (
                <>
                  {/* Completion Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                    {/* Profile Completion */}
                    <div style={{ 
                      background: 'rgba(59,130,246,0.05)', 
                      padding: '1.5rem', 
                      borderRadius: '12px',
                      border: '1px solid rgba(59,130,246,0.2)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                          width: '60px', 
                          height: '60px', 
                          borderRadius: '50%', 
                          background: `conic-gradient(#3B82F6 0% ${getProfileCompletionPercentage()}%, rgba(255,255,255,0.1) ${getProfileCompletionPercentage()}% 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <div style={{ 
                            width: '48px', 
                            height: '48px', 
                            borderRadius: '50%', 
                            background: '#0a0e1a', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center'
                          }}>
                            <span style={{ color: '#3B82F6', fontSize: '20px', fontWeight: 700 }}>
                              {getProfileCompletionPercentage()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#3B82F6', fontSize: '16px', fontWeight: 700 }}>
                            Profile Complete
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                            {getProfileCompletionPercentage()}% Complete
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Verification Completion */}
                    <div style={{ 
                      background: 'rgba(255,215,0,0.05)', 
                      padding: '1.5rem', 
                      borderRadius: '12px',
                      border: '1px solid rgba(255,215,0,0.2)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                          width: '60px', 
                          height: '60px', 
                          borderRadius: '50%', 
                          background: `conic-gradient(#FFD700 0% ${getVerificationCompletionPercentage()}%, rgba(255,255,255,0.1) ${getVerificationCompletionPercentage()}% 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <div style={{ 
                            width: '48px', 
                            height: '48px', 
                            borderRadius: '50%', 
                            background: '#0a0e1a', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center'
                          }}>
                            <span style={{ color: '#FFD700', fontSize: '20px', fontWeight: 700 }}>
                              {getVerificationCompletionPercentage()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#FFD700', fontSize: '16px', fontWeight: 700 }}>
                            {userData.verification.verificationLevel}
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                            Status: {userData.verification.verificationStatus}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Steps */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '1rem' }}>
                      Complete Your Verification
                    </h3>
                    
                    {/* Level 1: Basic */}
                    <div style={{ 
                      background: 'rgba(255,255,255,0.03)', 
                      padding: '1rem', 
                      borderRadius: '8px', 
                      marginBottom: '1rem',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>Level 1: Basic Verification</span>
                        <span style={{ 
                          padding: '0.25rem 0.5rem',
                          background: userData.verification.emailVerified && userData.verification.phoneVerified 
                            ? 'rgba(0,200,150,0.2)' 
                            : 'rgba(255,255,255,0.1)',
                          color: userData.verification.emailVerified && userData.verification.phoneVerified 
                            ? '#00C896' 
                            : 'rgba(255,255,255,0.6)',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600
                        }}>
                          {userData.verification.emailVerified && userData.verification.phoneVerified ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '0.4rem 0.8rem',
                          background: userData.verification.emailVerified 
                            ? 'rgba(0,200,150,0.2)' 
                            : 'rgba(255,255,255,0.1)',
                          color: userData.verification.emailVerified 
                            ? '#00C896' 
                            : 'rgba(255,255,255,0.6)',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                          border: `1px solid ${userData.verification.emailVerified ? 'rgba(0,200,150,0.3)' : 'rgba(255,255,255,0.2)'}`
                        }}>
                          {userData.verification.emailVerified ? '✓ ' : ''}Email Verified
                        </span>
                        <span style={{
                          padding: '0.4rem 0.8rem',
                          background: userData.verification.phoneVerified 
                            ? 'rgba(0,200,150,0.2)' 
                            : 'rgba(255,255,255,0.1)',
                          color: userData.verification.phoneVerified 
                            ? '#00C896' 
                            : 'rgba(255,255,255,0.6)',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                          border: `1px solid ${userData.verification.phoneVerified ? 'rgba(0,200,150,0.3)' : 'rgba(255,255,255,0.2)'}`
                        }}>
                          {userData.verification.phoneVerified ? '✓ ' : ''}Phone Verified
                        </span>
                      </div>
                    </div>

                    {/* Level 2: Identity */}
                    <div style={{ 
                      background: 'rgba(255,255,255,0.03)', 
                      padding: '1rem', 
                      borderRadius: '8px', 
                      marginBottom: '1rem',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>Level 2: Identity Verification</span>
                        <span style={{ 
                          padding: '0.25rem 0.5rem',
                          background: userData.verification.identityVerified 
                            ? 'rgba(0,200,150,0.2)' 
                            : 'rgba(255,255,255,0.1)',
                          color: userData.verification.identityVerified 
                            ? '#00C896' 
                            : 'rgba(255,255,255,0.6)',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600
                        }}>
                          {userData.verification.identityVerified ? 'Completed' : 'Not Started'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '0.4rem 0.8rem',
                          background: userData.verification.identityVerified 
                            ? 'rgba(0,200,150,0.2)' 
                            : 'rgba(255,255,255,0.1)',
                          color: userData.verification.identityVerified 
                            ? '#00C896' 
                            : 'rgba(255,255,255,0.6)',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                          border: `1px solid ${userData.verification.identityVerified ? 'rgba(0,200,150,0.3)' : 'rgba(255,255,255,0.2)'}`
                        }}>
                          {userData.verification.identityVerified ? '✓ ' : ''}Government ID
                        </span>
                        <span style={{
                          padding: '0.4rem 0.8rem',
                          background: userData.verification.identityVerified 
                            ? 'rgba(0,200,150,0.2)' 
                            : 'rgba(255,255,255,0.1)',
                          color: userData.verification.identityVerified 
                            ? '#00C896' 
                            : 'rgba(255,255,255,0.6)',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                          border: `1px solid ${userData.verification.identityVerified ? 'rgba(0,200,150,0.3)' : 'rgba(255,255,255,0.2)'}`
                        }}>
                          {userData.verification.identityVerified ? '✓ ' : ''}Selfie Verification
                        </span>
                      </div>
                    </div>

                    {/* Level 3: Professional */}
                    <div style={{ 
                      background: 'rgba(255,255,255,0.03)', 
                      padding: '1rem', 
                      borderRadius: '8px', 
                      marginBottom: '1rem',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>Level 3: Professional Verification</span>
                        <span style={{ 
                          padding: '0.25rem 0.5rem',
                          background: userData.verification.linkedinVerified && userData.verification.websiteVerified 
                            ? 'rgba(0,200,150,0.2)' 
                            : 'rgba(255,255,255,0.1)',
                          color: userData.verification.linkedinVerified && userData.verification.websiteVerified 
                            ? '#00C896' 
                            : 'rgba(255,255,255,0.6)',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600
                        }}>
                          {userData.verification.linkedinVerified && userData.verification.websiteVerified ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '0.4rem 0.8rem',
                          background: userData.verification.linkedinVerified 
                            ? 'rgba(0,200,150,0.2)' 
                            : 'rgba(255,255,255,0.1)',
                          color: userData.verification.linkedinVerified 
                            ? '#00C896' 
                            : 'rgba(255,255,255,0.6)',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                          border: `1px solid ${userData.verification.linkedinVerified ? 'rgba(0,200,150,0.3)' : 'rgba(255,255,255,0.2)'}`
                        }}>
                          {userData.verification.linkedinVerified ? '✓ ' : ''}LinkedIn Verified
                        </span>
                        <span style={{
                          padding: '0.4rem 0.8rem',
                          background: userData.verification.websiteVerified 
                            ? 'rgba(0,200,150,0.2)' 
                            : 'rgba(255,255,255,0.1)',
                          color: userData.verification.websiteVerified 
                            ? '#00C896' 
                            : 'rgba(255,255,255,0.6)',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                          border: `1px solid ${userData.verification.websiteVerified ? 'rgba(0,200,150,0.3)' : 'rgba(255,255,255,0.2)'}`
                        }}>
                          {userData.verification.websiteVerified ? '✓ ' : ''}Website Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      style={{
                        flex: 1,
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Start Verification
                    </button>
                    <button 
                      onClick={() => setVerificationCenterOpen(false)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
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