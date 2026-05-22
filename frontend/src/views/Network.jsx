'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Avatar from '../components/common/Avatar.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Card, { CardContent, CardHeader, CardTitle } from '../components/common/Card.jsx';
import { sendConnectionRequest, getConnections, updateConnectionStatus } from '../services/dbService';
import { apiRequest } from '../services/api';

export default function Network() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' or 'requests'
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) setCurrentUserId(Number(userId));
    
    let ignore = false;
    async function loadData() {
      try {
        const usersRes = await apiRequest('/api/auth/users', { auth: true });
        const usersList = usersRes.data || [];
        
        const conns = await getConnections();
        
        if (!ignore) {
          setUsers(usersList);
          setConnections(conns);
          setLoading(false);
        }
      } catch (e) {
        if (!ignore) setLoading(false);
      }
    }
    loadData();
    return () => { ignore = true; };
  }, []);

  const handleConnect = async (userId) => {
    try {
      const newConn = await sendConnectionRequest(userId);
      setConnections(prev => [newConn.connection || newConn, ...prev]);
    } catch (e) {
      alert(e.message || 'Failed to send request');
    }
  };

  const handleAccept = async (connId) => {
    try {
      const result = await updateConnectionStatus(connId, 'accepted');
      setConnections(prev => prev.map(c => c.id === connId ? result.connection : c));
      if (result.roomId) {
        alert('Connection accepted! You can now chat.');
      }
    } catch (e) {
      alert(e.message || 'Failed to accept');
    }
  };

  const handleReject = async (connId) => {
    try {
      const result = await updateConnectionStatus(connId, 'rejected');
      setConnections(prev => prev.map(c => c.id === connId ? result.connection : c));
    } catch (e) {
      alert(e.message || 'Failed to reject');
    }
  };

  const pendingRequests = connections.filter(c => c.status === 'pending' && c.receiverId === currentUserId);
  const sentRequests = connections.filter(c => c.status === 'pending' && c.requesterId === currentUserId);
  const acceptedConnections = connections.filter(c => c.status === 'accepted');
  
  const connectedUserIds = new Set([
    ...sentRequests.map(c => c.receiverId),
    ...pendingRequests.map(c => c.requesterId),
    ...acceptedConnections.map(c => c.requesterId === currentUserId ? c.receiverId : c.requesterId)
  ]);
  
  const discoverableUsers = users.filter(u => u.id !== currentUserId && !connectedUserIds.has(u.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('discover')}
          style={{ background: 'none', border: 'none', fontSize: '1.125rem', fontWeight: activeTab === 'discover' ? 700 : 500, color: activeTab === 'discover' ? 'var(--color-primary)' : 'var(--color-text-muted)', cursor: 'pointer', padding: '0.5rem 1rem' }}
        >
          Discover People
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          style={{ background: 'none', border: 'none', fontSize: '1.125rem', fontWeight: activeTab === 'requests' ? 700 : 500, color: activeTab === 'requests' ? 'var(--color-primary)' : 'var(--color-text-muted)', cursor: 'pointer', padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
        >
          Requests
          {pendingRequests.length > 0 && (
            <Badge variant="warning">{pendingRequests.length}</Badge>
          )}
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : activeTab === 'discover' ? (
        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>People you may know</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {discoverableUsers.map(user => (
              <Card key={user.id}>
                <CardContent style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Link href={`/profile/${user.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <Avatar name={user.name} />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{user.name}</h3>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                        {user.professionalRole || user.branch || user.role}
                        {user.mutualConnectionsCount > 0 && ` · ${user.mutualConnectionsCount} mutual`}
                      </p>
                    </div>
                  </Link>
                  <Button size="sm" variant="primary" onClick={() => handleConnect(user.id)}>Connect</Button>
                </CardContent>
              </Card>
            ))}
            {discoverableUsers.length === 0 && (
              <p style={{ color: 'var(--color-text-muted)' }}>No new people to discover right now.</p>
            )}
          </div>
          
          {acceptedConnections.length > 0 && (
            <>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '2rem 0 1rem' }}>Your Connections</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {acceptedConnections.map(conn => {
                  const peer = conn.requesterId === currentUserId ? conn.receiver : conn.requester;
                  return (
                    <Card key={conn.id}>
                      <CardContent style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link href={`/profile/${peer?.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                          <Avatar name={peer?.name || 'User'} tone="green" />
                          <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{peer?.name}</h3>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Connected</p>
                          </div>
                        </Link>
                        <Button size="sm" variant="secondary" onClick={() => router.push(`/chat?room=${conn.roomId || ''}&user=${peer.id}&name=${encodeURIComponent(peer.name)}`)}>Message</Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </section>
      ) : (
        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Pending Requests</h2>
          {pendingRequests.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>You have no pending connection requests.</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {pendingRequests.map(req => (
                <Card key={req.id}>
                  <CardContent style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Avatar name={req.requester?.name || 'User'} tone="blue" />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{req.requester?.name}</h3>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Wants to connect</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button size="sm" variant="ghost" onClick={() => handleReject(req.id)}>Decline</Button>
                      <Button size="sm" variant="primary" onClick={() => handleAccept(req.id)}>Accept</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
