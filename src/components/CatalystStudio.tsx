import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import AICopilot from './AICopilot';
import './CatalystStudio.css';

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const StudioIcon = () => (
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

const CatalystStudio = () => {
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

  return (
    <div className="catalyst-studio-container">
      <div className="catalyst-studio-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">TRIVEON</span>
            <span className="brand-tagline">INVEST. GROW. IMPACT.</span>
          </div>
        </div>

        <div className="role-indicator">
          <div className="role-dot"></div>
          <span className="role-label">CATALYST</span>
        </div>

        <nav className="id-nav">
          <div className="id-nav-item" onClick={() => navigate('/home')}>
            <HomeIcon />
            <span>Home</span>
          </div>
          <div className="id-nav-item" onClick={() => navigate('/investors')}>
            <UsersIcon />
            <span>Catalysts</span>
          </div>
          <div className="id-nav-item active">
            <StudioIcon />
            <span>Catalyst Studio</span>
          </div>
        </nav>

        <div className="sidebar-copilot-card" onClick={() => setCopilotOpen(true)}>
          <div className="copilot-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          </div>
          <div className="copilot-content">
            <strong>AI Copilot</strong>
            <span className="beta-tag">BETA</span>
            <p>Your AI investment partner. Get insights, analyze deals, and make smarter decisions.</p>
          </div>
          <button className="ask-copilot-btn">Ask AI Copilot →</button>
        </div>

        <div className="sidebar-user-section">
          <div className="user-avatar-small">
            <img src={getUserProfileImage()} alt="User" />
          </div>
          <div className="user-info-small">
            <div className="user-name-small">Rohit Malhotra</div>
            <div className="user-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Pro
            </div>
          </div>
          <div className="user-menu-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </div>
        </div>
      </div>

      <div className="catalyst-studio-main">
        <div className="top-header">
          <div className="header-left">
            <div className="page-title-row">
              <h1 className="page-title">Catalyst Studio</h1>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <p className="page-subtitle">Powerful tools to analyze deals, manage your portfolio, and grow your impact.</p>
          </div>
          <div className="header-right">
            <div className="header-icons">
              <button className="icon-btn" onClick={() => navigate('/notifications')}>
                <BellIcon />
              </button>
              <div className="user-avatar" onClick={() => navigate('/profile')}>
                <img src={getUserProfileImage()} alt="User" />
              </div>
            </div>
          </div>
        </div>

        <div className="tabs-row">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} 
            onClick={() => setActiveTab('all')}
          >
            All Tools
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`} 
            onClick={() => setActiveTab('analysis')}
          >
            Deal Analysis
          </button>
          <button 
            className={`tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`} 
            onClick={() => setActiveTab('portfolio')}
          >
            Portfolio Management
          </button>
          <button 
            className={`tab-btn ${activeTab === 'research' ? 'active' : ''}`} 
            onClick={() => setActiveTab('research')}
          >
            Research
          </button>
          <button 
            className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`} 
            onClick={() => setActiveTab('ai')}
          >
            AI & Insights
          </button>
        </div>

        <div className="studio-content">
          <div className="tools-grid">
            <div className="tool-card">
              <div className="tool-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="tool-title-row">
                <h3 className="tool-title">Deal Analyzer</h3>
                <span className="ai-tag">AI Powered</span>
              </div>
              <p className="tool-desc">Analyze startup instantly and get AI-powered insights on risk, opportunity, team, market, and more.</p>
              <ul className="tool-features">
                <li>Risk & Opportunity Score</li>
                <li>Strengths & Weaknesses</li>
                <li>Investment Recommendation</li>
              </ul>
              <button className="open-tool-btn">Open Tool →</button>
            </div>

            <div className="tool-card">
              <div className="tool-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div className="tool-title-row">
                <h3 className="tool-title">Valuation Studio</h3>
                <span className="ai-tag">AI Powered</span>
              </div>
              <p className="tool-desc">Calculate startup valuations using multiple methods and understand fair value in seconds.</p>
              <ul className="tool-features">
                <li>4+ Valuation Methods</li>
                <li>Dilution & Ownership Impact</li>
                <li>Save & Compare Results</li>
              </ul>
              <button className="open-tool-btn">Open Tool →</button>
            </div>

            <div className="tool-card">
              <div className="tool-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="tool-title-row">
                <h3 className="tool-title">Portfolio Hub</h3>
              </div>
              <p className="tool-desc">Track all your investments, monitor performance, and analyze portfolio growth real-time.</p>
              <ul className="tool-features">
                <li>Portfolio Overview</li>
                <li>Performance Analytics</li>
                <li>Company Tracking</li>
              </ul>
              <button className="open-tool-btn">Open Tool →</button>
            </div>

            <div className="tool-card">
              <div className="tool-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 15a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h3l2-3h4l2 3h3a3 3 0 0 1 3 3v6z" />
                </svg>
              </div>
              <div className="tool-title-row">
                <h3 className="tool-title">Deal Pipeline CRM</h3>
              </div>
              <p className="tool-desc">Manage your entire investment pipeline from discovery to investment with ease and clarity.</p>
              <ul className="tool-features">
                <li>Drag & Drop Pipeline</li>
                <li>Notes & Reminders</li>
                <li>Team Collaboration</li>
              </ul>
              <button className="open-tool-btn">Open Tool →</button>
            </div>

            <div className="tool-card">
              <div className="tool-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h6l2-3h5a2 2 0 0 1 2 2v14z" />
                </svg>
              </div>
              <div className="tool-title-row">
                <h3 className="tool-title">Due Diligence Vault</h3>
              </div>
              <p className="tool-desc">Store, organize, and review all due diligence documents in one secure and smart vault.</p>
              <ul className="tool-features">
                <li>Document Management</li>
                <li>AI Document Summary</li>
                <li>Risk & Missing Docs Alert</li>
              </ul>
              <button className="open-tool-btn">Open Tool →</button>
            </div>

            <div className="tool-card">
              <div className="tool-icon spark">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="tool-title-row">
                <h3 className="tool-title">Investor AI Copilot</h3>
                <span className="ai-tag">AI Powered</span>
              </div>
              <p className="tool-desc">Your personal AI investment analyst that helps you research, compare, and find the best opportunities.</p>
              <ul className="tool-features">
                <li>Analyze & Compare Startups</li>
                <li>Summarize Pitch Decks</li>
                <li>Find Opportunities</li>
              </ul>
              <button className="open-tool-btn" onClick={() => setCopilotOpen(true)}>Open Tool →</button>
            </div>
          </div>
        </div>
      </div>

      {copilotOpen && <AICopilot isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />}
    </div>
  );
};

export default CatalystStudio;
