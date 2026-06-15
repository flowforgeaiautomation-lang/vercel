import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import AICopilot from './AICopilot';
import './FeedbackHub.css';

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

const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const FeedbackHub = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { userData } = useUser();
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [activePeriod, setActivePeriod] = useState('This Month');

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
    <div className="feedback-hub-container">
      <div className="feedback-hub-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">TRIARCORA</span>
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
            <MessageIcon />
            <span>Feedback Hub</span>
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

      <div className="feedback-hub-main">
        <div className="top-header">
          <div className="header-left">
            <div className="page-title-row">
              <h1 className="page-title">Feedback Hub</h1>
              <span className="page-title-icon">💬</span>
            </div>
            <p className="page-subtitle">Help startups grow by sharing your insights and feedback.</p>
          </div>
          <div className="header-right">
            <button className="give-feedback-btn" onClick={() => setCopilotOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Give Feedback
            </button>
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
              <div className="stat-value">121</div>
              <div className="stat-label">Feedback Given</div>
              <div className="stat-sub">+18 this month</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">248</div>
              <div className="stat-label">Helpful Votes</div>
              <div className="stat-sub">+32 this month</div>
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
              <div className="stat-sub">Top 15% Explorers</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">18</div>
              <div className="stat-label">Startups Helped</div>
              <div className="stat-sub">+4 this month</div>
            </div>
          </div>
        </div>

        <div className="content-sections">
          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title">Active Feedback Requests</h3>
              <button className="view-all-link">View all</button>
            </div>
            <div className="requests-list">
              <div className="request-item">
                <div className="request-icon">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="request-info">
                  <div className="request-name">Nebula AI</div>
                  <div className="request-details">
                    <span>AI</span>
                    <span>•</span>
                    <span>Seed Stage</span>
                  </div>
                  <p className="request-description">Need feedback on onboarding experience and AI suggestions flow.</p>
                </div>
                <div className="request-timer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                  2 Days Left
                </div>
                <button className="give-feedback-btn-small">Give Feedback</button>
                <div className="request-bookmark">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                  </svg>
                </div>
              </div>

              <div className="request-item">
                <div className="request-icon purple">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 22 12 12 22 2 12" />
                  </svg>
                </div>
                <div className="request-info">
                  <div className="request-name">FinFlow</div>
                  <div className="request-details">
                    <span>Fintech</span>
                    <span>•</span>
                    <span>Pre-Seed</span>
                  </div>
                  <p className="request-description">Looking for feedback on pricing model and value proposition.</p>
                </div>
                <div className="request-timer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                  4 Days Left
                </div>
                <button className="give-feedback-btn-small">Give Feedback</button>
                <div className="request-bookmark">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                  </svg>
                </div>
              </div>

              <div className="request-item">
                <div className="request-icon green">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 16v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  </svg>
                </div>
                <div className="request-info">
                  <div className="request-name">EcoTrack</div>
                  <div className="request-details">
                    <span>Climate Tech</span>
                    <span>•</span>
                    <span>Seed</span>
                  </div>
                  <p className="request-description">Need feedback on product roadmap and feature prioritization.</p>
                </div>
                <div className="request-timer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                  5 Days Left
                </div>
                <button className="give-feedback-btn-small">Give Feedback</button>
                <div className="request-bookmark">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title">Assigned Feedback</h3>
              <button className="view-all-link">View all</button>
            </div>
            <div className="assigned-list">
              <div className="assigned-item">
                <div className="assigned-icon">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div className="assigned-info">
                  <div className="assigned-name">BuildBetter</div>
                  <div className="assigned-details">
                    <span>SaaS</span>
                    <span>•</span>
                    <span>Seed</span>
                  </div>
                  <p className="assigned-description">Provide feedback on product usability and dashboard experience.</p>
                </div>
                <div className="assigned-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '60%' }}></div>
                  </div>
                  <span className="progress-text">In Progress</span>
                </div>
                <button className="continue-btn">Continue</button>
                <div className="request-bookmark">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title">My Recent Feedback</h3>
              <button className="view-all-link">View all</button>
            </div>
            <div className="recent-feedback-table">
              <table>
                <thead>
                  <tr>
                    <th>Startup</th>
                    <th>Category</th>
                    <th>Submitted On</th>
                    <th>Helpful Votes</th>
                    <th>Founder Response</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="startup-cell">
                      <div className="startup-avatar blue">A</div>
                      TaskForge
                    </td>
                    <td>Product</td>
                    <td>May 18, 2025</td>
                    <td className="votes-cell">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                      </svg>
                      24
                    </td>
                    <td className="response-cell">
                      <div className="user-avatar-tiny">
                        <img src={getUserProfileImage()} alt="" />
                      </div>
                    </td>
                    <td className="status-cell responded">Responded</td>
                  </tr>
                  <tr>
                    <td className="startup-cell">
                      <div className="startup-avatar purple">S</div>
                      StudyBase
                    </td>
                    <td>UI / UX</td>
                    <td>May 15, 2025</td>
                    <td className="votes-cell">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                      </svg>
                      18
                    </td>
                    <td className="response-cell">
                      <div className="user-avatar-tiny">
                        <img src={getUserProfileImage()} alt="" />
                      </div>
                    </td>
                    <td className="status-cell responded">Responded</td>
                  </tr>
                  <tr>
                    <td className="startup-cell">
                      <div className="startup-avatar green">G</div>
                      GreenMesh
                    </td>
                    <td>Business Model</td>
                    <td>May 10, 2025</td>
                    <td className="votes-cell">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                      </svg>
                      12
                    </td>
                    <td className="response-cell">
                      <div className="user-avatar-tiny">
                        <img src={getUserProfileImage()} alt="" />
                      </div>
                    </td>
                    <td className="status-cell pending">Pending</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {copilotOpen && <AICopilot isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />}
    </div>
  );
};

export default FeedbackHub;
