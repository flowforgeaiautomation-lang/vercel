
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import PrestigeStarBadge from './PrestigeStarBadge';
import './ConnectionsDashboard.css';

const getRoleColor = (role: string): string => {
  const roleUpperCase = role.toUpperCase();
  if (roleUpperCase === 'ARCHITECT') return '#FFD700';
  if (roleUpperCase === 'CATALYST') return '#00C896';
  if (roleUpperCase === 'EXPLORER') return '#06b6d4';
  return '#9CA3AF';
};

interface ConnectionRequest {
  id: string;
  avatar?: string;
  name: string;
  role: string;
  roleType: 'gold' | 'green' | 'cyan' | 'purple';
  title: string;
  mutualConnections: number;
  time: string;
}

const ConnectionsDashboard = () => {
  const { profile } = useAuth();
  const { userData } = useUser();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('all');
  const [userRole, setUserRole] = useState<'ARCHITECT' | 'EXPLORER' | 'CATALYST'>('EXPLORER');

  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole');
    if (savedRole) {
      setUserRole(savedRole.toUpperCase() as any);
    }
  }, []);

  const getUserName = () => {
    return userData?.profile?.name || profile?.name || 'User';
  };

  const getUserRole = () => {
    return userData?.mainRole || profile?.role || 'Explorer';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const connectionRequests: ConnectionRequest[] = [
    {
      id: '1',
      avatar: undefined,
      name: 'Riya Sharma',
      role: 'Architect',
      roleType: 'gold',
      title: 'Founder @ Vega AI',
      mutualConnections: 18,
      time: '2 hours ago'
    },
    {
      id: '2',
      avatar: undefined,
      name: 'Karan Malhotra',
      role: 'Catalyst',
      roleType: 'green',
      title: 'Partner @ Elevation Capital',
      mutualConnections: 24,
      time: '4 hours ago'
    },
    {
      id: '3',
      avatar: undefined,
      name: 'Ananya Iyer',
      role: 'Explorer',
      roleType: 'cyan',
      title: 'Product Reviewer',
      mutualConnections: 6,
      time: '1 day ago'
    },
    {
      id: '4',
      avatar: undefined,
      name: 'Vikram Singh',
      role: 'Architect',
      roleType: 'gold',
      title: 'Co-founder @ QuickOps',
      mutualConnections: 11,
      time: '2 days ago'
    }
  ];

  return (
    <div className="cd-container">
      <div className="cd-left-sidebar">
        <div className="cd-logo">
          <div className="cd-logo-icon">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="logoGradCd" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#8B5CF6'}} />
                  <stop offset="100%" style={{stopColor:'#A78BFA'}} />
                </linearGradient>
              </defs>
              <polygon points="20,80 50,20 80,80" fill="url(#logoGradCd)" />
              <text x="50" y="72" textAnchor="middle" fill="#000" fontSize="28" fontWeight="800" fontFamily="Arial">T</text>
            </svg>
          </div>
          <span className="cd-logo-text">TRIVEON</span>
        </div>

        <div className="cd-messaging-header">
          <span className="cd-messaging-title">Connect</span>
        </div>

        <nav className="cd-nav">
          <div className="cd-nav-item" onClick={() => navigate('/home')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span>Home</span>
          </div>
          <div className="cd-nav-item" onClick={() => navigate('/messages')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Messages</span>
          </div>
          <div className="cd-nav-item" onClick={() => navigate('/notifications')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span>Notifications</span>
          </div>
          <div className="cd-nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Connections</span>
            <span className="cd-badge">12</span>
          </div>
        </nav>
      </div>

      <div className="cd-main">
        <div className="cd-content">
          <div className="cd-main-col">
            <div className="cd-page-header">
              <h1 className="cd-page-title">Connection Requests</h1>
              <p className="cd-page-subtitle">Build meaningful relationships across the ecosystem.</p>
            </div>

            <div className="cd-stats">
              <div className="cd-stat-card">
                <div className="cd-stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="cd-stat-info">
                  <div className="cd-stat-number">12</div>
                  <div className="cd-stat-label">Incoming Requests</div>
                  <div className="cd-stat-sub">New this week: 5</div>
                </div>
              </div>

              <div className="cd-stat-card">
                <div className="cd-stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div className="cd-stat-info">
                  <div className="cd-stat-number">4</div>
                  <div className="cd-stat-label">Sent Requests</div>
                  <div className="cd-stat-sub">Pending responses</div>
                </div>
              </div>

              <div className="cd-stat-card">
                <div className="cd-stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="cd-stat-info">
                  <div className="cd-stat-number">8</div>
                  <div className="cd-stat-label">Accepted This Week</div>
                  <div className="cd-stat-sub">Great going! 🎉</div>
                </div>
              </div>
            </div>

            <div className="cd-tabs">
              {['All', 'Architects', 'Catalysts', 'Explorers', 'Mutual Connections', 'Recently Received'].map(tab => (
                <div 
                  key={tab} 
                  className={`cd-tab ${activeTab === 'all' && tab === 'All' ? 'active' : ''}`} 
                  onClick={() => setActiveTab(tab.toLowerCase())}
                >
                  {tab}
                </div>
              ))}
              <button className="cd-filter-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46V19 14 21 14 12.46L22 3" />
                </svg>
              </button>
            </div>

            <div className="cd-connections-list">
              {connectionRequests.map(request => (
                <div key={request.id} className="cd-connection-card">
                  <div className="cd-connection-avatar">
                    {request.avatar ? (
                      <img src={request.avatar} alt={request.name} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                    ) : (
                      getInitials(request.name)
                    )}
                  </div>
                  <div className="cd-connection-content">
                    <div className="cd-connection-header">
                      <div className="cd-connection-name">
                        <strong>{request.name}</strong>
                        <span className={`cd-role-badge ${request.roleType}`}>{request.role}</span>
                      </div>
                      <div className="cd-connection-mutual">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                        </svg>
                        <span>{request.mutualConnections} Mutual Connections</span>
                      </div>
                    </div>
                    <p className="cd-connection-title">{request.title}</p>
                    <div className="cd-connection-time">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {request.time}
                    </div>
                    <div className="cd-connection-actions">
                      <button className="cd-accept-btn">Accept</button>
                      <button className="cd-decline-btn">Decline</button>
                    </div>
                  </div>
                  <div className="cd-connection-extra">
                    <button className="cd-extra-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button className="cd-extra-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cd-load-more">
              <span>Load more requests</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionsDashboard;
