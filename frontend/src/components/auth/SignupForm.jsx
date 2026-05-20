'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Card, { CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../common/Card.jsx';
import { signupUser, validateEmail, validatePassword } from '../../services/authService';
import AuthNotice from './AuthNotice.jsx';

const interestGroups = [
  {
    label: 'Technical',
    options: [
      ['webdev', 'Web Development'],
      ['appdev', 'App Development'],
      ['ai-ml', 'AI/Machine Learning'],
      ['data-science', 'Data Science'],
      ['cybersecurity', 'Cybersecurity'],
      ['blockchain', 'Blockchain'],
      ['cloud-computing', 'Cloud Computing'],
      ['robotics', 'Robotics'],
      ['iot', 'Internet of Things (IoT)'],
      ['competitive-programming', 'Competitive Programming']
    ]
  },
  {
    label: 'Non-Technical',
    options: [
      ['public-speaking', 'Public Speaking'],
      ['entrepreneurship', 'Entrepreneurship'],
      ['content-creation', 'Content Creation'],
      ['marketing', 'Marketing'],
      ['finance', 'Finance'],
      ['design', 'UI/UX Design']
    ]
  },
  {
    label: 'Hobbies & Fun',
    options: [
      ['music', 'Music'],
      ['sports', 'Sports'],
      ['gaming', 'Gaming'],
      ['photography', 'Photography'],
      ['reading', 'Reading']
    ]
  }
];

const initialForm = {
  name: '',
  email: '',
  password: '',
  userType: 'student',
  year: '',
  branch: '',
  company: '',
  role: '',
  interests: [],
  profilePic: null
};

function getSelectedInterestText(values) {
  const labels = interestGroups
    .flatMap((group) => group.options)
    .filter(([value]) => values.includes(value))
    .map(([, label]) => label);

  if (labels.length === 0) return 'Select interests';
  if (labels.length > 2) return `${labels.length} interests selected`;
  return labels.join(', ');
}

function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState({});
  const [notice, setNotice] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { files, name, value } = event.target;
    const nextValue = name === 'profilePic' ? files?.[0] ?? null : value;

    setForm((current) => ({ ...current, [name]: nextValue }));

    if (name === 'email') {
      setFeedback((current) => ({
        ...current,
        email: validateEmail(value)
          ? { valid: true, message: '' }
          : { valid: false, message: 'Please enter a valid email structure' }
      }));
    }

    if (name === 'password') {
      setFeedback((current) => ({
        ...current,
        password: validatePassword(value)
          ? { valid: true, message: '' }
          : {
              valid: false,
              message: 'Requires 8+ letters, uppercase, lowercase, numbers, and symbols'
            }
      }));
    }
  }

  function toggleInterest(value) {
    setForm((current) => {
      const hasValue = current.interests.includes(value);
      return {
        ...current,
        interests: hasValue
          ? current.interests.filter((interest) => interest !== value)
          : [...current.interests, value]
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name || !validateEmail(form.email) || !validatePassword(form.password)) {
      setNotice('Please ensure all required fields are filled out correctly, including a valid email and a strong password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signupUser(form);
      setNotice('User created successfully! Redirecting to login portal...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      console.error('Registration Error:', error);
      setNotice(error.message || 'Registration failure. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const showStudentFields = form.userType === 'student';
  const showAlumniFields = form.userType === 'alumni';

  return (
    <div className="auth-form-panel">
      <Card className="auth-card auth-card--signup">
        <CardHeader className="auth-card__header">
          <CardTitle className="auth-card__title">Create Your Account</CardTitle>
          <CardDescription className="auth-card__description">Join UniSync today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={updateField}
              required
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="john@example.com"
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

            <div className="form-group">
              <label htmlFor="user-type" className="form-label">I am a:</label>
              <select
                className="form-input"
                id="user-type"
                name="userType"
                onChange={updateField}
                value={form.userType}
              >
                <option value="student">Student</option>
                <option value="alumni">Alumni/Industry Expert</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {showStudentFields && (
              <div className="auth-field-grid">
                <Input
                  label="Year of Study"
                  name="year"
                  type="number"
                  min="1" max="5"
                  placeholder="1"
                  value={form.year}
                  onChange={updateField}
                />
                <Input
                  label="Branch/Major"
                  name="branch"
                  type="text"
                  placeholder="Computer Science"
                  value={form.branch}
                  onChange={updateField}
                />
              </div>
            )}

            {showAlumniFields && (
              <div className="auth-field-grid">
                <Input
                  label="Company"
                  name="company"
                  type="text"
                  placeholder="Google"
                  value={form.company}
                  onChange={updateField}
                />
                <Input
                  label="Role"
                  name="role"
                  type="text"
                  placeholder="Software Engineer"
                  value={form.role}
                  onChange={updateField}
                />
              </div>
            )}

            <div className="form-group auth-interest-field">
              <label className="form-label">Interests</label>
              <button
                type="button"
                className="form-input"
                aria-expanded={isDropdownOpen}
                onClick={() => setIsDropdownOpen((open) => !open)}
              >
                <span>
                  {getSelectedInterestText(form.interests)}
                </span>
                <span aria-hidden="true">▼</span>
              </button>

              {isDropdownOpen && (
                <div className="auth-interest-menu">
                  {interestGroups.map((group) => (
                    <div className="auth-interest-group" key={group.label}>
                      <div className="auth-interest-label">{group.label}</div>
                      {group.options.map(([value, label]) => {
                        const selected = form.interests.includes(value);
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => toggleInterest(value)}
                            className={selected ? 'selected' : ''}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="profile-pic" className="form-label">Profile Picture</label>
              <input
                id="profile-pic"
                name="profilePic"
                type="file"
                onChange={updateField}
                className="auth-file-input"
              />
            </div>

            <Button type="submit" variant="primary" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="auth-card__footer">
          <p>
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </CardFooter>
      </Card>
      {notice && <AuthNotice message={notice} onClose={() => setNotice('')} />}
    </div>
  );
}

export default SignupForm;
