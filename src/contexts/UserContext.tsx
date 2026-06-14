import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

// TRIVEON PRESTIGE STAR SYSTEM
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
  notifications: {
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

interface UserData {
  uid: string;
  mainRole: string;
  extraRole: string | null;
  activeProfileView: string;
  isDemo: boolean;
  displayName?: string;
  username?: string;
  email?: string;
  coverImage?: string;
  skills?: string[];
  industries?: string[];
  prestigeSystem: {
    currentStarId: number;
    currentStarName: string;
    progressPercent: number;
  };
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
}

interface UserContextType {
  userData: UserData | null;
  loading: boolean;
  isDemo: boolean;
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
    bio: "Exploring ideas, supporting founders, and learning every day in the Triveon ecosystem.",
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
  notifications: {
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
  const savedName = localStorage.getItem('triveon-name');
  
  return {
    uid: 'demo-user',
    mainRole: role,
    extraRole: null,
    activeProfileView: role,
    isDemo: true,
    prestigeSystem: {
      currentStarId: 5,
      currentStarName: 'CASTOR',
      progressPercent: 45
    },
    profile: {
      name: savedName || roleData.name,
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
        title: 'Spoke at TRIVEON Summit \'24',
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
        title: 'Joined TRIVEON',
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
const getEmptyRealUserData = (userId: string, role: string, name: string = '', email: string = ''): UserData => {
  const selectedRole = role || localStorage.getItem('selectedRole') || 'ARCHITECT';
  return {
    uid: userId,
    mainRole: selectedRole.toUpperCase(),
    extraRole: null,
    activeProfileView: selectedRole.toUpperCase(),
    isDemo: false,
    displayName: name,
    email: email,
    prestigeSystem: {
      currentStarId: 1,
      currentStarName: 'ASTRA',
      progressPercent: 0
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
  // Initialize user data immediately with demo data
  const initialUserData = getDemoUserData();
  const [userData, setUserData] = useState<UserData | null>(initialUserData);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<string>('demo-user');

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

  // Load user data from Firestore or localStorage
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        if (user) {
          // Logged-in user: load from Firestore
          console.log('[UserContext] Loading logged-in user from Firestore');
          const userRef = doc(db, 'userProfiles', user.uid);
          const docSnap = await getDoc(userRef);
          let firestoreData: UserData;
          if (!docSnap.exists()) {
            firestoreData = getEmptyRealUserData(user.uid, authProfile?.role || '', authProfile?.name || '', authProfile?.email || '');
            await setDoc(userRef, firestoreData);
          } else {
            firestoreData = docSnap.data() as UserData;
            // Ensure settings exist
            if (!firestoreData.settings) {
              firestoreData.settings = getDefaultSettings();
            }
          }
          // Apply saved name from localStorage (highest priority)
          const savedName = localStorage.getItem('triveon-name');
          if (savedName) {
            firestoreData.profile.name = savedName;
          }
          setUserData(firestoreData);
          setCurrentUserId(user.uid);
        } else {
          // Demo user: check localStorage first, else use demo data
          console.log('[UserContext] Initializing demo mode');
          let demoData: UserData;
          const savedDemoProfile = localStorage.getItem('user-demo-user');
          if (savedDemoProfile) {
            try {
              demoData = JSON.parse(savedDemoProfile);
              // Ensure settings exist
              if (!demoData.settings) {
                demoData.settings = getDefaultSettings();
              }
              // Parse dates
              if (demoData.activities) {
                demoData.activities = demoData.activities.map((a: any) => ({
                  ...a,
                  uploadTime: a.uploadTime ? new Date(a.uploadTime) : undefined
                }));
              }
              if (demoData.assets) {
                demoData.assets = demoData.assets.map((a: any) => ({
                  ...a,
                  uploadTime: a.uploadTime ? new Date(a.uploadTime) : new Date()
                }));
              }
              console.log('[UserContext] Loaded saved demo profile from localStorage');
            } catch (e) {
              console.log('[UserContext] Failed to parse saved demo profile, using default');
              demoData = getDemoUserData();
            }
          } else {
            demoData = getDemoUserData();
          }
          // Apply saved name from localStorage (highest priority)
          const savedName = localStorage.getItem('triveon-name');
          if (savedName) {
            demoData.profile.name = savedName;
          }
          setUserData(demoData);
          setCurrentUserId('demo-user');
          localStorage.setItem('currentUserId', 'demo-user');
          saveUserProfile('demo-user', demoData);
        }
      } catch (error) {
        console.error('[UserContext] Error loading user data:', error);
        // Fallback to demo mode on error
        const demoData = getDemoUserData();
        // Apply saved name from localStorage (highest priority)
        const savedName = localStorage.getItem('triveon-name');
        if (savedName) {
          demoData.profile.name = savedName;
        }
        setUserData(demoData);
        setCurrentUserId('demo-user');
        localStorage.setItem('currentUserId', 'demo-user');
        saveUserProfile('demo-user', demoData);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, authProfile]);

  const updateUserData = (newData: Partial<UserData>) => {
    console.log('[UserContext] updateUserData called with:', newData);
    setUserData(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...newData };
      console.log('[UserContext] Saving updated user profile:', updated);
      
      // Save name to localStorage if it's present in newData or updated
      if (updated.profile?.name) {
        localStorage.setItem('triveon-name', updated.profile.name);
      }
      
      if (user) {
        // Logged-in user: save to Firestore and localStorage
        saveUserProfileToFirestore(user.uid, updated);
      }
      saveUserProfile(currentUserId, updated);
      return updated;
    });
  };

  const updateSettings = (newSettings: Partial<SettingsData>) => {
    console.log('[UserContext] updateSettings called with:', newSettings);
    setUserData(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        settings: {
          ...prev.settings,
          ...newSettings
        }
      };
      console.log('[UserContext] Saving updated settings:', updated);
      
      if (user) {
        // Logged-in user: save to Firestore and localStorage
        saveUserProfileToFirestore(user.uid, updated);
      }
      saveUserProfile(currentUserId, updated);
      return updated;
    });
  };

  const createNewUserProfile = () => {
    const newUserId = `user-${Date.now()}`;
    setCurrentUserId(newUserId);
  };

  const switchToDemo = () => {
    const demoProfile = getDemoUserData();
    setUserData(demoProfile);
    localStorage.setItem('currentUserId', 'demo-user');
    saveUserProfile('demo-user', demoProfile);
  };

  const switchToReal = () => {
    const realUserId = localStorage.getItem('realUserId') || `user-${Date.now()}`;
    localStorage.setItem('realUserId', realUserId);
    localStorage.setItem('currentUserId', realUserId);
    setCurrentUserId(realUserId);
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

  return (
    <UserContext.Provider value={{ 
      userData, 
      loading,
      isDemo: userData?.isDemo || false,
      setUserData, 
      updateUserData, 
      updateSettings,
      setCurrentUserId, 
      createNewUserProfile,
      switchToDemo,
      switchToReal,
      uploadImage,
      deleteImage,
      addExtraRole,
      deleteExtraRole,
      switchProfile
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
