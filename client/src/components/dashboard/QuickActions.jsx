import { NavLink } from 'react-router-dom';
import { Users, GraduationCap, Briefcase, MessageSquare } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../common/Card.jsx';

const actions = [
  { to: '/community', icon: Users, label: 'Explore Clubs' },
  { to: '/mentorship', icon: GraduationCap, label: 'Find Mentors' },
  { to: '/jobs', icon: Briefcase, label: 'Career Hub' },
  { to: '/chat', icon: MessageSquare, label: 'Open Chat' }
];

function QuickActions() {
  return (
    <Card as="section">
      <CardHeader>
        <CardTitle style={{ fontSize: '1rem' }}>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent style={{ display: 'grid', gap: '0.75rem' }}>
        {actions.map((action) => (
          <NavLink key={action.to} to={action.to} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', color: 'var(--color-text-muted)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)', background: 'var(--color-primary-soft)' }}>
              <action.icon size={16} />
            </span>
            {action.label}
          </NavLink>
        ))}
      </CardContent>
    </Card>
  );
}

export default QuickActions;
