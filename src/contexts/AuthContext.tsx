import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User,
  setPersistence,
  browserLocalPersistence,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
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
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  quickResetPassword: (email: string, newPassword: string, confirmPassword: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateProfileRole: (role: string) => Promise<void>;
  setDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});

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
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

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
    
    // Save email, password, and name in localStorage
    localStorage.setItem('triarcora-email', email);
    localStorage.setItem('triarcora-password', password);
    localStorage.setItem('triarcora-name', name);
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userProfile = await createUserProfile(userCredential.user);
    setProfile(userProfile);
    
    // Save email and password in localStorage
    localStorage.setItem('triarcora-email', email);
    localStorage.setItem('triarcora-password', password);
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

  const quickResetPassword = async (email: string, newPassword: string) => {
    localStorage.setItem('triarcora-email', email);
    localStorage.setItem('triarcora-password', newPassword);
    console.log('[AuthContext] Password saved locally:', email);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error('No user logged in');
    }

    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPassword);
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

  const setDemoMode = () => {
    setIsDemoMode(true);
    setProfile({
      uid: 'demo-user',
      name: 'Demo User',
      email: 'demo@triarcora.com',
      photoURL: '',
      role: null,
      accountType: 'personal',
      createdAt: new Date(),
      isVerified: true,
      prestigeLevel: 1,
      trustIndex: 50
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      isDemoMode,
      login, 
      signup, 
      logout, 
      googleLogin, 
      quickResetPassword, 
      changePassword,
      updateProfileRole,
      setDemoMode
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
