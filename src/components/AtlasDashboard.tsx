import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import PrestigeStarBadge from './PrestigeStarBadge';

const AtlasSearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

const AtlasFiltersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6h16"></path>
    <path d="M8 12h8"></path>
    <path d="M12 18h4"></path>
  </svg>
);

const AtlasBookmarkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
  </svg>
);

const AtlasHistoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 6v6l4 2"></path>
  </svg>
);

const AtlasDashboard = () => {
  const { profile } = useAuth();
  const { userData } = useUser();
  const navigate = useNavigate();
  const [activeSearchTab, setActiveSearchTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const searchTabs = ['All', 'Posts', 'Startups', 'People', 'Investments', 'Reviews', 'Partnerships', 'Knowledge', 'Communities'];
  const popularSearches = [
    'AI startups', 'Seed investors', 'Funding announcement', 'Product launches',
    'Fintech founders', 'Startup hiring', 'SaaS acquisition', 'Market research'
  ];

  const getUserName = () => {
    return userData?.profile?.name || profile?.name || "Arjun Patel";
  };

  const getUserRole = () => {
    return userData?.mainRole || profile?.role || "Architect";
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="sd-container">
      {/* Left Sidebar */}
      <div className="sd-left-sidebar">
        {/* Logo */}
        <div className="sd-logo">
          <div className="sd-logo-icon">
            <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#FFD700'}} />
                  <stop offset="100%" style={{stopColor:'#FFA500'}} />
                </linearGradient>
              </defs>
              <polygon points="20,80 50,20 80,80" fill="url(#logoGrad)" />
              <text x="50" y="72" textAnchor="middle" fill="#000" fontSize="28" fontWeight="800" fontFamily="Arial">T</text>
            </svg>
          </div>
          <span className="sd-logo-text">TRIVEON</span>
        </div>

        {/* Navigation */}
        <nav className="sd-nav">
          <div className="sd-nav-item" onClick={() => navigate('/home')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Discover</span>
          </div>
          <div className="sd-nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            <span>Atlas</span>
          </div>
          <div className="sd-nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline></svg>
            <span>Insights</span>
          </div>
        </nav>
      </div>

      {/* ATLAS Main Content */}
      <div className="sd-main" style={{ background: 'linear-gradient(180deg, rgba(120, 119, 198, 0.15) 0%, rgba(10, 10, 26, 1) 25%)' }}>
        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/home')}>
            <div style={{
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px'
            }}>
              <svg width="26" height="26" viewBox="0 0 100 100" fill="none">
                <polygon points="20,80 50,20 80,80" fill="#000" />
                <text x="50" y="72" textAnchor="middle" fill="white" fontSize="28" fontWeight="800" fontFamily="Arial">T</text>
              </svg>
            </div>
            <span style={{
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 800,
              letterSpacing: '1px'
            }}>TRIVEON</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button onClick={() => navigate('/bookmarks')} style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 500
            }}>
              <AtlasBookmarkIcon />
              <span>Saved Searches</span>
            </button>
            <button onClick={() => navigate('/profile')} style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 500
            }}>
              <AtlasHistoryIcon />
              <span>Recent Searches</span>
            </button>
          </div>
        </header>

        {/* Hero Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px', padding: '0 24px' }}>
          <h1 style={{
            fontSize: '5rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #9980FA 0%, #FDA7DF 50%, #9980FA 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            lineHeight: 0.95
          }}>ATLAS</h1>
          <p style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: '1.15rem',
            margin: '12px 0 0',
            fontWeight: 500
          }}>Find anything across TRIVEON.</p>
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', marginBottom: '28px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '2px solid rgba(153, 128, 250, 0.3)',
            borderRadius: '24px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 0 40px rgba(153, 128, 250, 0.1)'
          }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0 }}>
              <AtlasSearchIcon />
            </div>
            <input 
              type="text"
              placeholder="Search startups, people, posts, investments, opportunities…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 400
              }}
            />
            <div style={{
              borderLeft: '1px solid rgba(255,255,255,0.1)',
              paddingLeft: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <AtlasFiltersIcon />
              <span style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.9rem',
                fontWeight: 600
              }}>⌘ K</span>
            </div>
          </div>
        </div>

        {/* Search Tabs */}
        <div style={{ 
          maxWidth: '900px', 
          margin: '0 auto', 
          padding: '0 24px', 
          display: 'flex', 
          gap: '8px', 
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          paddingBottom: '16px',
          marginBottom: '24px'
        }}>
          {searchTabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveSearchTab(tab)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '16px',
                color: activeSearchTab === tab ? '#9980FA' : 'rgba(255,255,255,0.6)',
                fontSize: '0.9rem',
                fontWeight: activeSearchTab === tab ? 700 : 500,
                cursor: 'pointer',
                borderBottom: activeSearchTab === tab ? '2px solid #9980FA' : '2px solid transparent',
                borderRadiusBottom: 0
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Popular Searches */}
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <h3 style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '16px', letterSpacing: '0.4px' }}>
            Popular Searches
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {popularSearches.map((search, idx) => (
              <button 
                key={idx}
                onClick={() => setSearchQuery(search)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  padding: '12px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(153, 128, 250, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(153, 128, 250, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                }}
              >
                <AtlasSearchIcon />
                <span>{search}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Icon */}
        <div style={{ textAlign: 'center', marginTop: '60px', paddingBottom: '40px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '2px solid rgba(153,128,250,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9980FA" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"></polygon>
            </svg>
          </div>
          <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.85rem',
            fontWeight: 400,
            margin: 0
          }}>One search. Everything in TRIVEON.</p>
        </div>
      </div>
    </div>
  );
};

export default AtlasDashboard;
