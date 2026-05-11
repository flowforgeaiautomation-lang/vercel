import React from 'react';
import './FounderProfile.css';

const FounderProfile: React.FC = () => {
  return (
    <div className="founder-profile">
      <div className="profile-container">
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

        {/* Linked Assets */}
        <div className="linked-assets">
          <h3 className="section-title">Linked Assets</h3>
          <div className="assets-list">
            <div className="asset-item">
              <div className="asset-icon">📄</div>
              <div className="asset-info">
                <div className="asset-name">Synthara_Pitch_Deck.pdf</div>
                <div className="asset-meta">PDF - 2.4 MB</div>
              </div>
              <button className="asset-action">Download</button>
            </div>
            <div className="asset-item">
              <div className="asset-icon">🎥</div>
              <div className="asset-info">
                <div className="asset-name">Synthara_Demo.mp4</div>
                <div className="asset-meta">Video - 12.6 MB</div>
              </div>
              <button className="asset-action">Open</button>
            </div>
            <div className="asset-item">
              <div className="asset-icon">🌐</div>
              <div className="asset-info">
                <div className="asset-name">Synthara Website</div>
                <div className="asset-meta">synthara.ai</div>
              </div>
              <button className="asset-action">Visit</button>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="activity-timeline">
          <h3 className="section-title">Activity Timeline</h3>
          <div className="timeline-items">
            <div className="timeline-item">
              <div className="timeline-icon">💰</div>
              <div className="timeline-content">
                <div className="timeline-title">Synthara raised Pre-Seed round</div>
                <div className="timeline-subtitle">Connected with 3 investors</div>
                <div className="timeline-timestamp">2d ago</div>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">⭐</div>
              <div className="timeline-content">
                <div className="timeline-title">Gave feedback on Pixelic</div>
                <div className="timeline-subtitle">Rated 4.8/5</div>
                <div className="timeline-timestamp">4d ago</div>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">🤝</div>
              <div className="timeline-content">
                <div className="timeline-title">Matched with Raj, Co-founder @ Datumo</div>
                <div className="timeline-subtitle">Building data infra for AI teams</div>
                <div className="timeline-timestamp">1w ago</div>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">🏆</div>
              <div className="timeline-content">
                <div className="timeline-title">Received 5-star feedback</div>
                <div className="timeline-subtitle">On feedback for Nexora</div>
                <div className="timeline-timestamp">1w ago</div>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">📄</div>
              <div className="timeline-content">
                <div className="timeline-title">Uploaded new pitch deck</div>
                <div className="timeline-subtitle">Synthara_PreSeed_Deck.pdf</div>
                <div className="timeline-timestamp">2w ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Card */}
        <div className="social-proof">
          <div className="social-proof-header">
            <div className="rating">
              <span className="rating-value">4.8/5</span>
              <div className="stars">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          </div>
          <p className="testimonial">
            "Arjun is a sharp builder with strong execution skills and a clear vision."
          </p>
          <div className="testimonial-author">- Neeraj K., Investor</div>
        </div>

        {/* Bottom Action Bar */}
        <div className="action-bar">
          <p className="action-text">Let's build the future together. Open to investor conversations and strategic partnerships.</p>
          <div className="action-buttons">
            <button className="btn-primary">Connect</button>
            <button className="btn-secondary">Message</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderProfile;
