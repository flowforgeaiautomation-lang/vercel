import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './RoleSelection.css';

const CheckIcon = ({ size = 14 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="#000000" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const ArrowRightIcon = ({ size = 20 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="#000000" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const RoleSelection: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('architect');
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const { profile, updateProfileRole, user } = useAuth();



  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 3;

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
      canvas.height = window.innerHeight * 3;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleRoleClick = (role: string) => {
    setSelectedRole(role);
  };

  const handleRoleDoubleClick = async (role: string) => {
    setSelectedRole(role);
    localStorage.setItem('selectedRole', role);
    // Navigate FIRST for instant response
    navigate('/home');
    // Update role in background
    try {
      if (user) {
        await updateProfileRole(role);
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleContinue = async () => {
    localStorage.setItem('selectedRole', selectedRole);
    // Navigate FIRST for instant response
    navigate('/home');
    // Update role in background
    try {
      if (user) {
        await updateProfileRole(selectedRole);
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <div className="role-selection-container">
      <canvas ref={canvasRef} className="particles-canvas" />
      
      <div className="role-selection-content">
        <div className="header-section">
          <div className="brand-header">
            <h1 className="brand-name">TRIARCORA</h1>
            <p className="brand-tagline">Ideas. Validated. Funded.</p>
          </div>
          
          <div className="welcome-text">
            <p className="welcome-line">Welcome to the Startup Ecosystem</p>
            <p className="welcome-line">Where Ideas Get Validated and Funded</p>
          </div>
        </div>

        <div className="section-divider">
          <div className="divider-line"></div>
          <div className="divider-diamond">
            <div className="diamond-inner"></div>
          </div>
          <span className="divider-text">CHOOSE YOUR ROLE</span>
          <div className="divider-diamond">
            <div className="diamond-inner"></div>
          </div>
          <div className="divider-line"></div>
        </div>

        <div className="role-cards-section">
          <div 
            className={`role-card ${selectedRole === 'architect' ? 'selected' : ''}`}
            onClick={() => handleRoleClick('architect')}
            onDoubleClick={() => handleRoleDoubleClick('architect')}
          >
            {selectedRole === 'architect' && (
              <div className="selected-indicator">
                <div className="indicator-circle">
                  <CheckIcon size={14} />
                </div>
              </div>
            )}
            
            <div className="card-content">
              <div className="card-text">
                <h3 className="card-title gold">ARCHITECT</h3>
                <p className="card-subtitle">Build the Future</p>
                <p className="card-description">
                  You build ideas. We help you validate, grow and get funded.
                </p>
                <div className="card-tags">
                  <span className="tag">FOUNDERS</span>
                  <span className="tag">BUILDERS</span>
                  <span className="tag">INNOVATORS</span>
                </div>
              </div>
              <div className="card-image architects-image">
                <img 
                  src="/images/architects-image.jpg" 
                  alt="Architects" 
                  className="role-image"
                />
                <div className="image-overlay"></div>
              </div>
            </div>
          </div>

          <div 
            className={`role-card ${selectedRole === 'explorer' ? 'selected' : ''}`}
            onClick={() => handleRoleClick('explorer')}
            onDoubleClick={() => handleRoleDoubleClick('explorer')}
          >
            {selectedRole === 'explorer' && (
              <div className="selected-indicator">
                <div className="indicator-circle">
                  <CheckIcon size={14} />
                </div>
              </div>
            )}
            
            <div className="card-content">
              <div className="card-text">
                <h3 className="card-title blue">EXPLORER</h3>
                <p className="card-subtitle">Discover. Validate. Support.</p>
                <p className="card-description">
                  Explore startups, share feedback, support ideas and be part of something big.
                </p>
                <div className="card-tags">
                  <span className="tag blue-tag">LEARNERS</span>
                  <span className="tag blue-tag">SUPPORTERS</span>
                  <span className="tag blue-tag">TRENDSETTERS</span>
                </div>
              </div>
              <div className="card-image explorers-image">
                <img 
                  src="/images/explorers-image.jpg" 
                  alt="Explorers" 
                  className="role-image"
                />
                <div className="image-overlay"></div>
              </div>
            </div>
          </div>

          <div 
            className={`role-card ${selectedRole === 'catalyst' ? 'selected' : ''}`}
            onClick={() => handleRoleClick('catalyst')}
            onDoubleClick={() => handleRoleDoubleClick('catalyst')}
          >
            {selectedRole === 'catalyst' && (
              <div className="selected-indicator">
                <div className="indicator-circle">
                  <CheckIcon size={14} />
                </div>
              </div>
            )}
            
            <div className="card-content">
              <div className="card-text">
                <h3 className="card-title green">CATALYST</h3>
                <p className="card-subtitle">Invest in What Matters</p>
                <p className="card-description">
                  Back high-potential startups based on real traction and validation.
                </p>
                <div className="card-tags">
                  <span className="tag green-tag">INVESTORS</span>
                  <span className="tag green-tag">BACKERS</span>
                  <span className="tag green-tag">GROWTH PARTNERS</span>
                </div>
              </div>
              <div className="card-image catalysts-image">
                <img 
                  src="/images/catalysts-image.jpg" 
                  alt="Catalysts" 
                  className="role-image"
                />
                <div className="image-overlay"></div>
              </div>
            </div>
          </div>
        </div>

        <button 
          className="continue-button" 
          onClick={handleContinue}
          disabled={isLoading}
        >
          <span className="continue-text">{isLoading ? 'PROCESSING...' : 'CONTINUE'}</span>
          {!isLoading && <ArrowRightIcon size={20} />}
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
