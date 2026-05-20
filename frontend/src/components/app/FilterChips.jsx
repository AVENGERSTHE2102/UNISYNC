function FilterChips({ filters, active, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          type="button"
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: active === filter ? '1px solid transparent' : '1px solid var(--color-border)',
            background: active === filter ? 'var(--color-primary)' : 'var(--color-surface)',
            color: active === filter ? 'white' : 'var(--color-text-muted)'
          }}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

export default FilterChips;
