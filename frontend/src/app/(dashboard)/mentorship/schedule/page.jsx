'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { apiRequest } from '@/services/api';

export default function ScheduleSessionPage() {
  const router = useRouter();
  
  const [mentors, setMentors] = useState([]);
  const [formData, setFormData] = useState({
    mentorId: '',
    date: '',
    topic: ''
  });
  const [isLoadingMentors, setIsLoadingMentors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMentors() {
      try {
        const res = await apiRequest('/api/mentorships/mentors', { auth: true });
        setMentors(res.data || []);
        if (res.data && res.data.length > 0) {
          setFormData(prev => ({ ...prev, mentorId: res.data[0].id }));
        }
      } catch (err) {
        console.error('Failed to load mentors:', err);
      } finally {
        setIsLoadingMentors(false);
      }
    }
    loadMentors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await apiRequest('/api/mentorships', {
        method: 'POST',
        body: { mentorId: formData.mentorId }, // Backend only uses mentorId right now
        auth: true
      });
      router.push('/mentorship');
    } catch (err) {
      setError(err.message || 'Failed to send request');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-text-heading)' }}>Schedule a Session</h1>
        <Button variant="ghost" onClick={() => router.back()}>Back</Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Book Mentoring</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && (
              <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)' }}>
                {error}
              </div>
            )}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Select Mentor</label>
              <select 
                name="mentorId"
                value={formData.mentorId}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)' }}
                disabled={isLoadingMentors}
                required
              >
                {mentors.length === 0 ? (
                  <option value="">{isLoadingMentors ? 'Loading mentors...' : 'No mentors available'}</option>
                ) : (
                  mentors.map(mentor => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.firstName} {mentor.lastName} ({mentor.role})
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Date & Time</label>
              <Input 
                name="date"
                type="datetime-local" 
                value={formData.date}
                onChange={handleChange}
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Topic / Agenda</label>
              <textarea
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="What do you want to discuss?"
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                required
              />
            </div>
          </CardContent>
          <CardFooter style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" type="submit" disabled={isSubmitting || mentors.length === 0}>
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
