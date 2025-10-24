/**
 * Example Auth Component
 * 
 * This is an example component showing how to use Firebase authentication
 * in your React components.
 */

import React from 'react';
import { useAuth, useIsCurator } from '../hooks/useAuth';
import { signInWithGoogle, logOut } from '../firebase/auth';

export const AuthExample: React.FC = () => {
  const { user, loading, error } = useAuth();
  const isCurator = useIsCurator();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign in error:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return (
      <div>
        <h2>Please Sign In</h2>
        <button onClick={handleSignIn}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome, {user.displayName || user.email}!</h2>
      {user.photoURL && (
        <img 
          src={user.photoURL} 
          alt="Profile" 
          style={{ width: 50, height: 50, borderRadius: '50%' }}
        />
      )}
      <p>Email: {user.email}</p>
      <p>User ID: {user.uid}</p>
      {isCurator && <p>✨ You are a curator!</p>}
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default AuthExample;
