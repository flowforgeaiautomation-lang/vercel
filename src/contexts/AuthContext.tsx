import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { app } from '../firebase';

interface ProfileData {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  role: string | null;
  accountType: string;
  createdAt: any;
  isVerified: boolean;
  prestigeLevel: number;
  trustIndex: number;
}

interface AuthContextType {
  user: User | null;
  profile: ProfileData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileRole: (role: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const createUserProfile = async (user: User, name: string = ''): Promise<ProfileData> => {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data() as ProfileData;
  }

  const profileData: ProfileData = {
    uid: user.uid,
    name: name || user.displayName || 'Anonymous',
    email: user.email || '',
    photoURL: user.photoURL || '',
    role: null,
    accountType: 'personal',
    createdAt: serverTimestamp(),
    isVerified: user.emailVerified,
    prestigeLevel: 1,
    trustIndex: 50
  };

  await setDoc(userRef, profileData);
  return profileData;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        console.error('[AuthContext] Error setting persistence:', error);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userProfile = await createUserProfile(firebaseUser);
          setProfile(userProfile);
        } catch (error) {
          console.error('[AuthContext] Error loading profile:', error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    const handleRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result && result.user) {
        const userProfile = await createUserProfile(result.user);
        setProfile(userProfile);
      }
    } catch {
      // Silently ignore all errors from getRedirectResult - it's safe
    }
  };
    handleRedirectResult();

    return unsubscribe;
  }, []);

  const signup = async (name: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newProfile = await createUserProfile(userCredential.user, name);
    setProfile(newProfile);
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userProfile = await createUserProfile(userCredential.user);
    setProfile(userProfile);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  const googleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      await createUserProfile(userCredential.user);
    } catch (error: any) {
      console.error('[AuthContext] Google login error:', error);
      if (
        error.code === 'auth/popup-blocked' || 
        error.code === 'auth/cancelled-popup-request' || 
        error.code === 'auth/popup-closed-by-user'
      ) {
        await signInWithRedirect(auth, provider);
      } else {
        throw error;
      }
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('[AuthContext] resetPassword error:', error);
      throw error;
    }
  };

  const updateProfileRole = async (role: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    const userRef = doc(db, 'users', currentUser.uid);
    await setDoc(userRef, { role: role.toUpperCase() }, { merge: true });
    
    const updatedProfile = await getDoc(userRef);
    if (updatedProfile.exists()) {
      setProfile(updatedProfile.data() as ProfileData);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      login, 
      signup, 
      logout, 
      googleLogin, 
      resetPassword, 
      updateProfileRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
