import { useEffect, useRef, useState } from 'react';
import { Search, Video, Phone, Info, Paperclip, Send } from 'lucide-react';
import Avatar from '../components/common/Avatar.jsx';
import Button from '../components/common/Button.jsx';
import Card, { CardContent, CardHeader, CardTitle } from '../components/common/Card.jsx';
import Input from '../components/common/Input.jsx';
import { conversations, initialMessages } from '../data/chatData';

function Chat() {
  const [activeConversation, setActiveConversation] = useState(conversations[0].id);
  const [activeTab, setActiveTab] = useState('All');
  const [unreadCleared, setUnreadCleared] = useState([]);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const messagesRef = useRef(null);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight });
  }, [messages]);

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((current) => [
      ...current,
      { id: `m-${Date.now()}`, from: 'me', initials: 'AM', text, time }
    ]);
    setDraft('');
  }

  const visibleConversations =
    activeTab === 'Unread'
      ? conversations.filter((item) => item.unread && !unreadCleared.includes(item.id))
      : activeTab === 'Groups'
        ? conversations.filter((item) => item.name.toLowerCase().includes('group') || item.name.toLowerCase().includes('club'))
        : conversations;

  const current = conversations.find((item) => item.id === activeConversation) ?? conversations[0];

  return (
    <div className="us-chat-layout">
      {/* Sidebar: Conversations */}
      <Card style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <CardHeader style={{ paddingBottom: '1rem' }}>
          <CardTitle style={{ fontSize: '1.25rem' }}>Messages</CardTitle>
          <div style={{ marginTop: '1rem', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <Input placeholder="Search conversations..." style={{ paddingLeft: '36px', height: '36px' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.25rem', marginTop: '1rem' }}>
            {['All', 'Groups', 'Unread'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                type="button"
                style={{
                  flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-lg)', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
                  background: activeTab === tab ? 'var(--color-primary-strong)' : 'transparent',
                  color: activeTab === tab ? 'white' : 'var(--color-text-muted)'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent style={{ flex: 1, overflowY: 'auto', padding: '0 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {visibleConversations.map((conversation) => {
            const unread = conversation.unread && !unreadCleared.includes(conversation.id) ? conversation.unread : null;
            const isActive = activeConversation === conversation.id;
            return (
              <button
                key={conversation.id}
                onClick={() => {
                  setActiveConversation(conversation.id);
                  setUnreadCleared((currentCleared) => [...new Set([...currentCleared, conversation.id])]);
                }}
                type="button"
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', width: '100%', background: isActive ? 'var(--color-primary-soft)' : 'transparent',
                  border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s', position: 'relative'
                }}
              >
                <Avatar name={conversation.name} tone={conversation.tone} />
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conversation.name}</strong>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conversation.preview}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                  <em style={{ fontSize: '0.75rem', color: 'var(--color-text-soft)', fontStyle: 'normal' }}>{conversation.time}</em>
                  {unread ? <b style={{ background: 'var(--color-danger)', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '1rem' }}>{unread}</b> : null}
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Main Chat Area */}
      <Card style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', width: '100%' }}>
        {/* Header */}
        <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            <div style={{ position: 'relative' }}>
              <Avatar name={current.name} tone={current.tone} />
              {current.online && <span style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', background: 'var(--color-success)', borderRadius: '50%', border: '2px solid var(--color-surface)' }} />}
            </div>
            <div>
              <CardTitle style={{ fontSize: '1rem', margin: 0 }}>{current.name}</CardTitle>
              <p style={{ margin: 0, fontSize: '0.875rem', color: current.online ? 'var(--color-success)' : 'var(--color-text-muted)' }}>{current.online ? 'Online' : 'Active recently'}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="ghost" size="sm" style={{ padding: '0.5rem' }}><Video size={18} /></Button>
            <Button variant="ghost" size="sm" style={{ padding: '0.5rem' }}><Phone size={18} /></Button>
            <Button variant="ghost" size="sm" style={{ padding: '0.5rem' }}><Info size={18} /></Button>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent ref={messagesRef} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--color-page-bg)' }}>
          <div style={{ textAlign: 'center', color: 'var(--color-text-soft)', fontSize: '0.75rem', margin: '1rem 0' }}>Today</div>
          {messages.map((message) => {
            const isMe = message.from === 'me';
            return (
              <div key={message.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: '1rem', alignItems: 'flex-end' }}>
                <Avatar name={message.initials} tone={isMe ? 'purple' : 'blue'} size="sm" />
                <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                  <div style={{ padding: '0.75rem 1rem', borderRadius: '1rem', background: isMe ? 'var(--color-primary-soft)' : 'var(--color-surface)', color: isMe ? 'white' : 'var(--color-text)', boxShadow: 'var(--shadow-xs)', border: isMe ? 'none' : '1px solid var(--color-border)', borderBottomRightRadius: isMe ? 0 : '1rem', borderBottomLeftRadius: isMe ? '1rem' : 0 }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>{message.text}</p>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-soft)', marginTop: '0.25rem' }}>{message.time}</span>
                </div>
              </div>
            );
          })}
        </CardContent>

        {/* Composer */}
        <div className="us-chat-input-bar">
          <button style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', padding: '0.5rem' }}><Paperclip size={20} /></button>
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type a message..."
            style={{ flex: 1 }}
          />
          <Button onClick={sendMessage} variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send size={16} /> <span style={{ display: 'none' }}>Send</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Chat;
