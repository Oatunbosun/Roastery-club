import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID if provided
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: 'select_account',
});

// Helper for Google Sign-In
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    const user = result.user;
    
    // Save/update user profile in firestore
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Coffee Lover',
          photoURL: user.photoURL || '',
          memberTier: 'Gold Artisan',
          beanPoints: 120,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
    return user;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

// Helper for Email/Password Sign Up
export async function signUpWithEmail(email: string, pass: string, name: string, preference?: string) {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  const user = result.user;
  if (name) {
    await updateProfile(user, { displayName: name });
  }
  const userRef = doc(db, 'users', user.uid);
  await setDoc(
    userRef,
    {
      uid: user.uid,
      email: user.email || '',
      displayName: name || 'Coffee Lover',
      photoURL: '',
      coffeePreference: preference || 'Medium Caramel Roast',
      memberTier: 'Club Member',
      beanPoints: 50, // Welcome gift points
      memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
  return user;
}

// Helper for Email/Password Sign In
export async function signInWithEmail(email: string, pass: string) {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
}

// Helper for Password Reset
export async function resetUserPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function signOutUser() {
  await fbSignOut(auth);
}

// Connection test utility as recommended in skill guidelines
export async function verifyFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, '_connection_test', 'status'));
    return true;
  } catch (err: any) {
    // If permission or missing doc, connection is still alive unless network offline
    if (err?.message?.includes('the client is offline')) {
      console.warn('Firestore is currently offline or unreachable.');
      return false;
    }
    return true;
  }
}
