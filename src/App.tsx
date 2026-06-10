import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginNew from './components/LoginNew';
import TriveonLogin from './components/TriveonLogin';
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
import TriveonSettings from './components/TriveonSettings';
import AICopilot from './components/AICopilot';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { PostProvider } from './contexts/PostContext';
import './App.css';

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
            <Route path="/" element={<TriveonLogin />} />
            <Route path="/home" element={<HomeDashboard />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/profile" element={<ProfilePremium />} />
            <Route path="/settings" element={<TriveonSettings />} />
            <Route path="/startups" element={<StartupDashboard />} />
            <Route path="/startup-studio" element={<StartupStudio />} />
            <Route path="/my-startup" element={<MyStartup />} />
            <Route path="/investors" element={<InvestorDashboard />} />
            <Route path="/my-investments" element={<MyInvestments />} />
            <Route path="/catalyst-studio" element={<CatalystStudio />} />
            <Route path="/explorers" element={<ExplorerDashboard />} />
            <Route path="/my-reviews" element={<MyReviews />} />
            <Route path="/feedback-hub" element={<FeedbackHub />} />
            <Route path="/notifications" element={<NotificationsDashboard />} />
            <Route path="/bookmarks" element={<BookmarksDashboard />} />
            <Route path="/messages" element={<MessagesDashboard />} />
          </Routes>
              <GlobalAICopilot />
            </AppWithUniverse>
          </Router>
        </PostProvider>
      </UserProvider>
    </AuthProvider>
  );
}

// TRIVEON - The Operating System of Ambition
export default App;
