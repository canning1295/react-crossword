import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  updateUserProgress,
  getUserProgress,
  UserProgress,
} from './firebase/firestore';

export function useFirebaseProgress(puzzleId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user && puzzleId) {
      loadProgress();
    }
  }, [user, puzzleId]);

  const loadProgress = async () => {
    if (!user) return;
    try {
      const data = await getUserProgress(user.uid, puzzleId);
      if (data) {
        setProgress(data);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async (data: Partial<UserProgress>) => {
    if (!user) return;
    try {
      await updateUserProgress(user.uid, puzzleId, data);
      setProgress((prev) => ({ ...prev, ...data } as UserProgress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  return {
    user,
    loading,
    progress,
    saveProgress,
    loadProgress,
  };
}
