import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AICopilot from './AICopilot';
import './StartupStudio.css';

const StartupStudio: React.FC = () => {
  const [copilotOpen, setCopilotOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="startup-studio-container">
      <div className="startup-studio-content">
        {/* Left Sidebar */}
        <aside className="studio-sidebar">
          <div className="studio-brand" onClick={() => navigate('/home')}>
            <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#FFD700'}} />
                  <stop offset="100%" style={{stopColor:'#FFA500'}} />
                </linearGradient>
              </defs>
              <polygon points="20,80 50,20 80,80" fill="url(#brandGrad)" />
              <text x="50" y="72" textAnchor="middle" fill="#000" fontSize="28" fontWeight="800" fontFamily="Arial">T</text>
            </svg>
            <div className="studio-brand-text">
              <span className="studio-brand-name">TRIARCORA</span>
              <span className="studio-brand-tag">BUILD. LAUNCH. SCALE.</span>
            </div>
          </div>

          <div className="studio-section-label">STARTUP</div>

          <nav className="studio-nav">
            <div className="studio-nav-item" onClick={() => navigate('/home')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              <span>HOME</span>
            </div>
            <div className="studio-nav-item" onClick={() => navigate('/startups')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span>ARCHITECTS</span>
            </div>
            <div className="studio-nav-item active" onClick={() => navigate('/startup-studio')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>Studio</span>
          </div>
        </nav>

          <div className="studio-copilot-card" onClick={() => setCopilotOpen(true)}>
            <div className="studio-copilot-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" />
              </svg>
            </div>
            <div className="studio-copilot-text">
              <strong>AI Copilot</strong>
              <span>Your startup assistant</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="studio-main">
          <div className="studio-header">
            <div className="studio-title-section">
              <h1 className="studio-title">STARTUP STUDIO <span className="title-star">✨</span></h1>
              <p className="studio-subtitle">Build. Launch. Scale.</p>
              <p className="studio-description">Powerful tools and AI to help you turn ideas into impactful startups and scale faster.</p>
            </div>
            <div className="studio-rocket">
              <div className="rocket-glow"></div>
              <svg width="220" height="220" viewBox="0 0 300 300" fill="none">
                <defs>
                  <radialGradient id="rocketGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style={{stopColor:'rgba(255,215,0,0.3)'}} />
                    <stop offset="100%" style={{stopColor:'transparent'}} />
                  </radialGradient>
                  <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#FFD700'}} />
                    <stop offset="100%" style={{stopColor:'#B8860B'}} />
                  </linearGradient>
                </defs>
                <circle cx="150" cy="150" r="120" fill="url(#rocketGlow)" />
                <path d="M150 30 L180 90 L170 200 L130 200 L120 90 Z" fill="url(#rocketGrad)" stroke="#FFD700" strokeWidth="2" />
                <circle cx="150" cy="120" r="15" fill="#0a0a16" stroke="#FFD700" strokeWidth="2" />
                <path d="M120 180 L100 220 L130 200 Z" fill="#B8860B" stroke="#FFD700" strokeWidth="1" />
                <path d="M180 180 L200 220 L170 200 Z" fill="#B8860B" stroke="#FFD700" strokeWidth="1" />
                <path d="M130 200 L150 250 L170 200 Z" fill="url(#rocketGrad)" />
                <ellipse cx="150" cy="255" rx="15" ry="25" fill="rgba(255,165,0,0.6)" />
              </svg>
            </div>
          </div>

          <div className="core-tools-label">CORE STUDIO TOOLS</div>

          <div className="studio-tools-grid">
            {/* Pitch Deck Builder */}
            <div className="studio-tool-card">
              <div className="tool-card-top">
                <div className="tool-icon-box">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                </div>
                <div className="tool-text">
                  <h3 className="tool-name">Pitch Deck Builder</h3>
                  <p className="tool-desc">Create stunning, investor-ready pitch decks with AI guidance and proven templates.</p>
                </div>
              </div>
              <div className="tool-card-bottom">
                <div className="tool-tag">10+ Templates</div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Valuation Calculator */}
            <div className="studio-tool-card">
              <div className="tool-card-top">
                <div className="tool-icon-box">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 1v22" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0-3.5 3.5 3.5 3.5 0 0 0 3.5 3.5H14.5A3.5 3.5 0 0 1 18 15.5a3.5 3.5 0 0 1-3.5 3.5H7" />
                  </svg>
                </div>
                <div className="tool-text">
                  <h3 className="tool-name">Valuation Calculator</h3>
                  <p className="tool-desc">Estimate your startup valuation using multiple methods and industry benchmarks.</p>
                </div>
              </div>
              <div className="tool-card-bottom">
                <div className="tool-tag">5 Valuation Methods</div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Runway Planner */}
            <div className="studio-tool-card">
              <div className="tool-card-top">
                <div className="tool-icon-box">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 13h18" />
                    <path d="M8 3v18" />
                    <path d="M19 8l-5 5-3-3-5 5" />
                  </svg>
                </div>
                <div className="tool-text">
                  <h3 className="tool-name">Runway Planner</h3>
                  <p className="tool-desc">Calculate your burn rate, runway, and forecast your startup's financial future.</p>
                </div>
              </div>
              <div className="tool-card-bottom">
                <div className="tool-tag">Real-time Forecasting</div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Investor CRM */}
            <div className="studio-tool-card">
              <div className="tool-card-top">
                <div className="tool-icon-box">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="tool-text">
                  <h3 className="tool-name">Investor CRM</h3>
                  <p className="tool-desc">Manage conversations, track your fundraising pipeline, and close more deals.</p>
                </div>
              </div>
              <div className="tool-card-bottom">
                <div className="tool-tag">Pipeline Management</div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Startup Canvas */}
            <div className="studio-tool-card">
              <div className="tool-card-top">
                <div className="tool-icon-box">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                    <line x1="15" y1="3" x2="15" y2="21" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="3" y1="15" x2="21" y2="15" />
                  </svg>
                </div>
                <div className="tool-text">
                  <h3 className="tool-name">Startup Canvas</h3>
                  <p className="tool-desc">Map your business model, validate your idea, and build a winning strategy.</p>
                </div>
              </div>
              <div className="tool-card-bottom">
                <div className="tool-tag">Smart Business Planning</div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* AI Co-Founder */}
            <div className="studio-tool-card" onClick={() => setCopilotOpen(true)}>
              <div className="tool-card-top">
                <div className="tool-icon-box">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="12,5 14.5,10 19.5,11 16,15 17,20 12,17.5 7,20 8,15 4.5,11 9.5,10 12,5" />
                  </svg>
                </div>
                <div className="tool-text">
                  <h3 className="tool-name">AI Co-founder</h3>
                  <p className="tool-desc">Your 24/7 AI partner to guide you in building, launching, and growing your startup.</p>
                </div>
              </div>
              <div className="tool-card-bottom">
                <div className="tool-tag">AI-Powered Insights</div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* AI Co-pilot Banner */}
          <div className="studio-copilot-banner" onClick={() => setCopilotOpen(true)}>
            <div className="copilot-banner-left">
              <div className="copilot-banner-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" />
                </svg>
              </div>
              <div className="copilot-banner-text">
                <h3>Your AI Co-pilot</h3>
                <p>Ask anything. Get instant answers, insights, and guidance.</p>
              </div>
            </div>
            <button className="copilot-banner-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Ask AI Copilot
            </button>
          </div>
        </main>
      </div>

      <AICopilot isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />
    </div>
  );
};

export default StartupStudio;
