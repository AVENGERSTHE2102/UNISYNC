import { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Users } from 'lucide-react';
import Avatar from '../components/common/Avatar.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Card, { CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/common/Card.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import FilterChips from '../components/app/FilterChips.jsx';
import ProfileMiniCard from '../components/app/ProfileMiniCard.jsx';
import SidePanel from '../components/app/SidePanel.jsx';
import PersonList from '../components/app/PersonList.jsx';
import {
  communityClubs,
  communityFilters,
  communityPeople,
  communityPosts
} from '../data/communityData';
import { getCommunities } from '../services/dbService';

function mapApiCommunities(communities) {
  return communities.map((community, index) => ({
    id: `api-community-${community.id ?? index}`,
    category: community.category || 'Tech',
    icon: <Users size={20} />,
    name: community.name,
    tagline: community.category || 'Campus community',
    desc: community.description,
    count: '+0',
    tone: ['blue', 'pink', 'purple', 'green', 'orange', 'teal'][index % 6]
  }));
}

function Community() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [clubs, setClubs] = useState(communityClubs);
  const [joined, setJoined] = useState(
    communityClubs.filter((club) => club.joined).map((club) => club.id)
  );
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    let ignore = false;

    getCommunities()
      .then((communities) => {
        if (!ignore && communities.length > 0) {
          setClubs(mapApiCommunities(communities));
        }
      })
      .catch(() => {
        if (!ignore) setClubs(communityClubs);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredClubs =
    activeFilter === 'All'
      ? clubs
      : clubs.filter((club) => club.category === activeFilter);

  function toggleLike(postId) {
    setLikedPosts((current) =>
      current.includes(postId)
        ? current.filter((id) => id !== postId)
        : [...current, postId]
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem', alignItems: 'start' }}>
      <main style={{ display: 'grid', gap: '2rem', minWidth: 0 }}>
        <PageHeader
          title="Welcome to the Community"
          subtitle="Connect with peers, join clubs, share ideas and grow together with your campus community."
          action={<Button variant="primary">Create a Post</Button>}
        />
        
        <FilterChips filters={communityFilters} active={activeFilter} onChange={setActiveFilter} />

        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Suggested Clubs for You</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {filteredClubs.map((club) => {
              const isJoined = joined.includes(club.id);
              return (
                <Card key={club.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <CardHeader>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                      {typeof club.icon === 'string' ? <span style={{ fontSize: '1.25rem' }}>{club.icon}</span> : club.icon}
                    </div>
                    <CardTitle>{club.name}</CardTitle>
                    <CardDescription>{club.tagline}</CardDescription>
                  </CardHeader>
                  <CardContent style={{ paddingTop: 0, flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{club.desc}</p>
                  </CardContent>
                  <CardFooter style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Badge variant="info">{club.count} members</Badge>
                    <Button
                      disabled={isJoined}
                      size="sm"
                      variant={isJoined ? 'secondary' : 'primary'}
                      onClick={() => setJoined((current) => [...current, club.id])}
                    >
                      {isJoined ? 'Joined' : 'Join Club'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Community Feed</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {communityPosts.map((post) => {
              const isLiked = likedPosts.includes(post.id);
              const likes = post.likes + (isLiked ? 1 : 0);
              return (
                <Card key={post.id}>
                  <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                    <Avatar name={post.author} tone={post.tone} />
                    <div style={{ flex: 1 }}>
                      <CardTitle style={{ fontSize: '1rem' }}>{post.author}</CardTitle>
                      <CardDescription>{post.meta}</CardDescription>
                    </div>
                    <Badge variant="neutral">{post.tag}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text)', lineHeight: 1.6 }}>{post.content}</p>
                  </CardContent>
                  <CardFooter style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                    <button
                      onClick={() => toggleLike(post.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: isLiked ? 'var(--color-danger)' : 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} /> {likes}
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                      <MessageCircle size={16} /> {post.comments}
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                      <Share2 size={16} /> Share
                    </button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <SidePanel title="Your Stats">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
            <div style={{ padding: '0.75rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}><strong style={{ display: 'block', color: 'var(--color-primary-strong)', fontSize: '1.25rem' }}>{joined.length}</strong><span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Clubs</span></div>
            <div style={{ padding: '0.75rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}><strong style={{ display: 'block', color: 'var(--color-primary-strong)', fontSize: '1.25rem' }}>5</strong><span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Posts</span></div>
            <div style={{ padding: '0.75rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}><strong style={{ display: 'block', color: 'var(--color-primary-strong)', fontSize: '1.25rem' }}>38</strong><span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Connections</span></div>
          </div>
        </SidePanel>
        <SidePanel title="Quick Actions">
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>Create Post</Button>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>Find Clubs</Button>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>Upcoming Events</Button>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>Find People</Button>
          </div>
        </SidePanel>
        <SidePanel title="People You May Know">
          <PersonList people={communityPeople} />
        </SidePanel>
      </aside>
    </div>
  );
}

export default Community;
