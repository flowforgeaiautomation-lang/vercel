import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { usePosts } from '../contexts/PostContext';

// Icons
const AtlasSearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

const AtlasBookmarkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
  </svg>
);

const AtlasStarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFA500" strokeWidth="1">
    <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"></polygon>
  </svg>
);

const AtlasSparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"></polygon>
  </svg>
);

// Helper to get initials
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const AtlasDashboard = () => {
  const { profile } = useAuth();
  const { userData } = useUser();
  const { posts, startups, demoUsers } = usePosts();
  const navigate = useNavigate();
  
  // State
  const [activeSearchTab, setActiveSearchTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [showAllSaved, setShowAllSaved] = useState(false);
  const [showAllTrending, setShowAllTrending] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Search Tabs (Complete as requested)
  const searchTabs = [
    'All', 'People', 'Startups', 'Investors', 'Explorers', 
    'Posts', 'Signals', 'Funding', 'Launches', 'Marketplace', 
    'Communities', 'Knowledge', 'Reviews', 'Events', 'Opportunities'
  ];

  // Popular Searches (As requested in examples)
  const popularSearches = [
    'AI startups raising Seed', 'Fintech investors', 'Startup reviewers',
    'Climate-tech opportunities', 'Startup launches', 'Grants for founders',
    'Accelerators', 'Angel investors', 'Communities for health-tech', 'Product designers'
  ];

  // Trending Discoveries
  const trendingDiscoveries = {
    startups: ['NeuralAI', 'GreenFin', 'HealthPulse', 'EduSmart'],
    investors: ['Sequoia', 'Accel', 'Y Combinator', 'First Round'],
    launches: ['Nexus Launch', 'BioSync', 'FinFlow Pro'],
    opportunities: ['Seed Funding', 'Mentorship', 'Partnerships'],
    discussions: ['AI Ethics', 'Funding Winter', 'Product Market Fit'],
    communities: ['AI Founders', 'Climate Tech', 'SaaS Builders']
  };

  // Example Saved Searches
  const exampleSavedSearches = ['AI Startups', 'Seed Investors', 'ClimateTech Grants', 'Startup Reviewers'];

  // Load data from localStorage on mount
  useEffect(() => {
    const recents = localStorage.getItem('triveon-recent-searches');
    const saved = localStorage.getItem('triveon-saved-searches');
    
    if (recents) setRecentSearches(JSON.parse(recents));
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    } else {
      // Initialize with example saved searches
      setSavedSearches(exampleSavedSearches);
      localStorage.setItem('triveon-saved-searches', JSON.stringify(exampleSavedSearches));
    }
  }, []);

  // Save search to recent searches
  const addToRecentSearches = (query: string) => {
    if (!query.trim()) return;
    const filtered = recentSearches.filter(s => s.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...filtered].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('triveon-recent-searches', JSON.stringify(updated));
  };

  // Toggle saved search
  const toggleSavedSearch = (query: string) => {
    let updated;
    if (savedSearches.includes(query)) {
      updated = savedSearches.filter(s => s !== query);
    } else {
      updated = [...savedSearches, query];
    }
    setSavedSearches(updated);
    localStorage.setItem('triveon-saved-searches', JSON.stringify(updated));
  };

  // Handle search submission
  const handleSearch = (query: string) => {
    if (query.trim()) {
      addToRecentSearches(query);
    }
  };

  // Handle key presses in input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  // Search Results
  const getSearchResults = () => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return { 
      posts: [], startups: [], users: [], investors: [], explorers: [] 
    };

    // Filter content
    let matchedPosts = posts.filter(post => 
      post.intent.toLowerCase().includes(query) || 
      post.tags.some(tag => tag.toLowerCase().includes(query))
    );

    let matchedStartups = startups.filter(startup =>
      startup.name.toLowerCase().includes(query) ||
      startup.description.toLowerCase().includes(query) ||
      startup.tags.some(tag => tag.toLowerCase().includes(query))
    );

    let matchedUsers = Object.values(demoUsers).filter(user =>
      user.userName.toLowerCase().includes(query) ||
      user.userBio.toLowerCase().includes(query) ||
      user.tags.some(tag => tag.toLowerCase().includes(query))
    );

    // Mock investors and explorers
    let matchedInvestors = matchedUsers.filter(u => 
      u.mainRole === 'CATALYST' || u.tags.some(t => t.toLowerCase().includes('investor'))
    );
    let matchedExplorers = matchedUsers.filter(u => 
      u.mainRole === 'EXPLORER' || u.tags.some(t => t.toLowerCase().includes('review'))
    );

    return { 
      posts: matchedPosts, 
      startups: matchedStartups, 
      users: matchedUsers,
      investors: matchedInvestors,
      explorers: matchedExplorers
    };
  };

  const searchResults = getSearchResults();
  const showSuggestions = isInputFocused && searchQuery.trim() === '';
  const showSearchResults = isInputFocused && searchQuery.trim() !== '';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 100, display: 'flex', background: '#0a0a1a'
    }}>
      {/* Left Sidebar */}
      <div className="sd-left-sidebar" style={{ flexShrink: 0 }}>
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

        <nav className="sd-nav">
          <div className="sd-nav-item" onClick={() => navigate('/home')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Discover</span>
          </div>
          <div className="sd-nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>Atlas</span>
          </div>
          <div className="sd-nav-item" onClick={() => navigate('/insights')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
            <span>Insights</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="sd-main" style={{ 
        flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto',
        background: 'linear-gradient(180deg, rgba(120, 119, 198, 0.15) 0%, rgba(10, 10, 26, 1) 25%)' 
      }}>
        {/* Header */}
        <header style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/home')}>
            <div style={{
              width: '40px', height: '40px',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
                <polygon points="20,80 50,20 80,80" fill="#000" />
                <text x="50" y="72" textAnchor="middle" fill="white" fontSize="24" fontWeight="800" fontFamily="Arial">T</text>
              </svg>
            </div>
            <span style={{ color: 'white', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '1px' }}>TRIVEON</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button onClick={() => navigate('/bookmarks')} style={{
              background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)',
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500
            }}>
              <AtlasBookmarkIcon />
              <span>Saved Searches</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div style={{ flex: 1, padding: '24px 32px', overflow: 'auto' }}>
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '4rem', fontWeight: 900,
              background: 'linear-gradient(135deg, #9980FA 0%, #FDA7DF 50%, #9980FA 100%)',
              backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              margin: 0, lineHeight: 0.95
            }}>ATLAS</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem', margin: '10px 0 0', fontWeight: 500 }}>
              Search anything. Find anyone. Discover opportunities.
            </p>
          </div>

          {/* Large Search Bar */}
          <div style={{ maxWidth: '1000px', margin: '0 auto 32px', position: 'relative' }}>
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: isInputFocused ? '2px solid rgba(153, 128, 250, 0.8)' : '2px solid rgba(153, 128, 250, 0.3)',
              borderRadius: '24px', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px',
              boxShadow: isInputFocused ? '0 0 50px rgba(153, 128, 250, 0.2)' : '0 0 40px rgba(153, 128, 250, 0.1)'
            }}>
              <div style={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0 }}>
                <AtlasSearchIcon />
              </div>
              <input 
                ref={inputRef} type="text"
                placeholder="Search startups, investors, founders, opportunities, launches, funding, communities…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                onKeyDown={handleKeyDown}
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: 'white', fontSize: '1.05rem', fontWeight: 400
                }}
              />
              {/* AI Matching Button */}
              <button 
                onClick={() => alert('AI Matching: Finding best matches for you...')}
                style={{
                  background: 'linear-gradient(135deg, #9980FA 0%, #FDA7DF 100%)', border: 'none',
                  padding: '10px 20px', borderRadius: '16px', color: '#000', fontWeight: 700,
                  cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <AtlasSparkleIcon />
                Find Best Match
              </button>
            </div>

            {/* Dropdown Suggestions/Results */}
            {isInputFocused && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                background: 'rgba(20, 20, 40, 0.98)', border: '1px solid rgba(153, 128, 250, 0.3)',
                borderRadius: '20px', marginTop: '12px', padding: '16px 0',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)', maxHeight: '600px', overflowY: 'auto',
                zIndex: 1000
              }}>
                {showSuggestions && (
                  <>
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <>
                        <div style={{ padding: '8px 24px', color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Recent
                        </div>
                        {recentSearches.slice(0, 4).map((search, idx) => (
                          <div 
                            key={idx}
                            onClick={() => { setSearchQuery(search); handleSearch(search); }}
                            style={{
                              padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px',
                              color: 'rgba(255,255,255,0.9)', cursor: 'pointer', transition: 'background 0.15s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(153,128,250,0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <AtlasSearchIcon />
                            <span style={{ fontSize: '0.95rem' }}>{search}</span>
                          </div>
                        ))}
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '8px 24px' }} />
                      </>
                    )}
                    
                    {/* Popular Searches */}
                    <div style={{ padding: '8px 24px', color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Try These
                    </div>
                    {popularSearches.map((search, idx) => (
                      <div 
                        key={idx}
                        onClick={() => { setSearchQuery(search); handleSearch(search); }}
                        style={{
                          padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px',
                          color: 'rgba(255,255,255,0.9)', cursor: 'pointer', transition: 'background 0.15s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(153,128,250,0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <AtlasSearchIcon />
                        <span style={{ fontSize: '0.95rem' }}>{search}</span>
                      </div>
                    ))}
                  </>
                )}

                {showSearchResults && (
                  <>
                    {/* People Results */}
                    {searchResults.users.length > 0 && (
                      <>
                        <div style={{ padding: '8px 24px', color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          People
                        </div>
                        {searchResults.users.map(user => (
                          <div 
                            key={user.userId} onClick={() => { handleSearch(searchQuery); navigate('/profile'); }}
                            style={{
                              padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '14px',
                              color: 'rgba(255,255,255,0.9)', cursor: 'pointer', transition: 'background 0.15s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(153,128,250,0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #9980FA 0%, #FDA7DF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                              {getInitials(user.userName)}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.userName}</div>
                              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{user.userTitle}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '10px', color: 'white', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                                Connect
                              </button>
                              <button style={{ background: 'rgba(153,128,250,0.2)', border: '1px solid rgba(153,128,250,0.4)', padding: '6px 14px', borderRadius: '10px', color: '#9980FA', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                                Message
                              </button>
                            </div>
                          </div>
                        ))}
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '8px 24px' }} />
                      </>
                    )}

                    {/* Startups Results */}
                    {searchResults.startups.length > 0 && (
                      <>
                        <div style={{ padding: '8px 24px', color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Startups
                        </div>
                        {searchResults.startups.map(startup => (
                          <div 
                            key={startup.id} onClick={() => { handleSearch(searchQuery); navigate('/my-startup'); }}
                            style={{
                              padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '14px',
                              color: 'rgba(255,255,255,0.9)', cursor: 'pointer', transition: 'background 0.15s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(153,128,250,0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: '1rem' }}>
                              {getInitials(startup.name)}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {startup.name}
                                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(255,215,0,0.15)', color: '#FFD700' }}>
                                  {startup.stage || 'Seed'}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                                {startup.tags.slice(0, 3).join(' • ')}
                              </div>
                            </div>
                            <button style={{ background: 'rgba(153,128,250,0.2)', border: '1px solid rgba(153,128,250,0.4)', padding: '6px 14px', borderRadius: '10px', color: '#9980FA', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                              View Startup
                            </button>
                          </div>
                        ))}
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '8px 24px' }} />
                      </>
                    )}

                    {/* Posts Results */}
                    {searchResults.posts.length > 0 && (
                      <>
                        <div style={{ padding: '8px 24px', color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Posts
                        </div>
                        {searchResults.posts.slice(0, 3).map(post => (
                          <div 
                            key={post.id} onClick={() => handleSearch(searchQuery)}
                            style={{
                              padding: '12px 24px', display: 'flex', alignItems: 'flex-start', gap: '14px',
                              color: 'rgba(255,255,255,0.9)', cursor: 'pointer', transition: 'background 0.15s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(153,128,250,0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                              {getInitials(post.userName)}
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>{post.userName}</div>
                              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                                {post.intent}
                              </div>
                              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {post.tags.slice(0, 3).map(tag => (
                                  <span key={tag} style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '12px', background: 'rgba(153, 128, 250, 0.15)', color: '#9980FA' }}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Search Categories Tabs */}
          <div style={{ 
            maxWidth: '1100px', margin: '0 auto 28px', overflowX: 'auto',
            display: 'flex', gap: '10px', paddingBottom: '8px'
          }}>
            {searchTabs.map(tab => (
              <button 
                key={tab} onClick={() => setActiveSearchTab(tab)}
                style={{
                  background: activeSearchTab === tab ? 'rgba(153,128,250,0.15)' : 'rgba(255,255,255,0.03)',
                  border: activeSearchTab === tab ? '1px solid rgba(153,128,250,0.5)' : '1px solid rgba(255,255,255,0.08)',
                  padding: '8px 16px', borderRadius: '14px', whiteSpace: 'nowrap',
                  color: activeSearchTab === tab ? '#9980FA' : 'rgba(255,255,255,0.75)',
                  fontSize: '0.85rem', fontWeight: activeSearchTab === tab ? 700 : 500,
                  cursor: 'pointer', transition: 'all 0.2s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {/* Left Column: Trending & Saved */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Saved Searches */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AtlasBookmarkIcon />
                    Saved Searches
                  </h2>
                  <button onClick={() => setShowAllSaved(!showAllSaved)} style={{ background: 'transparent', border: 'none', color: 'rgba(153,128,250,0.9)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    {showAllSaved ? 'Show Less' : 'Show All'}
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {(showAllSaved ? savedSearches : savedSearches.slice(0, 6)).map((search, idx) => (
                    <div 
                      key={idx} onClick={() => { setSearchQuery(search); handleSearch(search); }}
                      style={{
                        background: 'rgba(153,128,250,0.1)', border: '1px solid rgba(153,128,250,0.3)',
                        padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', color: '#9980FA',
                        fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(153,128,250,0.2)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(153,128,250,0.1)'; }}
                    >
                      <AtlasSearchIcon />
                      {search}
                    </div>
                  ))}
                  {savedSearches.length === 0 && (
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>No saved searches yet!</p>
                  )}
                </div>
              </div>

              {/* Trending Discoveries */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AtlasStarIcon />
                    Trending Discoveries
                  </h2>
                  <button onClick={() => setShowAllTrending(!showAllTrending)} style={{ background: 'transparent', border: 'none', color: 'rgba(153,128,250,0.9)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    {showAllTrending ? 'Show Less' : 'View More'}
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Trending Startups */}
                  <div>
                    <h3 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      Trending Startups
                    </h3>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {(showAllTrending ? trendingDiscoveries.startups : trendingDiscoveries.startups.slice(0, 4)).map((name, idx) => (
                        <div key={idx} style={{ background: 'rgba(255,215,0,0.1)', padding: '8px 14px', borderRadius: '10px', color: '#FFD700', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                          {name}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trending Investors */}
                  <div>
                    <h3 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      Trending Investors
                    </h3>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {(showAllTrending ? trendingDiscoveries.investors : trendingDiscoveries.investors.slice(0, 4)).map((name, idx) => (
                        <div key={idx} style={{ background: 'rgba(146,254,157,0.1)', padding: '8px 14px', borderRadius: '10px', color: '#92FE9D', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                          {name}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trending Communities */}
                  <div>
                    <h3 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      Trending Communities
                    </h3>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {(showAllTrending ? trendingDiscoveries.communities : trendingDiscoveries.communities.slice(0, 4)).map((name, idx) => (
                        <div key={idx} style={{ background: 'rgba(253,167,223,0.15)', padding: '8px 14px', borderRadius: '10px', color: '#FDA7DF', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                          {name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Popular Searches as Tags */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h2 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px' }}>
                  Popular Now
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {popularSearches.slice(0, 6).map((search, idx) => (
                    <div 
                      key={idx} onClick={() => { setSearchQuery(search); handleSearch(search); }}
                      style={{
                        padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer',
                        color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', fontWeight: 500,
                        transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '10px'
                      }}
                      onMouseOver={(e) => { 
                        e.currentTarget.style.background = 'rgba(153,128,250,0.1)';
                        e.currentTarget.style.borderColor = 'rgba(153,128,250,0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                      }}
                    >
                      <AtlasSearchIcon />
                      {search}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Best Match CTA */}
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(153,128,250,0.15) 0%, rgba(253,167,223,0.1) 100%)', 
                borderRadius: '20px', padding: '24px', border: '1px solid rgba(153,128,250,0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <AtlasSparkleIcon />
                  <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                    AI Matching
                  </h3>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.4' }}>
                  Let our AI find the perfect matches for you — investors for your startup, startups to invest in, reviewers, and more!
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => alert('Finding investors for your startup...')} style={{
                    background: 'linear-gradient(135deg, #9980FA 0%, #FDA7DF 100%)', border: 'none',
                    padding: '10px 16px', borderRadius: '12px', color: '#000', fontWeight: 700,
                    cursor: 'pointer', fontSize: '0.9rem', width: '100%'
                  }}>
                    Find Investors
                  </button>
                  <button onClick={() => alert('Finding startups for you...')} style={{
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(153,128,250,0.4)',
                    padding: '10px 16px', borderRadius: '12px', color: 'white', fontWeight: 600,
                    cursor: 'pointer', fontSize: '0.9rem', width: '100%'
                  }}>
                    Find Startups
                  </button>
                  <button onClick={() => alert('Finding communities...')} style={{
                    background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
                    padding: '10px 16px', borderRadius: '12px', color: 'rgba(255,255,255,0.85)', fontWeight: 600,
                    cursor: 'pointer', fontSize: '0.9rem', width: '100%'
                  }}>
                    Find Communities
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: 0 }}>
              One search. One engine. Entire ecosystem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtlasDashboard;
