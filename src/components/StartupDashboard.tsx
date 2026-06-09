import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePost from './CreatePost';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { UserProfile, usePosts } from '../contexts/PostContext';
import AICopilot from './AICopilot';
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

const ThumbUpIcon = ({ animate }: { animate?: boolean }) => (
  <svg 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{
      animation: animate ? 'clap 0.4s ease-in-out 3' : 'none'
    }}
  >
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClapIcon = ({ animate }: { animate?: boolean }) => (
  <svg 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{
      animation: animate ? 'clap 0.4s ease-in-out 3' : 'none'
    }}
  >
    <path d="M14 5h-1c-.55 0-1 .45-1 1v3"></path>
    <path d="M10 5h1c.55 0-1 .45-1 1v3"></path>
    <path d="M12 8v10"></path>
    <path d="M5 8h2c.55 0-1 .45-1 1v3"></path>
    <path d="M17 8h-2c-.55 0-1 .45-1 1v3"></path>
    <path d="M8 12h8"></path>
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

const BookmarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
  </svg>
);

const StartupDashboard = () => {
  const { profile } = useAuth();
  const { userData } = useUser();
  const { startups, marketplaceListings, aiRecommendations, productLaunches, upvoteProductLaunch, likePost, posts, demoUsers, addComment, savePost, unsavePost, savedPosts } = usePosts();
  const [productLaunchCategory, setProductLaunchCategory] = useState('All');
  
  // Filters for AI recommendations
  const [aiRecommendationType, setAiRecommendationType] = useState('All');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('discover');
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const userRole = userData?.mainRole || 'ARCHITECT';
  const feedPosts = posts;
  const [showEcosystemOverview, setShowEcosystemOverview] = useState(false);
  const [viewProfilePopUp, setViewProfilePopUp] = useState<UserProfile | null>(null);
  const [showDetailedProfile, setShowDetailedProfile] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [animatingPostId, setAnimatingPostId] = useState<string | null>(null);
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);

  const handleLikePost = (postId: string) => {
    likePost(postId);
    setAnimatingPostId(postId);
    setTimeout(() => setAnimatingPostId(null), 1200);
  };
  
  const getUserName = () => {
    return userData?.profile?.name || profile?.name || "Arjun Patel";
  };

  const getUserRole = () => {
    return userData?.mainRole || profile?.role || "Architect";
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
    return defaultImages[userRole] || defaultImages['ARCHITECT'];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmitComment = (postId: string, parentId?: string) => {
    if (!commentText.trim()) return;
    
    addComment(postId, {
      userId: userData?.uid || 'demo-user',
      userName: getUserName(),
      userAvatar: userData?.profile?.profileImage,
      userRole: userData?.mainRole || userRole,
      content: commentText.trim()
    }, parentId);
    
    setCommentText('');
    setCommentingPostId(null);
    setReplyingToCommentId(null);
  };

  const renderComment = (comment: any, level: number = 0) => {
    return (
      <div key={comment.id} style={{ marginBottom: '1rem', marginLeft: `${level * 24}px` }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '0.75rem', 
          padding: '1rem', 
          border: '1px solid rgba(255,255,255,0.1)',
          position: 'relative'
        }}>
          {level > 0 && (
            <div style={{
              position: 'absolute',
              left: '-16px',
              top: '32px',
              width: '20px',
              height: '2px',
              background: 'rgba(255,255,255,0.15)'
            }} />
          )}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              background: comment.userRole === 'ARCHITECT' 
                ? 'linear-gradient(135deg, #FFD700, #FFB700)' 
                : comment.userRole === 'CATALYST' 
                  ? 'linear-gradient(135deg, #00C896, #00A876)' 
                  : 'linear-gradient(135deg, #06B6D4, #0891B2)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '0.85rem', 
              fontWeight: 'bold', 
              color: '#fff', 
              flexShrink: 0 
            }}>
              {getInitials(comment.userName)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#fff' }}>
                  {comment.userName}
                </span>
                <span className={`role-badge ${comment.userRole === 'ARCHITECT' ? 'gold' : comment.userRole === 'CATALYST' ? 'green' : 'cyan'}`} style={{ fontSize: '0.7rem' }}>
                  {comment.userRole === 'ARCHITECT' ? 'Architect' : comment.userRole === 'CATALYST' ? 'Catalyst' : 'Explorer'}
                </span>
                {demoUsers[comment.userId]?.prestigeSystem && (
                  <PrestigeStarBadge 
                    starId={demoUsers[comment.userId].prestigeSystem.currentStarId} 
                    size="small"
                    color={getRoleColor(comment.userRole)}
                  />
                )}
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                  2h ago
                </span>
              </div>
              <p style={{ 
                fontSize: '0.9rem', 
                color: 'rgba(255,255,255,0.85)', 
                marginTop: '0.5rem',
                lineHeight: '1.5'
              }}>
                {comment.content || comment.text}
              </p>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                marginTop: '0.75rem' 
              }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  padding: '0.25rem 0',
                  transition: 'color 0.2s',
                  fontWeight: 500
                }}>
                  👏 {comment.likes || 0}
                </button>
                <button 
                  onClick={() => {
                    setCommentingPostId(commentingPostId);
                    setReplyingToCommentId(comment.id);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    padding: '0.25rem 0',
                    transition: 'color 0.2s'
                  }}>
                  Reply
                </button>
              </div>
            </div>
          </div>
          {replyingToCommentId === comment.id && (
            <div style={{ 
              marginTop: '1rem', 
              paddingLeft: '44px',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-end'
            }}>
              <input 
                type="text" 
                placeholder={`Reply to ${comment.userName}...`}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment(commentingPostId!, comment.id)}
                style={{ 
                  flex: 1, 
                  padding: '0.75rem 1rem', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.15)', 
                  borderRadius: '0.5rem', 
                  color: '#fff', 
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
              <button 
                onClick={() => handleSubmitComment(commentingPostId!, comment.id)}
                disabled={!commentText.trim()}
                style={{ 
                  padding: '0.75rem 1.25rem', 
                  background: commentText.trim() ? 'linear-gradient(135deg, #B8860B, #DAA520)' : 'rgba(255,255,255,0.1)', 
                  border: 'none', 
                  borderRadius: '0.5rem', 
                  color: '#fff', 
                  fontWeight: 600,
                  cursor: commentText.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '0.85rem'
                }}
              >
                Reply
              </button>
            </div>
          )}
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div style={{ marginTop: '0.5rem' }}>
            {comment.replies.map((reply: any) => renderComment(reply, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  // Filters for startup discovery
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedRevenue, setSelectedRevenue] = useState('All');
  const [selectedTeamSize, setSelectedTeamSize] = useState('All');
  const [selectedGrowth, setSelectedGrowth] = useState('All');
  
  // Filters for marketplace
  const [marketplaceSearch, setMarketplaceSearch] = useState('');
  const [selectedListingType, setSelectedListingType] = useState('All');
  
  useEffect(() => {
    console.log("createPostOpen STATE:", createPostOpen);
  }, [createPostOpen]);

  // Filter startups based on selected filters
  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          startup.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          startup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesIndustry = selectedIndustry === 'All' || startup.industry === selectedIndustry;
    const matchesStage = selectedStage === 'All' || startup.stage === selectedStage;
    const matchesRevenue = selectedRevenue === 'All' || startup.revenue === selectedRevenue;
    const matchesTeamSize = selectedTeamSize === 'All' || startup.teamSize === selectedTeamSize;
    const matchesGrowth = selectedGrowth === 'All' || startup.growth === selectedGrowth;
    return matchesSearch && matchesIndustry && matchesStage && matchesRevenue && matchesTeamSize && matchesGrowth;
  });

  // Unique values for filters
  const industries = ['All', ...new Set(startups.map(s => s.industry))];
  const stages = ['All', ...new Set(startups.map(s => s.stage))];
  const revenues = ['All', ...new Set(startups.map(s => s.revenue))];
  const teamSizes = ['All', ...new Set(startups.map(s => s.teamSize))];
  const growths = ['All', ...new Set(startups.map(s => s.growth))];
  
  // Marketplace data and filters
  const listingTypes = ['All', ...new Set(marketplaceListings.map(l => l.type))];
  const filteredMarketplaceListings = marketplaceListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(marketplaceSearch.toLowerCase()) || listing.description.toLowerCase().includes(marketplaceSearch.toLowerCase());
    const matchesType = selectedListingType === 'All' || listing.type === selectedListingType;
    return matchesSearch && matchesType;
  });

  // AI recommendations filters
  const aiRecommendationTypes = ['All', ...new Set(aiRecommendations.map(r => r.type))];
  const filteredAIRecommendations = aiRecommendations.filter(rec => 
    aiRecommendationType === 'All' || rec.type === aiRecommendationType
  ).sort((a, b) => b.matchScore - a.matchScore);

  // Product launches filters
  const productLaunchCategories = ['All', ...new Set(productLaunches.map(l => l.category))];
  const filteredProductLaunches = productLaunches.filter(launch => {
    const matchesCategory = productLaunchCategory === 'All' || launch.category === productLaunchCategory;
    return matchesCategory;
  }).sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div className="sd-container">
      {/* Left Sidebar */}
      <div className="sd-left-sidebar">
        {/* Logo */}
        <div className="sd-logo">
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

        {/* Navigation */}
        <nav className="sd-nav">
          <div className="sd-nav-item" onClick={() => navigate('/home')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Home</span>
          </div>
          <div className="sd-nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>
            <span>Startup</span>
          </div>
          <div className="sd-nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
            <span>My Startup</span>
          </div>
          <div className="sd-nav-item" onClick={() => navigate('/investors')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span>Investors</span>
          </div>
          <div className="sd-nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path><circle cx="8" cy="13" r="2"></circle><circle cx="16" cy="13" r="2"></circle><path d="M10 16a4 4 0 0 1 4 0"></path></svg>
            <span>Studio</span>
          </div>
        </nav>

        {/* AI Copilot */}
        <div className="sd-copilot-card">
          <div className="sd-copilot-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"></polygon></svg>
          </div>
          <div className="sd-copilot-content">
            <strong>AI Copilot</strong>
            <span>Your startup assistant</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="sd-main">
        {/* Header EXACTLY like HomeDashboard */}
        <header className="feed-header">
          <div className="search-bar">
            <SearchIcon />
            <input type="text" placeholder="Search startups, people, ideas…" />
            <SearchIcon />
          </div>

          <div className="profile-section" onClick={() => setProfileDrawerOpen(!profileDrawerOpen)}>
            <div className="user-avatar">
              {userData?.profile?.profileImage ? (
                <img src={getUserProfileImage()} alt={getUserName()} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
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

        {/* Create Signal Button EXACTLY like HomeDashboard */}
        <div className="startup-premium-create-card">
          <button className="startup-create-signal-button" onClick={() => {console.log("CREATE SIGNAL CLICKED!"); setCreatePostOpen(true);}}>
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

        <div className="sd-content">
          {/* Main Column */}
          <div className="sd-main-col">
            {/* Page Title */}
            <div className="sd-page-title">
              <div className="sd-title">
                <h1>Startups</h1>
                <p>Your hub for building, launching and scaling.</p>
              </div>
              <button className="sd-customize">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 0 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                Customize Feed
              </button>
            </div>

            {/* Tabs */}
            <div className="sd-tabs">
              <div className={`sd-tab ${activeTab === 'discover' ? 'active' : ''}`} onClick={() => setActiveTab('discover')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                Discover
              </div>
              <div className={`sd-tab ${activeTab === 'trending' ? 'active' : ''}`} onClick={() => setActiveTab('trending')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline><polyline points="17,6 23,6 23,12"></polyline></svg>
                Trending
              </div>
              <div className={`sd-tab ${activeTab === 'marketplace' ? 'active' : ''}`} onClick={() => setActiveTab('marketplace')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                Marketplace
              </div>
              <div className={`sd-tab ${activeTab === 'ai-recommendations' ? 'active' : ''}`} onClick={() => setActiveTab('ai-recommendations')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"></polygon></svg>
                AI Match
              </div>
              <div className={`sd-tab ${activeTab === 'product-launches' ? 'active' : ''}`} onClick={() => setActiveTab('product-launches')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15 8H21L16 12L18 19L12 15L6 19L8 12L3 8H9L12 2Z"></path></svg>
                Launches
              </div>
              <div className={`sd-tab ${activeTab === 'startup-tools' ? 'active' : ''}`} onClick={() => setActiveTab('startup-tools')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                Tools
              </div>
              <div className={`sd-tab ${activeTab === 'funding-hub' ? 'active' : ''}`} onClick={() => setActiveTab('funding-hub')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                Funding
              </div>
            </div>

            {/* Startup Discovery Section */}
            {activeTab === 'discover' && (
              <>
                {/* Search & Filters */}
                <div className="sd-filters">
                  <input 
                    type="text" 
                    placeholder="Search startups..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.5rem',
                      color: '#fff',
                      marginBottom: '1rem',
                      outline: 'none',
                      fontSize: '0.9rem'
                    }}
                  />
                  
                  <div className="sd-filter-row" style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem'}}>
                    <select 
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      style={{
                        flex: 1,
                        minWidth: '150px',
                        padding: '0.6rem 0.75rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        outline: 'none'
                      }}
                    >
                      {industries.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                    <select 
                      value={selectedStage}
                      onChange={(e) => setSelectedStage(e.target.value)}
                      style={{
                        flex: 1,
                        minWidth: '120px',
                        padding: '0.6rem 0.75rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        outline: 'none'
                      }}
                    >
                      {stages.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                    <select 
                      value={selectedRevenue}
                      onChange={(e) => setSelectedRevenue(e.target.value)}
                      style={{
                        flex: 1,
                        minWidth: '150px',
                        padding: '0.6rem 0.75rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        outline: 'none'
                      }}
                    >
                      {revenues.map(rev => (
                        <option key={rev} value={rev}>{rev}</option>
                      ))}
                    </select>
                    <select 
                      value={selectedTeamSize}
                      onChange={(e) => setSelectedTeamSize(e.target.value)}
                      style={{
                        flex: 1,
                        minWidth: '120px',
                        padding: '0.6rem 0.75rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        outline: 'none'
                      }}
                    >
                      {teamSizes.map(ts => (
                        <option key={ts} value={ts}>{ts}</option>
                      ))}
                    </select>
                    <select 
                      value={selectedGrowth}
                      onChange={(e) => setSelectedGrowth(e.target.value)}
                      style={{
                        flex: 1,
                        minWidth: '120px',
                        padding: '0.6rem 0.75rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        outline: 'none'
                      }}
                    >
                      {growths.map(gr => (
                        <option key={gr} value={gr}>{gr}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Startup Cards Grid */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
                  {filteredStartups.map(startup => (
                    <div key={startup.id} style={{
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      border: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.2s ease'
                    }} onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }} onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    }}>
                      <div style={{display: 'flex', gap: '0.75rem', marginBottom: '0.75rem'}}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '0.75rem',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}>
                          {startup.logo ? (
                            <img src={startup.logo} alt={startup.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                          ) : (
                            <span style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#fff'}}>{startup.name[0]}</span>
                          )}
                        </div>
                        <div style={{flex: 1}}>
                          <h3 style={{color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '0.125rem'}}>{startup.name}</h3>
                          <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '0.25rem'}}>{startup.tagline}</p>
                          <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                            <span style={{
                              padding: '0.15rem 0.5rem',
                              background: 'rgba(255,215,0,0.1)',
                              color: '#FFD700',
                              fontSize: '0.7rem',
                              borderRadius: '0.25rem'
                            }}>{startup.industry}</span>
                            <span style={{
                              padding: '0.15rem 0.5rem',
                              background: 'rgba(102,126,234,0.1)',
                              color: '#a78bfa',
                              fontSize: '0.7rem',
                              borderRadius: '0.25rem'
                            }}>{startup.stage}</span>
                          </div>
                        </div>
                      </div>
                      <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '0.75rem'}}>{startup.description}</p>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={{display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)'}}>
                          <span>👥 {startup.followers}</span>
                          <span>📈 {startup.growth}</span>
                          <span>📍 {startup.location.split(',')[0]}</span>
                        </div>
                        <button style={{
                          padding: '0.35rem 0.75rem',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          borderRadius: '0.35rem',
                          color: '#fff',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}>View</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Quick Cards */}
            <div className="sd-quick-cards">
              <div className="sd-quick-card">
                <div className="sd-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5a3 3 0 1 0-5.997.125A4 4 0 0 0 4 9v.5a3.5 3.5 0 0 0 6.173 1.763A2 2 0 0 0 11 12.5v.5A1.5 1.5 0 0 0 12.5 14.5H14a2 2 0 1 0 0-4h-.5a.5.5 0 0 1-.5-.5V9a3 3 0 0 0-6 0v.5a.5.5 0 0 1-.5.5H6a1 1 0 1 0 0 2h.5a.5.5 0 0 1.5.5v.5a3 3 0 1 0 6 0v-.5a.5.5 0 0 1-.5-.5h.5a1 1 0 0 0 1-1v-1a3 3 0 0 0-6 0v.5a.5.5 0 0 1-.5.5H9"></path></svg>
                </div>
                <div className="sd-card-text">
                  <strong>AI Recommendations</strong>
                  <p>Investors, co-founders, mentors & more</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6"></polyline></svg>
              </div>

              <div className="sd-quick-card">
                <div className="sd-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                </div>
                <div className="sd-card-text">
                  <strong>Marketplace</strong>
                  <p>Buy, sell, acquire or invest in startups</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6"></polyline></svg>
              </div>

              <div className="sd-quick-card">
                <div className="sd-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <div className="sd-card-text">
                  <strong>Funding Hub</strong>
                  <p>Grants, accelerators, VC & more</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6"></polyline></svg>
              </div>

              <div className="sd-quick-card">
                <div className="sd-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"></polygon></svg>
                </div>
                <div className="sd-card-text">
                  <strong>AI Copilot</strong>
                  <p>Your AI startup assistant</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6"></polyline></svg>
              </div>
            </div>

            {/* Trending Startups Section */}
            {(activeTab === 'trending' || activeTab === 'for-you') && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
                    🔥 Trending Startups
                  </h2>
                  <button style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}>
                    View All
                  </button>
                </div>

                {/* Trending Categories */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  flexWrap: 'wrap'
                }}>
                  {['Rising', 'Most Discussed', 'Most Funded', 'Editor Picks', 'AI Picks'].map((category, index) => (
                    <button
                      key={index}
                      style={{
                        padding: '0.5rem 1rem',
                        background: index === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'rgba(255,255,255,0.05)',
                        border: 'none',
                        borderRadius: '1rem',
                        color: index === 0 ? '#000' : '#fff',
                        fontSize: '0.85rem',
                        fontWeight: index === 0 ? 600 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Trending Startups Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                  {startups.map(startup => (
                    <div key={startup.id} style={{
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '0.75rem',
                      padding: '1.25rem',
                      border: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }} onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                    }} onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '0.75rem',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}>
                          {startup.logo ? (
                            <img src={startup.logo} alt={startup.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>{startup.name[0]}</span>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                            {startup.name}
                          </h3>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{
                              padding: '0.15rem 0.5rem',
                              background: 'rgba(255,215,0,0.1)',
                              color: '#FFD700',
                              fontSize: '0.7rem',
                              borderRadius: '0.25rem'
                            }}>
                              {startup.industry}
                            </span>
                            <span style={{
                              padding: '0.15rem 0.5rem',
                              background: 'rgba(102,126,234,0.1)',
                              color: '#a78bfa',
                              fontSize: '0.7rem',
                              borderRadius: '0.25rem'
                            }}>
                              {startup.stage}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                        {startup.tagline}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem' }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ color: '#FFD700', fontWeight: 600, fontSize: '1rem' }}>{startup.followers}</div>
                            <div style={{ color: 'rgba(255,255,255,0.5)' }}>Followers</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ color: '#00C896', fontWeight: 600, fontSize: '1rem' }}>{startup.engagement}</div>
                            <div style={{ color: 'rgba(255,255,255,0.5)' }}>Engagement</div>
                          </div>
                        </div>
                        <div style={{
                          padding: '0.35rem 0.75rem',
                          background: startup.fundingStatus.includes('Raising') ? 'linear-gradient(135deg, #00C896, #34D399)' : 'rgba(255,255,255,0.1)',
                          color: startup.fundingStatus.includes('Raising') ? '#fff' : 'rgba(255,255,255,0.8)',
                          borderRadius: '0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}>
                          {startup.fundingStatus}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Marketplace Section */}
            {activeTab === 'marketplace' && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
                    💼 Startup Marketplace
                  </h2>
                  <button style={{
                    padding: '0.5rem 1rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}>
                    + List Your Asset
                  </button>
                </div>
                
                {/* Search & Filters */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="Search marketplace..." 
                    value={marketplaceSearch}
                    onChange={(e) => setMarketplaceSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.5rem',
                      color: '#fff',
                      marginBottom: '0.75rem',
                      outline: 'none',
                      fontSize: '0.9rem'
                    }}
                  />
                  
                  <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
                    <select 
                      value={selectedListingType}
                      onChange={(e) => setSelectedListingType(e.target.value)}
                      style={{
                        flex: 1,
                        minWidth: '180px',
                        padding: '0.6rem 0.75rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        outline: 'none'
                      }}
                    >
                      {listingTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Listings Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                  {filteredMarketplaceListings.map(listing => (
                    <div key={listing.id} style={{
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(255,255,255,0.05)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }} onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(102,126,234,0.3)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.25)';
                    }} onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      {listing.image && (
                        <div style={{
                          height: '160px',
                          backgroundImage: `url(${listing.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }} />
                      )}
                      <div style={{ padding: '1.25rem' }}>
                        <div style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.5rem',
                          background: listing.type.includes('Investment') ? 'rgba(0,200,150,0.1)' : 'rgba(102,126,234,0.1)',
                          color: listing.type.includes('Investment') ? '#00C896' : '#a78bfa',
                          fontSize: '0.7rem',
                          borderRadius: '0.25rem',
                          marginBottom: '0.75rem',
                          fontWeight: 500
                        }}>
                          {listing.type}
                        </div>
                        <h3 style={{
                          color: '#fff',
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          marginBottom: '0.5rem'
                        }}>
                          {listing.title}
                        </h3>
                        <p style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '0.85rem',
                          marginBottom: '1rem',
                          lineHeight: '1.5'
                        }}>
                          {listing.description}
                        </p>
                        
                        <div style={{
                          display: 'flex',
                          gap: '1rem',
                          flexWrap: 'wrap',
                          marginBottom: '1rem'
                        }}>
                          {listing.revenue !== 'N/A' && (
                            <div style={{
                              background: 'rgba(255,215,0,0.08)',
                              padding: '0.35rem 0.75rem',
                              borderRadius: '0.5rem',
                              fontSize: '0.75rem',
                              color: '#FFD700'
                            }}>
                              Revenue: {listing.revenue}
                            </div>
                          )}
                          {listing.growth !== 'N/A' && (
                            <div style={{
                              background: 'rgba(0,200,150,0.08)',
                              padding: '0.35rem 0.75rem',
                              borderRadius: '0.5rem',
                              fontSize: '0.75rem',
                              color: '#00C896'
                            }}>
                              Growth: {listing.growth}
                            </div>
                          )}
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingTop: '1rem',
                          borderTop: '1px solid rgba(255,255,255,0.05)'
                        }}>
                          <div style={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: '#fff'
                          }}>
                            {listing.askingPrice}
                          </div>
                          <div style={{
                            display: 'flex',
                            gap: '1rem',
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '0.8rem'
                          }}>
                            <span>👁 {listing.views}</span>
                            <span>❤️ {listing.interested}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Recommendations Section */}
            {activeTab === 'ai-recommendations' && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
                    🤖 AI-Powered Matchmaking
                  </h2>
                  <button style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}>
                    Refresh Matches
                  </button>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  <select
                    value={aiRecommendationType}
                    onChange={(e) => setAiRecommendationType(e.target.value)}
                    style={{
                      padding: '0.6rem 0.75rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.5rem',
                      color: '#fff',
                      outline: 'none'
                    }}
                  >
                    {aiRecommendationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Recommendations List */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                  {filteredAIRecommendations.map(rec => (
                    <div key={rec.id} style={{
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '0.75rem',
                      padding: '1.25rem',
                      border: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.2s ease'
                    }} onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(102,126,234,0.3)'
                    }} onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                          position: 'relative' }}>
                          {rec.avatar ? (
                            <img src={rec.avatar} alt={rec.name} style={{
                              width: '64px',
                              height: '64px',
                              borderRadius: '0.75rem',
                              objectFit: 'cover'
                            }} />
                          ) : (
                            <div style={{
                              width: '64px',
                              height: '64px',
                              borderRadius: '0.75rem',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.5rem',
                              fontWeight: 'bold',
                              color: '#fff'
                            }}>
                              {rec.name.charAt(0)}
                            </div>
                          )}
                          {rec.verified && (
                            <div style={{
                              position: 'absolute',
                              bottom: '-4px',
                              right: '-4px',
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: '#00C896',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: '0.8rem'
                            }}>
                              ✓
                            </div>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                            {rec.name}
                          </h3>
                          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            {rec.title}
                          </p>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              background: 'rgba(102,126,234,0.1)',
                              color: '#a78bfa',
                              fontSize: '0.8rem',
                              borderRadius: '0.25rem',
                              fontWeight: 500
                            }}>
                              {rec.type}
                            </span>
                          </div>
                        </div>
                        <div style={{
                          background: rec.matchScore >= 90 ? 'rgba(0,200,150,0.1)' :
                          rec.matchScore >= 80 ? 'rgba(255,215,0,0.1)' :
                          'rgba(255,255,255,0.1)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.5rem',
                          fontWeight: 600,
                          color: rec.matchScore >=90 ? '#00C896' :
                          rec.matchScore >=80 ? '#FFD700' : 'rgba(255,255,255,0.8)',
                          fontSize: '0.9rem'
                        }}>
                          {rec.matchScore}%
                        </div>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                        {rec.bio}
                      </p>
                      <div style={{
                        background: 'rgba(102,126,234,0.1)',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem'
                      }}>
                        <p style={{ color: '#a78bfa', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: 0 }}>
                          💡 {rec.matchReason}
                        </p>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        marginBottom: '1rem'
                      }}>
                        {rec.tags.map(tag => (
                          <span key={tag} style={{
                            padding: '0.25rem 0.5rem',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '0.75rem',
                            borderRadius: '0.25rem'
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '0.75rem'
                      }}>
                        <button style={{
                          flex: 1,
                          padding: '0.75rem',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          borderRadius: '0.5rem',
                          color: '#fff',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}>
                          Connect
                        </button>
                        <button style={{
                          padding: '0.75rem 1rem',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '0.5rem',
                          color: '#fff',
                          fontSize: '0.9rem',
                          cursor: 'pointer'
                        }}>
                          Save
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Launch Hub */}
            {activeTab === 'product-launches' && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
                    🚀 Product Launch Hub
                  </h2>
                  <button style={{
                    padding: '0.75rem 1.25rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}>
                    + Launch Product
                  </button>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  <select
                    value={productLaunchCategory}
                    onChange={(e) => setProductLaunchCategory(e.target.value)}
                    style={{
                      padding: '0.6rem 0.75rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.5rem',
                      color: '#fff',
                      outline: 'none'
                    }}
                  >
                    {productLaunchCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Product of the Day */}
                {filteredProductLaunches[0] && filteredProductLaunches[0].featured && (
                  <div style={{
                    background: 'rgba(255,215,0,0.08)',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    border: '1px solid rgba(255,215,0,0.2)',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      borderRadius: '1rem',
                      color: '#000',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      marginBottom: '1rem'
                    }}>
                      🏆 Product of the Day
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                      {filteredProductLaunches[0].image && (
                        <img src={filteredProductLaunches[0].image} alt={filteredProductLaunches[0].title} style={{
                          width: '240px',
                          height: '160px',
                          borderRadius: '0.5rem',
                          objectFit: 'cover'
                        }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                          {filteredProductLaunches[0].title}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', marginBottom: '0.75rem' }}>
                          {filteredProductLaunches[0].tagline}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                          {filteredProductLaunches[0].description}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <button onClick={() => upvoteProductLaunch(filteredProductLaunches[0].id)} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem 1rem',
                            background: 'rgba(255,215,0,0.2)',
                            border: '1px solid rgba(255,215,0,0.3)',
                            borderRadius: '0.5rem',
                            color: '#FFD700',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 500
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2L15 8H21L16 12L18 19L12 15L6 19L8 12L3 8H9L12 2Z"></path>
                            </svg>
                            {filteredProductLaunches[0].upvotes} Upvotes
                          </button>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.85rem'
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            {filteredProductLaunches[0].comments} Comments
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other Launches Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                  {filteredProductLaunches.slice(filteredProductLaunches[0]?.featured ? 1 : 0).map(launch => (
                    <div key={launch.id} style={{
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(255,255,255,0.05)',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease'
                    }} onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)';
                    }} onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                    }}>
                      {launch.image && (
                        <img src={launch.image} alt={launch.title} style={{
                          width: '100%',
                          height: '160px',
                          objectFit: 'cover'
                        }} />
                      )}
                      <div style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          {launch.founderAvatar && (
                            <img src={launch.founderAvatar} alt={launch.founderName} style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%'
                            }} />
                          )}
                          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                            by {launch.founderName}
                          </span>
                        </div>
                        <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                          {launch.title}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                          {launch.tagline}
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            background: 'rgba(255,215,0,0.1)',
                            color: '#FFD700',
                            fontSize: '0.75rem',
                            borderRadius: '0.25rem'
                          }}>
                            {launch.category}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <button onClick={() => upvoteProductLaunch(launch.id)} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            background: 'rgba(255,215,0,0.1)',
                            border: 'none',
                            borderRadius: '0.5rem',
                            color: '#FFD700',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2L15 8H21L16 12L18 19L12 15L6 19L8 12L3 8H9L12 2Z"></path>
                            </svg>
                            {launch.upvotes}
                          </button>
                          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                            {Math.floor((Date.now() - launch.launchedAt.getTime()) / 3600000)}h ago
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Startup Tools */}
            {activeTab === 'startup-tools' && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    🛠️ Startup Tools
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                    Essential tools to help you build, launch, and scale your startup.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
                  {/* Pitch Deck Builder */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }} onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(102,126,234,0.3)';
                  }} onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '0.75rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                      </svg>
                    </div>
                    <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                      Pitch Deck Builder
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      Create beautiful, investor-ready pitch decks with AI-powered guidance and templates.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(102,126,234,0.1)',
                        color: '#a78bfa',
                        fontSize: '0.75rem',
                        borderRadius: '0.25rem'
                      }}>
                        10 Templates
                      </span>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(102,126,234,0.1)',
                        color: '#a78bfa',
                        fontSize: '0.75rem',
                        borderRadius: '0.25rem'
                      }}>
                        AI Tips
                      </span>
                    </div>
                  </div>

                  {/* Startup Valuation Calculator */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }} onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,200,150,0.3)';
                  }} onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '0.75rem',
                      background: 'linear-gradient(135deg, #00C896 0%, #34D399 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                    <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                      Valuation Calculator
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      Estimate your startup's valuation using multiple methods (DCF, comparables, etc.).
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(0,200,150,0.1)',
                        color: '#00C896',
                        fontSize: '0.75rem',
                        borderRadius: '0.25rem'
                      }}>
                        5 Methods
                      </span>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(0,200,150,0.1)',
                        color: '#00C896',
                        fontSize: '0.75rem',
                        borderRadius: '0.25rem'
                      }}>
                        Save Results
                      </span>
                    </div>
                  </div>

                  {/* Burn Rate Calculator */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }} onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)';
                  }} onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '0.75rem',
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                    </div>
                    <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                      Burn Rate & Runway
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      Calculate your monthly burn rate and how long your runway will last.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(255,215,0,0.1)',
                        color: '#FFD700',
                        fontSize: '0.75rem',
                        borderRadius: '0.25rem'
                      }}>
                        Real-time
                      </span>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(255,215,0,0.1)',
                        color: '#FFD700',
                        fontSize: '0.75rem',
                        borderRadius: '0.25rem'
                      }}>
                        Forecasting
                      </span>
                    </div>
                  </div>

                  {/* Investor CRM */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }} onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(236,72,153,0.3)';
                  }} onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '0.75rem',
                      background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                      Investor CRM
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      Track your investor conversations, warm intros, and fundraising pipeline.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(167,139,250,0.1)',
                        color: '#a78bfa',
                        fontSize: '0.75rem',
                        borderRadius: '0.25rem'
                      }}>
                        Pipeline
                      </span>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(167,139,250,0.1)',
                        color: '#a78bfa',
                        fontSize: '0.75rem',
                        borderRadius: '0.25rem'
                      }}>
                        Reminders
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Funding Hub */}
            {activeTab === 'funding-hub' && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    💰 Funding Hub
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                    Find grants, accelerators, investors, and funding opportunities tailored to your startup.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  {/* Accelerator Card */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '1.25rem',
                    transition: 'all 0.2s ease'
                  }} onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(102,126,234,0.3)';
                  }} onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      background: 'rgba(102,126,234,0.1)',
                      color: '#a78bfa',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      borderRadius: '0.25rem',
                      display: 'inline-block',
                      marginBottom: '0.75rem'
                    }}>
                      Accelerator
                    </div>
                    <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                      Y Combinator
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      3-month program that helps startups launch with $125k for 7% equity.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                        Deadline: Rolling
                      </span>
                      <button style={{
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(102,126,234,0.2)',
                        border: 'none',
                        borderRadius: '0.35rem',
                        color: '#a78bfa',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}>
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Grant Card */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '1.25rem',
                    transition: 'all 0.2s ease'
                  }} onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,200,150,0.3)';
                  }} onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      background: 'rgba(0,200,150,0.1)',
                      color: '#00C896',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      borderRadius: '0.25rem',
                      display: 'inline-block',
                      marginBottom: '0.75rem'
                    }}>
                      Grant
                    </div>
                    <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                      TechStars Founders Fund
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      $20k - $100k grants for early-stage startups in tech and healthcare.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                        Deadline: Jun 30
                      </span>
                      <button style={{
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(0,200,150,0.2)',
                        border: 'none',
                        borderRadius: '0.35rem',
                        color: '#00C896',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}>
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* VC Firm Card */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '1.25rem',
                    transition: 'all 0.2s ease'
                  }} onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)';
                  }} onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      background: 'rgba(255,215,0,0.1)',
                      color: '#FFD700',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      borderRadius: '0.25rem',
                      display: 'inline-block',
                      marginBottom: '0.75rem'
                    }}>
                      VC Firm
                    </div>
                    <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                      Sequoia Capital
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      Seed to Series C investments in AI, fintech, and enterprise software.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                        Check Size: $1M-$10M
                      </span>
                      <button style={{
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(255,215,0,0.15)',
                        border: 'none',
                        borderRadius: '0.35rem',
                        color: '#FFD700',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Feed Posts */}
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
                      <ThumbUpIcon animate={animatingPostId === post.id} />
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
                              setShowDetailedProfile(true);
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
                      {post.comments.map(comment => renderComment(comment))}
                    </div>
                  )}
                </article>
              ))}
            </div>


          </div>
        </div>
      </div>

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
              <div className="drawer-role">{getUserRole()}</div>
            </div>
            {showEcosystemOverview ? (
              <div>
                <div className="drawer-item" onClick={() => setShowEcosystemOverview(false)}>← Back</div>
                <div className="p-4">
                  <div className="card-header">
                    <h4>Ecosystem Overview</h4>
                  </div>
                  <div className="overview-metrics">
                    <div className="overview-metric">
                      <div className="metric-label">Startups</div>
                      <div className="metric-value-row">
                        <span className="metric-number">2,451</span>
                        <span className="metric-change positive">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 12 12 6 18 12"></polyline>
                            <line x1="12" y1="6" x2="12" y2="21"></line>
                          </svg>
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
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 12 12 6 18 12"></polyline>
                            <line x1="12" y1="6" x2="12" y2="21"></line>
                          </svg>
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
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 12 12 6 18 12"></polyline>
                            <line x1="12" y1="6" x2="12" y2="21"></line>
                          </svg>
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
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 12 12 6 18 12"></polyline>
                            <line x1="12" y1="6" x2="12" y2="21"></line>
                          </svg>
                          +18%
                        </span>
                      </div>
                      <div className="metric-chart gold-chart"></div>
                    </div>
                  </div>
                  <button className="view-report-btn">View full report →</button>
                </div>
              </div>
            ) : (
              <div className="drawer-menu">
                <div className="drawer-item" onClick={() => navigate('/profile')}>Profile</div>
                <div className="drawer-item" onClick={() => setShowEcosystemOverview(true)}>Ecosystem Overview</div>
                <div className="drawer-item" onClick={() => navigate('/settings')}>Settings</div>
                <div className="drawer-item">Account</div>
                <div className="drawer-item">Upgradation</div>
                <div className="drawer-item">Support & Feedback</div>
                <div className="drawer-item divider">Log Out</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {createPostOpen && (
        <CreatePost 
          role={userRole} 
          onClose={() => setCreatePostOpen(false)} 
        />
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



      {/* AI Copilot Component */}
      <AICopilot isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />
    </div>
  );
};

export default StartupDashboard;
