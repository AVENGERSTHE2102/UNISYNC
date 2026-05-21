import { useEffect, useState } from 'react';
import Avatar from '../components/common/Avatar.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Card, { CardContent, CardHeader, CardTitle } from '../components/common/Card.jsx';
import Input from '../components/common/Input.jsx';
import Modal from '../components/common/Modal.jsx';
import { profile, profilePosts, profileSections } from '../data/profileData';
import { getCurrentUser } from '../services/authService';

const editableSectionTitles = ['Experience', 'Education', 'Certifications'];

function cloneSections(sections) {
  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({ ...item }))
  }));
}

function sectionToText(section) {
  return section.items
    .map((item) => [item.title, item.subtitle, item.date, item.desc, item.logo].join(' | '))
    .join('\n');
}

function textToSectionItems(text, fallbackLogo) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [title = '', subtitle = '', date = '', desc = '', logo = fallbackLogo] = line
        .split('|')
        .map((part) => part.trim());

      return {
        title: title || `Item ${index + 1}`,
        subtitle,
        date,
        desc,
        logo: logo || fallbackLogo
      };
    });
}

function makeProfileDraft(currentProfile, currentSections) {
  return {
    headline: currentProfile.headline,
    location: currentProfile.location,
    about: currentProfile.about,
    skills: currentProfile.skills.join(', '),
    sections: Object.fromEntries(
      currentSections
        .filter((section) => editableSectionTitles.includes(section.title))
        .map((section) => [section.title, sectionToText(section)])
    )
  };
}

const defaultProfile = {
  name: '',
  headline: '',
  location: '',
  email: '',
  about: '',
  skills: []
};

const defaultSections = [
  { title: 'Experience', items: [] },
  { title: 'Education', items: [] },
  { title: 'Certifications', items: [] }
];

