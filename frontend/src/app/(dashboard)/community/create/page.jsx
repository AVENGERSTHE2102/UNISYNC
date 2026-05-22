'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { apiRequest } from '@/services/api';

export default function CreateCommunityPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Tech' // Default
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
      await apiRequest('/api/communities', {
        method: 'POST',
        body: formData,
        auth: true
      });
      // Head back to communities page where they can see the newly created one
      router.push('/community');
    } catch (err) {
      setError(err.message || 'Failed to create community');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Create a Community</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && (
              <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)' }}>
                {error}
              </div>
            )}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Community Name</label>
              <Input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="e.g., Coding Wizards" 
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  fontFamily: 'inherit'
                }}
                required
              >
                <option value="Tech">Tech</option>
                <option value="Arts">Arts</option>
                <option value="Sports">Sports</option>
                <option value="Academics">Academics</option>
                <option value="Social">Social</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What is this community about?"
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
          <CardFooter style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button variant="ghost" onClick={() => router.back()} type="button" disabled={isSubmitting}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Community'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
