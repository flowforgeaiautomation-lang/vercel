import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import AICopilot from './AICopilot';
import './MyInvestments.css';

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

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3v18h18" />
    <path d="M18 17l-4-4-4 4-4-8" />
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const MyInvestments = () => {
  const { profile } = useAuth();
  const { userData } = useUser();
  const navigate = useNavigate();
  const [copilotOpen, setCopilotOpen] = useState(false);
  
  const getUserName = () => {
    return userData?.profile?.name || profile?.name || 'Rohit Malhotra';
  };
  
  const getUserRole = () => {
    return userData?.mainRole || profile?.role || 'Angel Investor';
  };
  
  const getUserProfileImage = () => {
    if (userData?.profile?.profileImage) {
      return userData.profile.profileImage;
    }
    return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&h=180&fit=crop&crop=face';
  };

  return (
    <div className="my-investments-container">
      <div className="my-investments-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">TRIARCORA</span>
            <span className="brand-tagline">INVEST. GROW. IMPACT.</span>
          </div>
        </div>

        <div className="role-indicator">
          <div className="role-dot"></div>
          <span className="role-label">INVESTOR</span>
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
            <ChartIcon />
            <span>My Investments</span>
          </div>
        </nav>
      </div>

      <div className="my-investments-main">
        <div className="top-header">
          <div className="header-left">
            <h1 className="page-title">My Investments</h1>
            <p className="page-subtitle">Your complete investment command center</p>
          </div>
          <div className="header-right">
            <div className="header-icons">
              <button className="icon-btn" onClick={() => navigate('/notifications')}>
                <BellIcon />
              </button>
              <div className="user-avatar" onClick={() => navigate('/profile')}>
                <img src={getUserProfileImage()} alt={getUserName()} />
              </div>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Investments</div>
              <div className="stat-value">24</div>
              <div className="stat-sub">Active portfolio</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <path d="M1 10h22" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Portfolio Value</div>
              <div className="stat-value">₹24.8 Cr</div>
              <div className="stat-sub positive">↑ 18.6% (30D)</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Invested Capital</div>
              <div className="stat-value">₹12.4 Cr</div>
              <div className="stat-sub">Total deployed</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Avg. ROI</div>
              <div className="stat-value">36.7%</div>
              <div className="stat-sub positive">↑ All time</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Active Startups</div>
              <div className="stat-value">18</div>
              <div className="stat-sub">In portfolio</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="5" />
                <path d="M3 21v-2a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Investor Score</div>
              <div className="stat-value">92/100</div>
              <div className="stat-sub positive">Top 8% on Triarcora</div>
            </div>
          </div>
        </div>

        <div className="main-grid">
          <div className="portfolio-overview-card">
            <div className="card-header">
              <h3 className="card-title">Portfolio Overview</h3>
              <div className="time-filters">
                <button className="time-filter active">7D</button>
                <button className="time-filter">30D</button>
                <button className="time-filter">90D</button>
                <button className="time-filter">1Y</button>
                <button className="time-filter">All</button>
              </div>
            </div>
            <div className="portfolio-chart">
              <svg viewBox="0 0 400 200" width="100%" height="100%">
                <defs>
                  <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00C896" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#00C896" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 160 L0 120 C50 100 100 110 150 90 C200 70 250 60 300 40 C350 20 380 30 400 20 L400 160 Z" fill="url(#portfolioGradient)" />
                <polyline points="0,120 50,100 100,110 150,90 200,70 250,60 300,40 350,20 400,30" fill="none" stroke="#00C896" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="0,140 50,130 100,145 150,120 200,110 250,105 300,90 350,80 400,95" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <text x="0" y="195" fontSize="10" fill="#6B7280">Jan</text>
                <text x="66" y="195" fontSize="10" fill="#6B7280">Feb</text>
                <text x="132" y="195" fontSize="10" fill="#6B7280">Mar</text>
                <text x="198" y="195" fontSize="10" fill="#6B7280">Apr</text>
                <text x="264" y="195" fontSize="10" fill="#6B7280">May</text>
                <text x="330" y="195" fontSize="10" fill="#6B7280">Jun</text>
                <text x="0" y="18" fontSize="10" fill="#6B7280">30Cr</text>
                <text x="0" y="110" fontSize="10" fill="#6B7280">20Cr</text>
                <text x="0" y="180" fontSize="10" fill="#6B7280">10Cr</text>
              </svg>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-dot green"></span>
                  <span>Portfolio Value</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot gray"></span>
                  <span>Invested Capital</span>
                </div>
              </div>
            </div>
          </div>

          <div className="deal-pipeline-card">
            <div className="card-header">
              <h3 className="card-title">Deal Pipeline</h3>
            </div>
            <div className="pipeline-stats">
              <div className="pipeline-stat">
                <div className="pipeline-value">32</div>
                <div className="pipeline-label">Discovered<br/>startups</div>
              </div>
              <div className="pipeline-stat">
                <div className="pipeline-value">14</div>
                <div className="pipeline-label">Meeting<br/>scheduled</div>
              </div>
              <div className="pipeline-stat">
                <div className="pipeline-value">7</div>
                <div className="pipeline-label">Due Diligence<br/>startups</div>
              </div>
              <div className="pipeline-stat">
                <div className="pipeline-value">3</div>
                <div className="pipeline-label">Negotiation<br/>startups</div>
              </div>
              <div className="pipeline-stat">
                <div className="pipeline-value">24</div>
                <div className="pipeline-label">Invested<br/>startups</div>
              </div>
            </div>
            <div className="pipeline-list">
              <div className="pipeline-item">
                <div className="pipeline-item-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </div>
                <div className="pipeline-item-content">
                  <div className="pipeline-item-name">Synapse AI</div>
                  <div className="pipeline-item-tag">AI / ML</div>
                </div>
                <div className="pipeline-item-amount">₹1.2 Cr</div>
                <div className="pipeline-item-avatars">
                  <div className="mini-avatar"></div>
                  <div className="mini-avatar"></div>
                  <div className="mini-avatar"></div>
                  <div className="mini-avatar-more">+3</div>
                </div>
              </div>
              <div className="pipeline-item">
                <div className="pipeline-item-icon green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                </div>
                <div className="pipeline-item-content">
                  <div className="pipeline-item-name">GreenCharge</div>
                  <div className="pipeline-item-tag">Clean Energy</div>
                </div>
                <div className="pipeline-item-amount">₹90 L</div>
                <div className="pipeline-item-avatars">
                  <div className="mini-avatar"></div>
                  <div className="mini-avatar"></div>
                  <div className="mini-avatar-more">+2</div>
                </div>
              </div>
              <div className="pipeline-item">
                <div className="pipeline-item-icon purple">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <div className="pipeline-item-content">
                  <div className="pipeline-item-name">FinEdge</div>
                  <div className="pipeline-item-tag">FinTech</div>
                </div>
                <div className="pipeline-item-amount">₹7.5 L</div>
                <div className="pipeline-item-avatars">
                  <div className="mini-avatar"></div>
                  <div className="mini-avatar"></div>
                  <div className="mini-avatar-more">+1</div>
                </div>
              </div>
            </div>
            <button className="view-full-btn">View Full Pipeline →</button>
          </div>

          <div className="portfolio-companies-card">
            <div className="card-header">
              <h3 className="card-title">Portfolio Companies</h3>
              <button className="view-all-link">View All →</button>
            </div>
            <div className="companies-list">
              <div className="company-item">
                <div className="company-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </div>
                <div className="company-info">
                  <div className="company-name">CloudAI</div>
                  <div className="company-tag">AI / Infrastructure</div>
                </div>
                <div className="company-stage">Series A</div>
                <div className="company-investment">₹4.2 Cr</div>
                <div className="company-growth positive">↑ 42.6% Growth</div>
              </div>
              <div className="company-item">
                <div className="company-icon blue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div className="company-info">
                  <div className="company-name">ShopQ</div>
                  <div className="company-tag">E-Commerce</div>
                </div>
                <div className="company-stage">Series A</div>
                <div className="company-investment">₹3.1 Cr</div>
                <div className="company-growth positive">↑ 28.4% Growth</div>
              </div>
              <div className="company-item">
                <div className="company-icon green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22v-7a5 5 0 0 0-10 0v7" />
                    <path d="M17 22V7a4 4 0 1 1 4 4v11" />
                  </svg>
                </div>
                <div className="company-info">
                  <div className="company-name">WellBe</div>
                  <div className="company-tag">HealthTech</div>
                </div>
                <div className="company-stage">Seed</div>
                <div className="company-investment">₹1.2 Cr</div>
                <div className="company-growth positive">↑ 35.7% Growth</div>
              </div>
              <div className="company-item">
                <div className="company-icon purple">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                </div>
                <div className="company-info">
                  <div className="company-name">LogiNext</div>
                  <div className="company-tag">Logistics</div>
                </div>
                <div className="company-stage">Series A</div>
                <div className="company-investment">₹2.8 Cr</div>
                <div className="company-growth positive">↑ 18.9% Growth</div>
              </div>
              <div className="company-item">
                <div className="company-icon orange">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                </div>
                <div className="company-info">
                  <div className="company-name">EduSpark</div>
                  <div className="company-tag">EdTech</div>
                </div>
                <div className="company-stage">Seed</div>
                <div className="company-investment">₹60 L</div>
                <div className="company-growth positive">↑ 22.1% Growth</div>
              </div>
            </div>
            <button className="view-full-btn">View All Portfolio Companies →</button>
          </div>

          <div className="investment-analytics-card">
            <div className="card-header">
              <h3 className="card-title">Investment Analytics</h3>
              <button className="view-report-link">View Report →</button>
            </div>
            <div className="analytics-chart">
              <svg viewBox="0 0 200 200" width="100%" height="100%">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#1F2937" strokeWidth="20" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#00C896" strokeWidth="20" strokeDasharray="160 340" strokeDashoffset="0" transform="rotate(-90 100 100)" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#10B981" strokeWidth="20" strokeDasharray="125 375" strokeDashoffset="-160" transform="rotate(-90 100 100)" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#06B6D4" strokeWidth="20" strokeDasharray="95 405" strokeDashoffset="-285" transform="rotate(-90 100 100)" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#6366F1" strokeWidth="20" strokeDasharray="60 440" strokeDashoffset="-380" transform="rotate(-90 100 100)" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#6B7280" strokeWidth="20" strokeDasharray="60 440" strokeDashoffset="-440" transform="rotate(-90 100 100)" />
                <text x="100" y="90" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">₹24.8 Cr</text>
                <text x="100" y="115" textAnchor="middle" fill="#9CA3AF" fontSize="14">Portfolio Value</text>
              </svg>
              <div className="analytics-legend">
                <div className="analytics-legend-item">
                  <span className="legend-dot green"></span>
                  <span>AI / ML</span>
                  <span className="legend-percent">35%</span>
                  <span className="legend-amount">₹8.7 Cr</span>
                </div>
                <div className="analytics-legend-item">
                  <span className="legend-dot green-light"></span>
                  <span>FinTech</span>
                  <span className="legend-percent">25%</span>
                  <span className="legend-amount">₹6.2 Cr</span>
                </div>
                <div className="analytics-legend-item">
                  <span className="legend-dot cyan"></span>
                  <span>HealthTech</span>
                  <span className="legend-percent">15%</span>
                  <span className="legend-amount">₹3.7 Cr</span>
                </div>
                <div className="analytics-legend-item">
                  <span className="legend-dot purple"></span>
                  <span>SaaS</span>
                  <span className="legend-percent">10%</span>
                  <span className="legend-amount">₹2.4 Cr</span>
                </div>
                <div className="analytics-legend-item">
                  <span className="legend-dot gray"></span>
                  <span>Others</span>
                  <span className="legend-percent">15%</span>
                  <span className="legend-amount">₹3.8 Cr</span>
                </div>
              </div>
            </div>
            <div className="analytics-metrics">
              <div className="metric-item">
                <div className="metric-label">Best Performer</div>
                <div className="metric-value">CloudAI</div>
                <div className="metric-growth positive">↑ 42.6%</div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Worst Performer</div>
                <div className="metric-value">Nibble</div>
                <div className="metric-growth negative">↓ -8.3%</div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Exits</div>
                <div className="metric-value">2</div>
                <div className="metric-growth">All Time</div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Unrealized Gains</div>
                <div className="metric-value">₹6.4 Cr</div>
                <div className="metric-growth">All Time</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="fundraising-requests-card">
            <div className="card-header">
              <h3 className="card-title">Fundraising Requests</h3>
              <button className="view-all-link">View All →</button>
            </div>
            <div className="requests-list">
              <div className="request-item">
                <div className="request-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </div>
                <div className="request-info">
                  <div className="request-name">NeuroNova</div>
                  <div className="request-tag">AI / Healthcare</div>
                </div>
                <div className="request-stage">Series A</div>
                <div className="request-amount">₹2 Cr</div>
              </div>
              <div className="request-item">
                <div className="request-icon blue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <div className="request-info">
                  <div className="request-name">BharatPay</div>
                  <div className="request-tag">FinTech</div>
                </div>
                <div className="request-stage">Series A</div>
                <div className="request-amount">₹1.5 Cr</div>
              </div>
              <div className="request-item">
                <div className="request-icon orange">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div className="request-info">
                  <div className="request-name">SolarX</div>
                  <div className="request-tag">Clean Energy</div>
                </div>
                <div className="request-stage">Series A</div>
                <div className="request-amount">₹3 Cr</div>
              </div>
            </div>
            <button className="view-full-btn">View All Requests →</button>
          </div>

          <div className="watchlist-card">
            <div className="card-header">
              <h3 className="card-title">Watchlist</h3>
              <button className="view-all-link">View All →</button>
            </div>
            <div className="watchlist-list">
              <div className="watchlist-item">
                <div className="watchlist-icon purple">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                </div>
                <div className="watchlist-info">
                  <div className="watchlist-name">AstroVerse</div>
                  <div className="watchlist-tag">Space Tech</div>
                </div>
                <div className="watchlist-stage">Series Seed</div>
              </div>
              <div className="watchlist-item">
                <div className="watchlist-icon green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div className="watchlist-info">
                  <div className="watchlist-name">ByteBoard</div>
                  <div className="watchlist-tag">EdTech</div>
                </div>
                <div className="watchlist-stage">Seed</div>
              </div>
              <div className="watchlist-item">
                <div className="watchlist-icon cyan">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </div>
                <div className="watchlist-info">
                  <div className="watchlist-name">AgriConnect</div>
                  <div className="watchlist-tag">AgriTech</div>
                </div>
                <div className="watchlist-stage">Series Seed</div>
              </div>
            </div>
            <button className="view-full-btn">View All Watchlist →</button>
          </div>

          <div className="recent-activity-card">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
              <button className="view-all-link">View All →</button>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="activity-content">
                  <div className="activity-text">Invested in QloudAI</div>
                  <div className="activity-time">2h ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="activity-content">
                  <div className="activity-text">Due diligence completed for FinEdge</div>
                  <div className="activity-time">5h ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="activity-content">
                  <div className="activity-text">Meeting scheduled with GreenCharge</div>
                  <div className="activity-time">1d ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="activity-content">
                  <div className="activity-text">Added NeuroNova to pipeline</div>
                  <div className="activity-time">2d ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="activity-content">
                  <div className="activity-text">Received update from ShopQ</div>
                  <div className="activity-time">3d ago</div>
                </div>
              </div>
            </div>
            <button className="view-full-btn">View All Activity →</button>
          </div>
        </div>

        <div className="ai-section">
          <div className="ai-info">
            <div className="ai-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </div>
            <div className="ai-text">
              <h4>AI Investment Copilot</h4>
              <p>Get AI-powered insights, analyze startups, predict trends, and make smarter investment decisions.</p>
            </div>
          </div>
          <div className="ai-chat-input">
            <input type="text" placeholder="Ask anything about your investments..." />
            <button className="ai-send-btn" onClick={() => setCopilotOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {copilotOpen && <AICopilot />}
    </div>
  );
};

export default MyInvestments;
