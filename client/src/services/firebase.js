import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'FIREBASE_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'FIREBASE_AUTH_DOMAIN',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'FIREBASE_PROJECT_ID',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'FIREBASE_STORAGE_BUCKET',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ??
    'FIREBASE_MESSAGING_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? 'FIREBASE_APP_ID'
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

export async function signInWithFirebase(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password
  );
  const firebaseToken = await userCredential.user.getIdToken();

  return {
    firebaseToken,
    user: userCredential.user
  };
}

export async function createFirebaseUser(email, password) {
  const userCredential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password
  );

  return userCredential.user;
}
