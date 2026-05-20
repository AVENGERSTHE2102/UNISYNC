import { forwardRef } from 'react';

const Button = forwardRef(({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  children,
  ...props
}, ref) => {
  const classes = [
    'btn',
    variant ? `btn-${variant}` : '',
    size !== 'md' ? `btn-${size}` : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component 
      ref={ref}
      className={classes} 
      type={Component === 'button' ? type : undefined} 
      {...props}
    >
      {children}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;
