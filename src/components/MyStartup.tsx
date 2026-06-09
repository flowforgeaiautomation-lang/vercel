import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AICopilot from './AICopilot';
import './MyStartup.css';

const MyStartup: React.FC = () => {
  const [copilotOpen, setCopilotOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="my-startup-container">
      <div className="my-startup-content">
        {/* Left Sidebar */}
        <aside className="my-startup-sidebar">
          <div className="my-startup-brand" onClick={() => navigate('/home')}>
            <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="myStartupBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#FFD700'}} />
                  <stop offset="100%" style={{stopColor:'#FFA500'}} />
                </linearGradient>
              </defs>
              <polygon points="20,80 50,20 80,80" fill="url(#myStartupBrandGrad)" />
              <text x="50" y="72" textAnchor="middle" fill="#000" fontSize="28" fontWeight="800" fontFamily="Arial">T</text>
            </svg>
            <div className="my-startup-brand-text">
              <span className="my-startup-brand-name">TRIVEON</span>
            </div>
          </div>

          <nav className="my-startup-nav">
            <div className="my-startup-nav-item" onClick={() => navigate('/home')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2z"></path>
              </svg>
              <span>Home</span>
            </div>
            <div className="my-startup-nav-item" onClick={() => navigate('/startups')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              <span>Startups</span>
            </div>
            <div className="my-startup-nav-item active" onClick={() => navigate('/my-startup')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                <path d="M9 22v-4h6v4"/>
              </svg>
              <span>My Startup</span>
            </div>
          </nav>

          <div className="my-startup-copilot-card" onClick={() => setCopilotOpen(true)}>
            <div className="my-startup-copilot-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"/>
              </svg>
            </div>
            <div className="my-startup-copilot-text">
              <strong>AI Copilot</strong>
              <span>Your startup assistant</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="my-startup-main">
          {/* Startup Header */}
          <div className="my-startup-header">
            <div className="my-startup-header-left">
              <div className="my-startup-logo-box">
                <div className="my-startup-logo-circle"></div>
                <div className="my-startup-logo-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="8" cy="8" r="3"/>
                    <circle cx="16" cy="8" r="3"/>
                    <circle cx="12" cy="16" r="3"/>
                  </svg>
                </div>
              </div>
              <div className="my-startup-header-info">
                <div className="my-startup-title-row">
                  <h1 className="my-startup-name">Nebula AI</h1>
                  <div className="my-startup-status-badge">Seed Stage</div>
                </div>
                <p className="my-startup-tagline">AI Infrastructure for the Next Generation of Builders.</p>
                <div className="my-startup-meta-tags">
                  <span className="my-startup-meta-tag">Artificial Intelligence</span>
                  <span className="my-startup-meta-tag">Seed Stage</span>
                  <span className="my-startup-meta-tag">📍 Iola</span>
                  <span className="my-startup-meta-tag">Founded 2025</span>
                  <span className="my-startup-meta-tag">8 Members</span>
                </div>
              </div>
            </div>
            <div className="my-startup-header-right">
              <button className="my-startup-edit-btn">Edit Startup</button>
              <button className="my-startup-public-btn">View Public Profile</button>
              <button className="my-startup-share-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="my-startup-stats-row">
            <div className="my-startup-stat-card primary">
              <div className="my-startup-stat-value">89</div>
              <div className="my-startup-stat-label">Startup Score</div>
              <div className="my-startup-stat-badge">Excellent</div>
            </div>
            <div className="my-startup-stat-card">
              <div className="my-startup-stat-value">1,240</div>
              <div className="my-startup-stat-label">Followers</div>
              <div className="my-startup-stat-change up">↑ 24%</div>
            </div>
            <div className="my-startup-stat-card">
              <div className="my-startup-stat-value">8,450</div>
              <div className="my-startup-stat-label">Profile Views</div>
              <div className="my-startup-stat-change up">↑ this month</div>
            </div>
            <div className="my-startup-stat-card">
              <div className="my-startup-stat-value">18</div>
              <div className="my-startup-stat-label">Investor Interest</div>
              <div className="my-startup-stat-sub">Active Investors</div>
            </div>
            <div className="my-startup-stat-card">
              <div className="my-startup-stat-value">Raising Seed</div>
              <div className="my-startup-stat-label">Funding Status</div>
              <div className="my-startup-stat-progress">
                <div className="my-startup-stat-progress-bar" style={{width: '42%'}}></div>
              </div>
              <div className="my-startup-stat-progress-text">$210K / $500K</div>
            </div>
            <div className="my-startup-stat-card">
              <div className="my-startup-stat-value">8</div>
              <div className="my-startup-stat-label">Team Members</div>
              <div className="my-startup-stat-sub">Active</div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="my-startup-grid">
            {/* Growth Analytics */}
            <div className="my-startup-growth-card">
              <div className="my-startup-card-header">
                <h3 className="my-startup-card-title">Growth Analytics</h3>
                <div className="my-startup-chart-tabs">
                  <button className="my-startup-chart-tab active">7D</button>
                  <button className="my-startup-chart-tab">30D</button>
                  <button className="my-startup-chart-tab">90D</button>
                  <button className="my-startup-chart-tab">1Y</button>
                </div>
              </div>
              <div className="my-startup-chart-legend">
                <div className="my-startup-legend-item">
                  <div className="my-startup-legend-dot yellow"></div>
                  <span>Profile Views</span>
                </div>
                <div className="my-startup-legend-item">
                  <div className="my-startup-legend-dot purple"></div>
                  <span>Followers</span>
                </div>
              </div>
              <div className="my-startup-chart-container">
                <svg viewBox="0 0 400 200" className="my-startup-chart">
                  <defs>
                    <linearGradient id="yellowFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" style={{stopColor:'rgba(255,215,0,0.3)'}}/>
                      <stop offset="100%" style={{stopColor:'rgba(255,215,0,0)'}}/>
                    </linearGradient>
                    <linearGradient id="purpleFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" style={{stopColor:'rgba(139,92,246,0.3)'}}/>
                      <stop offset="100%" style={{stopColor:'rgba(139,92,246,0)'}}/>
                    </linearGradient>
                  </defs>
                  <polyline points="20,160 60,140 100,130 140,120 180,100 220,80 260,60 300,50 340,40 380,30" fill="url(#yellowFill)" stroke="#FFD700" strokeWidth="2"/>
                  <polyline points="20,180 60,170 100,160 140,150 180,130 220,120 260,100 300,90 340,80 380,70" fill="url(#purpleFill)" stroke="#8B5CF6" strokeWidth="2"/>
                  <line x1="20" y1="190" x2="380" y2="190" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                </svg>
              </div>
            </div>

            {/* Fundraising Overview */}
            <div className="my-startup-fundraising-card">
              <div className="my-startup-card-header">
                <h3 className="my-startup-card-title">Fundraising Overview</h3>
              </div>
              <div className="my-startup-fundraising-circle">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12"/>
                  <circle cx="100" cy="100" r="80" fill="none" stroke="url(#fundraisingGrad)" strokeWidth="12" strokeDasharray="420" strokeDashoffset="244" strokeLinecap="round" transform="rotate(-90 100 100)"/>
                  <defs>
                    <linearGradient id="fundraisingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{stopColor:'#FFD700'}}/>
                      <stop offset="100%" style={{stopColor:'#FFA500'}}/>
                    </linearGradient>
                  </defs>
                  <text x="100" y="90" textAnchor="middle" fill="#fff" fontSize="32" fontWeight="700">$210K</text>
                  <text x="100" y="115" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="14">Raised of $500K</text>
                  <text x="100" y="140" textAnchor="middle" fill="#FFD700" fontSize="18" fontWeight="600">42%</text>
                </svg>
              </div>
              <div className="my-startup-fundraising-meta">
                <div className="my-startup-fundraising-item">
                  <span className="my-startup-fundraising-label">Round</span>
                  <span className="my-startup-fundraising-value">Seed</span>
                </div>
                <div className="my-startup-fundraising-item">
                  <span className="my-startup-fundraising-label">Valuation Cap</span>
                  <span className="my-startup-fundraising-value">$5M</span>
                </div>
                <div className="my-startup-fundraising-item">
                  <span className="my-startup-fundraising-label">Target Raise</span>
                  <span className="my-startup-fundraising-value">$500K</span>
                </div>
              </div>
              <button className="my-startup-fundraising-btn">View Fundraising Hub →</button>
            </div>

            {/* Investor Pipeline */}
            <div className="my-startup-pipeline-card">
              <div className="my-startup-card-header">
                <h3 className="my-startup-card-title">Investor Pipeline</h3>
                <button className="my-startup-view-all-btn">View All →</button>
              </div>
              <div className="my-startup-investor-list">
                <div className="my-startup-investor-item">
                  <div className="my-startup-investor-avatar">S</div>
                  <div className="my-startup-investor-info">
                    <div className="my-startup-investor-name">Sequoia Capital</div>
                    <div className="my-startup-investor-status interested">● Interested</div>
                  </div>
                </div>
                <div className="my-startup-investor-item">
                  <div className="my-startup-investor-avatar">A</div>
                  <div className="my-startup-investor-info">
                    <div className="my-startup-investor-name">Accel</div>
                    <div className="my-startup-investor-status meeting">● Meeting Scheduled</div>
                  </div>
                </div>
                <div className="my-startup-investor-item">
                  <div className="my-startup-investor-avatar">L</div>
                  <div className="my-startup-investor-info">
                    <div className="my-startup-investor-name">Lightspeed</div>
                    <div className="my-startup-investor-status diligence">● Due Diligence</div>
                  </div>
                </div>
                <div className="my-startup-investor-item">
                  <div className="my-startup-investor-avatar">B</div>
                  <div className="my-startup-investor-info">
                    <div className="my-startup-investor-name">Blume Ventures</div>
                    <div className="my-startup-investor-status negotiation">● Negotiation</div>
                  </div>
                </div>
                <div className="my-startup-investor-item">
                  <div className="my-startup-investor-avatar">T</div>
                  <div className="my-startup-investor-info">
                    <div className="my-startup-investor-name">Together Fund</div>
                    <div className="my-startup-investor-status committed">● Committed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Feedback */}
            <div className="my-startup-feedback-card">
              <div className="my-startup-card-header">
                <h3 className="my-startup-card-title">Community Feedback</h3>
                <button className="my-startup-view-all-btn">View All →</button>
              </div>
              <div className="my-startup-feedback-rating">
                <div className="my-startup-feedback-score">★ 4.6</div>
                <div className="my-startup-feedback-label">Average Rating</div>
                <div className="my-startup-feedback-count">128 Reviews</div>
              </div>
              <div className="my-startup-feedback-tags">
                <span className="my-startup-feedback-tag">Innovative</span>
                <span className="my-startup-feedback-tag">Great Team</span>
                <span className="my-startup-feedback-tag">Strong Vision</span>
                <span className="my-startup-feedback-tag">High Potential</span>
              </div>
              <div className="my-startup-feedback-item">
                <div className="my-startup-feedback-avatar">
                  <div className="my-startup-feedback-avatar-circle">A</div>
                </div>
                <div className="my-startup-feedback-content">
                  <div className="my-startup-feedback-author">Alex Morgan</div>
                  <div className="my-startup-feedback-time">2d ago</div>
                  <p className="my-startup-feedback-text">Nebula AI has a strong vision and their team is top-notch.</p>
                  <div className="my-startup-feedback-stars">★★★★★</div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="my-startup-products-card">
              <div className="my-startup-card-header">
                <h3 className="my-startup-card-title">Products</h3>
                <button className="my-startup-view-all-btn">View All Products →</button>
              </div>
              <div className="my-startup-product-list">
                <div className="my-startup-product-item">
                  <div className="my-startup-product-avatar">N</div>
                  <div className="my-startup-product-info">
                    <div className="my-startup-product-name">
                      Nebula Copilot
                      <span className="my-startup-product-badge live">Live</span>
                    </div>
                    <div className="my-startup-product-desc">AI Assistant for Founders</div>
                    <div className="my-startup-product-metrics">
                      <span>1.2K</span>
                      <span>↑12K</span>
                    </div>
                  </div>
                </div>
                <div className="my-startup-product-item">
                  <div className="my-startup-product-avatar">N</div>
                  <div className="my-startup-product-info">
                    <div className="my-startup-product-name">
                      Nebula Analytics
                      <span className="my-startup-product-badge live">Live</span>
                    </div>
                    <div className="my-startup-product-desc">AI Analytics Dashboard</div>
                    <div className="my-startup-product-metrics">
                      <span>850</span>
                      <span>↑8K</span>
                    </div>
                  </div>
                </div>
                <div className="my-startup-product-item">
                  <div className="my-startup-product-avatar">N</div>
                  <div className="my-startup-product-info">
                    <div className="my-startup-product-name">
                      Nebula Cloud
                      <span className="my-startup-product-badge beta">Beta</span>
                    </div>
                    <div className="my-startup-product-desc">AI Native Cloud Platform</div>
                    <div className="my-startup-product-metrics">
                      <span>320</span>
                      <span>↑3K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="my-startup-team-card">
              <div className="my-startup-card-header">
                <h3 className="my-startup-card-title">Team Members</h3>
                <button className="my-startup-view-all-btn">Manage →</button>
              </div>
              <div className="my-startup-team-list">
                <div className="my-startup-team-item">
                  <div className="my-startup-team-avatar">
                    <div className="my-startup-team-avatar-circle">A</div>
                  </div>
                  <div className="my-startup-team-info">
                    <div className="my-startup-team-name">Arjun Mehta</div>
                    <div className="my-startup-team-role">Founder</div>
                  </div>
                  <div className="my-startup-team-more">⋮</div>
                </div>
                <div className="my-startup-team-item">
                  <div className="my-startup-team-avatar">
                    <div className="my-startup-team-avatar-circle">I</div>
                  </div>
                  <div className="my-startup-team-info">
                    <div className="my-startup-team-name">Ishita Sharma</div>
                    <div className="my-startup-team-role">Co-Founder</div>
                  </div>
                  <div className="my-startup-team-more">⋮</div>
                </div>
                <div className="my-startup-team-item">
                  <div className="my-startup-team-avatar">
                    <div className="my-startup-team-avatar-circle">R</div>
                  </div>
                  <div className="my-startup-team-info">
                    <div className="my-startup-team-name">Rohan Verma</div>
                    <div className="my-startup-team-role">Head of Product</div>
                  </div>
                  <div className="my-startup-team-more">⋮</div>
                </div>
                <div className="my-startup-team-item">
                  <div className="my-startup-team-avatar">
                    <div className="my-startup-team-avatar-circle">S</div>
                  </div>
                  <div className="my-startup-team-info">
                    <div className="my-startup-team-name">Sara Iqbal</div>
                    <div className="my-startup-team-role">Lead Designer</div>
                  </div>
                  <div className="my-startup-team-more">⋮</div>
                </div>
              </div>
              <button className="my-startup-team-view-all">View All Team Members →</button>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="my-startup-bottom-grid">
            {/* Recent Activity */}
            <div className="my-startup-activity-card">
              <div className="my-startup-card-header">
                <h3 className="my-startup-card-title">Recent Activity</h3>
                <button className="my-startup-view-all-btn">View All →</button>
              </div>
              <div className="my-startup-activity-list">
                <div className="my-startup-activity-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div className="my-startup-activity-text">
                    <span className="my-startup-activity-bold">Nebula AI raised $210K in Seed Round</span>
                  </div>
                  <div className="my-startup-activity-time">2h ago</div>
                </div>
                <div className="my-startup-activity-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                  </svg>
                  <div className="my-startup-activity-text">
                    <span className="my-startup-activity-bold">New investor Accel scheduled a meeting</span>
                  </div>
                  <div className="my-startup-activity-time">5h ago</div>
                </div>
                <div className="my-startup-activity-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"/>
                  </svg>
                  <div className="my-startup-activity-text">
                    <span className="my-startup-activity-bold">Sara Khan joined Nebula AI</span>
                  </div>
                  <div className="my-startup-activity-time">1d ago</div>
                </div>
                <div className="my-startup-activity-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                  <div className="my-startup-activity-text">
                    <span className="my-startup-activity-bold">Nebula Copilot reached 1K users</span>
                  </div>
                  <div className="my-startup-activity-time">2d ago</div>
                </div>
              </div>
            </div>

            {/* Documents Vault */}
            <div className="my-startup-docs-card">
              <div className="my-startup-card-header">
                <h3 className="my-startup-card-title">Documents Vault</h3>
                <button className="my-startup-view-all-btn">View All →</button>
              </div>
              <div className="my-startup-docs-list">
                <div className="my-startup-doc-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                  <div className="my-startup-doc-info">
                    <div className="my-startup-doc-name">Pitch Deck.pdf</div>
                    <div className="my-startup-doc-meta">2.4 MB • May 30, 2025</div>
                  </div>
                </div>
                <div className="my-startup-doc-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <div className="my-startup-doc-info">
                    <div className="my-startup-doc-name">Financial Model.xlsx</div>
                    <div className="my-startup-doc-meta">1.1 MB • May 28, 2025</div>
                  </div>
                </div>
                <div className="my-startup-doc-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <div className="my-startup-doc-info">
                    <div className="my-startup-doc-name">Cap Table.xlsx</div>
                    <div className="my-startup-doc-meta">820 KB • May 25, 2025</div>
                  </div>
                </div>
                <div className="my-startup-doc-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                  <div className="my-startup-doc-info">
                    <div className="my-startup-doc-name">Business Plan.docx</div>
                    <div className="my-startup-doc-meta">2.1 MB • May 20, 2025</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Copilot Banner */}
          <div className="my-startup-copilot-banner" onClick={() => setCopilotOpen(true)}>
            <div className="my-startup-copilot-banner-left">
              <div className="my-startup-copilot-banner-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"/>
                </svg>
              </div>
              <div className="my-startup-copilot-banner-text">
                <h3>AI Copilot</h3>
                <p>Get insights, suggestions and guidance to grow your startup faster.</p>
              </div>
            </div>
            <div className="my-startup-copilot-input-wrapper">
              <input type="text" placeholder="Ask anything about your startup..." className="my-startup-copilot-input" onClick={(e) => {e.preventDefault(); setCopilotOpen(true);}}/>
              <button className="my-startup-copilot-send">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </div>
          </div>
        </main>
      </div>
      <AICopilot isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />
    </div>
  );
};

export default MyStartup;
