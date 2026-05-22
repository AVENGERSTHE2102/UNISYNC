'use client';

import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/common/Card';
import Button from '@/components/common/Button';

export default function CalendarSyncPage() {
  const router = useRouter();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-text-heading)' }}>Calendar Sync</h1>
        <Button variant="ghost" onClick={() => router.back()}>Back</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sync Your Events</CardTitle>
        </CardHeader>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Never miss an event by syncing your registered events to your personal calendar.</p>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <Button variant="secondary" style={{ display: 'flex', justifyContent: 'space-between' }}>
              Google Calendar <span>Connect</span>
            </Button>
            <Button variant="secondary" style={{ display: 'flex', justifyContent: 'space-between' }}>
              Apple Calendar <span>Connect</span>
            </Button>
            <Button variant="secondary" style={{ display: 'flex', justifyContent: 'space-between' }}>
              Outlook Calendar <span>Connect</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
