import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePremium.css';
import './PremiumFeatures.css';

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const DiscoverIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"></polyline>
    <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
    <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
    <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
  </svg>
);

const SignalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ScaleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="16 12 12 8 8 12" />
    <line x1="12" y1="8" x2="12" y2="16" />
  </svg>
);

const RocketIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const NetworkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3"></circle>
    <circle cx="5" cy="19" r="3"></circle>
    <circle cx="19" cy="19" r="3"></circle>
    <line x1="12" y1="8" x2="5" y2="16"></line>
    <line x1="12" y1="8" x2="19" y2="16"></line>
  </svg>
);

const CommunityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const EventsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const EcosystemIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const OpportunitiesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const OSIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"></path>
    <path d="m19 9 12 16 5 9"></path>
  </svg>
);

const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3 9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const BookmarkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
  </svg>
);

const SavedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
  </svg>
);

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-1.82.33 1.65 1.65 0 0 0-1.01 2.83v.06a2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.01-2.83v-.06a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.01-2.83v-.06a2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1.01 2.83z"></path>
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.602c0-1.341-.025-3.072-1.871-3.072-1.875 0-2.163 1.46-2.163 2.972v5.702h-3v-11h3v1.588c.438-.844 1.525-1.588 3.322-1.588 4.366 0 5.175 2.785 5.175 6.186v6.27z"/>
  </svg>
);

const ConnectIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const MessageSmallIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
);

const DiamondIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 9l10 13 10-13-10-7z" fill="#8b5cf6"/>
  </svg>
);

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);

const VideoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"></polygon>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const MoneyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const PresentationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"></rect>
    <line x1="8" y1="21" x2="8" y2="17"></line>
    <line x1="16" y1="21" x2="16" y2="17"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const AddIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const CrownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

interface RoleData {
  name: string;
  title: string;
  bio: string;
  location: string;
  badges: string[];
  verificationColor: string;
  primaryColor: string;
  score: number;
  scoreTier: string;
}

const ROLE_DATA: Record<string, RoleData> = {
  ARCHITECT: {
    name: "Arjun Malhotra",
    title: "Founder & CEO at Nexora AI",
    bio: "Building the intelligence layer for modern startups.",
    location: "📍 Bangalore, India",
    badges: ["Founder", "Builder", "AI Enthusiast"],
    verificationColor: "#FFD700",
    primaryColor: "gold",
    score: 93,
    scoreTier: "Sovereign"
  },
  CATALYST: {
    name: "David Morgan",
    title: "Venture Capital Partner",
    bio: "Catalyzing the next generation of disruptive startups.",
    location: "📍 San Francisco, California, USA",
    badges: ["CATALYST", "VERIFIED INVESTOR"],
    verificationColor: "#00C896",
    primaryColor: "green",
    score: 96,
    scoreTier: "Sovereign"
  },
  EXPLORER: {
    name: "Alex Explorer",
    title: "Curious. Connected. Growing Together.",
    bio: "Exploring ideas, supporting founders, and learning every day in the Triveon ecosystem.",
    location: "📍 Global Citizen",
    badges: ["EXPLORER"],
    verificationColor: "#3B82F6",
    primaryColor: "blue",
    score: 90,
    scoreTier: "Elite"
  }
};

