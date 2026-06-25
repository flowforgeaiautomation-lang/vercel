import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

// TRIARCORA PRESTIGE STAR SYSTEM
interface PrestigeStar {
  id: number;
  name: string;
  displayName: string;
  color: string;
}

export const PRESTIGE_STARS: PrestigeStar[] = [
  { id: 1, name: 'ASTRA', displayName: 'ASTRA', color: '#9CA3AF' },
  { id: 2, name: 'NOVA', displayName: 'NOVA', color: '#3B82F6' },
  { id: 3, name: 'REGULUS', displayName: 'REGULUS', color: '#10B981' },
  { id: 4, name: 'BELLATRIX', displayName: 'BELLATRIX', color: '#F59E0B' },
  { id: 5, name: 'CASTOR', displayName: 'CASTOR', color: '#EF4444' },
  { id: 6, name: 'ALTAIR', displayName: 'ALTAIR', color: '#8B5CF6' },
  { id: 7, name: 'VEGA', displayName: 'VEGA', color: '#EC4899' },
  { id: 8, name: 'CENTAURI', displayName: 'CENTAURI', color: '#06B6D4' },
  { id: 9, name: 'CANOPUS', displayName: 'CANOPUS', color: '#F97316' },
  { id: 10, name: 'SIRIUS', displayName: 'SIRIUS', color: '#FFD700' },
];

interface ArchitectProfile {
  score: number;
  scoreTier: string;
  credibilityScore: number;
  credibilityTier: string;
  executionScore: number;
  executionTier: string;
  contributionScore: number;
  contributionTier: string;
  ecosystemTrust: number;
  ecosystemTrustLevel: string;
  founderPrestige: number;
  founderPrestigeLevel: string;
  reputationTrend: number;
  startupsBuilt: number;
  startupsBuiltDetail: string;
  startupsBacked: number;
  startupsBackedDetail: string;
  avgFeedbackScore: number;
  feedbackCount: number;
  successfulMatches: number;
  successfulMatchesDetail: string;
}

interface CatalystProfile {
  score: number;
  scoreTier: string;
  memberSince: string;
  totalInvestments: number;
  portfolioCompanies: number;
  ecosystemImpact: string;
  trustScore: number;
  savedStartups: number;
  investmentRange: string;
  investmentInterests: string[];
  preferredStartupStages: string[];
  geographicFocus: string[];
  investmentThesis: string;
  capitalDeployed: string;
  activeInvestments: number;
  exits: number;
  roi: string;
  topSectors: Array<{ name: string; percentage: number }>;
  areasOfExpertise: string[];
  openToMentorship: boolean;
  mentorshipFocus: string;
  portfolioHighlights: Array<{ name: string; stage: string; sector: string }>;
}

interface ExplorerProfile {
  score: number;
  scoreTier: string;
  communitiesJoined: number;
  discussionsParticipated: number;
  feedbackGiven: number;
  connections: number;
  aboutMe: string;
  interests: string[];
  skills: string[];
  learningGoals: string[];
  communities: Array<{ name: string; icon: string }>;
  recentActivity: Array<{ id: string; title: string; time: string }>;
}

