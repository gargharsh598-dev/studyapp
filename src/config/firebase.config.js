import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
// import dotenv from "dotenv";
// dotenv.config();
// const firebaseConfig = {
//   VITE_FIREBASE_API_KEY: 'AIzaSyC_PIJn4Qf9pvabl7v8pinLFSkFOyzYuk4',
//   VITE_FIREBASE_AUTH_DOMAIN: 'form-5e612.firebaseapp.com',
//   VITE_FIREBASE_PROJECT_ID: 'form-5e612',
//   VITE_FIREBASE_STORAGE_BUCKET: 'form-5e612.appspot.com',
//   VITE_FIREBASE_MESSAGING_SENDER_ID: '544149536894',
//   VITE_FIREBASE_APP_ID: '1:544149536894:web:bfc4784b29abfe0a6a982f'
// };
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app, auth, db, storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Enable network for Firestore to prevent offline errors
  if (db) {
    enableNetwork(db).catch((error) => {
      console.warn('Failed to enable Firestore network:', error);
    });
  }

  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization failed:', error);
  console.warn('The app will run in demo mode with limited functionality.');
}

export { auth, db, storage };
export default app;
