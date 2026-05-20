import { useState } from 'react';
import Avatar from '../common/Avatar.jsx';
import Button from '../common/Button.jsx';

function PersonList({ people }) {
  const [sent, setSent] = useState([]);

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {people.map((person) => {
        const isSent = sent.includes(person.id);
        return (
          <div key={person.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Avatar name={person.name} tone={person.tone} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <strong style={{ fontSize: '0.875rem', color: 'var(--color-text-heading)' }}>{person.name}</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{person.role}</span>
              {person.mutual ? <small style={{ fontSize: '0.7rem', color: 'var(--color-text-soft)' }}>{person.mutual}</small> : null}
            </div>
            <Button
              size="sm"
              variant={isSent ? 'primary' : 'secondary'}
              onClick={() => setSent((current) => [...new Set([...current, person.id])])}
            >
              {isSent ? 'Sent' : 'Connect'}
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export default PersonList;
