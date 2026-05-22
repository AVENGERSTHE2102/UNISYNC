'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/common/Card';
import Button from '@/components/common/Button';
import { apiRequest } from '@/services/api';
import Modal from '@/components/common/Modal';

export default function MyTicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await apiRequest('/api/events/tickets', { auth: true });
        setTickets(res.data || []);
      } catch (err) {
        console.error('Failed to load tickets', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTickets();
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-text-heading)' }}>My Tickets</h1>
        <Button variant="ghost" onClick={() => router.back()}>Back</Button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {isLoading ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Loading your tickets...</p>
        ) : tickets.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>You haven't registered for any events yet.</p>
        ) : (
          tickets.map(ticket => (
            <Card key={ticket.id || ticket.Event?.id}>
              <CardHeader>
                <CardTitle>{ticket.Event?.title || 'Event Title'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  {ticket.Event?.date ? new Date(ticket.Event.date).toLocaleDateString() : 'TBD'} • {ticket.Event?.location || 'TBD'}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm" style={{ width: '100%' }} onClick={() => setSelectedTicket(ticket)}>
                  View QR Code
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <Modal
        open={Boolean(selectedTicket)}
        title="Event Ticket"
        onClose={() => setSelectedTicket(null)}
      >
        {selectedTicket && (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>
              {selectedTicket.Event?.title || 'Event Ticket'}
            </h3>
            <p style={{ margin: '0 0 1.5rem', color: 'var(--color-text-muted)' }}>
              {selectedTicket.Event?.date ? new Date(selectedTicket.Event.date).toLocaleDateString() : 'TBD'} • {selectedTicket.Event?.location || 'TBD'}
            </p>
            <div style={{ background: 'white', padding: '1rem', display: 'inline-block', borderRadius: 'var(--radius-md)' }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ticket:${selectedTicket.id}`} 
                alt="QR Code" 
                style={{ display: 'block', width: '200px', height: '200px' }} 
              />
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Ticket ID: {selectedTicket.id}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
