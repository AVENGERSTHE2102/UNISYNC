import { useState } from 'react';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../components/common/Card.jsx';
import Avatar from '../components/common/Avatar.jsx';
import { missionVision, teamMembers } from '../data/aboutData';
import './About.css';

function About() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  function handleSubmit(event) {
    event.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  }

  return (
    <div className="about-page">
      <div className="about-shell">
        <header className="about-hero">
          <span className="about-kicker">About UniSync</span>
          <h1 className="about-hero__title">Built for students, by students.</h1>
          <p className="about-hero__subtitle">
            UniSync brings mentorship, communities, events, and career opportunities together so
            you can focus on growing — not juggling disconnected tools.
          </p>
        </header>

        <section className="about-section" aria-labelledby="about-mission-heading">
          <h2 id="about-mission-heading" className="about-section__title">
            Mission &amp; Vision
          </h2>
          <div className="about-mv-grid">
            {missionVision.map((item) => (
              <article key={item.id} className="about-glass-card about-mv-card">
                <h3 className="about-mv-card__title">{item.title}</h3>
                <p className="about-mv-card__text">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" aria-labelledby="about-team-heading">
          <h2 id="about-team-heading" className="about-section__title">
            Our Team
          </h2>
          <div className="about-team-grid">
            {teamMembers.map((member) => (
              <article key={member.name} className="about-glass-card about-team-card">
                <Avatar
                  name={member.name}
                  src={member.image}
                  alt={member.name}
                  className="about-team-card__avatar"
                  style={{
                    width: '88px',
                    height: '88px',
                    fontSize: '1.75rem',
                    borderRadius: 'var(--radius-full)'
                  }}
                />
                <h3 className="about-team-card__name">{member.name}</h3>
                {member.role && <p className="about-team-card__role">{member.role}</p>}
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" aria-labelledby="about-contact-heading">
          <h2 id="about-contact-heading" className="about-section__title">
            Contact Us
          </h2>
          <div className="about-contact">
            <Card className="about-glass-card about-contact-card">
              <CardHeader>
                <CardTitle>Get in touch</CardTitle>
                <CardDescription>
                  Have a question or feedback? We&apos;d love to hear from you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="about-contact-form">
                  <Input
                    label="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="Your Name"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    placeholder="your@email.com"
                  />
                  <div className="form-group">
                    <label className="form-label" htmlFor="about-message">
                      Message
                    </label>
                    <textarea
                      id="about-message"
                      className="form-input about-textarea"
                      rows="5"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      placeholder="How can we help?"
                    />
                  </div>
                  <Button
                    disabled={status === 'sending'}
                    type="submit"
                    variant="primary"
                    className="about-submit"
                  >
                    {status === 'sending'
                      ? 'Sending...'
                      : status === 'sent'
                        ? 'Message Sent!'
                        : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
