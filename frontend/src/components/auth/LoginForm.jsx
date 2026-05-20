'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Card, { CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../common/Card.jsx';
import { loginUser, validateEmail, validatePassword } from '../../services/authService';
import AuthNotice from './AuthNotice.jsx';

const initialForm = {
  email: '',
  password: ''
};

function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState({});
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));

    if (name === 'email') {
      setFeedback((current) => ({
        ...current,
        email: validateEmail(value)
          ? { valid: true, message: '' }
          : { valid: false, message: 'Please enter a valid email address' }
      }));
    }

    if (name === 'password') {
      setFeedback((current) => ({
        ...current,
        password: validatePassword(value)
          ? { valid: true, message: '' }
          : { valid: false, message: 'Password needs 8+ characters, uppercase, lowercase, number, & symbol' }
      }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateEmail(form.email) || !validatePassword(form.password)) {
      setNotice('Please correct the errors in your form fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginUser(form);
      setNotice('User authenticated successfully! Syncing space channels...');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (error) {
      console.error('Login Error:', error);
      setNotice(error.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-form-panel">
      <Card className="auth-card auth-card--login">
        <CardHeader className="auth-card__header">
          <CardTitle className="auth-card__title">Welcome Back</CardTitle>
          <CardDescription className="auth-card__description">Login to UniSync</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={updateField}
              error={feedback.email && !feedback.email.valid ? feedback.email.message : ''}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={updateField}
              error={feedback.password && !feedback.password.valid ? feedback.password.message : ''}
              required
            />
            <Button type="submit" variant="primary" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="auth-card__footer">
          <p>
            Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
          </p>
        </CardFooter>
      </Card>
      {notice && <AuthNotice message={notice} onClose={() => setNotice('')} />}
    </div>
  );
}

export default LoginForm;
