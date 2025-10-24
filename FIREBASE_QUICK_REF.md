# 🚀 Firebase Quick Reference

## Project Info
- **Project ID**: `projectdb-f4ac8`
- **App ID**: `1:420654521043:web:8b06733fe3e3fbb8f95226`
- **Console**: https://console.firebase.google.com/project/projectdb-f4ac8

## Quick Commands

### Check Configuration
```bash
node scripts/checkFirebase.js
```

### Deploy Security Rules
```bash
# Firestore rules
firebase deploy --only firestore:rules

# Storage rules (after enabling Storage)
firebase deploy --only storage:rules

# Both at once
firebase deploy --only firestore:rules,storage:rules
```

### Manage Curators
```bash
# Set curator claim (requires serviceAccountKey.json)
node scripts/setCurator.js user@example.com

# Remove curator claim
node scripts/removeCurator.js user@example.com
```

### Firebase CLI
```bash
# Login
firebase login

# Select project
firebase use projectdb-f4ac8

# List apps
firebase apps:list

# View project info
firebase projects:list
```

## Code Examples

### Authentication
```typescript
import { signInWithGoogle, logOut } from './firebase/auth';

// Sign in
const user = await signInWithGoogle();

// Sign out
await logOut();
```

### Using the Auth Hook
```typescript
import { useAuth, useIsCurator } from './hooks/useAuth';

function MyComponent() {
  const { user, loading } = useAuth();
  const isCurator = useIsCurator();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  
  return <div>Hello {user.displayName}!</div>;
}
```

### Database Operations
```typescript
import {
  setUserProfile,
  createPuzzle,
  getPublishedPuzzles,
  updateUserProgress,
} from './firebase/firestore';

// Create user profile
await setUserProfile(user.uid, {
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
});

// Create puzzle (curator only)
const puzzleId = await createPuzzle({
  title: 'Daily Crossword',
  status: 'published',
  createdBy: user.uid,
  data: ipuzData,
});

// Get all published puzzles
const puzzles = await getPublishedPuzzles();

// Update progress
await updateUserProgress(user.uid, puzzleId, {
  completed: false,
  progress: 50,
  grid: currentState,
});
```

## File Structure
```
src/
├── firebase/
│   ├── config.ts       # Configuration
│   ├── index.ts        # Initialization
│   ├── auth.ts         # Auth utilities
│   └── firestore.ts    # DB utilities
├── hooks/
│   └── useAuth.ts      # Auth React hook
└── examples/
    └── AuthExample.tsx # Example component

scripts/
├── checkFirebase.js    # Config checker
├── setCurator.js       # Add curator
└── removeCurator.js    # Remove curator

firestore.rules         # DB security rules
storage.rules           # Storage security rules
firebase.json           # Firebase config
.env.local             # Environment vars
```

## Data Collections

### `users/{userId}`
```typescript
{
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### `puzzles/{puzzleId}`
```typescript
{
  id: string;
  title: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'published' | 'archived';
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  data: any; // IPUZ format
}
```

### `progress/{userId}/puzzles/{puzzleId}`
```typescript
{
  userId: string;
  puzzleId: string;
  completed: boolean;
  progress: number; // 0-100
  lastPlayed: Timestamp;
  timeSpent?: number;
  grid?: any;
}
```

## Security Rules Summary

### Firestore
- Users: Read/write own profile only
- Puzzles: Everyone reads published; curators create/edit
- Progress: Read/write own progress only
- Leaderboards: Read-only (cloud functions write)

### Storage
- `/users/{userId}/profile/*`: User can write own
- `/puzzles/{puzzleId}/*`: Curators can write
- All: Public read

## What's Next?

1. **Enable Storage** (if needed)
   - Go to Firebase Console → Storage
   - Click "Get Started"
   - Deploy rules: `firebase deploy --only storage:rules`

2. **Set Curator Claims**
   - Download service account key from Console
   - Run: `node scripts/setCurator.js your@email.com`

3. **Test Authentication**
   - Import `AuthExample` component
   - Sign in with Google
   - Verify user data appears

4. **Build Your App**
   - Use the utilities in `src/firebase/`
   - Check examples in `src/examples/`
   - Read full docs in `FIREBASE_SETUP.md`

## Troubleshooting

### "Auth domain not authorized"
Add your domain to Firebase Console → Authentication → Settings → Authorized domains

### "Permission denied" errors
Check Firestore rules are deployed and user is authenticated

### Curator claims not working
User must sign out and sign in again after claims are set

### Storage not working
Make sure Storage is enabled in Firebase Console

## Resources

- [Firebase Console](https://console.firebase.google.com/project/projectdb-f4ac8)
- [Full Setup Guide](./FIREBASE_SETUP.md)
- [Setup Complete Summary](./FIREBASE_COMPLETE.md)
- [Firebase Docs](https://firebase.google.com/docs)
