# Firebase Setup Guide

This project uses **Firebase** for authentication, database (Firestore), and storage.

## Project Information

- **Project Name**: ProjectDB
- **Project ID**: `projectdb-f4ac8`
- **Project Number**: `420654521043`

## Setup Instructions

### 1. Environment Variables

The `.env.local` file has been created with your Firebase configuration. You need to add the missing values:

- `REACT_APP_FIREBASE_APP_ID`: Get this from Firebase Console → Project Settings → Your apps → Web app
- `REACT_APP_FIREBASE_MEASUREMENT_ID`: (Optional) Get this from Firebase Console if you enable Analytics

### 2. Deploy Firestore Security Rules

Deploy the security rules to your Firebase project:

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in this project (select existing project: projectdb-f4ac8)
firebase init

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules
```

### 3. Set Up Custom Claims for Curators

To grant curator permissions to a user, you need to set custom claims. Create a simple Node.js script or use Firebase Admin SDK:

```javascript
// setCurator.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setCurator(email) {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { curator: true });
  console.log(`Curator claim set for ${email}`);
}

// Run: node setCurator.js
setCurator('your-email@example.com');
```

### 4. Enable Firebase Services

Make sure these services are enabled in Firebase Console:

- ✅ **Authentication**: Google Sign-In (already enabled)
- ✅ **Firestore Database**: Create database if not already created
- ⬜ **Firebase Storage**: Enable if you plan to upload puzzle assets
- ⬜ **Firebase Hosting**: (Optional) For deploying the app

## Project Structure

```
src/firebase/
├── config.ts          # Firebase configuration
├── index.ts           # Firebase initialization and exports
├── auth.ts            # Authentication utilities
└── firestore.ts       # Firestore database utilities

firestore.rules        # Firestore security rules
storage.rules          # Storage security rules
firebase.json          # Firebase project configuration
```

## Usage Examples

### Authentication

```typescript
import { signInWithGoogle, logOut, onAuthChange } from './firebase/auth';

// Sign in with Google
const user = await signInWithGoogle();

// Listen to auth state changes
onAuthChange((user) => {
  if (user) {
    console.log('User signed in:', user.email);
  } else {
    console.log('User signed out');
  }
});

// Sign out
await logOut();
```

### Firestore Database

```typescript
import {
  setUserProfile,
  getUserProfile,
  createPuzzle,
  getPublishedPuzzles,
  updateUserProgress,
} from './firebase/firestore';

// Create/update user profile
await setUserProfile(userId, {
  email: 'user@example.com',
  displayName: 'John Doe',
});

// Get published puzzles
const puzzles = await getPublishedPuzzles();

// Update user progress
await updateUserProgress(userId, puzzleId, {
  completed: false,
  progress: 50,
  grid: currentGridState,
});
```

## Security Rules

The Firestore security rules implement:

- **Users collection**: Users can only read/write their own profiles
- **Puzzles collection**: Public can read published puzzles; only curators can create/edit
- **Progress collection**: Users can only access their own progress data
- **Leaderboards collection**: Read-only for users

The Storage rules implement:

- **User profile images**: Users can only upload to their own folder
- **Puzzle assets**: Only curators can upload puzzle-related files

## Next Steps

1. Complete the missing environment variables in `.env.local`
2. Deploy security rules: `firebase deploy --only firestore:rules,storage:rules`
3. Set curator claims for authorized users
4. Test authentication and database operations
5. If deploying to Netlify, follow the steps in `NETLIFY_SETUP.md` to set env vars and authorize your domain
5. Consider enabling Firebase Analytics if needed

## Resources

- [Firebase Console](https://console.firebase.google.com/project/projectdb-f4ac8)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
