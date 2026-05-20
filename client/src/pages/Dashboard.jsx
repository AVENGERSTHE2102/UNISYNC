import { ChevronLeft, ChevronRight } from 'lucide-react';
import Avatar from '../components/common/Avatar.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Card, { CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/common/Card.jsx';
import QuickActions from '../components/dashboard/QuickActions.jsx';
import StatsCard from '../components/dashboard/StatsCard.jsx';

const stats = [
  { label: 'Active Clubs', value: '12', detail: '+3 this month', tone: 'blue' },
  { label: 'Mentor Sessions', value: '8', detail: '2 upcoming', tone: 'purple' },
  { label: 'Job Matches', value: '24', detail: '6 new today', tone: 'green' }
];

const clubs = [
  {
    title: 'Basketball Club',
    description: 'Game. Train. Win.',
    count: '+40',
    tone: 'blue'
  },
  {
    title: 'Drama Club',
    description: 'Act. Express. Inspire.',
    count: '+18',
    tone: 'pink'
  },
  {
    title: 'Photography Club',
    description: 'Capture. Create. Share.',
    count: '+30',
    tone: 'purple'
  }
];

const jobs = [
  {
    title: 'UI/UX Designer Intern',
    company: 'TechNova Solutions',
    meta: ['Internship', 'Bangalore, India'],
    tone: 'blue'
  },
  {
    title: 'Campus Ambassador',
    company: 'Unstop',
    meta: ['Part-time', 'Remote'],
    tone: 'pink'
  },
  {
    title: 'Marketing Intern',
    company: 'Brandify',
    meta: ['Internship', 'Mumbai, India'],
    tone: 'purple'
  }
];

const calendarDays = [
  '26', '27', '28', '29', '30', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '1', '2', '3', '4', '5', '6'
];

function Dashboard() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem', alignItems: 'start' }}>
      <main style={{ display: 'grid', gap: '2rem', minWidth: 0 }}>
        {/* Welcome Section */}
        <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>Welcome back, Arjun!</h1>
            <p style={{ margin: '0 0 1.5rem', color: 'var(--color-text-muted)' }}>Explore opportunities, connect with peers, and make the most of your campus experience.</p>
            <Button size="sm" variant="primary">Explore Now</Button>
          </div>
          <div style={{ fontSize: '4rem' }} aria-hidden="true">🎓</div>
        </section>

        {/* Stats Grid */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }} aria-label="Dashboard stats">
          {stats.map((item) => (
            <StatsCard key={item.label} {...item} />
          ))}
        </section>

        {/* Suggested Clubs */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Suggested Clubs for You</h3>
            <a href="/community" style={{ color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600 }}>View All</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {clubs.map((club) => (
              <Card key={club.title} style={{ display: 'flex', flexDirection: 'column' }}>
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
            {jobs.map((job) => (
              <Card key={job.title} style={{ display: 'flex', flexDirection: 'column' }}>
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
                const isPrimary = day === '16';
                
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
    </div>
  );
}

export default Dashboard;
