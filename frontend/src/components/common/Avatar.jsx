import { User } from 'lucide-react';

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Avatar({
  alt = '',
  name = '',
  size = 'md',
  className = '',
  style = {},
  src,
  tone
}) {
  const initials = getInitials(name || alt);
  const imageSrc = typeof src === 'string' ? src : src?.src;

  const baseStyle = {
    background: imageSrc ? 'transparent' : 'var(--color-primary-soft)',
    color: 'var(--color-primary-dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    overflow: 'hidden',
    ...style
  };

  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 24 : 18;
  const label = alt || name || 'User avatar';

  return (
    <span
      className={[
        'us-avatar',
        `us-avatar--${size}`,
        tone && `us-avatar--${tone}`,
        className
      ].filter(Boolean).join(' ')}
      style={baseStyle}
      aria-label={!imageSrc ? label : undefined}
      role={imageSrc ? 'img' : undefined}
    >
      {imageSrc ? (
        <img src={imageSrc} alt={label} />
      ) : initials ? (
        initials
      ) : (
        <User size={iconSize} />
      )}
    </span>
  );
}

export default Avatar;
