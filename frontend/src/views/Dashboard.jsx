'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Avatar from '../components/common/Avatar.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';
import Card, { CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/common/Card.jsx';
import QuickActions from '../components/dashboard/QuickActions.jsx';
import StatsCard from '../components/dashboard/StatsCard.jsx';
import { getCommunities, getJobs, getMyTickets } from '../services/dbService';
import { getCurrentUser } from '../services/authService';

const fallbackClubs = [
  { id: 'fc-1', title: 'Basketball Club', description: 'Game. Train. Win.', count: '+40', tone: 'blue' },
  { id: 'fc-2', title: 'Drama Club', description: 'Act. Express. Inspire.', count: '+18', tone: 'pink' },
  { id: 'fc-3', title: 'Photography Club', description: 'Capture. Create. Share.', count: '+30', tone: 'purple' }
];

const fallbackJobs = [
  { id: 'fj-1', title: 'UI/UX Designer Intern', company: 'TechNova Solutions', meta: ['Internship', 'Bangalore, India'], tone: 'blue' },
  { id: 'fj-2', title: 'Campus Ambassador', company: 'Unstop', meta: ['Part-time', 'Remote'], tone: 'pink' },
  { id: 'fj-3', title: 'Marketing Intern', company: 'Brandify', meta: ['Internship', 'Mumbai, India'], tone: 'purple' }
];

const calendarDays = [
  '26', '27', '28', '29', '30', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24',
  '25', '26', '27', '28', '29', '30', '31', '1', '2', '3', '4', '5', '6'
];

function Dashboard() {
  const [userName, setUserName] = useState('');
  const [clubs, setClubs] = useState(fallbackClubs);
  const [jobList, setJobList] = useState(fallbackJobs);
  const [profilePendingTasks, setProfilePendingTasks] = useState(0);
  const [profilePercent, setProfilePercent] = useState(100);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Load user name and profile completion from localStorage
  useEffect(() => {
    let ignore = false;
    const stored = localStorage.getItem('userName');
    if (stored) setUserName(stored);

    const userId = localStorage.getItem('userId');
    if (userId) {
      getCurrentUser().then(user => {
        if (!ignore && user) {
          const storedProfileStr = localStorage.getItem(`unisync_profile_${userId}`);
          const storedProfile = storedProfileStr ? JSON.parse(storedProfileStr) : null;
          
          const hasHeadline = !!(storedProfile?.headline || user.professionalRole || user.branch);
          const hasLocation = !!storedProfile?.location;
          const hasAbout = !!storedProfile?.about;
          const hasSkills = !!(storedProfile?.skills?.length || user.interests?.length);
          const hasExperience = !!(storedProfile?.sections?.find(s => s.title === 'Experience')?.items?.length);
          const hasEducation = !!(storedProfile?.sections?.find(s => s.title === 'Education')?.items?.length);
          const hasCertifications = !!(storedProfile?.sections?.find(s => s.title === 'Certifications')?.items?.length);
          
          const pendingCount = [hasHeadline, hasLocation, hasAbout, hasSkills, hasExperience, hasEducation, hasCertifications].filter(val => !val).length;
          setProfilePendingTasks(pendingCount);
          setProfilePercent(Math.round(((7 - pendingCount) / 7) * 100));
        }
      }).catch(() => {});
    }
    return () => { ignore = true; };
  }, []);

  // Load live communities
  useEffect(() => {
    let ignore = false;
    getCommunities()
      .then((items) => {
        if (!ignore && items.length > 0) {
          setClubs(items.slice(0, 3).map((c, i) => ({
            id: c.id ?? `c-${i}`,
            title: c.name,
            description: c.description || c.category || '',
            count: '+0',
            tone: ['blue', 'pink', 'purple', 'green', 'teal'][i % 5]
          })));
        }
      })
      .catch(() => { if (!ignore) setClubs(fallbackClubs); });
    return () => { ignore = true; };
  }, []);

  // Load live jobs
  useEffect(() => {
    let ignore = false;
    getJobs()
      .then((items) => {
        if (!ignore && items.length > 0) {
          setJobList(items.slice(0, 3).map((j, i) => ({
            id: j.id ?? `j-${i}`,
            title: j.title,
            company: j.company,
            meta: [j.jobType || 'Role', j.location || 'Remote'].filter(Boolean),
            tone: ['blue', 'pink', 'purple'][i % 3]
          })));
        }
      })
      .catch(() => { if (!ignore) setJobList(fallbackJobs); });
    return () => { ignore = true; };
  }, []);

  // Load my tickets
  useEffect(() => {
    let ignore = false;
    getMyTickets()
      .then((items) => {
        if (!ignore && items.length > 0) {
          setTickets(items);
        }
      })
      .catch(() => {});
    return () => { ignore = true; };
  }, []);

  const stats = [
    { label: 'Event Tickets', value: String(tickets.length), detail: 'Upcoming events', tone: 'pink' },
    { label: 'Active Clubs', value: String(clubs.length), detail: 'From your campus', tone: 'blue' },
    { label: 'Job Matches', value: String(jobList.length), detail: 'Available now', tone: 'green' }
  ];

  return (
    <div className="community-page-layout">
      <main style={{ display: 'grid', gap: '2rem', minWidth: 0 }}>
        {/* Welcome Section */}
        <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
              Welcome back{userName ? `, ${userName.split(' ')[0]}` : ''}!
            </h1>
            <p style={{ margin: '0 0 1.5rem', color: 'var(--color-text-muted)' }}>Explore opportunities, connect with peers, and make the most of your campus experience.</p>
            <Button size="sm" variant="primary">Explore Now</Button>
          </div>
          <div style={{ fontSize: '4rem' }} aria-hidden="true">🎓</div>
        </section>

        {/* Profile Completion Reminder */}
        {profilePendingTasks > 0 && (
          <section style={{ padding: '1.5rem', background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.125rem', fontWeight: 700, color: '#b45309' }}>Complete Your Profile</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400e' }}>You have {profilePendingTasks} tasks remaining. A complete profile helps you get matching jobs and mentors.</p>
              </div>
              <a href="/profile" style={{ textDecoration: 'none' }}>
                <Button size="sm" style={{ background: '#b45309', color: 'white', border: 'none' }}>Complete Profile</Button>
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, height: '8px', background: 'rgba(180, 83, 9, 0.2)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${profilePercent}%`, height: '100%', background: '#b45309', transition: 'width 0.4s ease' }} />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#b45309' }}>{profilePercent}%</span>
            </div>
          </section>
        )}

        {/* Stats Grid */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }} aria-label="Dashboard stats">
          {stats.map((item) => (
            <StatsCard key={item.label} {...item} />
          ))}
        </section>

        {/* Registered Events */}
        {tickets.length > 0 && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Your Registered Events</h3>
              <a href="/events/tickets" style={{ color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600 }}>View Tickets</a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {tickets.slice(0, 3).map((ticket) => (
                <Card key={ticket.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <CardHeader>
                    <CardTitle>{ticket.Event?.title || 'Upcoming Event'}</CardTitle>
                    <CardDescription>
                      {ticket.Event?.date ? new Date(ticket.Event.date).toLocaleDateString() : 'Date TBD'} • {ticket.Event?.location || 'Location TBD'}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Badge variant="success">Registered</Badge>
                    <Button size="sm" variant="secondary" onClick={() => setSelectedTicket(ticket)}>View QR</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Suggested Clubs */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Suggested Clubs for You</h3>
            <a href="/community" style={{ color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600 }}>View All</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {clubs.map((club) => (
              <Card key={club.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <CardHeader>
                  <CardTitle>{club.title}</CardTitle>
                  <CardDescription>{club.description}</CardDescription>
                </CardHeader>
                <CardFooter style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Badge variant="info">{club.count} members</Badge>
                  <Button size="sm" variant="ghost">Join Club</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Career Hub */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Career Hub</h3>
            <a href="/jobs" style={{ color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600 }}>View All</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {jobList.map((job) => (
              <Card key={job.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <CardHeader>
                  <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>
                    {job.company.slice(0, 2).toUpperCase()}
                  </div>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>{job.company}</CardDescription>
                </CardHeader>
                <CardContent style={{ paddingTop: 0 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {job.meta.map((item) => (
                      <Badge key={item} variant="neutral">{item}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter style={{ marginTop: 'auto' }}>
                  <Button size="sm" variant="primary" style={{ width: '100%' }}>Apply Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Right Panel */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Calendar Widget */}
        <Card>
          <CardHeader style={{ paddingBottom: '0.5rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <CardTitle style={{ fontSize: '1rem' }}>May 2026</CardTitle>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <ChevronLeft size={16} style={{ cursor: 'pointer', color: 'var(--color-text-muted)' }} />
              <ChevronRight size={16} style={{ cursor: 'pointer', color: 'var(--color-text-muted)' }} />
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: '0.25rem', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((day) => <span key={day}>{day}</span>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: '0.5rem 0.25rem', fontSize: '0.875rem' }}>
              {calendarDays.map((day, index) => {
                const isMuted = index < 5 || index > 35;
                const isPrimary = day === '20';
                return (
                  <span key={`${day}-${index}`} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', margin: '0 auto', borderRadius: '50%',
                    color: isMuted ? 'var(--color-border)' : isPrimary ? 'white' : 'var(--color-text)',
                    background: isPrimary ? 'var(--color-primary)' : 'transparent',
                    fontWeight: isPrimary ? 600 : 400
                  }}>
                    {day}
                  </span>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <QuickActions />
      </aside>

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

export default Dashboard;
