import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Firebase from CDN and fetch profile
    const initFirebase = async () => {
      try {
        // Load Firebase from CDN
        const firebaseScript = document.createElement('script');
        firebaseScript.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
        document.head.appendChild(firebaseScript);

        firebaseScript.onload = async () => {
          const authScript = document.createElement('script');
          authScript.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
          document.head.appendChild(authScript);

          authScript.onload = async () => {
            const firestoreScript = document.createElement('script');
            firestoreScript.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
            document.head.appendChild(firestoreScript);

            firestoreScript.onload = async () => {
              // Initialize Firebase
              const firebase = (window as any).firebase;
              const app = firebase.initializeApp({
                apiKey: "AIzaSyBkZ8P7Y3Q2rLmX9t1W5vK6nG7hJ4fQ",
                authDomain: "triveon.firebaseapp.com",
                projectId: "triveon",
                storageBucket: "triveon.appspot.com",
                messagingSenderId: "123456789",
                appId: "1:123456789:web:abcdef123456"
              });

              const auth = firebase.getAuth(app);
              const db = firebase.getFirestore(app);

              // Listen for auth state
              auth.onAuthStateChanged(async (user: any) => {
                if (user) {
                  // Fetch profile from Firestore
                  try {
                    const docRef = firebase.doc(db, "users", user.uid);
                    const docSnap = await firebase.getDoc(docRef);
                    
                    if (docSnap.exists()) {
                      setProfileData(docSnap.data());
                    } else {
                      // Create default profile if none exists
                      const defaultProfile = {
                        uid: user.uid,
                        displayName: user.displayName || 'New User',
                        email: user.email,
                        role: localStorage.getItem('selectedRole') || 'Explorer',
                        bio: 'Building amazing things.',
                        profileImage: user.photoURL || null,
                        proofScore: 0,
                        startupName: '',
                        links: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                      };
                      
                      await firebase.setDoc(docRef, defaultProfile);
                      setProfileData(defaultProfile);
                    }
                  } catch (error) {
                    console.error('Error fetching profile:', error);
                    // Fallback to localStorage
                    const fallbackProfile = {
                      displayName: localStorage.getItem('displayName') || 'User',
                      role: localStorage.getItem('selectedRole') || 'Explorer',
                      bio: localStorage.getItem('bio') || 'Building amazing things.'
                    };
                    setProfileData(fallbackProfile);
                  }
                } else {
                  // No user - redirect to role selection
                  navigate('/role-selection');
                  return;
                }
                setLoading(false);
              });
            };
          };
        };
      } catch (error) {
        console.error('Firebase initialization error:', error);
        setLoading(false);
      }
    };

    initFirebase();
  }, [navigate]);

  const handleBackToNetwork = () => {
    navigate('/home');
  };

  const handleShareProfile = () => {
    // Share profile functionality
    alert('Profile shared!');
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
      title: profileData?.startupName ? `${profileData.startupName} raises funding` : 'Building something amazing',
      description: profileData?.bio || 'Building innovative solutions',
      time: 'Just now',
      author: profileData?.displayName || 'User'
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="profile-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          color: '#FFD700',
          fontSize: '18px'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>◆</div>
          <p>Loading Profile...</p>
        </div>
      </div>
    );
  }

  // No profile data fallback
  if (!profileData) {
    return (
      <div className="profile-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          color: '#9CA3AF',
          fontSize: '18px'
        }}>
          <p>Profile not found</p>
          <button 
            onClick={() => navigate('/role-selection')}
            style={{
              marginTop: '16px',
              padding: '12px 24px',
              backgroundColor: '#FFD700',
              color: '#0A0A0F',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Go to Role Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <header className="profile-header">
        <button className="back-button" onClick={handleBackToNetwork}>
          ← Back to Network
        </button>
        <button className="share-button" onClick={handleShareProfile}>
          Share Profile
        </button>
        <div className="logo">
          <img 
              src="/images/triveon-logo.png" 
              alt="TRIVEON" 
              className="logo-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="logo-fallback hidden">◆</div>
        </div>
      </header>

      {/* Profile Summary */}
      <div className="profile-summary">
        <div className="profile-info">
          <div className="profile-image-container">
            <img 
              src={profileData?.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"} 
              alt={profileData?.displayName || 'User'} 
              className="profile-image"
            />
            <div className="verification-badge">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10C20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L8 12.17L15 6L8 15Z" fill="#FFD700"/>
              </svg>
            </div>
          </div>
          <div className="profile-details">
            <h1 className="founder-name">{profileData?.displayName || 'User'}</h1>
            <span className="founder-badge">{profileData?.role || 'Explorer'}</span>
            <p className="founder-headline">{profileData?.startupName ? `Founder & CEO @ ${profileData.startupName}` : 'Building something amazing'}</p>
            <p className="founder-description">{profileData?.bio || 'Building innovative solutions.'}</p>
            <div className="founder-meta">
              <span className="location">📍 {profileData?.location || 'Location'}</span>
              {profileData?.links?.[0] && <span className="website">🔗 {profileData.links[0]}</span>}
            </div>
          </div>
        </div>

        {/* Credibility Strip */}
        <div className="credibility-strip">
          <div className="credibility-item">
            <span className="credibility-label">Prestige Level</span>
            <span className="credibility-value">{profileData?.prestigeLevel || 'Explorer'}</span>
          </div>
          <div className="credibility-separator"></div>
          <div className="credibility-item">
            <span className="credibility-label">Expertise Score</span>
            <span className="credibility-value">{profileData?.expertiseScore || '0'}/100</span>
          </div>
          <div className="credibility-separator"></div>
          <div className="credibility-item">
            <span className="credibility-label">Trust Index</span>
            <span className="credibility-value">{profileData?.trustIndex || '0'}/5</span>
          </div>
          <div className="credibility-separator"></div>
          <div className="credibility-item">
            <span className="credibility-label">Impact Score</span>
            <span className="credibility-value">{profileData?.impactScore || '0'}/100</span>
          </div>
          <div className="credibility-separator"></div>
          <div className="credibility-item">
            <span className="credibility-label">Consistency</span>
            <span className="credibility-value">{profileData?.consistencyRank || 'A+'}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="profile-content-grid">
        {/* Left Column - Feed */}
        <div className="profile-feed">
          <h3 className="section-title">Activity Feed</h3>
          <div className="feed-list">
            {feedItems.map((item) => (
              <div key={item.id} className="feed-item">
                <div className="feed-item-header">
                  <div className="feed-item-meta">
                    <span className="feed-type">{item.type}</span>
                    <span className="feed-time">{item.time}</span>
                  </div>
                </div>
                <h4 className="feed-title">{item.title}</h4>
                <p className="feed-description">{item.description}</p>
                <div className="feed-author">by {item.author}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="profile-sidebar">
          <div className="trending-section">
            <h3>Trending Startups</h3>
            <div className="trending-list">
              {trendingStartups.map((startup, index) => (
                <div key={index} className="trending-item">
                  <h4>{startup.name}</h4>
                  <p>{startup.description}</p>
                  <span className={`trending-change ${startup.change.startsWith('+') ? 'positive' : 'negative'}`}>
                    {startup.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button className="action-btn primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5V19M5 12H19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              New Post
            </button>
            <button className="action-btn secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15V19A2 2 0 0 1 19 17H5A2 2 0 0 1 3 15V19A2 2 0 0 1 5 21H19A2 2 0 0 1 21 15Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Share Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;