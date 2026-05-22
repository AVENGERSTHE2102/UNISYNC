import { useEffect, useState } from 'react';
import Link from 'next/link';
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
import { getCommunities, joinCommunity, getMemberships } from '../services/dbService';
import { apiRequest } from '../services/api';
import { useRouter } from 'next/navigation';

function mapApiCommunities(communities) {
  return communities.map((community, index) => ({
    id: `api-community-${community.id ?? index}`,
    chatRoomId: community.chatRoomId,
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
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  const [clubs, setClubs] = useState(communityClubs);
  const [joined, setJoined] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [suggestedPeople, setSuggestedPeople] = useState(communityPeople);
  const [joiningId, setJoiningId] = useState(null);

  useEffect(() => {
    let ignore = false;

    getCommunities()
      .then((communities) => {
        if (!ignore) {
          setClubs(mapApiCommunities(communities));
        }
      })
      .catch(() => {
        if (!ignore) setClubs([]);
      });

    getMemberships()
      .then((memberships) => {
        if (!ignore) {
          setJoined(memberships.map((m) => m.communityId));
        }
      })
      .catch(() => {});

    apiRequest('/api/auth/users', { auth: true })
      .then((res) => {
        if (!ignore && res.data && res.data.length > 0) {
          const currentUserId = Number(localStorage.getItem('userId'));
          const realPeople = res.data
            .filter((u) => u.id !== currentUserId)
            .map((u, i) => ({
              id: u.id,
              name: u.name,
              role: u.professionalRole || u.branch || u.role,
              mutual: `${u.mutualConnectionsCount || 0} mutual connections`,
              tone: ['blue', 'pink', 'purple', 'green', 'orange', 'teal'][i % 6]
            }))
            .slice(0, 5);
            
          if (realPeople.length > 0) {
            setSuggestedPeople(realPeople);
          }
        }
      })
      .catch(() => {});

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

  async function handleJoinClub(club) {
    // If it's a dummy club, just update local state
    if (typeof club.id === 'string' && !club.id.startsWith('api-')) {
      setJoined((current) => [...current, club.id]);
      return;
    }
    
    setJoiningId(club.id);
    try {
      const realId = Number(club.id.replace('api-community-', ''));
      const joinData = await joinCommunity(realId);
      setJoined((current) => [...current, realId]);
      
      // Update the club with the new chatRoomId if it was backfilled
      if (joinData && joinData.chatRoomId) {
        setClubs(current => current.map(c => c.id === club.id ? { ...c, chatRoomId: joinData.chatRoomId } : c));
      }
    } catch (err) {
      console.error('Failed to join community:', err);
    } finally {
      setJoiningId(null);
    }
  }

  function handleGoToChat(club) {
    if (club.chatRoomId) {
      router.push(`/chat?room=${club.chatRoomId}`);
    } else {
      router.push(`/chat`);
    }
  }

  return (
    <div className="community-page-layout">
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
              const realId = typeof club.id === 'string' ? Number(club.id.replace('api-community-', '')) : club.id;
              const isJoined = joined.includes(realId) || joined.includes(club.id);
              return (
                <Card key={club.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <Link href={`/community/${realId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <CardHeader style={{ cursor: 'pointer' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        {typeof club.icon === 'string' ? <span style={{ fontSize: '1.25rem' }}>{club.icon}</span> : club.icon}
                      </div>
                      <CardTitle>{club.name}</CardTitle>
                      <CardDescription>{club.tagline}</CardDescription>
                    </CardHeader>
                  </Link>
                  <CardContent style={{ paddingTop: 0, flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{club.desc}</p>
                  </CardContent>
                  <CardFooter style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Badge variant="info">{club.count} members</Badge>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {isJoined && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleGoToChat(club)}
                        >
                          Go to Chat
                        </Button>
                      )}
                      <Button
                        disabled={isJoined || joiningId === club.id}
                        size="sm"
                        variant={isJoined ? 'secondary' : 'primary'}
                        onClick={() => handleJoinClub(club)}
                      >
                        {joiningId === club.id ? 'Joining...' : isJoined ? 'Joined' : 'Join Club'}
                      </Button>
                    </div>
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
            <Button as={Link} href="/community/create-post" variant="ghost" style={{ justifyContent: 'flex-start' }}>Create Post</Button>
            <Button as={Link} href="/community" variant="ghost" style={{ justifyContent: 'flex-start' }}>Find Clubs</Button>
            <Button as={Link} href="/events" variant="ghost" style={{ justifyContent: 'flex-start' }}>Upcoming Events</Button>
            <Button as={Link} href="/network" variant="ghost" style={{ justifyContent: 'flex-start' }}>Find People</Button>
          </div>
        </SidePanel>
        <SidePanel title="People You May Know">
          <PersonList people={suggestedPeople} />
        </SidePanel>
      </aside>
    </div>
  );
}

export default Community;
