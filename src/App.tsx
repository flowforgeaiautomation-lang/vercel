import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginNew from './components/LoginNew';
import TriveonLogin from './components/TriveonLogin';
import RoleSelectionNew from './components/RoleSelectionNew';
import RoleSelection from './components/RoleSelection';
import HomeDashboard from './components/HomeDashboard';
import ProfilePremium from './components/ProfilePremium';
import { UserProvider } from './contexts/UserContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <AppRoutes />
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user, profile, loading } = useAuth();
  const isDemoMode = localStorage.getItem('currentUserId') === 'demo-user' || localStorage.getItem('selectedRole');
  const hasDemoUserId = localStorage.getItem('currentUserId') === 'demo-user';
  const hasSelectedRole = localStorage.getItem('selectedRole') !== null;

  if (loading && !isDemoMode) {
    return (
      <div className="auth-loader-container">
        <div className="auth-loader-content">
          <div className="auth-loader-spinner"></div>
          <h1 className="auth-loader-title">TRIVEON</h1>
          <p className="auth-loader-text">Initializing ecosystem...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<TriveonLogin />} />
      <Route path="/role-selection" element={<RoleSelection />} />
      <Route path="/home" element={<HomeDashboard />} />
      <Route path="/profile" element={<ProfilePremium />} />
    </Routes>
  );
}

// TRIVEON - The Operating System of Ambition
export default App;
