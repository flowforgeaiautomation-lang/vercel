import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useUser, PRESTIGE_STARS } from './UserContext';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole: string;
  userTitle?: string;
  content: string;
  timestamp: Date;
  parentId?: string; // For threaded discussions
  replies?: Comment[];
  type?: 'investor-feedback' | 'founder-response' | 'expert-insight' | 'general';
  likes?: number;
  endorsedBy?: string[]; // List of user IDs who endorsed this comment
}

export interface UserProfile {
  userId: string;
  userName: string;
  userRole: string;
  userTitle: string;
  userBio: string;
  userAvatar?: string;
  userLocation: string;
  userLinks: { linkedin?: string; website?: string; twitter?: string; };
  userCredibility: {
    score: number;
    investeeCount?: number;
    portfolio?: number;
    startups?: number;
    verified?: boolean;
    years?: number;
    companies?: number;
  };
  stats: { followers: number; following: number; endorsements: number; };
  tags: string[];
  // TRIARCORA PRESTIGE STAR SYSTEM
  prestigeSystem: {
    currentStarId: number;
    currentStarName: string;
    progressPercent: number;
  };
};

export interface Startup {
  id: string;
  name: string;
  tagline: string;
  description: string;
  industry: string;
  stage: string;
  revenue: string;
  teamSize: string;
  growth: string;
  technology: string[];
  location: string;
  logo?: string;
  website?: string;
  fundingStatus: string;
  followers: number;
  engagement: number;
  founder: string;
  founderId: string;
  foundedYear: number;
  tags: string[];
}

export interface MarketplaceListing {
  id: string;
  type: 'Startup for Sale' | 'Investment Opportunity' | 'SaaS for Sale' | 'Domain for Sale' | 'App for Sale' | 'Tech License';
  title: string;
  description: string;
  askingPrice: string;
  revenue: string;
  growth: string;
  industry: string;
  stage: string;
  location: string;
  listedBy: string;
  listedById: string;
  tags: string[];
  image?: string;
  listedDate: Date;
  views: number;
  interested: number;
}

export interface AIRecommendation {
  id: string;
  type: 'Investor' | 'Co-founder' | 'Mentor' | 'Service Provider' | 'Team Member' | 'Partner';
  name: string;
  title: string;
  avatar?: string;
  bio: string;
  matchScore: number;
  matchReason: string;
  location: string;
  tags: string[];
  verified: boolean;
}

export interface ProductLaunch {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image?: string;
  website?: string;
  startupName: string;
  startupId: string;
  founderName: string;
  founderAvatar?: string;
  upvotes: number;
  comments: number;
  category: string;
  featured: boolean;
  launchedAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole: string;
  userTitle?: string;
  postType: string;
  intent: string;
  description: string;
  tags: string[];
  likes: number;
  likedBy: string[]; // Array of user IDs who liked the post
  comments: Comment[];
  shares: number;
  timestamp: Date;
  engagementScore?: number;
  isSaved?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  isEdited?: boolean;
  editedAt?: Date;
  analytics?: {
    views: number;
    reach: number;
    engagement: number;
    profileVisits: number;
    startupVisits: number;
    investorInterest: number;
  };
}

