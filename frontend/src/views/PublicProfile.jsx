'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Users, ArrowLeft, Check, Clock, MessageCircle } from 'lucide-react';
import Avatar from '../components/common/Avatar.jsx';
import Button from '../components/common/Button.jsx';
import Card, { CardContent } from '../components/common/Card.jsx';
import { getUserProfile, sendConnectionRequest, getConnections, updateConnectionStatus } from '../services/dbService';
import { getApiUrl } from '../services/api';

export default function PublicProfile({ userId }) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  // 'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'own'
  const [connectionStatus, setConnectionStatus] = useState('none');
  const [connectionId, setConnectionId] = useState(null);

  const currentUserId = typeof window !== 'undefined' ? Number(localStorage.getItem('userId')) : null;

  useEffect(() => {
    let ignore = false;

    Promise.all([
      getUserProfile(userId),
      getConnections(),
    ]).then(([profileData, connections]) => {
      if (ignore) return;

      setProfile(profileData);

      const myId = Number(localStorage.getItem('userId'));
      const targetId = Number(userId);

      if (myId === targetId) {
        setConnectionStatus('own');
        setLoading(false);
        return;
      }

      // Find connection between current user and this profile
      const conn = connections.find(c =>
        (c.requesterId === myId && c.receiverId === targetId) ||
        (c.requesterId === targetId && c.receiverId === myId)
      );

      if (conn) {
        setConnectionId(conn.id);
        if (conn.status === 'accepted') {
          setConnectionStatus('accepted');
        } else if (conn.status === 'pending') {
          setConnectionStatus(conn.requesterId === myId ? 'pending_sent' : 'pending_received');
        } else {
          setConnectionStatus('none');
        }
      } else {
        setConnectionStatus('none');
      }
      setLoading(false);
    }).catch((err) => {
      if (!ignore) {
        console.error(err);
        setLoading(false);
      }
    });

    return () => { ignore = true; };
  }, [userId]);

  const handleConnect = async () => {
    try {
      const result = await sendConnectionRequest(Number(userId));
      setConnectionStatus('pending_sent');
      setConnectionId((result.connection || result)?.id);
    } catch (err) {
      alert(err.message || 'Failed to send request');
    }
  };

  const handleAccept = async () => {
    try {
      await updateConnectionStatus(connectionId, 'accepted');
      setConnectionStatus('accepted');
    } catch (err) {
      alert(err.message || 'Failed to accept');
    }
  };

  const handleMessage = () => {
    router.push(`/chat?user=${userId}&name=${encodeURIComponent(profile?.name || '')}`);
  };

  const photoSrc = profile?.profilePhoto ? getApiUrl(profile.profilePhoto) : null;

  if (loading) {
    return (
      <div className="us-dashboard-container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="us-dashboard-container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Profile Not Found</h2>
        <Button onClick={() => router.back()} style={{ marginTop: '1rem' }}>Go Back</Button>
      </div>
    );
  }

  const renderActionButton = () => {
    switch (connectionStatus) {
      case 'own':
        return (
          <Button variant="secondary" onClick={() => router.push('/profile')}>
            Edit My Profile
          </Button>
        );
      case 'accepted':
        return (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={handleMessage}>
              <MessageCircle size={16} /> Message
            </Button>
            <Button variant="ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)' }} disabled>
              <Check size={16} /> Connected
            </Button>
          </div>
        );
      case 'pending_sent':
        return (
          <Button variant="ghost" disabled style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
            <Clock size={16} /> Request Sent
          </Button>
        );
      case 'pending_received':
        return (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="primary" onClick={handleAccept} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} /> Accept
            </Button>
            <Button variant="ghost" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Wants to connect
            </Button>
          </div>
        );
      default:
        return (
          <Button variant="primary" onClick={handleConnect}>
            Connect
          </Button>
        );
    }
  };

  return (
    <div className="us-dashboard-container" style={{ padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <Button variant="ghost" onClick={() => router.back()} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0 }}>
        <ArrowLeft size={18} /> Back
      </Button>

      <div style={{ position: 'relative', marginBottom: '4.5rem' }}>
        {/* Banner */}
        <div style={{ height: '160px', borderRadius: '1rem', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', boxShadow: 'var(--shadow-sm)' }}></div>

        {/* Avatar / Photo */}
        <div style={{ position: 'absolute', bottom: '-3.5rem', left: '2rem', padding: '4px', background: 'var(--color-page-bg)', borderRadius: '50%', boxShadow: 'var(--shadow-md)' }}>
          {photoSrc ? (
            <img
              src={photoSrc}
              alt={profile.name}
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <Avatar name={profile.name} size="xl" tone="purple" style={{ width: '100px', height: '100px', fontSize: '2.5rem' }} />
          )}
        </div>

        {/* Action Button */}
        <div style={{ position: 'absolute', bottom: '-2.75rem', right: '1rem' }}>
          {renderActionButton()}
        </div>
      </div>

      <div style={{ padding: '0 1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-heading)', marginBottom: '0.25rem' }}>
          {profile.name}
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-text)', marginBottom: '1rem', fontWeight: 500 }}>
          {profile.professionalRole || profile.branch || profile.role || 'Student'}
          {profile.company && ` @ ${profile.company}`}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
          {profile.yearOfStudy && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              <GraduationCap size={16} /> Year {profile.yearOfStudy}
            </div>
          )}
          {profile.mutualConnectionsCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              <Users size={16} /> {profile.mutualConnectionsCount} Mutual Connections
            </div>
          )}
        </div>

        <Card style={{ marginBottom: '2rem' }}>
          <CardContent style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>About</h3>
            <p style={{ color: 'var(--color-text)', lineHeight: 1.6 }}>
              {profile.bio || `Hi, I'm ${profile.name}! ${profile.branch ? `Currently studying ${profile.branch}` : 'Exploring interests'} at UniSync.`}
            </p>
          </CardContent>
        </Card>

        {profile.interests && profile.interests.length > 0 && (
          <Card>
            <CardContent style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Interests & Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {profile.interests.map((interest, idx) => (
                  <span key={idx} style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '2rem',
                    background: 'var(--color-surface)',
                    color: 'var(--color-primary)',
                    fontSize: '0.875rem',
                    border: '1px solid var(--color-border)'
                  }}>
                    {interest}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
