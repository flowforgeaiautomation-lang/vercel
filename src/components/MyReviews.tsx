import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import AICopilot from './AICopilot';
import './MyReviews.css';

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

const CompassIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const MyReviews = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { userData } = useUser();
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const getUserProfileImage = () => {
    if (userData?.profile?.profileImage) {
      return userData.profile.profileImage;
    }
    return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&h=180&fit=crop&crop=face';
  };

  const getUserName = () => {
    return userData?.profile?.name || profile?.name || 'Aarav Mehta';
  };

  return (
    <div className="my-reviews-container">
      <div className="my-reviews-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">TRIVEON</span>
            <span className="brand-tagline">DISCOVER. REVIEW. IMPACT.</span>
          </div>
        </div>

        <div className="role-indicator">
          <div className="role-dot"></div>
          <span className="role-label">EXPLORER</span>
        </div>

        <nav className="id-nav">
          <div className="id-nav-item" onClick={() => navigate('/home')}>
            <HomeIcon />
            <span>Home</span>
          </div>
          <div className="id-nav-item" onClick={() => navigate('/explorers')}>
            <CompassIcon />
            <span>Explorer</span>
          </div>
          <div className="id-nav-item active">
            <StarIcon />
            <span>My Reviews</span>
          </div>
        </nav>

        <div className="explorer-score-card">
          <div className="score-circle">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
              <circle cx="60" cy="60" r="50" stroke="url(#score-gradient)" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray="250 314" transform="rotate(-90 60 60)" />
              <defs>
                <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <text x="60" y="60" textAnchor="middle" dy=".3em" fill="white" fontSize="30" fontWeight="700">860</text>
            </svg>
          </div>
          <div className="score-label">Explorer Score</div>
          <div className="score-sub">Advanced Explorer</div>
          <button className="view-progress-btn">View Progress</button>
        </div>

        <div className="sidebar-user-section">
          <div className="user-avatar-small">
            <img src={getUserProfileImage()} alt={getUserName()} />
          </div>
          <div className="user-info-small">
            <div className="user-name-small">{getUserName()}</div>
            <div className="user-role-small">Explorer</div>
          </div>
        </div>
      </div>

      <div className="my-reviews-main">
        <div className="top-header">
          <div className="header-left">
            <div className="page-title-row">
              <h1 className="page-title">My Reviews</h1>
            </div>
            <p className="page-subtitle">Your feedback, insights, and contributions across the ecosystem.</p>
          </div>
          <div className="header-right">
            <button className="write-review-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Write a Review
            </button>
          </div>
        </div>

        <div className="tabs-row">
          <div className="tabs-left">
            <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
              All Reviews
            </button>
            <button className={`tab-btn ${activeTab === 'startups' ? 'active' : ''}`} onClick={() => setActiveTab('startups')}>
              Startups
            </button>
            <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
              Products
            </button>
            <button className={`tab-btn ${activeTab === 'marketplace' ? 'active' : ''}`} onClick={() => setActiveTab('marketplace')}>
              Marketplace
            </button>
            <button className={`tab-btn ${activeTab === 'communities' ? 'active' : ''}`} onClick={() => setActiveTab('communities')}>
              Communities
            </button>
            <button className={`tab-btn ${activeTab === 'articles' ? 'active' : ''}`} onClick={() => setActiveTab('articles')}>
              Articles
            </button>
            <button className={`tab-btn ${activeTab === 'drafts' ? 'active' : ''}`} onClick={() => setActiveTab('drafts')}>
              Drafts
            </button>
            <button className={`tab-btn ${activeTab === 'archived' ? 'active' : ''}`} onClick={() => setActiveTab('archived')}>
              Archived
            </button>
          </div>
          <div className="tabs-right">
            <button className="filter-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 9 10.4 9 19 15 22 15 10.4 22 3" />
              </svg>
              Filter
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className="search-bar-small">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input type="text" placeholder="Search my reviews..." />
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">28</div>
              <div className="stat-label">Reviews Written</div>
              <div className="stat-sub">+4 this month</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">156</div>
              <div className="stat-label">Helpful Votes</div>
              <div className="stat-sub">+12 this month</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">92</div>
              <div className="stat-label">Impact Score</div>
              <div className="stat-sub">Top 8% Explorers</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8V10M12 14H14M12 14H10M12 14V16" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">4.7</div>
              <div className="stat-label">Avg. Quality Score</div>
              <div className="stat-sub">Excellent</div>
            </div>
          </div>
        </div>

        <div className="main-content-grid">
          <div className="my-reviews-section">
            <div className="section-header">
              <h3 className="section-title">My Reviews</h3>
            </div>
            <div className="reviews-list">
              <div className="review-card">
                <div className="review-item">
                  <div className="review-icon">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" />
                      <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                  </div>
                  <div className="review-info">
                    <div className="review-name">Nebula AI</div>
                    <div className="review-tag">Startup</div>
                  </div>
                  <div className="review-stars">
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star-count">4.5</span>
                  </div>
                  <div className="review-date">May 20, 2025</div>
                </div>
                <div className="review-text">
                  Nebula AI is a real problem for teams. The product is thoughtfully designed, and the team seems passionate.
                </div>
                <div className="review-actions">
                  <div className="review-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                    24
                  </div>
                  <div className="review-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    6
                  </div>
                </div>
              </div>

              <div className="review-card">
                <div className="review-item">
                  <div className="review-icon white">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="review-info">
                    <div className="review-name">FlowCRM</div>
                    <div className="review-tag">Product</div>
                  </div>
                  <div className="review-stars">
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star">★</span>
                    <span className="star-count">4.0</span>
                  </div>
                  <div className="review-date">May 18, 2025</div>
                </div>
                <div className="review-text">
                  Clean, fast and intuitive. Very smooth experience overall. The UI is clean and the product is fast.
                </div>
                <div className="review-actions">
                  <div className="review-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                    18
                  </div>
                  <div className="review-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    3
                  </div>
                </div>
              </div>

              <div className="review-card">
                <div className="review-item">
                  <div className="review-icon green">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M16 16v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    </svg>
                  </div>
                  <div className="review-info">
                    <div className="review-name">EcoTrack</div>
                    <div className="review-tag">Startup</div>
                  </div>
                  <div className="review-stars">
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star">★</span>
                    <span className="star-count">4.0</span>
                  </div>
                  <div className="review-date">May 16, 2025</div>
                </div>
                <div className="review-text">
                  Great mission, solid potential. I love the sustainability focus! The team seems passionate about what they're doing.
                </div>
                <div className="review-actions">
                  <div className="review-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                    16
                  </div>
                  <div className="review-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    2
                  </div>
                </div>
              </div>

              <div className="review-card">
                <div className="review-item">
                  <div className="review-icon purple">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="review-info">
                    <div className="review-name">DevKit</div>
                    <div className="review-tag">Product</div>
                  </div>
                  <div className="review-stars">
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star-count">5.0</span>
                  </div>
                  <div className="review-date">May 10, 2025</div>
                </div>
                <div className="review-text">
                  Developer experience 10/10. Hands down one of the best dev tools I've used this year.
                </div>
                <div className="review-actions">
                  <div className="review-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                    31
                  </div>
                  <div className="review-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    7
                  </div>
                </div>
              </div>

              <div className="review-card">
                <div className="review-item">
                  <div className="review-icon blue">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="review-info">
                    <div className="review-name">TaskForge</div>
                    <div className="review-tag">Startup</div>
                  </div>
                  <div className="review-stars">
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star-count">3.5</span>
                  </div>
                  <div className="review-date">May 8, 2025</div>
                </div>
                <div className="review-text">
                  Promising productivity platform. Good start, but there's room to improve in task automation.
                </div>
                <div className="review-actions">
                  <div className="review-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                    12
                  </div>
                  <div className="review-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    1
                  </div>
                </div>
              </div>
            </div>
            <button className="view-all-btn">View all reviews →</button>
          </div>

          <div className="side-sections">
            <div className="feedback-requests-section">
              <div className="section-header">
                <h3 className="section-title">Feedback Requests</h3>
                <button className="view-all-link">View all</button>
              </div>
              <div className="feedback-list">
                <div className="feedback-card">
                  <div className="feedback-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" />
                      <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                  </div>
                  <div className="feedback-info">
                    <div className="feedback-name">QuantumPay</div>
                    <div className="feedback-details">
                      <span>FinTech</span>
                      <span>•</span>
                      <span>Product Review</span>
                    </div>
                    <div className="feedback-date">May 28, 2025</div>
                  </div>
                  <button className="review-now-btn">Review Now</button>
                </div>

                <div className="feedback-card">
                  <div className="feedback-icon green">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M16 16v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    </svg>
                  </div>
                  <div className="feedback-info">
                    <div className="feedback-name">GreenMesh</div>
                    <div className="feedback-details">
                      <span>Climate Tech</span>
                      <span>•</span>
                      <span>Startup Review</span>
                    </div>
                    <div className="feedback-date">May 30, 2025</div>
                  </div>
                  <button className="review-now-btn">Review Now</button>
                </div>
              </div>
            </div>

            <div className="draft-reviews-section">
              <div className="section-header">
                <h3 className="section-title">Draft Reviews</h3>
                <button className="view-all-link">View all</button>
              </div>
              <div className="drafts-list">
                <div className="draft-card">
                  <div className="draft-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polygon points="14,2 14,8 20,8" />
                    </svg>
                  </div>
                  <div className="draft-info">
                    <div className="draft-name">SmartNote</div>
                    <div className="draft-tag">Product Review</div>
                    <div className="draft-date">Last saved 2 hours ago</div>
                  </div>
                  <button className="continue-btn">Continue</button>
                </div>

                <div className="draft-card">
                  <div className="draft-icon purple">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                    </svg>
                  </div>
                  <div className="draft-info">
                    <div className="draft-name">BuildBuddy</div>
                    <div className="draft-tag">Startup Review</div>
                    <div className="draft-date">Last saved yesterday</div>
                  </div>
                  <button className="continue-btn">Continue</button>
                </div>
              </div>
            </div>

            <div className="saved-reviews-section">
              <div className="section-header">
                <h3 className="section-title">Saved Reviews</h3>
                <button className="view-all-link">View all</button>
              </div>
              <div className="saved-list">
                <div className="saved-card">
                  <div className="saved-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" />
                      <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                  </div>
                  <div className="saved-info">
                    <div className="saved-name">Aurelia</div>
                    <div className="saved-tag">Startup</div>
                    <div className="saved-date">Saved on May 12, 2025</div>
                  </div>
                  <div className="saved-bookmark">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                    </svg>
                  </div>
                </div>
                <div className="saved-card">
                  <div className="saved-icon purple">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div className="saved-info">
                    <div className="saved-name">Uiverse</div>
                    <div className="saved-tag">Product</div>
                    <div className="saved-date">Saved on May 10, 2025</div>
                  </div>
                  <div className="saved-bookmark">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ai-section">
          <div className="ai-info">
            <div className="ai-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className="ai-text">
              <h4>AI Review Assistant</h4>
              <p>Get AI-powered suggestions to improve your reviews.</p>
            </div>
          </div>
          <div className="ai-chat-input">
            <input type="text" placeholder="Ask AI to improve your review..." />
            <button className="ai-send-btn" onClick={() => setCopilotOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22,2 15,22 11,13 2,9 22,2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {copilotOpen && <AICopilot isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />}
    </div>
  );
};

export default MyReviews;
