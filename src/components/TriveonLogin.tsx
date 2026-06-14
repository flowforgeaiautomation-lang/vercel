import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './TriveonLogin.css';

const TriveonLogin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState(localStorage.getItem('triveon-email') || '');
  const [password, setPassword] = useState(localStorage.getItem('triveon-password') || '');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const { login, signup, googleLogin, quickResetPassword, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && profile) {
      navigate('/role-selection');
    }
  }, [profile, loading, navigate]);

  const handleDemoClick = () => {
    localStorage.removeItem('selectedRole');
    localStorage.setItem('currentUserId', 'demo-user');
    navigate('/role-selection');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (forgotPasswordOpen && !forgotSuccess && e.key === 'Enter') {
        handleForgotPassword(e as any);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [forgotPasswordOpen, forgotSuccess, forgotEmail, forgotNewPassword, forgotConfirmPassword]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 2;

    const stars: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      twinklePhase: number;
      twinkleSpeed: number;
      isGold: boolean;
      isBright: boolean;
    }> = [];

    const createStars = () => {
      const numStars = 3000;
      for (let i = 0; i < numStars; i++) {
        const isBright = Math.random() > 0.94;
        const isGold = Math.random() > 0.90;
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: isBright ? Math.random() * 1.2 + 0.5 : Math.random() * 0.5 + 0.15,
          speedX: (Math.random() - 0.5) * 0.025,
          speedY: (Math.random() - 0.5) * 0.025,
          opacity: isBright ? Math.random() * 0.5 + 0.5 : Math.random() * 0.5 + 0.15,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: isBright ? Math.random() * 0.035 + 0.015 : Math.random() * 0.025 + 0.01,
          isGold,
          isBright,
        });
      }
    };

    createStars();

    let time = 0;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.x += star.speedX;
        star.y += star.speedY;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        const twinkleAmount1 = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const twinkleAmount2 = Math.cos(time * star.twinkleSpeed * 0.7 + star.twinklePhase * 0.8);
        const twinkle = twinkleAmount1 * 0.6 + twinkleAmount2 * 0.2 + 0.2;
        const finalOpacity = star.opacity * Math.max(twinkle, 0);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        
        if (star.isGold) {
          ctx.fillStyle = `rgba(255, 245, 200, ${finalOpacity})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
        }
        
        ctx.fill();

        if (star.isBright && finalOpacity > 0.4) {
          const glowSize = star.size * 4;
          const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowSize);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${finalOpacity * 0.25})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.beginPath();
          ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });

      time++;
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 2;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const validateSignup = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your full name';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignin = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;

    setIsLoading(true);
    try {
      console.log('[TriveonLogin] Starting signup...');
      await signup(name, email, password);
      console.log('[TriveonLogin] Signup successful!');
      navigate('/role-selection');
    } catch (error: any) {
      console.error('[TriveonLogin] Signup error details:', error);
      let errorMessage = 'An error occurred. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already connected to an account.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Please choose a stronger password.';
      }
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignin()) return;

    setIsLoading(true);
    try {
      console.log('[TriveonLogin] Starting signin...');
      await login(email, password);
      console.log('[TriveonLogin] Signin successful!');
      navigate('/role-selection');
    } catch (error: any) {
      console.error('[TriveonLogin] Signin error details:', error);
      let errorMessage = 'Invalid email or password.';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      }
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('[TriveonLogin] Starting Google login...');
    setIsLoading(true);
    try {
      await googleLogin();
      console.log('[TriveonLogin] Google login successful!');
      navigate('/role-selection');
    } catch (error: any) {
      console.error('[TriveonLogin] Google login error details:', error);
      let errorMessage = 'Unable to sign in with Google.';
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Google sign-in cancelled.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Try again.';
      }
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!forgotEmail.trim()) {
      setErrors({ forgotEmail: 'Enter your email.' });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
      setErrors({ forgotEmail: 'Invalid email address.' });
      return;
    }
    if (forgotNewPassword.length < 6) {
      setErrors({ forgotNewPassword: 'Password must be at least 6 characters.' });
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrors({ forgotConfirmPassword: 'Passwords do not match.' });
      return;
    }

    setIsLoading(true);
    await quickResetPassword(forgotEmail, forgotNewPassword);
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotPasswordOpen(false);
      setForgotSuccess(false);
      setForgotEmail('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
    }, 3000);
    setIsLoading(false);
  };

  return (
    <div className="triveon-login-container">
      <canvas ref={canvasRef} className="stars-canvas" />
      
      <div className="login-content">
        <div className="left-section">
          <div className="branding-section">
            <div className="logo-placeholder">
              <div className="logo-box">
                <div className="logo-glow"></div>
                <div className="logo-content">
                  <img 
                    src="/images/triveon-logo.png" 
                    alt="TRIVEON" 
                    className="logo-image"
                  />
                </div>
              </div>
            </div>

            <div className="features">
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="feature-text">BUILD</span>
              </div>

              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="2" y1="12" x2="22" y2="12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="feature-text">SIGNAL</span>
              </div>

              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="16 12 12 8 8 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="8" x2="12" y2="16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="feature-text">SCALE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="auth-card">
            {activeTab === 'signin' ? (
              <>
                <div className="auth-header">
                  <p className="auth-welcome">Welcome to</p>
                  <h2 className="auth-title">TRIVEON</h2>
                  <p className="auth-subtitle">Enter your credentials to continue</p>
                </div>
              </>
            ) : (
              <>
                <div className="auth-header">
                  <h2 className="auth-title">Create Account</h2>
                  <p className="auth-subtitle">Join the innovation ecosystem</p>
                </div>
              </>
            )}

            <div className="auth-tabs">
              <button 
                className={`tab-button ${activeTab === 'signin' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('signin');
                  setErrors({});
                }}
              >
                Sign In
              </button>
              <button 
                className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('signup');
                  setErrors({});
                }}
              >
                Sign Up
              </button>
            </div>

            {errors.general && (
              <div className="auth-error">{errors.general}</div>
            )}

            <form onSubmit={activeTab === 'signin' ? handleSignin : handleSignup} className="auth-form">
              {activeTab === 'signup' && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              {activeTab === 'signup' && (
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
                </div>
              )}

              {activeTab === 'signin' && (
                <div className="forgot-password">
                  <button type="button" onClick={() => {
                    setForgotPasswordOpen(true);
                    setForgotSuccess(false);
                    setForgotEmail('');
                    setForgotNewPassword('');
                    setForgotConfirmPassword('');
                    setErrors({}); // CLEAR ALL ERRORS!
                  }}>
                    Forgot Password?
                  </button>
                </div>
              )}

              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? 'Processing...' : (activeTab === 'signin' ? 'ENTER ECOSYSTEM' : 'CREATE ACCOUNT')}
              </button>
            </form>

            <div className="auth-divider">
              <div className="divider-line"></div>
              <span className="divider-text">or</span>
              <div className="divider-line"></div>
            </div>

            <button type="button" className="google-button" onClick={handleGoogleLogin} disabled={isLoading}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="auth-footer">
              <button className="demo-link" onClick={handleDemoClick}>
                Quick Demo - No Login Required
              </button>
            </div>
          </div>
        </div>
      </div>

      {forgotPasswordOpen && (
        <div className="premium-modal-overlay" onClick={() => setForgotPasswordOpen(false)}>
          <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
            <div className="premium-modal-header">
              <h3>Forgot Password</h3>
              <button onClick={() => setForgotPasswordOpen(false)} className="premium-modal-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="premium-modal-content">
              {forgotSuccess ? (
                <div className="forgot-success">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <h4>Password Updated Successfully</h4>
                  <p>You can now log in with your new password.</p>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="edit-profile-form">
                  <p className="forgot-description">Reset your password instantly.</p>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className={`form-input ${errors.forgotEmail ? 'error' : ''}`}
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                    {errors.forgotEmail && <p className="form-error">{errors.forgotEmail}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <div className="password-input-container">
                      <input
                        type={showForgotNewPassword ? 'text' : 'password'}
                        className={`form-input ${errors.forgotNewPassword ? 'error' : ''}`}
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                      >
                        {showForgotNewPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.forgotNewPassword && <p className="form-error">{errors.forgotNewPassword}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <div className="password-input-container">
                      <input
                        type={showForgotConfirmPassword ? 'text' : 'password'}
                        className={`form-input ${errors.forgotConfirmPassword ? 'error' : ''}`}
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                      >
                        {showForgotConfirmPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.forgotConfirmPassword && <p className="form-error">{errors.forgotConfirmPassword}</p>}
                  </div>
                  <div className="form-actions">
                    <button 
                      type="button"
                      className="form-btn cancel"
                      onClick={() => setForgotPasswordOpen(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="form-btn save"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TriveonLogin;
