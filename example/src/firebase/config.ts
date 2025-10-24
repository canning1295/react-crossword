/**
 * Firebase Configuration
 *
 * Project: ProjectDB
 * Project ID: projectdb-f4ac8
 * Project Number: 420654521043
 */

// In production builds (e.g., Netlify), require env vars to be defined so we
// don't accidentally ship with local defaults. In development, we allow
// falling back to the example values to simplify local setup.
const isProduction = process.env.NODE_ENV === 'production';

const requireEnv = (key: string, fallback: string): string => {
  const value = (process.env as Record<string, string | undefined>)[key];
  if (!value || value.trim() === '') {
    if (isProduction) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return fallback;
  }
  return value;
};

export const firebaseConfig = {
  apiKey: requireEnv(
    'REACT_APP_FIREBASE_API_KEY',
    'AIzaSyDku_GigS1Xl5VAstfOJbEdl9nehsSyOb4'
  ),
  authDomain: requireEnv(
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'projectdb-f4ac8.firebaseapp.com'
  ),
  projectId: requireEnv('REACT_APP_FIREBASE_PROJECT_ID', 'projectdb-f4ac8'),
  storageBucket: requireEnv(
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'projectdb-f4ac8.firebasestorage.app'
  ),
  messagingSenderId: requireEnv(
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    '420654521043'
  ),
  appId: requireEnv(
    'REACT_APP_FIREBASE_APP_ID',
    '1:420654521043:web:8b06733fe3e3fbb8f95226'
  ),
  measurementId: requireEnv(
    'REACT_APP_FIREBASE_MEASUREMENT_ID',
    'G-QQFEFCG1JE'
  ),
};
