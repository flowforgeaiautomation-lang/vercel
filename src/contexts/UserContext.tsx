import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

interface UserData {
  uid: string;
  mainRole: string;
  extraRole: string | null;
  isDemo: boolean;
  displayName?: string;
  username?: string;
  email?: string;
  coverImage?: string;
  skills?: string[];
  industries?: string[];
  startupCount?: number;
  investmentCount?: number;
  feedbackScore?: number;
  successfulMatches?: number;
  trustScore?: number;
  executionScore?: number;
  prestigeLevel?: string;
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
  architectProfile?: any;
  catalystProfile?: any;
  explorerProfile?: any;
  activities?: any[];
  assets?: any[];
}

interface UserContextType {
  userData: UserData | null;
  loading: boolean;
  isDemo: boolean;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  updateUserData: (newData: Partial<UserData>) => void;
  setCurrentUserId: (userId: string) => void;
  createNewUserProfile: () => void;
  switchToDemo: () => void;
  switchToReal: () => void;
  uploadImage: (file: File, path: string) => Promise<string>;
  deleteImage: (path: string) => Promise<void>;
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
    name: "Arjun Malhotra",
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

const getDemoUserData = (): UserData => {
  const selectedRole = localStorage.getItem('selectedRole') || 'ARCHITECT';
  const role = selectedRole.toUpperCase();
  const roleData = ROLE_DATA[role] || ROLE_DATA['ARCHITECT'];
  
  return {
    uid: 'demo-user',
    mainRole: role,
    extraRole: null,
    isDemo: true,
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
      reputationTrend: 5,
      startupsBuilt: 3,
      startupsBuiltDetail: '3 startups built',
      startupsBacked: 0,
      startupsBackedDetail: 'No backing yet',
      avgFeedbackScore: 4.8,
      feedbackCount: 47,
      successfulMatches: 12,
      successfulMatchesDetail: '12 successful matches'
    },
    catalystProfile: {},
    explorerProfile: {},
    activities: [],
    assets: []
  };
};

// Empty real user profile data
const getEmptyRealUserData = (userId: string, role: string, name: string = '', email: string = ''): UserData => {
  const selectedRole = role || localStorage.getItem('selectedRole') || 'ARCHITECT';
  return {
    uid: userId,
    mainRole: selectedRole.toUpperCase(),
    extraRole: null,
    isDemo: false,
    displayName: name,
    email: email,
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
    catalystProfile: {},
    explorerProfile: {},
    activities: [],
    assets: []
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
          let firestoreData;
          if (!docSnap.exists()) {
            firestoreData = getEmptyRealUserData(user.uid, authProfile?.role || '', authProfile?.name || '', authProfile?.email || '');
            await setDoc(userRef, firestoreData);
          } else {
            firestoreData = docSnap.data() as UserData;
          }
          setUserData(firestoreData);
          setCurrentUserId(user.uid);
        } else {
          // Demo user: reset to demo data on refresh
          console.log('[UserContext] Initializing with demo data');
          const demoData = getDemoUserData();
          setUserData(demoData);
          setCurrentUserId('demo-user');
          localStorage.setItem('currentUserId', 'demo-user');
          saveUserProfile('demo-user', demoData);
        }
      } catch (error) {
        console.error('[UserContext] Error loading user data:', error);
        // Fallback to demo mode on error
        const demoData = getDemoUserData();
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

  return (
    <UserContext.Provider value={{ 
      userData, 
      loading,
      isDemo: userData?.isDemo || false,
      setUserData, 
      updateUserData, 
      setCurrentUserId, 
      createNewUserProfile,
      switchToDemo,
      switchToReal,
      uploadImage,
      deleteImage
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
