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

function Profile() {
  const [profileDetails, setProfileDetails] = useState(profile);
  const [sections, setSections] = useState(() => cloneSections(profileSections));
  const [posts, setPosts] = useState(profilePosts);
  const [profileDraft, setProfileDraft] = useState(() => makeProfileDraft(profile, profileSections));
  const [editingProfile, setEditingProfile] = useState(false);
  const [postModalMode, setPostModalMode] = useState(null);
  const [postDraft, setPostDraft] = useState({ id: null, text: '' });

  // Merge real user data from the backend on mount
  useEffect(() => {
    let ignore = false;
    getCurrentUser()
      .then((user) => {
        if (!ignore && user) {
          setProfileDetails((current) => ({
            ...current,
            name: user.name ?? current.name,
            email: user.email ?? current.email,
            headline: user.professionalRole ?? user.branch ?? current.headline,
            skills: user.interests?.length > 0 ? user.interests : current.skills,
          }));
        }
      })
      .catch(() => {
        // API unavailable — keep static fallback data
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

    setProfileDetails((current) => ({
      ...current,
      headline: profileDraft.headline,
      location: profileDraft.location,
      about: profileDraft.about,
      skills: profileDraft.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean)
    }));

    setSections((currentSections) =>
      currentSections.map((section) => {
        if (!editableSectionTitles.includes(section.title)) return section;
        const fallbackLogo = section.items[0]?.logo || section.title.slice(0, 2).toUpperCase();
        return {
          ...section,
          items: textToSectionItems(profileDraft.sections[section.title] || '', fallbackLogo)
        };
      })
    );

    setEditingProfile(false);
  }

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

      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ margin: 0, color: 'var(--color-text)', lineHeight: 1.6 }}>{profileDetails.about}</p>
        </CardContent>
      </Card>

      {sections.map((section) => (
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
      ))}

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
