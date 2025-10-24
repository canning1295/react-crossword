/**
 * Firestore Database Service
 *
 * Provides database utilities for the application
 */

import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from './index';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PUZZLES: 'puzzles',
  PROGRESS: 'progress',
  LEADERBOARDS: 'leaderboards',
} as const;

/**
 * User Profile Interface
 */
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Puzzle Interface
 */
export interface Puzzle {
  id: string;
  title: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'published' | 'archived';
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  data: any; // IPUZ format data
}

/**
 * User Progress Interface
 */
export interface UserProgress {
  userId: string;
  puzzleId: string;
  completed: boolean;
  progress: number; // 0-100
  lastPlayed: Timestamp;
  timeSpent?: number; // in seconds
  grid?: any; // Current state of the puzzle
}

/**
 * Create or update user profile
 */
export const setUserProfile = async (
  userId: string,
  data: Partial<UserProfile>
): Promise<void> => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  await setDoc(
    userRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

/**
 * Get user profile
 */
export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? (userSnap.data() as UserProfile) : null;
};

/**
 * Create a new puzzle
 */
export const createPuzzle = async (
  puzzleData: Omit<Puzzle, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const puzzleRef = doc(collection(db, COLLECTIONS.PUZZLES));
  await setDoc(puzzleRef, {
    ...puzzleData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return puzzleRef.id;
};

/**
 * Get a puzzle by ID
 */
export const getPuzzle = async (puzzleId: string): Promise<Puzzle | null> => {
  const puzzleRef = doc(db, COLLECTIONS.PUZZLES, puzzleId);
  const puzzleSnap = await getDoc(puzzleRef);
  return puzzleSnap.exists()
    ? ({ id: puzzleSnap.id, ...puzzleSnap.data() } as Puzzle)
    : null;
};

/**
 * Get all published puzzles
 */
export const getPublishedPuzzles = async (): Promise<Puzzle[]> => {
  const puzzlesQuery = query(
    collection(db, COLLECTIONS.PUZZLES),
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(puzzlesQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Puzzle));
};

/**
 * Update user progress for a puzzle
 */
export const updateUserProgress = async (
  userId: string,
  puzzleId: string,
  progressData: Partial<UserProgress>
): Promise<void> => {
  const progressRef = doc(
    db,
    COLLECTIONS.PROGRESS,
    userId,
    'puzzles',
    puzzleId
  );
  await setDoc(
    progressRef,
    {
      userId,
      puzzleId,
      ...progressData,
      lastPlayed: serverTimestamp(),
    },
    { merge: true }
  );
};

/**
 * Get user progress for a puzzle
 */
export const getUserProgress = async (
  userId: string,
  puzzleId: string
): Promise<UserProgress | null> => {
  const progressRef = doc(
    db,
    COLLECTIONS.PROGRESS,
    userId,
    'puzzles',
    puzzleId
  );
  const progressSnap = await getDoc(progressRef);
  return progressSnap.exists() ? (progressSnap.data() as UserProgress) : null;
};

/**
 * Subscribe to real-time puzzle updates
 */
export const subscribeToPuzzle = (
  puzzleId: string,
  callback: (puzzle: Puzzle | null) => void
) => {
  const puzzleRef = doc(db, COLLECTIONS.PUZZLES, puzzleId);
  return onSnapshot(puzzleRef, (snapshot) => {
    callback(
      snapshot.exists()
        ? ({ id: snapshot.id, ...snapshot.data() } as Puzzle)
        : null
    );
  });
};

/**
 * Subscribe to real-time user progress updates
 */
export const subscribeToUserProgress = (
  userId: string,
  puzzleId: string,
  callback: (progress: UserProgress | null) => void
) => {
  const progressRef = doc(
    db,
    COLLECTIONS.PROGRESS,
    userId,
    'puzzles',
    puzzleId
  );
  return onSnapshot(progressRef, (snapshot) => {
    callback(snapshot.exists() ? (snapshot.data() as UserProgress) : null);
  });
};
