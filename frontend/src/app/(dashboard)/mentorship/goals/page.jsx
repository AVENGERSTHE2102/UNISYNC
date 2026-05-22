'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { apiRequest } from '@/services/api';

export default function SetGoalPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    targetDate: '',
    actionPlan: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await apiRequest('/api/mentorships/goals', {
        method: 'POST',
        body: formData,
        auth: true
      });
      router.push('/mentorship');
    } catch (err) {
      setError(err.message || 'Failed to save goal');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-text-heading)' }}>Set a Goal</h1>
        <Button variant="ghost" onClick={() => router.back()}>Back</Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Define Your Objective</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && (
              <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)' }}>
                {error}
              </div>
            )}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Goal Title</label>
              <Input 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="e.g., Get a Summer Internship" 
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Target Date</label>
              <Input 
                name="targetDate" 
                type="date" 
                value={formData.targetDate} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Action Plan</label>
              <textarea
                name="actionPlan"
                value={formData.actionPlan}
                onChange={handleChange}
                placeholder="What steps will you take?"
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
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Goal'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
