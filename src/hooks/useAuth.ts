import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, loginWithGoogle, logout as firebaseLogout } from '@/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      setError(null);
      await loginWithGoogle();
    } catch (err: any) {
      console.error("Login failed:", err);
      if (err?.code === 'auth/unauthorized-domain') {
        setError('unauthorized-domain');
      } else if (err?.code === 'auth/operation-not-allowed') {
        setError('operation-not-allowed');
      } else if (err?.code === 'auth/cancelled-popup-request' || err?.code === 'auth/popup-closed-by-user') {
        setError('cancelled-popup-request');
      } else if (err?.code === 'auth/popup-blocked') {
        setError('popup-blocked');
      } else {
        setError(err?.message || 'Failed to login');
      }
    }
  };

  const logout = async () => {
    try {
      await firebaseLogout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return { user, loading, error, login, logout };
}
