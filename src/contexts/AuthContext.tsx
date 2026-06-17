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
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  sendEmailVerification,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp,
  deleteDoc,
  writeBatch,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { app } from '../firebase';

interface ProfileData {
  uid: string;
  name: string;
  username?: string;
  email: string;
  photoURL: string;
  role: string | null;
  roles?: string[];
  accountType: string;
  createdAt: any;
  lastLoginAt?: any;
  isVerified: boolean;
  prestigeLevel: number;
  trustIndex: number;
  headline?: string;
  connections?: string[];
}

interface AuthContextType {
  user: User | null;
  profile: ProfileData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateProfileRole: (role: string) => Promise<void>;
  deleteAccount: (currentPassword: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  checkEmailVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Optimize Google login speed and account picker experience
provider.setCustomParameters({
  prompt: 'select_account',
  ux_mode: 'popup',
  access_type: 'online'
});

const getFriendlyErrorMessage = (error: any): string => {
  const errorCode = error.code || '';
  
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/network-request-failed':
      return 'Network error. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please check your email and password.';
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed.';
    case 'auth/popup-blocked':
      return 'Popup was blocked. Please allow popups and try again.';
    case 'auth/cancelled-popup-request':
    case 'auth/popup-closed-by-user':
      return 'Login cancelled. Please try again.';
    case 'auth/missing-email':
      return 'Please enter your email.';
    case 'auth/missing-password':
      return 'Please enter your password.';
    default:
      return 'An error occurred. Please try again later.';
  }
};

const createUserProfile = async (user: User, name: string = ''): Promise<ProfileData> => {
  const userRef = doc(db, 'userProfiles', user.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data() as ProfileData;
  }

  const profileData: ProfileData = {
    uid: user.uid,
    name: name || user.displayName || 'Anonymous',
    username: name ? name.toLowerCase().replace(/\s+/g, '') : '',
    email: user.email || '',
    photoURL: user.photoURL || '',
    role: null,
    roles: [],
    accountType: 'personal',
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
    isVerified: user.emailVerified,
    prestigeLevel: 1,
    trustIndex: 50,
    headline: '',
    connections: []
  };

  await setDoc(userRef, profileData);
  return profileData;
};

const loadAndUpdateUserProfile = async (user: User): Promise<ProfileData> => {
  const userRef = doc(db, 'userProfiles', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error('User profile not found');
  }

  // Update lastLoginAt and isVerified without overwriting other data
  await setDoc(userRef, { 
    lastLoginAt: serverTimestamp(),
    isVerified: user.emailVerified
  }, { merge: true });

  // Fetch the updated profile
  const updatedDoc = await getDoc(userRef);
  return updatedDoc.data() as ProfileData;
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
          // Check if profile exists first
          const userRef = doc(db, 'userProfiles', firebaseUser.uid);
          const userDoc = await getDoc(userRef);
          
          let userProfile;
          if (userDoc.exists()) {
            // Existing user: load and update lastLoginAt
            userProfile = await loadAndUpdateUserProfile(firebaseUser);
          } else {
            // New user: create profile (only happens once on first login/signup)
            userProfile = await createUserProfile(firebaseUser);
          }
          
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
          const userRef = doc(db, 'userProfiles', result.user.uid);
          const userDoc = await getDoc(userRef);
          
          let userProfile;
          if (userDoc.exists()) {
            userProfile = await loadAndUpdateUserProfile(result.user);
          } else {
            userProfile = await createUserProfile(result.user);
          }
          
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
    // Send verification email
    await sendEmailVerification(userCredential.user);
    // Explicitly create new profile only on signup
    const newProfile = await createUserProfile(userCredential.user, name);
    setProfile(newProfile);
    
    // Save email, password, and name in localStorage
    localStorage.setItem('triarcora-email', email);
    localStorage.setItem('triarcora-password', password);
    localStorage.setItem('triarcora-name', name);
  };

  const sendVerificationEmail = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No user logged in');
    }
    await sendEmailVerification(currentUser);
  };

  const checkEmailVerification = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    // Refresh user to get latest verification status
    await currentUser.reload();
    
    // Update isVerified in profile (use merge: true to not overwrite other fields)
    if (currentUser.emailVerified) {
      const userRef = doc(db, 'userProfiles', currentUser.uid);
      await setDoc(userRef, { isVerified: true }, { merge: true });
      
      // Refresh profile in state
      const updatedDoc = await getDoc(userRef);
      if (updatedDoc.exists()) {
        setProfile(updatedDoc.data() as ProfileData);
      }
    }
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Load existing profile and update lastLoginAt (do NOT create new profile)
    const userProfile = await loadAndUpdateUserProfile(userCredential.user);
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
      
      // Do Firestore operations in background to make login feel faster
      const processUserProfile = async () => {
        const userRef = doc(db, 'userProfiles', userCredential.user.uid);
        const userDoc = await getDoc(userRef);
        
        let userProfile;
        if (userDoc.exists()) {
          // Existing user: load and update lastLoginAt
          userProfile = await loadAndUpdateUserProfile(userCredential.user);
        } else {
          // New user: create profile
          userProfile = await createUserProfile(userCredential.user);
        }
        
        setProfile(userProfile);
      };
      
      // Start processing in background, navigate immediately
      processUserProfile().catch(err => console.error('[AuthContext] Background profile processing error:', err));
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

  const sendPasswordResetEmail = async (email: string) => {
    await firebaseSendPasswordResetEmail(auth, email);
    console.log('[AuthContext] Password reset email sent to:', email);
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

  const updateProfileRole = async (roleOrRoles: string | string[]) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    const rolesArray = Array.isArray(roleOrRoles) 
      ? roleOrRoles.map(r => r.toUpperCase()) 
      : [roleOrRoles.toUpperCase()];
    
    const userRef = doc(db, 'userProfiles', currentUser.uid);
    await setDoc(userRef, { 
      role: rolesArray[0], 
      roles: rolesArray 
    }, { merge: true });
    
    const updatedProfile = await getDoc(userRef);
    if (updatedProfile.exists()) {
      setProfile(updatedProfile.data() as ProfileData);
    }
  };

  const deleteAccount = async (currentPassword: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error('No user logged in');
    }

    // Step 1: Reauthenticate the user
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);

    // Step 2: Delete user document, but KEEP ALL POSTS!
    const userRef = doc(db, 'userProfiles', currentUser.uid);
    await deleteDoc(userRef);

    // Step 3: Delete the user from Firebase Auth
    await currentUser.delete();

    // Step 4: Clear local storage and state
    localStorage.clear();
    setUser(null);
    setProfile(null);
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
      sendPasswordResetEmail, 
      changePassword,
      updateProfileRole,
      deleteAccount,
      sendVerificationEmail,
      checkEmailVerification
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

export { getFriendlyErrorMessage };
