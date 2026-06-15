import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import LoginNew from './components/LoginNew';
import TriarcoraLogin from './components/TriarcoraLogin';
import RoleSelectionNew from './components/RoleSelectionNew';
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
import NotificationsDashboard from './components/NotificationsDashboard';
import BookmarksDashboard from './components/BookmarksDashboard';
import MessagesDashboard from './components/MessagesDashboard';
import TriarcoraSettings from './components/TriarcoraSettings';
import AtlasDashboard from './components/AtlasDashboard';
import InsightsDashboard from './components/InsightsDashboard';
import AICopilot from './components/AICopilot';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { PostProvider } from './contexts/PostContext';
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isDemoMode, profile } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#000' }}>Loading...</div>;
  }

  if (!user && !isDemoMode) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (isDemoMode && !profile) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function AppWithUniverse({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create stars
    const stars: Array<{x: number; y: number; size: number; brightness: number}> = [];
    const numStars = 3000;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        brightness: Math.random()
      });
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = '#000814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Twinkle effect
        star.brightness += (Math.random() - 0.5) * 0.1;
        star.brightness = Math.max(0.1, Math.min(1, star.brightness));
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="app">
      <canvas ref={canvasRef} className="universe-canvas" />
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
    if (userData && !userData.hasSeenWelcomeModal) {
      setIsOpen(true);
    }
  }, [userData]);

  const handleCompleteProfile = () => {
    updateUserData({ hasSeenWelcomeModal: true });
    setIsOpen(false);
    navigate('/profile');
  };

  const handleGoToHome = () => {
    updateUserData({ hasSeenWelcomeModal: true });
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
          Hello {userData?.profile?.name || 'User'} 👋<br />
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

// Global AI button component
function GlobalAICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Don't show on login pages
  const isAuthPage = location.pathname === '/' || location.pathname.includes('login') || location.pathname.includes('role-selection');
  
  if (isAuthPage) return null;

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          border: 'none',
          boxShadow: '0 6px 20px rgba(255, 165, 0, 0.4)',
          cursor: 'pointer',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s, box-shadow 0.3s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 165, 0, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 165, 0, 0.4)';
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" />
        </svg>
      </button>
      
      {/* AI Copilot Panel */}
      {isOpen && <AICopilot isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <PostProvider>
          <Router>
            <AppWithUniverse>
              <Routes>
              <Route path="/" element={<TriarcoraLogin />} />
              <Route path="/role-selection" element={<ProtectedRoute><RoleSelection /></ProtectedRoute>} />
              <Route path="/home" element={<ProtectedRoute><HomeDashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePremium /></ProtectedRoute>} />
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
                <Route path="/notifications" element={<ProtectedRoute><NotificationsDashboard /></ProtectedRoute>} />
                <Route path="/bookmarks" element={<ProtectedRoute><BookmarksDashboard /></ProtectedRoute>} />
                <Route path="/messages" element={<ProtectedRoute><MessagesDashboard /></ProtectedRoute>} />
              </Routes>
              <WelcomeModal />
              <GlobalAICopilot />
            </AppWithUniverse>
          </Router>
        </PostProvider>
      </UserProvider>
    </AuthProvider>
  );
}

// TRIARCORA - The Operating System of Ambition
export default App;
