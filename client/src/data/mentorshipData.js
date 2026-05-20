export const mentorshipFilters = ['All', 'Web Dev', 'App Dev', 'AI / ML', 'Data Science', 'Cybersecurity', 'Entrepreneurship'];

export const mentors = [
  { id: 'john', initials: 'JD', name: 'John Doe', role: 'SWE @ Google', category: 'Web Dev', skills: ['JavaScript', 'React', 'Node.js'], tagline: 'Full-stack dev. Guides on web apps & system design interviews.', count: '+18', tone: 'blue', online: true },
  { id: 'jane', initials: 'JS', name: 'Jane Smith', role: 'iOS Dev @ Apple', category: 'App Dev', skills: ['Swift', 'SwiftUI', 'iOS'], tagline: 'Builds beautiful mobile apps. Guides UI/UX & product thinking.', count: '+22', tone: 'pink', online: true },
  { id: 'sam', initials: 'SW', name: 'Sam Wilson', role: 'ML Eng @ Netflix', category: 'AI / ML', skills: ['Python', 'TensorFlow', 'ML'], tagline: 'Recommendation systems expert. Guides real-world ML pipelines.', count: '+30', tone: 'green', online: true },
  { id: 'emily', initials: 'EB', name: 'Emily Brown', role: 'Data Sci @ Spotify', category: 'Data Science', skills: ['SQL', 'Python', 'Analytics'], tagline: 'Uses data to improve products. Storytelling through analytics.', count: '+14', tone: 'purple' },
  { id: 'rohan', initials: 'RK', name: 'Rohan Kapoor', role: 'SDE-2 @ Microsoft', category: 'Web Dev', skills: ['DSA', 'Azure', 'DevOps'], tagline: 'Cloud-native & DevOps. Guides DSA interview prep & Azure certs.', count: '+26', tone: 'blue', online: true },
  { id: 'priya', initials: 'PG', name: 'Priya Gupta', role: 'Security @ Deloitte', category: 'Cybersecurity', skills: ['Cybersec', 'Networking', 'CEH'], tagline: 'Ethical hacking & pen testing. Helps crack CEH & CompTIA certs.', count: '+11', tone: 'pink' }
];

export const sessions = [
  { id: 's1', icon: '📹', title: '1:1 with John Doe', sub: 'Today, 4:00 PM · React & System Design', type: 'Video Call', status: 'Upcoming' },
  { id: 's2', icon: '💬', title: 'Group Q&A – Sam Wilson', sub: 'Tomorrow, 11:00 AM · ML Interview Prep', type: 'Group Session', status: 'Upcoming' },
  { id: 's3', icon: '✅', title: 'Resume Review – Emily', sub: 'May 15, 2025 · Data Science Career', type: '1:1 Review', status: 'Completed' }
];