function Profile() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [profileDetails, setProfileDetails] = useState(defaultProfile);
  const [sections, setSections] = useState(defaultSections);
  const [posts, setPosts] = useState(profilePosts);
  const [profileDraft, setProfileDraft] = useState(() => makeProfileDraft(defaultProfile, defaultSections));
  const [editingProfile, setEditingProfile] = useState(false);
  const [postModalMode, setPostModalMode] = useState(null);
  const [postDraft, setPostDraft] = useState({ id: null, text: '' });

  // Load from localStorage and merge real user data from the backend on mount
  useEffect(() => {
    let ignore = false;
    
    const userId = localStorage.getItem('userId');
    if (userId) {
      setCurrentUserId(userId);
      const storedProfileStr = localStorage.getItem(`unisync_profile_${userId}`);
      if (storedProfileStr) {
        try {
          const storedProfile = JSON.parse(storedProfileStr);
          setProfileDetails((current) => ({
            ...current,
            headline: storedProfile.headline || '',
            location: storedProfile.location || '',
            about: storedProfile.about || '',
            skills: storedProfile.skills || [],
          }));
          if (storedProfile.sections) {
            setSections(storedProfile.sections);
          }
        } catch (e) {
          console.error("Failed to parse stored profile", e);
        }
      }
    }

    getCurrentUser()
      .then((user) => {
        if (!ignore && user) {
          setProfileDetails((current) => ({
            ...current,
            name: user.name ?? current.name,
            email: user.email ?? current.email,
            headline: current.headline || user.professionalRole || user.branch || '',
            skills: current.skills?.length > 0 ? current.skills : (user.interests || []),
          }));
        }
      })
      .catch(() => {
        // API unavailable
      });
    return () => { ignore = true; };
  }, []);

  function openProfileEditor() {
    setProfileDraft(makeProfileDraft(profileDetails, sections));
    setEditingProfile(true);
  }

  function updateProfileDraft(field, value) {
    setProfileDraft((current) => ({ ...current, [field]: value }));
  }

  function updateSectionDraft(title, value) {
    setProfileDraft((current) => ({
      ...current,
      sections: { ...current.sections, [title]: value }
    }));
  }

  function saveProfile(event) {
    event.preventDefault();

    const newSkills = profileDraft.skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);

    const newSections = sections.map((section) => {
      if (!editableSectionTitles.includes(section.title)) return section;
      const fallbackLogo = section.items[0]?.logo || section.title.slice(0, 2).toUpperCase();
      return {
        ...section,
        items: textToSectionItems(profileDraft.sections[section.title] || '', fallbackLogo)
      };
    });

    setProfileDetails((current) => ({
      ...current,
      headline: profileDraft.headline,
      location: profileDraft.location,
      about: profileDraft.about,
      skills: newSkills
    }));

    setSections(newSections);

    if (currentUserId) {
      const profileDataToSave = {
        headline: profileDraft.headline,
        location: profileDraft.location,
        about: profileDraft.about,
        skills: newSkills,
        sections: newSections
      };
      localStorage.setItem(`unisync_profile_${currentUserId}`, JSON.stringify(profileDataToSave));
    }

    setEditingProfile(false);
  }

  const tasks = [
    { id: 'headline', label: 'Add a professional headline or title', done: !!profileDetails.headline },
    { id: 'location', label: 'Add your location (city, country)', done: !!profileDetails.location },
    { id: 'about', label: 'Write a short bio in the "About Me" section', done: !!profileDetails.about },
    { id: 'skills', label: 'Add at least one skill or interest', done: profileDetails.skills && profileDetails.skills.length > 0 },
    { id: 'experience', label: 'Add your work or project experience', done: sections.find(s => s.title === 'Experience')?.items?.length > 0 },
    { id: 'education', label: 'Add your education history', done: sections.find(s => s.title === 'Education')?.items?.length > 0 },
    { id: 'certifications', label: 'Add certifications or achievements', done: sections.find(s => s.title === 'Certifications')?.items?.length > 0 }
  ];

  const completedTasks = tasks.filter(t => t.done).length;
  const totalTasks = tasks.length;
  const percentComplete = Math.round((completedTasks / totalTasks) * 100);

  function openCreatePost() {
    setPostDraft({ id: null, text: '' });
    setPostModalMode('create');
  }

  function openEditPost(post) {
    setPostDraft({ id: post.id, text: post.text });
    setPostModalMode('edit');
  }

  function savePost(event) {
    event.preventDefault();
    const text = postDraft.text.trim();
    if (!text) return;

    if (postModalMode === 'create') {
      setPosts((current) => [
        { id: `post-${Date.now()}`, date: 'Just now', text },
        ...current
      ]);
    } else {
      setPosts((current) =>
        current.map((post) =>
          post.id === postDraft.id ? { ...post, text } : post
        )
      );
    }

    setPostModalMode(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Card style={{ overflow: 'hidden' }}>
        <div style={{ minHeight: '120px', background: 'var(--color-primary-soft)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-strong)' }}>
          {profileDetails.name}
        </div>
        <CardContent style={{ paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr) auto', gap: '1.5rem', alignItems: 'center' }}>
          <Avatar name={profileDetails.name} size="lg" tone="blue" style={{ width: '96px', height: '96px', fontSize: '2rem' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingTop: '0.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>{profileDetails.name}</h1>
            <p style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-dark)' }}>{profileDetails.headline}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              <span>📍 {profileDetails.location}</span>
              <span>✉️ {profileDetails.email}</span>
            </div>
          </div>
          <Button onClick={openProfileEditor}>Edit Profile</Button>
        </CardContent>
      </Card>

      {/* Profile Completion Tasks Card */}
      {percentComplete < 100 && (
        <Card style={{ background: 'var(--color-surface)', borderLeft: '4px solid var(--color-primary)' }}>
          <CardHeader>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <CardTitle>Profile Completion</CardTitle>
              <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{percentComplete}% Complete</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', marginTop: '0.75rem', overflow: 'hidden' }}>
              <div style={{ width: `${percentComplete}%`, height: '100%', background: 'var(--color-primary)', transition: 'width 0.4s ease' }} />
            </div>
          </CardHeader>
          <CardContent>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {tasks.map(task => (
                <li key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px',
                    borderRadius: '50%', background: task.done ? 'var(--color-primary)' : 'var(--color-surface-hover)',
                    color: task.done ? 'white' : 'var(--color-text-muted)', border: task.done ? 'none' : '1px solid var(--color-border)'
                  }}>
                    {task.done ? '✓' : ''}
                  </div>
                  <span style={{ flex: 1, color: task.done ? 'var(--color-text-muted)' : 'var(--color-text)', textDecoration: task.done ? 'line-through' : 'none' }}>
                    {task.label}
                  </span>
                  {!task.done && (
                    <Button size="sm" variant="ghost" onClick={openProfileEditor} style={{ padding: '0.25rem 0.5rem', height: 'auto', fontSize: '0.75rem' }}>
                      Add
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {profileDetails.about && (
        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <p style={{ margin: 0, color: 'var(--color-text)', lineHeight: 1.6 }}>{profileDetails.about}</p>
          </CardContent>
        </Card>
      )}

      {sections.map((section) => {
        if (section.items.length === 0) return null;
        return (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {section.items.map((item) => (
                <article key={`${section.title}-${item.title}`} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Avatar name={item.logo} tone="purple" />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>{item.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-dark)', fontWeight: 500 }}>{item.subtitle}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.date}</span>
                    {item.desc && <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: 'var(--color-text)' }}>{item.desc}</p>}
                  </div>
                </article>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {profileDetails.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {profileDetails.skills.map((skill) => (
              <Badge key={skill} variant="neutral">{skill}</Badge>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <CardTitle>Posts</CardTitle>
          <Button size="sm" onClick={openCreatePost}>Create Post</Button>
        </CardHeader>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {posts.map((post) => (
            <article key={post.id} style={{ padding: '1rem', background: 'var(--color-page-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                <Avatar name={profileDetails.name} tone="blue" size="sm" />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>{profileDetails.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{post.date}</span>
                </div>
                <Button size="sm" variant="secondary" onClick={() => openEditPost(post)}>
                  Edit
                </Button>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.5 }}>{post.text}</p>
            </article>
          ))}
        </CardContent>
      </Card>

      <Modal
        open={editingProfile}
        title="Edit Profile"
        onClose={() => setEditingProfile(false)}
        actions={(
          <>
            <Button variant="secondary" onClick={() => setEditingProfile(false)}>Cancel</Button>
            <Button type="submit" form="profile-edit-form">Save</Button>
          </>
        )}
      >
        <form id="profile-edit-form" onSubmit={saveProfile} style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
            <Input label="Name" value={profileDetails.name} disabled readOnly />
            <Input label="Email" value={profileDetails.email} disabled readOnly />
          </div>
          <Input
            label="Headline / Title"
            value={profileDraft.headline}
            onChange={(event) => updateProfileDraft('headline', event.target.value)}
          />
          <Input
            label="Location"
            value={profileDraft.location}
            onChange={(event) => updateProfileDraft('location', event.target.value)}
          />
          <label className="form-group">
            <span className="form-label">About Me</span>
            <textarea
              className="form-input"
              rows="4"
              value={profileDraft.about}
              onChange={(event) => updateProfileDraft('about', event.target.value)}
            />
          </label>
          {editableSectionTitles.map((title) => (
            <label className="form-group" key={title}>
              <span className="form-label">{title}</span>
              <textarea
                className="form-input"
                rows="3"
                value={profileDraft.sections[title] || ''}
                onChange={(event) => updateSectionDraft(title, event.target.value)}
              />
              <small style={{ color: 'var(--color-text-muted)' }}>
                One item per line: title | organization | date | description | initials
              </small>
            </label>
          ))}
          <Input
            label="Skills"
            value={profileDraft.skills}
            onChange={(event) => updateProfileDraft('skills', event.target.value)}
          />
        </form>
      </Modal>

      <Modal
        open={Boolean(postModalMode)}
        title={postModalMode === 'edit' ? 'Edit Post' : 'Create Post'}
        onClose={() => setPostModalMode(null)}
        actions={(
          <>
            <Button variant="secondary" onClick={() => setPostModalMode(null)}>Cancel</Button>
            <Button type="submit" form="post-edit-form">{postModalMode === 'edit' ? 'Save' : 'Post'}</Button>
          </>
        )}
      >
        <form id="post-edit-form" onSubmit={savePost} style={{ display: 'grid', gap: '1rem' }}>
          <label className="form-group">
            <span className="form-label">Post Content</span>
            <textarea
              className="form-input"
              rows="5"
              value={postDraft.text}
              onChange={(event) => setPostDraft((current) => ({ ...current, text: event.target.value }))}
              placeholder="Write something to share..."
            />
          </label>
        </form>
      </Modal>
    </div>
  );
}

export default Profile;
