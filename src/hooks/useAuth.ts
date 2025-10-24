/**
 * useAuth Hook
 * 
 * Custom React hook for managing Firebase authentication state
 */

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, getCurrentUser } from '../firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    user: getCurrentUser(),
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setAuthState({
        user,
        loading: false,
        error: null,
      });
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return authState;
};

/**
 * Check if current user is a curator
 */
export const useIsCurator = (): boolean => {
  const { user } = useAuth();
  const [isCurator, setIsCurator] = useState(false);

  useEffect(() => {
    const checkCurator = async () => {
      if (user) {
        const token = await user.getIdTokenResult();
        setIsCurator(!!token.claims.curator);
      } else {
        setIsCurator(false);
      }
    };

    checkCurator();
  }, [user]);

  return isCurator;
};
