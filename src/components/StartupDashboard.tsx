import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePost from './CreatePost';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { usePosts } from '../contexts/PostContext';
import PrestigeStarBadge from './PrestigeStarBadge';
import './StartupDashboard.css';

const getRoleColor = (role: string): string => {
  const roleUpperCase = role.toUpperCase();
  if (roleUpperCase === 'ARCHITECT') return '#FFD700';
  if (roleUpperCase === 'CATALYST') return '#00C896';
  if (roleUpperCase === 'EXPLORER') return '#06b6d4';
  return '#9CA3AF';
};

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
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

const CompassIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"></polygon>
  </svg>
);

const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const BookmarkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const StartupIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L15 8H21L16 12L18 19L12 15L6 19L8 12L3 8H9L12 2Z"></path>
  </svg>
);

const FundingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const MarketplaceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const LaunchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
  </svg>
);

const CommunitiesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const ToolsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
);

const ChallengesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4M12 12v2M12 18v-2M4.93 4.93l1.41 1.41M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M17.66 17.66l1.41 1.41M4 12h2M18 12h2"></path>
  </svg>
);

const KnowledgeHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const StartupLabsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2v7.31"></path>
    <path d="M14 9.31V2"></path>
    <path d="M8.5 2h7"></path>
    <path d="M7 16h10"></path>
    <path d="M6 16c0 2 1 3 6 3s6-1 6-3-1-3-6-3-6 1-6 3Z"></path>
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

const AIIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"></polygon>
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

