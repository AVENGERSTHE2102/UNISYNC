import { NavLink } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Calendar,
  GraduationCap,
  MessageSquare,
  Search,
  Sparkles,
  Users
} from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../components/common/Card.jsx';
import HeroImageSlider from '../components/landing/HeroImageSlider.jsx';
import './Home.css';
const features = [
  {
    icon: BookOpen,
    title: 'Resource Sharing',
    description: 'Access notes, study material, and useful resources from classmates and seniors.'
  },
  {
    icon: Calendar,
    title: 'Event Management',
    description: 'Discover workshops, hackathons, club meets, and campus activities in one place.'
  },
  {
    icon: GraduationCap,
    title: 'Peer Mentorship',
    description: 'Connect with seniors and alumni for academic, project, and career guidance.'
  },
  {
    icon: Users,
    title: 'Peer Matching',
    description: 'Find project partners, study groups, and people with shared interests.'
  },
  {
    icon: Briefcase,
    title: 'Job Opportunities',
    description: 'Track internships, campus roles, and early-career opportunities curated for students.'
  },
  {
    icon: MessageSquare,
    title: 'Expert Connect',
    description: 'Message mentors, alumni, and peers to get practical advice when you need it.'
  }
];

const steps = [
  {
    title: 'Sign up with your student profile',
    description: 'Create a clean profile that helps clubs, mentors, and peers understand your goals.'
  },
  {
    title: 'Explore events, mentors, jobs, and communities',
    description: 'Use one dashboard to find the opportunities and people that fit your college journey.'
  },
  {
    title: 'Connect, collaborate, and grow',
    description: 'Join groups, apply to roles, start conversations, and build momentum through campus.'
  }
];

const testimonials = [
  {
    quote: 'UniSync helped me find a study group and a senior mentor in the same week. It made campus feel easier to navigate.',
    author: 'Sarah J.',
    role: 'Computer Science Student'
  },
  {
    quote: 'As an alumnus, I can share opportunities and mentor students without juggling multiple scattered channels.',
    author: 'David L.',
    role: 'Software Engineer'
  },
  {
    quote: 'The event hub keeps me updated, and the communities make it simple to meet people working on similar ideas.',
    author: 'Emily R.',
    role: 'Electrical Engineering Student'
  }
];

function Home() {
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero__inner">
          <div className="landing-hero__content">
            <span className="landing-eyebrow">
              <Sparkles size={16} />
              Built for modern campus life
            </span>
            <h1>
              <span>The Ultimate Campus</span>
              <span>Experience, Reimagined.</span>
            </h1>
            <p>
              UniSync helps students discover events, mentors, communities, resources, and career
              opportunities without switching between scattered groups and notice boards.
            </p>
            <div className="landing-hero__actions">
              <Button as={NavLink} to="/signup" size="lg">
                Get Started Now
                <ArrowRight size={18} />
              </Button>
              <Button as={NavLink} to="/about" size="lg" variant="secondary">
                Learn More
              </Button>
            </div>
          </div>

          <div className="landing-showcase" aria-label="UniSync dashboard preview">
            <HeroImageSlider />
            
            <div className="landing-showcase__panel landing-showcase__panel--bottom">
              <Search size={18} />
              <span>Find mentors, jobs, events...</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section__header">
          <span className="landing-kicker">Features</span>
          <h2>Everything students need to stay connected</h2>
          <p>Simple, practical tools for daily campus workflows.</p>
        </div>
        <div className="landing-feature-grid">
          {features.map((feature) => (
            <Card className="landing-feature-card" hover key={feature.title}>
              <CardHeader>
                <div className="landing-icon-block">
                  <feature.icon size={22} />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="landing-section landing-how">
        <div className="landing-section__header">
          <span className="landing-kicker">How it works</span>
          <h2>Start small, grow your campus circle</h2>
        </div>
        <div className="landing-steps">
          {steps.map((step, index) => (
            <article className="landing-step" key={step.title}>
              <span>{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section__header">
          <span className="landing-kicker">Student stories</span>
          <h2>Made for real college routines</h2>
        </div>
        <div className="landing-testimonial-grid">
          {testimonials.map((testimonial) => (
            <Card className="landing-testimonial-card" key={testimonial.author}>
              <CardContent>
                <p>{testimonial.quote}</p>
                <div>
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <div>
          <span className="landing-kicker">Ready when you are</span>
          <h2>Enhance your campus life with UniSync.</h2>
          <p>Join your peers, discover useful opportunities, and build a stronger student network.</p>
        </div>
        <Button as={NavLink} to="/signup" size="lg">
          Join UniSync Today
        </Button>
      </section>

      <footer className="landing-footer">
        <div>
          <strong>UniSync</strong>
          <p>A student platform for events, mentorship, communities, resources, and career growth.</p>
        </div>
        <nav aria-label="Footer navigation">
          <NavLink to="/about">About</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/signup">Sign Up</NavLink>
        </nav>
        <span>&copy; {new Date().getFullYear()} UniSync. All rights reserved.</span>
      </footer>
    </div>
  );
}

export default Home;
