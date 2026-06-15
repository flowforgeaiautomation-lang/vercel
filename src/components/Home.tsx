import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const [selectedRole, setSelectedRole] = useState<string>('');

  useEffect(() => {
    const role = localStorage.getItem('selectedRole');
    if (!role) {
      navigate('/role-selection');
      return;
    }
    setSelectedRole(role);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('selectedRole');
    navigate('/');
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

  const menuItems = [
    { icon: '🏠', label: 'Home', active: true },
    { icon: '🔍', label: 'Discover', active: false },
    { icon: '💬', label: 'Inbox', active: false },
    { icon: '📊', label: 'Analytics', active: false },
    { icon: '⚙️', label: 'Settings', active: false },
    { icon: '🔖', label: 'Vault', active: false, path: '/bookmarks' },
    { icon: '👤', label: 'Profile', active: false, path: '/profile' }
  ];

  return (
    <div className="home-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <img 
              src="/images/triarcora-png.png" 
              alt="Triarcora" 
              className="logo-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="logo-fallback hidden">◆</div>
          </div>
          <span className="logo-text">Triarcora</span>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <button 
              key={index} 
              className={`nav-item ${item.active ? 'active' : ''}`}
              onClick={() => item.path && navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <span>{(userData?.profile?.name || selectedRole).charAt(0).toUpperCase()}</span>
            </div>
            <div className="user-details">
              <span className="user-name">{userData?.profile?.name || 'User'}</span>
              <span className="user-role">{selectedRole.toUpperCase()}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="content-header">
          <h1>Welcome back, {userData?.profile?.name || selectedRole}!</h1>
          <p>Here's what's happening in the Triarcora ecosystem</p>
        </header>

        <div className="content-grid">
          {/* Feed */}
          <div className="feed-section">
            <div className="section-header">
              <h2>Your Feed</h2>
              <button className="filter-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="feed-list">
              {feedItems.map((item) => (
                <div key={item.id} className="feed-item">
                  <div className="feed-item-header">
                    <div className="feed-item-meta">
                      <span className="feed-type">{item.type}</span>
                      <span className="feed-time">{item.time}</span>
                    </div>
                    <button className="feed-menu">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="12" cy="5" r="1"/>
                        <circle cx="12" cy="19" r="1"/>
                      </svg>
                    </button>
                  </div>
                  <h3 className="feed-title">{item.title}</h3>
                  <p className="feed-description">{item.description}</p>
                  <div className="feed-author">by {item.author}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="right-sidebar">
            <div className="trending-section">
              <h3>Trending Startups</h3>
              <div className="trending-list">
                {trendingStartups.map((startup, index) => (
                  <div key={index} className="trending-item">
                    <div className="trending-info">
                      <h4>{startup.name}</h4>
                      <p>{startup.description}</p>
                    </div>
                    <div className={`trending-change ${startup.change.startsWith('+') ? 'positive' : 'negative'}`}>
                      {startup.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button className="action-btn primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 5V19M5 12H19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  New Post
                </button>
                <button className="action-btn secondary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15M17 8L12 3L7 8M12 3V15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Share Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
