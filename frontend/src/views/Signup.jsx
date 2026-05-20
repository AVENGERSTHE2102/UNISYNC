import SignupForm from '../components/auth/SignupForm.jsx';
import './Auth.css';

function Signup() {
  return (
    <div className="auth-page">
      <section className="auth-shell auth-shell--signup">
        <aside className="auth-visual" aria-label="UniSync benefits">
          <span className="auth-kicker">Join UniSync</span>
          <h1>Build your student profile once.</h1>
          <p>
            Meet the people, groups, and opportunities that make college easier to navigate.
          </p>
          <div className="auth-benefits">
            <span>One platform for student growth</span>
            <span>Explore events, mentors, and jobs</span>
            <span>Share interests with the right peers</span>
          </div>
        </aside>
        <SignupForm />
      </section>
    </div>
  );
}

export default Signup;
