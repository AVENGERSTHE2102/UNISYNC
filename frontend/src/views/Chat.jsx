'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Video, Phone, Info, Paperclip, Send } from 'lucide-react';
import Avatar from '../components/common/Avatar.jsx';
import Button from '../components/common/Button.jsx';
import Card, { CardContent, CardHeader, CardTitle } from '../components/common/Card.jsx';
import Input from '../components/common/Input.jsx';
import { getChatRooms, getChatMessages, markRoomAsRead } from '../services/dbService';
import { useChatSocket } from '../hooks/useChatSocket';

function Chat() {
  const searchParams = useSearchParams();
  const requestedRoomId = searchParams.get('room');
  const requestedUserId = searchParams.get('user');
  const requestedUserName = searchParams.get('name');

  const [chatRooms, setChatRooms] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loadingRooms, setLoadingRooms] = useState(true);
  
  const messagesRef = useRef(null);

  const activeConversationRef = useRef(activeConversation);
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  const { isConnected, sendMessage, setTyping } = useChatSocket(
    activeConversation?.id,
    (msg) => {
      // Ensure the message belongs to the current room
      const currentConv = activeConversationRef.current;
      if (currentConv && Number(msg.roomId) === Number(currentConv.id)) {
        setMessages((prev) => [...prev, msg]);
      }
    }
  );

  const currentUserId = Number(typeof window !== 'undefined' ? localStorage.getItem('userId') : 0);

  // Load Rooms
  useEffect(() => {
    let ignore = false;
    getChatRooms().then((rooms) => {
      if (ignore) return;
      
      let finalRooms = [...rooms];
      let selectedRoom = null;

      if (requestedRoomId) {
        selectedRoom = finalRooms.find(r => Number(r.id) === Number(requestedRoomId));
      }

      if (!selectedRoom && requestedUserId && requestedUserName) {
        // Pseudo room for an upcoming chat
        selectedRoom = {
          id: `new-${requestedUserId}`, // pseudo ID
          isGroup: false,
          name: requestedUserName,
          isPseudo: true,
          participants: [{ id: requestedUserId, name: requestedUserName }]
        };
        finalRooms = [selectedRoom, ...finalRooms];
      }

      setChatRooms(finalRooms);
      setActiveConversation(selectedRoom || finalRooms[0] || null);
      setLoadingRooms(false);
    });
    return () => { ignore = true; };
  }, [requestedRoomId, requestedUserId, requestedUserName]);

  // Load Messages when Active Conversation changes
  useEffect(() => {
    if (activeConversation && !activeConversation.isPseudo) {
      let ignore = false;
      getChatMessages(activeConversation.id).then((msgs) => {
        if (!ignore) setMessages(msgs);
      });

      // Mark room as read if there are unread messages
      if (activeConversation.unreadCount > 0) {
        markRoomAsRead(activeConversation.id).then(() => {
          setChatRooms(prev => prev.map(r => 
            r.id === activeConversation.id ? { ...r, unreadCount: 0 } : r
          ));
        });
      }

      return () => { ignore = true; };
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  // Auto-scroll messages
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({ top: messagesRef.current.scrollHeight });
    }
  }, [messages]);

  const handleSendMessage = () => {
    const text = draft.trim();
    if (!text) return;

    if (activeConversation?.isPseudo) {
      alert("Please ensure the connection is fully accepted before chatting.");
      return;
    }

    sendMessage(text);
    setDraft('');
    setTyping(false);
  };

  const getRoomDisplayName = (room) => {
    if (room.isGroup) return room.name || 'Group Chat';
    // For DMs, find the other participant
    const other = room.participants?.find(p => Number(p.id) !== currentUserId);
    return other ? other.name : 'Unknown User';
  };

  const getRoomDisplayTone = (room) => {
    return room.isGroup ? 'purple' : 'blue';
  };

  return (
    <div className="us-chat-layout">
      {/* Sidebar: Conversations */}
      <Card style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <CardHeader style={{ paddingBottom: '1rem' }}>
          <CardTitle style={{ fontSize: '1.25rem' }}>Messages</CardTitle>
        </CardHeader>
        <CardContent style={{ flex: 1, overflowY: 'auto', padding: '0 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {loadingRooms ? <p>Loading chats...</p> : chatRooms.length === 0 ? <p>No conversations yet.</p> : null}
          {chatRooms.map((room) => {
            const isActive = activeConversation?.id === room.id;
            const displayName = getRoomDisplayName(room);
            return (
              <button
                key={room.id}
                onClick={() => setActiveConversation(room)}
                type="button"
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', width: '100%', background: isActive ? 'var(--color-primary-soft)' : 'transparent',
                  border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s'
                }}
              >
                <Avatar name={displayName} tone={getRoomDisplayTone(room)} />
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <strong style={{ fontSize: '0.95rem', color: room.unreadCount > 0 ? 'var(--color-primary)' : 'var(--color-text-heading)', fontWeight: room.unreadCount > 0 ? 800 : 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {displayName}
                  </strong>
                  {room.unreadCount > 0 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>{room.unreadCount} new message(s)</span>
                  )}
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Main Chat Area */}
      <Card style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', width: '100%' }}>
        {activeConversation ? (
          <>
            {/* Header */}
            <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <Avatar name={getRoomDisplayName(activeConversation)} tone={getRoomDisplayTone(activeConversation)} />
                <div>
                  <CardTitle style={{ fontSize: '1rem', margin: 0 }}>{getRoomDisplayName(activeConversation)}</CardTitle>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    {isConnected ? 'Connected' : 'Connecting...'}
                  </p>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent ref={messagesRef} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--color-page-bg)' }}>
              {messages.length === 0 && <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No messages yet.</p>}
              {messages.map((message) => {
                const isMe = Number(message.senderId) === currentUserId;
                return (
                  <div key={message.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: '1rem', alignItems: 'flex-end' }}>
                    <Avatar name={message.sender?.name || 'User'} tone={isMe ? 'purple' : 'blue'} size="sm" />
                    <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{ padding: '0.75rem 1rem', borderRadius: '1rem', background: isMe ? 'var(--color-primary-soft)' : 'var(--color-surface)', color: isMe ? 'white' : 'var(--color-text)', boxShadow: 'var(--shadow-xs)', border: isMe ? 'none' : '1px solid var(--color-border)', borderBottomRightRadius: isMe ? 0 : '1rem', borderBottomLeftRadius: isMe ? '1rem' : 0 }}>
                        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>{message.content}</p>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-soft)', marginTop: '0.25rem' }}>
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </CardContent>

            {/* Composer */}
            <div className="us-chat-input-bar">
              <Input
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value);
                  setTyping(event.target.value.length > 0);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                style={{ flex: 1 }}
              />
              <Button onClick={handleSendMessage} variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Send size={16} /> <span style={{ display: 'none' }}>Send</span>
              </Button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
            Select a conversation to start chatting
          </div>
        )}
      </Card>
    </div>
  );
}

export default Chat;
