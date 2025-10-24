#!/usr/bin/env node

/**
 * Set Curator Custom Claim
 * 
 * This script sets the 'curator' custom claim for a user.
 * You need a service account key to run this.
 * 
 * Usage:
 *   node scripts/setCurator.js <user-email>
 * 
 * Setup:
 *   1. Go to Firebase Console → Project Settings → Service Accounts
 *   2. Click "Generate New Private Key"
 *   3. Save the JSON file as serviceAccountKey.json in the project root
 *   4. Add serviceAccountKey.json to .gitignore (already done)
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin
const keyPath = path.join(__dirname, '..', 'serviceAccountKey.json');

if (!fs.existsSync(keyPath)) {
  console.error('Error: Could not find serviceAccountKey.json');
  console.error('Path checked:', keyPath);
  console.error('Please download it from Firebase Console → Project Settings → Service Accounts');
  process.exit(1);
}

try {
  const serviceAccount = require(keyPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error('Error initializing Firebase Admin:', error.message);
  process.exit(1);
}

async function setCurator(email) {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Set custom claim
    await admin.auth().setCustomUserClaims(user.uid, { curator: true });
    
    console.log(`✅ Curator claim successfully set for ${email}`);
    console.log(`   User ID: ${user.uid}`);
    console.log('\nNote: The user needs to sign out and sign in again for the changes to take effect.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting curator claim:', error.message);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/setCurator.js <user-email>');
  process.exit(1);
}

setCurator(email);
