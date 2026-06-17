import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { usePosts } from '../contexts/PostContext';

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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12,6 12,12 16,14"></polyline>
  </svg>
);

const AtlasDashboard = () => {
  const { profile } = useAuth();
  const { userData } = useUser();
  const { posts, startups, demoUsers } = usePosts();
  const navigate = useNavigate();
  
  const [activeSearchTab, setActiveSearchTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle ⌘ K or Ctrl K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          setIsInputFocused(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const searchTabs = ['All', 'Posts', 'Startups', 'People', 'Investments', 'Reviews', 'Partnerships', 'Knowledge', 'Communities'];
  const popularSearches = [
    'AI startups', 'Seed investors', 'Funding announcement', 'Product launches',
    'Fintech founders', 'Startup hiring', 'SaaS acquisition', 'Market research'
  ];
  
  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('triarcora-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);
  
  // Save search to recent searches
  const addToRecentSearches = (query: string) => {
    if (!query.trim()) return;
    
    const filtered = recentSearches.filter(s => s.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...filtered].slice(0, 10); // Keep only last 10 searches
    setRecentSearches(updated);
    localStorage.setItem('triarcora-recent-searches', JSON.stringify(updated));
  };
  
  // Filter recent searches based on current query
  const filteredRecentSearches = recentSearches.filter(search =>
    search.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter popular searches based on current query
  const filteredPopularSearches = popularSearches.filter(search =>
    search.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle search submission
  const handleSearch = (query: string) => {
    if (query.trim()) {
      addToRecentSearches(query);
      setIsInputFocused(false);
    }
  };
  
  // Helper to get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle key presses in input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };
  
  // Filter search results
  const getSearchResults = () => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return { posts: [], startups: [], users: [] };

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

    // Filter by active tab
    if (activeSearchTab === 'Posts') return { posts: matchedPosts, startups: [], users: [] };
    if (activeSearchTab === 'Startups') return { posts: [], startups: matchedStartups, users: [] };
    if (activeSearchTab === 'People') return { posts: [], startups: [], users: matchedUsers };
    // Default: All
    return { posts: matchedPosts, startups: matchedStartups, users: matchedUsers };
  };

  const searchResults = getSearchResults();

  // Show either recent/popular searches OR search results
  const showSuggestions = isInputFocused && searchQuery.trim() === '';
  const showSearchResults = isInputFocused && searchQuery.trim() !== '';
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 100,
      display: 'flex'
    }}>
      {/* Left Sidebar */}
      <div className="sd-left-sidebar" style={{ flexShrink: 0 }}>
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
          <span className="sd-logo-text">TRIARCORA</span>
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
      <div className="sd-main" style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(120, 119, 198, 0.15) 0%, rgba(10, 10, 26, 1) 25%)' 
      }}>
        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/home')}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px'
            }}>
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
                <polygon points="20,80 50,20 80,80" fill="#000" />
                <text x="50" y="72" textAnchor="middle" fill="white" fontSize="24" fontWeight="800" fontFamily="Arial">T</text>
              </svg>
            </div>
            <span style={{
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 800,
              letterSpacing: '1px'
            }}>TRIARCORA</span>
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
              fontSize: '0.9rem',
              fontWeight: 500
            }}>
              <AtlasBookmarkIcon />
              <span>Saved Searches</span>
            </button>
          </div>
        </header>

        {/* Main Content - Flex Grow */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isInputFocused ? 'flex-start' : 'center',
          overflow: 'hidden',
          padding: isInputFocused ? '40px 0' : '20px 0'
        }}>
          {/* Hero Title - Only show when not focused */}
          {!isInputFocused && (
            <div style={{ textAlign: 'center', marginBottom: '16px', padding: '0 24px' }}>
              <h1 style={{
                fontSize: '3.5rem',
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
                fontSize: '1rem',
                margin: '10px 0 0',
                fontWeight: 500
              }}>Find anything across TRIARCORA.</p>
            </div>
          )}

          {/* Search Bar with Dropdown */}
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: isInputFocused ? '2px solid rgba(153, 128, 250, 0.7)' : '2px solid rgba(153, 128, 250, 0.3)',
              borderRadius: '20px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: isInputFocused ? '0 0 40px rgba(153, 128, 250, 0.2)' : '0 0 40px rgba(153, 128, 250, 0.1)'
            }}>
              <div style={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0 }}>
                <AtlasSearchIcon />
              </div>
              <input 
                ref={inputRef}
                type="text"
                placeholder="Search startups, people, posts, investments, opportunities…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                onKeyDown={handleKeyDown}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: 400
                }}
              />
              <div style={{
                borderLeft: '1px solid rgba(255,255,255,0.1)',
                paddingLeft: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}>
                <AtlasFiltersIcon />
                <span style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>⌘ K</span>
              </div>
            </div>
            
            {/* Dropdown Suggestions/Results */}
            {isInputFocused && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '24px',
                right: '24px',
                background: 'rgba(20, 20, 40, 0.98)',
                border: '1px solid rgba(153, 128, 250, 0.3)',
                borderRadius: '16px',
                marginTop: '8px',
                padding: '12px 0',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                maxHeight: '500px',
                overflowY: 'auto',
                zIndex: 1000
              }}>
                {showSuggestions && (
                  <>
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <>
                        <div style={{
                          padding: '8px 20px',
                          color: 'rgba(255,255,255,0.55)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.4px'
                        }}>
                          Recent Searches
                        </div>
                        {recentSearches.map((search, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setSearchQuery(search);
                              handleSearch(search);
                            }}
                            style={{
                              padding: '10px 20px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              color: 'rgba(255,255,255,0.85)',
                              cursor: 'pointer',
                              transition: 'background 0.15s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = 'rgba(153, 128, 250, 0.1)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <AtlasHistoryIcon />
                            <span style={{ fontSize: '0.9rem' }}>{search}</span>
                          </div>
                        ))}
                        {popularSearches.length > 0 && <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />}
                      </>
                    )}
                    
                    {/* Popular Searches */}
                    <div style={{
                      padding: '8px 20px',
                      color: 'rgba(255,255,255,0.55)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px'
                    }}>
                      Popular Searches
                    </div>
                    {popularSearches.map((search, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          setSearchQuery(search);
                          handleSearch(search);
                        }}
                        style={{
                          padding: '10px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          color: 'rgba(255,255,255,0.85)',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(153, 128, 250, 0.1)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <AtlasSearchIcon />
                        <span style={{ fontSize: '0.9rem' }}>{search}</span>
                      </div>
                    ))}
                  </>
                )}
                
                {showSearchResults && (
                  <>
                    {/* Users */}
                    {searchResults.users.length > 0 && (
                      <>
                        <div style={{
                          padding: '8px 20px',
                          color: 'rgba(255,255,255,0.55)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.4px'
                        }}>
                          People
                        </div>
                        {searchResults.users.map(user => (
                          <div 
                            key={user.userId}
                            onClick={() => {
                              handleSearch(searchQuery);
                              navigate('/profile');
                            }}
                            style={{
                              padding: '10px 20px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              color: 'rgba(255,255,255,0.85)',
                              cursor: 'pointer',
                              transition: 'background 0.15s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = 'rgba(153, 128, 250, 0.1)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #9980FA 0%, #FDA7DF 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.9rem'
                            }}>
                              {getInitials(user.userName)}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.userName}</div>
                              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{user.userTitle}</div>
                            </div>
                          </div>
                        ))}
                        {searchResults.startups.length > 0 || searchResults.posts.length > 0 ? <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '8px 0' }} /> : null}
                      </>
                    )}

                    {/* Startups */}
                    {searchResults.startups.length > 0 && (
                      <>
                        <div style={{
                          padding: '8px 20px',
                          color: 'rgba(255,255,255,0.55)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.4px'
                        }}>
                          Startups
                        </div>
                        {searchResults.startups.map(startup => (
                          <div 
                            key={startup.id}
                            onClick={() => {
                              handleSearch(searchQuery);
                              navigate('/my-startup');
                            }}
                            style={{
                              padding: '10px 20px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              color: 'rgba(255,255,255,0.85)',
                              cursor: 'pointer',
                              transition: 'background 0.15s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = 'rgba(153, 128, 250, 0.1)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#000',
                              fontWeight: 600,
                              fontSize: '0.9rem'
                            }}>
                              {getInitials(startup.name)}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{startup.name}</div>
                              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{startup.tagline}</div>
                            </div>
                          </div>
                        ))}
                        {searchResults.posts.length > 0 ? <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '8px 0' }} /> : null}
                      </>
                    )}

                    {/* Posts */}
                    {searchResults.posts.length > 0 && (
                      <>
                        <div style={{
                          padding: '8px 20px',
                          color: 'rgba(255,255,255,0.55)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.4px'
                        }}>
                          Posts
                        </div>
                        {searchResults.posts.map(post => (
                          <div 
                            key={post.id}
                            onClick={() => {
                              handleSearch(searchQuery);
                            }}
                            style={{
                              padding: '10px 20px',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px',
                              color: 'rgba(255,255,255,0.85)',
                              cursor: 'pointer',
                              transition: 'background 0.15s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = 'rgba(153, 128, 250, 0.1)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#000',
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              flexShrink: 0
                            }}>
                              {getInitials(post.userName)}
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{post.userName}</div>
                              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {post.intent}
                              </div>
                              <div style={{ marginTop: '6px', display: 'flex', gap: '6px' }}>
                                {post.tags.slice(0, 3).map(tag => (
                                  <span key={tag} style={{
                                    fontSize: '0.7rem',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    background: 'rgba(153, 128, 250, 0.15)',
                                    color: '#9980FA'
                                  }}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {/* No results */}
                    {searchResults.users.length === 0 && searchResults.startups.length === 0 && searchResults.posts.length === 0 && (
                      <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Search Tabs */}
          <div style={{ 
            maxWidth: '900px', 
            margin: '0 auto', 
            padding: '0 24px', 
            display: 'flex', 
            gap: '6px', 
            borderBottom: isInputFocused ? 'none' : '1px solid rgba(255,255,255,0.05)',
            paddingBottom: isInputFocused ? 0 : '10px',
            marginTop: isInputFocused ? '20px' : 0,
            marginBottom: isInputFocused ? 0 : '12px',
            flexShrink: 0
          }}>
            {searchTabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveSearchTab(tab)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  color: activeSearchTab === tab ? '#9980FA' : 'rgba(255,255,255,0.6)',
                  fontSize: '0.8rem',
                  fontWeight: activeSearchTab === tab ? 700 : 500,
                  cursor: 'pointer',
                  borderBottom: activeSearchTab === tab && !isInputFocused ? '2px solid #9980FA' : '2px solid transparent',
                  borderRadiusBottom: isInputFocused ? '12px' : 0
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Popular Searches - Only show when not focused */}
          {!isInputFocused && (
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', flexShrink: 0 }}>
              <h3 style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '10px', letterSpacing: '0.4px' }}>
                Popular Searches
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {popularSearches.map((search, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setSearchQuery(search);
                      handleSearch(search);
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '12px',
                      padding: '8px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.8rem',
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
          )}

          {/* Bottom Icon - Only show when not focused */}
          {!isInputFocused && (
            <div style={{ textAlign: 'center', marginTop: '24px', flexShrink: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '2px solid rgba(153,128,250,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9980FA" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"></polygon>
                </svg>
              </div>
              <p style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.75rem',
                fontWeight: 400,
                margin: 0
              }}>One search. Everything in TRIARCORA.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AtlasDashboard;
