import { useEffect, useState } from 'react';
import Link from 'next/link';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Card, { CardContent, CardHeader, CardTitle, CardFooter } from '../components/common/Card.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import FilterChips from '../components/app/FilterChips.jsx';
import SidePanel from '../components/app/SidePanel.jsx';
import { eventFilters, fallbackEvents } from '../data/eventsData';
import { getEvents, getMyTickets, registerForEvent } from '../services/dbService';

function Events() {
  const [events, setEvents] = useState(fallbackEvents);
  const [activeFilter, setActiveFilter] = useState('All');
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [registeringIds, setRegisteringIds] = useState(new Set());

  useEffect(() => {
    let ignore = false;

    Promise.all([
      getEvents().catch(() => fallbackEvents),
      getMyTickets().catch(() => [])
    ]).then(([apiEvents, tickets]) => {
      if (!ignore) {
        if (apiEvents.length > 0) setEvents(apiEvents);
        if (tickets.length > 0) {
          setRegisteredEvents(tickets.map(t => t.eventId || t.Event?.id));
        }
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  const handleRegister = async (eventId) => {
    if (!eventId) return;
    setRegisteringIds(prev => new Set(prev).add(eventId));
    try {
      await registerForEvent(eventId);
      setRegisteredEvents(prev => [...prev, eventId]);
    } catch (err) {
      alert(err.message || 'Failed to register for event');
    } finally {
      setRegisteringIds(prev => {
        const next = new Set(prev);
        next.delete(eventId);
        return next;
      });
    }
  };

  const filteredEvents =
    activeFilter === 'All'
      ? events
      : events.filter((event) => event.eventType?.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div className="community-page-layout">
      <main style={{ display: 'grid', gap: '2rem', minWidth: 0 }}>
        <PageHeader
          title="Campus Events"
          subtitle="Discover and register for upcoming workshops, hackathons, seminars, and networking events on campus."
          action={<Button variant="primary">Host Event</Button>}
        />
        <FilterChips filters={eventFilters} active={activeFilter} onChange={setActiveFilter} />
        
        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--color-text-heading)' }}>Upcoming Events</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {filteredEvents.map((event) => {
              const eventDate = event.date ? new Date(event.date) : new Date();
              const isRegistered = registeredEvents.includes(event.id);
              const isRegistering = registeringIds.has(event.id);
              
              return (
                <Card key={event.id ?? event.title} style={{ display: 'flex', flexDirection: 'column' }}>
                  <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', paddingBottom: '0.5rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>
                      {eventDate.toLocaleString('default', { month: 'short' }).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <CardTitle style={{ fontSize: '1rem' }}>{event.title}</CardTitle>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{eventDate.toLocaleDateString()}</p>
                    </div>
                  </CardHeader>
                  <CardContent style={{ paddingTop: 0, flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{event.description}</p>
                  </CardContent>
                  <CardFooter style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Badge variant="info">{event.eventType || 'General'}</Badge>
                    <Button 
                      size="sm" 
                      variant={isRegistered ? 'secondary' : 'primary'}
                      disabled={isRegistered || isRegistering || !event.id}
                      onClick={() => handleRegister(event.id)}
                    >
                      {isRegistering ? 'Registering...' : isRegistered ? 'Registered' : 'Register Now'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <SidePanel title="Your Stats">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
            <div style={{ padding: '0.75rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}><strong style={{ display: 'block', color: 'var(--color-primary-strong)', fontSize: '1.25rem' }}>{registeredEvents.length}</strong><span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Upcoming</span></div>
            <div style={{ padding: '0.75rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}><strong style={{ display: 'block', color: 'var(--color-primary-strong)', fontSize: '1.25rem' }}>12</strong><span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Attended</span></div>
            <div style={{ padding: '0.75rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}><strong style={{ display: 'block', color: 'var(--color-primary-strong)', fontSize: '1.25rem' }}>2</strong><span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Hosted</span></div>
          </div>
        </SidePanel>
        <SidePanel title="Quick Actions">
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <Button as={Link} href="/events/host" variant="ghost" style={{ justifyContent: 'flex-start' }}>Host an Event</Button>
            <Button as={Link} href="/events/tickets" variant="ghost" style={{ justifyContent: 'flex-start' }}>My Tickets</Button>
            <Button as={Link} href="/events/calendar-sync" variant="ghost" style={{ justifyContent: 'flex-start' }}>Calendar Sync</Button>
          </div>
        </SidePanel>
      </aside>
    </div>
  );
}

export default Events;
