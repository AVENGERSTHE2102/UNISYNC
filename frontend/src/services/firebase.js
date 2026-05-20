// Firebase configuration stub. Bypassed in favor of direct local auth.
export const firebaseApp = null;
export const firebaseAuth = null;

export async function signInWithFirebase() {
  return { firebaseToken: '', user: null };
}

export async function createFirebaseUser() {
  return { uid: '' };
}
