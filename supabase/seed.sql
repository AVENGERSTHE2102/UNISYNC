begin;

truncate table
  public."Replies",
  public."Threads",
  public."Memberships",
  public."Events",
  public."Jobs",
  public."Communities",
  public."Users"
restart identity cascade;

insert into public."Users" (
  name,
  email,
  "passwordHash",
  role,
  "yearOfStudy",
  branch,
  company,
  "professionalRole",
  interests
)
values
  (
    'UniSync Admin',
    'admin@unisync.dev',
    '$2b$10$w7Qx0r1A5d1ZJ0vJ3fGm2.4YQm6r6Y1rB8A3L8Vx4x8xH7YQmNw4K',
    'admin',
    null,
    null,
    'UniSync',
    'Platform Admin',
    '["operations","community"]'::jsonb
  ),
  (
    'Aarav Sharma',
    'student@unisync.dev',
    '$2b$10$w7Qx0r1A5d1ZJ0vJ3fGm2.4YQm6r6Y1rB8A3L8Vx4x8xH7YQmNw4K',
    'student',
    3,
    'Computer Science',
    null,
    null,
    '["ai-ml","webdev","hackathons"]'::jsonb
  ),
  (
    'Riya Mehta',
    'alumni@unisync.dev',
    '$2b$10$w7Qx0r1A5d1ZJ0vJ3fGm2.4YQm6r6Y1rB8A3L8Vx4x8xH7YQmNw4K',
    'alumni',
    null,
    null,
    'Futura Labs',
    'Software Engineer',
    '["mentoring","backend","careers"]'::jsonb
  );

insert into public."Communities" (
  name,
  description,
  category,
  "createdBy"
)
values
  (
    'AI Builders Circle',
    'A student community for machine learning projects, paper reading, and hackathon teams.',
    'Technology',
    1
  ),
  (
    'Career Launchpad',
    'Peer support and alumni guidance for resumes, internships, and interview prep.',
    'Career',
    1
  );

insert into public."Memberships" (
  "communityId",
  "userId"
)
values
  (1, 1),
  (1, 2),
  (2, 1),
  (2, 2),
  (2, 3);

insert into public."Threads" (
  "communityId",
  title,
  body,
  "authorId"
)
values
  (
    1,
    'Hackathon Team Formation',
    'Looking for two teammates interested in building an AI-powered campus assistant for the upcoming weekend hackathon.',
    2
  ),
  (
    2,
    'Resume Review Exchange',
    'Starting a weekly thread where students can swap resumes and get practical feedback before internship season.',
    3
  );

insert into public."Replies" (
  "threadId",
  body,
  "authorId"
)
values
  (
    1,
    'I am interested in the backend and model integration side. Count me in.',
    3
  ),
  (
    2,
    'I can share a template that worked for my last internship application cycle.',
    1
  );

insert into public."Events" (
  title,
  description,
  date,
  location,
  type,
  "organizerId"
)
values
  (
    'Campus AI Sprint',
    'A one-day build sprint for student teams working on practical AI tools for campus life.',
    now() + interval '10 days',
    'Innovation Lab',
    'Hackathon',
    1
  ),
  (
    'Alumni AMA Night',
    'An evening session where recent graduates answer questions about placements, interviews, and early career growth.',
    now() + interval '18 days',
    'Seminar Hall B',
    'Networking',
    1
  );

insert into public."Jobs" (
  title,
  company,
  description,
  location,
  type,
  deadline,
  "contactEmail",
  "createdBy"
)
values
  (
    'Frontend Intern',
    'Futura Labs',
    'Work with the product team on responsive UI features and internal tooling for student-facing products.',
    'Remote',
    'Internship',
    now() + interval '21 days',
    'hiring@futuralabs.dev',
    1
  ),
  (
    'Backend Developer',
    'UniSync Labs',
    'Build APIs, data workflows, and internal platform tooling for the next phase of the UniSync product.',
    'Hybrid',
    'Full-time',
    now() + interval '30 days',
    'jobs@unisync.dev',
    1
  );

commit;
