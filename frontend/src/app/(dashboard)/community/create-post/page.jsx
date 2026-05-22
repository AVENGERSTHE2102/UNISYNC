'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { apiRequest } from '@/services/api';

export default function CreatePostPage() {
  const router = useRouter();
  
  const [communities, setCommunities] = useState([]);
  const [formData, setFormData] = useState({
    communityId: '',
    title: '',
    body: '',
    tag: ''
  });
  
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCommunities() {
      try {
        const res = await apiRequest('/api/communities', { auth: true });
        // The API returns { data: [...] }
        const comms = res.data || [];
        setCommunities(comms);
        if (comms.length > 0) {
          setFormData(prev => ({ ...prev, communityId: comms[0].id }));
        }
      } catch (err) {
        console.error('Failed to load communities:', err);
      } finally {
        setIsLoadingCommunities(false);
      }
    }
    loadCommunities();
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
      await apiRequest(`/api/communities/${formData.communityId}/threads`, {
        method: 'POST',
        body: { title: formData.title, body: formData.body },
        auth: true
      });
      router.push('/community');
    } catch (err) {
      setError(err.message || 'Failed to create post');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Create a Post</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && (
              <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)' }}>
                {error}
              </div>
            )}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Select Community</label>
              <select 
                name="communityId"
                value={formData.communityId}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)' }}
                disabled={isLoadingCommunities}
                required
              >
                {communities.length === 0 ? (
                  <option value="">{isLoadingCommunities ? 'Loading communities...' : 'No communities available'}</option>
                ) : (
                  communities.map(comm => (
                    <option key={comm.id} value={comm.id}>
                      {comm.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Title</label>
              <Input 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Post title" 
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>What's on your mind?</label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleChange}
                placeholder="Share your thoughts with the community..."
                style={{
                  width: '100%',
                  minHeight: '150px',
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
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Tag (Optional)</label>
              <Input 
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                placeholder="e.g., General, Announcement, Help" 
              />
            </div>
          </CardContent>
          <CardFooter style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button variant="ghost" onClick={() => router.back()} type="button" disabled={isSubmitting}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={isSubmitting || communities.length === 0 || !formData.title.trim() || !formData.body.trim()}>
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
