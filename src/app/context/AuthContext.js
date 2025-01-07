'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Save user to Firestore with username
  const saveUserToFirestore = async (user) => {
    if (!user?.uid) return;

    const userRef = doc(db, 'users', user.uid);
    
    try {
      // Check if user already exists
      const userDoc = await getDoc(userRef);
      const username = user.displayName?.toLowerCase().replace(/\s+/g, '') || '';
      
      if (!userDoc.exists()) {
        // New user - create full profile
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          username,
          bio: '',
          lastSeen: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
      } else {
        // Existing user - update only necessary fields
        await setDoc(userRef, {
          lastSeen: serverTimestamp(),
          displayName: user.displayName,
          photoURL: user.photoURL,
        }, { merge: true });
      }

      // Get the full user profile
      const updatedDoc = await getDoc(userRef);
      setUserProfile(updatedDoc.data());
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await saveUserToFirestore(result.user);
      }
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    if (!user?.uid) return;

    const userRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      const updatedDoc = await getDoc(userRef);
      setUserProfile(updatedDoc.data());
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await saveUserToFirestore(user);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signInWithGoogle,
      handleSignOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
