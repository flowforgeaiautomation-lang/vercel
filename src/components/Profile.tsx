import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToNetwork = () => {
    navigate('/home');
  };

  const handleShareProfile = () => {
    // Share profile functionality
    alert('Profile shared!');
  };

  const trendingStartups = [
    { name: 'Synthara', description: 'AI infrastructure for product teams', change: '+12%' },
    { name: 'Pixelic', description: 'Design automation platform', change: '+8%' },
    { name: 'Datumo', description: 'Data intelligence for AI teams', change: '+15%' },
    { name: 'Nexora', description: 'Next-gen cloud solutions', change: '+6%' }
  ];

  const feedItems = [
    {
      id: 1,
      type: 'funding',
      title: 'Synthara raises $2M Pre-Seed',
      description: 'Led by top-tier VCs to scale AI infrastructure',
      time: '2 hours ago',
      author: 'Arjun Mehta'
    },
    {
      id: 2,
      type: 'milestone',
      title: 'Pixelic hits 10K users',
      description: 'Design automation platform reaches major milestone',
      time: '4 hours ago',
      author: 'Team Pixelic'
    },
    {
      id: 3,
      type: 'partnership',
      title: 'Datumo partners with AWS',
      description: 'Strategic partnership to enhance data capabilities',
      time: '6 hours ago',
      author: 'Raj Kumar'
    }
  ];

  return (
    <div className="profile-container">
      {/* Header */}
      <header className="profile-header">
        <button className="back-button" onClick={handleBackToNetwork}>
          ← Back to Network
        </button>
        <button className="share-button" onClick={handleShareProfile}>
          Share Profile
        </button>
        <div className="logo">
          <img 
            src="/images/triventa-logo.png" 
            alt="TRIVENTA" 
            className="logo-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="logo-fallback hidden">◆</div>
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
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10C20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L8 12.17L15 6L8 15Z" fill="#D4AF37"/>
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
        {/* Left Column - Feed */}
        <div className="profile-feed">
          <h3 className="section-title">Activity Feed</h3>
          <div className="feed-list">
            {feedItems.map((item) => (
              <div key={item.id} className="feed-item">
                <div className="feed-item-header">
                  <div className="feed-item-meta">
                    <span className="feed-type">{item.type}</span>
                    <span className="feed-time">{item.time}</span>
                  </div>
                </div>
                <h4 className="feed-title">{item.title}</h4>
                <p className="feed-description">{item.description}</p>
                <div className="feed-author">by {item.author}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="profile-sidebar">
          <div className="trending-section">
            <h3>Trending Startups</h3>
            <div className="trending-list">
              {trendingStartups.map((startup, index) => (
                <div key={index} className="trending-item">
                  <h4>{startup.name}</h4>
                  <p>{startup.description}</p>
                  <span className={`trending-change ${startup.change.startsWith('+') ? 'positive' : 'negative'}`}>
                    {startup.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button className="action-btn primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5V19M5 12H19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              New Post
            </button>
            <button className="action-btn secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15V19A2 2 0 0 1 19 17H5A2 2 0 0 1 3 15V19A2 2 0 0 1 5 21H19A2 2 0 0 1 21 15Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Share Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
