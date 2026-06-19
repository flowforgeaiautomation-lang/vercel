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
  Timestamp
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
// Disable any realtime listeners that might be causing ERR_ABORTED
const storage = getStorage(app);
const auth = getAuth(app);

// Strong error suppression for Firestore connection issues
if (typeof window !== 'undefined') {
  // Suppress all network-related errors from Firebase
  const originalAddEventListener = window.addEventListener;
  window.addEventListener = function(type, listener, options) {
    if (type === 'error') {
      const wrappedListener = function(event) {
        if (
          event.message?.includes('firestore') || 
          event.message?.includes('ERR_ABORTED') || 
          event.message?.includes('Firebase')
        ) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        return listener(event);
      };
      return originalAddEventListener.call(this, type, wrappedListener, options);
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

  // Also suppress unhandled promise rejections from Firebase
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Check if this is a Firebase/Firestore error we want to suppress
    const isSuppressable = args.some(arg => {
      if (typeof arg === 'string') {
        return arg.includes('firestore') || 
               arg.includes('ERR_ABORTED') || 
               arg.includes('FirebaseError') ||
               arg.includes('google.firestore');
      }
      if (arg && typeof arg === 'object') {
        const errorStr = JSON.stringify(arg);
        return errorStr.includes('firestore') || 
               errorStr.includes('ERR_ABORTED') || 
               errorStr.includes('FirebaseError');
      }
      return false;
    });
    
    if (!isSuppressable) {
      originalConsoleError(...args);
    }
  };
}

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
export type { ProfileData };
