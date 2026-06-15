import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { usePosts } from '../contexts/PostContext';
import PostMenu from './PostMenu';
import './ProfilePremium.css';
import './PremiumFeatures.css';
import './PostMenu.css';

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const DiscoverIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88" />
    <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
    <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
    <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
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
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const NetworkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3" />
    <circle cx="5" cy="19" r="3" />
    <circle cx="19" cy="19" r="3" />
    <line x1="12" y1="8" x2="5" y2="16" />
    <line x1="12" y1="8" x2="19" y2="16" />
  </svg>
);

const CommunityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const EventsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const EcosystemIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const OpportunitiesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const OSIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="m19 9 12 16 5 9" />
  </svg>
);

const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3 9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const BookmarkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

const SavedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-1.82.33 1.65 1.65 0 0 0-1.01 2.83v.06a2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.01-2.83v-.06a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.01-2.83v-.06a2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1.01 2.83z" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.602c0-1.341-.025-3.072-1.871-3.072-1.875 0-2.163 1.46-2.163 2.972v5.702h-3v-11h3v1.588c.438-.844 1.525-1.588 3.322-1.588 4.366 0 5.175 2.785 5.175 6.186v6.27z"/>
  </svg>
);

const ConnectIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MessageSmallIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

const DiamondIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 9l10 13 10-13-10-7z" fill="#8b5cf6"/>
  </svg>
);

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const VideoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const MoneyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const PresentationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="8" y2="17" />
    <line x1="16" y1="21" x2="16" y2="17" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const AddIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const CrownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ActivityIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ThumbsUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </svg>
);

const BrainIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.54" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.54" />
  </svg>
);

const Web3Icon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <line x1="2" y1="12" x2="22" y2="12" />
  </svg>
);

const RocketSmallIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const LeafIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
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
  links: {
    linkedin: string;
    website: string;
    twitter: string;
  };
}

const ROLE_DATA: Record<string, RoleData> = {
  ARCHITECT: {
    name: "Unnati Chaudhary",
    title: "Founder & CEO at Nexora AI",
    bio: "Building the intelligence layer for modern startups.",
    location: "Bangalore, India",
    badges: ["Founder", "Builder", "AI Enthusiast"],
    verificationColor: "#FFD700",
    primaryColor: "gold",
    score: 93,
    scoreTier: "Sovereign",
    links: {
      linkedin: "linkedin.com/in/arjunmalhotra",
      website: "www.nexora.ai",
      twitter: "@arjunmalhotra_ai"
    }
  },
  CATALYST: {
    name: "David Morgan",
    title: "Venture Capital Partner",
    bio: "Catalyzing the next generation of disruptive startups.",
    location: "San Francisco, California, USA",
    badges: ["CATALYST", "VERIFIED INVESTOR"],
    verificationColor: "#00C896",
    primaryColor: "green",
    score: 96,
    scoreTier: "Sovereign",
    links: {
      linkedin: "linkedin.com/in/davidmorgan",
      website: "www.morganventures.com",
      twitter: "@davidmorgan_vc"
    }
  },
  EXPLORER: {
    name: "Alex Explorer",
    title: "Curious. Connected. Growing Together.",
    bio: "Exploring ideas, supporting founders, and learning every day in the Triarcora ecosystem.",
    location: "Global Citizen",
    badges: ["EXPLORER"],
    verificationColor: "#3B82F6",
    primaryColor: "blue",
    score: 90,
    scoreTier: "Elite",
    links: {
      linkedin: "linkedin.com/in/alexplorer",
      website: "www.alexplorer.com",
      twitter: "@alexplorer_tv"
    }
  }
};

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
  links: {
    linkedin: string;
    website: string;
    twitter: string;
  };
}

interface Activity {
  id: string;
  title: string;
  description: string;
  year: string;
}

interface Asset {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  uploadTime: Date;
}

const DEMO_IMPACT_DATA = [
  {
    title: "Community Building",
    description: "Actively participating in startup communities, sharing knowledge, and helping founders navigate challenges.",
    icon: "community"
  },
  {
    title: "Mentorship & Guidance",
    description: "Providing mentorship to early-stage founders on product strategy, fundraising, and growth.",
    icon: "mentorship"
  },
  {
    title: "Feedback & Validation",
    description: "Offering constructive feedback to help startups refine their ideas and build better products.",
    icon: "feedback"
  }
];

const DEMO_ACTIVITIES: Activity[] = [
  {
    id: "1",
    title: "Launched MVP",
    description: "Successfully launched the minimum viable product and got first 100 users.",
    year: "2024"
  },
  {
    id: "2",
    title: "Raised Seed Funding",
    description: "Secured seed round investment from leading venture capital firms.",
    year: "2024"
  },
  {
    id: "3",
    title: "Joined Accelerator",
    description: "Accepted into a top-tier startup accelerator program.",
    year: "2023"
  }
];

const DEMO_ASSETS: Asset[] = [
  {
    id: "1",
    title: "Pitch Deck - Nexora AI",
    description: "Investor pitch deck for our AI-powered SaaS platform",
    fileUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31", // placeholder, we'll create a dummy PDF
    fileType: "PDF",
    uploadTime: new Date(2024, 4, 29)
  },
  {
    id: "2",
    title: "Product Demo Video",
    description: "Quick 2-minute product walkthrough",
    fileUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728",
    fileType: "Video",
    uploadTime: new Date(2024, 3, 15)
  },
  {
    id: "3",
    title: "Business Plan 2024",
    description: "Comprehensive business plan and roadmap",
    fileUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    fileType: "Docs",
    uploadTime: new Date(2024, 2, 1)
  }
];

const profileInterests = {
  ARCHITECT: ['SaaS', 'Product Design', 'Scaling', 'AI Tools', 'Growth'],
  EXPLORER: ['Artificial Intelligence', 'Web3', 'FinTech', 'Sustainability', 'HealthTech'],
  CATALYST: ['Deep Tech', 'Climate', 'Enterprise SaaS', 'BioTech', 'AI']
};

const getInterestFontSize = (count: number) => {
  if (count <= 3) return '1rem';
  if (count <= 5) return '0.9rem';
  if (count <= 7) return '0.8rem';
  return '0.75rem';
};

