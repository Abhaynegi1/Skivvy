import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://skivvy-backend.onrender.com' 
  : 'http://localhost:5000';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const tokenRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    tokenRef.current = token;

    // Initialize socket connection
    const newSocket = io(API_BASE_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Reconnect if token changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== tokenRef.current && socket) {
      socket.auth.token = token;
      socket.disconnect();
      socket.connect();
      tokenRef.current = token;
    }
  }, [socket]);

  return { socket, connected };
};

