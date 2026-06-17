import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePost from './CreatePost';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { UserProfile, usePosts } from '../contexts/PostContext';
import AICopilot from './AICopilot';
import PrestigeStarBadge from './PrestigeStarBadge';
import PostMenu from './PostMenu';
import './StartupDashboard.css';

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

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

const StartupDashboard = () => {
  const { userName, userRole, userProfileImage, userData } = useUser();
  const { startups, marketplaceListings, aiRecommendations, productLaunches, upvoteProductLaunch, likePost, posts, demoUsers, addComment, savePost, unsavePost, savedPosts, hiddenPosts, mutedUsers } = usePosts();
  const [productLaunchCategory, setProductLaunchCategory] = useState('All');
  
  // Filters for AI recommendations
  const [aiRecommendationType, setAiRecommendationType] = useState('All');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('feed'); // Default to feed!
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  // Filter posts to ONLY show ARCHITECT (founder/startup) posts!
  const feedPosts = posts.filter((post) => post.userRole.toUpperCase() === 'ARCHITECT' && !hiddenPosts.includes(post.id) && !mutedUsers.includes(post.userId));
  const [showEcosystemOverview, setShowEcosystemOverview] = useState(false);
  const [viewProfilePopUp, setViewProfilePopUp] = useState<UserProfile | null>(null);
  const [showDetailedProfile, setShowDetailedProfile] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [animatingPostId, setAnimatingPostId] = useState<string | null>(null);
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);


  const handleLikePost = (postId: string) => {
    likePost(postId);
    setAnimatingPostId(postId);
    setTimeout(() => setAnimatingPostId(null), 1200);
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
      userName: userName,
      userAvatar: userProfileImage,
      userRole: userRole,
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
  const [customIndustry, setCustomIndustry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [customCountry, setCustomCountry] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [customStage, setCustomStage] = useState('');
  const [selectedRevenue, setSelectedRevenue] = useState('All');
  const [customRevenue, setCustomRevenue] = useState('');
  const [selectedTeamSize, setSelectedTeamSize] = useState('All');
  const [customTeamSize, setCustomTeamSize] = useState('');
  const [selectedGrowth, setSelectedGrowth] = useState('All');
  const [customGrowth, setCustomGrowth] = useState('');
  const [selectedTechnology, setSelectedTechnology] = useState('All');
  const [customTechnology, setCustomTechnology] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  // Filters for marketplace
  const [marketplaceSearch, setMarketplaceSearch] = useState('');
  const [selectedListingType, setSelectedListingType] = useState('All');

  // Filter startups based on selected filters
  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          startup.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          startup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const industryFilter = selectedIndustry === 'Custom' ? customIndustry : selectedIndustry;
    const matchesIndustry = industryFilter === 'All' || startup.industry.toLowerCase().includes(industryFilter.toLowerCase());
    
    const countryFilter = selectedCountry === 'Custom' ? customCountry : selectedCountry;
    const matchesCountry = countryFilter === 'All' || startup.location.toLowerCase().includes(countryFilter.toLowerCase());
    
    const stageFilter = selectedStage === 'Custom' ? customStage : selectedStage;
    const matchesStage = stageFilter === 'All' || startup.stage.toLowerCase().includes(stageFilter.toLowerCase());
    
    const revenueFilter = selectedRevenue === 'Custom' ? customRevenue : selectedRevenue;
    const matchesRevenue = revenueFilter === 'All' || startup.revenue.toLowerCase().includes(revenueFilter.toLowerCase());
    
    const teamSizeFilter = selectedTeamSize === 'Custom' ? customTeamSize : selectedTeamSize;
    const matchesTeamSize = teamSizeFilter === 'All' || startup.teamSize.toLowerCase().includes(teamSizeFilter.toLowerCase());
    
    const growthFilter = selectedGrowth === 'Custom' ? customGrowth : selectedGrowth;
    const matchesGrowth = growthFilter === 'All' || startup.growth.toLowerCase().includes(growthFilter.toLowerCase());
    
    const techFilter = selectedTechnology === 'Custom' ? customTechnology : selectedTechnology;
    const matchesTechnology = techFilter === 'All' || (startup.technology && startup.technology.some(t => t.toLowerCase().includes(techFilter.toLowerCase())));
    
    return matchesSearch && matchesIndustry && matchesCountry && matchesStage && matchesRevenue && matchesTeamSize && matchesGrowth && matchesTechnology;
  });

  // Comprehensive industry list as requested
  const industries = [
    'All', 'Artificial Intelligence', 'SaaS', 'FinTech', 'EdTech', 'HealthTech', 
    'ClimateTech', 'BioTech', 'AgriTech', 'Robotics', 'SpaceTech', 'Cybersecurity', 
    'Web3', 'Gaming', 'E-Commerce', 'Creator Economy', 'Logistics', 'Manufacturing', 
    'Real Estate', 'Energy', 'Mobility', 'Quantum Computing'
  ];

  // Country list
  const countries = ['All', ...new Set(startups.map(s => s.location))];

  const stages = ['All', ...new Set(startups.map(s => s.stage))];
  const revenues = ['All', ...new Set(startups.map(s => s.revenue))];
  const teamSizes = ['All', ...new Set(startups.map(s => s.teamSize))];
  const growths = ['All', ...new Set(startups.map(s => s.growth))];
  
  // Technology list
  const technologies = ['All', ...new Set(startups.flatMap(s => s.technology || []))];

  // Calculate paginated startups
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStartups = filteredStartups.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStartups.length / itemsPerPage);

  // Intelligent recommendations - based on user interests and saved startups
  const intelligentRecommendations = (() => {
    // For demo purposes, let's score startups based on relevance
    return [...startups]
      .map(startup => {
        let score = 0;
        // Score based on industry match with user preferences (demo)
        score += Math.random() * 50;
        // Score based on growth rate
        if (startup.growth === 'High') score += 30;
        if (startup.growth === 'Medium') score += 15;
        return { ...startup, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  })();
  
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
            </div>

            {/* Create Post Area */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '0.75rem',
              padding: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                fontWeight: 'bold'
              }}>
                {userData?.profile?.name ? userData.profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div 
                onClick={() => setCreatePostOpen(true)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '2rem',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer'
                }}
              >
                Share an update, launch, or milestone...
              </div>
            </div>

            {/* Tabs */}
            <div className="sd-tabs">
              <div className={`sd-tab ${activeTab === 'feed' ? 'active' : ''}`} onClick={() => setActiveTab('feed')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                Feed
              </div>
              <div className={`sd-tab ${activeTab === 'discover' ? 'active' : ''}`} onClick={() => setActiveTab('discover')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                Discover
              </div>
            </div>

            {/* Startup Feed Section */}
            {activeTab === 'feed' && (
              <>
                <div className="feed-posts">
                  {feedPosts.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '3rem 1rem',
                      color: 'rgba(255,255,255,0.6)'
                    }}>
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem', opacity: 0.5 }}>
                        <path d="M12 2L15 8H21L16 12L18 19L12 15L6 19L8 12L3 8H9L12 2Z"></path>
                      </svg>
                      <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No Startup Updates Yet</h3>
                      <p>Be the first to share an update with the ecosystem!</p>
                    </div>
                  ) : (
                    feedPosts.map(post => {
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
                      <article className="feed-post" key={post.id} style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '0.75rem',
                        padding: '1rem',
                        marginBottom: '1rem'
                      }}>
                        <div className="post-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                          <div className="post-author" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <div className="author-avatar" style={{ 
                              width: '40px', 
                              height: '40px', 
                              borderRadius: '50%', 
                              background: 'linear-gradient(135deg, #FFD700, #FFA500)', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              color: '#000',
                              fontWeight: 'bold'
                            }}>
                              {post.userAvatar ? (
                                <img src={post.userAvatar} alt={post.userName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                              ) : (
                                getInitials(post.userName)
                              )}
                            </div>
                            <div className="author-info">
                              <div className="author-name" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {post.userName}
                                <span className="author-username" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>@{post.userUsername}</span>
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
                              <span className="post-time" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{formatTimestamp(post.timestamp)}</span>
                            </div>
                          </div>
                          <button 
                            className="post-menu-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuPostId(post.id);
                            }}
                            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                          >
                            ⋮
                          </button>
                        </div>

                        <div className="post-content">
                          <h3 className="post-title" style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#fff' }}>{post.postType}</h3>
                          <div className="post-tags" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                            {post.tags.map(tag => <span key={tag} className="post-tag" style={{
                              padding: '0.25rem 0.5rem',
                              background: 'rgba(255,215,0,0.1)',
                              color: '#FFD700',
                              borderRadius: '0.5rem',
                              fontSize: '0.75rem'
                            }}>#{tag}</span>)}
                          </div>
                          <p className="post-text" style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '1.5' }}>{post.description}</p>
                        </div>

                        <div className="post-actions" style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <div
                            className="post-action"
                            onClick={() => handleLikePost(post.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              color: post.likedBy.includes(userData?.uid || 'current-user')
                                ? '#FFD700'
                                : 'rgba(255,255,255,0.6)',
                              cursor: 'pointer'
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span>{post.likes}</span>
                          </div>
                          <div className="post-action" onClick={() => setCommentingPostId(commentingPostId === post.id ? null : post.id)} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'rgba(255,255,255,0.6)',
                            cursor: 'pointer'
                          }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <span>{post.comments.length}</span>
                          </div>
                          <div className="post-action" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'rgba(255,255,255,0.6)',
                            cursor: 'pointer'
                          }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="18" cy="5" r="3"></circle>
                              <circle cx="6" cy="12" r="3"></circle>
                              <circle cx="18" cy="19" r="3"></circle>
                              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                            </svg>
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
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              color: savedPosts.includes(post.id)
                                ? '#FFD700'
                                : 'rgba(255,255,255,0.6)',
                              cursor: 'pointer',
                              marginLeft: 'auto'
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                            </svg>
                          </div>
                        </div>

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
                              placeholder="Add a comment..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment(post.id)}
                              style={{
                                flex: 1,
                                padding: '0.75rem 1rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '0.5rem',
                                color: '#fff',
                                outline: 'none'
                              }}
                            />
                            <button
                              onClick={() => handleSubmitComment(post.id)}
                              disabled={!commentText.trim()}
                              style={{
                                padding: '0.75rem 1.25rem',
                                background: commentText.trim() ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '0.5rem',
                                color: commentText.trim() ? '#000' : 'rgba(255,255,255,0.3)',
                                fontWeight: 600,
                                cursor: commentText.trim() ? 'pointer' : 'not-allowed'
                              }}
                            >
                              Post
                            </button>
                          </div>
                        )}

                        {post.comments.length > 0 && (
                          <div style={{
                            marginTop: '1rem',
                            paddingTop: '1rem',
                            borderTop: '1px solid rgba(255,255,255,0.05)'
                          }}>
                            {post.comments.slice(0, 2).map(comment => (
                              <div key={comment.id} style={{
                                display: 'flex',
                                gap: '0.75rem',
                                marginBottom: '1rem',
                                paddingLeft: comment.parentId ? '2rem' : '0'
                              }}>
                                <div style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: comment.userRole === 'ARCHITECT' 
                                    ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
                                    : comment.userRole === 'CATALYST' 
                                    ? 'linear-gradient(135deg, #00C896, #00A876)' 
                                    : 'linear-gradient(135deg, #06B6D4, #0891B2)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.8rem',
                                  fontWeight: 'bold',
                                  color: '#fff',
                                  flexShrink: 0
                                }}>
                                  {getInitials(comment.userName)}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#fff' }}>
                                      {comment.userName}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                                      2h ago
                                    </span>
                                  </div>
                                  <p style={{ 
                                    fontSize: '0.9rem', 
                                    color: 'rgba(255,255,255,0.85)', 
                                    margin: 0,
                                    lineHeight: '1.5'
                                  }}>
                                    {comment.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {post.comments.length > 2 && (
                              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                                View {post.comments.length - 2} more comments
                              </div>
                            )}
                          </div>
                        )}
                      </article>
                    );})
                  )}
                </div>
              </>
            )}



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
                    {/* Industry */}
                    <div style={{flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                      <select 
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        style={{
                          width: '100%',
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
                        <option value="Custom">✏️ Write your own</option>
                      </select>
                      {selectedIndustry === 'Custom' && (
                        <input
                          type="text"
                          value={customIndustry}
                          onChange={(e) => setCustomIndustry(e.target.value)}
                          placeholder="Enter industry..."
                          style={{
                            width: '100%',
                            padding: '0.6rem 0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,215,0,0.3)',
                            borderRadius: '0.5rem',
                            color: '#fff',
                            outline: 'none'
                          }}
                        />
                      )}
                    </div>

                    {/* Country */}
                    <div style={{flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                      <select 
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.75rem',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '0.5rem',
                          color: '#fff',
                          outline: 'none'
                        }}
                      >
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                        <option value="Custom">✏️ Write your own</option>
                      </select>
                      {selectedCountry === 'Custom' && (
                        <input
                          type="text"
                          value={customCountry}
                          onChange={(e) => setCustomCountry(e.target.value)}
                          placeholder="Enter country..."
                          style={{
                            width: '100%',
                            padding: '0.6rem 0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,215,0,0.3)',
                            borderRadius: '0.5rem',
                            color: '#fff',
                            outline: 'none'
                          }}
                        />
                      )}
                    </div>

                    {/* Stage */}
                    <div style={{flex: 1, minWidth: '120px', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                      <select 
                        value={selectedStage}
                        onChange={(e) => setSelectedStage(e.target.value)}
                        style={{
                          width: '100%',
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
                        <option value="Custom">✏️ Write your own</option>
                      </select>
                      {selectedStage === 'Custom' && (
                        <input
                          type="text"
                          value={customStage}
                          onChange={(e) => setCustomStage(e.target.value)}
                          placeholder="Enter stage..."
                          style={{
                            width: '100%',
                            padding: '0.6rem 0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,215,0,0.3)',
                            borderRadius: '0.5rem',
                            color: '#fff',
                            outline: 'none'
                          }}
                        />
                      )}
                    </div>

                    {/* Revenue */}
                    <div style={{flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                      <select 
                        value={selectedRevenue}
                        onChange={(e) => setSelectedRevenue(e.target.value)}
                        style={{
                          width: '100%',
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
                        <option value="Custom">✏️ Write your own</option>
                      </select>
                      {selectedRevenue === 'Custom' && (
                        <input
                          type="text"
                          value={customRevenue}
                          onChange={(e) => setCustomRevenue(e.target.value)}
                          placeholder="Enter revenue..."
                          style={{
                            width: '100%',
                            padding: '0.6rem 0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,215,0,0.3)',
                            borderRadius: '0.5rem',
                            color: '#fff',
                            outline: 'none'
                          }}
                        />
                      )}
                    </div>

                    {/* Team Size */}
                    <div style={{flex: 1, minWidth: '120px', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                      <select 
                        value={selectedTeamSize}
                        onChange={(e) => setSelectedTeamSize(e.target.value)}
                        style={{
                          width: '100%',
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
                        <option value="Custom">✏️ Write your own</option>
                      </select>
                      {selectedTeamSize === 'Custom' && (
                        <input
                          type="text"
                          value={customTeamSize}
                          onChange={(e) => setCustomTeamSize(e.target.value)}
                          placeholder="Enter team size..."
                          style={{
                            width: '100%',
                            padding: '0.6rem 0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,215,0,0.3)',
                            borderRadius: '0.5rem',
                            color: '#fff',
                            outline: 'none'
                          }}
                        />
                      )}
                    </div>

                    {/* Growth */}
                    <div style={{flex: 1, minWidth: '120px', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                      <select 
                        value={selectedGrowth}
                        onChange={(e) => setSelectedGrowth(e.target.value)}
                        style={{
                          width: '100%',
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
                        <option value="Custom">✏️ Write your own</option>
                      </select>
                      {selectedGrowth === 'Custom' && (
                        <input
                          type="text"
                          value={customGrowth}
                          onChange={(e) => setCustomGrowth(e.target.value)}
                          placeholder="Enter growth..."
                          style={{
                            width: '100%',
                            padding: '0.6rem 0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,215,0,0.3)',
                            borderRadius: '0.5rem',
                            color: '#fff',
                            outline: 'none'
                          }}
                        />
                      )}
                    </div>

                    {/* Technology */}
                    {technologies.length > 1 && (
                      <div style={{flex: 1, minWidth: '120px', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                        <select 
                          value={selectedTechnology}
                          onChange={(e) => setSelectedTechnology(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.6rem 0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '0.5rem',
                            color: '#fff',
                            outline: 'none'
                          }}
                        >
                          {technologies.map(tech => (
                            <option key={tech} value={tech}>{tech}</option>
                          ))}
                          <option value="Custom">✏️ Write your own</option>
                        </select>
                        {selectedTechnology === 'Custom' && (
                          <input
                            type="text"
                            value={customTechnology}
                            onChange={(e) => setCustomTechnology(e.target.value)}
                            placeholder="Enter technology..."
                            style={{
                              width: '100%',
                              padding: '0.6rem 0.75rem',
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,215,0,0.3)',
                              borderRadius: '0.5rem',
                              color: '#fff',
                              outline: 'none'
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Intelligent Recommendations */}
                {!searchQuery && selectedIndustry === 'All' && selectedCountry === 'All' && selectedStage === 'All' && selectedRevenue === 'All' && selectedTeamSize === 'All' && selectedGrowth === 'All' && selectedTechnology === 'All' && (
                  <div style={{marginBottom: '2rem'}}>
                    <h3 style={{color: '#fff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem'}}>Recommended For You</h3>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem'}}>
                      {intelligentRecommendations.map(startup => (
                        <div key={startup.id} style={{
                          background: 'rgba(255,215,0,0.05)',
                          borderRadius: '0.75rem',
                          padding: '1rem',
                          border: '1px solid rgba(255,215,0,0.2)',
                          transition: 'all 0.2s ease'
                        }} onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(255,215,0,0.1)';
                        }} onMouseOut={(e) => {
                          e.currentTarget.style.background = 'rgba(255,215,0,0.05)';
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
                  </div>
                )}
                
                {/* Startup Cards Grid */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
                  {currentStartups.map(startup => (
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center'}}>
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.5rem',
                        color: currentPage === 1 ? 'rgba(255,255,255,0.3)' : '#fff',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          background: currentPage === page ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '0.5rem',
                          color: '#fff',
                          cursor: 'pointer'
                        }}
                      >
                        {page}
                      </button>
                    ))}
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.5rem',
                        color: currentPage === totalPages ? 'rgba(255,255,255,0.3)' : '#fff',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}


          </div>
        </div>
      </div>

      {/* Create Post Component */}
      {createPostOpen && <CreatePost onClose={() => setCreatePostOpen(false)} />}
      
      {/* AI Copilot Component */}
      <AICopilot isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />
      
      {/* Post Menu Component */}
      {openMenuPostId && (
        <PostMenu 
          post={feedPosts.find(p => p.id === openMenuPostId)!}
          onClose={() => setOpenMenuPostId(null)}
        />
      )}
    </div>
  );
};

export default StartupDashboard;
