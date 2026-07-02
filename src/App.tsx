import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import TriarcoraLogin from './components/TriarcoraLogin';
import RoleSelection from './components/RoleSelection';
import HomeDashboard from './components/HomeDashboard';
import ProfilePremium from './components/ProfilePremium';
import StartupDashboard from './components/StartupDashboard';
import MyStartup from './components/MyStartup';
import StartupStudio from './components/StartupStudio';
import InvestorDashboard from './components/InvestorDashboard';
import MyInvestments from './components/MyInvestments';
import CatalystStudio from './components/CatalystStudio';
import ExplorerDashboard from './components/ExplorerDashboard';
import MyReviews from './components/MyReviews';
import FeedbackHub from './components/FeedbackHub';
import SignalsDashboard from './components/SignalsDashboard';
import BookmarksDashboard from './components/BookmarksDashboard';
import MessagesDashboard from './components/MessagesDashboard';
import TriarcoraSettings from './components/TriarcoraSettings';
import AtlasDashboard from './components/AtlasDashboard';
import InsightsDashboard from './components/InsightsDashboard';
import AICopilot from './components/AICopilot';
import AICopilotPage from './components/AICopilotPage';
import VerificationCenter from './components/VerificationCenter';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { PostProvider } from './contexts/PostContext';
import { AIProvider, useAI } from './contexts/AIContext';
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  const hasStoredUser = !!localStorage.getItem('triveon-lastUserId');

  // Show nothing while Firebase auth is resolving (prevents flash/redirect)
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#000814', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid rgba(255,215,0,0.3)', borderTopColor: '#FFD700', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!user && !hasStoredUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function AppWithUniverse({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <div className="app-content">
        {children}
      </div>
    </div>
  );
}

// Welcome Modal
function WelcomeModal() {
  const { userData, updateUserData } = useUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenLocal = localStorage.getItem('triveon_hasSeenWelcome') === 'true';
    if (userData && !userData.hasSeenWelcomeModal && !hasSeenLocal) {
      setIsOpen(true);
    }
  }, [userData]);

  const markWelcomeSeen = () => {
    updateUserData({ hasSeenWelcomeModal: true });
    localStorage.setItem('triveon_hasSeenWelcome', 'true');
  };

  const handleCompleteProfile = () => {
    markWelcomeSeen();
    setIsOpen(false);
    navigate('/profile');
  };

  const handleGoToHome = () => {
    markWelcomeSeen();
    setIsOpen(false);
    navigate('/home');
  };

  if (!isOpen) return null;

  return (
    <div
      className="premium-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}
    >
      <div
        className="premium-modal"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '480px',
          width: '90%',
          textAlign: 'center',
          border: '1px solid rgba(255,215,0,0.3)',
          boxShadow: '0 8px 32px rgba(255,215,0,0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: '#FFD700', marginBottom: '16px', fontSize: '28px' }}>
          Welcome to TRIARCORA
        </h2>
        <p style={{ color: '#ccc', marginBottom: '32px', fontSize: '16px', lineHeight: '1.5' }}>
          Hello {userData?.profile?.name}👋<br />
          <br />
          Your account has been created successfully.<br />
          <br />
          You can now discover startups, investors, explorers, opportunities, insights, and connections across the ecosystem.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            onClick={handleCompleteProfile}
          >
            Complete Profile
          </button>
          <button
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={handleGoToHome}
          >
            Go To Home
          </button>
        </div>
      </div>
    </div>
  );
}

// Profile Modal
function ProfileModal() {
  const { userData, updateUserData } = useUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenLocal = localStorage.getItem('triveon_hasSeenProfile') === 'true';
    if (userData && !userData.hasSeenProfileModal && !hasSeenLocal) {
      setIsOpen(true);
    }
  }, [userData]);

  const markProfileSeen = () => {
    updateUserData({ hasSeenProfileModal: true });
    localStorage.setItem('triveon_hasSeenProfile', 'true');
  };

  const handleGotIt = () => {
    markProfileSeen();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="premium-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}
    >
      <div
        className="premium-modal"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '480px',
          width: '90%',
          textAlign: 'center',
          border: '1px solid rgba(255,215,0,0.3)',
          boxShadow: '0 8px 32px rgba(255,215,0,0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: '#FFD700', marginBottom: '16px', fontSize: '28px' }}>
          Complete Your Profile
        </h2>
        <p style={{ color: '#ccc', marginBottom: '32px', fontSize: '16px', lineHeight: '1.5' }}>
          Hey {userData?.profile?.name}👋<br />
          <br />
          Let's set up your profile to get the most out of TRIARCORA.<br />
          Add a profile photo, bio, and other details to help others connect with you.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            onClick={() => {
              markProfileSeen();
              setIsOpen(false);
              navigate('/profile');
            }}
          >
            Go to Profile
          </button>
          <button
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={handleGotIt}
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}

