function AuthNotice({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="auth-popup" role="alertdialog" aria-live="assertive">
      <div className="auth-popup__content">
        <button
          className="auth-popup__close"
          type="button"
          aria-label="Close message"
          onClick={onClose}
        >
          x
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default AuthNotice;
