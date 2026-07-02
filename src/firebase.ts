// Firebase Configuration
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  deleteDoc,
  addDoc,
  orderBy,
  limit,
  Timestamp,
  increment,
  runTransaction,
  writeBatch
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBnCI-IoQJNEbeLjJCwvDrBRkTwiFVwTHA",
  authDomain: "triventa-e114a.firebaseapp.com",
  databaseURL: "https://triventa-e114a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "triventa-e114a",
  storageBucket: "triventa-e114a.firebasestorage.app",
  messagingSenderId: "437896346659",
  appId: "1:437896346659:web:1657f19cdf5a2bdee9c596",
  measurementId: "G-1VB2L4PZWQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Use Firestore without persistent listeners
const storage = getStorage(app);
const auth = getAuth(app);

// Interfaces
export interface UserProfile {
  uid: string;
  name: string;
  username?: string;
  email: string;
  photoURL: string;
  role: 'Architect' | 'Catalyst' | 'Explorer' | null;
  accountType: string;
  createdAt: Timestamp;
  lastLoginAt?: Timestamp;
  isVerified: boolean;
  prestigeLevel: number;
  trustIndex: number;
  headline?: string;
  connections?: string[];
  triveonScore: number;
  company?: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Timestamp;
  isRead: boolean;
  readBy: string[];
  readAt?: Timestamp;
  reactions?: { [key: string]: string[] };
  isEdited: boolean;
  originalContent?: string;
  isDeleted: boolean;
  isForwarded?: boolean;
  forwardedFrom?: string;
  replyTo?: {
    messageId: string;
    senderName: string;
    content: string;
  };
  attachment?: {
    type: string;
    url: string;
    name: string;
  };
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  participants: string[];
  lastMessage?: {
    id: string;
    senderId: string;
    content: string;
    timestamp: Timestamp;
  };
  unreadCounts: { [key: string]: number };
  isPinned?: { [key: string]: boolean };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  name?: string;
  photoURL?: string;
  description?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  photoURL?: string;
  createdBy: string;
  participants: string[];
  admins: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  type: 'startup' | 'investor' | 'community';
}

export interface Signal {
  id: string;
  recipientId: string;
  type: 'newMessage' | 'newConnection' | 'messageRequest' | 'groupInvite' | 'mention' | 'reply';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: Timestamp;
  data?: { [key: string]: any };
}

