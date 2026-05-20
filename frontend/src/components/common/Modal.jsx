import Button from './Button.jsx';

function Modal({
  open,
  title,
  children,
  onClose,
  actions,
  className = ''
}) {
  if (!open) return null;

  return (
    <div className="us-modal" role="presentation">
      <div className="us-modal__backdrop" onClick={onClose} />
      <section
        className={['us-modal__panel', className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'us-modal-title' : undefined}
      >
        <header className="us-modal__header">
          {title ? <h2 id="us-modal-title">{title}</h2> : null}
          <Button
            aria-label="Close modal"
            className="us-modal__close"
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            x
          </Button>
        </header>
        <div className="us-modal__body">{children}</div>
        {actions ? <footer className="us-modal__actions">{actions}</footer> : null}
      </section>
    </div>
  );
}

export default Modal;