export interface Draft {
  id: string;
  userId: string;
  role: string;
  postType: string;
  intent: string;
  description: string;
  tags: string[];
  visibility: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduledPost {
  id: string;
  userId: string;
  postType: string;
  intent: string;
  description: string;
  tags: string[];
  visibility: string;
  scheduledAt: Date;
  createdAt: Date;
}

export interface Report {
  id: string;
  postId: string;
  reporterId: string;
  reason: string;
  details?: string;
  createdAt: Date;
  status: 'pending' | 'reviewed' | 'resolved';
}

export interface Repost {
  id: string;
  originalPostId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole: string;
  comment?: string;
  createdAt: Date;
}

export interface HashtagData {
  tag: string;
  count: number;
  popularity: number;
  ecosystemRelevance: number;
  investorInterest: number;
  trendVelocity: number;
  lastUsed: Date;
}

export interface SavedCollection {
  id: string;
  name: string;
  postIds: string[];
  createdAt: Date;
}

interface PostContextType {
  posts: Post[];
  demoUsers: Record<string, UserProfile>;
  startups: Startup[];
  marketplaceListings: MarketplaceListing[];
  aiRecommendations: AIRecommendation[];
  productLaunches: ProductLaunch[];
  trendingHashtags: HashtagData[];
  savedPosts: string[];
  savedCollections: SavedCollection[];
  drafts: Draft[];
  scheduledPosts: ScheduledPost[];
  reposts: Repost[];
  reports: Report[];
  mutedUsers: string[];
  hiddenPosts: string[];
  notInterestedTopics: string[];
  pinnedPostIds: string[];
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'shares' | 'timestamp' | 'engagementScore' | 'isSaved'>) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'timestamp'>, parentId?: string) => void;
  upvoteProductLaunch: (launchId: string) => void;
  getFilteredFeed: (userRole: string, userTags?: string[]) => Post[];
  getTrendingHashtags: () => HashtagData[];
  savePost: (postId: string) => void;
  unsavePost: (postId: string) => void;
  getSavedPosts: () => Post[];
  createCollection: (name: string) => void;
  addToCollection: (collectionId: string, postId: string) => void;
  removeFromCollection: (collectionId: string, postId: string) => void;
  getIntelligentFeed: (userRole: string, userTags?: string[]) => Post[];
  // New functions
  editPost: (postId: string, updates: Partial<Omit<Post, 'id' | 'timestamp'>>) => void;
  deletePost: (postId: string) => void;
  pinPost: (postId: string) => void;
  unpinPost: (postId: string) => void;
  archivePost: (postId: string) => void;
  unarchivePost: (postId: string) => void;
  repost: (originalPostId: string, comment?: string) => void;
  reportPost: (postId: string, reason: string, details?: string) => void;
  muteUser: (userId: string) => void;
  unmuteUser: (userId: string) => void;
  hidePost: (postId: string) => void;
  unhidePost: (postId: string) => void;
  markNotInterested: (topics: string[]) => void;
  // Draft functions
  saveDraft: (draft: Omit<Draft, 'id' | 'createdAt'>) => void;
  updateDraft: (draftId: string, updates: Partial<Draft>) => void;
  deleteDraft: (draftId: string) => void;
  publishDraft: (draftId: string) => void;
  getDraftsByUser: (userId: string) => Draft[];
  // Scheduled posts
  schedulePost: (post: Omit<ScheduledPost, 'id' | 'createdAt'>) => void;
  cancelScheduledPost: (postId: string) => void;
  publishScheduledPost: (postId: string) => void;
  editScheduledPost: (postId: string, updates: Partial<ScheduledPost>) => void;
  // Get functions
  getUserPosts: (userId: string) => Post[];
  getPinnedPosts: () => Post[];
  getArchivedPosts: (userId: string) => Post[];
  getScheduledPosts: (userId: string) => ScheduledPost[];
  getReposts: () => Repost[];
  // Copy functions
  copyPostLink: (postId: string) => string;
  copyPostText: (postId: string) => string;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userData } = useUser();
  
  // Demo users with detailed profiles
  const demoUsers: Record<string, UserProfile> = {
    'demo-1': {
      userId: 'demo-1',
      userName: 'Riya Sharma',
      userRole: 'ARCHITECT',
      userTitle: 'Founder & CEO @ Nebula AI',
      userBio: 'Passionate entrepreneur building the future of AI-powered startup tools. Previously at Google and Stripe.',
      userLocation: 'San Francisco, CA',
      userLinks: {
        linkedin: 'linkedin.com/in/riyasharma',
        website: 'nebula.ai'
      },
      userCredibility: {
        score: 92,
        startups: 2,
        verified: true,
        years: 5,
        companies: 3
      },
      stats: { followers: 1240, following: 320, endorsements: 89 },
      tags: ['AI', 'Fintech', 'SaaS'],
      prestigeSystem: {
        currentStarId: 7,
        currentStarName: 'VEGA',
        progressPercent: 30
      }
    },
    'demo-2': {
      userId: 'demo-2',
      userName: 'Unnati Chaudhary',
      userRole: 'CATALYST',
      userTitle: 'Partner @ Peak Capital',
      userBio: 'Early-stage investor focused on fintech and SaaS startups. Love working with passionate founders.',
      userLocation: 'Mumbai, India',
      userLinks: {
        twitter: '@arjunmalhotra',
        website: 'peakcapital.vc'
      },
      userCredibility: {
        score: 88,
        investeeCount: 15,
        portfolio: 40,
        verified: true,
        years: 8,
        companies: 7
      },
      stats: { followers: 3400, following: 210, endorsements: 212 },
      tags: ['Fintech', 'SaaS', 'B2B'],
      prestigeSystem: {
        currentStarId: 9,
        currentStarName: 'CANOPUS',
        progressPercent: 60
      }
    },
    'demo-3': {
      userId: 'demo-3',
      userName: 'Kabir Mehta',
      userRole: 'EXPLORER',
      userTitle: 'Product @ Web3 Labs',
      userBio: 'Building decentralized social platforms and exploring the future of web3. Previously at Coinbase.',
      userLocation: 'Bangalore, India',
      userLinks: {
        linkedin: 'linkedin.com/in/kabirmehta',
        twitter: '@kabirmehta'
      },
      userCredibility: {
        score: 78,
        startups: 1,
        verified: true,
        years: 3,
        companies: 2
      },
      stats: { followers: 820, following: 450, endorsements: 32 },
      tags: ['Web3', 'Social', 'Product'],
      prestigeSystem: {
        currentStarId: 3,
        currentStarName: 'REGULUS',
        progressPercent: 75
      }
    },
    'demo-4': {
      userId: 'demo-4',
      userName: 'Rohit Sharma',
      userRole: 'ARCHITECT',
      userTitle: 'Founder @ FinFlow',
      userBio: 'Building modern accounting for startups, helping teams manage finances in real-time. Previously at Stripe.',
      userLocation: 'Mumbai, India',
      userLinks: {
        linkedin: 'linkedin.com/in/amitpatel',
        website: 'finflow.io'
      },
      userCredibility: {
        score: 85,
        startups: 1,
        verified: true,
        years: 4,
        companies: 2
      },
      stats: { followers: 1890, following: 230, endorsements: 120 },
      tags: ['Fintech', 'SaaS', 'Accounting'],
      prestigeSystem: {
        currentStarId: 5,
        currentStarName: 'CASTOR',
        progressPercent: 45
      }
    },
    'demo-5': {
      userId: 'demo-5',
      userName: 'Lisa Schmidt',
      userRole: 'CATALYST',
      userTitle: 'Angel Investor',
      userBio: 'Investing in climate tech startups that make sustainability accessible for businesses.',
      userLocation: 'Berlin, Germany',
      userLinks: {
        twitter: '@lisaschmidt',
        linkedin: 'linkedin.com/in/lisaschmidt'
      },
      userCredibility: {
        score: 90,
        investeeCount: 12,
        portfolio: 35,
        verified: true,
        years: 6,
        companies: 4
      },
      stats: { followers: 2200, following: 180, endorsements: 95 },
      tags: ['ClimateTech', 'Impact', 'Investing'],
      prestigeSystem: {
        currentStarId: 8,
        currentStarName: 'CENTAURUS',
        progressPercent: 55
      }
    },
    'demo-6': {
      userId: 'demo-6',
      userName: 'Dr. Sarah Chen',
      userRole: 'EXPLORER',
      userTitle: 'Product Lead @ HealthHub',
      userBio: 'Building patient-first telehealth solutions. Expert in healthcare product design and regulation.',
      userLocation: 'New York, NY',
      userLinks: {
        linkedin: 'linkedin.com/in/drsarahchen',
        website: 'healthhub.care'
      },
      userCredibility: {
        score: 82,
        verified: true,
        years: 7,
        companies: 3
      },
      stats: { followers: 3100, following: 290, endorsements: 175 },
      tags: ['HealthTech', 'Product', 'Learning'],
      prestigeSystem: {
        currentStarId: 4,
        currentStarName: 'BELLATRIX',
        progressPercent: 38
      }
    }
  };

  // Trending hashtags data
  const initialTrendingHashtags: HashtagData[] = [
    { tag: 'AI', count: 124, popularity: 95, ecosystemRelevance: 90, investorInterest: 88, trendVelocity: 92, lastUsed: new Date() },
    { tag: 'Fintech', count: 98, popularity: 85, ecosystemRelevance: 88, investorInterest: 95, trendVelocity: 80, lastUsed: new Date(Date.now() - 3600000) },
    { tag: 'SaaS', count: 87, popularity: 82, ecosystemRelevance: 85, investorInterest: 82, trendVelocity: 78, lastUsed: new Date(Date.now() - 7200000) },
    { tag: 'Startup', count: 76, popularity: 78, ecosystemRelevance: 95, investorInterest: 85, trendVelocity: 72, lastUsed: new Date(Date.now() - 10800000) },
    { tag: 'Web3', count: 65, popularity: 75, ecosystemRelevance: 70, investorInterest: 60, trendVelocity: 85, lastUsed: new Date(Date.now() - 14400000) },
    { tag: 'ClimateTech', count: 54, popularity: 72, ecosystemRelevance: 80, investorInterest: 90, trendVelocity: 70, lastUsed: new Date(Date.now() - 18000000) },
    { tag: 'HealthTech', count: 48, popularity: 68, ecosystemRelevance: 75, investorInterest: 78, trendVelocity: 65, lastUsed: new Date(Date.now() - 21600000) },
    { tag: 'Growth', count: 43, popularity: 65, ecosystemRelevance: 70, investorInterest: 75, trendVelocity: 60, lastUsed: new Date(Date.now() - 25200000) }
  ];
  
  // Demo startups data
  const initialStartups: Startup[] = [
    {
      id: 's1',
      name: 'Nebula AI',
      tagline: 'Your AI Co-founder',
      description: 'AI-powered tools to help early-stage startups validate ideas and build strategies faster.',
      industry: 'Artificial Intelligence',
      stage: 'Seed',
      revenue: '$0 - $100k',
      teamSize: '2-10',
      growth: 'High',
      technology: ['AI', 'LLMs', 'React', 'Node.js'],
      location: 'San Francisco, CA',
      logo: undefined,
      website: 'nebula.ai',
      fundingStatus: 'Raising Seed',
      followers: 1240,
      engagement: 342,
      founder: 'Riya Sharma',
      founderId: 'demo-1',
      foundedYear: 2023,
      tags: ['AI', 'SaaS', 'Startup Tools']
    },
    {
      id: 's2',
      name: 'FinFlow',
      tagline: 'Modern Accounting for Startups',
      description: 'Real-time financial management and analytics for growing startups.',
      industry: 'FinTech',
      stage: 'Series A',
      revenue: '$100k - $500k',
      teamSize: '10-50',
      growth: 'Very High',
      technology: ['Fintech', 'React', 'Python', 'AWS'],
      location: 'Mumbai, India',
      logo: undefined,
      website: 'finflow.io',
      fundingStatus: 'Seed Raised',
      followers: 3200,
      engagement: 567,
      founder: 'Rohit Sharma',
      founderId: 'demo-4',
      foundedYear: 2021,
      tags: ['Fintech', 'SaaS', 'Accounting']
    },
    {
      id: 's3',
      name: 'EcoTrack',
      tagline: 'Sustainability Analytics',
      description: 'Track and reduce your company\'s carbon footprint with real-time analytics.',
      industry: 'ClimateTech',
      stage: 'Pre-seed',
      revenue: 'Pre-revenue',
      teamSize: '1-2',
      growth: 'Medium',
      technology: ['Web3', 'IoT', 'Sustainability'],
      location: 'Berlin, Germany',
      logo: undefined,
      website: 'ecotrack.eco',
      fundingStatus: 'Bootstrapped',
      followers: 850,
      engagement: 210,
      founder: 'Lisa Schmidt',
      founderId: 'demo-5',
      foundedYear: 2024,
      tags: ['ClimateTech', 'SaaS', 'Analytics']
    },
    {
      id: 's4',
      name: 'HealthHub',
      tagline: 'Patient-first Telemedicine',
      description: 'Connecting patients with specialists through AI-powered virtual care.',
      industry: 'HealthTech',
      stage: 'Series B',
      revenue: '$500k - $1M',
      teamSize: '50-200',
      growth: 'Very High',
      technology: ['HealthTech', 'React', 'AWS', 'AI'],
      location: 'New York, NY',
      logo: undefined,
      website: 'healthhub.care',
      fundingStatus: 'Series B Raised',
      followers: 8900,
      engagement: 1200,
      founder: 'Dr. Sarah Chen',
      founderId: 'demo-6',
      foundedYear: 2020,
      tags: ['HealthTech', 'AI', 'Telemedicine']
    },
    {
      id: 's5',
      name: 'Web3 Social',
      tagline: 'Decentralized Social Network',
      description: 'A user-owned social platform with verified identities and content ownership.',
      industry: 'Web3',
      stage: 'Pre-seed',
      revenue: 'Pre-revenue',
      teamSize: '2-10',
      growth: 'High',
      technology: ['Web3', 'Solidity', 'React'],
      location: 'Bangalore, India',
      logo: undefined,
      website: 'web3social.io',
      fundingStatus: 'Raising Pre-seed',
      followers: 2100,
      engagement: 430,
      founder: 'Kabir Mehta',
      founderId: 'demo-3',
      foundedYear: 2024,
      tags: ['Web3', 'Social', 'Blockchain']
    }
  ];

  // Demo marketplace listings
  const initialMarketplaceListings: MarketplaceListing[] = [
    {
      id: 'ml1',
      type: 'Startup for Sale',
      title: 'AI-Powered Project Management SaaS',
      description: 'Fully functional SaaS with 2,300 active users and $45k ARR. Strong team and IP.',
      askingPrice: '$250,000',
      revenue: '$45k ARR',
      growth: '85% YoY',
      industry: 'Artificial Intelligence',
      stage: 'Seed',
      location: 'San Francisco, CA',
      listedBy: 'Riya Sharma',
      listedById: 'demo-1',
      tags: ['SaaS', 'AI', 'Productivity'],
      image: undefined,
      listedDate: new Date(Date.now() - 86400000 * 3),
      views: 520,
      interested: 34
    },
    {
      id: 'ml2',
      type: 'Investment Opportunity',
      title: 'ClimateTech Carbon Tracking Platform',
      description: 'Pre-seed startup with $150k pre-seed committed, looking for $350k more.',
      askingPrice: '$350k for 15%',
      revenue: 'Pre-revenue',
      growth: 'High',
      industry: 'ClimateTech',
      stage: 'Pre-seed',
      location: 'Berlin, Germany',
      listedBy: 'Lisa Schmidt',
      listedById: 'demo-5',
      tags: ['Climate', 'SaaS', 'Analytics'],
      image: undefined,
      listedDate: new Date(Date.now() - 86400000 * 2),
      views: 890,
      interested: 67
    },
    {
      id: 'ml3',
      type: 'SaaS for Sale',
      title: 'Email Marketing Automation Tool',
      description: 'Bootstrapped SaaS with $12k MRR, 800 paying customers.',
      askingPrice: '$120,000',
      revenue: '$144k ARR',
      growth: '40% YoY',
      industry: 'SaaS',
      stage: 'Bootstrapped',
      location: 'Remote',
      listedBy: 'Rohit Sharma',
      listedById: 'demo-4',
      tags: ['Email', 'Marketing', 'SaaS'],
      image: undefined,
      listedDate: new Date(Date.now() - 86400000),
      views: 1200,
      interested: 89
    },
    {
      id: 'ml4',
      type: 'Domain for Sale',
      title: 'CryptoNexus.com',
      description: 'Premium .com domain perfect for crypto/web3 projects. 10 years of history.',
      askingPrice: '$45,000',
      revenue: 'N/A',
      growth: 'N/A',
      industry: 'Web3',
      stage: 'N/A',
      location: 'Global',
      listedBy: 'Kabir Mehta',
      listedById: 'demo-3',
      tags: ['Domain', 'Web3', 'Crypto'],
      image: undefined,
      listedDate: new Date(Date.now() - 86400000 * 5),
      views: 450,
      interested: 23
    }
  ];

  // Demo AI recommendations
  const initialAIRecommendations: AIRecommendation[] = [
    {
      id: 'ai-1',
      type: 'Investor',
      name: 'Unnati Chaudhary',
      title: 'Partner @ Peak Capital',
      avatar: undefined,
      bio: 'Early-stage investor focused on fintech and SaaS startups. Love working with passionate founders.',
      matchScore: 95,
      matchReason: 'Perfect industry match (AI/SaaS) + active in your region + has invested in 15 similar startups',
      location: 'Mumbai, India',
      tags: ['Fintech', 'SaaS', 'B2B', 'Seed'],
      verified: true
    },
    {
      id: 'ai-2',
      type: 'Co-founder',
      name: 'Priya Patel',
      title: 'CTO & Co-founder (Former @ Stripe)',
      avatar: undefined,
      bio: 'Full-stack engineer with 8+ years experience building scalable fintech products at Stripe and Coinbase.',
      matchScore: 92,
      matchReason: 'Technical expertise matches your tech stack (React/Node.js) + previous startup experience',
      location: 'San Francisco, CA',
      tags: ['Engineering', 'React', 'Node.js', 'Fintech'],
      verified: true
    },
    {
      id: 'ai-3',
      type: 'Mentor',
      name: 'David Chen',
      title: 'Ex-YC Partner & Founder of 3 Exits',
      avatar: undefined,
      bio: 'Serial entrepreneur turned mentor. Helped 50+ startups through YC and beyond.',
      matchScore: 88,
      matchReason: 'Deep expertise in AI startups + experience scaling from pre-seed to Series B',
      location: 'San Francisco, CA',
      tags: ['Mentorship', 'AI', 'Scaling', 'Funding'],
      verified: true
    },
    {
      id: 'ai-4',
      type: 'Service Provider',
      name: 'LegalStart Pro',
      title: 'Startup Legal Specialists',
      bio: 'Legal firm focused exclusively on startup incorporation, SAFE notes, and fundraising documents.',
      matchScore: 85,
      matchReason: 'Specializes in pre-seed/seed startups in your industry + transparent flat-fee pricing',
      location: 'Remote',
      tags: ['Legal', 'Funding', 'Incorporation'],
      verified: true
    }
  ];

  // Demo product launches
  const initialProductLaunches: ProductLaunch[] = [
    {
      id: 'pl-1',
      title: 'Nebula AI',
      tagline: 'Your AI Co-founder for building startups faster',
      description: 'AI-powered platform that helps you validate ideas, build go-to-market strategies, and create pitch decks in minutes.',
      image: undefined,
      website: 'nebula.ai',
      startupName: 'Nebula AI',
      startupId: 's1',
      founderName: 'Riya Sharma',
      founderAvatar: undefined,
      upvotes: 1240,
      comments: 89,
      category: 'AI',
      featured: true,
      launchedAt: new Date(Date.now() - 3600000 * 2)
    },
    {
      id: 'pl-2',
      title: 'FinFlow',
      tagline: 'Modern accounting for startups',
      description: 'Real-time financial management and analytics for growing startups with integrations to Stripe, QuickBooks, and more.',
      image: undefined,
      website: 'finflow.io',
      startupName: 'FinFlow',
      startupId: 's2',
      founderName: 'Rohit Sharma',
      founderAvatar: undefined,
      upvotes: 890,
      comments: 54,
      category: 'Fintech',
      featured: true,
      launchedAt: new Date(Date.now() - 3600000 * 6)
    },
    {
      id: 'pl-3',
      title: 'EcoTrack',
      tagline: 'Sustainability analytics made simple',
      description: 'Track and reduce your company\'s carbon footprint with real-time data and actionable insights.',
      image: undefined,
      website: 'ecotrack.eco',
      startupName: 'EcoTrack',
      startupId: 's3',
      founderName: 'Lisa Schmidt',
      founderAvatar: undefined,
      upvotes: 560,
      comments: 32,
      category: 'ClimateTech',
      featured: false,
      launchedAt: new Date(Date.now() - 3600000 * 12)
    },
    {
      id: 'pl-4',
      title: 'HealthHub',
      tagline: 'Patient-first telemedicine',
      description: 'Connecting patients with specialists through AI-powered virtual care and personalized treatment plans.',
      image: undefined,
      website: 'healthhub.care',
      startupName: 'HealthHub',
      startupId: 's4',
      founderName: 'Dr. Sarah Chen',
      founderAvatar: undefined,
      upvotes: 2100,
      comments: 123,
      category: 'HealthTech',
      featured: true,
      launchedAt: new Date(Date.now() - 3600000 * 24)
    }
  ];

  // Demo initial posts with engagement scores
  const initialPosts: Post[] = [
    {
      id: '1',
      userId: 'demo-1',
      userName: 'Riya Sharma',
      userRole: 'ARCHITECT',
      userTitle: 'Founder & CEO @ Nebula AI',
      postType: 'Startup Launch',
      intent: 'Seeking Feedback',
      description: 'We\'re building an AI co-founder that helps early-stage teams validate ideas, build strategies, and ship products faster. Looking for feedback from the community!',
      tags: ['AI', 'Startup', 'Launch'],
      likes: 126,
      likedBy: ['demo-2', 'demo-3', 'demo-5', 'demo-6'],
      comments: [
        {
          id: 'c1',
          userId: 'demo-2',
          userName: 'Unnati Chaudhary',
          userRole: 'CATALYST',
          userTitle: 'Partner @ Peak Capital',
          type: 'investor-feedback',
          content: 'This is super interesting! Your approach to combining idea validation with actionable strategy is exactly what early-stage founders need. Would love to connect and learn more about your go-to-market strategy.',
          timestamp: new Date(Date.now() - 3600000),
          likes: 24,
          endorsedBy: ['demo-5'],
          replies: [
            {
              id: 'c1-r1',
              userId: 'demo-1',
              userName: 'Riya Sharma',
              userRole: 'ARCHITECT',
              userTitle: 'Founder & CEO @ Nebula AI',
              type: 'founder-response',
              content: 'Thanks so much Unnati! That means a lot coming from you. Our current GTM is focused on YC and Indie Hackers communities. Would be happy to share our deck!',
              timestamp: new Date(Date.now() - 1800000),
              likes: 18
            }
          ]
        },
        {
          id: 'c2',
          userId: 'demo-6',
          userName: 'Dr. Sarah Chen',
          userRole: 'EXPLORER',
          userTitle: 'Product Lead @ HealthHub',
          type: 'expert-insight',
          content: 'From a product perspective, I\'d recommend focusing on one core workflow first—maybe idea validation—and perfecting that before expanding. Less is more in the early days!',
          timestamp: new Date(Date.now() - 5400000),
          likes: 32,
          endorsedBy: ['demo-3']
        }
      ],
      shares: 18,
      timestamp: new Date(Date.now() - 7200000),
      engagementScore: 88
    },
    {
      id: '2',
      userId: 'demo-2',
      userName: 'Unnati Chaudhary',
      userRole: 'CATALYST',
      userTitle: 'Partner @ Peak Capital',
      postType: 'Investment Opportunity',
      intent: 'Seeking Investment',
      description: 'We are actively investing in fintech startups solving real-world problems in India and SE Asia.',
      tags: ['Fintech', 'Investment', 'Deal'],
      likes: 89,
      likedBy: ['demo-1', 'demo-4'],
      comments: [],
      shares: 12,
      timestamp: new Date(Date.now() - 18000000),
      engagementScore: 72
    },
    {
      id: '3',
      userId: 'demo-3',
      userName: 'Kabir Mehta',
      userRole: 'EXPLORER',
      userTitle: 'Product @ Web3 Labs',
      postType: 'Insight / Research',
      intent: 'Sharing Insight',
      description: 'Curious to know what builders and investors think about the next wave of decentralized social platforms.',
      tags: ['Web3', 'Social', 'Community'],
      likes: 64,
      likedBy: ['demo-2', 'demo-6'],
      comments: [],
      shares: 7,
      timestamp: new Date(Date.now() - 25200000),
      engagementScore: 65
    },
    {
      id: '4',
      userId: 'demo-4',
      userName: 'Rohit Sharma',
      userRole: 'ARCHITECT',
      userTitle: 'Founder @ FinFlow',
      postType: 'Growth Update',
      intent: 'Sharing Progress',
      description: 'Just crossed $50k MRR! Here\'s how we grew from $0 to $50k in 6 months with B2B SaaS.',
      tags: ['SaaS', 'Growth', 'MRR'],
      likes: 312,
      likedBy: ['demo-1', 'demo-2', 'demo-3', 'demo-5', 'demo-6'],
      comments: [],
      shares: 45,
      timestamp: new Date(Date.now() - 3600000 * 24),
      engagementScore: 95
    },
    {
      id: '5',
      userId: 'demo-5',
      userName: 'Lisa Schmidt',
      userRole: 'CATALYST',
      userTitle: 'Angel Investor',
      postType: 'Traction Update',
      intent: 'Sharing Opportunity',
      description: 'Portfolio company EcoTrack just signed their first enterprise client - $120k ARR contract!',
      tags: ['ClimateTech', 'Traction', 'Client'],
      likes: 156,
      likedBy: ['demo-1', 'demo-4'],
      comments: [],
      shares: 28,
      timestamp: new Date(Date.now() - 3600000 * 36),
      engagementScore: 82
    },
    {
      id: '6',
      userId: 'demo-6',
      userName: 'Dr. Sarah Chen',
      userRole: 'EXPLORER',
      userTitle: 'Product Lead @ HealthHub',
      postType: 'Learning Post',
      intent: 'Sharing Knowledge',
      description: '10 things I learned about building telehealth products in regulated markets.',
      tags: ['HealthTech', 'Learning', 'Product'],
      likes: 234,
      likedBy: ['demo-2', 'demo-4'],
      comments: [],
      shares: 56,
      timestamp: new Date(Date.now() - 3600000 * 48),
      engagementScore: 85
    },
    {
      id: '7',
      userId: 'demo-2',
      userName: 'Unnati Chaudhary',
      userRole: 'CATALYST',
      userTitle: 'Partner @ Peak Capital',
      postType: 'Investment Announcement',
      intent: 'Sharing Deal',
      description: 'Thrilled to announce our $500k pre-seed investment in FinFlow!',
      tags: ['Fintech', 'Investment', 'Deal', 'Announcement'],
      likes: 456,
      likedBy: ['demo-1', 'demo-3', 'demo-4', 'demo-5', 'demo-6'],
      comments: [],
      shares: 78,
      timestamp: new Date(Date.now() - 3600000 * 60),
      engagementScore: 92
    },
    {
      id: '8',
      userId: 'demo-3',
      userName: 'Kabir Mehta',
      userRole: 'EXPLORER',
      userTitle: 'Product @ Web3 Labs',
      postType: 'Community Post',
      intent: 'Discussion',
      description: 'Hosting a Twitter Space tonight about the future of decentralized social - come join!',
      tags: ['Community', 'Discussion', 'Space'],
      likes: 89,
      likedBy: ['demo-1', 'demo-2'],
      comments: [],
      shares: 34,
      timestamp: new Date(Date.now() - 3600000 * 6),
      engagementScore: 70
    }
  ];

  // Helper to recursively parse comments with timestamps
  const parseComments = (comments: any[]): Comment[] => {
    return comments.map((comment: any) => ({
      ...comment,
      timestamp: new Date(comment.timestamp),
      replies: comment.replies ? parseComments(comment.replies) : undefined
    }));
  };

  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const [startups, setStartups] = useState<Startup[]>(() => {
    try {
      const saved = localStorage.getItem('triarcora-startups');
      if (!saved) return initialStartups;
      return JSON.parse(saved);
    } catch {
      return initialStartups;
    }
  });

  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>(() => {
    try {
      const saved = localStorage.getItem('triarcora-marketplace');
      if (!saved) return initialMarketplaceListings;
      
      const parsed = JSON.parse(saved);
      return parsed.map((item: any) => ({
        ...item,
        listedDate: new Date(item.listedDate)
      }));
    } catch {
      return initialMarketplaceListings;
    }
  });

  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>(() => {
    try {
      const saved = localStorage.getItem('triarcora-ai-recommendations');
      if (!saved) return initialAIRecommendations;
      return JSON.parse(saved);
    } catch {
      return initialAIRecommendations;
    }
  });

  const [productLaunches, setProductLaunches] = useState<ProductLaunch[]>(() => {
    try {
      const saved = localStorage.getItem('triarcora-product-launches');
      if (!saved) return initialProductLaunches;
      
      const parsed = JSON.parse(saved);
      return parsed.map((item: any) => ({
        ...item,
        launchedAt: new Date(item.launchedAt)
      }));
    } catch {
      return initialProductLaunches;
    }
  });

  const [trendingHashtags, setTrendingHashtags] = useState<HashtagData[]>(() => {
    try {
      const saved = localStorage.getItem('triarcora-trending-hashtags');
      if (!saved) return initialTrendingHashtags;
      
      const parsed = JSON.parse(saved);
      return parsed.map((item: any) => ({
        ...item,
        lastUsed: new Date(item.lastUsed)
      }));
    } catch {
      return initialTrendingHashtags;
    }
  });

  const [savedPosts, setSavedPosts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('triarcora-saved-posts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedCollections, setSavedCollections] = useState<SavedCollection[]>(() => {
    try {
      const saved = localStorage.getItem('triarcora-saved-collections');
      if (!saved) return [];
      
      const parsed = JSON.parse(saved);
      return parsed.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt)
      }));
    } catch {
      return [];
    }
  });

  const [drafts, setDrafts] = useState<Draft[]>(() => {
    try {
      const saved = localStorage.getItem('triarcora-drafts');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return parsed.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }));
    } catch {
      return [];
    }
  });

  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() => {
    try {
      const saved = localStorage.getItem('triarcora-scheduled');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return parsed.map((item: any) => ({
        ...item,
        scheduledAt: new Date(item.scheduledAt),
        createdAt: new Date(item.createdAt)
      }));
    } catch {
      return [];
    }
  });

  const [reposts, setReposts] = useState<Repost[]>(() => {
    try {
      const saved = localStorage.getItem('triarcora-reposts');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return parsed.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt)
      }));
    } catch {
      return [];
    }
  });

  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const saved = localStorage.getItem('triarcora-reports');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return parsed.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt)
      }));
    } catch {
      return [];
    }
  });

  const [mutedUsers, setMutedUsers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('triarcora-muted-users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [hiddenPosts, setHiddenPosts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('triarcora-hidden-posts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notInterestedTopics, setNotInterestedTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('triarcora-not-interested');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pinnedPostIds, setPinnedPostIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('triarcora-pinned-posts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const upvoteProductLaunch = (launchId: string) => {
    setProductLaunches(prev => prev.map(launch => 
      launch.id === launchId ? { ...launch, upvotes: launch.upvotes + 1 } : launch
    ));
  };

  // Calculate engagement score for a post
  const calculateEngagementScore = (post: Post): number => {
    const likesWeight = 1;
    const commentsWeight = 3;
    const sharesWeight = 5;
    const recencyWeight = Math.max(0, 50 - (Date.now() - post.timestamp.getTime()) / (1000 * 60 * 60));
    
    return Math.min(100, 
      (post.likes * likesWeight) + 
      (post.comments.length * commentsWeight) + 
      (post.shares * sharesWeight) + 
      recencyWeight
    );
  };

  // Get trending hashtags
  const getTrendingHashtags = (): HashtagData[] => {
    return [...trendingHashtags].sort((a, b) => {
      const scoreA = a.popularity * 0.3 + a.ecosystemRelevance * 0.25 + a.investorInterest * 0.25 + a.trendVelocity * 0.2;
      const scoreB = b.popularity * 0.3 + b.ecosystemRelevance * 0.25 + b.investorInterest * 0.25 + b.trendVelocity * 0.2;
      return scoreB - scoreA;
    });
  };

  // Save/unsave post
  const savePost = (postId: string) => {
    setSavedPosts(prev => [...prev, postId]);
  };

  const unsavePost = (postId: string) => {
    setSavedPosts(prev => prev.filter(id => id !== postId));
  };

  // Get saved posts
  const getSavedPosts = (): Post[] => {
    return posts.filter(post => savedPosts.includes(post.id));
  };

  // Collections management
  const createCollection = (name: string) => {
    const newCollection: SavedCollection = {
      id: Date.now().toString(),
      name,
      postIds: [],
      createdAt: new Date()
    };
    setSavedCollections(prev => [...prev, newCollection]);
  };

  const addToCollection = (collectionId: string, postId: string) => {
    setSavedCollections(prev => prev.map(col => 
      col.id === collectionId 
        ? { ...col, postIds: [...new Set([...col.postIds, postId])] }
        : col
    ));
  };

  const removeFromCollection = (collectionId: string, postId: string) => {
    setSavedCollections(prev => prev.map(col => 
      col.id === collectionId 
        ? { ...col, postIds: col.postIds.filter(id => id !== postId) }
        : col
    ));
  };

  // Intelligent feed ranking with AI recommendations
  const getIntelligentFeed = (userRole: string, userTags?: string[]): Post[] => {
    // Define role-specific priority tags and weights
    const roleConfig: Record<string, { priorityTags: string[], weights: { tag: number, role: number, engagement: number, recency: number, userMatch: number } }> = {
      'ARCHITECT': {
        priorityTags: ['AI', 'Startup', 'Launch', 'Growth', 'MRR', 'SaaS', 'Founder'],
        weights: { tag: 25, role: 15, engagement: 30, recency: 20, userMatch: 10 }
      },
      'CATALYST': {
        priorityTags: ['Investment', 'Deal', 'Traction', 'Fintech', 'Opportunity', 'Announcement', 'Funding'],
        weights: { tag: 30, role: 20, engagement: 25, recency: 15, userMatch: 10 }
      },
      'EXPLORER': {
        priorityTags: ['Community', 'Discussion', 'Learning', 'Web3', 'Social', 'Product', 'Networking'],
        weights: { tag: 20, role: 10, engagement: 25, recency: 25, userMatch: 20 }
      }
    };

    const config = roleConfig[userRole] || roleConfig['EXPLORER'];

    // Calculate relevance score for each post
    const scoredPosts = posts.map(post => {
      let score = 0;

      // 1. Tag matching
      const matchingPriorityTags = post.tags.filter(tag => 
        config.priorityTags.some(pt => tag.toLowerCase().includes(pt.toLowerCase()))
      );
      score += (matchingPriorityTags.length / config.priorityTags.length) * config.weights.tag;

      // 2. Same role boost
      if (post.userRole === userRole) {
        score += config.weights.role;
      }

      // 3. Engagement score
      const engagementScore = post.engagementScore || calculateEngagementScore(post);
      score += (engagementScore / 100) * config.weights.engagement;

      // 4. Recency
      const hoursAgo = (Date.now() - post.timestamp.getTime()) / (1000 * 60 * 60);
      const recencyScore = Math.max(0, 100 - hoursAgo);
      score += (recencyScore / 100) * config.weights.recency;

      // 5. User tags match
      if (userTags && userTags.length > 0) {
        const matchingUserTags = post.tags.filter(tag => 
          userTags.some(ut => tag.toLowerCase().includes(ut.toLowerCase()))
        );
        score += (matchingUserTags.length / userTags.length) * config.weights.userMatch;
      }

      return { ...post, relevanceScore: score };
    });

    // Sort by relevance score
    scoredPosts.sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore);

    // Return without the score property
    return scoredPosts.map(({ relevanceScore, ...post }) => post);
  };

  useEffect(() => {
    localStorage.setItem('triarcora-ai-recommendations', JSON.stringify(aiRecommendations));
  }, [aiRecommendations]);

  useEffect(() => {
    localStorage.setItem('triarcora-product-launches', JSON.stringify(productLaunches));
  }, [productLaunches]);

  useEffect(() => {
    localStorage.setItem('triarcora-startups', JSON.stringify(startups));
  }, [startups]);

  useEffect(() => {
    localStorage.setItem('triarcora-marketplace', JSON.stringify(marketplaceListings));
  }, [marketplaceListings]);

  useEffect(() => {
    localStorage.setItem('triarcora-posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('triarcora-trending-hashtags', JSON.stringify(trendingHashtags));
  }, [trendingHashtags]);

  useEffect(() => {
    localStorage.setItem('triarcora-saved-posts', JSON.stringify(savedPosts));
  }, [savedPosts]);

  useEffect(() => {
    localStorage.setItem('triarcora-saved-collections', JSON.stringify(savedCollections));
  }, [savedCollections]);

  useEffect(() => {
    localStorage.setItem('triarcora-drafts', JSON.stringify(drafts));
  }, [drafts]);

  useEffect(() => {
    localStorage.setItem('triarcora-scheduled', JSON.stringify(scheduledPosts));
  }, [scheduledPosts]);

  useEffect(() => {
    localStorage.setItem('triarcora-reposts', JSON.stringify(reposts));
  }, [reposts]);

  useEffect(() => {
    localStorage.setItem('triarcora-reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('triarcora-muted-users', JSON.stringify(mutedUsers));
  }, [mutedUsers]);

  useEffect(() => {
    localStorage.setItem('triarcora-hidden-posts', JSON.stringify(hiddenPosts));
  }, [hiddenPosts]);

  useEffect(() => {
    localStorage.setItem('triarcora-not-interested', JSON.stringify(notInterestedTopics));
  }, [notInterestedTopics]);

  useEffect(() => {
    localStorage.setItem('triarcora-pinned-posts', JSON.stringify(pinnedPostIds));
  }, [pinnedPostIds]);

  const addPost = (postData: Omit<Post, 'id' | 'likes' | 'likedBy' | 'comments' | 'shares' | 'timestamp' | 'engagementScore' | 'isSaved'>) => {
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      likes: 0,
      likedBy: [],
      comments: [],
      shares: 0,
      timestamp: new Date(),
      engagementScore: 0
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const likePost = (postId: string) => {
    const userId = userData?.uid || 'current-user'; // Use current user ID
    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      const isLiked = post.likedBy.includes(userId);
      return {
        ...post,
        likedBy: isLiked 
          ? post.likedBy.filter(id => id !== userId) 
          : [...post.likedBy, userId],
        likes: isLiked ? post.likes - 1 : post.likes + 1
      };
    }));
  };

  // Helper to add comment or reply recursively
  const addCommentToTree = (comments: Comment[], newComment: Comment, parentId?: string): Comment[] => {
    if (!parentId) {
      return [...comments, newComment];
    }
    return comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newComment]
        };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: addCommentToTree(comment.replies, newComment, parentId)
        };
      }
      return comment;
    });
  };

  const addComment = (postId: string, commentData: Omit<Comment, 'id' | 'timestamp'>, parentId?: string) => {
    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      timestamp: new Date(),
      likes: 0,
      endorsedBy: [],
      replies: [],
      parentId: parentId
    };
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: addCommentToTree(post.comments, newComment, parentId) } 
        : post
    ));
  };

  // --- New Functions ---
  const editPost = (postId: string, updates: Partial<Omit<Post, 'id' | 'timestamp'>>) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          ...updates,
          isEdited: true,
          editedAt: new Date()
        };
      }
      return post;
    }));
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
    setPinnedPostIds(prev => prev.filter(id => id !== postId));
    setHiddenPosts(prev => prev.filter(id => id !== postId));
  };

  const pinPost = (postId: string) => {
    setPinnedPostIds(prev => {
      const newPinned = [...prev, postId];
      // Max 3 pins
      if (newPinned.length > 3) {
        return newPinned.slice(-3);
      }
      return newPinned;
    });
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, isPinned: true } : post
    ));
  };

  const unpinPost = (postId: string) => {
    setPinnedPostIds(prev => prev.filter(id => id !== postId));
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, isPinned: false } : post
    ));
  };

  const archivePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, isArchived: true } : post
    ));
  };

  const unarchivePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, isArchived: false } : post
    ));
  };

  const repost = (originalPostId: string, comment?: string) => {
    const userId = userData?.uid || 'current-user';
    const user = userData;
    const newRepost: Repost = {
      id: Date.now().toString(),
      originalPostId,
      userId,
      userName: user?.profile?.name || 'User',
      userAvatar: user?.profile?.avatar,
      userRole: user?.profile?.role || 'EXPLORER',
      comment,
      createdAt: new Date()
    };
    setReposts(prev => [...prev, newRepost]);
    setPosts(prev => prev.map(post => 
      post.id === originalPostId ? { ...post, shares: post.shares + 1 } : post
    ));
  };

  const reportPost = (postId: string, reason: string, details?: string) => {
    const userId = userData?.uid || 'current-user';
    const newReport: Report = {
      id: Date.now().toString(),
      postId,
      reporterId: userId,
      reason,
      details,
      createdAt: new Date(),
      status: 'pending'
    };
    setReports(prev => [...prev, newReport]);
  };

  const muteUser = (userId: string) => {
    setMutedUsers(prev => [...prev, userId]);
  };

  const unmuteUser = (userId: string) => {
    setMutedUsers(prev => prev.filter(id => id !== userId));
  };

  const hidePost = (postId: string) => {
    setHiddenPosts(prev => [...prev, postId]);
  };

  const unhidePost = (postId: string) => {
    setHiddenPosts(prev => prev.filter(id => id !== postId));
  };

  const markNotInterested = (topics: string[]) => {
    setNotInterestedTopics(prev => [...new Set([...prev, ...topics])]);
  };

  const saveDraft = (draft: Omit<Draft, 'id' | 'createdAt'>) => {
    const newDraft: Draft = {
      ...draft,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setDrafts(prev => [...prev, newDraft]);
  };

  const updateDraft = (draftId: string, updates: Partial<Draft>) => {
    setDrafts(prev => prev.map(draft => 
      draft.id === draftId ? { ...draft, ...updates, updatedAt: new Date() } : draft
    ));
  };

  const deleteDraft = (draftId: string) => {
    setDrafts(prev => prev.filter(draft => draft.id !== draftId));
  };

  const publishDraft = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      addPost({
        userId: draft.userId,
        userName: userData?.profile?.name || 'User',
        userAvatar: userData?.profile?.avatar,
        userRole: draft.role,
        userTitle: userData?.profile?.title,
        postType: draft.postType,
        intent: draft.intent,
        description: draft.description,
        tags: draft.tags
      });
      deleteDraft(draftId);
    }
  };

  const getDraftsByUser = (userId: string) => {
    return drafts.filter(d => d.userId === userId);
  };

  const schedulePost = (post: Omit<ScheduledPost, 'id' | 'createdAt'>) => {
    const newScheduled: ScheduledPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setScheduledPosts(prev => [...prev, newScheduled]);
  };

  const cancelScheduledPost = (postId: string) => {
    setScheduledPosts(prev => prev.filter(p => p.id !== postId));
  };

  const publishScheduledPost = (postId: string) => {
    const scheduled = scheduledPosts.find(p => p.id === postId);
    if (scheduled) {
      addPost({
        userId: scheduled.userId,
        userName: userData?.profile?.name || 'User',
        userAvatar: userData?.profile?.avatar,
        userRole: userData?.profile?.role || 'EXPLORER',
        userTitle: userData?.profile?.title,
        postType: scheduled.postType,
        intent: scheduled.intent,
        description: scheduled.description,
        tags: scheduled.tags
      });
      cancelScheduledPost(postId);
    }
  };

  const editScheduledPost = (postId: string, updates: Partial<ScheduledPost>) => {
    setScheduledPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, ...updates } : p
    ));
  };

  const getUserPosts = (userId: string) => {
    return posts.filter(p => p.userId === userId && !p.isArchived);
  };

  const getPinnedPosts = () => {
    return posts.filter(p => pinnedPostIds.includes(p.id));
  };

  const getArchivedPosts = (userId: string) => {
    return posts.filter(p => p.userId === userId && p.isArchived);
  };

  const getScheduledPosts = (userId: string) => {
    return scheduledPosts.filter(p => p.userId === userId);
  };

  const getReposts = () => {
    return reposts;
  };

  const copyPostLink = (postId: string) => {
    const link = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(link);
    return link;
  };

  const copyPostText = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    const text = post?.description || '';
    navigator.clipboard.writeText(text);
    return text;
  };

  // AI-Powered Discovery: Filter and rank posts based on role and interests
  const getFilteredFeed = (userRole: string, userTags?: string[]): Post[] => {
    // Define role-specific priority tags
    const rolePriorityTags: Record<string, string[]> = {
      'ARCHITECT': ['Startup', 'Launch', 'Growth', 'MRR', 'AI', 'SaaS'],
      'CATALYST': ['Investment', 'Deal', 'Traction', 'Fintech', 'Opportunity', 'Announcement'],
      'EXPLORER': ['Community', 'Discussion', 'Learning', 'Web3', 'Social', 'Product']
    };

    const priorityTags = rolePriorityTags[userRole] || [];

    // Calculate a relevance score for each post
    const scoredPosts = posts.map(post => {
      let score = 0;

      // Boost posts that match priority tags
      const matchingPriorityTags = post.tags.filter(tag => 
        priorityTags.some(pt => tag.toLowerCase().includes(pt.toLowerCase()))
      );
      score += matchingPriorityTags.length * 10;

      // Boost posts from same role
      if (post.userRole === userRole) {
        score += 15;
      }

      // Boost popular posts (likes and comments)
      score += Math.min(post.likes * 0.5, 50);
      score += Math.min(post.comments.length * 2, 30);

      // Boost recent posts
      const hoursAgo = (Date.now() - post.timestamp.getTime()) / (1000 * 60 * 60);
      score += Math.max(0, 50 - hoursAgo);

      // Boost posts matching user tags if available
      if (userTags) {
        const matchingUserTags = post.tags.filter(tag => 
          userTags.some(ut => tag.toLowerCase().includes(ut.toLowerCase()))
        );
        score += matchingUserTags.length * 8;
      }

      return { ...post, score };
    });

    // Sort posts by relevance score (descending)
    scoredPosts.sort((a, b) => b.score - a.score);

    // Return without the score property
    return scoredPosts.map(({ score, ...post }) => post);
  };

  return (
    <PostContext.Provider value={{ 
      posts, 
      demoUsers, 
      startups, 
      marketplaceListings, 
      aiRecommendations, 
      productLaunches,
      trendingHashtags,
      savedPosts,
      savedCollections,
      drafts,
      scheduledPosts,
      reposts,
      reports,
      mutedUsers,
      hiddenPosts,
      notInterestedTopics,
      pinnedPostIds,
      addPost, 
      likePost, 
      addComment, 
      upvoteProductLaunch, 
      getFilteredFeed,
      getTrendingHashtags,
      savePost,
      unsavePost,
      getSavedPosts,
      createCollection,
      addToCollection,
      removeFromCollection,
      getIntelligentFeed,
      editPost,
      deletePost,
      pinPost,
      unpinPost,
      archivePost,
      unarchivePost,
      repost,
      reportPost,
      muteUser,
      unmuteUser,
      hidePost,
      unhidePost,
      markNotInterested,
      saveDraft,
      updateDraft,
      deleteDraft,
      publishDraft,
      getDraftsByUser,
      schedulePost,
      cancelScheduledPost,
      publishScheduledPost,
      editScheduledPost,
      getUserPosts,
      getPinnedPosts,
      getArchivedPosts,
      getScheduledPosts,
      getReposts,
      copyPostLink,
      copyPostText
    }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};
