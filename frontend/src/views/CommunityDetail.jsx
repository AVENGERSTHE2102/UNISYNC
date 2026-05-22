'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, ArrowLeft, MessageSquare, Check } from 'lucide-react';
import Avatar from '../components/common/Avatar.jsx';
import Button from '../components/common/Button.jsx';
import Card, { CardContent } from '../components/common/Card.jsx';
import { getCommunityById, joinCommunity, getMemberships } from '../services/dbService';

export default function CommunityDetail({ communityId }) {
  const router = useRouter();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [joinedRoomId, setJoinedRoomId] = useState(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    let ignore = false;

    Promise.all([
      getCommunityById(communityId),
      getMemberships(),
    ]).then(([commData, memberships]) => {
      if (ignore) return;

      setCommunity(commData);

      const myMembership = memberships.find(m => m.communityId === Number(communityId));
      if (myMembership) {
        setIsJoined(true);
        setJoinedRoomId(commData?.chatRoomId);
      }
      setLoading(false);
    }).catch(err => {
      if (!ignore) {
        console.error(err);
        setLoading(false);
      }
    });

    return () => { ignore = true; };
  }, [communityId]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      const joinData = await joinCommunity(communityId);
      setIsJoined(true);
      const roomId = joinData?.chatRoomId || community?.chatRoomId;
      setJoinedRoomId(roomId);
      // Bump member count locally
      setCommunity(prev => prev ? { ...prev, memberCount: (prev.memberCount || 0) + 1 } : prev);
    } catch (err) {
      if (err.message?.includes('already a member')) {
        setIsJoined(true);
        setJoinedRoomId(community?.chatRoomId);
      } else {
        alert(err.message || 'Failed to join community');
      }
    } finally {
      setJoining(false);
    }
  };

  const handleGoToChat = () => {
    router.push(joinedRoomId ? `/chat?room=${joinedRoomId}` : '/chat');
  };

  if (loading) {
    return (
      <div className="us-dashboard-container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading community...</p>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="us-dashboard-container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Community Not Found</h2>
        <Button onClick={() => router.back()} style={{ marginTop: '1rem' }}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="us-dashboard-container" style={{ padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <Button variant="ghost" onClick={() => router.back()} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0 }}>
        <ArrowLeft size={18} /> Back
      </Button>

      <div style={{ position: 'relative', marginBottom: '3rem' }}>
        {/* Banner */}
        <div style={{
          height: '200px', borderRadius: '1rem',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'flex-end', padding: '2rem'
        }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            {community.name}
          </h1>
        </div>

        {/* Action buttons */}
        <div style={{ position: 'absolute', bottom: '-1.5rem', right: '1.5rem', display: 'flex', gap: '0.75rem' }}>
          {isJoined ? (
            <>
              <Button
                variant="ghost"
                disabled
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', background: 'var(--color-success-soft, #dcfce7)', border: '1px solid var(--color-success)', borderRadius: '0.75rem' }}
              >
                <Check size={16} /> Joined
              </Button>
              <Button
                variant="secondary"
                onClick={handleGoToChat}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              >
                <MessageSquare size={16} /> Go to Chat
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={handleJoin}
              disabled={joining}
              style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            >
              {joining ? 'Joining...' : 'Join Club'}
            </Button>
          )}
        </div>
      </div>

      <div style={{ padding: '0 0.5rem' }}>
        {/* Meta row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 600,
            background: 'var(--color-primary-soft)', padding: '0.35rem 0.85rem', borderRadius: '2rem'
          }}>
            {community.category || 'General'}
          </span>
          {community.memberCount !== undefined && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              <Users size={17} /> {community.memberCount} {community.memberCount === 1 ? 'Member' : 'Members'}
            </span>
          )}
        </div>

        {/* About */}
        <Card style={{ marginBottom: '2rem' }}>
          <CardContent style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>About this Community</h3>
            <p style={{ color: 'var(--color-text)', lineHeight: 1.75, fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
              {community.description || 'Welcome to our community! Join us to connect, share, and grow together.'}
            </p>
          </CardContent>
        </Card>

        {/* Join CTA if not joined */}
        {!isJoined && (
          <Card style={{ background: 'var(--color-primary-soft)', border: '1px solid var(--color-primary)', marginBottom: '2rem' }}>
            <CardContent style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-primary)', fontSize: '1rem' }}>Join to get access to the group chat</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Members can chat, share resources, and stay updated.</p>
              </div>
              <Button variant="primary" onClick={handleJoin} disabled={joining}>
                {joining ? 'Joining...' : 'Join Club'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
