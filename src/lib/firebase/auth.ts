'use client';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { userProfile as defaultUserProfile } from '@/lib/data';
import type { UserProfile } from '@/lib/types';


class AuthService {
  private auth = auth;

  signUpWithEmail = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });
    
    // Create user profile in Firestore
    const newUserProfile: UserProfile = {
      ...defaultUserProfile,
      uid: user.uid,
      id: user.uid,
      name,
      email: user.email!,
    };
    await setDoc(doc(db, "users", user.uid), newUserProfile);
    
    return userCredential;
  };

  signInWithEmail = (email: string, password: string) => {
    return signInWithEmailAndPassword(this.auth, email, password);
  };

  signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    const user = result.user;

    // Check if user profile already exists
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      // Create a new profile if it doesn't exist
      const newUserProfile: UserProfile = {
        ...defaultUserProfile,
        uid: user.uid,
        id: user.uid,
        name: user.displayName || 'New User',
        email: user.email!,
        avatarUrl: user.photoURL || defaultUserProfile.avatarUrl,
      };
      await setDoc(doc(db, "users", user.uid), newUserProfile);
    }
    return result;
  };

  signOut = () => {
    return signOut(this.auth);
  };

  onAuthStateChanged = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(this.auth, callback);
  };

  getCurrentUser = () => {
    return this.auth.currentUser;
  };

  getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  }

  updateUserProfile = async (uid: string, profileData: Partial<UserProfile>) => {
    const userRef = doc(db, "users", uid);
    return setDoc(userRef, profileData, { merge: true });
  }
}

export const authService = new AuthService();
