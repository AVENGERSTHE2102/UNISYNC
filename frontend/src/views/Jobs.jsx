import { useEffect, useState } from 'react';
import Avatar from '../components/common/Avatar.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Card, { CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/common/Card.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import FilterChips from '../components/app/FilterChips.jsx';
import ProfileMiniCard from '../components/app/ProfileMiniCard.jsx';
import SidePanel from '../components/app/SidePanel.jsx';
import { applications, companies, jobFilters, jobs } from '../data/jobsData';
import { getJobs } from '../services/dbService';

function mapApiJobs(apiJobs) {
  return apiJobs.map((job, index) => ({
    id: `api-job-${job.id ?? index}`,
    title: job.title,
    company: job.company,
    category: job.jobType || 'Internship',
    tags: [job.jobType || 'Role', job.company].filter(Boolean),
    location: job.location || 'Remote',
    pay: 'Open',
    tone: ['blue', 'pink', 'green', 'purple', 'orange', 'teal'][index % 6]
  }));
}

function Jobs() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [jobList, setJobList] = useState(jobs);
  const [saved, setSaved] = useState([]);
  const [applied, setApplied] = useState([]);
  const [openedCompanies, setOpenedCompanies] = useState([]);

  useEffect(() => {
    let ignore = false;

    getJobs()
      .then((apiJobs) => {
        if (!ignore && apiJobs.length > 0) {
          setJobList(mapApiJobs(apiJobs));
        }
      })
      .catch(() => {
        if (!ignore) setJobList(jobs);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredJobs =
    activeFilter === 'All'
      ? jobList
      : jobList.filter((job) =>
          activeFilter === 'Stipend ₹10k+'
            ? Number(job.pay.replace(/\D/g, '')) >= 10
            : job.category === activeFilter || job.location.includes(activeFilter)
        );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem', alignItems: 'start' }}>
      <main style={{ display: 'grid', gap: '2rem', minWidth: 0 }}>
        <PageHeader
          title="Find Your Dream Job"
          subtitle="Explore internships, part-time roles and full-time opportunities curated for campus students across top companies."
          action={<Button variant="primary">Upload Resume</Button>}
        />
        <FilterChips filters={jobFilters} active={activeFilter} onChange={setActiveFilter} />

        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Featured Jobs for You</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {filteredJobs.map((job) => {
              const isSaved = saved.includes(job.id);
              const isApplied = applied.includes(job.id);
              return (
                <Card key={job.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', paddingBottom: '0.5rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem' }}>
                      {job.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <CardTitle style={{ fontSize: '1rem' }}>{job.title}</CardTitle>
                      <CardDescription>{job.company}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent style={{ paddingTop: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {job.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="neutral">{tag}</Badge>
                      ))}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{job.location} · {job.pay}</p>
                  </CardContent>
                  <CardFooter style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      variant={isSaved ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() =>
                        setSaved((current) =>
                          current.includes(job.id)
                            ? current.filter((id) => id !== job.id)
                            : [...current, job.id]
                        )
                      }
                    >
                      {isSaved ? 'Saved' : 'Save'}
                    </Button>
                    <Button
                      disabled={isApplied}
                      size="sm"
                      variant={isApplied ? 'secondary' : 'primary'}
                      onClick={() => setApplied((current) => [...current, job.id])}
                    >
                      {isApplied ? 'Applied' : 'Apply Now'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>My Applications</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {applications.map((app) => (
              <Card key={app.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', paddingBottom: '1rem' }}>
                  <Avatar name={app.title} tone={app.tone} />
                  <div style={{ flex: 1 }}>
                    <CardTitle style={{ fontSize: '1rem' }}>{app.title}</CardTitle>
                    <CardDescription>{app.company}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{app.applied}</span>
                  <Badge variant="success">{app.status}</Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <SidePanel title="Your Stats">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
            <div style={{ padding: '0.75rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}><strong style={{ display: 'block', color: 'var(--color-primary-strong)', fontSize: '1.25rem' }}>{applications.length + applied.length}</strong><span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Applied</span></div>
            <div style={{ padding: '0.75rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}><strong style={{ display: 'block', color: 'var(--color-primary-strong)', fontSize: '1.25rem' }}>1</strong><span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Shortlisted</span></div>
            <div style={{ padding: '0.75rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}><strong style={{ display: 'block', color: 'var(--color-primary-strong)', fontSize: '1.25rem' }}>{saved.length}</strong><span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Saved</span></div>
          </div>
        </SidePanel>
        <SidePanel title="Quick Actions">
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>Upload Resume</Button>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>Saved Jobs</Button>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>Track Applications</Button>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>Set Job Alerts</Button>
          </div>
        </SidePanel>
        <SidePanel title="Trending Companies">
          <div style={{ display: 'grid', gap: '1rem' }}>
            {companies.map((company) => {
              const opened = openedCompanies.includes(company.id);
              return (
                <div key={company.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Avatar name={company.name} tone={company.tone} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--color-text-heading)' }}>{company.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{company.open}</span>
                  </div>
                  <Button
                    size="sm"
                    variant={opened ? 'primary' : 'secondary'}
                    onClick={() => setOpenedCompanies((current) => [...new Set([...current, company.id])])}
                  >
                    {opened ? 'Opened' : 'View'}
                  </Button>
                </div>
              );
            })}
          </div>
        </SidePanel>
      </aside>
    </div>
  );
}

export default Jobs;
