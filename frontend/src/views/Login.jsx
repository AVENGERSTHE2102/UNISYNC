import LoginForm from '../components/auth/LoginForm.jsx';
import './Auth.css';

function Login() {
  return (
    <div className="auth-page">
      <section className="auth-shell auth-shell--login">
        <aside className="auth-visual" aria-label="UniSync benefits">
          <span className="auth-kicker">Welcome back</span>
          <h1>Your campus network awaits.</h1>
          <p>Continue discovering mentors, events, communities and opportunities — all in one place.</p>
          <div className="auth-benefits">
            <span>Connect with campus communities</span>
            <span>Discover mentors, events, and jobs</span>
            <span>Find internships and opportunities</span>
          </div>
        </aside>
        <LoginForm />
      </section>
    </div>
  );
}

export default Login;
