import { forwardRef } from 'react';

const Card = forwardRef(({ className = '', hover = false, children, ...props }, ref) => (
  <div ref={ref} className={['card', hover && 'card-hover', className].filter(Boolean).join(' ')} {...props}>
    {children}
  </div>
));
Card.displayName = 'Card';

const CardHeader = forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={['card-header', className].filter(Boolean).join(' ')} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef(({ className = '', ...props }, ref) => (
  <h3 ref={ref} className={['card-title', className].filter(Boolean).join(' ')} {...props} />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef(({ className = '', ...props }, ref) => (
  <p ref={ref} className={['card-description', className].filter(Boolean).join(' ')} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={['card-content', className].filter(Boolean).join(' ')} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={['card-footer', className].filter(Boolean).join(' ')} {...props} />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;
