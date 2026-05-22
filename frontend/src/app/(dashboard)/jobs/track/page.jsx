'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { apiRequest } from '@/services/api';

export default function TrackApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      try {
        const res = await apiRequest('/api/jobs/applications', { auth: true });
        setApplications(res.data || []);
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadApplications();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-text-heading)' }}>Track Applications</h1>
        <Button variant="ghost" onClick={() => router.back()}>Back</Button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {isLoading ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Loading applications...</p>
        ) : applications.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>You haven't applied to any jobs yet.</p>
        ) : (
          applications.map(app => (
            <Card key={app.id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: '1.5rem' }}>
              <div>
                <CardHeader style={{ paddingBottom: '0.5rem' }}>
                  <CardTitle>{app.Job?.title || 'Job Title'}</CardTitle>
                </CardHeader>
                <CardContent style={{ paddingBottom: '1.5rem' }}>
                  <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    {app.Job?.company || 'Company'} • Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Badge variant={app.status === 'under_review' ? 'warning' : app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'danger' : 'primary'}>
                  {app.status ? app.status.replace('_', ' ') : 'Under Review'}
                </Badge>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
