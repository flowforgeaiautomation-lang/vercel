import React, { useState } from 'react';
import './CreatePost.css';

interface CreatePostProps {
  role?: 'ARCHITECT' | 'EXPLORER' | 'CATALYST';
  onClose?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ role = 'ARCHITECT', onClose }) => {
  const [selectedPostType, setSelectedPostType] = useState('Startup Launch');
  const [selectedIntent, setSelectedIntent] = useState('Seeking Investment');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('Public');

  const postTypes = [
    'Startup Launch',
    'Idea / Concept',
    'Progress Update',
    'Investment Opportunity',
    'Feedback Request',
    'Collaboration Request',
    'Insight / Research',
    'Milestone / Achievement'
  ];

  const intents = [
    'Seeking Investment',
    'Seeking Feedback',
    'Hiring',
    'Partnerships',
    'Sharing Insight'
  ];

  const tags = ['AI', 'Fintech', 'SaaS', 'B2B', 'Infrastructure', 'Early Stage'];

  const getRoleColors = (role: string) => {
    if (role === 'CATALYST') {
      return ['#00C896', '#34D399', '#059669', '#10B981', '#065F46'];
    } else if (role === 'EXPLORER') {
      return ['#3B82F6', '#60A5FA', '#2563EB', '#38BDF8', '#0284C7'];
    } else {
      return ['#B8860B', '#DAA520', '#8B6914', '#FFD700', '#CD853F'];
    }
  };

  const roleColors = getRoleColors(role);
  const traction = [
    { label: 'Users', value: '10,000+', color: roleColors[0] },
    { label: 'Revenue', value: '$120K MRR', color: roleColors[1] },
    { label: 'Growth', value: '48% MoM', color: roleColors[2] },
    { label: 'Waitlist', value: '5,200+', color: roleColors[3] },
    { label: 'Partnerships', value: '12', color: roleColors[4] }
  ];

  const assets = [
    { name: 'Pitch Deck', type: 'PDF' },
    { name: 'Demo Video', type: 'MP4' },
    { name: 'Product Doc', type: 'PDF' }
  ];

  return (
    <div className="create-post-overlay">
      <div className={`create-post-modal role-${role.toLowerCase()}`}>
        <div className="create-post-header">
          <div className="create-post-header-left">
            <h1 className="create-post-title">Create Post</h1>
            <p className="create-post-subtitle">Publish a signal to the ecosystem ✨</p>
          </div>
          <div className="create-post-header-right">
            <button className="save-draft-btn" onClick={onClose}>Save Draft</button>
            <button className="close-modal-btn" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="create-post-user-header">
          <div className="user-avatar-wrapper">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              alt="User"
              className="user-avatar"
            />
          </div>
          <div className="user-info">
            <div className="user-name-row">
              <h2 className="user-name">Unnati Chaudhary</h2>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#B8860B' }}>
                <path d="M12 0C5.37 0 0 5.37 0 12C0 18.63 5.37 24 12 24C18.63 24 24 18.63 24 12C24 5.37 18.63 0 12 0ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
              </svg>
            </div>
            <p className="user-title">Founder & CEO @ Nexora</p>
            <div className="user-badges">
              <span className="user-badge">{role === 'ARCHITECT' ? 'Architect' : role === 'EXPLORER' ? 'Explorer' : 'Catalyst'}</span>
              <span className="user-meta">👑 Sovereign Tier • Trust Index 94</span>
            </div>
          </div>
        </div>

        <div className="post-type-selector">
          {postTypes.map((type) => (
            <div
              key={type}
              className={`post-type-card ${selectedPostType === type ? 'selected' : ''}`}
              onClick={() => setSelectedPostType(type)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {type === 'Startup Launch' && (
                  <>
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  </>
                )}
                {type === 'Idea / Concept' && (
                  <>
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                  </>
                )}
                {type === 'Progress Update' && (
                  <>
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </>
                )}
                {type === 'Investment Opportunity' && (
                  <>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  </>
                )}
                {type === 'Feedback Request' && (
                  <>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </>
                )}
                {type === 'Collaboration Request' && (
                  <>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </>
                )}
                {type === 'Insight / Research' && (
                  <>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </>
                )}
                {type === 'Milestone / Achievement' && (
                  <>
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    <path d="M12 2v10" />
                    <circle cx="12" cy="12" r="4" />
                  </>
                )}
              </svg>
              <span>{type}</span>
            </div>
          ))}
        </div>

        <div className="description-section">
          <div className="section-title-row">
            <h3 className="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              What are you sharing?
            </h3>
          </div>
          <div className="textarea-wrapper">
            <textarea
              className="description-textarea"
              placeholder="Describe your startup, vision, traction, or the opportunity you're building…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
            />
            <div className="char-counter">{description.length}/2000</div>
          </div>
        </div>

        <div className="investment-details-section">
          <div className="section-title-row">
            <h3 className="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              Investment Opportunity Details
            </h3>
          </div>
          <div className="investment-grid">
            <div className="investment-field">
              <label className="field-label">Funding Stage</label>
              <select className="field-select">
                <option>Seed</option>
                <option>Series A</option>
                <option>Series B</option>
              </select>
            </div>
            <div className="investment-field">
              <label className="field-label">Ticket Size</label>
              <select className="field-select">
                <option>$250K — $1M</option>
                <option>$1M — $5M</option>
                <option>$5M — $10M</option>
              </select>
            </div>
            <div className="investment-field">
              <label className="field-label">Industry / Focus (Select up to 3)</label>
              <select className="field-select">
                <option>Fintech • SaaS • Infra</option>
              </select>
              <div className="selected-tags">
                <span className="selected-tag">Fintech</span>
                <span className="selected-tag">SaaS</span>
                <span className="selected-tag">Infra</span>
              </div>
            </div>
            <div className="investment-field">
              <label className="field-label">Funding Purpose</label>
              <select className="field-select">
                <option>Product Scaling</option>
                <option>Marketing</option>
                <option>Hiring</option>
              </select>
            </div>
            <div className="investment-field">
              <label className="field-label">Investment Status</label>
              <select className="field-select">
                <option>Raising Now</option>
                <option>Upcoming Round</option>
              </select>
            </div>
            <div className="investment-field">
              <label className="field-label">Target Investors</label>
              <select className="field-select">
                <option>Angels, VCs, Strategic Investors</option>
              </select>
            </div>
          </div>
        </div>

        <div className="traction-section">
          <div className="section-title-row">
            <h3 className="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18" />
                <path d="m19 9 12 16 5 9" />
              </svg>
              Traction Snapshot (Optional)
            </h3>
          </div>
          <div className="traction-grid">
            {traction.map((item, index) => (
              <div key={index} className="traction-card" style={{ '--accent-color': item.color } as React.CSSProperties}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2">
                  {index === 0 && (
                    <>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h8a3.5 3.5 0 0 0 0-7zM21 19H2.99" />
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </>
                  )}
                  {index === 3 && (
                    <>
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </>
                  )}
                  {index === 4 && (
                    <>
                      <circle cx="12" cy="5" r="3" />
                      <circle cx="5" cy="19" r="3" />
                      <circle cx="19" cy="19" r="3" />
                      <line x1="12" y1="8" x2="5" y2="16" />
                      <line x1="12" y1="8" x2="19" y2="16" />
                    </>
                  )}
                </svg>
                <div className="traction-value">{item.value}</div>
                <div className="traction-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="intent-visibility-row">
          <div className="intent-section">
            <h3 className="section-title small">Post Intent</h3>
            <p className="section-subtitle">Let others know why you're posting</p>
            <div className="intent-pills">
              {intents.map((intent) => (
                <button
                  key={intent}
                  className={`intent-pill ${selectedIntent === intent ? 'selected' : ''}`}
                  onClick={() => setSelectedIntent(intent)}
                >
                  {intent}
                </button>
              ))}
            </div>
          </div>
          <div className="visibility-section">
            <h3 className="section-title small">Visibility</h3>
            <select className="visibility-select" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
              <option>Public</option>
              <option>Private</option>
              <option>Followers Only</option>
            </select>
          </div>
        </div>

        <div className="assets-tags-row">
          <div className="assets-section">
            <h3 className="section-title small">Attach Assets</h3>
            <p className="section-subtitle">Add supporting materials</p>
            <div className="assets-grid">
              {assets.map((asset, index) => (
                <div key={index} className="asset-card">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <div className="asset-info">
                    <div className="asset-name">{asset.name}</div>
                    <div className="asset-type">{asset.type}</div>
                  </div>
                  <button className="asset-remove-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="add-asset-card">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add More</span>
              </div>
            </div>
          </div>

          <div className="tags-section">
            <h3 className="section-title small">Tags</h3>
            <p className="section-subtitle">Add relevant tags to increase visibility</p>
            <div className="tags-list">
              {tags.map((tag, index) => (
                <span key={index} className="tag-pill">
                  {tag}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="preview-section">
          <div className="section-title-row">
            <h3 className="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Live Preview
            </h3>
            <span className="preview-subtitle">This is how your post will appear in the feed</span>
          </div>
          <div className="preview-card">
            <div className="preview-header">
              <div className="preview-avatar-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  alt="Preview"
                  className="preview-avatar"
                />
              </div>
              <div className="preview-user-info">
                <div className="preview-user-name">Unnati Chaudhary</div>
                <div className="preview-user-title">Founder & CEO @ Nexora</div>
                <div className="preview-time">2m ago</div>
              </div>
            </div>
            <div className="preview-badges">
              <span className="preview-badge">Seed</span>
              <span className="preview-badge">$250K — $1M</span>
              <span className="preview-badge">Fintech</span>
              <span className="preview-badge">SaaS</span>
              <span className="preview-badge">Infra</span>
              <span className="preview-badge intent">Seeking Investment</span>
            </div>
            <div className="preview-content">
              <h4 className="preview-title">Building Nexora — the AI-powered infrastructure for modern fintech.</h4>
              <p className="preview-text">Our platform enables real-time fraud detection, risk scoring and compliance automation for digital financial platforms.</p>
              <div className="preview-metrics">
                <span className="preview-metric">10K+ Users</span>
                <span className="preview-metric">$120K MRR</span>
                <span className="preview-metric">48% MoM Growth</span>
                <span className="preview-metric">12 Partnerships</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom-actions">
          <button className="publish-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            <div className="publish-text">
              <span className="publish-main">Publish Signal</span>
              <span className="publish-sub">Share with the ecosystem</span>
            </div>
          </button>
          <button className="save-draft-bottom-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
            <div className="save-text">
              <span className="save-main">Save Draft</span>
              <span className="save-sub">Save and continue later</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
