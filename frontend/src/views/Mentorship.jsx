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


function mapApiMentors(mentorships) {
  return mentorships.map((mentorship, index) => ({
    id: `api-mentor-${mentorship.id ?? index}`,
    initials: mentorship.mentorName
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'MN',
    name: mentorship.mentorName,
    role: mentorship.expertise,
    category: mentorship.expertise,
    skills: [mentorship.expertise].filter(Boolean),
    tagline: mentorship.bio,
    count: '+0',
    tone: ['blue', 'pink', 'green', 'purple'][index % 4],
    online: index % 2 === 0
  }));
}

function Mentorship() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [mentorList, setMentorList] = useState(mentors);
  const [requested, setRequested] = useState([]);

  useEffect(() => {
    let ignore = false;

    getPotentialMentors()
      .then((mentorships) => {
        if (!ignore && mentorships.length > 0) {
          setMentorList(mapApiMentors(mentorships));
        }
      })
      .catch(() => {
        if (!ignore) setMentorList(mentors);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredMentors =
    activeFilter === 'All'
      ? mentorList
      : mentorList.filter((mentor) => mentor.category === activeFilter);

  return (
    <div className="community-page-layout">
      <main style={{ display: 'grid', gap: '2rem', minWidth: 0 }}>
        <PageHeader
          title="Find Your Perfect Mentor"
          subtitle="Connect with experienced seniors, alumni and industry professionals who can guide your academic and career journey."
          action={<Button variant="primary">Become a Mentor</Button>}
        />
        <FilterChips filters={mentorshipFilters} active={activeFilter} onChange={setActiveFilter} />

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
                      disabled={isRequested}
                      size="sm"
                      variant={isRequested ? 'secondary' : 'primary'}
                      onClick={() => setRequested((current) => [...current, mentor.id])}
                    >
                      {isRequested ? 'Requested' : 'Connect'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>My Sessions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {sessions.map((session) => (
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
                  <Badge variant="info">{session.status}</Badge>
                </CardFooter>
              </Card>
            ))}
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
