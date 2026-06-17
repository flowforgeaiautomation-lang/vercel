
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import PrestigeStarBadge from './PrestigeStarBadge';
import './InsightsDashboard.css';

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const getRoleColor = (role: string): string => {
  const roleUpperCase = role.toUpperCase();
  if (roleUpperCase === 'ARCHITECT') return '#FFD700';
  if (roleUpperCase === 'CATALYST') return '#00C896';
  if (roleUpperCase === 'EXPLORER') return '#06b6d4';
  return '#9CA3AF';
};

const InsightsDashboard = () => {
  const { profile } = useAuth();
  const { userData } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [discoverDropdownOpen, setDiscoverDropdownOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const tabs = ['All', 'Articles', 'Research Reports', 'Funding Guides', 'Legal Guides', 'Valuation Guides', 'Market Reports', 'Tax Resources', 'Investment Frameworks', 'Due Diligence Checklists'];

  const featuredInsight = {
    title: 'How We Reached ₹1 Crore ARR in 12 Months',
    description: 'Key strategies, lessons, and frameworks that helped us build, scale, and sustain a profitable SaaS business.',
    author: 'Riya Sharma',
    role: 'Architect',
    readTime: '12 min read',
    views: '18.2K'
  };

  const latestInsights = [
    {
      title: 'The Ultimate Guide to Pre-Seed Fundraising',
      description: 'Everything founders need to know before raising their first round.',
      author: 'Unnati Chaudhary',
      role: 'Architect',
      readTime: '8 min read',
      views: '4.6K',
      category: 'Startup'
    },
    {
      title: 'Building a Winning Angel Investment Thesis',
      description: 'A framework for evaluating startups and making confident investments.',
      author: 'Karan Malhotra',
      role: 'Catalyst',
      readTime: '10 min read',
      views: '3.1K',
      category: 'Investment'
    },
    {
      title: 'AI Trends That Will Define 2024 and Beyond',
      description: 'Deep dive into the most impactful AI developments this year.',
      author: 'Neha Verma',
      role: 'Explorer',
      readTime: '6 min read',
      views: '2.7K',
      category: 'Research'
    },
    {
      title: '10 Growth Loops That Actually Work',
      description: 'Proven growth loops used by top startups to scale fast.',
      author: 'Rohit Singh',
      role: 'Architect',
      readTime: '7 min read',
      views: '2.2K',
      category: 'Growth'
    }
  ];

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

  // Close discover dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setDiscoverDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="insights-container">
      {/* Left Sidebar */}
      <div className="insights-left-sidebar">
        <div className="insights-logo" onClick={() => navigate('/home')}>
          <div className="insights-logo-icon">
            <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="logoGradInsights" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#7C3AED'}} />
                  <stop offset="100%" style={{stopColor:'#A855F7'}} />
                </linearGradient>
              </defs>
              <polygon points="20,80 50,20 80,80" fill="url(#logoGradInsights)" />
              <text x="50" y="72" textAnchor="middle" fill="#000" fontSize="28" fontWeight="800" fontFamily="Arial">T</text>
            </svg>
          </div>
          <span className="insights-logo-text">TRIARCORA</span>
        </div>

        <nav className="insights-nav">
          <div className="insights-nav-item" onClick={() => navigate('/home')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Home</span>
          </div>
          <div className="insights-nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Insights</span>
          </div>
          <div className="insights-nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span>My insights</span>
          </div>
          <div className="insights-nav-item" onClick={() => navigate('/bookmarks')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>
            <span>Vault(bookmark)</span>
          </div>
        </nav>

        <div className="insights-copilot-card">
          <div className="insights-copilot-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"></polygon>
            </svg>
          </div>
          <div className="insights-copilot-content">
            <strong>Share knowledge.</strong>
            <span>Build impact.</span>
            <span>Insights you share today can inspire someone's tomorrow.</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="insights-main">
        <div className="insights-content">
          <div className="insights-page-header">
            <div>
              <h1>Insights</h1>
              <p>Ideas worth sharing. Knowledge worth saving.</p>
            </div>
            <button
              onClick={() => {
                if (profile?.isVerified) {
                  setShowCreateModal(true);
                } else {
                  alert('Only verified users can publish insights. Please verify your email first!');
                }
              }}
              className="create-insight-btn"
            >
              <PlusIcon />
              Create Insight
            </button>
          </div>

          {/* Tabs */}
          <div className="insights-tabs">
            {tabs.map(tab => (
              <div 
                key={tab} 
                className={`insights-tab ${activeTab === tab ? 'active' : ''}`} 
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Featured Insight */}
          <div className="featured-insight">
            <div className="featured-image" />
            <div className="featured-content">
              <div className="featured-label">FEATURED</div>
              <h2>{featuredInsight.title}</h2>
              <p>{featuredInsight.description}</p>
              <div className="featured-meta">
                <div className="featured-author">
                  <div className="author-avatar-mini">
                    {getInitials(featuredInsight.author)}
                  </div>
                  <div>
                    <span className="author-name-mini">{featuredInsight.author}</span>
                    <span className="author-role-mini" style={{ color: getRoleColor(featuredInsight.role) }}>
                      {featuredInsight.role}
                    </span>
                  </div>
                </div>
                <div className="featured-stats">
                  <span>{featuredInsight.readTime}</span>
                  <span>•</span>
                  <span>{featuredInsight.views} views</span>
                </div>
                <button className="read-insight-btn">
                  Read Insight
                  <ChevronIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Latest Insights */}
          <div className="latest-insights-header">
            <h3>Latest Insights</h3>
            <div className="view-all">
              View all
              <ChevronIcon />
            </div>
          </div>

          <div className="latest-insights-grid">
            {latestInsights.map((insight, index) => (
              <div key={index} className="insight-card">
                <div className="insight-image" />
                <div className="insight-info">
                  <span className="insight-category">{insight.category}</span>
                  <h4>{insight.title}</h4>
                  <p>{insight.description}</p>
                  <div className="insight-meta">
                    <div className="insight-author">
                      <div className="author-avatar-tiny">
                        {getInitials(insight.author)}
                      </div>
                      <div>
                        <span className="author-name-tiny">{insight.author}</span>
                        <span className="author-role-tiny" style={{ color: getRoleColor(insight.role) }}>
                          {insight.role}
                        </span>
                      </div>
                    </div>
                    <div className="insight-stats">
                      <span><EyeIcon /> {insight.views}</span>
                      <span>{insight.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsDashboard;
