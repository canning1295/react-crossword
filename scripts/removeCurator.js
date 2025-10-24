#!/usr/bin/env node

/**
 * Remove Curator Custom Claim
 * 
 * This script removes the 'curator' custom claim from a user.
 * 
 * Usage:
 *   node scripts/removeCurator.js <user-email>
 */

const admin = require('firebase-admin');
const path = require('path');


// Initialize Firebase Admin
try {
  const serviceAccount = require(path.join(__dirname, '..', 'serviceAccountKey.json'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error('Error: Could not find serviceAccountKey.json');
  console.error('Please download it from Firebase Console → Project Settings → Service Accounts');
  console.error('Path checked:', path.join(__dirname, '..', 'serviceAccountKey.json'));
  process.exit(1);
}

async function removeCurator(email) {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Remove custom claim
    await admin.auth().setCustomUserClaims(user.uid, { curator: false });
    
    console.log(`✅ Curator claim successfully removed for ${email}`);
    console.log(`   User ID: ${user.uid}`);
    console.log('\nNote: The user needs to sign out and sign in again for the changes to take effect.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error removing curator claim:', error.message);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/removeCurator.js <user-email>');
  process.exit(1);
}

removeCurator(email);
