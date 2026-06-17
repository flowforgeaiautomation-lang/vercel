
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import PrestigeStarBadge from './PrestigeStarBadge';
import { 
  getIncomingConnectionRequests, 
  getSentConnectionRequests,
  getMutualConnectionsCount,
  acceptConnectionRequest,
  declineConnectionRequest,
  ProfileData
} from '../firebase';
import './ConnectionsDashboard.css';

const getRoleColor = (role: string): string => {
  const roleUpperCase = role.toUpperCase();
  if (roleUpperCase === 'ARCHITECT') return '#FFD700';
  if (roleUpperCase === 'CATALYST') return '#00C896';
  if (roleUpperCase === 'EXPLORER') return '#06b6d4';
  return '#9CA3AF';
};

const getRoleType = (role: string | null): 'gold' | 'green' | 'cyan' | 'purple' => {
  if (!role) return 'purple';
  const roleUpperCase = role.toUpperCase();
  if (roleUpperCase === 'ARCHITECT') return 'gold';
  if (roleUpperCase === 'CATALYST') return 'green';
  if (roleUpperCase === 'EXPLORER') return 'cyan';
  return 'purple';
};

interface ConnectionRequestDisplay {
  id: string;
  fromUser: ProfileData;
  mutualConnections: number;
  time: string;
}

const formatTimeAgo = (date: any): string => {
  if (!date) return 'Recently';
  const now = new Date();
  const createdAt = date.toDate ? date.toDate() : new Date(date);
  const diffMs = now.getTime() - createdAt.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return createdAt.toLocaleDateString();
};

const ConnectionsDashboard = () => {
  const { profile, user } = useAuth();
  const { userData } = useUser();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('all');
  const [userRole, setUserRole] = useState<'ARCHITECT' | 'EXPLORER' | 'CATALYST'>('EXPLORER');
  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequestDisplay[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole');
    if (savedRole) {
      setUserRole(savedRole.toUpperCase() as any);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchConnectionRequests();
    }
  }, [user]);

  const fetchConnectionRequests = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const incoming = await getIncomingConnectionRequests(user.uid);
      const sent = await getSentConnectionRequests(user.uid);
      
      // Calculate mutual connections for incoming requests
      const incomingWithMutual = await Promise.all(
        incoming.map(async (request) => {
          const mutualCount = await getMutualConnectionsCount(user.uid, request.fromUserId);
          return {
            id: request.id,
            fromUser: request.fromUser,
            mutualConnections: mutualCount,
            time: formatTimeAgo(request.createdAt)
          };
        })
      );
      
      setIncomingRequests(incomingWithMutual);
      setSentRequests(sent);
    } catch (error) {
      console.error('Error fetching connection requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string, fromUserId: string) => {
    if (!user) return;
    try {
      await acceptConnectionRequest(requestId, fromUserId, user.uid);
      fetchConnectionRequests();
    } catch (error) {
      console.error('Error accepting connection:', error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await declineConnectionRequest(requestId);
      fetchConnectionRequests();
    } catch (error) {
      console.error('Error declining connection:', error);
    }
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
    <div className="cd-container">
      <div className="cd-left-sidebar">
        <div className="cd-logo">
          <div className="cd-logo-icon">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="logoGradCd" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#8B5CF6'}} />
                  <stop offset="100%" style={{stopColor: '#A78BFA'}} />
                </linearGradient>
              </defs>
              <polygon points="20,80 50,20 80,80" fill="url(#logoGradCd)" />
              <text x="50" y="72" textAnchor="middle" fill="#000" fontSize="28" fontWeight="800" fontFamily="Arial">T</text>
            </svg>
          </div>
          <span className="cd-logo-text">TRIARCORA</span>
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
            {incomingRequests.length > 0 && <span className="cd-badge">{incomingRequests.length}</span>}
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
                  <div className="cd-stat-number">{incomingRequests.length}</div>
                  <div className="cd-stat-label">Incoming Requests</div>
                  <div className="cd-stat-sub">New this week: {incomingRequests.length}</div>
                </div>
              </div>

              <div className="cd-stat-card">
                <div className="cd-stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div className="cd-stat-info">
                  <div className="cd-stat-number">{sentRequests.length}</div>
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
                  <div className="cd-stat-number">{profile?.connections?.length || 0}</div>
                  <div className="cd-stat-label">Total Connections</div>
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
              {loading ? (
                <div style={{padding: '2rem', textAlign: 'center', color: '#9CA3AF'}}>Loading...</div>
              ) : incomingRequests.length === 0 ? (
                <div style={{padding: '2rem', textAlign: 'center', color: '#9CA3AF'}}>No connection requests yet</div>
              ) : (
                incomingRequests.map(request => (
                  <div key={request.id} className="cd-connection-card">
                    <div className="cd-connection-avatar">
                      {request.fromUser.photoURL ? (
                        <img src={request.fromUser.photoURL} alt={request.fromUser.name} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                      ) : (
                        getInitials(request.fromUser.name)
                      )}
                    </div>
                    <div className="cd-connection-content">
                      <div className="cd-connection-header">
                        <div className="cd-connection-name">
                          <strong>{request.fromUser.name}</strong>
                          {request.fromUser.username && <span style={{fontSize: '0.85rem', color: '#9CA3AF', marginLeft: '0.5rem'}}>@{request.fromUser.username}</span>}
                          <span className={`cd-role-badge ${getRoleType(request.fromUser.role)}`}>{request.fromUser.role || 'User'}</span>
                        </div>
                        <div className="cd-connection-mutual">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                          </svg>
                          <span>{request.mutualConnections} Mutual Connections</span>
                        </div>
                      </div>
                      <p className="cd-connection-title">{request.fromUser.headline || 'No headline yet'}</p>
                      <div className="cd-connection-time">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {request.time}
                      </div>
                      <div className="cd-connection-actions">
                        <button 
                          className="cd-accept-btn" 
                          onClick={() => handleAccept(request.id, request.fromUser.uid)}
                        >
                          Accept
                        </button>
                        <button 
                          className="cd-decline-btn" 
                          onClick={() => handleDecline(request.id)}
                        >
                          Decline
                        </button>
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
                ))
              )}
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