const ProfilePremium_Enhanced: React.FC = () => {
  const navigate = useNavigate();
  const [mainRole, setMainRole] = useState<string>(() => {
    const selectedRole = localStorage.getItem('selectedRole');
    return selectedRole ? selectedRole.toUpperCase() : 'ARCHITECT';
  });
  const [extraRole, setExtraRole] = useState<string | null>(null);
  const [activeProfileMode, setActiveProfileMode] = useState<string>(mainRole);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [addRoleModalOpen, setAddRoleModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const selectedRole = localStorage.getItem('selectedRole');
    const newMainRole = selectedRole ? selectedRole.toUpperCase() : 'ARCHITECT';
    if (newMainRole !== mainRole) {
      setMainRole(newMainRole);
      setActiveProfileMode(newMainRole);
    }
  }, []);

  const currentData = ROLE_DATA[activeProfileMode];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const openAddRoleModal = () => {
    setAddRoleModalOpen(true);
    setDropdownOpen(false);
  };

  const switchToExtraRole = () => {
    if (extraRole) {
      setActiveProfileMode(activeProfileMode === mainRole ? extraRole : mainRole);
      setDropdownOpen(false);
    }
  };

  const addExtraRole = (role: string) => {
    setExtraRole(role);
    setAddRoleModalOpen(false);
  };

  return (
    <div className="profile-premium-container">
      <aside className="premium-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">TRIVEON</div>
        </div>

        <nav className="premium-sidebar-nav">
          <div className="premium-nav-item" onClick={() => navigate('/home')}>
            <HomeIcon />
            <span>Home</span>
          </div>
          {activeProfileMode === 'CATALYST' || activeProfileMode === 'EXPLORER' ? (
            <div className="premium-nav-item">
              <DiscoverIcon />
              <span>Discover</span>
            </div>
          ) : (
            <div className="premium-nav-item">
              <SignalIcon />
              <span>Signal</span>
            </div>
          )}
          <div className="premium-nav-item">
            <RocketIcon />
            <span>Startups</span>
          </div>
          <div className="premium-nav-item">
            <UsersIcon />
            <span>Investors</span>
          </div>
          {activeProfileMode === 'CATALYST' || activeProfileMode === 'EXPLORER' ? (
            <div className="premium-nav-item">
              <CommunityIcon />
              <span>Community</span>
            </div>
          ) : (
            <div className="premium-nav-item">
              <NetworkIcon />
              <span>Network</span>
            </div>
          )}
          {activeProfileMode === 'CATALYST' || activeProfileMode === 'EXPLORER' ? (
            <div className="premium-nav-item">
              <EventsIcon />
              <span>Events</span>
            </div>
          ) : (
            <div className="premium-nav-item">
              <OpportunitiesIcon />
              <span>Opportunities</span>
            </div>
          )}
          {activeProfileMode === 'CATALYST' || activeProfileMode === 'EXPLORER' ? (
            <div className="premium-nav-item">
              <EcosystemIcon />
              <span>Ecosystem</span>
            </div>
          ) : (
            <div className="premium-nav-item">
              <OSIcon />
              <span>OS</span>
              <span className="nav-badge">NEW</span>
            </div>
          )}
          {activeProfileMode === 'ARCHITECT' && (
            <div className="premium-nav-item">
              <AnalyticsIcon />
              <span>Analytics</span>
            </div>
          )}
          <div className="premium-nav-item">
            <MessageIcon />
            <span>Messages</span>
            {activeProfileMode === 'ARCHITECT' && <span className="nav-badge">9</span>}
          </div>
          {activeProfileMode === 'CATALYST' || activeProfileMode === 'EXPLORER' ? (
            <div className="premium-nav-item">
              <BellIcon />
              <span>Notifications</span>
            </div>
          ) : null}
          {activeProfileMode === 'CATALYST' || activeProfileMode === 'EXPLORER' ? (
            <div className="premium-nav-item">
              <SavedIcon />
              <span>Saved</span>
            </div>
          ) : (
            <div className="premium-nav-item">
              <BookmarkIcon />
              <span>Bookmarks</span>
            </div>
          )}
          <div className="premium-nav-item active">
            <ProfileIcon />
            <span>Profile</span>
          </div>
        </nav>

        {activeProfileMode === 'CATALYST' || activeProfileMode === 'EXPLORER' ? (
          <div className="premium-sidebar-upgrade-card">
            <CrownIcon className="upgrade-icon" />
            <h3>Triveon Premium</h3>
            <p>Unlock exclusive ecosystem benefits and premium access.</p>
            <button className="premium-upgrade-btn">Upgrade Now</button>
          </div>
        ) : null}

        <div className="premium-sidebar-bottom">
          {activeProfileMode === 'ARCHITECT' ? (
            <>
              <div className="premium-nav-item">
                <SettingsIcon />
                <span>Settings</span>
              </div>
              <div className="premium-nav-item">
                <LogoutIcon />
                <span>Logout</span>
              </div>
            </>
          ) : (
            <div className="premium-sidebar-user">
              <img 
                src={activeProfileMode === 'ARCHITECT' 
                  ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face"
                  : activeProfileMode === 'CATALYST'
                  ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face"
                  : "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&crop=face"
                } 
                alt={currentData.name}
                className="premium-sidebar-avatar"
              />
              <div className="premium-sidebar-user-info">
                <div className="premium-sidebar-user-name">{currentData.name}</div>
                <div className="premium-sidebar-user-role">{activeProfileMode}</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          )}
        </div>
      </aside>

      <main className="premium-main-content">
        <header className="premium-header">
          <div className="premium-search-bar">
            <SearchIcon />
            <input 
              type="text" 
              placeholder={activeProfileMode === 'CATALYST' || activeProfileMode === 'EXPLORER' ? "Search startups, investors, people..." : "Search founders, startups, investors..."} 
            />
          </div>

          <div className="premium-header-actions">
            {activeProfileMode === 'CATALYST' || activeProfileMode === 'EXPLORER' ? (
              <div className="premium-header-icon">
                <EcosystemIcon />
              </div>
            ) : null}
            <div className="premium-header-icon">
              <MessageIcon />
            </div>
            <div className="premium-header-icon">
              <BellIcon />
            </div>
            <div className="premium-header-avatar">
              <img src={activeProfileMode === 'ARCHITECT' 
                ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                : activeProfileMode === 'CATALYST'
                ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                : "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
              } alt="Profile" />
            </div>
          </div>
        </header>

        <div className="premium-profile-content">
          <div className="premium-profile-header-section">
            <div className="premium-profile-main">
              <div className="premium-profile-image-wrapper">
                {activeProfileMode === 'CATALYST' || activeProfileMode === 'EXPLORER' ? (
                  <div className="premium-profile-hero-graphic">
                    {activeProfileMode === 'CATALYST' ? (
                      <div className="catalyst-hero-graphic">
                        <svg viewBox="0 0 300 250" className="hero-chart">
                          <defs>
                            <linearGradient id="catalystHeroGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                              <stop offset="0%" stopColor="#00C896" stopOpacity="0.1"/>
                              <stop offset="100%" stopColor="#00C896" stopOpacity="0.5"/>
                            </linearGradient>
                          </defs>
                          <circle cx="150" cy="125" r="100" fill="none" stroke="#00C896" strokeWidth="1" opacity="0.3"/>
                          <circle cx="150" cy="125" r="60" fill="none" stroke="#00C896" strokeWidth="1" opacity="0.5"/>
                          <polyline points="30,200 60,180 90,190 120,140 150,120 180,130 210,80 240,90 270,40" fill="none" stroke="#00C896" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M240 50 L270 80 L300 50" fill="none" stroke="#00C896" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="270" cy="80" r="8" fill="#00C896"/>
                          <circle cx="60" cy="80" r="10" fill="#00C896" opacity="0.8"/>
                          <circle cx="100" cy="60" r="8" fill="#00C896" opacity="0.7"/>
                          <circle cx="200" cy="60" r="12" fill="#00C896" opacity="0.9"/>
                          <circle cx="240" cy="100" r="9" fill="#00C896" opacity="0.75"/>
                        </svg>
                      </div>
                    ) : (
                      <div className="explorer-hero-graphic">
                        <svg viewBox="0 0 300 250" className="hero-network">
                          <defs>
                            <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(59,130,246,0.1)" strokeWidth="0.5"/>
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#gridPattern)"/>
                          <circle cx="150" cy="125" r="100" fill="none" stroke="#3B82F6" strokeWidth="1" strokeDasharray="5,5"/>
                          <circle cx="80" cy="75" r="10" fill="#3B82F6"/>
                          <circle cx="220" cy="75" r="10" fill="#3B82F6"/>
                          <circle cx="80" cy="175" r="10" fill="#3B82F6"/>
                          <circle cx="220" cy="175" r="10" fill="#3B82F6"/>
                          <circle cx="150" cy="55" r="8" fill="#60A5FA"/>
                          <circle cx="150" cy="195" r="8" fill="#60A5FA"/>
                          <line x1="150" y1="125" x2="80" y2="75" stroke="#3B82F6" strokeWidth="1.5"/>
                          <line x1="150" y1="125" x2="220" y2="75" stroke="#3B82F6" strokeWidth="1.5"/>
                          <line x1="150" y1="125" x2="80" y2="175" stroke="#3B82F6" strokeWidth="1.5"/>
                          <line x1="150" y1="125" x2="220" y2="175" stroke="#3B82F6" strokeWidth="1.5"/>
                          <line x1="150" y1="125" x2="150" y2="55" stroke="#3B82F6" strokeWidth="1.5"/>
                          <line x1="150" y1="125" x2="150" y2="195" stroke="#3B82F6" strokeWidth="1.5"/>
                        </svg>
                      </div>
                    )}
                  </div>
                ) : null}
                <div className="premium-profile-image-ring">
                  <img 
                    src={activeProfileMode === 'ARCHITECT' 
                      ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&h=180&fit=crop&crop=face"
                      : activeProfileMode === 'CATALYST'
                      ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=180&h=180&fit=crop&crop=face"
                      : "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=180&h=180&fit=crop&crop=face"
                    } alt={currentData.name}
                    className="premium-profile-image"
                  />
                  <div className="premium-verification-badge">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 0C5.37 0 0 5.37 0 12C0 18.63 5.37 24 12 24C18.63 24 24 18.63 24 12C24 5.37 18.63 0 12 0ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill={currentData.verificationColor}/>
                    </svg>
                  </div>
                  {activeProfileMode === 'CATALYST' || activeProfileMode === 'EXPLORER' ? (
                    <div className="premium-edit-image-icon">
                      <CameraIcon />
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="premium-profile-info">
                {activeProfileMode === 'CATALYST' || activeProfileMode === 'EXPLORER' ? (
                  <div className="premium-profile-badges-top">
                    <span className={`premium-hero-badge ${currentData.primaryColor}`}>{activeProfileMode}</span>
                    {currentData.badges.slice(1).map((badge, i) => (
                      <span key={i} className="premium-hero-badge">{badge}</span>
                    ))}
                  </div>
                ) : null}
                <div className="premium-profile-name-row">
                  <h1 className="premium-profile-name">{currentData.name}</h1>
                  {activeProfileMode === 'ARCHITECT' && <LinkedInIcon className="premium-linkedin-icon" />}
                </div>
                <p className="premium-profile-title">{currentData.title}</p>
                <p className="premium-profile-bio">{currentData.bio}</p>
                <div className="premium-profile-meta">
                  <span className="premium-profile-location">{currentData.location}</span>
                </div>
                {activeProfileMode === 'ARCHITECT' ? (
                  <div className="premium-profile-badges">
                    <span className={`premium-badge ${currentData.primaryColor}`}>{activeProfileMode}</span>
                    {extraRole && (
                      <span className="premium-badge purple">{extraRole}</span>
                    )}
                    {currentData.badges.map((badge, i) => (
                      <span key={i} className="premium-badge">{badge}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            {activeProfileMode === 'ARCHITECT' ? (
              <div className="premium-profile-actions">
                <button className="premium-action-btn primary">
                  <ConnectIcon />
                  Connect
                </button>
                <button className="premium-action-btn secondary">
                  <MessageSmallIcon />
                  Message
                </button>
                <div className="premium-action-btn icon-only relative">
                  <button onClick={toggleDropdown}>
                    <MoreIcon />
                  </button>
                  {dropdownOpen && (
                    <div className="premium-dropdown-menu">
                      {!extraRole ? (
                        <div className="premium-dropdown-item" onClick={openAddRoleModal}>
                          <AddIcon />
                          <span>Add Role</span>
                        </div>
                      ) : (
                        <div className="premium-dropdown-item" onClick={switchToExtraRole}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                          </svg>
                          <span>{activeProfileMode === mainRole ? 'See Another Profile' : 'Back to Main Profile'}</span>
                        </div>
                      )}
                      <div className="premium-dropdown-item">
                        <SettingsIcon />
                        <span>Settings</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="premium-edit-profile-btn-container">
                <button className="premium-edit-profile-btn">
                  <EditIcon />
                  Edit Profile
                </button>
              </div>
            )}

            {activeProfileMode === 'ARCHITECT' && (
              <div className="premium-triveon-score">
                <div className="premium-score-header">
                  <span className="premium-score-label">TRIVEON Score</span>
                  <InfoIcon />
                </div>
                <div className="premium-score-value">{currentData.score}</div>
                <div className="premium-score-tier">
                  <span>{currentData.scoreTier}</span>
                  <DiamondIcon />
                </div>
              </div>
            )}
          </div>

          {/* Add Role Modal */}
          {addRoleModalOpen && (
            <div className="premium-modal-overlay" onClick={() => setAddRoleModalOpen(false)}>
              <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
                <div className="premium-modal-header">
                  <h3>Add an Extra Role</h3>
                  <button onClick={() => setAddRoleModalOpen(false)} className="premium-modal-close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <div className="premium-modal-content">
                  <p>Choose one extra role (can't be your main role):</p>
                  <div className="premium-role-options">
                    {['ARCHITECT', 'EXPLORER', 'CATALYST'].filter(role => role !== mainRole).map(role => (
                      <button 
                        key={role}
                        className="premium-role-option"
                        onClick={() => addExtraRole(role)}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Three dot menu for Catalyst/Explorer */}
          {(activeProfileMode === 'CATALYST' || activeProfileMode === 'EXPLORER') && (
            <div className="premium-three-dot-menu-container">
              <div className="premium-action-btn icon-only relative" onClick={toggleDropdown}>
                <button>
                  <MoreIcon />
                </button>
                {dropdownOpen && (
                  <div className="premium-dropdown-menu">
                    {!extraRole ? (
                      <div className="premium-dropdown-item" onClick={openAddRoleModal}>
                        <AddIcon />
                        <span>Add Role</span>
                      </div>
                    ) : (
                      <div className="premium-dropdown-item" onClick={switchToExtraRole}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                        </svg>
                        <span>{activeProfileMode === mainRole ? 'See Another Profile' : 'Back to Main Profile'}</span>
                      </div>
                    )}
                    <div className="premium-dropdown-item">
                      <SettingsIcon />
                      <span>Settings</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Top Stats Strip for Catalyst/Explorer */}
          {(activeProfileMode === 'CATALYST' || activeProfileMode === 'EXPLORER') && (
            <div className="premium-top-stats-strip">
              <div className="premium-top-stat">
                <span className="premium-top-stat-label">Member Since</span>
                <span className="premium-top-stat-value">{activeProfileMode === 'CATALYST' ? 'Jan 2022' : 'May 2024'}</span>
              </div>
              <div className="premium-top-stat">
                <span className="premium-top-stat-label">{activeProfileMode === 'CATALYST' ? 'Total Investments' : 'Communities Joined'}</span>
                <span className="premium-top-stat-value">{activeProfileMode === 'CATALYST' ? '48' : '12'}</span>
              </div>
              <div className="premium-top-stat">
                <span className="premium-top-stat-label">{activeProfileMode === 'CATALYST' ? 'Portfolio Companies' : 'Discussions'}</span>
                <span className="premium-top-stat-value">{activeProfileMode === 'CATALYST' ? '23' : '28'}</span>
              </div>
              <div className="premium-top-stat">
                <span className="premium-top-stat-label">{activeProfileMode === 'CATALYST' ? 'Ecosystem Impact' : 'Feedback Given'}</span>
                <span className="premium-top-stat-value">{activeProfileMode === 'CATALYST' ? 'High' : '34'}</span>
              </div>
              <div className="premium-top-stat">
                <span className="premium-top-stat-label">{activeProfileMode === 'CATALYST' ? 'Trust Score' : 'Connections'}</span>
                <span className="premium-top-stat-value">{activeProfileMode === 'CATALYST' ? '98%' : '156'}</span>
              </div>
            </div>
          )}

          {/* Navigation Tabs for Catalyst/Explorer */}
          {(activeProfileMode === 'CATALYST' || activeProfileMode === 'EXPLORER') && (
            <div className="premium-nav-tabs">
              <button className="premium-nav-tab active">Overview</button>
              <button className="premium-nav-tab">{activeProfileMode === 'CATALYST' ? 'Portfolio' : 'Activity'}</button>
              <button className="premium-nav-tab">{activeProfileMode === 'CATALYST' ? 'Activity' : 'Communities'}</button>
              <button className="premium-nav-tab">{activeProfileMode === 'CATALYST' ? 'Network' : 'Saved Startups'}</button>
              {activeProfileMode === 'CATALYST' && <button className="premium-nav-tab">Deals</button>}
              <button className="premium-nav-tab">{activeProfileMode === 'CATALYST' ? 'Insights' : 'Discussions'}</button>
              {activeProfileMode === 'EXPLORER' && <button className="premium-nav-tab">Learning</button>}
            </div>
          )}

          {/* Architect Sections */}
          {activeProfileMode === 'ARCHITECT' && (
            <>
              <div className="premium-credibility-strip">
                <div className="premium-credibility-header">
                  <span className="premium-credibility-title">CREDIBILITY STRIP</span>
                  <InfoIcon />
                </div>
                <p className="premium-credibility-subtitle">Your proof. Your reputation. Your edge.</p>

                <div className="premium-credibility-grid">
                  <div className="premium-credibility-card gold">
                    <div className="premium-circular-progress gold">
                      <svg className="progress-ring" width="80" height="80">
                        <circle className="progress-ring-circle-bg" cx="40" cy="40" r="34"></circle>
                        <circle className="progress-ring-circle gold" cx="40" cy="40" r="34" style={{ strokeDashoffset: (213.5 - (213.5 * 93 / 100)) }}></circle>
                      </svg>
                      <span className="premium-progress-value">93</span>
                    </div>
                    <span className="premium-credibility-card-label">Credibility Score</span>
                    <span className="premium-credibility-card-tier gold">Sovereign</span>
                  </div>

                  <div className="premium-credibility-card purple">
                    <div className="premium-circular-progress purple">
                      <svg className="progress-ring" width="80" height="80">
                        <circle className="progress-ring-circle-bg" cx="40" cy="40" r="34"></circle>
                        <circle className="progress-ring-circle purple" cx="40" cy="40" r="34" style={{ strokeDashoffset: (213.5 - (213.5 * 91 / 100)) }}></circle>
                      </svg>
                      <span className="premium-progress-value">91</span>
                    </div>
                    <span className="premium-credibility-card-label">Execution Score</span>
                    <span className="premium-credibility-card-tier purple">Elite</span>
                  </div>

                  <div className="premium-credibility-card blue">
                    <div className="premium-circular-progress blue">
                      <svg className="progress-ring" width="80" height="80">
                        <circle className="progress-ring-circle-bg" cx="40" cy="40" r="34"></circle>
                        <circle className="progress-ring-circle blue" cx="40" cy="40" r="34" style={{ strokeDashoffset: (213.5 - (213.5 * 89 / 100)) }}></circle>
                      </svg>
                      <span className="premium-progress-value">89</span>
                    </div>
                    <span className="premium-credibility-card-label">Contribution Score</span>
                    <span className="premium-credibility-card-tier blue">Elite</span>
                  </div>

                  <div className="premium-credibility-card green">
                    <div className="premium-circular-progress green">
                      <svg className="progress-ring" width="80" height="80">
                        <circle className="progress-ring-circle-bg" cx="40" cy="40" r="34"></circle>
                        <circle className="progress-ring-circle green" cx="40" cy="40" r="34" style={{ strokeDashoffset: (213.5 - (213.5 * 6 / 100)) }}></circle>
                      </svg>
                      <span className="premium-progress-value">94%</span>
                    </div>
                    <span className="premium-credibility-card-label">Ecosystem Trust</span>
                    <span className="premium-credibility-card-tier green">Very High</span>
                  </div>

                  <div className="premium-credibility-card orange">
                    <div className="premium-circular-progress orange">
                      <svg className="progress-ring" width="80" height="80">
                        <circle className="progress-ring-circle-bg" cx="40" cy="40" r="34"></circle>
                        <circle className="progress-ring-circle orange" cx="40" cy="40" r="34" style={{ strokeDashoffset: (213.5 - (213.5 * 98 / 100)) }}></circle>
                      </svg>
                      <span className="premium-progress-value">Top 2%</span>
                    </div>
                    <span className="premium-credibility-card-label">Founder Prestige</span>
                    <span className="premium-credibility-card-tier orange">Global</span>
                  </div>

                  <div className="premium-credibility-card chart">
                    <div className="premium-mini-chart">
                      <svg width="100" height="60" viewBox="0 0 100 60">
                        <polyline 
                          points="10,45 25,40 40,35 55,25 70,20 85,10 95,15"
                          fill="none"
                          stroke="#FFD700"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="95" cy="15" r="4" fill="#FFD700" />
                      </svg>
                      <div className="premium-chart-value">+18%</div>
                    </div>
                    <span className="premium-credibility-card-label">Reputation Trend</span>
                    <span className="premium-credibility-card-tier chart">This month</span>
                  </div>
                </div>
              </div>

              <div className="premium-stats-strip">
                <div className="premium-stat-card">
                  <div className="premium-stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                    </svg>
                  </div>
                  <div className="premium-stat-info">
                    <div className="premium-stat-label">Startups Built</div>
                    <div className="premium-stat-value">3</div>
                    <div className="premium-stat-meta">2 Exited • 1 Active</div>
                  </div>
                </div>

                <div className="premium-stat-card">
                  <div className="premium-stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div className="premium-stat-info">
                    <div className="premium-stat-label">Startups Backed</div>
                    <div className="premium-stat-value">7</div>
                    <div className="premium-stat-meta">2 Unicorns • 1 Soonicorn</div>
                  </div>
                </div>

                <div className="premium-stat-card">
                  <div className="premium-stat-icon">
                    <StarIcon />
                  </div>
                  <div className="premium-stat-info">
                    <div className="premium-stat-label">Avg Feedback Score Given</div>
                    <div className="premium-stat-value">4.8<span className="premium-stat-decimal">/5.0</span></div>
                    <div className="premium-stat-meta">Across 128 feedbacks</div>
                  </div>
                </div>

                <div className="premium-stat-card">
                  <div className="premium-stat-icon">
                    <NetworkIcon />
                  </div>
                  <div className="premium-stat-info">
                    <div className="premium-stat-label">Successful Matches</div>
                    <div className="premium-stat-value">23</div>
                    <div className="premium-stat-meta">Founders • Investors • Mentors</div>
                  </div>
                </div>
              </div>

              <div className="premium-two-column">
                <div className="premium-left-column">
                  <div className="premium-timeline-section">
                    <h3 className="premium-section-title">ACTIVITY TIMELINE</h3>
                    <div className="premium-timeline">
                      <div className="premium-timeline-item">
                        <div className="premium-timeline-dot green"></div>
                        <div className="premium-timeline-content">
                          <div className="premium-timeline-header">
                            <span className="premium-timeline-title">Nexora AI raised $2.4M Pre-Seed</span>
                            <span className="premium-timeline-time">2d ago</span>
                          </div>
                          <p className="premium-timeline-description">Led by Elevation Capital</p>
                        </div>
                      </div>
                      <div className="premium-timeline-item">
                        <div className="premium-timeline-dot beige"></div>
                        <div className="premium-timeline-content">
                          <div className="premium-timeline-header">
                            <span className="premium-timeline-title">Shared a deep dive: AI in Early Stage Startups</span>
                            <span className="premium-timeline-time">12d ago</span>
                          </div>
                        </div>
                      </div>
                      <div className="premium-timeline-item">
                        <div className="premium-timeline-dot gold"></div>
                        <div className="premium-timeline-content">
                          <div className="premium-timeline-header">
                            <span className="premium-timeline-title">Provided feedback on 5 startups</span>
                            <span className="premium-timeline-time">2w ago</span>
                          </div>
                          <p className="premium-timeline-description">Helped founders improve their pitch & strategy</p>
                        </div>
                      </div>
                      <div className="premium-timeline-item">
                        <div className="premium-timeline-dot blue"></div>
                        <div className="premium-timeline-content">
                          <div className="premium-timeline-header">
                            <span className="premium-timeline-title">Spoke at TRIVEON Summit '24</span>
                            <span className="premium-timeline-time">1m ago</span>
                          </div>
                          <p className="premium-timeline-description">On stage: Building AI that scales</p>
                        </div>
                      </div>
                      <div className="premium-timeline-item">
                        <div className="premium-timeline-dot green"></div>
                        <div className="premium-timeline-content">
                          <div className="premium-timeline-header">
                            <span className="premium-timeline-title">Exited NexStack (Acquired by BrowserStack)</span>
                            <span className="premium-timeline-time">8m ago</span>
                          </div>
                          <p className="premium-timeline-description">As Co-founder & CTO</p>
                        </div>
                      </div>
                      <div className="premium-timeline-item">
                        <div className="premium-timeline-dot warning"></div>
                        <div className="premium-timeline-content">
                          <div className="premium-timeline-header">
                            <span className="premium-timeline-title">Joined TRIVEON</span>
                            <span className="premium-timeline-time">1y ago</span>
                          </div>
                          <p className="premium-timeline-description">Began the journey</p>
                        </div>
                      </div>
                    </div>
                    <button className="premium-view-full-timeline-btn">View full timeline <ArrowRightIcon /></button>
                  </div>
                </div>

                <div className="premium-right-column">
                  <div className="premium-assets-section">
                    <h3 className="premium-section-title">LINKED ASSETS</h3>
                    <div className="premium-assets-list">
                      <div className="premium-asset-item">
                        <div className="premium-asset-icon red">
                          <FileIcon />
                        </div>
                        <div className="premium-asset-info">
                          <div className="premium-asset-name">Nexora_AI_Pitch_Deck.pdf</div>
                          <div className="premium-asset-meta">Pitch Deck • Updated 3d ago</div>
                        </div>
                        <DownloadIcon className="premium-asset-download" />
                      </div>
                      <div className="premium-asset-item">
                        <div className="premium-asset-icon dark">
                          <VideoIcon />
                        </div>
                        <div className="premium-asset-info">
                          <div className="premium-asset-name">Nexora_AI_Demo.mp4</div>
                          <div className="premium-asset-meta">Product Demo • Updated 1w ago</div>
                        </div>
                        <DownloadIcon className="premium-asset-download" />
                      </div>
                      <div className="premium-asset-item">
                        <div className="premium-asset-icon red">
                          <DocumentIcon />
                        </div>
                        <div className="premium-asset-info">
                          <div className="premium-asset-name">Nexora_Technology_Overview.pdf</div>
                          <div className="premium-asset-meta">Technical Overview • Updated 1w ago</div>
                        </div>
                        <DownloadIcon className="premium-asset-download" />
                      </div>
                      <div className="premium-asset-item">
                        <div className="premium-asset-icon red">
                          <PresentationIcon />
                        </div>
                        <div className="premium-asset-info">
                          <div className="premium-asset-name">Nexora_One_Pager.pdf</div>
                          <div className="premium-asset-meta">One Pager • Updated 2w ago</div>
                        </div>
                        <DownloadIcon className="premium-asset-download" />
                      </div>
                      <div className="premium-asset-item">
                        <div className="premium-asset-icon dark">
                          <MoneyIcon />
                        </div>
                        <div className="premium-asset-info">
                          <div className="premium-asset-name">NexStack_Acquisition_Deck.pdf</div>
                          <div className="premium-asset-meta">Acquisition Deck • Updated 3m ago</div>
                        </div>
                        <DownloadIcon className="premium-asset-download" />
                      </div>
                    </div>
                    <button className="premium-view-all-btn">View all assets <ArrowRightIcon /></button>
                  </div>
                </div>
              </div>

              <div className="premium-impact-section">
                <h3 className="premium-section-title">ECOSYSTEM IMPACT</h3>
                <div className="premium-impact-grid">
                  <div className="premium-impact-item">
                    <div className="premium-impact-value">54+</div>
                    <div className="premium-impact-label">Startups Impacted</div>
                    <div className="premium-impact-sub">Through feedback & mentorship</div>
                  </div>
                  <div className="premium-impact-item">
                    <div className="premium-impact-value">1,200+</div>
                    <div className="premium-impact-label">Jobs Influenced</div>
                    <div className="premium-impact-sub">Across portfolio companies</div>
                  </div>
                  <div className="premium-impact-item">
                    <div className="premium-impact-value">$28M+</div>
                    <div className="premium-impact-label">Capital Activated</div>
                    <div className="premium-impact-sub">Across investments & raises</div>
                  </div>
                  <div className="premium-impact-item">
                    <div className="premium-impact-value">3</div>
                    <div className="premium-impact-label">Communities Built</div>
                    <div className="premium-impact-sub">Founder communities</div>
                  </div>
                  <div className="premium-impact-item">
                    <div className="premium-impact-value">120+</div>
                    <div className="premium-impact-label">Knowledge Shared</div>
                    <div className="premium-impact-sub">Posts, threads, insights</div>
                  </div>
                </div>
                <div className="premium-golden-circle"></div>
              </div>
            </>
          )}

          {/* Catalyst Sections */}
          {activeProfileMode === 'CATALYST' && (
            <>
              <div className="premium-two-column-row">
                <div className="premium-card">
                  <div className="premium-card-header">
                    <span className="premium-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                      </svg>
                      Investment Profile
                    </span>
                    <button className="premium-card-edit-btn">Edit</button>
                  </div>
                  <div className="premium-investment-profile-content">
                    <div className="premium-profile-row">
                      <span className="premium-profile-label">Investment Range</span>
                      <span className="premium-profile-value">$500K - $15M</span>
                    </div>
                    <div className="premium-profile-row">
                      <span className="premium-profile-label">Investment Interests</span>
                      <span className="premium-profile-value">SaaS, AI/ML, FinTech, Web3, HealthTech</span>
                    </div>
                    <div className="premium-profile-row">
                      <span className="premium-profile-label">Preferred Startup Stages</span>
                      <span className="premium-profile-value">Seed, Series A, Series B</span>
                    </div>
                    <div className="premium-profile-row">
                      <span className="premium-profile-label">Geographic Focus</span>
                      <span className="premium-profile-value">North America, Europe, Asia</span>
                    </div>
                    <div className="premium-profile-row">
                      <span className="premium-profile-label">Investment Thesis</span>
                      <span className="premium-profile-value">Backing visionary founders building scalable solutions with massive global impact. Focus on innovation, team, and execution.</span>
                    </div>
                  </div>
                </div>

                <div className="premium-card">
                  <div className="premium-card-header">
                    <span className="premium-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                        <polyline points="12 6 12 4 12 6 12 8"></polyline>
                      </svg>
                      Capital & Portfolio Overview
                    </span>
                    <button className="premium-card-view-btn">View Portfolio →</button>
                  </div>
                  <div className="premium-portfolio-overview-grid">
                    <div className="premium-portfolio-stat">
                      <span className="premium-portfolio-stat-label">Capital Deployed</span>
                      <span className="premium-portfolio-stat-value">$42.8M</span>
                      <span className="premium-portfolio-stat-meta">Total Invested</span>
                    </div>
                    <div className="premium-portfolio-stat">
                      <span className="premium-portfolio-stat-label">Active Investments</span>
                      <span className="premium-portfolio-stat-value">23</span>
                      <span className="premium-portfolio-stat-meta">Portfolio Companies</span>
                    </div>
                    <div className="premium-portfolio-stat">
                      <span className="premium-portfolio-stat-label">Exits</span>
                      <span className="premium-portfolio-stat-value">7</span>
                      <span className="premium-portfolio-stat-meta">Successful Exits</span>
                    </div>
                    <div className="premium-portfolio-stat">
                      <span className="premium-portfolio-stat-label">ROI</span>
                      <span className="premium-portfolio-stat-value">3.7x</span>
                      <span className="premium-portfolio-stat-meta">Avg. Return</span>
                    </div>
                  </div>
                  <div className="premium-portfolio-charts">
                    <div className="premium-sector-bars">
                      <div className="premium-sector-title">Top Sectors</div>
                      <div className="premium-sector-bar">
                        <span>SaaS</span>
                        <div className="bar">
                          <div className="bar-fill" style={{width: '38%'}}></div>
                        </div>
                        <span>38%</span>
                      </div>
                      <div className="premium-sector-bar">
                        <span>AI / ML</span>
                        <div className="bar">
                          <div className="bar-fill" style={{width: '24%'}}></div>
                        </div>
                        <span>24%</span>
                      </div>
                      <div className="premium-sector-bar">
                        <span>FinTech</span>
                        <div className="bar">
                          <div className="bar-fill" style={{width: '18%'}}></div>
                        </div>
                        <span>18%</span>
                      </div>
                      <div className="premium-sector-bar">
                        <span>Web3</span>
                        <div className="bar">
                          <div className="bar-fill" style={{width: '12%'}}></div>
                        </div>
                        <span>12%</span>
                      </div>
                      <div className="premium-sector-bar">
                        <span>HealthTech</span>
                        <div className="bar">
                          <div className="bar-fill" style={{width: '8%'}}></div>
                        </div>
                        <span>8%</span>
                      </div>
                    </div>
                    <div className="premium-growth-chart">
                      <div className="premium-growth-title">Portfolio Growth</div>
                      <svg viewBox="0 0 200 120" className="growth-chart-svg">
                        <defs>
                          <linearGradient id="portfolioGrowthGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#00C896" stopOpacity="0.1"/>
                            <stop offset="100%" stopColor="#00C896" stopOpacity="0.5"/>
                          </linearGradient>
                        </defs>
                        <path d="M10,100 L30,90 L50,95 L70,70 L90,60 L110,65 L130,40 L150,45 L170,25 L190,20 L190,110 L10,110 Z" fill="url(#portfolioGrowthGrad)"/>
                        <polyline points="10,100 30,90 50,95 70,70 90,60 110,65 130,40 150,45 170,25 190,20" fill="none" stroke="#00C896" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div className="growth-chart-labels">
                        <span>2021</span>
                        <span>2022</span>
                        <span>2023</span>
                        <span>2024</span>
                        <span>2025</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="premium-two-column-row">
                <div className="premium-card">
                  <div className="premium-card-header">
                    <span className="premium-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      Areas of Expertise
                    </span>
                    <button className="premium-card-edit-btn">Edit</button>
                  </div>
                  <div className="premium-expertise-tags">
                    <span className="expertise-tag">Venture Capital</span>
                    <span className="expertise-tag">Strategic Growth</span>
                    <span className="expertise-tag">Fundraising</span>
                    <span className="expertise-tag">Product Scaling</span>
                    <span className="expertise-tag">Market Expansion</span>
                    <span className="expertise-tag">AI / ML</span>
                    <span className="expertise-tag">Web3</span>
                    <span className="expertise-tag">FinTech</span>
                  </div>
                </div>

                <div className="premium-card">
                  <div className="premium-card-header">
                    <span className="premium-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      Links & Presence
                    </span>
                    <button className="premium-card-edit-btn">Edit</button>
                  </div>
                  <div className="premium-links-list">
                    <div className="premium-link-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.602c0-1.341-.025-3.072-1.871-3.072-1.875 0-2.163 1.46-2.163 2.972v5.702h-3v-11h3v1.588c.438-.844 1.525-1.588 3.322-1.588 4.366 0 5.175 2.785 5.175 6.186v6.27z"/>
                      </svg>
                      <span className="link-name">LinkedIn</span>
                      <span className="link-url">linkedin.com/in/davidmorgan</span>
                    </div>
                    <div className="premium-link-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                      <span className="link-name">Website</span>
                      <span className="link-url">www.morganventures.com</span>
                    </div>
                    <div className="premium-link-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                      </svg>
                      <span className="link-name">Twitter / X</span>
                      <span className="link-url">@davidmorgan_vc</span>
                    </div>
                  </div>
                </div>

                <div className="premium-card">
                  <div className="premium-card-header">
                    <span className="premium-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      Mentorship & Community
                    </span>
                    <button className="premium-card-edit-btn">Edit</button>
                  </div>
                  <div className="premium-mentorship-content">
                    <div className="mentorship-toggle-row">
                      <span>Open to Mentorship</span>
                      <div className="toggle-switch on">
                        <div className="toggle-handle"></div>
                      </div>
                    </div>
                    <div className="mentorship-focus">
                      <span className="focus-label">Mentorship Focus</span>
                      <p className="focus-text">Helping early-stage founders with fundraising, product strategy, and go-to-market.</p>
                    </div>
                    <div className="mentorship-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="1.5">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="premium-two-column-row">
                <div className="premium-card">
                  <div className="premium-card-header">
                    <span className="premium-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      Portfolio Highlights
                    </span>
                    <button className="premium-card-view-btn">View All →</button>
                  </div>
                  <div className="premium-portfolio-carousel">
                    <div className="portfolio-startup-card">
                      <div className="startup-logo purple">
                        <svg viewBox="0 0 40 40">
                          <polygon points="20,5 35,35 5,35" fill="url(#purpleGrad)"/>
                          <defs><linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8B5CF6"/><stop offset="100%" stopColor="#6D28D9"/></linearGradient></defs>
                        </svg>
                      </div>
                      <div className="startup-name">NextGen AI</div>
                      <div className="startup-stage">Series A</div>
                      <div className="startup-categories">AI Platform</div>
                    </div>
                    <div className="portfolio-startup-card">
                      <div className="startup-logo gold">
                        <svg viewBox="0 0 40 40">
                          <path d="M10,30 Q20,10 30,30" fill="none" stroke="#FFD700" strokeWidth="4"/>
                          <circle cx="20" cy="25" r="6" fill="#FFD700"/>
                        </svg>
                      </div>
                      <div className="startup-name">FinFlow</div>
                      <div className="startup-stage">Series B</div>
                      <div className="startup-categories">FinTech</div>
                    </div>
                    <div className="portfolio-startup-card">
                      <div className="startup-logo blue">
                        <svg viewBox="0 0 40 40">
                          <circle cx="20" cy="20" r="15" fill="none" stroke="#3B82F6" strokeWidth="3"/>
                          <path d="M20,10 L20,15 M20,20 L20,25 M15,20 L20,20 M20,20 L25,20" stroke="#3B82F6" strokeWidth="3"/>
                        </svg>
                      </div>
                      <div className="startup-name">WebVerse</div>
                      <div className="startup-stage">Seed</div>
                      <div className="startup-categories">Web3</div>
                    </div>
                    <div className="portfolio-startup-card">
                      <div className="startup-logo green">
                        <svg viewBox="0 0 40 40">
                          <rect x="10" y="10" width="20" height="20" rx="2" fill="#00C896"/>
                          <path d="M15,20 L18,23 L25,16" stroke="white" strokeWidth="2" fill="none"/>
                        </svg>
                      </div>
                      <div className="startup-name">HealthPlus</div>
                      <div className="startup-stage">Series A</div>
                      <div className="startup-categories">HealthTech</div>
                    </div>
                  </div>
                  <div className="carousel-dots">
                    <span className="dot active"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>

                <div className="premium-card">
                  <div className="premium-card-header">
                    <span className="premium-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                      Recent Activity
                    </span>
                    <button className="premium-card-view-btn">View All →</button>
                  </div>
                  <div className="premium-activity-list">
                    <div className="activity-item">
                      <div className="activity-dot green"></div>
                      <div className="activity-content">
                        <div className="activity-text">Invested in NextGen AI</div>
                        <div className="activity-meta">Series A • $8.5M</div>
                      </div>
                      <div className="activity-time">2 days ago</div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-dot beige"></div>
                      <div className="activity-content">
                        <div className="activity-text">Joined as Mentor in AI Founders Hub</div>
                      </div>
                      <div className="activity-time">1 week ago</div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-dot gold"></div>
                      <div className="activity-content">
                        <div className="activity-text">Attended Web3 Summit 2025</div>
                      </div>
                      <div className="activity-time">2 weeks ago</div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-dot blue"></div>
                      <div className="activity-content">
                        <div className="activity-text">Reviewed 12 startup pitches</div>
                      </div>
                      <div className="activity-time">This Month</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="premium-bottom-metrics">
                <div className="bottom-metric">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span className="bottom-metric-value">48</span>
                  <span className="bottom-metric-label">Startups Backed</span>
                </div>
                <div className="bottom-metric">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                  <span className="bottom-metric-value">23</span>
                  <span className="bottom-metric-label">Active Portfolio</span>
                </div>
                <div className="bottom-metric">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span className="bottom-metric-value">7</span>
                  <span className="bottom-metric-label">Successful Exits</span>
                </div>
                <div className="bottom-metric">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  <span className="bottom-metric-value">$42.8M</span>
                  <span className="bottom-metric-label">Capital Deployed</span>
                </div>
                <div className="bottom-metric">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span className="bottom-metric-value">High</span>
                  <span className="bottom-metric-label">Ecosystem Impact</span>
                </div>
              </div>
            </>
          )}

          {/* Explorer Sections */}
          {activeProfileMode === 'EXPLORER' && (
            <>
              <div className="premium-two-column-row">
                <div className="premium-card">
                  <div className="premium-card-header">
                    <span className="premium-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      About Me
                    </span>
                    <button className="premium-card-edit-btn">Edit</button>
                  </div>
                  <div className="premium-about-content">
                    <p className="about-text">I love exploring new ideas, supporting amazing founders, and learning something new every day.</p>
                    <div className="about-row">
                      <span className="about-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="2" y1="12" x2="22" y2="12"></line>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                        Interests
                      </span>
                      <span className="about-value">AI, Web3, Sustainability, FinTech</span>
                    </div>
                    <div className="about-row">
                      <span className="about-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Skills
                      </span>
                      <span className="about-value">Community Support, Research, Feedback</span>
                    </div>
                    <div className="about-row">
                      <span className="about-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        Learning Goals
                      </span>
                      <span className="about-value">Understand Startups, Invest Wisely, Build Connections</span>
                    </div>
                  </div>
                </div>

                <div className="premium-card">
                  <div className="premium-card-header">
                    <span className="premium-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="5" r="3"></circle>
                        <circle cx="5" cy="19" r="3"></circle>
                        <circle cx="19" cy="19" r="3"></circle>
                        <line x1="12" y1="8" x2="5" y2="16"></line>
                        <line x1="12" y1="8" x2="19" y2="16"></line>
                      </svg>
                      Explorer Stats
                    </span>
                    <button className="premium-card-view-btn">View All</button>
                  </div>
                  <div className="premium-explorer-stats-grid">
                    <div className="explorer-stat-card">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      <div className="explorer-stat-value">12</div>
                      <div className="explorer-stat-label">Communities Joined</div>
                    </div>
                    <div className="explorer-stat-card">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <div className="explorer-stat-value">28</div>
                      <div className="explorer-stat-label">Discussions Participated</div>
                    </div>
                    <div className="explorer-stat-card">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                      </svg>
                      <div className="explorer-stat-value">34</div>
                      <div className="explorer-stat-label">Feedback Contributions</div>
                    </div>
                    <div className="explorer-stat-card">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                      </svg>
                      <div className="explorer-stat-value">18</div>
                      <div className="explorer-stat-label">Startups Saved</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="premium-two-column-row">
                <div className="premium-card">
                  <div className="premium-card-header">
                    <span className="premium-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      Top Interests
                    </span>
                    <button className="premium-card-edit-btn">Edit</button>
                  </div>
                  <div className="premium-interests-tags">
                    <span className="interest-tag">Artificial Intelligence</span>
                    <span className="interest-tag">Web3</span>
                    <span className="interest-tag">FinTech</span>
                    <span className="interest-tag">Sustainability</span>
                    <span className="interest-tag">HealthTech</span>
                  </div>
                </div>
                <div className="premium-card">
                  <div className="premium-card-header">
                    <span className="premium-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      Communities I'm Part Of
                    </span>
                    <button className="premium-card-view-btn">View All</button>
                  </div>
                  <div className="premium-communities-grid">
                    <div className="community-card">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5">
                        <circle cx="12" cy="5" r="3"></circle>
                        <path d="M12 22v-5"></path>
                        <path d="M8 7a4 4 0 1 0 8 0"></path>
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      <span>AI Innovators</span>
                    </div>
                    <div className="community-card">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.5">
                        <polygon points="12 2 2 7 12 12 22 7 12 2 2 17 12 12 22 17 12 22"></polygon>
                        <polyline points="2 12 12 2 22 12"></polyline>
                        <polyline points="12 22 12 12"></polyline>
                      </svg>
                      <span>Web3 Builders</span>
                    </div>
                    <div className="community-card">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5">
                        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                      </svg>
                      <span>Startup Supporters</span>
                    </div>
                    <div className="community-card">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="1.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                      </svg>
                      <span>Sustainability Leaders</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="premium-two-column-row">
                <div className="premium-card">
                  <div className="premium-card-header">
                    <span className="premium-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                      Recent Activity
                    </span>
                    <button className="premium-card-view-btn">View All</button>
                  </div>
                  <div className="premium-activity-list">
                    <div className="activity-item">
                      <div className="activity-dot blue"></div>
                      <div className="activity-content">
                        <div className="activity-text">Joined AI Innovators Community</div>
                      </div>
                      <div className="activity-time">2 days ago</div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-dot blue"></div>
                      <div className="activity-content">
                        <div className="activity-text">Gave feedback on 3 startups</div>
                      </div>
                      <div className="activity-time">3 days ago</div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-dot blue"></div>
                      <div className="activity-content">
                        <div className="activity-text">Participated in Web3 discussion</div>
                      </div>
                      <div className="activity-time">1 week ago</div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-dot blue"></div>
                      <div className="activity-content">
                        <div className="activity-text">Saved 2 new startups</div>
                      </div>
                      <div className="activity-time">1 week ago</div>
                    </div>
                  </div>
                </div>
                <div className="premium-card">
                  <div className="premium-card-header">
                    <span className="premium-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="5" r="3"></circle>
                        <circle cx="5" cy="19" r="3"></circle>
                        <circle cx="19" cy="19" r="3"></circle>
                        <line x1="12" y1="8" x2="5" y2="16"></line>
                        <line x1="12" y1="8" x2="19" y2="16"></line>
                      </svg>
                      My Network
                    </span>
                    <button className="premium-card-view-btn">View All</button>
                  </div>
                  <div className="premium-network-visual">
                    <svg viewBox="0 0 350 200" className="network-svg">
                      <defs>
                        <pattern id="gridPattern2" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(59,130,246,0.1)" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#gridPattern2)"/>
                      <circle cx="175" cy="100" r="15" fill="#3B82F6"/>
                      <circle cx="100" cy="60" r="12" fill="#60A5FA"/>
                      <circle cx="250" cy="60" r="12" fill="#60A5FA"/>
                      <circle cx="100" cy="140" r="12" fill="#60A5FA"/>
                      <circle cx="250" cy="140" r="12" fill="#60A5FA"/>
                      <circle cx="175" cy="50" r="10" fill="#93C5FD"/>
                      <circle cx="175" cy="150" r="10" fill="#93C5FD"/>
                      <line x1="175" y1="100" x2="100" y2="60" stroke="#3B82F6" strokeWidth="1.5"/>
                      <line x1="175" y1="100" x2="250" y2="60" stroke="#3B82F6" strokeWidth="1.5"/>
                      <line x1="175" y1="100" x2="100" y2="140" stroke="#3B82F6" strokeWidth="1.5"/>
                      <line x1="175" y1="100" x2="250" y2="140" stroke="#3B82F6" strokeWidth="1.5"/>
                      <line x1="175" y1="100" x2="175" y2="50" stroke="#3B82F6" strokeWidth="1.5"/>
                      <line x1="175" y1="100" x2="175" y2="150" stroke="#3B82F6" strokeWidth="1.5"/>
                    </svg>
                    <div className="network-subtitle">Connecting with explorers from 45+ countries</div>
                  </div>
                </div>
              </div>

              <div className="premium-bottom-metrics">
                <div className="bottom-metric">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span className="bottom-metric-value">12</span>
                  <span className="bottom-metric-label">Communities</span>
                </div>
                <div className="bottom-metric">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span className="bottom-metric-value">28</span>
                  <span className="bottom-metric-label">Discussions</span>
                </div>
                <div className="bottom-metric">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                  <span className="bottom-metric-value">34</span>
                  <span className="bottom-metric-label">Feedback</span>
                </div>
                <div className="bottom-metric">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                  </svg>
                  <span className="bottom-metric-value">18</span>
                  <span className="bottom-metric-label">Saved Startups</span>
                </div>
                <div className="bottom-metric">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="5" r="3"></circle>
                    <circle cx="5" cy="19" r="3"></circle>
                    <circle cx="19" cy="19" r="3"></circle>
                    <line x1="12" y1="8" x2="5" y2="16"></line>
                    <line x1="12" y1="8" x2="19" y2="16"></line>
                  </svg>
                  <span className="bottom-metric-value">156</span>
                  <span className="bottom-metric-label">Connections</span>
                </div>
                <div className="bottom-metric">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  <span className="bottom-metric-value">Global</span>
                  <span className="bottom-metric-label">Explorer</span>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePremium_Enhanced;
