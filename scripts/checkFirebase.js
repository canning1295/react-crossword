#!/usr/bin/env node

/**
 * Firebase Configuration Checker
 * 
 * This script verifies that Firebase is properly configured
 * 
 * Usage: node scripts/checkFirebase.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Firebase Configuration...\n');

let hasErrors = false;

// Check 1: Environment file
console.log('1. Checking .env.local file...');
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('   ❌ .env.local file not found');
  hasErrors = true;
} else {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  ];
  
  const missingVars = requiredVars.filter(v => !envContent.includes(`${v}=`));
  const emptyVars = requiredVars.filter(v => {
    const match = envContent.match(new RegExp(`${v}=(.*)`, 'm'));
    return match && !match[1].trim();
  });
  
  if (missingVars.length > 0) {
    console.log(`   ❌ Missing variables: ${missingVars.join(', ')}`);
    hasErrors = true;
  } else if (emptyVars.length > 0) {
    console.log(`   ⚠️  Empty variables: ${emptyVars.join(', ')}`);
  } else {
    console.log('   ✅ All required environment variables present');
  }
}

// Check 2: Firebase config file
console.log('\n2. Checking Firebase config file...');
const configPath = path.join(__dirname, '..', 'src', 'firebase', 'config.ts');
if (!fs.existsSync(configPath)) {
  console.log('   ❌ src/firebase/config.ts not found');
  hasErrors = true;
} else {
  console.log('   ✅ Firebase config file exists');
}

// Check 3: Firebase rules
console.log('\n3. Checking Firestore rules...');
const rulesPath = path.join(__dirname, '..', 'firestore.rules');
if (!fs.existsSync(rulesPath)) {
  console.log('   ❌ firestore.rules not found');
  hasErrors = true;
} else {
  console.log('   ✅ Firestore rules file exists');
}

// Check 4: Firebase JSON
console.log('\n4. Checking firebase.json...');
const firebaseJsonPath = path.join(__dirname, '..', 'firebase.json');
if (!fs.existsSync(firebaseJsonPath)) {
  console.log('   ❌ firebase.json not found');
  hasErrors = true;
} else {
  console.log('   ✅ firebase.json exists');
}

// Check 5: Firebase package
console.log('\n5. Checking firebase package...');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (packageJson.dependencies && packageJson.dependencies.firebase) {
    console.log(`   ✅ Firebase package installed (v${packageJson.dependencies.firebase})`);
  } else {
    console.log('   ❌ Firebase package not installed');
    hasErrors = true;
  }
} else {
  console.log('   ❌ package.json not found');
  hasErrors = true;
}

// Check 6: Service Account Key (optional)
console.log('\n6. Checking service account key (optional for curator scripts)...');
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.log('   ⚠️  serviceAccountKey.json not found (needed for curator scripts)');
  console.log('      Download from: https://console.firebase.google.com/project/projectdb-f4ac8/settings/serviceaccounts/adminsdk');
} else {
  console.log('   ✅ Service account key exists');
}

// Summary
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.log('❌ Configuration incomplete. Please fix the errors above.');
  process.exit(1);
} else {
  console.log('✅ Firebase is properly configured!');
  console.log('\nNext steps:');
  console.log('  1. Make sure Firebase Storage is enabled if needed');
  console.log('  2. Set curator claims: node scripts/setCurator.js <email>');
  console.log('  3. Test authentication in your app');
  process.exit(0);
}
