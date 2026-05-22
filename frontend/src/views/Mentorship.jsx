import { useEffect, useState } from 'react';
import Link from 'next/link';
import Avatar from '../components/common/Avatar.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Card, { CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/common/Card.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import FilterChips from '../components/app/FilterChips.jsx';
import ProfileMiniCard from '../components/app/ProfileMiniCard.jsx';
import SidePanel from '../components/app/SidePanel.jsx';
import { mentors, mentorshipFilters, sessions } from '../data/mentorshipData';
import { getPotentialMentors } from '../services/dbService';


function mapApiMentors(users) {
  return users.map((user, index) => ({
    id: user.id,
    initials: user.name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'MN',
    name: user.name,
    role: user.professionalRole || user.branch || 'Industry Expert',
    category: (user.interests && user.interests.length > 0) ? user.interests[0] : 'General',
    skills: user.interests || [],
    tagline: user.company ? `Working at ${user.company}` : 'Available for mentorship',
    count: '+0',
    tone: ['blue', 'pink', 'green', 'purple'][index % 4],
    online: index % 2 === 0
  }));
}

function Mentorship() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [mentorList, setMentorList] = useState(mentors);
  const [requested, setRequested] = useState([]);
  const [userRole, setUserRole] = useState('student');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [mySessions, setMySessions] = useState([]);
  const [connecting, setConnecting] = useState(null);

  useEffect(() => {
    let ignore = false;
    const role = localStorage.getItem('userType') || 'student';
    const userId = Number(localStorage.getItem('userId'));
    setUserRole(role);
    setCurrentUserId(userId);

    // Load potential mentors
    getPotentialMentors()
      .then((users) => {
        if (!ignore && users.length > 0) {
          setMentorList(mapApiMentors(users));
        }
      })
      .catch(() => {
        if (!ignore) setMentorList(mentors);
      });

    // Load existing mentorship requests/sessions
    import('../services/dbService').then(({ getMentorships }) => {
      getMentorships().then((requests) => {
        if (!ignore && requests) {
          setRequested(requests.filter(req => req.studentId === userId).map(req => req.mentorId));
          setMySessions(requests.map(req => {
            const isMentor = userId === Number(req.mentorId);
            const otherPerson = isMentor ? req.student : req.mentor;
            return {
              id: req.id,
              isMentor,
              title: otherPerson ? otherPerson.name : 'Unknown User',
              sub: otherPerson && otherPerson.professionalRole ? otherPerson.professionalRole : (isMentor ? 'Student/Mentee' : 'Mentor'),
              type: '1:1 Mentorship',
              status: req.status.charAt(0).toUpperCase() + req.status.slice(1),
              icon: '🎓',
              rawRequest: req
            };
          }));
        }
      }).catch(console.error);
    });

    return () => {
      ignore = true;
    };
  }, []);

  async function handleConnect(mentorId) {
    setConnecting(mentorId);
    try {
      const { createMentorship } = await import('../services/dbService');
      const newRequest = await createMentorship({ mentorId });
      setRequested((current) => [...current, mentorId]);
      setMySessions((current) => [{
        id: newRequest.id || Math.random(),
        title: mentorList.find(m => m.id === mentorId)?.name || 'Mentor',
        sub: 'Mentorship',
        type: '1:1 Session',
        status: 'Pending',
        icon: '🎓'
      }, ...current]);
    } catch (err) {
      alert(err.message || 'Failed to send mentorship request.');
    } finally {
      setConnecting(null);
    }
  }

  async function handleUpdateStatus(id, status) {
    try {
      const { updateMentorshipStatus } = await import('../services/dbService');
      await updateMentorshipStatus(id, status);
      setMySessions(current => current.map(s => s.id === id ? { ...s, status: status.charAt(0).toUpperCase() + status.slice(1) } : s));
    } catch (err) {
      alert(err.message || 'Failed to update request.');
    }
  }

  const isAlumni = userRole === 'alumni' || userRole === 'admin';
  const incomingRequests = mySessions.filter(s => s.isMentor && s.status === 'Pending');
  const activeMentees = mySessions.filter(s => s.isMentor && s.status === 'Active');
  const myMentors = mySessions.filter(s => !s.isMentor);

  const filteredMentors =
    activeFilter === 'All'
      ? mentorList
      : mentorList.filter((mentor) => mentor.category === activeFilter);

  return (
    <div className="community-page-layout">
      <main style={{ display: 'grid', gap: '2rem', minWidth: 0 }}>
        <PageHeader
          title={isAlumni ? "Mentor Dashboard" : "Find Your Perfect Mentor"}
          subtitle={isAlumni ? "Manage your mentees and incoming mentorship requests." : "Connect with experienced seniors, alumni and industry professionals who can guide your academic and career journey."}
          action={!isAlumni && <Button variant="primary">Become a Mentor</Button>}
        />
        
        {isAlumni && (
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Incoming Requests</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {incomingRequests.length > 0 ? incomingRequests.map((session) => (
                <Card key={session.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', paddingBottom: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                      {session.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <CardTitle style={{ fontSize: '1rem' }}>{session.title}</CardTitle>
                      <CardDescription>{session.sub}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}>Requested a mentorship connection.</p>
                  </CardContent>
                  <CardFooter style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', gap: '0.5rem', alignItems: 'center' }}>
                    <Button variant="secondary" size="sm" style={{ flex: 1 }} onClick={() => handleUpdateStatus(session.id, 'declined')}>Decline</Button>
                    <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => handleUpdateStatus(session.id, 'active')}>Accept</Button>
                  </CardFooter>
                </Card>
              )) : (
                <p style={{ color: 'var(--color-text-muted)' }}>No pending requests at the moment.</p>
              )}
            </div>
          </section>
        )}

        {isAlumni && (
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>My Active Mentees</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {activeMentees.length > 0 ? activeMentees.map((session) => (
                <Card key={session.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', paddingBottom: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                      {session.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <CardTitle style={{ fontSize: '1rem' }}>{session.title}</CardTitle>
                      <CardDescription>{session.sub}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Badge variant="success">Active</Badge>
                    <Button variant="ghost" size="sm" as={Link} href="/chat">Message</Button>
                  </CardFooter>
                </Card>
              )) : (
                <p style={{ color: 'var(--color-text-muted)' }}>You don't have any active mentees yet.</p>
              )}
            </div>
          </section>
        )}

        {!isAlumni && <FilterChips filters={mentorshipFilters} active={activeFilter} onChange={setActiveFilter} />}

        {!isAlumni && (
          <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Suggested Mentors for You</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {filteredMentors.map((mentor) => {
              const isRequested = requested.includes(mentor.id);
              return (
                <Card key={mentor.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', paddingBottom: '0.5rem' }}>
                    <div style={{ position: 'relative' }}>
                      <Avatar name={mentor.name} tone={mentor.tone} />
                      {mentor.online && <span style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', background: 'var(--color-success)', borderRadius: '50%', border: '2px solid var(--color-surface)' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <CardTitle style={{ fontSize: '1rem' }}>{mentor.name}</CardTitle>
                      <CardDescription>{mentor.role}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent style={{ paddingTop: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {mentor.skills.slice(0, 2).map((skill) => (
                        <Badge key={skill} variant="neutral">{skill}</Badge>
                      ))}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text)' }}>{mentor.tagline}</p>
                  </CardContent>
                  <CardFooter style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{mentor.count} mentees</span>
                    <Button
                      disabled={isRequested || connecting === mentor.id}
                      size="sm"
                      variant={isRequested ? 'secondary' : 'primary'}
                      onClick={() => handleConnect(mentor.id)}
                    >
                      {isRequested ? 'Requested' : (connecting === mentor.id ? 'Sending...' : 'Connect')}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>
        )}

        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>{isAlumni ? "Mentorships I've Requested" : "My Mentors"}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {myMentors.length > 0 ? myMentors.map((session) => (
              <Card key={session.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', paddingBottom: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                    {session.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <CardTitle style={{ fontSize: '1rem' }}>{session.title}</CardTitle>
                    <CardDescription>{session.sub}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{session.type}</span>
                  <Badge variant={session.status === 'Pending' ? 'warning' : 'info'}>{session.status}</Badge>
                </CardFooter>
              </Card>
            )) : (
              <p style={{ color: 'var(--color-text-muted)' }}>You haven't requested any mentorship sessions yet.</p>
            )}
          </div>
        </section>
      </main>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <SidePanel title="Your Stats">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
            <div style={{ padding: '0.75rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}><strong style={{ display: 'block', color: 'var(--color-primary-strong)', fontSize: '1.25rem' }}>3</strong><span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Sessions</span></div>
            <div style={{ padding: '0.75rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}><strong style={{ display: 'block', color: 'var(--color-primary-strong)', fontSize: '1.25rem' }}>{requested.length}</strong><span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Requests</span></div>
            <div style={{ padding: '0.75rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}><strong style={{ display: 'block', color: 'var(--color-primary-strong)', fontSize: '1.25rem' }}>1</strong><span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Goals</span></div>
          </div>
        </SidePanel>
        <SidePanel title="Quick Actions">
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <Button as={Link} href="/mentorship" variant="ghost" style={{ justifyContent: 'flex-start' }}>Find a Mentor</Button>
            <Button as={Link} href="/mentorship/schedule" variant="ghost" style={{ justifyContent: 'flex-start' }}>Schedule Session</Button>
            <Button as={Link} href="/chat" variant="ghost" style={{ justifyContent: 'flex-start' }}>Check Messages</Button>
            <Button as={Link} href="/mentorship/goals" variant="ghost" style={{ justifyContent: 'flex-start' }}>Set a Goal</Button>
          </div>
        </SidePanel>
        <SidePanel title="Top Rated">
          <div style={{ display: 'grid', gap: '1rem' }}>
            {mentorList.slice(0, 4).map((mentor) => (
              <div key={mentor.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Avatar name={mentor.name} tone={mentor.tone} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <strong style={{ fontSize: '0.875rem', color: 'var(--color-text-heading)' }}>{mentor.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-warning)' }}>★★★★★</span>
                </div>
                <Button size="sm" variant="secondary">Connect</Button>
              </div>
            ))}
          </div>
        </SidePanel>
      </aside>
    </div>
  );
}

export default Mentorship;
