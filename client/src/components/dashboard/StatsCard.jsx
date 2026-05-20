import Card, { CardContent } from '../common/Card.jsx';

function StatsCard({ label, value, detail, tone = 'blue' }) {
  const borderColors = {
    blue: 'var(--color-primary)',
    purple: 'var(--color-purple)',
    green: 'var(--color-success)',
    pink: 'var(--color-danger)'
  };

  return (
    <Card style={{ borderTop: `3px solid ${borderColors[tone] || 'var(--color-primary)'}`, height: '100%' }}>
      <CardContent style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', padding: '1.25rem' }}>
        <div>
          <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{label}</p>
          <strong style={{ display: 'block', color: 'var(--color-text-heading)', fontSize: '2rem', lineHeight: 1.1, marginTop: '0.25rem' }}>{value}</strong>
        </div>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{detail}</span>
      </CardContent>
    </Card>
  );
}

export default StatsCard;
