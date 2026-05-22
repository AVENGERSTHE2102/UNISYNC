'use client';

import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/common/Card';
import Button from '@/components/common/Button';

export default function JobAlertsPage() {
  const router = useRouter();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-text-heading)' }}>Job Alerts</h1>
        <Button variant="ghost" onClick={() => router.back()}>Back</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--color-text-heading)' }}>New Internships</strong>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Get notified when new internships are posted</span>
            </div>
            <input type="checkbox" defaultChecked style={{ width: '1.25rem', height: '1.25rem' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--color-text-heading)' }}>Application Updates</strong>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Get notified about status changes</span>
            </div>
            <input type="checkbox" defaultChecked style={{ width: '1.25rem', height: '1.25rem' }} />
          </div>
        </CardContent>
        <CardFooter style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
          <Button variant="primary">Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