interface SettingsData {
  accountPreferences: {
    username?: string;
  };
  signInSecurity: {
    twoFactorEnabled: boolean;
    connectedAccounts: {
      google: boolean;
      apple: boolean;
      microsoft: boolean;
      github: boolean;
    };
  };
  visibility: {
    profile: 'public' | 'connections' | 'private';
    startup: 'public' | 'investors' | 'private';
    investment: 'public' | 'connections' | 'private';
    explorer: 'public' | 'connections' | 'private';
    post: 'public' | 'connections' | 'private';
    search: boolean;
    externalDiscovery: boolean;
  };
  dataPrivacy: {
    downloadData: boolean;
    exportData: boolean;
    deleteData: boolean;
    activityControls: {
      postHistory: boolean;
      searchHistory: boolean;
      interactionHistory: boolean;
    };
    dataPermissions: {
      analytics: boolean;
      recommendations: boolean;
      aiTraining: boolean;
    };
    cookies: {
      essential: boolean;
      analytics: boolean;
      personalization: boolean;
    };
  };
  feedPreferences: {
    contentInterests: string[];
    feedControls: {
      moreStartup: boolean;
      moreInvestor: boolean;
      moreExplorer: boolean;
    };
    contentDensity: 'compact' | 'comfortable' | 'expanded';
    resetRecommendations: boolean;
    improveRecommendations: boolean;
  };
  aiSettings: {
    enabled: boolean;
    features: {
      startupAssistant: boolean;
      investorAssistant: boolean;
      explorerAssistant: boolean;
      messagingAssistant: boolean;
    };
    suggestions: {
      post: boolean;
      startup: boolean;
      investor: boolean;
      explorer: boolean;
      funding: boolean;
    };
    memory: {
      view: boolean;
      clear: boolean;
      export: boolean;
    };
    privacy: {
      allowContextLearning: boolean;
    };
  };
  signals: {
    push: {
      messages: boolean;
      mentions: boolean;
      comments: boolean;
      replies: boolean;
      reposts: boolean;
      saves: boolean;
      connections: boolean;
    };
    startup: {
      fundingUpdates: boolean;
      startupUpdates: boolean;
      productLaunches: boolean;
    };
    investor: {
      dealFlow: boolean;
      investmentOpportunities: boolean;
      syndicates: boolean;
    };
    explorer: {
      reviews: boolean;
      feedbackRequests: boolean;
      contributionAlerts: boolean;
    };
    community: {
      communities: boolean;
      events: boolean;
      challenges: boolean;
    };
    delivery: {
      push: boolean;
      email: boolean;
      inApp: boolean;
    };
  };
  connections: {
    requests: 'everyone' | 'verified' | 'nobody';
    messages: 'everyone' | 'connections';
    blocked: string[];
    muted: string[];
    hidden: string[];
  };
  architectSettings: {
    startupProfile: {
      edit: boolean;
      visibility: 'public' | 'connections' | 'private';
      fundingStatus: string;
      hiringStatus: string;
    };
    startupTeam: string[];
    startupPreferences: {
      fundraising: boolean;
      partnerships: boolean;
      hiring: boolean;
    };
  };
  catalystSettings: {
    investmentProfile: {
      preferredIndustries: string[];
      preferredGeography: string[];
      ticketSize: string;
      investmentStrategy: string;
      riskPreference: string;
      investmentStage: string[];
    };
    dealFlowPreferences: {
      aiRecommendations: boolean;
      fundingAlerts: boolean;
    };
  };
  explorerSettings: {
    explorerProfile: {
      contributionVisibility: 'public' | 'connections' | 'private';
      reviewVisibility: 'public' | 'connections' | 'private';
      feedbackVisibility: 'public' | 'connections' | 'private';
    };
    explorerInterests: {
      startupCategories: string[];
      industries: string[];
    };
  };
  contentManagement: {
    myContent: {
      posts: any[];
      drafts: any[];
      scheduled: any[];
      archived: any[];
      pinned: any[];
    };
    savedContent: {
      collections: any[];
      bookmarks: any[];
      reposts: any[];
    };
  };
  analyticsExport: {
    downloads: {
      profileData: boolean;
      posts: boolean;
      messages: boolean;
      connections: boolean;
      investments: boolean;
      startupData: boolean;
    };
    exportFormats: ('pdf' | 'csv' | 'json')[];
  };
  appearance: {
    theme: 'dark' | 'light' | 'system';
    layout: 'compact' | 'comfortable';
    accessibility: {
      fontSize: 'small' | 'medium' | 'large' | 'extra-large';
      highContrast: boolean;
      reducedMotion: boolean;
    };
  };
  advertising: {
    adPreferences: {
      personalized: boolean;
      generic: boolean;
    };
    promotions: {
      startup: boolean;
      investor: boolean;
    };
    sponsoredContentControls: boolean;
  };
  languageRegion: {
    language: string;
    country: string;
    timeZone: string;
    dateFormat: string;
    currency: string;
  };
}

interface VerificationData {
  emailVerified: boolean;
  phoneVerified: boolean;
  identityVerified: boolean;
  linkedinVerified: boolean;
  websiteVerified: boolean;
  startupVerified: boolean;
  investorVerified: boolean;
  explorerVerified: boolean;
  verificationLevel: 'unverified' | 'Basic Verified' | 'Identity Verified' | 'Professional Verified' | 'TRIVEON Verified';
  trustScore: number;
  submittedAt: Timestamp | null;
  reviewedAt: Timestamp | null;
  status: 'unverified' | 'pending' | 'ready_for_approval' | 'approved' | 'rejected' | 'needs_action';
  
  // Confidence scores
  emailConfidenceScore: number;
  phoneConfidenceScore: number;
  identityConfidenceScore: number;
  linkedinConfidenceScore: number;
  websiteConfidenceScore: number;
  startupConfidenceScore: number;
  investorConfidenceScore: number;
  explorerConfidenceScore: number;
  
  // Risk engine
  verificationRiskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  
  // Verification history
  failedAttempts: number;
  lastVerificationAttempt: Timestamp | null;
}

