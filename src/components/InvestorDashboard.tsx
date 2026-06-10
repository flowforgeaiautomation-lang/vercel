import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateInvestorPost from './CreateInvestorPost';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { UserProfile, usePosts } from '../contexts/PostContext';
import AICopilot from './AICopilot';
import PrestigeStarBadge from './PrestigeStarBadge';
import './InvestorDashboard.css';

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

const InvestorDashboard = () => {
  const { profile } = useAuth();
  const { userData } = useUser();
  const { likePost, posts, demoUsers, addComment, savePost, unsavePost, savedPosts } = usePosts();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('discover');
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const userRole = userData?.mainRole || 'CATALYST';
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
    return userData?.profile?.name || profile?.name || 'Sarah Chen';
  };

  const getUserRole = () => {
    return userData?.mainRole || profile?.role || 'Catalyst';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
    return defaultImages[userRole] || defaultImages['CATALYST'];
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
                  background: commentText.trim() ? 'linear-gradient(135deg, #00C896, #00A876)' : 'rgba(255,255,255,0.1)', 
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

  return (
    <div className="id-container">
      <div className="id-left-sidebar">
        <div className="id-logo">
          <div className="id-logo-icon">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#00C896'}} />
                  <stop offset="100%" style={{stopColor:'#34D399'}} />
                </linearGradient>
              </defs>
              <polygon points="20,80 50,20 80,80" fill="url(#logoGrad)" />
              <text x="50" y="72" textAnchor="middle" fill="#000" fontSize="28" fontWeight="800" fontFamily="Arial">T</text>
            </svg>
          </div>
          <span className="id-logo-text">TRIVEON</span>
        </div>

        <nav className="id-nav">
          <div className="id-nav-item" onClick={() => navigate('/home')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 0-2 2H5a2 2 0 0 1-2-2z"></path></svg>
            <span>Home</span>
          </div>
          <div className="id-nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span>Catalysts</span>
          </div>
          <div className="id-nav-item" onClick={() => navigate('/startups')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
            <span>Architects</span>
          </div>
          <div className="id-nav-item" onClick={() => navigate('/my-investments')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
            <span>My Investments</span>
          </div>
          <div className="id-nav-item" onClick={() => navigate('/explorers')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span>Explorers</span>
          </div>
          <div className="id-nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>
            <span>Syndicates</span>
          </div>
          <div className="id-nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span>VCs & Funds</span>
          </div>
          <div className="id-nav-item" onClick={() => navigate('/catalyst-studio')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" /></svg>
            <span>Catalyst Studio</span>
          </div>
        </nav>

        <div className="id-copilot-card" onClick={() => setCopilotOpen(true)}>
          <div className="id-copilot-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"></polygon></svg>
          </div>
          <div className="id-copilot-content">
            <strong>AI Copilot</strong>
            <span>Your deal assistant</span>
          </div>
        </div>
      </div>

      <div className="id-main">
        <header className="feed-header">
          <div className="search-bar">
            <SearchIcon />
            <input type="text" placeholder="Search investors, startups, deals..." />
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

        <div className="id-content">
          <div className="id-main-col">
            <div className="id-page-title">
              <div className="id-title">
                <h1>Investors</h1>
                <p>Your hub for deal flow, portfolio, and network</p>
              </div>
              <button className="id-customize">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 0 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                Customize Feed
              </button>
            </div>

            <div className="id-tabs">
              <div className={`id-tab ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline></svg>
                Active Investors
              </div>
              <div className={`id-tab ${activeTab === 'top' ? 'active' : ''}`} onClick={() => setActiveTab('top')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"></polygon></svg>
                Top VCs
              </div>
              <div className={`id-tab ${activeTab === 'angel' ? 'active' : ''}`} onClick={() => setActiveTab('angel')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                Angels
              </div>
            </div>

            <div className="id-quick-cards">
              <div className="id-quick-card">
                <div className="id-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <div className="id-card-text">
                  <strong>Portfolio Overview</strong>
                  <p>Track your investments and returns</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6"></polyline></svg>
              </div>

              <div className="id-quick-card">
                <div className="id-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline><polyline points="17,6 23,6 23,12"></polyline></svg>
                </div>
                <div className="id-card-text">
                  <strong>Deal Pipeline</strong>
                  <p>Manage your incoming deal flow</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6"></polyline></svg>
              </div>

              <div className="id-quick-card">
                <div className="id-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div className="id-card-text">
                  <strong>Co-investors</strong>
                  <p>Find partners for your deals</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6"></polyline></svg>
              </div>

              <div className="id-quick-card">
                <div className="id-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"></polygon></svg>
                </div>
                <div className="id-card-text">
                  <strong>AI Copilot</strong>
                  <p>Get deal recommendations</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6"></polyline></svg>
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
                        background: 'linear-gradient(135deg, #00C896, #00A876)', 
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
                          background: commentText.trim() ? 'linear-gradient(135deg, #00C896, #00A876)' : 'rgba(255,255,255,0.1)', 
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

      {createPostOpen && (
        <CreateInvestorPost 
          onClose={() => setCreatePostOpen(false)} 
        />
      )}
      
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
                  background: `conic-gradient(${viewProfilePopUp.userRole === 'ARCHITECT' ? '#B8860B' : viewProfilePopUp.userRole === 'CATALYST' ? '#00C896' : '#3B82F6'} 0% ${viewProfilePopUp.userCredibility?.score || 75}%, rgba(255,255,255,0.1) ${viewProfilePopUp.userCredibility?.score || 75}% 100%)`,
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
                      {viewProfilePopUp.userCredibility?.score || 75}
                    </span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  {viewProfilePopUp.userCredibility?.investeeCount !== undefined && (
                    <div style={{ marginBottom: '0.4rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Investee Count:</span>
                      <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}> {viewProfilePopUp.userCredibility.investeeCount}</span>
                    </div>
                  )}
                  {viewProfilePopUp.userCredibility?.years !== undefined && (
                    <div style={{ marginBottom: '0.4rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Years Active:</span>
                      <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}> {viewProfilePopUp.userCredibility.years}</span>
                    </div>
                  )}
                  {viewProfilePopUp.userCredibility?.companies !== undefined && (
                    <div style={{ marginBottom: '0.4rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Exits:</span>
                      <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}> {viewProfilePopUp.userCredibility.companies}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {viewProfilePopUp.tags && viewProfilePopUp.tags.length > 0 && (
              <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 600, marginBottom: '1rem' }}>Focus Areas</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {viewProfilePopUp.tags.map((tag, idx) => (
                    <span key={idx} style={{
                      padding: '0.4rem 0.8rem',
                      background: 'rgba(139, 92, 246, 0.15)',
                      color: '#d8b4fe',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 500
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {viewProfilePopUp.userLinks && (
              <div style={{ padding: '1.5rem' }}>
                <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 600, marginBottom: '1rem' }}>Links</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {viewProfilePopUp.userLinks.linkedin && (
                    <a href={viewProfilePopUp.userLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{
                      padding: '0.6rem 1.25rem',
                      background: 'rgba(255,255,255,0.06)',
                      color: '#fff',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }} onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(0,200,150,0.2)';
                      e.currentTarget.style.color = '#00C896';
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.color = '#fff';
                    }}>
                      LinkedIn
                    </a>
                  )}
                  {viewProfilePopUp.userLinks.website && (
                    <a href={viewProfilePopUp.userLinks.website} target="_blank" rel="noopener noreferrer" style={{
                      padding: '0.6rem 1.25rem',
                      background: 'rgba(255,255,255,0.06)',
                      color: '#fff',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }} onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(0,200,150,0.2)';
                      e.currentTarget.style.color = '#00C896';
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.color = '#fff';
                    }}>
                      Website
                    </a>
                  )}
                  {viewProfilePopUp.userLinks.twitter && (
                    <a href={viewProfilePopUp.userLinks.twitter} target="_blank" rel="noopener noreferrer" style={{
                      padding: '0.6rem 1.25rem',
                      background: 'rgba(255,255,255,0.06)',
                      color: '#fff',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }} onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(0,200,150,0.2)';
                      e.currentTarget.style.color = '#00C896';
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.color = '#fff';
                    }}>
                      Twitter
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <AICopilot isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />
      
      {/* Create Post Modal */}
      {createPostOpen && (
        <CreateInvestorPost 
          onClose={() => setCreatePostOpen(false)} 
        />
      )}
      

    </div>
  );
};

export default InvestorDashboard;
