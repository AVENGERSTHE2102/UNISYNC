export const conversations = [
  { id: 'john', initials: 'JD', name: 'John Doe', preview: "Sure! Let's review your resume tomorrow", time: '2m', tone: 'blue', online: true },
  { id: 'riya', initials: 'RS', name: 'Riya Sharma', preview: 'Can you share the DSA notes?', time: '14m', unread: 2, tone: 'pink' },
  { id: 'group', initials: 'GS', name: 'Group Study', preview: 'Kabir: Meeting at 5 PM today', time: '1h', unread: 5, tone: 'green', online: true },
  { id: 'sam', initials: 'SW', name: 'Sam Wilson', preview: 'Session confirmed for tomorrow', time: '3h', tone: 'purple' },
  { id: 'tech', initials: 'TC', name: 'Tech Club', preview: 'New hackathon announced!', time: '2d', unread: 9, tone: 'blue' }
];

export const initialMessages = [
  { id: 'm1', from: 'them', initials: 'JD', text: "Hey Arjun! How's your interview prep going?", time: '10:02 AM' },
  { id: 'm2', from: 'me', initials: 'AM', text: 'Going well! Finished two mock interviews this week. DSA is getting better.', time: '10:05 AM' },
  { id: 'm3', from: 'them', initials: 'JD', text: "That's great! Which topics are you focusing on?", time: '10:06 AM' },
  { id: 'm4', from: 'me', initials: 'AM', text: 'Graphs, DP and system design mostly. Also doing LeetCode daily.', time: '10:08 AM' },
  { id: 'm5', from: 'them', initials: 'JD', text: "Perfect approach! I can share some resources on system design if you'd like.", time: '10:10 AM' },
  { id: 'm6', from: 'me', initials: 'AM', text: 'That would be amazing, yes please!', time: '10:11 AM' },
  { id: 'm7', from: 'them', initials: 'JD', text: "Sure! Let's review your resume tomorrow.", time: '10:13 AM' }
];

export const sharedFiles = ['SystemDesign.pdf', 'DSA_Roadmap.xlsx', 'Resume_template.png'];
