import { forwardRef } from 'react';

const Badge = forwardRef(({
  variant = 'primary',
  className = '',
  children,
  ...props
}, ref) => {
  const classes = [
    'badge',
    variant ? `badge-${variant}` : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <span ref={ref} className={classes} {...props}>
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