export interface MessageRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  lastMessage?: string;
  lastMessageAt?: Timestamp;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TypingStatus {
  userId: string;
  isTyping: boolean;
  lastUpdated: Timestamp;
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Helper to generate conversation ID
export const getConversationId = (userId1: string, userId2: string): string => {
  return userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
};

// CRUD Functions
export const sendConnectionRequest = async (fromUserId: string, toUserId: string): Promise<void> => {
  const existingRequestQuery = query(
    collection(db, 'connectionRequests'),
    where('fromUserId', 'in', [fromUserId, toUserId]),
    where('toUserId', 'in', [fromUserId, toUserId])
  );
  const existingRequestSnapshot = await getDocs(existingRequestQuery);
  
  if (!existingRequestSnapshot.empty) {
    throw new Error('Connection request already exists');
  }

  const requestId = `${fromUserId}_${toUserId}`;
  const requestRef = doc(db, 'connectionRequests', requestId);
  
  await setDoc(requestRef, {
    id: requestId,
    fromUserId,
    toUserId,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  // Create signal
  await addDoc(collection(db, 'signals'), {
    recipientId: toUserId,
    type: 'newConnection',
    title: 'New Connection Request',
    body: 'Someone wants to connect with you',
    isRead: false,
    createdAt: serverTimestamp(),
    data: { fromUserId }
  });
};

export const acceptConnectionRequest = async (requestId: string, fromUserId: string, toUserId: string): Promise<void> => {
  const requestRef = doc(db, 'connectionRequests', requestId);
  await updateDoc(requestRef, {
    status: 'accepted',
    updatedAt: serverTimestamp()
  });

  const fromUserRef = doc(db, 'users', fromUserId);
  const toUserRef = doc(db, 'users', toUserId);
  
  await updateDoc(fromUserRef, {
    connections: arrayUnion(toUserId)
  });
  
  await updateDoc(toUserRef, {
    connections: arrayUnion(fromUserId)
  });

  // Create conversation
  const conversationId = getConversationId(fromUserId, toUserId);
  await setDoc(doc(db, 'conversations', conversationId), {
    id: conversationId,
    type: 'direct',
    participants: [fromUserId, toUserId],
    unreadCounts: { [fromUserId]: 0, [toUserId]: 0 },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const declineConnectionRequest = async (requestId: string): Promise<void> => {
  const requestRef = doc(db, 'connectionRequests', requestId);
  await deleteDoc(requestRef);
};

export const getIncomingConnectionRequests = async (userId: string): Promise<(ConnectionRequest & { fromUser: UserProfile })[]> => {
  const requestsQuery = query(
    collection(db, 'connectionRequests'),
    where('toUserId', '==', userId),
    where('status', '==', 'pending')
  );
  
  const requestsSnapshot = await getDocs(requestsQuery);
  const requests = requestsSnapshot.docs.map(doc => doc.data() as ConnectionRequest);
  
  const requestsWithUsers = await Promise.all(
    requests.map(async (request) => {
      const userDoc = await getDoc(doc(db, 'users', request.fromUserId));
      const fromUser = userDoc.data() as UserProfile;
      return { ...request, fromUser };
    })
  );
  
  return requestsWithUsers;
};

export const getSentConnectionRequests = async (userId: string): Promise<(ConnectionRequest & { toUser: UserProfile })[]> => {
  const requestsQuery = query(
    collection(db, 'connectionRequests'),
    where('fromUserId', '==', userId),
    where('status', '==', 'pending')
  );
  
  const requestsSnapshot = await getDocs(requestsQuery);
  const requests = requestsSnapshot.docs.map(doc => doc.data() as ConnectionRequest);
  
  const requestsWithUsers = await Promise.all(
    requests.map(async (request) => {
      const userDoc = await getDoc(doc(db, 'users', request.toUserId));
      const toUser = userDoc.data() as UserProfile;
      return { ...request, toUser };
    })
  );
  
  return requestsWithUsers;
};

export const sendMessage = async (
  conversationId: string,
  senderId: string,
  content: string,
  replyTo?: Message
): Promise<void> => {
  const messageData: any = {
    id: '',
    senderId,
    content,
    timestamp: serverTimestamp(),
    isRead: false,
    readBy: [senderId],
    reactions: {},
    isEdited: false,
    isDeleted: false
  };

  if (replyTo) {
    messageData.replyTo = {
      messageId: replyTo.id,
      senderName: replyTo.senderId === senderId ? 'You' : 'User',
      content: replyTo.content
    };
  }

  const messageRef = await addDoc(collection(db, 'conversations', conversationId, 'messages'), messageData);
  await updateDoc(messageRef, { id: messageRef.id });

  const conversationRef = doc(db, 'conversations', conversationId);
  await updateDoc(conversationRef, {
    lastMessage: {
      id: messageRef.id,
      senderId,
      content,
      timestamp: serverTimestamp()
    },
    updatedAt: serverTimestamp()
  });
};

export const getMutualConnectionsCount = async (userId1: string, userId2: string): Promise<number> => {
  const user1Doc = await getDoc(doc(db, 'users', userId1));
  const user2Doc = await getDoc(doc(db, 'users', userId2));
  
  const user1Connections = (user1Doc.data() as UserProfile)?.connections || [];
  const user2Connections = (user2Doc.data() as UserProfile)?.connections || [];
  
  const mutualConnections = user1Connections.filter(id => user2Connections.includes(id));
  return mutualConnections.length;
};

export { db, storage, auth, app };

// ─────────────────────────────────────────────────────────────
// FOLLOW / UNFOLLOW SYSTEM
// ─────────────────────────────────────────────────────────────

export interface FollowUser {
  uid: string;
  name: string;
  username: string;
  profileImage: string;
  mainRole: string;
  title: string;
  isVerified: boolean;
  trustIndex: number;
  verificationLevel: string;
}

/** Follow a user — prevents duplicates, updates counters atomically */
export const followUser = async (currentUserId: string, targetUserId: string): Promise<void> => {
  if (currentUserId === targetUserId) return;

  const followDocId = `${currentUserId}_${targetUserId}`;
  const followRef = doc(db, 'follows', followDocId);
  const existingDoc = await getDoc(followRef);
  if (existingDoc.exists()) return; // already following

  const batch = writeBatch(db);

  // Create follow relationship
  batch.set(followRef, {
    followerId: currentUserId,
    followingId: targetUserId,
    createdAt: serverTimestamp()
  });

  // Increment counters
  batch.update(doc(db, 'users', currentUserId), { followingCount: increment(1) });
  batch.update(doc(db, 'users', targetUserId), { followersCount: increment(1) });

  await batch.commit();

  // Send notification to target user
  await addDoc(collection(db, 'signals'), {
    recipientId: targetUserId,
    type: 'newFollow',
    title: 'New Follower',
    body: 'Someone started following you on TRIARCORA.',
    isRead: false,
    createdAt: serverTimestamp(),
    data: { fromUserId: currentUserId }
  });
};

/** Unfollow a user — removes relationship, decrements counters */
export const unfollowUser = async (currentUserId: string, targetUserId: string): Promise<void> => {
  const followDocId = `${currentUserId}_${targetUserId}`;
  const followRef = doc(db, 'follows', followDocId);
  const existingDoc = await getDoc(followRef);
  if (!existingDoc.exists()) return;

  const batch = writeBatch(db);
  batch.delete(followRef);
  batch.update(doc(db, 'users', currentUserId), { followingCount: increment(-1) });
  batch.update(doc(db, 'users', targetUserId), { followersCount: increment(-1) });
  await batch.commit();
};

/** Check if currentUser follows targetUser */
export const isFollowing = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
  const followDocId = `${currentUserId}_${targetUserId}`;
  const followRef = doc(db, 'follows', followDocId);
  const snap = await getDoc(followRef);
  return snap.exists();
};

/** Get all users that userId is following — returns profile data */
export const getFollowingList = async (userId: string): Promise<FollowUser[]> => {
  const q = query(collection(db, 'follows'), where('followerId', '==', userId), orderBy('createdAt', 'desc'), limit(100));
  const snap = await getDocs(q);
  const targetIds = snap.docs.map(d => d.data().followingId as string);
  if (targetIds.length === 0) return [];
  const profiles = await Promise.all(targetIds.map(uid => getDoc(doc(db, 'users', uid))));
  return profiles.filter(p => p.exists()).map(p => {
    const d = p.data() as any;
    return {
      uid: p.id,
      name: d?.profile?.name || d?.displayName || 'Unknown',
      username: d?.username || '',
      profileImage: d?.profile?.profileImage || '',
      mainRole: d?.mainRole || '',
      title: d?.profile?.title || '',
      isVerified: d?.verification?.verificationLevel === 'TRIVEON Verified' || d?.verification?.verificationLevel === 'Professional Verified',
      trustIndex: d?.verification?.trustScore || 0,
      verificationLevel: d?.verification?.verificationLevel || 'Unverified'
    };
  });
};

/** Get all users that follow userId */
export const getFollowersList = async (userId: string): Promise<FollowUser[]> => {
  const q = query(collection(db, 'follows'), where('followingId', '==', userId), orderBy('createdAt', 'desc'), limit(100));
  const snap = await getDocs(q);
  const followerIds = snap.docs.map(d => d.data().followerId as string);
  if (followerIds.length === 0) return [];
  const profiles = await Promise.all(followerIds.map(uid => getDoc(doc(db, 'users', uid))));
  return profiles.filter(p => p.exists()).map(p => {
    const d = p.data() as any;
    return {
      uid: p.id,
      name: d?.profile?.name || d?.displayName || 'Unknown',
      username: d?.username || '',
      profileImage: d?.profile?.profileImage || '',
      mainRole: d?.mainRole || '',
      title: d?.profile?.title || '',
      isVerified: d?.verification?.verificationLevel === 'TRIVEON Verified' || d?.verification?.verificationLevel === 'Professional Verified',
      trustIndex: d?.verification?.trustScore || 0,
      verificationLevel: d?.verification?.verificationLevel || 'Unverified'
    };
  });
};

/** Get follow counts for a user */
export const getFollowCounts = async (userId: string): Promise<{ following: number; followers: number }> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  const data = userDoc.data() as any;
  return {
    following: data?.followingCount || 0,
    followers: data?.followersCount || 0
  };
};

// ─────────────────────────────────────────────────────────────
// TRUST INDEX SYSTEM
// ─────────────────────────────────────────────────────────────

export interface TrustIndex {
  total: number;
  identityScore: number;
  verificationScore: number;
  activityScore: number;
  communityScore: number;
  updatedAt: Timestamp | null;
}

/** Calculate trust index from userData and save to Firestore */
export const calculateAndSaveTrustIndex = async (userId: string, userData: any): Promise<number> => {
  const v = userData?.verification || {};
  const profile = userData?.profile || {};

  // Identity score (25 pts)
  let identity = 0;
  if (v.emailVerified) identity += 10;
  if (v.phoneVerified) identity += 8;
  if (v.identityVerified) identity += 7;
  identity = Math.min(25, identity);

  // Verification score (25 pts)
  let verification = 0;
  if (v.startupVerified) verification += 5;
  if (v.investorVerified) verification += 5;
  if (v.explorerVerified) verification += 5;
  if (v.websiteVerified) verification += 5;
  if (v.linkedinVerified) verification += 5;
  verification = Math.min(25, verification);

  // Activity score (25 pts)
  let activity = 0;
  if (profile.name) activity += 5;
  if (profile.bio) activity += 5;
  if (profile.title) activity += 3;
  if (profile.location) activity += 3;
  if (profile.linkedin) activity += 3;
  if (profile.profileImage) activity += 6;
  activity = Math.min(25, activity);

  // Community score (25 pts) — based on followers/connections
  const followingCount = userData?.followingCount || 0;
  const followersCount = userData?.followersCount || 0;
  const community = Math.min(25, Math.floor((followingCount + followersCount) / 4));

  const total = identity + verification + activity + community;

  const trustData: TrustIndex = {
    total,
    identityScore: identity,
    verificationScore: verification,
    activityScore: activity,
    communityScore: community,
    updatedAt: null
  };

  await updateDoc(doc(db, 'users', userId), {
    'trust.total': total,
    'trust.identityScore': identity,
    'trust.verificationScore': verification,
    'trust.activityScore': activity,
    'trust.communityScore': community,
    'trust.updatedAt': serverTimestamp()
  });

  return total;
};

// ─────────────────────────────────────────────────────────────
// REPORTING SYSTEM
// ─────────────────────────────────────────────────────────────

export interface Report {
  id?: string;
  reporterId: string;
  targetId: string;
  targetType: 'user' | 'startup' | 'investor' | 'post' | 'message' | 'review' | 'comment';
  reason: string;
  description: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export const submitReport = async (report: Omit<Report, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const reportRef = await addDoc(collection(db, 'reports'), {
    ...report,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  // After 5 reports on same target, auto-flag for admin review
  const existingReports = query(
    collection(db, 'reports'),
    where('targetId', '==', report.targetId),
    where('status', '==', 'pending')
  );
  const snap = await getDocs(existingReports);
  if (snap.size >= 5) {
    // Add admin notification
    await addDoc(collection(db, 'adminAlerts'), {
      type: 'multiple_reports',
      targetId: report.targetId,
      targetType: report.targetType,
      reportCount: snap.size,
      createdAt: serverTimestamp()
    });
  }

  return reportRef.id;
};

// ─────────────────────────────────────────────────────────────
// ANTI-FRAUD ENGINE
// ─────────────────────────────────────────────────────────────

export interface FraudFlag {
  type: 'duplicate_account' | 'suspicious_messaging' | 'spam' | 'fake_startup' | 'fake_investor' | 'valuation_mismatch';
  severity: 'low' | 'medium' | 'high';
  description: string;
  detectedAt: Timestamp | null;
}

export const runAntiFraudCheck = async (userId: string, userData: any): Promise<FraudFlag[]> => {
  const flags: FraudFlag[] = [];
  const profile = userData?.profile || {};
  const verification = userData?.verification || {};

  // 1. Duplicate account detection — same name + no profile image + no bio
  if (!profile.name && !profile.bio && !profile.profileImage) {
    flags.push({
      type: 'fake_startup',
      severity: 'low',
      description: 'Profile is incomplete with no identifying information.',
      detectedAt: null
    });
  }

  // 2. Suspicious messaging — account with very low trust index but high activity
  const trustScore = verification?.trustScore || 0;
  const followingCount = userData?.followingCount || (userData?.following?.length || 0);
  const followersCount = userData?.followersCount || 0;
  if (trustScore < 10 && (followingCount > 50 || followersCount > 50)) {
    flags.push({
      type: 'suspicious_messaging',
      severity: 'medium',
      description: 'High network activity with very low trust index — possible spam or bot account.',
      detectedAt: null
    });
  }

  // 3. Spam detection — no verification at all but trying to act as a business
  if (!verification.emailVerified && !verification.phoneVerified && (profile.title || profile.company)) {
    flags.push({
      type: 'spam',
      severity: 'medium',
      description: 'Unverified account claiming professional/business identity.',
      detectedAt: null
    });
  }

  // 4. Fake startup — claims a startup but no verification, no website, no linkedin
  if (userData?.mainRole === 'ARCHITECT' && profile.company && !verification.startupVerified && !verification.websiteVerified && !verification.linkedinVerified) {
    flags.push({
      type: 'fake_startup',
      severity: 'high',
      description: 'Architect role with company name but no startup, website, or LinkedIn verification.',
      detectedAt: null
    });
  }

  // 5. Fake investor — claims investor role but no verification, no portfolio, no credentials
  if (userData?.mainRole === 'CATALYST' && !verification.investorVerified && !verification.linkedinVerified && !profile.company) {
    flags.push({
      type: 'fake_investor',
      severity: 'high',
      description: 'Catalyst role with no investor verification, no LinkedIn, and no company affiliation.',
      detectedAt: null
    });
  }

  // 6. Valuation mismatch — startup with extremely high valuation but no revenue/traction
  const startupData = userData?.startupData || {};
  if (startupData.valuation && startupData.valuation > 10000000 && !startupData.revenue) {
    flags.push({
      type: 'valuation_mismatch',
      severity: 'medium',
      description: 'Startup valuation exceeds $10M with no reported revenue — possible overvaluation.',
      detectedAt: null
    });
  }

  // Save flags to Firestore if any
  if (flags.length > 0) {
    await updateDoc(doc(db, 'users', userId), {
      'fraud.flags': flags.map(f => ({ ...f, detectedAt: serverTimestamp() })),
      'fraud.lastChecked': serverTimestamp()
    });
  }

  return flags;
};
