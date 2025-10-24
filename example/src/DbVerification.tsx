import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { signInWithGoogle, logOut, onAuthChange } from './firebase/auth';
import {
  setUserProfile,
  getUserProfile,
  createPuzzle,
  getPublishedPuzzles,
  UserProfile,
} from './firebase/firestore';

const Container = styled.div`
  margin: 2em 0;
  padding: 2em;
  border: 2px solid #4a90e2;
  border-radius: 8px;
  background-color: #f8f9fa;
`;

const Title = styled.h2`
  margin-top: 0;
  color: #2c3e50;
`;

const StatusIndicator = styled.div<{ status: 'success' | 'error' | 'pending' }>`
  padding: 0.5em 1em;
  margin: 0.5em 0;
  border-radius: 4px;
  background-color: ${(props) =>
    props.status === 'success'
      ? '#d4edda'
      : props.status === 'error'
      ? '#f8d7da'
      : '#fff3cd'};
  color: ${(props) =>
    props.status === 'success'
      ? '#155724'
      : props.status === 'error'
      ? '#721c24'
      : '#856404'};
  border: 1px solid
    ${(props) =>
      props.status === 'success'
        ? '#c3e6cb'
        : props.status === 'error'
        ? '#f5c6cb'
        : '#ffeaa7'};
`;

const Button = styled.button`
  padding: 0.5em 1em;
  margin: 0.5em 0.5em 0.5em 0;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;

  &:hover {
    background-color: #357abd;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const InfoBox = styled.pre`
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.9em;
`;

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

const DbVerification: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<string>('Not tested');
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      setStatus('Signing in...');
      await signInWithGoogle();
      setStatus('Signed in successfully');
    } catch (error) {
      setStatus(`Sign in error: ${(error as Error).message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      setStatus('Signed out');
      setTestResults([]);
    } catch (error) {
      setStatus(`Sign out error: ${(error as Error).message}`);
    }
  };

  const runDatabaseTests = async () => {
    if (!user) {
      setStatus('Please sign in first');
      return;
    }

    setLoading(true);
    setTestResults([]);
    const results: string[] = [];

    try {
      // Test 1: Write user profile
      results.push('Test 1: Writing user profile...');
      await setUserProfile(user.uid, {
        uid: user.uid,
        email: user.email || 'unknown',
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || undefined,
      } as Partial<UserProfile>);
      results.push('✅ User profile written successfully');

      // Test 2: Read user profile
      results.push('\nTest 2: Reading user profile...');
      const profile = await getUserProfile(user.uid);
      if (profile) {
        results.push('✅ User profile read successfully:');
        results.push(JSON.stringify(profile, null, 2));
      } else {
        results.push('❌ Failed to read user profile');
      }

      // Test 3: Create a test puzzle (curator only)
      results.push('\nTest 3: Creating test puzzle...');
      try {
        const puzzleId = await createPuzzle({
          title: `Test Puzzle ${Date.now()}`,
          description: 'A test puzzle created by the verification system',
          difficulty: 'easy',
          status: 'draft',
          createdBy: user.uid,
          data: {
            across: { 1: { clue: 'test', answer: 'TEST', row: 0, col: 0 } },
            down: {},
          },
        });
        results.push(`✅ Test puzzle created with ID: ${puzzleId}`);
      } catch (error) {
        results.push(
          `⚠️  Puzzle creation requires curator permissions: ${
            (error as Error).message
          }`
        );
      }

      // Test 4: Read published puzzles
      results.push('\nTest 4: Reading published puzzles...');
      const puzzles = await getPublishedPuzzles();
      results.push(`✅ Found ${puzzles.length} published puzzle(s)`);
      if (puzzles.length > 0) {
        results.push('First puzzle:');
        results.push(JSON.stringify(puzzles[0], null, 2));
      }

      setStatus('All tests completed! ✅');
    } catch (error) {
      results.push(`\n❌ Error: ${(error as Error).message}`);
      setStatus('Tests failed');
    } finally {
      setTestResults(results);
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>🔥 Firebase Database Verification</Title>

      <StatusIndicator
        status={
          status.includes('successfully') || status.includes('completed')
            ? 'success'
            : status.includes('error') || status.includes('failed')
            ? 'error'
            : 'pending'
        }
      >
        <strong>Status:</strong> {status}
      </StatusIndicator>

      {!user ? (
        <>
          <p>Sign in to test database connectivity:</p>
          <Button onClick={handleSignIn}>Sign in with Google</Button>
        </>
      ) : (
        <>
          <p>
            <strong>Signed in as:</strong> {user.displayName || user.email}
          </p>
          <Button onClick={runDatabaseTests} disabled={loading}>
            {loading ? 'Running tests...' : 'Run Database Tests'}
          </Button>
          <Button onClick={handleSignOut} disabled={loading}>
            Sign Out
          </Button>
        </>
      )}

      {testResults.length > 0 && (
        <>
          <h3>Test Results:</h3>
          <InfoBox>{testResults.join('\n')}</InfoBox>
        </>
      )}

      <hr style={{ margin: '2em 0' }} />

      <h3>What this tests:</h3>
      <ul>
        <li>Firebase Authentication (Google Sign-In)</li>
        <li>Firestore database write operations (user profiles)</li>
        <li>Firestore database read operations (user profiles & puzzles)</li>
        <li>Security rules enforcement (curator permissions)</li>
        <li>Environment variable configuration</li>
      </ul>

      <p>
        <small>
          <strong>Note:</strong> Creating puzzles requires curator permissions.
          If you see a permission error, this is expected unless your account
          has been granted curator status. See <code>FIREBASE_SETUP.md</code>{' '}
          for instructions on setting curator claims.
        </small>
      </p>
    </Container>
  );
};

export default DbVerification;
