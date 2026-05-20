import Avatar from '../common/Avatar.jsx';
import Button from '../common/Button.jsx';
import Card, { CardContent } from '../common/Card.jsx';

function ProfileMiniCard() {
  return (
    <Card>
      <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Avatar name="Arjun Mehta" tone="blue" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-heading)' }}>Arjun Mehta</strong>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>B.Tech 2nd Year</span>
          </div>
        </div>
        <Button size="sm" variant="secondary" style={{ width: '100%' }}>View Profile</Button>
      </CardContent>
    </Card>
  );
}

export default ProfileMiniCard;