// Global AI button component
function GlobalAICopilot() {
  const { isOpen, setIsOpen } = useAI();
  const location = useLocation();
  
  // Don't show on login pages
  const isAuthPage = location.pathname === '/' || location.pathname.includes('login') || location.pathname.includes('role-selection');
  
  if (isAuthPage) return null;

  return (
    <>
      {/* Floating AI Button - Now handled in AICopilot component! */}
      <AICopilot />
    </>
  );
}

function InitialRouteHandler() {
  const { user, loading } = useAuth();
  const { userData } = useUser();
  const navigate = useNavigate();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;

    if (user) {
      // Get user's main role
      const userRole = (userData?.mainRole || 'ARCHITECT').toUpperCase();
      
      // Navigate to role-specific page
      switch (userRole) {
        case 'ARCHITECT':
          navigate('/startups', { replace: true });
          break;
        case 'CATALYST':
          navigate('/investors', { replace: true });
          break;
        case 'EXPLORER':
          navigate('/explorers', { replace: true });
          break;
        default:
          navigate('/home', { replace: true });
      }
    } else {
      // No user, stay on login
      setHasChecked(true);
    }
  }, [user, loading, userData, navigate]);

  if (loading) return null;

  return <TriarcoraLogin />;
}

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <PostProvider>
          <Router>
            <AIProvider>
              <AppWithUniverse>
                <Routes>
                <Route path="/" element={<InitialRouteHandler />} />
                <Route path="/role-selection" element={<ProtectedRoute><RoleSelection /></ProtectedRoute>} />
                <Route path="/home" element={<ProtectedRoute><HomeDashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePremium /></ProtectedRoute>} />
                <Route path="/profile/:uid" element={<ProtectedRoute><ProfilePremium /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><TriarcoraSettings /></ProtectedRoute>} />
                  <Route path="/startups" element={<ProtectedRoute><StartupDashboard /></ProtectedRoute>} />
                  <Route path="/atlas" element={<ProtectedRoute><AtlasDashboard /></ProtectedRoute>} />
                  <Route path="/insights" element={<ProtectedRoute><InsightsDashboard /></ProtectedRoute>} />
                  <Route path="/startup-studio" element={<ProtectedRoute><StartupStudio /></ProtectedRoute>} />
                  <Route path="/my-startup" element={<ProtectedRoute><MyStartup /></ProtectedRoute>} />
                  <Route path="/investors" element={<ProtectedRoute><InvestorDashboard /></ProtectedRoute>} />
                  <Route path="/my-investments" element={<ProtectedRoute><MyInvestments /></ProtectedRoute>} />
                  <Route path="/catalyst-studio" element={<ProtectedRoute><CatalystStudio /></ProtectedRoute>} />
                  <Route path="/explorers" element={<ProtectedRoute><ExplorerDashboard /></ProtectedRoute>} />
                  <Route path="/my-reviews" element={<ProtectedRoute><MyReviews /></ProtectedRoute>} />
                  <Route path="/feedback-hub" element={<ProtectedRoute><FeedbackHub /></ProtectedRoute>} />
                  <Route path="/signals" element={<ProtectedRoute><SignalsDashboard /></ProtectedRoute>} />
                  <Route path="/bookmarks" element={<ProtectedRoute><BookmarksDashboard /></ProtectedRoute>} />
                  <Route path="/messages" element={<ProtectedRoute><MessagesDashboard /></ProtectedRoute>} />
                  <Route path="/ai-copilot" element={<ProtectedRoute><AICopilotPage /></ProtectedRoute>} />
                  <Route path="/verification" element={<ProtectedRoute><VerificationCenter /></ProtectedRoute>} />
                </Routes>
                <WelcomeModal />
                <ProfileModal />
                <GlobalAICopilot />
              </AppWithUniverse>
            </AIProvider>
          </Router>
        </PostProvider>
      </UserProvider>
    </AuthProvider>
  );
}

// TRIARCORA - The Operating System of Ambition
export default App;
