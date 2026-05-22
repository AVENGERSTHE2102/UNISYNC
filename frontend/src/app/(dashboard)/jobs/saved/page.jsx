'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import Button from '@/components/common/Button';
import { apiRequest } from '@/services/api';

export default function SavedJobsPage() {
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSavedJobs() {
      try {
        const res = await apiRequest('/api/jobs/saved', { auth: true });
        setSavedJobs(res.data || []);
      } catch (err) {
        console.error('Failed to load saved jobs', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSavedJobs();
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await apiRequest(`/api/jobs/${jobId}/save`, { method: 'DELETE', auth: true });
      setSavedJobs(prev => prev.filter(sj => sj.jobId !== jobId));
    } catch (err) {
      console.error('Failed to unsave job', err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-text-heading)' }}>Saved Jobs</h1>
        <Button variant="ghost" onClick={() => router.back()}>Back</Button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {isLoading ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Loading saved jobs...</p>
        ) : savedJobs.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>You have no saved jobs.</p>
        ) : (
          savedJobs.map(sj => (
            <Card key={sj.id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: '1.5rem' }}>
              <div>
                <CardHeader style={{ paddingBottom: '0.5rem' }}>
                  <CardTitle>{sj.Job?.title || 'Job Title'}</CardTitle>
                </CardHeader>
                <CardContent style={{ paddingBottom: '1.5rem' }}>
                  <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    {sj.Job?.company || 'Company'} • {sj.Job?.location || 'Remote'}
                  </p>
                </CardContent>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button variant="secondary" size="sm" onClick={() => handleUnsave(sj.jobId)}>Remove</Button>
                <Button variant="primary" size="sm" onClick={() => router.push(`/jobs`)}>Apply</Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