interface UserData {
  uid: string;
  mainRole: string;
  extraRole: string | null;
  roles: string[];
  activeProfileView: string;
  displayName?: string;
  username: string;
  email?: string;
  coverImage?: string;
  skills?: string[];
  industries?: string[];
  following: string[]; // Array of user IDs the user is following
  followers: string[]; // Array of user IDs following the user
  prestigeSystem: {
    currentStarId: number;
    currentStarName: string;
    progressPercent: number;
    memberSince: string; // ISO date string when user joined
    lastActive: string; // ISO date string of last activity
  };
  verification: VerificationData;
  profile: {
    name: string;
    title: string;
    bio: string;
    location: string;
    profileImage: string;
    linkedin: string;
    website: string;
    twitter: string;
  };
  architectProfile: ArchitectProfile;
  catalystProfile: CatalystProfile;
  explorerProfile: ExplorerProfile;
  activities?: any[];
  assets?: any[];
  settings: SettingsData;
  hasSeenWelcomeModal: boolean;
  hasSeenProfileModal: boolean;
}

interface UserContextType {
  userData: UserData | null;
  loading: boolean;
  userName: string;
  userUsername: string;
  userEmail: string;
  userRole: string;
  userProfileImage: string;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  updateUserData: (newData: Partial<UserData>) => void;
  updateSettings: (newSettings: Partial<SettingsData>) => void;
  setCurrentUserId: (userId: string) => void;
  createNewUserProfile: () => void;
  uploadImage: (file: File, path: string) => Promise<string>;
  deleteImage: (path: string) => Promise<void>;
  addExtraRole: (role: string) => void;
  deleteExtraRole: () => void;
  switchProfile: (role: string) => void;
  followUser: (userId: string) => void; // Follow another user
  unfollowUser: (userId: string) => void; // Unfollow another user
  getProfileCompletionPercentage: () => number;
  getVerificationCompletionPercentage: () => number;
  isDemo: boolean;
  aiVerificationEngine: typeof aiVerificationEngine;
  riskEngine: typeof riskEngine;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const generateUsername = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') || 'user';
};

// Calculate how many full active months the user has
const calculateActiveMonths = (memberSince: string, lastActive: string): number => {
  const startDate = new Date(memberSince);
  const endDate = new Date(lastActive);
  
  let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
  months += endDate.getMonth() - startDate.getMonth();
  
  // At least 1 month active to count
  return Math.max(0, months);
};

// Calculate current prestige star based on active months
const calculatePrestigeStar = (memberSince: string, lastActive: string) => {
  const activeMonths = calculateActiveMonths(memberSince, lastActive);
  
  // 1 month per star, max 10 (SIRIUS)
  let starId = Math.min(10, activeMonths + 1); // +1 because month 0 is ASTRA (id 1)
  
  // Ensure starId is between 1 and 10
  starId = Math.max(1, Math.min(10, starId));
  const star = PRESTIGE_STARS.find(s => s.id === starId);
  
  // Calculate progress percent (0-100) through current month
  const startDate = new Date(memberSince);
  const currentMonthStart = new Date(startDate.getFullYear(), startDate.getMonth() + (starId - 1), 1);
  const nextMonthStart = new Date(startDate.getFullYear(), startDate.getMonth() + starId, 1);
  const now = new Date(lastActive);
  
  let progressPercent = 0;
  if (now >= currentMonthStart && now < nextMonthStart) {
    const totalDaysInMonth = nextMonthStart.getTime() - currentMonthStart.getTime();
    const daysPassed = now.getTime() - currentMonthStart.getTime();
    progressPercent = Math.min(100, Math.round((daysPassed / totalDaysInMonth) * 100));
  } else if (now >= nextMonthStart) {
    progressPercent = 100;
  }
  
  return {
    starId,
    starName: star?.displayName || 'ASTRA',
    progressPercent
  };
};

