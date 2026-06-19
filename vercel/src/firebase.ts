// Firebase Configuration
// Replace with your Firebase project credentials
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firestore, Storage, and Auth
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth, app };
