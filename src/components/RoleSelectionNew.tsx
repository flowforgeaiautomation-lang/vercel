import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelectionNew.css';

const RoleSelectionNew: React.FC = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'architect',
      title: 'ARCHITECT',
      description: 'Design and build innovative solutions',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'catalyst',
      title: 'CATALYST',
      description: 'Invest and scale promising ventures',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2V22M17 5H9.5A3.5 3.5 0 0 0 6 8.5A3.5 3.5 0 0 0 9.5 12H14.5A3.5 3.5 0 0 1 18 15.5A3.5 3.5 0 0 1 14.5 19H7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'explorer',
      title: 'EXPLORER',
      description: 'Discover and connect new opportunities',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <path d="M12 6V12L16 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    // Store selected role and navigate to home
    localStorage.setItem('selectedRole', roleId);
    navigate('/home');
  };

  return (
    <div className="role-selection-container">
      <div className="role-selection-content">
        <h1 className="role-selection-title">Choose Your Path</h1>
        <p className="role-selection-subtitle">Select your role in the TRIARCORA ecosystem</p>
        
        <div className="roles-grid">
          {roles.map((role) => (
            <div
              key={role.id}
              className="role-card"
              onClick={() => handleRoleSelect(role.id)}
            >
              <div className="role-icon">
                {role.icon}
              </div>
              <h3 className="role-title">{role.title}</h3>
              <p className="role-description">{role.description}</p>
              <div className="role-action">
                <span>Select</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionNew;