const getDefaultSettings = (): SettingsData => ({
  accountPreferences: {
    username: ''
  },
  signInSecurity: {
    twoFactorEnabled: false,
    connectedAccounts: {
      google: false,
      apple: false,
      microsoft: false,
      github: false
    }
  },
  visibility: {
    profile: 'public',
    startup: 'public',
    investment: 'connections',
    explorer: 'public',
    post: 'public',
    search: true,
    externalDiscovery: true
  },
  dataPrivacy: {
    downloadData: false,
    exportData: false,
    deleteData: false,
    activityControls: {
      postHistory: true,
      searchHistory: true,
      interactionHistory: true
    },
    dataPermissions: {
      analytics: true,
      recommendations: true,
      aiTraining: true
    },
    cookies: {
      essential: true,
      analytics: true,
      personalization: true
    }
  },
  feedPreferences: {
    contentInterests: ['AI', 'SaaS', 'FinTech', 'HealthTech', 'ClimateTech'],
    feedControls: {
      moreStartup: true,
      moreInvestor: false,
      moreExplorer: false
    },
    contentDensity: 'comfortable',
    resetRecommendations: false,
    improveRecommendations: true
  },
  aiSettings: {
    enabled: true,
    features: {
      startupAssistant: true,
      investorAssistant: true,
      explorerAssistant: true,
      messagingAssistant: true
    },
    suggestions: {
      post: true,
      startup: true,
      investor: true,
      explorer: true,
      funding: true
    },
    memory: {
      view: true,
      clear: false,
      export: false
    },
    privacy: {
      allowContextLearning: true
    }
  },
  signals: {
    push: {
      messages: true,
      mentions: true,
      comments: true,
      replies: true,
      reposts: true,
      saves: true,
      connections: true
    },
    startup: {
      fundingUpdates: true,
      startupUpdates: true,
      productLaunches: true
    },
    investor: {
      dealFlow: true,
      investmentOpportunities: true,
      syndicates: true
    },
    explorer: {
      reviews: true,
      feedbackRequests: true,
      contributionAlerts: true
    },
    community: {
      communities: true,
      events: true,
      challenges: true
    },
    delivery: {
      push: true,
      email: true,
      inApp: true
    }
  },
  connections: {
    requests: 'everyone',
    messages: 'everyone',
    blocked: [],
    muted: [],
    hidden: []
  },
  architectSettings: {
    startupProfile: {
      edit: true,
      visibility: 'public',
      fundingStatus: 'actively-raising',
      hiringStatus: 'hiring'
    },
    startupTeam: [],
    startupPreferences: {
      fundraising: true,
      partnerships: true,
      hiring: true
    }
  },
  catalystSettings: {
    investmentProfile: {
      preferredIndustries: ['AI', 'SaaS', 'FinTech'],
      preferredGeography: ['North America', 'Europe'],
      ticketSize: '$500K - $5M',
      investmentStrategy: 'growth',
      riskPreference: 'medium',
      investmentStage: ['Seed', 'Series A']
    },
    dealFlowPreferences: {
      aiRecommendations: true,
      fundingAlerts: true
    }
  },
  explorerSettings: {
    explorerProfile: {
      contributionVisibility: 'public',
      reviewVisibility: 'public',
      feedbackVisibility: 'public'
    },
    explorerInterests: {
      startupCategories: ['AI', 'SaaS'],
      industries: ['Technology', 'Healthcare']
    }
  },
  contentManagement: {
    myContent: {
      posts: [],
      drafts: [],
      scheduled: [],
      archived: [],
      pinned: []
    },
    savedContent: {
      collections: [],
      bookmarks: [],
      reposts: []
    }
  },
  analyticsExport: {
    downloads: {
      profileData: true,
      posts: true,
      messages: false,
      connections: true,
      investments: false,
      startupData: false
    },
    exportFormats: ['pdf', 'csv', 'json']
  },
  appearance: {
    theme: 'dark',
    layout: 'comfortable',
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false
    }
  },
  advertising: {
    adPreferences: {
      personalized: true,
      generic: false
    },
    promotions: {
      startup: true,
      investor: true
    },
    sponsoredContentControls: false
  },
  languageRegion: {
    language: 'en',
    country: 'US',
    timeZone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD'
  }
});

