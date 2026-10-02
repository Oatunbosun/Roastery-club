'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import {
  auth,
  db,
  signInWithGoogle,
  signInWithEmail as fbSignInWithEmail,
  signUpWithEmail as fbSignUpWithEmail,
  resetUserPassword,
  signOutUser,
} from './firebase';

export interface UserProfileData {
  displayName?: string;
  email?: string;
  phone?: string;
  memberTier?: string;
  beanPoints?: number;
  coffeePreference?: string;
  favoriteMilk?: string;
  brewingMethod?: string;
  deliveryAddress?: {
    street?: string;
    suite?: string;
    city?: string;
    zip?: string;
    instructions?: string;
  };
  memberSince?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfileData | null;
  loading: boolean;
  signIn: () => Promise<User | null>;
  signInEmail: (email: string, pass: string) => Promise<User | null>;
  signUpEmail: (email: string, pass: string, name: string, preference?: string) => Promise<User | null>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfileData>) => Promise<void>;
  userOrders: any[];
  userReservations: any[];
  loadUserOrders: () => Promise<void>;
  loadUserReservations: () => Promise<void>;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  accountActiveTab: 'card' | 'preferences' | 'address' | 'orders' | 'reservations';
  setAccountActiveTab: (tab: 'card' | 'preferences' | 'address' | 'orders' | 'reservations') => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signIn: async () => null,
  signInEmail: async () => null,
  signUpEmail: async () => null,
  resetPassword: async () => {},
  signOut: async () => {},
  updateProfileData: async () => {},
  userOrders: [],
  userReservations: [],
  loadUserOrders: async () => {},
  loadUserReservations: async () => {},
  isAccountModalOpen: false,
  setIsAccountModalOpen: () => {},
  accountActiveTab: 'card',
  setAccountActiveTab: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [userReservations, setUserReservations] = useState<any[]>([]);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountActiveTab, setAccountActiveTab] = useState<'card' | 'preferences' | 'address' | 'orders' | 'reservations'>('card');

  const fetchProfile = useCallback(async (u: User) => {
    try {
      const userDocRef = doc(db, 'users', u.uid);
      const snapshot = await getDoc(userDocRef);
      if (snapshot.exists()) {
        setUserProfile(snapshot.data() as UserProfileData);
      } else {
        const defaultProfile: UserProfileData = {
          displayName: u.displayName || 'Coffee Enthusiast',
          email: u.email || '',
          memberTier: 'Gold Artisan',
          beanPoints: 140,
          coffeePreference: 'Medium Caramel Roast',
          favoriteMilk: 'Oatly Barista Edition',
          brewingMethod: 'Espresso Ristretto',
          memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        };
        await setDoc(userDocRef, defaultProfile, { merge: true });
        setUserProfile(defaultProfile);
      }
    } catch (err) {
      console.warn('Error fetching user profile:', err);
    }
  }, []);

  const loadUserOrders = useCallback(async () => {
    if (!user) {
      setUserOrders([]);
      return;
    }
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      orders.sort((a: any, b: any) => {
        const da = new Date(a.createdAt || 0).getTime();
        const dbTime = new Date(b.createdAt || 0).getTime();
        return dbTime - da;
      });
      setUserOrders(orders);
    } catch (err) {
      console.warn('Could not fetch user orders:', err);
    }
  }, [user]);

  const loadUserReservations = useCallback(async () => {
    if (!user || !user.email) {
      setUserReservations([]);
      return;
    }
    try {
      const q = query(
        collection(db, 'reservations'),
        where('email', '==', user.email)
      );
      const snapshot = await getDocs(q);
      const resList = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setUserReservations(resList);
    } catch (err) {
      console.warn('Could not fetch reservations:', err);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        await fetchProfile(currentUser);
        // load initial orders
        try {
          const q = query(
            collection(db, 'orders'),
            where('userId', '==', currentUser.uid)
          );
          const snapshot = await getDocs(q);
          const orders = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          orders.sort((a: any, b: any) => {
            const da = new Date(a.createdAt || 0).getTime();
            const dbTime = new Date(b.createdAt || 0).getTime();
            return dbTime - da;
          });
          setUserOrders(orders);
        } catch (e) {
          console.warn('Initial orders load error:', e);
        }

        // load initial reservations
        if (currentUser.email) {
          try {
            const qRes = query(
              collection(db, 'reservations'),
              where('email', '==', currentUser.email)
            );
            const snapRes = await getDocs(qRes);
            setUserReservations(snapRes.docs.map((d) => ({ id: d.id, ...d.data() })));
          } catch (e) {
            console.warn('Initial reservations load error:', e);
          }
        }
      } else {
        setUserProfile(null);
        setUserOrders([]);
        setUserReservations([]);
      }
    });
    return () => unsubscribe();
  }, [fetchProfile]);

  const handleSignIn = async () => {
    const loggedUser = await signInWithGoogle();
    if (loggedUser) {
      await fetchProfile(loggedUser);
    }
    return loggedUser;
  };

  const handleSignInEmail = async (email: string, pass: string) => {
    const loggedUser = await fbSignInWithEmail(email, pass);
    if (loggedUser) {
      await fetchProfile(loggedUser);
    }
    return loggedUser;
  };

  const handleSignUpEmail = async (email: string, pass: string, name: string, preference?: string) => {
    const newUser = await fbSignUpWithEmail(email, pass, name, preference);
    if (newUser) {
      await fetchProfile(newUser);
    }
    return newUser;
  };

  const handleResetPassword = async (email: string) => {
    await resetUserPassword(email);
  };

  const updateProfileData = async (data: Partial<UserProfileData>) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    setUserProfile((prev) => (prev ? { ...prev, ...data } : (data as UserProfileData)));
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    setUserProfile(null);
    setUserOrders([]);
    setUserReservations([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signIn: handleSignIn,
        signInEmail: handleSignInEmail,
        signUpEmail: handleSignUpEmail,
        resetPassword: handleResetPassword,
        signOut: handleSignOut,
        updateProfileData,
        userOrders,
        userReservations,
        loadUserOrders,
        loadUserReservations,
        isAccountModalOpen,
        setIsAccountModalOpen,
        accountActiveTab,
        setAccountActiveTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
