import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-image-container">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
              alt="Arjun Mehta" 
              className="profile-image"
            />
            <div className="verification-badge">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="#D4AF37"/>
              </svg>
            </div>
          </div>
          <div className="profile-info">
            <div className="name-row">
              <h1 className="founder-name">Arjun Mehta</h1>
              <span className="founder-badge">Founder</span>
            </div>
            <p className="founder-headline">Founder & CEO @ Synthara</p>
            <p className="founder-description">Building AI infrastructure for next-gen product teams.</p>
            <div className="founder-meta">
              <span className="location">📍 Bengaluru, India</span>
              <span className="website">🔗 synthara.ai</span>
            </div>
          </div>
        </div>

        {/* Credibility Strip */}
        <div className="credibility-strip">
          <div className="credibility-item">
            <span className="credibility-label">Prestige Level</span>
            <span className="credibility-value">Catalyst</span>
          </div>
          <div className="credibility-separator"></div>
          <div className="credibility-item">
            <span className="credibility-label">Expertise Score</span>
            <span className="credibility-value">92/100</span>
          </div>
          <div className="credibility-separator"></div>
          <div className="credibility-item">
            <span className="credibility-label">Trust Index</span>
            <span className="credibility-value">4.8/5</span>
          </div>
          <div className="credibility-separator"></div>
          <div className="credibility-item">
            <span className="credibility-label">Impact Score</span>
            <span className="credibility-value">87/100</span>
          </div>
          <div className="credibility-separator"></div>
          <div className="credibility-item">
            <span className="credibility-label">Consistency</span>
            <span className="credibility-value">Top 10%</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">🚀</div>
            <div className="metric-content">
              <div className="metric-value">7</div>
              <div className="metric-label">Startups Built / Backed</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">⭐</div>
            <div className="metric-content">
              <div className="metric-value">4.7/5</div>
              <div className="metric-label">Avg Feedback Score (Top 15%)</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">🤝</div>
            <div className="metric-content">
              <div className="metric-value">23</div>
              <div className="metric-label">Successful Matches</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div className="metric-content">
              <div className="metric-value">Top 5%</div>
              <div className="metric-label">Community Impact</div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="about-section">
          <h3 className="section-title">About</h3>
          <p className="about-description">
            I'm building Synthara to simplify how product teams deploy and scale AI systems. Passionate about developer tools, infra, and solving hard problems with elegant systems.
          </p>
          <div className="expertise-tags">
            <span className="tag">AI / ML</span>
            <span className="tag">Developer Tools</span>
            <span className="tag">SaaS</span>
            <span className="tag">Product Strategy</span>
            <span className="tag">Open Source</span>
          </div>
        </div>

        {/* Back Button */}
        <div className="profile-actions">
          <button className="back-button" onClick={handleBackToHome}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19L5 12L12 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