const ProfilePremium: React.FC = () => {
  const navigate = useNavigate();
  const { userData, loading, updateUserData, isDemo, uploadImage, deleteImage } = useUser();
  const { 
    posts, 
    drafts, 
    scheduledPosts, 
    pinnedPostIds, 
    getUserPosts, 
    getDraftsByUser, 
    getScheduledPosts, 
    getPinnedPosts, 
    getArchivedPosts,
    deletePost,
    editPost,
    pinPost,
    unpinPost,
    archivePost,
    unarchivePost
  } = usePosts();
  const [mainRole, setMainRole] = useState<string>(() => {
    const selectedRole = localStorage.getItem('selectedRole');
    return selectedRole ? selectedRole.toUpperCase() : 'ARCHITECT';
  });
  const [extraRole, setExtraRole] = useState<string | null>(() => {
    const savedExtraRole = localStorage.getItem('extraRole');
    return savedExtraRole ? savedExtraRole.toUpperCase() : null;
  });
  const [activeProfileMode, setActiveProfileMode] = useState<string>(userData?.mainRole || mainRole);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [addRoleModalOpen, setAddRoleModalOpen] = useState<boolean>(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState<boolean>(false);
  const [addActivityModalOpen, setAddActivityModalOpen] = useState<boolean>(false);
  const [uploadAssetModalOpen, setUploadAssetModalOpen] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    title: '',
    bio: '',
    location: '',
    profileImage: '',
    linkedin: '',
    website: '',
    twitter: ''
  });
  const [activityFormData, setActivityFormData] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear().toString()
  });
  const [assetFormData, setAssetFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    fileType: 'PDF'
  });
  // Load activities and assets from userData
  const [activities, setActivities] = useState<Activity[]>(() => {
    if (userData?.activities?.length) {
      return userData.activities;
    }
    return isDemo ? DEMO_ACTIVITIES : [];
  });
  const [assets, setAssets] = useState<Asset[]>(() => {
    if (userData?.assets?.length) {
      return userData.assets;
    }
    return isDemo ? DEMO_ASSETS : [];
  });

  // Debug: log all values
  console.log('ProfilePremium - activeProfileMode:', activeProfileMode);
  console.log('ProfilePremium - ROLE_DATA keys:', Object.keys(ROLE_DATA));
  console.log('ProfilePremium - ROLE_DATA[activeProfileMode]:', ROLE_DATA[activeProfileMode]);

  // Ensure safeActiveProfileMode is always a valid role
  const safeActiveProfileMode = (activeProfileMode && ROLE_DATA[activeProfileMode]) ? activeProfileMode : 'ARCHITECT';
  console.log('ProfilePremium - safeActiveProfileMode:', safeActiveProfileMode);
  
  // Ensure currentData is never undefined! (optimized with useMemo)
  const currentData = useMemo(() => {
    return ROLE_DATA[safeActiveProfileMode] || ROLE_DATA['ARCHITECT'];
  }, [safeActiveProfileMode]);
  console.log('ProfilePremium - currentData:', currentData);
  
  // Optimized displayProfile with useMemo
  const displayProfile = useMemo(() => {
    return {
      name: userData?.profile?.name || currentData.name,
      title: userData?.profile?.title || currentData.title,
      bio: userData?.profile?.bio || currentData.bio,
      location: userData?.profile?.location || currentData.location,
      profileImage: userData?.profile?.profileImage || '',
      linkedin: userData?.profile?.linkedin || currentData.links.linkedin,
      website: userData?.profile?.website || currentData.links.website,
      twitter: userData?.profile?.twitter || currentData.links.twitter
    };
  }, [userData, currentData]);
  
  const getActiveRoleProfile = () => {
    if (isDemo) {
      return {
        score: currentData.score,
        scoreTier: currentData.scoreTier,
        credibilityScore: 95,
        credibilityTier: 'Elite',
        executionScore: 92,
        executionTier: 'Elite',
        contributionScore: 88,
        contributionTier: 'Elite',
        ecosystemTrust: 94,
        ecosystemTrustLevel: 'High',
        founderPrestige: 90,
        founderPrestigeLevel: 'Global',
        reputationTrend: 5,
        startupsBuilt: 3,
        startupsBuiltDetail: '3 startups built',
        startupsBacked: 0,
        startupsBackedDetail: 'No backing yet',
        avgFeedbackScore: 4.8,
        feedbackCount: 47,
        successfulMatches: 12,
        successfulMatchesDetail: '12 successful matches'
      };
    }
    if (userData) {
      switch (safeActiveProfileMode) {
        case 'ARCHITECT':
          return userData.architectProfile || {};
        case 'CATALYST':
          return userData.catalystProfile || {};
        case 'EXPLORER':
          return userData.explorerProfile || {};
        default:
          return {};
      }
    }
    return {};
  };
  
  const activeRoleProfile = getActiveRoleProfile();
  
  const DEFAULT_PROFILE_IMAGE = 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=180&h=180&fit=crop&crop=face';

  // Initialize edit form when user data is available
  useEffect(() => {
    if (userData) {
      setEditFormData({
        name: userData?.profile?.name || currentData.name,
        title: userData?.profile?.title || currentData.title,
        bio: userData?.profile?.bio || currentData.bio,
        location: userData?.profile?.location || currentData.location,
        profileImage: userData?.profile?.profileImage || '',
        linkedin: userData?.profile?.linkedin || currentData.links.linkedin,
        website: userData?.profile?.website || currentData.links.website,
        twitter: userData?.profile?.twitter || currentData.links.twitter
      });
      // Sync activities and assets from userData
      if (userData.activities && userData.activities.length > 0) {
        setActivities(userData.activities);
      } else if (isDemo) {
        setActivities(DEMO_ACTIVITIES);
      }
      if (userData.assets && userData.assets.length > 0) {
        setAssets(userData.assets);
      } else if (isDemo) {
        setAssets(DEMO_ASSETS);
      }
    }
  }, [userData, currentData, isDemo]);

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error' | ''>('');

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage('');
      setToastType('');
    }, 4000);
  };

  // Get initials for default avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && userData) {
      // File validation
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showToast('Only JPG, JPEG, PNG, and WEBP files are allowed', 'error');
        return;
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        showToast('File size must be less than 5MB', 'error');
        return;
      }

      setUploadingImage(true);
      try {
        const downloadURL = await uploadImage(file, `profileImages/${userData.uid}/${Date.now()}-${file.name}`);
        setEditFormData(prev => ({
          ...prev,
          profileImage: downloadURL
        }));
        showToast('Profile image uploaded successfully!', 'success');
      } catch (error) {
        console.error('Error uploading image:', error);
        showToast('Failed to upload image. Please try again.', 'error');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const removeProfileImage = async () => {
    setEditFormData(prev => ({
      ...prev,
      profileImage: ''
    }));
    
    // If not demo, update user data immediately
    if (userData && !isDemo) {
      updateUserData({
        profile: {
          ...userData.profile,
          profileImage: ''
        }
      });
      showToast('Profile image removed successfully!', 'success');
    }
  };

  const handleLogout = () => {
    // Clear current user ID so we start fresh on next visit
    localStorage.removeItem('currentUserId');
    // Navigate to home or onboarding page
    window.location.href = '/';
  };

  const saveProfileChanges = async () => {
    if (userData) {
      if (!editFormData.name.trim() || !editFormData.title.trim()) {
        showToast('Name and Title are required!', 'error');
        return;
      }
      updateUserData({
        profile: {
          ...userData.profile,
          ...editFormData
        }
      });
      // Save name to localStorage
      localStorage.setItem('triarcora-name', editFormData.name);
      setEditProfileModalOpen(false);
      showToast('Profile updated successfully!', 'success');
    }
  };

  const openAddActivityModal = () => {
    setActivityFormData({
      title: '',
      description: '',
      year: new Date().getFullYear().toString()
    });
    setAddActivityModalOpen(true);
  };

  const handleActivityFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setActivityFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveActivity = () => {
    if (!activityFormData.title.trim() || !activityFormData.year.trim()) {
      alert('Activity Title and Year are required!');
      return;
    }
    const newActivity: Activity = {
      id: Date.now().toString(),
      ...activityFormData
    };
    const updatedActivities = [newActivity, ...activities];
    setActivities(updatedActivities);
    updateUserData({ activities: updatedActivities });
    setAddActivityModalOpen(false);
  };

  const deleteActivity = (id: string) => {
    const updatedActivities = activities.filter(a => a.id !== id);
    setActivities(updatedActivities);
    updateUserData({ activities: updatedActivities });
  };

  const openUploadAssetModal = () => {
    setAssetFormData({
      title: '',
      description: '',
      fileUrl: '',
      fileType: 'PDF'
    });
    setUploadAssetModalOpen(true);
  };

  const handleAssetFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAssetFormData(prev => ({ ...prev, [name]: value }));
  };

  const [currentUploadedFile, setCurrentUploadedFile] = useState<File | null>(null);
  const [uploadingAsset, setUploadingAsset] = useState<boolean>(false);
  const [activeMyContentTab, setActiveMyContentTab] = useState<string>('posts');
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);
  const [deleteConfirmPostId, setDeleteConfirmPostId] = useState<string | null>(null);

  const handleAssetFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && userData) {
      setCurrentUploadedFile(file);
      setUploadingAsset(true);
      try {
        // Auto-detect file type
        let detectedFileType = 'PDF';
        if (file.type.startsWith('image/')) {
          detectedFileType = 'Image';
        } else if (file.type.startsWith('video/')) {
          detectedFileType = 'Video';
        } else if (file.type.includes('pdf')) {
          detectedFileType = 'PDF';
        } else if (file.type.includes('presentation') || file.type.includes('powerpoint')) {
          detectedFileType = 'Deck';
        } else if (file.type.includes('document') || file.type.includes('word')) {
          detectedFileType = 'Docs';
        }

        const downloadURL = await uploadImage(file, `assets/${userData.uid}/${Date.now()}-${file.name}`);
        
        setAssetFormData(prev => ({
          ...prev,
          fileUrl: downloadURL,
          fileType: detectedFileType
        }));
      } catch (error) {
        console.error('Error uploading asset:', error);
        alert('Failed to upload asset');
      } finally {
        setUploadingAsset(false);
      }
    }
  };

  const saveAsset = () => {
    if (!assetFormData.title.trim()) {
      alert('Asset Title is required!');
      return;
    }
    const newAsset: Asset = {
      id: Date.now().toString(),
      ...assetFormData,
      uploadTime: new Date()
    };
    const updatedAssets = [newAsset, ...assets];
    setAssets(updatedAssets);
    updateUserData({ assets: updatedAssets });
    setUploadAssetModalOpen(false);
    setCurrentUploadedFile(null);
  };

  const deleteAsset = (id: string) => {
    const updatedAssets = assets.filter(a => a.id !== id);
    setAssets(updatedAssets);
    updateUserData({ assets: updatedAssets });
  };

  const downloadAsset = (asset: Asset) => {
    // Handle both data URLs (uploaded files) and regular URLs
    if (asset.fileUrl) {
      const link = document.createElement('a');
      link.href = asset.fileUrl;
      link.download = `${asset.title}.${getFileExtension(asset.fileType)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // If no real file, create a dummy text file
      const blob = new Blob([`${asset.title}\n\n${asset.description}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${asset.title}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const getFileExtension = (fileType: string): string => {
    const typeMap: Record<string, string> = {
      'PDF': 'pdf',
      'Video': 'mp4',
      'Deck': 'pptx',
      'Presentation': 'pptx',
      'Demo': 'mp4',
      'Docs': 'docx',
      'Image': 'png',
      'Text': 'txt'
    };
    return typeMap[fileType] || 'txt';
  };

  const viewAsset = (asset: Asset) => {
    if (asset.fileUrl) {
      // Open directly, even data URLs work in new tabs
      window.open(asset.fileUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('No file available for viewing');
    }
  };

  useEffect(() => {
    const selectedRole = localStorage.getItem('selectedRole');
    const newMainRole = selectedRole ? selectedRole.toUpperCase() : 'ARCHITECT';
    if (newMainRole !== mainRole) {
      setMainRole(newMainRole);
      setActiveProfileMode(newMainRole);
    }
    const savedExtraRole = localStorage.getItem('extraRole');
    if (savedExtraRole && savedExtraRole !== extraRole) {
      setExtraRole(savedExtraRole.toUpperCase());
    }
  }, []);

  useEffect(() => {
    if (extraRole) {
      localStorage.setItem('extraRole', extraRole);
    } else {
      localStorage.removeItem('extraRole');
    }
  }, [extraRole]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const openAddRoleModal = () => {
    setAddRoleModalOpen(true);
    setDropdownOpen(false);
  };

  const openSettings = () => {
    navigate('/settings');
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

  const deleteExtraRole = () => {
    setExtraRole(null);
    setActiveProfileMode(mainRole);
  };

  const openEditProfileModal = () => {
    // Populate edit form with current user data
    if (userData) {
      setEditFormData({
        name: userData.profile.name || currentData.name,
        title: userData.profile.title || currentData.title,
        bio: userData.profile.bio || currentData.bio,
        location: userData.profile.location || currentData.location,
        profileImage: userData.profile.profileImage || '',
        linkedin: userData.profile.linkedin || currentData.links.linkedin,
        website: userData.profile.website || currentData.links.website,
        twitter: userData.profile.twitter || currentData.links.twitter
      });
    }
    
    setEditProfileModalOpen(true);
    setDropdownOpen(false);
  };

  // Debug info
  console.log('ProfilePremium loading:', loading);
  console.log('ProfilePremium userData:', userData);

  // If loading, show loading screen
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#000814', color: 'white', fontSize: '24px' }}>
        <div>LOADING...</div>
        <div className="auth-loader-spinner"></div>
        <h1 className="auth-loader-title">TRIARCORA</h1>
        <p className="auth-loader-text">Loading your profile...</p>
      </div>
    );
  }

  // Premium Fallback UI if userData is null
  if (!userData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#000814', color: 'white' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(0, 200, 153, 0.1))',
          borderRadius: '24px', 
          padding: '48px', 
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
        }}>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 700, 
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #FFD700, #00C896)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            TRIVENTA Profile
          </div>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>
            Loading your sovereign digital reputation ledger...
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: '#FFD700', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }}></div>
            <div style={{ width: '10px', height: '10px', backgroundColor: '#00C896', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }}></div>
            <div style={{ width: '10px', height: '10px', backgroundColor: '#3B82F6', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
          </div>
        </div>
        <style>{`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`profile-premium-container role-${safeActiveProfileMode.toLowerCase()}`}>
      <aside className="premium-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">TRIARCORA</div>
        </div>

        <nav className="premium-sidebar-nav">
          <div className="premium-nav-item" onClick={() => navigate('/home')}>
            <HomeIcon />
            <span>Home</span>
          </div>
          <div className="premium-nav-item">
            <RocketIcon />
            <span>Architects</span>
          </div>
          <div className="premium-nav-item">
            <UsersIcon />
            <span>Catalysts</span>
          </div>
          {safeActiveProfileMode === 'CATALYST' || safeActiveProfileMode === 'EXPLORER' ? (
            <div className="premium-nav-item">
              <CommunityIcon />
              <span>Community</span>
            </div>
          ) : null}
          {safeActiveProfileMode === 'CATALYST' || safeActiveProfileMode === 'EXPLORER' ? (
            <div className="premium-nav-item">
              <EventsIcon />
              <span>Events</span>
            </div>
          ) : null}
          {safeActiveProfileMode === 'CATALYST' || safeActiveProfileMode === 'EXPLORER' ? (
            <div className="premium-nav-item">
              <EcosystemIcon />
              <span>Ecosystem</span>
            </div>
          ) : null}
          <div className="premium-nav-item">
            <MessageIcon />
            <span>Inbox</span>
            {safeActiveProfileMode === 'ARCHITECT' && <span className="nav-badge">9</span>}
          </div>
          {safeActiveProfileMode === 'CATALYST' || safeActiveProfileMode === 'EXPLORER' ? (
            <div className="premium-nav-item">
              <BellIcon />
              <span>Notifications</span>
            </div>
          ) : null}
          <div className="premium-nav-item" onClick={() => navigate('/bookmarks')}>
            <BookmarkIcon />
            <span>Vault</span>
          </div>
          <div className="premium-nav-item active">
            <ProfileIcon />
            <span>Profile</span>
          </div>
        </nav>

        {safeActiveProfileMode === 'CATALYST' || safeActiveProfileMode === 'EXPLORER' ? (
          <div className="premium-sidebar-upgrade-card">
            <CrownIcon className="upgrade-icon" />
            <h3>Triarcora Premium</h3>
            <p>Unlock exclusive ecosystem benefits and premium access.</p>
            <button className="premium-upgrade-btn">Upgrade Now</button>
          </div>
        ) : null}

        <div className="premium-sidebar-bottom">
          <div className="premium-nav-item" onClick={() => navigate('/settings')}>
            <SettingsIcon />
            <span>Settings</span>
          </div>
          <div className="premium-nav-item" onClick={handleLogout}>
            <LogoutIcon />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      <main className="premium-main-content">
        <div className="premium-profile-content">
          <div className="premium-profile-header-section">
            <div className="premium-profile-main">
              <div className="premium-profile-image-wrapper">
                <div className="premium-profile-image-ring">
                  {displayProfile.profileImage ? (
                    <img 
                      src={displayProfile.profileImage}
                      alt={displayProfile.name || 'Your Profile'}
                      className="premium-profile-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="premium-default-avatar">
                      <span className="premium-avatar-initials">{getInitials(displayProfile.name || 'User')}</span>
                    </div>
                  )}
                  <div className="premium-verification-badge">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 0C5.37 0 0 5.37 0 12C0 18.63 5.37 24 12 24C18.63 24 24 18.63 24 12C24 5.37 18.63 0 12 0ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill={currentData.verificationColor}/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="premium-profile-info">
                <div className="premium-profile-badges-top">
                  <span className={`premium-hero-badge ${currentData.primaryColor}`}>{safeActiveProfileMode}</span>
                </div>
                <div className="premium-profile-name-row">
                  <h1 className="premium-profile-name">
                    {displayProfile.name || <span className="empty-placeholder">Add your name</span>}
                  </h1>
                </div>
                <p className="premium-profile-title">
                  {displayProfile.title || <span className="empty-placeholder">Add your title</span>}
                </p>
                <p className="premium-profile-bio">
                  {displayProfile.bio || <span className="empty-placeholder">Write a short bio about yourself</span>}
                </p>
                <div className="premium-profile-meta">
                  <span className="premium-profile-location">
                    <LocationIcon />
                    {displayProfile.location || <span className="empty-placeholder">Add your location</span>}
                  </span>
                </div>
                {extraRole && (
                  <div className="premium-profile-badges">
                    <span className="premium-badge purple">{extraRole}</span>
                  </div>
                )}
              </div>
            </div>

            {safeActiveProfileMode === 'ARCHITECT' ? (
              <div className="premium-profile-actions">
                <button className="premium-action-btn edit" onClick={openEditProfileModal}>
                  <EditIcon />
                  Edit Profile
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
                            <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          <span>{safeActiveProfileMode === mainRole ? 'See Another Profile' : 'Back to Main Profile'}</span>
                        </div>
                      )}
                      <div className="premium-dropdown-item" onClick={() => { setDropdownOpen(false); setSettingsModalOpen(true); }}>
                        <SettingsIcon />
                        <span>Settings</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="premium-profile-actions">
                <button className="premium-action-btn edit" onClick={openEditProfileModal}>
                  <EditIcon />
                  Edit Profile
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
                            <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          <span>{safeActiveProfileMode === mainRole ? 'See Another Profile' : 'Back to Main Profile'}</span>
                        </div>
                      )}
                      <div className="premium-dropdown-item" onClick={() => { setDropdownOpen(false); setSettingsModalOpen(true); }}>
                        <SettingsIcon />
                        <span>Settings</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {safeActiveProfileMode === 'ARCHITECT' && (
              <div className="premium-triarcora-score">
                <div className="premium-score-header">
                  <span className="premium-score-label">TRIARCORA Score</span>
                  <InfoIcon />
                </div>
                <div className="premium-score-value">
                  {activeRoleProfile.score || 0}
                </div>
                <div className="premium-score-tier">
                  <span>{activeRoleProfile.scoreTier || 'Beginner'}</span>
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
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
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

          {/* Settings Modal */}
          {settingsModalOpen && (
            <div className="premium-modal-overlay" onClick={() => setSettingsModalOpen(false)}>
              <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
                <div className="premium-modal-header">
                  <h3>Profile Settings</h3>
                  <button onClick={() => setSettingsModalOpen(false)} className="premium-modal-close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className="premium-modal-content">
                  <h4 className="premium-settings-section-title">Role Management</h4>
                  
                  <div className="premium-settings-role-item">
                    <div className="premium-settings-role-info">
                      <span className="premium-settings-role-label">Main Role</span>
                      <span className="premium-settings-role-value">{mainRole}</span>
                    </div>
                    <span className="premium-settings-role-badge main">Cannot be changed</span>
                  </div>

                  {extraRole && (
                    <div className="premium-settings-role-item">
                      <div className="premium-settings-role-info">
                        <span className="premium-settings-role-label">Extra Role</span>
                        <span className="premium-settings-role-value">{extraRole}</span>
                      </div>
                      <button 
                        className="premium-delete-role-btn"
                        onClick={deleteExtraRole}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete
                      </button>
                    </div>
                  )}

                  {!extraRole && (
                    <div className="premium-settings-role-item">
                      <div className="premium-settings-role-info">
                        <span className="premium-settings-role-label">Extra Role</span>
                        <span className="premium-settings-role-value none">Not added yet</span>
                      </div>
                      <button 
                        className="premium-add-role-btn"
                        onClick={() => {
                          setSettingsModalOpen(false);
                          setAddRoleModalOpen(true);
                        }}
                      >
                        <AddIcon />
                        Add Role
                      </button>
                    </div>
                  )}
                  
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(150,150,170,0.2)' }}>
                    <button 
                      className="premium-delete-role-btn"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => {
                        setSettingsModalOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogoutIcon />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Profile Modal */}
          {editProfileModalOpen && (
            <div className="premium-modal-overlay" onClick={() => setEditProfileModalOpen(false)}>
              <div className="premium-modal large" onClick={(e) => e.stopPropagation()}>
                <div className="premium-modal-header">
                  <h3>Edit Profile</h3>
                  <button onClick={() => setEditProfileModalOpen(false)} className="premium-modal-close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className="premium-modal-content">
                  <div className="edit-profile-form">
                    {/* Profile Photo Upload */}
                    <div className="form-group">
                      <label className="form-label">Profile Photo</label>
                      <div className="profile-photo-upload">
                        {editFormData.profileImage ? (
                          <div className="profile-photo-preview">
                            <img src={editFormData.profileImage} alt="Profile Preview" />
                            <button 
                              type="button" 
                              className="remove-photo-btn"
                              onClick={removeProfileImage}
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label className="upload-photo-label">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                              <circle cx="12" cy="13" r="4" />
                            </svg>
                            <span className="upload-text">Upload Profile Photo</span>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleImageUpload}
                              style={{ display: 'none' }}
                            />
                          </label>
                        )}
                        <p style={{ fontSize: '0.8rem', color: 'rgba(150,150,170,0.8)', marginTop: '0.5rem' }}>
                          Recommended: 512x512px, JPG/PNG, max 2MB for HD quality
                        </p>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Name <span style={{ color: '#ef4444' }}>*</span></label>
                      <input 
                        type="text" 
                        name="name" 
                        className="form-input" 
                        value={editFormData.name}
                        onChange={handleEditFormChange}
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Title <span style={{ color: '#ef4444' }}>*</span></label>
                      <input 
                        type="text" 
                        name="title" 
                        className="form-input" 
                        value={editFormData.title}
                        onChange={handleEditFormChange}
                        placeholder="Enter your title"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Bio</label>
                      <textarea 
                        name="bio" 
                        className="form-textarea" 
                        value={editFormData.bio}
                        onChange={handleEditFormChange}
                        placeholder="Write a short bio about yourself"
                        rows={4}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input 
                        type="text" 
                        name="location" 
                        className="form-input" 
                        value={editFormData.location}
                        onChange={handleEditFormChange}
                        placeholder="Enter your location"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">LinkedIn</label>
                      <input 
                        type="text" 
                        name="linkedin" 
                        className="form-input" 
                        value={editFormData.linkedin}
                        onChange={handleEditFormChange}
                        placeholder="linkedin.com/in/yourprofile"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Website</label>
                      <input 
                        type="text" 
                        name="website" 
                        className="form-input" 
                        value={editFormData.website}
                        onChange={handleEditFormChange}
                        placeholder="www.yourwebsite.com"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Twitter / X</label>
                      <input 
                        type="text" 
                        name="twitter" 
                        className="form-input" 
                        value={editFormData.twitter}
                        onChange={handleEditFormChange}
                        placeholder="@yourhandle"
                      />
                    </div>

                    <div className="form-actions">
                      <button 
                        className="form-btn cancel"
                        onClick={() => setEditProfileModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="form-btn save"
                        onClick={saveProfileChanges}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Activity Modal */}
          {addActivityModalOpen && (
            <div className="premium-modal-overlay" onClick={() => setAddActivityModalOpen(false)}>
              <div className="premium-modal large" onClick={(e) => e.stopPropagation()}>
                <div className="premium-modal-header">
                  <h3>Add Activity</h3>
                  <button onClick={() => setAddActivityModalOpen(false)} className="premium-modal-close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className="premium-modal-content">
                  <div className="edit-profile-form">
                    <div className="form-group">
                      <label className="form-label">Activity Title <span style={{ color: '#ef4444' }}>*</span></label>
                      <input 
                        type="text" 
                        name="title" 
                        className="form-input" 
                        value={activityFormData.title}
                        onChange={handleActivityFormChange}
                        placeholder="e.g. Launched MVP, Raised Funding..."
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Short Description</label>
                      <textarea 
                        name="description" 
                        className="form-textarea" 
                        value={activityFormData.description}
                        onChange={handleActivityFormChange}
                        placeholder="Explain briefly..."
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Year <span style={{ color: '#ef4444' }}>*</span></label>
                      <input 
                        type="number" 
                        name="year" 
                        className="form-input" 
                        value={activityFormData.year}
                        onChange={handleActivityFormChange}
                        placeholder="e.g. 2024"
                        min="2000"
                        max={new Date().getFullYear() + 5}
                        required
                      />
                    </div>

                    <div className="form-actions">
                      <button 
                        className="form-btn cancel"
                        onClick={() => setAddActivityModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="form-btn save"
                        onClick={saveActivity}
                      >
                        Add Activity
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Asset Modal */}
          {uploadAssetModalOpen && (
            <div className="premium-modal-overlay" onClick={() => setUploadAssetModalOpen(false)}>
              <div className="premium-modal large" onClick={(e) => e.stopPropagation()}>
                <div className="premium-modal-header">
                  <h3>Upload Asset</h3>
                  <button onClick={() => setUploadAssetModalOpen(false)} className="premium-modal-close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className="premium-modal-content">
                  <div className="edit-profile-form">
                    <div className="form-group">
                      <label className="form-label">Asset Title <span style={{ color: '#ef4444' }}>*</span></label>
                      <input 
                        type="text" 
                        name="title" 
                        className="form-input" 
                        value={assetFormData.title}
                        onChange={handleAssetFormChange}
                        placeholder="e.g. Pitch Deck, Demo Video..."
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Short Description</label>
                      <textarea 
                        name="description" 
                        className="form-textarea" 
                        value={assetFormData.description}
                        onChange={handleAssetFormChange}
                        placeholder="Write a few lines so people understand what this file/project/idea is about"
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Asset Type</label>
                      <select 
                        name="fileType" 
                        className="form-input" 
                        value={assetFormData.fileType}
                        onChange={handleAssetFormChange}
                      >
                        <option value="PDF">PDF</option>
                        <option value="Video">Video</option>
                        <option value="Deck">Deck</option>
                        <option value="Presentation">Presentation</option>
                        <option value="Demo">Demo</option>
                        <option value="Docs">Docs</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Upload File</label>
                      <div className="profile-photo-upload">
                        {assetFormData.fileUrl ? (
                          <div className="profile-photo-preview">
                            <div className="uploaded-file-info">
                              <FileIcon />
                              <span>File selected</span>
                            </div>
                            <button 
                              type="button" 
                              className="remove-photo-btn"
                              onClick={() => setAssetFormData(prev => ({ ...prev, fileUrl: '' }))}
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label className="upload-photo-label">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            <span className="upload-text">Upload File</span>
                            <input 
                              type="file" 
                              accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mov,.avi"
                              onChange={handleAssetFileUpload}
                              style={{ display: 'none' }}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="form-actions">
                      <button 
                        className="form-btn cancel"
                        onClick={() => setUploadAssetModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="form-btn save"
                        onClick={saveAsset}
                      >
                        Upload Asset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Top Stats Strip for Catalyst/Explorer */}
          {(safeActiveProfileMode === 'CATALYST' || safeActiveProfileMode === 'EXPLORER') && (
            <div className="premium-top-stats-strip">
              <div className="premium-top-stat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{stroke: 'var(--role-primary)'}} strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="premium-top-stat-label">Member Since</span>
                <span className="premium-top-stat-value">{safeActiveProfileMode === 'CATALYST' ? 'Jan 2022' : 'May 2024'}</span>
              </div>
              <div className="premium-top-stat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{stroke: 'var(--role-primary)'}} strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="premium-top-stat-label">{safeActiveProfileMode === 'CATALYST' ? 'Total Investments' : 'Communities Joined'}</span>
                <span className="premium-top-stat-value">{safeActiveProfileMode === 'CATALYST' ? '48' : '12'}</span>
              </div>
              <div className="premium-top-stat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{stroke: 'var(--role-primary)'}} strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="premium-top-stat-label">{safeActiveProfileMode === 'CATALYST' ? 'Portfolio Companies' : 'Discussions'}</span>
                <span className="premium-top-stat-value">{safeActiveProfileMode === 'CATALYST' ? '23' : '28'}</span>
              </div>
              <div className="premium-top-stat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{stroke: 'var(--role-primary)'}} strokeWidth="2">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                <span className="premium-top-stat-label">{safeActiveProfileMode === 'CATALYST' ? 'Ecosystem Impact' : 'Feedback Given'}</span>
                <span className="premium-top-stat-value">{safeActiveProfileMode === 'CATALYST' ? 'High' : '34'}</span>
              </div>
              <div className="premium-top-stat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{stroke: 'var(--role-primary)'}} strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span className="premium-top-stat-label">{safeActiveProfileMode === 'CATALYST' ? 'Trust Score' : 'Connections'}</span>
                <span className="premium-top-stat-value">{safeActiveProfileMode === 'CATALYST' ? '98%' : '156'}</span>
              </div>
              <div className="premium-top-stat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{stroke: 'var(--role-primary)'}} strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span className="premium-top-stat-label">Saved Startups</span>
                <span className="premium-top-stat-value">{safeActiveProfileMode === 'CATALYST' ? '12' : '18'}</span>
              </div>
            </div>
          )}

          {/* Navigation Tabs for Catalyst/Explorer */}
          {(safeActiveProfileMode === 'CATALYST' || safeActiveProfileMode === 'EXPLORER') && (
            <div className="premium-nav-tabs">
              <button className="premium-nav-tab active">Overview</button>
              <button className="premium-nav-tab">{safeActiveProfileMode === 'CATALYST' ? 'Portfolio' : 'Activity'}</button>
              <button className="premium-nav-tab">{safeActiveProfileMode === 'CATALYST' ? 'Activity' : 'Communities'}</button>
              <button className="premium-nav-tab">{safeActiveProfileMode === 'CATALYST' ? 'Network' : 'Saved Startups'}</button>
              {safeActiveProfileMode === 'CATALYST' && <button className="premium-nav-tab">Deals</button>}
              <button className="premium-nav-tab">{safeActiveProfileMode === 'CATALYST' ? 'Insights' : 'Discussions'}</button>
              {safeActiveProfileMode === 'EXPLORER' && <button className="premium-nav-tab">Learning</button>}
            </div>
          )}

          {/* Architect Sections */}
          {safeActiveProfileMode === 'ARCHITECT' && (
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
                        <circle className="progress-ring-circle-bg" cx="40" cy="40" r="34" />
                        <circle className="progress-ring-circle gold" cx="40" cy="40" r="34" style={{ strokeDashoffset: (213.5 - (213.5 * (activeRoleProfile.credibilityScore || 0) / 100)) }} />
                      </svg>
                      <span className="premium-progress-value">{activeRoleProfile.credibilityScore || 0}</span>
                    </div>
                    <span className="premium-credibility-card-label">Credibility Score</span>
                    <span className="premium-credibility-card-tier gold">{activeRoleProfile.credibilityTier || 'Starter'}</span>
                  </div>

                  <div className="premium-credibility-card purple">
                    <div className="premium-circular-progress purple">
                      <svg className="progress-ring" width="80" height="80">
                        <circle className="progress-ring-circle-bg" cx="40" cy="40" r="34" />
                        <circle className="progress-ring-circle purple" cx="40" cy="40" r="34" style={{ strokeDashoffset: (213.5 - (213.5 * (activeRoleProfile.executionScore || 0) / 100)) }} />
                      </svg>
                      <span className="premium-progress-value">{activeRoleProfile.executionScore || 0}</span>
                    </div>
                    <span className="premium-credibility-card-label">Execution Score</span>
                    <span className="premium-credibility-card-tier purple">{activeRoleProfile.executionTier || 'Starter'}</span>
                  </div>

                  <div className="premium-credibility-card blue">
                    <div className="premium-circular-progress blue">
                      <svg className="progress-ring" width="80" height="80">
                        <circle className="progress-ring-circle-bg" cx="40" cy="40" r="34" />
                        <circle className="progress-ring-circle blue" cx="40" cy="40" r="34" style={{ strokeDashoffset: (213.5 - (213.5 * (activeRoleProfile.contributionScore || 0) / 100)) }} />
                      </svg>
                      <span className="premium-progress-value">{activeRoleProfile.contributionScore || 0}</span>
                    </div>
                    <span className="premium-credibility-card-label">Contribution Score</span>
                    <span className="premium-credibility-card-tier blue">{activeRoleProfile.contributionTier || 'Starter'}</span>
                  </div>

                  <div className="premium-credibility-card green">
                    <div className="premium-circular-progress green">
                      <svg className="progress-ring" width="80" height="80">
                        <circle className="progress-ring-circle-bg" cx="40" cy="40" r="34" />
                        <circle className="progress-ring-circle green" cx="40" cy="40" r="34" style={{ strokeDashoffset: (213.5 - (213.5 * (activeRoleProfile.ecosystemTrust || 0) / 100)) }} />
                      </svg>
                      <span className="premium-progress-value">{activeRoleProfile.ecosystemTrust || 0}%</span>
                    </div>
                    <span className="premium-credibility-card-label">Ecosystem Trust</span>
                    <span className="premium-credibility-card-tier green">{activeRoleProfile.ecosystemTrustLevel || 'Building'}</span>
                  </div>

                  <div className="premium-credibility-card orange">
                    <div className="premium-circular-progress orange">
                      <svg className="progress-ring" width="80" height="80">
                        <circle className="progress-ring-circle-bg" cx="40" cy="40" r="34" />
                        <circle className="progress-ring-circle orange" cx="40" cy="40" r="34" style={{ strokeDashoffset: (213.5 - (213.5 * (activeRoleProfile.founderPrestige || 0) / 100)) }} />
                      </svg>
                      <span className="premium-progress-value">Top {activeRoleProfile.founderPrestige || 0}%</span>
                    </div>
                    <span className="premium-credibility-card-label">Founder Prestige</span>
                    <span className="premium-credibility-card-tier orange">{activeRoleProfile.founderPrestigeLevel || 'Local'}</span>
                  </div>

                  <div className="premium-credibility-card chart">
                    <div className="premium-mini-chart">
                      <svg width="100" height="60" viewBox="0 0 100 60">
                        <polyline 
                          points="10,50 25,50 40,50 55,50 70,50 85,50 95,50"
                          fill="none"
                          stroke="#FFD700"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="95" cy="50" r="4" fill="#FFD700" />
                      </svg>
                      <div className="premium-chart-value">{activeRoleProfile.reputationTrend || 0}%</div>
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
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    </svg>
                  </div>
                  <div className="premium-stat-info">
                    <div className="premium-stat-label">Startups Built</div>
                    <div className="premium-stat-value">{activeRoleProfile.startupsBuilt || 0}</div>
                    <div className="premium-stat-meta">{activeRoleProfile.startupsBuiltDetail || 'No startups yet'}</div>
                  </div>
                </div>

                <div className="premium-stat-card">
                  <div className="premium-stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="premium-stat-info">
                    <div className="premium-stat-label">Startups Backed</div>
                    <div className="premium-stat-value">{activeRoleProfile.startupsBacked || 0}</div>
                    <div className="premium-stat-meta">{activeRoleProfile.startupsBackedDetail || 'No backing yet'}</div>
                  </div>
                </div>

                <div className="premium-stat-card">
                  <div className="premium-stat-icon">
                    <StarIcon />
                  </div>
                  <div className="premium-stat-info">
                    <div className="premium-stat-label">Avg Feedback Score Given</div>
                    <div className="premium-stat-value">{activeRoleProfile.avgFeedbackScore || 0}<span className="premium-stat-decimal">/5.0</span></div>
                    <div className="premium-stat-meta">Across {activeRoleProfile.feedbackCount || 0} feedbacks</div>
                  </div>
                </div>

                <div className="premium-stat-card">
                  <div className="premium-stat-icon">
                    <NetworkIcon />
                  </div>
                  <div className="premium-stat-info">
                    <div className="premium-stat-label">Successful Matches</div>
                    <div className="premium-stat-value">{activeRoleProfile.successfulMatches || 0}</div>
                    <div className="premium-stat-meta">{activeRoleProfile.successfulMatchesDetail || 'No matches yet'}</div>
                  </div>
                </div>
              </div>

              <div className="premium-two-column">
                <div className="premium-left-column">
                  <div className="premium-timeline-section">
                    <div className="premium-section-header">
                      <h3 className="premium-section-title">ACTIVITY TIMELINE</h3>
                      <button className="premium-section-add-btn" onClick={openAddActivityModal}>
                        <AddIcon />
                      </button>
                    </div>
                    
                    {activities.length > 0 ? (
                      <div className="premium-timeline">
                        {activities.map((activity, index) => (
                          <div key={activity.id} className="premium-timeline-item" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="premium-timeline-marker"></div>
                            <div className="premium-timeline-content">
                              <div className="premium-timeline-header">
                                <div className="premium-timeline-year">{activity.year}</div>
                                <div className="premium-timeline-actions">
                                  <button className="premium-timeline-action-btn" onClick={() => deleteActivity(activity.id)}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <polyline points="3 6 5 6 21 6"></polyline>
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <h4 className="premium-timeline-title">{activity.title}</h4>
                              <p className="premium-timeline-description">{activity.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="premium-empty-state">
                        <div className="premium-empty-state-content">
                          <div className="premium-empty-state-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(150,150,170,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
                            </svg>
                          </div>
                          <p className="premium-empty-state-text">No startup activity yet</p>
                          <button className="premium-empty-state-btn" onClick={openAddActivityModal}>
                            <AddIcon />
                            Add Activity
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="premium-right-column">
                  <div className="premium-assets-section">
                    <div className="premium-section-header">
                      <h3 className="premium-section-title">LINKED ASSETS</h3>
                      <button className="premium-section-add-btn" onClick={openUploadAssetModal}>
                        <AddIcon />
                      </button>
                    </div>
                    
                    {assets.length > 0 ? (
                      <div className="premium-assets-grid">
                        {assets.map((asset, index) => (
                          <div key={asset.id} className="premium-asset-card" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="premium-asset-icon">
                              {asset.fileType === 'PDF' && <FileIcon />}
                              {asset.fileType === 'Video' && <VideoIcon />}
                              {asset.fileType === 'Deck' && <PresentationIcon />}
                              {asset.fileType === 'Presentation' && <PresentationIcon />}
                              {asset.fileType === 'Demo' && <RocketIcon />}
                              {asset.fileType === 'Docs' && <DocumentIcon />}
                              {asset.fileType === 'Image' && (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                  <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                              )}
                            </div>
                            <div className="premium-asset-info">
                              <h4 className="premium-asset-title">{asset.title}</h4>
                              <p className="premium-asset-description">{asset.description}</p>
                              <div className="premium-asset-meta">
                                <span className="premium-asset-type">{asset.fileType}</span>
                                <span className="premium-asset-time">{asset.uploadTime.toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="premium-asset-actions">
                              <button className="premium-asset-action-btn" onClick={() => viewAsset(asset)} title="View">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                              </button>
                              <button className="premium-asset-action-btn" onClick={() => downloadAsset(asset)} title="Download">
                                <DownloadIcon />
                              </button>
                              <button className="premium-asset-action-btn" onClick={() => deleteAsset(asset.id)} title="Delete">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="premium-empty-state">
                        <div className="premium-empty-state-content">
                          <div className="premium-empty-state-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(150,150,170,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                              <polyline points="13 2 13 9 20 9"></polyline>
                            </svg>
                          </div>
                          <p className="premium-empty-state-text">No assets uploaded yet</p>
                          <button className="premium-empty-state-btn" onClick={openUploadAssetModal}>
                            <AddIcon />
                            Upload Pitch Deck
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="premium-impact-section">
                <h3 className="premium-section-title">ECOSYSTEM IMPACT</h3>
                {isDemo ? (
                  <div className="premium-impact-grid">
                    {DEMO_IMPACT_DATA.map((item, index) => (
                      <div key={index} className="premium-impact-card" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="premium-impact-icon">
                          {item.icon === 'community' && <CommunityIcon />}
                          {item.icon === 'mentorship' && <UsersIcon />}
                          {item.icon === 'feedback' && <MessageSmallIcon />}
                        </div>
                        <h4 className="premium-impact-title">{item.title}</h4>
                        <p className="premium-impact-description">{item.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="premium-empty-state">
                    <div className="premium-empty-state-content">
                      <div className="premium-empty-state-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(150,150,170,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <p className="premium-empty-state-text">Your ecosystem impact will appear here</p>
                    </div>
                  </div>
                )}
                <div className="premium-golden-circle"></div>
              </div>
            </>
          )}

          {/* Catalyst Sections */}
          {safeActiveProfileMode === 'CATALYST' && (
            <>
              <div className="premium-two-column-row">
                <div className="premium-card">
                  <div className="premium-card-header">
                    <span className="premium-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
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
                        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                        <polyline points="12 6 12 4 12 6 12 8" />
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
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      Areas of Expertise
                    </span>
                    <button className="premium-card-edit-btn">Edit</button>
                  </div>
                  <div className="premium-expertise-tags">
                    {profileInterests[safeActiveProfileMode as keyof typeof profileInterests].map((interest, index) => (
                      <span
                        key={index}
                        className="expertise-tag"
                        style={{
                          fontSize: getInterestFontSize(
                            profileInterests[safeActiveProfileMode as keyof typeof profileInterests].length
                          ),
                          padding: '0.4rem 0.9rem'
                        }}
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="premium-card">
                  <div className="premium-card-header">
                    <span className="premium-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
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
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
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
            </>
          )}

          {/* Explorer Sections */}
          {safeActiveProfileMode === 'EXPLORER' && (
            <>
              <div className="premium-two-column-row">
                <div className="premium-card">
                  <div className="premium-card-header">
                    <span className="premium-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
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
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        Interests
                      </span>
                      <span className="about-value">AI, Web3, Sustainability, FinTech</span>
                    </div>
                    <div className="about-row">
                      <span className="about-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        Skills
                      </span>
                      <span className="about-value">Community Support, Research, Feedback</span>
                    </div>
                    <div className="about-row">
                      <span className="about-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
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
                        <circle cx="12" cy="5" r="3" />
                        <circle cx="5" cy="19" r="3" />
                        <circle cx="19" cy="19" r="3" />
                        <line x1="12" y1="8" x2="5" y2="16" />
                        <line x1="12" y1="8" x2="19" y2="16" />
                      </svg>
                      Explorer Stats
                    </span>
                    <button className="premium-card-view-btn">View All</button>
                  </div>
                  <div className="premium-explorer-stats">
                    <div className="explorer-stat">
                      <UsersIcon />
                      <span className="explorer-stat-value">12</span>
                      <span className="explorer-stat-label">Communities Joined</span>
                    </div>
                    <div className="explorer-stat">
                      <MessageIcon />
                      <span className="explorer-stat-value">28</span>
                      <span className="explorer-stat-label">Discussions Participated</span>
                    </div>
                    <div className="explorer-stat">
                      <ThumbsUpIcon />
                      <span className="explorer-stat-value">34</span>
                      <span className="explorer-stat-label">Feedback Contributions</span>
                    </div>
                    <div className="explorer-stat">
                      <BookmarkIcon />
                      <span className="explorer-stat-value">18</span>
                      <span className="explorer-stat-label">Startups Saved</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="premium-two-column-row">
                <div className="premium-card">
                  <div className="premium-card-header">
                    <span className="premium-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      Top Interests
                    </span>
                    <button className="premium-card-edit-btn">Edit</button>
                  </div>
                  <div className="premium-interests-tags">
                    {profileInterests[safeActiveProfileMode as keyof typeof profileInterests].map((interest, index) => (
                      <span
                        key={index}
                        className="interest-tag"
                        style={{
                          fontSize: getInterestFontSize(
                            profileInterests[safeActiveProfileMode as keyof typeof profileInterests].length
                          ),
                          padding: '0.4rem 0.9rem'
                        }}
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="premium-card">
                  <div className="premium-card-header">
                    <span className="premium-card-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      Communities I'm Part Of
                    </span>
                    <button className="premium-card-view-btn">View All</button>
                  </div>
                  <div className="premium-communities-grid">
                    <div className="community-item">
                      <BrainIcon />
                      <span>AI Innovators</span>
                    </div>
                    <div className="community-item">
                      <Web3Icon />
                      <span>Web3 Builders</span>
                    </div>
                    <div className="community-item">
                      <RocketSmallIcon />
                      <span>Startup Supporters</span>
                    </div>
                    <div className="community-item">
                      <LeafIcon />
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
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
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
                        <circle cx="12" cy="5" r="3" />
                        <circle cx="5" cy="19" r="3" />
                        <circle cx="19" cy="19" r="3" />
                        <line x1="12" y1="8" x2="5" y2="16" />
                        <line x1="12" y1="8" x2="19" y2="16" />
                      </svg>
                      My Network
                    </span>
                    <button className="premium-card-view-btn">View All</button>
                  </div>
                  <div className="premium-network-visual">
                    <svg viewBox="0 0 300 200" className="network-svg">
                      <defs>
                        <pattern id="netGridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#netGridPattern)"/>
                        
                      {/* Network lines */}
                      <line x1="150" y1="100" x2="80" y2="50" stroke="#3B82F6" strokeWidth="1" opacity="0.5"/>
                      <line x1="150" y1="100" x2="220" y2="50" stroke="#3B82F6" strokeWidth="1" opacity="0.5"/>
                      <line x1="150" y1="100" x2="50" y2="100" stroke="#3B82F6" strokeWidth="1" opacity="0.5"/>
                      <line x1="150" y1="100" x2="250" y2="100" stroke="#3B82F6" strokeWidth="1" opacity="0.5"/>
                      <line x1="150" y1="100" x2="80" y2="150" stroke="#3B82F6" strokeWidth="1" opacity="0.5"/>
                      <line x1="150" y1="100" x2="220" y2="150" stroke="#3B82F6" strokeWidth="1" opacity="0.5"/>
                        
                      {/* Center node */}
                      <circle cx="150" cy="100" r="18" fill="#3B82F6"/>
                      <circle cx="150" cy="100" r="14" fill="#60A5FA"/>
                        
                      {/* Surrounding nodes */}
                      <circle cx="80" cy="50" r="12" fill="#60A5FA"/>
                      <circle cx="80" cy="50" r="8" fill="#93C5FD"/>
                        
                      <circle cx="220" cy="50" r="12" fill="#60A5FA"/>
                      <circle cx="220" cy="50" r="8" fill="#93C5FD"/>
                        
                      <circle cx="50" cy="100" r="10" fill="#93C5FD"/>
                      <circle cx="50" cy="100" r="6" fill="#BFDBFE"/>
                        
                      <circle cx="250" cy="100" r="10" fill="#93C5FD"/>
                      <circle cx="250" cy="100" r="6" fill="#BFDBFE"/>
                        
                      <circle cx="80" cy="150" r="12" fill="#60A5FA"/>
                      <circle cx="80" cy="150" r="8" fill="#93C5FD"/>
                        
                      <circle cx="220" cy="150" r="12" fill="#60A5FA"/>
                      <circle cx="220" cy="150" r="8" fill="#93C5FD"/>
                    </svg>
                    <div className="network-label">Connecting with explorers from 45+ countries</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* My Content Section */}
          <div className="my-content-section">
            <div className="premium-section-header">
              <h3 className="premium-section-title">MY CONTENT</h3>
            </div>

            <div className="my-content-tabs">
              {['posts', 'drafts', 'pinned', 'scheduled', 'archived', 'analytics'].map(tab => (
                <button 
                  key={tab}
                  className={`my-content-tab ${activeMyContentTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveMyContentTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="my-content-content">
              {activeMyContentTab === 'posts' && (
                <div className="my-content-list">
                  {(() => {
                    const userId = userData?.uid || 'current-user';
                    const userPosts = getUserPosts(userId);
                    return userPosts.length > 0 ? (
                      userPosts.map(post => (
                        <div key={post.id} className="my-content-item">
                          <div className="my-content-item-header">
                            <h4>{post.postType}</h4>
                            <button 
                              className="my-content-item-menu-btn"
                              onClick={() => setOpenMenuPostId(post.id)}
                            >
                              ⋮
                            </button>
                          </div>
                          <p>{post.description}</p>
                          <div className="my-content-item-meta">
                            <span>Tags: {post.tags.join(', ')}</span>
                            <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                          </div>
                          <div className="my-content-item-actions">
                            <button 
                              className="my-content-action-btn"
                              onClick={() => setOpenMenuPostId(post.id)}
                            >
                              Edit
                            </button>
                            <button 
                              className="my-content-action-btn danger"
                              onClick={() => setDeleteConfirmPostId(post.id)}
                            >
                              Delete
                            </button>
                            {!post.isPinned && (
                              <button 
                                className="my-content-action-btn"
                                onClick={() => pinPost(post.id)}
                              >
                                Pin
                              </button>
                            )}
                            {post.isPinned && (
                              <button 
                                className="my-content-action-btn"
                                onClick={() => unpinPost(post.id)}
                              >
                                Unpin
                              </button>
                            )}
                            <button 
                              className="my-content-action-btn"
                              onClick={() => archivePost(post.id)}
                            >
                              Archive
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="premium-empty-state">
                        <p className="premium-empty-state-text">No posts yet</p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {activeMyContentTab === 'drafts' && (
                <div className="my-content-list">
                  {(() => {
                    const userId = userData?.uid || 'current-user';
                    const userDrafts = getDraftsByUser(userId);
                    return userDrafts.length > 0 ? (
                      userDrafts.map(draft => (
                        <div key={draft.id} className="my-content-item">
                          <div className="my-content-item-header">
                            <h4>{draft.postType}</h4>
                          </div>
                          <p>{draft.description}</p>
                          <div className="my-content-item-meta">
                            <span>Tags: {draft.tags.join(', ')}</span>
                            <span>Updated: {new Date(draft.updatedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="my-content-item-actions">
                            <button className="my-content-action-btn">Continue Editing</button>
                            <button className="my-content-action-btn">Publish Draft</button>
                            <button className="my-content-action-btn danger">Delete Draft</button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="premium-empty-state">
                        <p className="premium-empty-state-text">No drafts yet</p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {activeMyContentTab === 'pinned' && (
                <div className="my-content-list">
                  {(() => {
                    const pinnedPosts = getPinnedPosts();
                    return pinnedPosts.length > 0 ? (
                      pinnedPosts.map(post => (
                        <div key={post.id} className="my-content-item">
                          <div className="my-content-item-header">
                            <h4>{post.postType}</h4>
                            <span className="pinned-badge">📌 Pinned</span>
                          </div>
                          <p>{post.description}</p>
                          <div className="my-content-item-meta">
                            <span>Tags: {post.tags.join(', ')}</span>
                            <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                          </div>
                          <div className="my-content-item-actions">
                            <button 
                              className="my-content-action-btn"
                              onClick={() => unpinPost(post.id)}
                            >
                              Unpin
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="premium-empty-state">
                        <p className="premium-empty-state-text">No pinned posts yet</p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {activeMyContentTab === 'scheduled' && (
                <div className="my-content-list">
                  {(() => {
                    const userId = userData?.uid || 'current-user';
                    const scheduled = getScheduledPosts(userId);
                    return scheduled.length > 0 ? (
                      scheduled.map(scheduledPost => (
                        <div key={scheduledPost.id} className="my-content-item">
                          <div className="my-content-item-header">
                            <h4>{scheduledPost.postType}</h4>
                            <span className="scheduled-badge">⏰ Scheduled</span>
                          </div>
                          <p>{scheduledPost.description}</p>
                          <div className="my-content-item-meta">
                            <span>Tags: {scheduledPost.tags.join(', ')}</span>
                            <span>Scheduled for: {new Date(scheduledPost.scheduledAt).toLocaleString()}</span>
                          </div>
                          <div className="my-content-item-actions">
                            <button className="my-content-action-btn">Edit Schedule</button>
                            <button className="my-content-action-btn">Publish Now</button>
                            <button className="my-content-action-btn danger">Cancel Schedule</button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="premium-empty-state">
                        <p className="premium-empty-state-text">No scheduled posts yet</p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {activeMyContentTab === 'archived' && (
                <div className="my-content-list">
                  {(() => {
                    const userId = userData?.uid || 'current-user';
                    const archived = getArchivedPosts(userId);
                    return archived.length > 0 ? (
                      archived.map(post => (
                        <div key={post.id} className="my-content-item">
                          <div className="my-content-item-header">
                            <h4>{post.postType}</h4>
                            <span className="archived-badge">📁 Archived</span>
                          </div>
                          <p>{post.description}</p>
                          <div className="my-content-item-meta">
                            <span>Tags: {post.tags.join(', ')}</span>
                            <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                          </div>
                          <div className="my-content-item-actions">
                            <button 
                              className="my-content-action-btn"
                              onClick={() => unarchivePost(post.id)}
                            >
                              Unarchive
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="premium-empty-state">
                        <p className="premium-empty-state-text">No archived posts yet</p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {activeMyContentTab === 'analytics' && (
                <div className="my-content-analytics">
                  <div className="analytics-cards">
                    <div className="analytics-card">
                      <div className="analytics-value">12</div>
                      <div className="analytics-label">Total Posts</div>
                    </div>
                    <div className="analytics-card">
                      <div className="analytics-value">1.2k</div>
                      <div className="analytics-label">Total Views</div>
                    </div>
                    <div className="analytics-card">
                      <div className="analytics-value">456</div>
                      <div className="analytics-label">Total Engagement</div>
                    </div>
                    <div className="analytics-card">
                      <div className="analytics-value">78</div>
                      <div className="analytics-label">Total Comments</div>
                    </div>
                  </div>
                  <div className="premium-empty-state">
                    <p className="premium-empty-state-text">Detailed analytics coming soon</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* General Links & Presence for all profiles */}
          <div className="premium-two-column-row">
            <div className="premium-card" style={{gridColumn: 'span 1'}}>
              <div className="premium-card-header">
                <span className="premium-card-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Links & Presence
                </span>
              </div>
              <div className="premium-links-list">
                <div className="premium-link-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.602c0-1.341-.025-3.072-1.871-3.072-1.875 0-2.163 1.46-2.163 2.972v5.702h-3v-11h3v1.588c.438-.844 1.525-1.588 3.322-1.588 4.366 0 5.175 2.785 5.175 6.186v6.27z"/>
                  </svg>
                  <span className="link-name">LinkedIn</span>
                  {userData?.profile.linkedin ? (
                    <span className="link-url">{userData.profile.linkedin}</span>
                  ) : (
                    <span className="link-add" onClick={openEditProfileModal}>ADD</span>
                  )}
                </div>
                <div className="premium-link-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <span className="link-name">Website</span>
                  {userData?.profile.website ? (
                    <span className="link-url">{userData.profile.website}</span>
                  ) : (
                    <span className="link-add" onClick={openEditProfileModal}>ADD</span>
                  )}
                </div>
                <div className="premium-link-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                  <span className="link-name">Twitter / X</span>
                  {userData?.profile.twitter ? (
                    <span className="link-url">{userData.profile.twitter}</span>
                  ) : (
                    <span className="link-add" onClick={openEditProfileModal}>ADD</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Post Menu */}
      {openMenuPostId && (
        <PostMenu 
          post={posts.find(p => p.id === openMenuPostId)!}
          onClose={() => setOpenMenuPostId(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmPostId && (
        <div className="post-menu-overlay" onClick={() => setDeleteConfirmPostId(null)}>
          <div className="post-menu delete-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirm-header">
              <span>🗑️</span>
              <h3>Delete Post?</h3>
              <p>This action cannot be undone. This will permanently delete the post.</p>
            </div>
            <div className="delete-confirm-actions">
              <button 
                className="btn-cancel" 
                onClick={() => setDeleteConfirmPostId(null)}
              >
                Cancel
              </button>
              <button 
                className="btn-delete" 
                onClick={() => {
                  deletePost(deleteConfirmPostId);
                  setDeleteConfirmPostId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`premium-toast ${toastType}`}>
          <svg className="premium-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {toastType === 'success' ? (
              <polyline points="20 6 9 17 4 12" />
            ) : (
              <circle cx="12" cy="12" r="10" />
            )}
            {toastType === 'error' && (
              <>
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </>
            )}
          </svg>
          <span className="premium-toast-message">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ProfilePremium;