const StartupDashboard = () => {
  const { profile } = useAuth();
  const { userData } = useUser();
  const { startups, aiRecommendations, getIntelligentFeed } = usePosts();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('for-you');
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [userRole, setUserRole] = useState<'ARCHITECT' | 'EXPLORER' | 'CATALYST'>('ARCHITECT');
  const feedPosts = getIntelligentFeed(userRole);

  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole');
    if (savedRole) {
      setUserRole(savedRole.toUpperCase() as 'ARCHITECT' | 'EXPLORER' | 'CATALYST');
    }
  }, []);

  const getUserName = () => {
    return userData?.profile?.name || profile?.name || 'Arjun Patel';
  };

  const getUserRole = () => {
    return userData?.mainRole || profile?.role || 'Architect';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="sd-container">
      {/* Left Sidebar */}
      <div className="sd-left-sidebar">
        {/* Logo */}
        <div className="sd-logo" onClick={() => navigate('/home')}>
          <div className="sd-logo-icon">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#FFD700'}} />
                  <stop offset="100%" style={{stopColor:'#FFA500'}} />
                </linearGradient>
              </defs>
              <polygon points="20,80 50,20 80,80" fill="url(#logoGrad)" />
              <text x="50" y="72" textAnchor="middle" fill="#000" fontSize="28" fontWeight="800" fontFamily="Arial">T</text>
            </svg>
          </div>
          <span className="sd-logo-text">TRIVEON</span>
        </div>

        {/* Main Navigation */}
        <div className="sd-nav-section">
          <div className="sd-nav-item" onClick={() => navigate('/home')}>
            <HomeIcon />
            <span>Home</span>
          </div>
          <div className="sd-nav-item active">
            <RocketIcon />
            <span>Startups</span>
          </div>
          <div className="sd-nav-item" onClick={() => navigate('/investors')}>
            <UsersIcon />
            <span>Investors</span>
          </div>
          <div className="sd-nav-item" onClick={() => navigate('/explorers')}>
            <CompassIcon />
            <span>Explorer</span>
          </div>
        </div>

        {/* Startup Internal Navigation */}
        <div className="sd-nav-section">
          <div className="sd-nav-item">
            <StartupIcon />
            <span>Discover Startups</span>
          </div>
          <div className="sd-nav-item">
            <RocketIcon />
            <span>Trending</span>
          </div>
          <div className="sd-nav-item">
            <AIIcon />
            <span>AI Recommendations</span>
          </div>
          <div className="sd-nav-item">
            <MarketplaceIcon />
            <span>Marketplace</span>
          </div>
          <div className="sd-nav-item">
            <FundingIcon />
            <span>Funding Hub</span>
          </div>
          <div className="sd-nav-item">
            <LaunchIcon />
            <span>Launch Hub</span>
          </div>
          <div className="sd-nav-item">
            <CommunitiesIcon />
            <span>Communities</span>
          </div>
          <div className="sd-nav-item">
            <ToolsIcon />
            <span>Tools</span>
          </div>
          <div className="sd-nav-item">
            <ChallengesIcon />
            <span>Challenges</span>
          </div>
          <div className="sd-nav-item">
            <KnowledgeHubIcon />
            <span>Knowledge Hub</span>
          </div>
          <div className="sd-nav-item">
            <StartupLabsIcon />
            <span>Startup Labs</span>
          </div>
          <div className="sd-nav-item">
            <AnalyticsIcon />
            <span>Analytics</span>
          </div>
          <div className="sd-nav-item">
            <BookmarkIcon />
            <span>Saved</span>
          </div>
          <div className="sd-nav-item">
            <StartupIcon />
            <span>My Startup</span>
          </div>
        </div>

        {/* AI Copilot Card */}
        <div className="sd-copilot-card">
          <div className="sd-copilot-icon">
            <AIIcon />
          </div>
          <div className="sd-copilot-content">
            <strong>AI Copilot</strong>
            <span>Your startup assistant</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="sd-main">
        {/* Header */}
        <header className="feed-header">
          <div className="search-bar">
            <SearchIcon />
            <input type="text" placeholder="Search startups, founders, tools, funding..." />
            <SearchIcon />
          </div>

          <div className="profile-section">
            <div className="notification-badge">
              <BellIcon />
            </div>
            <div className="user-avatar">
              {getInitials(getUserName())}
            </div>
            <div className="user-info">
              <div className="user-name">{getUserName()}</div>
              <div className="user-role">{getUserRole().charAt(0).toUpperCase() + getUserRole().slice(1).toLowerCase()}</div>
            </div>
            <div className="dropdown-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </header>

        {/* Page Title Section */}
        <div className="sd-page-title">
          <div className="sd-title-text">
            <h1>Startups</h1>
            <p>Your hub for building, launching and scaling.</p>
          </div>
          <button className="sd-customize">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06-.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Customize Feed
          </button>
        </div>

        {/* 1. Create Signal */}
        <div className="startup-premium-create-card">
          <button className="startup-create-signal-button" onClick={() => setCreatePostOpen(true)}>
            <div className="startup-button-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
              </svg>
            </div>
            <div className="startup-button-text">
              <span className="startup-button-title">Create Signal</span>
              <span className="startup-button-subtitle">Share an update with the ecosystem</span>
            </div>
            <svg className="startup-button-arrow" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="sd-tabs">
          <div className={`sd-tab ${activeTab === 'for-you' ? 'active' : ''}`} onClick={() => setActiveTab('for-you')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            For You
          </div>
          <div className={`sd-tab ${activeTab === 'following' ? 'active' : ''}`} onClick={() => setActiveTab('following')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Following
          </div>
          <div className={`sd-tab ${activeTab === 'trending' ? 'active' : ''}`} onClick={() => setActiveTab('trending')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline><polyline points="17,6 23,6 23,12"></polyline></svg>
            Trending
          </div>
          <div className={`sd-tab ${activeTab === 'top-startups' ? 'active' : ''}`} onClick={() => setActiveTab('top-startups')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15 8H21L16 12L18 19L12 15L6 19L8 12L3 8H9L12 2Z"></path></svg>
            Top Startups
          </div>
          <div className={`sd-tab ${activeTab === 'editor-picks' ? 'active' : ''}`} onClick={() => setActiveTab('editor-picks')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8V4M12 12v2M12 18v-2M4.93 4.93l1.41 1.41M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M17.66 17.66l1.41 1.41M4 12h2M18 12h2"></path></svg>
            Editor Picks
          </div>
        </div>

        <div className="sd-content-grid">
          {/* Main Feed Column */}
          <div className="sd-main-col">
            {/* 2. Quick Action Cards */}
            <div className="sd-quick-cards">
              <div className="sd-quick-card">
                <div className="sd-card-icon">
                  <AIIcon />
                </div>
                <div className="sd-card-title">AI Recommendations</div>
                <div className="sd-card-subtitle">Investors, co-founders, mentors, & more</div>
              </div>
              <div className="sd-quick-card">
                <div className="sd-card-icon">
                  <MarketplaceIcon />
                </div>
                <div className="sd-card-title">Marketplace</div>
                <div className="sd-card-subtitle">Buy, sell, acquire or invest in</div>
              </div>
              <div className="sd-quick-card">
                <div className="sd-card-icon">
                  <FundingIcon />
                </div>
                <div className="sd-card-title">Funding Hub</div>
                <div className="sd-card-subtitle">Grants, accelerators, VC & more</div>
              </div>
              <div className="sd-quick-card">
                <div className="sd-card-icon">
                  <AIIcon />
                </div>
                <div className="sd-card-title">AI Copilot</div>
                <div className="sd-card-subtitle">Your AI startup assistant</div>
              </div>
            </div>

            {/* Startup Feed */}
            <div className="feed-posts">
              {feedPosts.map((post, idx) => (
                <article key={idx} className="feed-post">
                  <div className="post-header">
                    <div className="post-author">
                      <div className="author-avatar">
                        {post.user?.name ? getInitials(post.user.name) : 'RS'}
                      </div>
                      <div className="author-info">
                        <div className="author-name">
                          {post.user?.name || 'Riya Sharma'}
                          <span className={`role-badge ${(post.user?.role || 'Architect').toLowerCase() === 'architect' ? 'gold' : (post.user?.role || 'Architect').toLowerCase() === 'catalyst' ? 'green' : 'cyan'}`}>
                            {post.user?.role || 'Architect'}
                          </span>
                        </div>
                        <div className="post-time">2h ago</div>
                      </div>
                    </div>
                  </div>

                  <div className="post-content">
                    <h3 className="post-title">{post.title}</h3>
                    <div className="post-tags">
                      {post.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="post-tag">#{tag}</span>
                      ))}
                    </div>
                    <p className="post-text">{post.content}</p>
                  </div>

                  <div className="post-actions">
                    <div className="post-action">
                      <HeartIcon />
                      <span>{post.likes}</span>
                    </div>
                    <div className="post-action">
                      <CommentIcon />
                      <span>{post.comments?.length || 0}</span>
                    </div>
                    <div className="post-action">
                      <ShareIcon />
                      <span>Share</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Explore by Category */}
            <div className="sd-section">
              <div className="sd-section-header">
                <h3 className="sd-section-title">Explore by Category</h3>
                <div className="sd-section-view-all">View all</div>
              </div>
              <div className="sd-categories-grid">
                {['AI', 'SaaS', 'FinTech', 'HealthTech', 'Web3', 'ClimateTech', 'Robotics', 'SpaceTech', 'More'].map((cat, idx) => (
                  <div key={idx} className="sd-category-card">
                    <div className="sd-category-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"></polygon></svg>
                    </div>
                    <div className="sd-category-title">{cat}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="sd-right-col">
            {/* Trending Startups */}
            <div className="sd-section">
              <div className="sd-section-header">
                <h3 className="sd-section-title">Trending Startups</h3>
                <div className="sd-section-view-all">View all</div>
              </div>
              <div className="sd-trending-list">
                {startups.slice(0, 5).map((startup, idx) => (
                  <div key={idx} className="sd-trending-item">
                    <div className="sd-startup-logo-small">
                      {startup.name[0]}
                    </div>
                    <div className="sd-startup-info-small">
                      <div className="sd-startup-name">{startup.name}</div>
                      <div className="sd-startup-meta-small">
                        <span>{startup.industry}</span>
                        <span>·</span>
                        <span>{startup.stage}</span>
                      </div>
                    </div>
                    <div className="sd-startup-stats">
                      <div className="sd-stat">
                        <span className="sd-stat-value">{startup.followers}</span>
                        <span className="sd-stat-label">followers</span>
                      </div>
                      <div className="sd-stat">
                        <span className="sd-stat-value">↑{startup.growth}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Startup Journey */}
            <div className="sd-section">
              <div className="sd-section-header">
                <h3 className="sd-section-title">Startup Journey Stages</h3>
              </div>
              <div className="sd-journey-map">
                <div className="sd-journey-item completed">
                  <div className="sd-journey-dot"></div>
                  <div className="sd-journey-label">Idea</div>
                </div>
                <div className="sd-journey-item completed">
                  <div className="sd-journey-dot"></div>
                  <div className="sd-journey-label">Validation</div>
                </div>
                <div className="sd-journey-item completed">
                  <div className="sd-journey-dot"></div>
                  <div className="sd-journey-label">MVP</div>
                </div>
                <div className="sd-journey-item active">
                  <div className="sd-journey-dot"></div>
                  <div className="sd-journey-label">First User</div>
                </div>
                <div className="sd-journey-item">
                  <div className="sd-journey-dot"></div>
                  <div className="sd-journey-label">First Revenue</div>
                </div>
                <div className="sd-journey-item">
                  <div className="sd-journey-dot"></div>
                  <div className="sd-journey-label">Funding</div>
                </div>
                <div className="sd-journey-item">
                  <div className="sd-journey-dot"></div>
                  <div className="sd-journey-label">Scale</div>
                </div>
                <div className="sd-journey-item">
                  <div className="sd-journey-dot"></div>
                  <div className="sd-journey-label">Exit</div>
                </div>
              </div>
              <div className="sd-journey-progress">
                <div className="sd-progress-bar">
                  <div className="sd-progress-fill" style={{width: '37%'}}></div>
                </div>
                <div className="sd-progress-text">37%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {createPostOpen && <CreatePost onClose={() => setCreatePostOpen(false)} />}
    </div>
  );
};

export default StartupDashboard;
