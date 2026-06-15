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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
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
    return userData?.profile?.name || profile?.name || "Unnati Chaudhary";
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
            <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
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
          <span className="sd-logo-text">TRIARCORA</span>
        </div>

        {/* Navigation */}
        <nav className="sd-nav">
          <div className="sd-nav-item" onClick={() => navigate('/home')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Home</span>
          </div>
          <div className="sd-nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>
            <span>Architects</span>
          </div>
          <div className="sd-nav-item" onClick={() => navigate('/my-startup')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
            <span>My Startup</span>
          </div>
          <div className="sd-nav-item" onClick={() => navigate('/investors')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span>Catalysts</span>
          </div>

          <div className="sd-nav-item" onClick={() => navigate('/startup-studio')}>
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 0 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
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
                    placeholder="Search startups…" 
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5a3 3 0 1 0-5.997.125A4 4 0 0 0 4 9v.5a3.5 3.5 0 0 0 6.173 1.763A2 2 0 0 0 11 12.5v.5A1.5 1.5 0 0 0 12.5 14.5H14a2 2 0 1 0 0-4h-.5a.5a 0 0 1-.5-.5V9a3 3 0 0 0-6 0v.5a.5a 0 0 1-.5.5H6a1 1 0 1 0 0 2h.5a.5a 0 0 1 .5.5v.5a3 3 0 1 0 6 0v-.5a.5a 0 0 1-.5-.5h.5a1 1 0 0 0 1-1v-1a3 3 0 0 0-6 0v.5a.5a 0 0 1-.5.5H9"></path></svg>
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
          </div>
        </div>
      </div>

      {/* Create Post Component */}
      {createPostOpen && <CreatePost onClose={() => setCreatePostOpen(false)} />}
      
      {/* AI Copilot Component */}
      <AICopilot isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />
    </div>
  );
};

export default StartupDashboard;
