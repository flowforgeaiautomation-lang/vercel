import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
  trustScore: number;
  verificationLevel: 'Unverified' | 'Basic Verified' | 'Identity Verified' | 'Professional Verified' | 'Premium Verified' | 'TRIVEON Verified';
  verificationStatus: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Needs Action';
}

interface UserData {
  uid: string;
  mainRole: string;
  extraRole: string | null;
  roles: string[];
  activeProfileView: string;
  isDemo: boolean;
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
  isDemo: boolean;
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
  switchToDemo: () => void;
  switchToReal: () => void;
  uploadImage: (file: File, path: string) => Promise<string>;
  deleteImage: (path: string) => Promise<void>;
  addExtraRole: (role: string) => void;
  deleteExtraRole: () => void;
  switchProfile: (role: string) => void;
  followUser: (userId: string) => void; // Follow another user
  unfollowUser: (userId: string) => void; // Unfollow another user
  getProfileCompletionPercentage: () => number;
  getVerificationCompletionPercentage: () => number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

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

const ROLE_DATA: Record<string, RoleData> = {
  ARCHITECT: {
    name: "Unnati Chaudhary",
    title: "Architect",
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

const getDemoUserData = (): UserData => {
  const selectedRole = localStorage.getItem('selectedRole') || 'ARCHITECT';
  const role = selectedRole.toUpperCase();
  const roleData = ROLE_DATA[role] || ROLE_DATA['ARCHITECT'];
  
  const username = generateUsername(roleData.name);
  
  return {
    uid: 'demo-user',
    mainRole: role,
    extraRole: null,
    roles: [role],
    activeProfileView: role,
    isDemo: true,
    hasSeenWelcomeModal: false,
    hasSeenProfileModal: false,
    username,
    following: ['demo-1', 'demo-2', 'demo-3'],
    followers: ['demo-1', 'demo-4', 'demo-5'],
    prestigeSystem: {
      currentStarId: 5,
      currentStarName: 'CASTOR',
      progressPercent: 45
    },
    verification: {
      emailVerified: true,
      phoneVerified: true,
      identityVerified: true,
      linkedinVerified: true,
      websiteVerified: true,
      startupVerified: role === 'ARCHITECT',
      investorVerified: role === 'CATALYST',
      explorerVerified: role === 'EXPLORER',
      trustScore: 92,
      verificationLevel: 'TRIVEON Verified',
      verificationStatus: 'Approved'
    },
    profile: {
      name: roleData.name,
      title: roleData.title,
      bio: roleData.bio,
      location: roleData.location,
      profileImage: '',
      linkedin: roleData.links.linkedin,
      website: roleData.links.website,
      twitter: roleData.links.twitter
    },
    architectProfile: {
      score: roleData.score,
      scoreTier: roleData.scoreTier,
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
      reputationTrend: 18,
      startupsBuilt: 3,
      startupsBuiltDetail: '2 Exited • 1 Active',
      startupsBacked: 7,
      startupsBackedDetail: '2 Unicorns • 1 Soonicorn',
      avgFeedbackScore: 4.8,
      feedbackCount: 128,
      successfulMatches: 23,
      successfulMatchesDetail: 'Founders • Investors • Mentors'
    },
    catalystProfile: {
      score: 96,
      scoreTier: 'Sovereign',
      memberSince: 'Jan 2022',
      totalInvestments: 48,
      portfolioCompanies: 23,
      ecosystemImpact: 'High',
      trustScore: 98,
      savedStartups: 12,
      investmentRange: '$500K - $15M',
      investmentInterests: ['SaaS', 'AI/ML', 'FinTech', 'Web3', 'HealthTech'],
      preferredStartupStages: ['Seed', 'Series A', 'Series B'],
      geographicFocus: ['North America', 'Europe', 'Asia'],
      investmentThesis: 'Backing visionary founders building scalable solutions with massive global impact. Focus on innovation, team, and execution.',
      capitalDeployed: '$42.8M',
      activeInvestments: 23,
      exits: 7,
      roi: '3.7x',
      topSectors: [
        { name: 'SaaS', percentage: 38 },
        { name: 'AI/ML', percentage: 24 },
        { name: 'FinTech', percentage: 18 },
        { name: 'Web3', percentage: 12 },
        { name: 'HealthTech', percentage: 8 }
      ],
      areasOfExpertise: ['Deep Tech', 'Climate', 'Enterprise SaaS', 'BioTech', 'AI'],
      openToMentorship: true,
      mentorshipFocus: 'Helping early-stage founders with fundraising, product strategy, and go-to-market.',
      portfolioHighlights: [
        { name: 'NextGen AI', stage: 'Series A', sector: 'AI Platform' },
        { name: 'FinFlow', stage: 'Series B', sector: 'FinTech' },
        { name: 'WebVerse', stage: 'Seed', sector: 'Web3' },
        { name: 'Health Plus', stage: 'Series A', sector: 'HealthTech' }
      ]
    },
    explorerProfile: {
      score: 90,
      scoreTier: 'Elite',
      communitiesJoined: 12,
      discussionsParticipated: 28,
      feedbackGiven: 34,
      connections: 156,
      aboutMe: 'I love exploring new ideas, supporting amazing founders, and learning something new every day.',
      interests: ['AI', 'Web3', 'FinTech', 'Sustainability', 'HealthTech'],
      skills: ['Community Support', 'Research', 'Feedback'],
      learningGoals: ['Understand startups', 'Invest wisely', 'Build connections'],
      communities: [
        { name: 'AI Innovators', icon: 'brain' },
        { name: 'Web3 Builders', icon: 'web3' },
        { name: 'Startup Supporters', icon: 'rocket' },
        { name: 'Sustainability Leaders', icon: 'leaf' }
      ],
      recentActivity: [
        { id: '1', title: 'Joined AI Innovators Community', time: '1h ago' },
        { id: '2', title: 'Gave feedback on 3 startups', time: '3h ago' },
        { id: '3', title: 'Participated in Web3 discussion', time: '5h ago' },
        { id: '4', title: 'Saved 2 new startups', time: '1d ago' }
      ]
    },
    activities: [
      {
        id: '1',
        title: 'Nexora AI raised $2.4M Pre-Seed',
        description: '',
        year: '2024'
      },
      {
        id: '2',
        title: 'Shared a deep dive: AI in Early Stage Startups',
        description: '',
        year: '2024'
      },
      {
        id: '3',
        title: 'Provided feedback on 5 startups',
        description: '',
        year: '2024'
      },
      {
        id: '4',
        title: 'Spoke at TRIARCORA Summit \'24',
        description: '',
        year: '2024'
      },
      {
        id: '5',
        title: 'Exited NexStack (Acquired by BrowserStack)',
        description: '',
        year: '2023'
      },
      {
        id: '6',
        title: 'Joined TRIARCORA',
        description: '',
        year: '2022'
      }
    ],
    assets: [
      {
        id: '1',
        title: 'Pitch Deck - Nexora AI',
        description: 'Investor pitch deck for our AI-powered SaaS platform',
        fileUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
        fileType: 'PDF',
        uploadTime: new Date(2024, 4, 29)
      },
      {
        id: '2',
        title: 'Product Demo Video',
        description: 'Quick 2-minute product walkthrough',
        fileUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728',
        fileType: 'Video',
        uploadTime: new Date(2024, 3, 15)
      },
      {
        id: '3',
        title: 'Business Plan 2024',
        description: 'Comprehensive business plan and roadmap',
        fileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        fileType: 'Docs',
        uploadTime: new Date(2024, 2, 1)
      }
    ],
    settings: getDefaultSettings()
  };
};

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
    isDemo: false,
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
      verificationLevel: 'Unverified',
      verificationStatus: 'Pending'
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
  } catch (error) {
    console.error('[UserContext] Error saving to Firestore:', error);
  }
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, profile: authProfile } = useAuth();
  // Initialize user data instantly from localStorage or default to demo data (NO LOADING EVER!)
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
    // Default to demo data if no stored user - instant display!
    return getDemoUserData();
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

  const updateUserData = (newData: Partial<UserData>) => {
    setUserData(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...newData };
      
      if (user) {
        // Logged-in user: save to Firestore and localStorage
        saveUserProfileToFirestore(user.uid, updated);
        saveUserProfile(user.uid, updated);
        localStorage.setItem('triarcora-lastUserId', user.uid);
      }
      return updated;
    });
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
      userName: userData?.profile?.name,
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
      getVerificationCompletionPercentage
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