// Empty real user profile data
const getEmptyRealUserData = (userId: string, roleOrRoles: string | string[], name: string = '', email: string = ''): UserData => {
  const rolesArray = Array.isArray(roleOrRoles) 
    ? roleOrRoles.map(r => r.toUpperCase()) 
    : [roleOrRoles.toUpperCase()];
  const selectedRole = rolesArray[0];
  const username = generateUsername(name || 'user');
  return {
    uid: userId,
    mainRole: selectedRole,
    extraRole: rolesArray.length > 1 ? rolesArray[1] : null,
    roles: rolesArray,
    activeProfileView: selectedRole,
    displayName: name,
    username,
    email: email,
    following: [],
    followers: [],
    hasSeenWelcomeModal: false,
    hasSeenProfileModal: false,
    prestigeSystem: {
      currentStarId: 1,
      currentStarName: 'ASTRA',
      progressPercent: 0,
      memberSince: new Date().toISOString(),
      lastActive: new Date().toISOString()
    },
    verification: {
      emailVerified: false,
      phoneVerified: false,
      identityVerified: false,
      linkedinVerified: false,
      websiteVerified: false,
      startupVerified: false,
      investorVerified: false,
      explorerVerified: false,
      trustScore: 0,
      verificationLevel: 'unverified',
      submittedAt: null,
      reviewedAt: null,
      status: 'unverified',
      
      // Confidence scores
      emailConfidenceScore: 0,
      phoneConfidenceScore: 0,
      identityConfidenceScore: 0,
      linkedinConfidenceScore: 0,
      websiteConfidenceScore: 0,
      startupConfidenceScore: 0,
      investorConfidenceScore: 0,
      explorerConfidenceScore: 0,
      
      // Risk engine
      verificationRiskScore: 0,
      riskLevel: 'Low',
      
      // Verification history
      failedAttempts: 0,
      lastVerificationAttempt: null,
    },
    profile: {
      name: name || '',
      title: '',
      bio: '',
      location: '',
      profileImage: '',
      linkedin: '',
      website: '',
      twitter: ''
    },
    architectProfile: {
      score: 0,
      scoreTier: 'Beginner',
      credibilityScore: 0,
      credibilityTier: 'Starter',
      executionScore: 0,
      executionTier: 'Starter',
      contributionScore: 0,
      contributionTier: 'Starter',
      ecosystemTrust: 0,
      ecosystemTrustLevel: 'Building',
      founderPrestige: 0,
      founderPrestigeLevel: 'Local',
      reputationTrend: 0,
      startupsBuilt: 0,
      startupsBuiltDetail: 'No startups yet',
      startupsBacked: 0,
      startupsBackedDetail: 'No backing yet',
      avgFeedbackScore: 0,
      feedbackCount: 0,
      successfulMatches: 0,
      successfulMatchesDetail: 'No matches yet'
    },
    catalystProfile: {
      score: 0,
      scoreTier: 'Beginner',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      totalInvestments: 0,
      portfolioCompanies: 0,
      ecosystemImpact: 'Building',
      trustScore: 0,
      savedStartups: 0,
      investmentRange: '',
      investmentInterests: [],
      preferredStartupStages: [],
      geographicFocus: [],
      investmentThesis: '',
      capitalDeployed: '$0',
      activeInvestments: 0,
      exits: 0,
      roi: '0x',
      topSectors: [],
      areasOfExpertise: [],
      openToMentorship: false,
      mentorshipFocus: '',
      portfolioHighlights: []
    },
    explorerProfile: {
      score: 0,
      scoreTier: 'Beginner',
      communitiesJoined: 0,
      discussionsParticipated: 0,
      feedbackGiven: 0,
      connections: 0,
      aboutMe: '',
      interests: [],
      skills: [],
      learningGoals: [],
      communities: [],
      recentActivity: []
    },
    activities: [],
    assets: [],
    settings: getDefaultSettings()
  };
};

// Helper to save user profile to localStorage
const saveUserProfile = (userId: string, userData: UserData) => {
  localStorage.setItem(`user-${userId}`, JSON.stringify(userData));
};

