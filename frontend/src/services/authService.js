import { apiRequest } from './api';

export function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(String(email).toLowerCase());
}

export function validatePassword(password) {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(String(password));
}

export async function loginUser({ email, password }) {
  const response = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password }
  });

  const { token, user } = response.data;

  localStorage.setItem('token', token);
  localStorage.setItem('backendToken', token);
  localStorage.setItem('userType', user.role);
  localStorage.setItem('userName', user.name);
  localStorage.setItem('userId', user.id);

  return user;
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
  const response = await apiRequest('/api/auth/signup', {
    method: 'POST',
    body: {
      name,
      email,
      password,
      role: userType,
      yearOfStudy: year ? Number(year) : null,
      branch: branch || null,
      company: company || null,
      professionalRole: role || null,
      interests: interests || []
    }
  });

  return response.data;
}

export async function getCurrentUser() {
  const response = await apiRequest('/api/auth/me', { auth: true });
  return response.data ?? null;
}

export function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('backendToken');
  localStorage.removeItem('userType');
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
}
