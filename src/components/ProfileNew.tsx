import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileNew.css';

const ProfileNew: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has proper navigation flow
    const hasRoleSelection = localStorage.getItem('selectedRole');
    if (!hasRoleSelection) {
      // Redirect to role selection if no role is set
      navigate('/role-selection');
      return;
    }
    
    // Simulate loading and then show profile
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);

  const handleBackToNetwork = () => {
    navigate('/home');
  };

  const handleShareProfile = () => {
    // Share profile functionality
    alert('Profile shared!');
  };

  const handleConnect = () => {
    // Connect functionality
    alert('Connect request sent!');
  };

  const handleMessage = () => {
    // Message functionality
    alert('Message feature coming soon!');
  };

  const metrics = [
    { icon: '🚀', label: 'Startups Built', value: '12' },
    { icon: '⭐', label: 'Avg Feedback Score', value: '4.8' },
    { icon: '🤝', label: 'Successful Matches', value: '28' },
    { icon: '🌍', label: 'Community Impact', value: 'High' }
  ];

  const expertise = [
    'AI Infrastructure',
    'SaaS Development',
    'Developer Tools',
    'Open Source',
    'FinTech'
  ];

  const linkedAssets = [
    { icon: '📄', name: 'Pitch Deck.pdf', size: '2.4 MB' },
    { icon: '🎥', name: 'Demo Reel.mp4', size: '15.7 MB' },
    { icon: '🌐', name: 'Website', size: 'Link' },
    { icon: '📊', name: 'Research Report.pdf', size: '1.2 MB' }
  ];

  const timeline = [
    {
      icon: '💰',
      title: 'Series A Closed',
      description: 'Led $2.5M seed round with top-tier VCs',
      time: '2 days ago'
    },
    {
      icon: '🤝',
      title: 'Mentor Match',
      description: 'Connected with 3 experienced founders',
      time: '1 week ago'
    },
    {
      icon: '📈',
      title: 'Feedback Received',
      description: '4.9/5.0 average from 12 investors',
      time: '2 weeks ago'
    },
    {
      icon: '🤝',
      title: 'Collaboration Started',
      description: 'Partnering with Synthara on AI integration',
      time: '3 weeks ago'
    }
  ];

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">◆</div>
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <header className="profile-header">
        <button className="back-button" onClick={handleBackToNetwork}>
          ← Back to Network
        </button>
        <button className="share-button" onClick={handleShareProfile}>
          Share Profile
        </button>
        <div className="logo">
          <div className="logo-fallback">◆</div>
        </div>
      </header>

      {/* Profile Summary */}
      <div className="profile-summary">
        <div className="profile-info">
          <div className="profile-image-container">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
              alt="Arjun Mehta" 
              className="profile-image"
            />
            <div className="verification-badge">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10C20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L8 12.17L15 6L8 15Z" fill="#FFD700"/>
              </svg>
            </div>
          </div>
          <div className="profile-details">
            <h1 className="founder-name">Arjun Mehta</h1>
            <span className="founder-badge">Founder</span>
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
      </div>

      {/* Main Content Grid */}
      <div className="profile-content-grid">
        {/* Left Column - Metrics */}
        <div className="profile-metrics">
          <h3 className="section-title">Founder Metrics</h3>
          <div className="metrics-grid">
            {metrics.map((metric, index) => (
              <div key={index} className="metric-card">
                <div className="metric-icon">{metric.icon}</div>
                <div className="metric-info">
                  <div className="metric-value">{metric.value}</div>
                  <div className="metric-label">{metric.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - About & Assets */}
        <div className="profile-details-section">
          {/* About Section */}
          <div className="about-section">
            <h3 className="section-title">About</h3>
            <p className="founder-description">
              Building AI infrastructure systems that power the next generation of product teams. 
              Focused on scalable solutions, developer experience, and enterprise-grade reliability.
            </p>
            <div className="expertise-tags">
              {expertise.map((tag, index) => (
                <span key={index} className="expertise-tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* Linked Assets */}
          <div className="linked-assets">
            <h3 className="section-title">Linked Assets</h3>
            <div className="assets-list">
              {linkedAssets.map((asset, index) => (
                <div key={index} className="asset-row">
                  <div className="asset-icon">{asset.icon}</div>
                  <div className="asset-info">
                    <div className="asset-name">{asset.name}</div>
                    <div className="asset-size">{asset.size}</div>
                  </div>
                  <button className="asset-action">Open</button>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="activity-timeline">
            <h3 className="section-title">Activity Timeline</h3>
            <div className="timeline-list">
              {timeline.map((event, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-icon">{event.icon}</div>
                  <div className="timeline-content">
                    <div className="timeline-title">{event.title}</div>
                    <div className="timeline-description">{event.description}</div>
                    <div className="timeline-time">{event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div className="social-proof">
            <h3 className="section-title">Social Proof</h3>
            <div className="proof-card">
              <div className="proof-rating">⭐ 4.9/5.0</div>
              <div className="proof-quote">
                "Exceptional founder with clear vision and strong execution capabilities."
              </div>
              <div className="proof-author">— Sarah Chen, Sequoia Capital</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="action-bar">
        <button className="action-btn primary" onClick={handleConnect}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M13 10V3L21 3M8 21L3 21L3 3V17L8 17L13 17Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Connect
        </button>
        <button className="action-btn secondary" onClick={handleMessage}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 11.5C21 11.5 19 11.5H5C5 11.5 3 11.5V17.5C3 17.5 5 17.5H19M21 6H13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Message
        </button>
      </div>
    </div>
  );
};

export default ProfileNew;