// Helper to save user profile to Firestore
const saveUserProfileToFirestore = async (userId: string, userData: UserData) => {
  try {
    const userRef = doc(db, 'userProfiles', userId);
    await setDoc(userRef, userData, { merge: true });
    console.log('[UserContext] Saved user profile to Firestore successfully');
  } catch (error) {
    console.error('[UserContext] Error saving to Firestore:', error);
    // Don't throw - keep the app working with localStorage
  }
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, profile: authProfile } = useAuth();
  // Initialize user data instantly from localStorage or default to null (NO DEMO DATA!)
  const [userData, setUserData] = useState<UserData | null>(() => {
    // Check for stored user data first!
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('triarcora-lastUserId');
      if (storedUserId) {
        const storedData = localStorage.getItem(`user-${storedUserId}`);
        if (storedData) {
          return JSON.parse(storedData) as UserData;
        }
      }
    }
    // Default to null
    return null;
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('triarcora-lastUserId') || '';
    }
    return '';
  });
  const loadingInProgress = React.useRef<boolean>(false);
  const initialized = React.useRef<boolean>(false);

  // Upload image to Firebase Storage
  const uploadImage = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Progress monitoring, optional
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  // Delete image from Firebase Storage
  const deleteImage = async (path: string): Promise<void> => {
    const storageRef = ref(storage, path);
    try {
      await deleteObject(storageRef);
      console.log('[UserContext] Image deleted successfully from Storage');
    } catch (error) {
      console.error('[UserContext] Error deleting image from Storage:', error);
    }
  };

  // Load user data from AuthContext's profile (single source of truth)
  useEffect(() => {
    if (user && authProfile) {
      // Check if we already loaded this user to prevent infinite loops
      if (currentUserId === user.uid && userData) {
        return;
      }

      // First, try to load from localStorage for INSTANT display
      const storedData = localStorage.getItem(`user-${user.uid}`);
      
      // Create UserData from authProfile
      const rolesArray = authProfile.roles || [authProfile.role || 'ARCHITECT'];
      
      let initialData: UserData = storedData 
        ? JSON.parse(storedData) as UserData
        : getEmptyRealUserData(user.uid, rolesArray, authProfile.name || '', authProfile.email || '');

      // Update userData with authProfile's data
      initialData.uid = authProfile.uid;
      if (authProfile.name && !initialData.profile.name) {
        initialData.profile.name = authProfile.name;
      }
      if (authProfile.username) {
        initialData.username = authProfile.username;
      }
      if (authProfile.email) {
        initialData.email = authProfile.email;
      }
      if (authProfile.photoURL) {
        initialData.profile.profileImage = authProfile.photoURL;
      }
      if (authProfile.role) {
        const role = authProfile.role.toUpperCase();
        initialData.mainRole = role;
        initialData.activeProfileView = role;
        if (!initialData.roles.includes(role)) {
          initialData.roles.push(role);
        }
      }

      // Update state first for instant UI
      setUserData(initialData);
      setCurrentUserId(user.uid);
      saveUserProfile(user.uid, initialData);
      localStorage.setItem('triarcora-lastUserId', user.uid);

      // Check Firestore for existing data in background (with safe error handling)
          const userRef = doc(db, 'userProfiles', user.uid);
          getDoc(userRef).then((docSnap) => {
            let finalData: UserData = initialData;
            
            if (docSnap.exists()) {
              const firestoreData = docSnap.data() as UserData;
              finalData = { ...initialData, ...firestoreData };
            }
            
            // Ensure userData has all required fields
            if (!finalData.settings) {
              finalData.settings = getDefaultSettings();
            }
            if (!finalData.prestigeSystem) {
              finalData.prestigeSystem = {
                currentStarId: 1,
                currentStarName: 'ASTRA',
                progressPercent: 0,
                memberSince: new Date().toISOString(),
                lastActive: new Date().toISOString()
              };
            }
            if (!finalData.prestigeSystem.memberSince) {
              finalData.prestigeSystem.memberSince = new Date().toISOString();
            }

            // Update state and localStorage only - skip Firestore write if needed
            setUserData(finalData);
            saveUserProfile(user.uid, finalData);
            // Only try to save to Firestore if we want to (can comment out if needed)
            saveUserProfileToFirestore(user.uid, finalData).catch((err) => {
              console.error('[UserContext] Firestore write failed (non-critical):', err);
            });
          }).catch((error) => {
            console.error('[UserContext] Error fetching user data from Firestore (non-critical):', error);
          });
    } else if (!initialized.current) {
      // Only clear data if this is the first run
      setUserData(null);
      setCurrentUserId('');
      localStorage.removeItem('triarcora-lastUserId');
    }
    initialized.current = true;
  }, [user?.uid, authProfile?.uid]);

  const calculateTrustScore = (verification: any, profileCompletion: number = 0, accountAgeBonus: number = 0) => {
    let score = 0;
    if (verification?.emailVerified) score += 10;
    if (verification?.phoneVerified) score += 10;
    if (verification?.identityVerified) score += 20;
    if (verification?.linkedinVerified) score += 10;
    if (verification?.websiteVerified) score += 10;
    if (verification?.startupVerified) score += 15;
    if (verification?.investorVerified) score += 15;
    if (verification?.explorerVerified) score += 10;
    // Profile completion and account age bonus (up to 10 each)
    score += Math.min(profileCompletion, 10);
    score += Math.min(accountAgeBonus, 10);
    return Math.min(score, 100);
  };

  const calculateVerificationLevel = (trustScore: number) => {
    if (trustScore >= 90) return 'TRIVEON Verified';
    if (trustScore >= 70) return 'Professional Verified';
    if (trustScore >= 50) return 'Identity Verified';
    if (trustScore >= 30) return 'Basic Verified';
    return 'unverified';
  };

  // AI Verification Engine
  const aiVerificationEngine = {
    // LinkedIn verification checks
    verifyLinkedIn: (url: string, userName: string): { confidenceScore: number, recommendation: 'approve' | 'review' | 'reject' } => {
      let score = 0;
      
      // URL format valid
      if (url.includes('linkedin.com')) score += 30;
      
      // URL has profile path
      if (url.includes('/in/')) score += 20;
      
      // Simulate public profile check
      if (Math.random() > 0.3) score += 25;
      
      // Simulate name similarity check
      if (Math.random() > 0.2) score += 25;
      
      // Determine recommendation
      let recommendation: 'approve' | 'review' | 'reject';
      if (score > 80) recommendation = 'approve';
      else if (score > 50) recommendation = 'review';
      else recommendation = 'reject';
      
      return { confidenceScore: score, recommendation };
    },

    // Website verification checks
    verifyWebsite: (url: string): { confidenceScore: number, recommendation: 'approve' | 'review' | 'reject' } => {
      let score = 0;
      
      // URL has valid format
      if (url.startsWith('http://') || url.startsWith('https://')) score += 20;
      
      // HTTPS enabled
      if (url.startsWith('https://')) score += 30;
      
      // Simulate not parked domain
      if (Math.random() > 0.15) score += 25;
      
      // Simulate not suspicious
      if (Math.random() > 0.1) score += 25;
      
      let recommendation: 'approve' | 'review' | 'reject';
      if (score > 80) recommendation = 'approve';
      else if (score > 50) recommendation = 'review';
      else recommendation = 'reject';
      
      return { confidenceScore: score, recommendation };
    },

    // Startup verification checks
    verifyStartup: (data: { name: string, website: string, email: string, country: string, industry: string }): { confidenceScore: number, recommendation: 'approve' | 'review' | 'reject' } => {
      let score = 0;
      
      // Check if domain matches company
      if (data.email.split('@')[1] && data.website.includes(data.email.split('@')[1].replace('www.', ''))) {
        score += 30;
      }
      
      // Simulate website legitimacy
      if (Math.random() > 0.2) score += 30;
      
      // Simulate info consistency
      if (Math.random() > 0.15) score += 20;
      
      // All required fields present
      if (data.name && data.website && data.email && data.country) score += 20;
      
      let recommendation: 'approve' | 'review' | 'reject';
      if (score > 80) recommendation = 'approve';
      else if (score > 50) recommendation = 'review';
      else recommendation = 'reject';
      
      return { confidenceScore: score, recommendation };
    },

    // Document review
    reviewDocument: (file: File): { confidenceScore: number, recommendation: 'approve' | 'review' | 'reject' } => {
      let score = 0;
      
      // File readable (simulated)
      if (file.size > 1000) score += 25;
      
      // Not blank (simulated)
      if (Math.random() > 0.05) score += 25;
      
      // Image quality sufficient (simulated)
      if (Math.random() > 0.1) score += 25;
      
      // No obvious fraud indicators (simulated)
      if (Math.random() > 0.15) score += 25;
      
      let recommendation: 'approve' | 'review' | 'reject';
      if (score > 80) recommendation = 'approve';
      else if (score > 50) recommendation = 'review';
      else recommendation = 'reject';
      
      return { confidenceScore: score, recommendation };
    },

    // Selfie review
    reviewSelfie: (file: File): { confidenceScore: number, recommendation: 'approve' | 'review' | 'reject' } => {
      let score = 0;
      
      // Face visible (simulated)
      if (Math.random() > 0.1) score += 30;
      
      // Image quality acceptable (simulated)
      if (Math.random() > 0.1) score += 25;
      
      // Not screenshot (simulated)
      if (Math.random() > 0.15) score += 20;
      
      // Not stock/AI image (simulated)
      if (Math.random() > 0.2) score += 25;
      
      let recommendation: 'approve' | 'review' | 'reject';
      if (score > 80) recommendation = 'approve';
      else if (score > 50) recommendation = 'review';
      else recommendation = 'reject';
      
      return { confidenceScore: score, recommendation };
    }
  };

  // Risk Engine
  const riskEngine = {
    calculateRiskScore: (verification: any): { riskScore: number, riskLevel: 'Low' | 'Medium' | 'High' } => {
      let riskScore = 0;
      
      // New account (first 7 days)
      if (!verification?.submittedAt) riskScore += 30;
      
      // Multiple failed attempts
      if (verification?.failedAttempts >= 5) riskScore += 40;
      else if (verification?.failedAttempts >= 2) riskScore += 20;
      
      // Suspicious domains (simulated)
      if (Math.random() > 0.85) riskScore += 30;
      
      // Mismatched info (simulated)
      if (Math.random() > 0.9) riskScore += 40;
      
      // Determine risk level
      let riskLevel: 'Low' | 'Medium' | 'High';
      if (riskScore > 70) riskLevel = 'High';
      else if (riskScore > 30) riskLevel = 'Medium';
      else riskLevel = 'Low';
      
      return { riskScore, riskLevel };
    },
    
    // Determine if submission needs admin review
    needsAdminReview: (aiRecommendation: string, riskLevel: string): boolean => {
      // High risk always needs review
      if (riskLevel === 'High') return true;
      
      // Medium risk needs review if not approved
      if (riskLevel === 'Medium' && aiRecommendation !== 'approve') return true;
      
      // Low risk only needs review if rejected
      if (riskLevel === 'Low' && aiRecommendation === 'reject') return true;
      
      return false;
    }
  };

  const updateUserData = (newData: Partial<UserData>) => {
    setUserData(prev => {
      if (!prev) return null;
      const updatedVerification = newData.verification 
        ? { ...prev.verification, ...newData.verification } 
        : prev.verification;
      
      const profileCompletion = getProfileCompletionPercentageInternal(prev);
      const trustScore = calculateTrustScore(updatedVerification, profileCompletion, 0); // Account age bonus can be added later
      const verificationLevel = calculateVerificationLevel(trustScore);
      
      const updated = { 
        ...prev, 
        ...newData,
        verification: {
          ...updatedVerification,
          trustScore,
          verificationLevel
        }
      };
      
      if (user) {
        // Logged-in user: save to Firestore and localStorage
        saveUserProfileToFirestore(user.uid, updated);
        saveUserProfile(user.uid, updated);
        localStorage.setItem('triarcora-lastUserId', user.uid);
      }
      return updated;
    });
  };
  
  // Helper to calculate profile completion without relying on userData state
  const getProfileCompletionPercentageInternal = (userData: UserData) => {
    const fields = [
      !!userData.profile.name,
      !!userData.profile.title,
      !!userData.profile.bio,
      !!userData.profile.location,
      !!userData.profile.profileImage,
      !!userData.profile.linkedin,
      !!userData.profile.website,
      !!userData.profile.twitter
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const updateSettings = (newSettings: Partial<SettingsData>) => {
    setUserData(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        settings: {
          ...prev.settings,
          ...newSettings
        }
      };
      
      if (user) {
        // Logged-in user: save to Firestore and localStorage
        saveUserProfileToFirestore(user.uid, updated);
      }
      saveUserProfile(currentUserId, updated);
      return updated;
    });
  };

  const addExtraRole = (role: string) => {
    updateUserData({ extraRole: role });
  };

  const deleteExtraRole = () => {
    updateUserData({ extraRole: null, activeProfileView: userData?.mainRole || 'ARCHITECT' });
  };

  const switchProfile = (role: string) => {
    updateUserData({ activeProfileView: role });
  };

  // Follow a user!
  const followUser = (userIdToFollow: string) => {
    if (!userData || userIdToFollow === userData.uid) return; // Don't follow yourself!

    const newFollowing = [...userData.following];
    if (!newFollowing.includes(userIdToFollow)) {
      newFollowing.push(userIdToFollow);
      updateUserData({ following: newFollowing });
    }
  };

  // Unfollow a user!
  const unfollowUser = (userIdToUnfollow: string) => {
    if (!userData) return;

    const newFollowing = userData.following.filter(id => id !== userIdToUnfollow);
    updateUserData({ following: newFollowing });
  };

  const getProfileCompletionPercentage = () => {
    if (!userData) return 0;
    const fields = [
      !!userData.profile.name,
      !!userData.profile.title,
      !!userData.profile.bio,
      !!userData.profile.location,
      !!userData.profile.profileImage,
      !!userData.profile.linkedin,
      !!userData.profile.website,
      !!userData.profile.twitter
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const getVerificationCompletionPercentage = () => {
    if (!userData) return 0;
    const fields = [
      userData.verification.emailVerified,
      userData.verification.phoneVerified,
      userData.verification.identityVerified,
      userData.verification.linkedinVerified,
      userData.verification.websiteVerified
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  return (
    <UserContext.Provider value={{ 
      userData, 
      loading,
      isDemo: false,
      userName: userData?.profile?.name || '',
      userUsername: userData?.username || '',
      userEmail: userData?.email || '',
      userRole: userData?.mainRole || 'ARCHITECT',
      userProfileImage: userData?.profile?.profileImage || '',
      setUserData, 
      updateUserData, 
      updateSettings,
      setCurrentUserId, 
      uploadImage,
      deleteImage,
      addExtraRole,
      deleteExtraRole,
      switchProfile,
      followUser,
      unfollowUser,
      getProfileCompletionPercentage,
      getVerificationCompletionPercentage,
      aiVerificationEngine,
      riskEngine
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
