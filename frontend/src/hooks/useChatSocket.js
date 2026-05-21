'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useChatSocket(roomId, onMessageReceived) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});

  const onMessageReceivedRef = useRef(onMessageReceived);
  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived;
  }, [onMessageReceived]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io(SOCKET_URL, {
      auth: { token }
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      if (roomId) {
        newSocket.emit('room:join', roomId);
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('chat:message', (msg) => {
      onMessageReceivedRef.current?.(msg);
    });

    newSocket.on('presence:update', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('typing:update', ({ userId, typing }) => {
      setTypingUsers(prev => ({ ...prev, [userId]: typing }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Re-join when roomId changes
  useEffect(() => {
    if (socket && isConnected && roomId) {
      socket.emit('room:join', roomId);
    }
  }, [roomId, socket, isConnected]);

  const sendMessage = useCallback((content) => {
    if (socket && isConnected && roomId) {
      socket.emit('chat:send', { roomId, content });
    }
  }, [socket, isConnected, roomId]);

  const setTyping = useCallback((isTyping) => {
    if (socket && isConnected && roomId) {
      socket.emit(isTyping ? 'typing:start' : 'typing:stop', roomId);
    }
  }, [socket, isConnected, roomId]);

  return { isConnected, sendMessage, setTyping, onlineUsers, typingUsers };
}
