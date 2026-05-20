import { createFirebaseUser, signInWithFirebase } from './firebase';
import { syncLoginProfile, syncSignupProfile } from './dbService';

export function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(String(email).toLowerCase());
}

export function validatePassword(password) {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(String(password));
}

export async function loginUser({ email, password }) {
  const { firebaseToken } = await signInWithFirebase(email, password);
  const data = await syncLoginProfile({
    email,
    firebaseToken
  });

  localStorage.setItem('token', firebaseToken);
  localStorage.setItem('userType', data.userType);

  if (data.token) {
    localStorage.setItem('backendToken', data.token);
  }

  return data;
}

export async function signupUser({
  name,
  email,
  password,
  userType,
  year,
  branch,
  company,
  role,
  interests
}) {
  const firebaseUser = await createFirebaseUser(email, password);

  return syncSignupProfile({
    name,
    email,
    password,
    userType,
    year: year || null,
    branch: branch || null,
    company: company || null,
    role: role || null,
    interests,
    firebaseUid: firebaseUser.uid
  });
}
