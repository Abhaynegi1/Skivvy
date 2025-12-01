import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ChevronDown, X } from "lucide-react";
import { chatAPI, authAPI } from "../utils/api";
import {motion} from 'framer-motion';
import { useSocket } from "../hooks/useSocket";

const FloatingMessenger = () => {
  const navigate = useNavigate();
  const { socket, connected } = useSocket();
  const [open, setOpen] = useState(false);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [me, setMe] = useState(null);

  const API_BASE_URL = import.meta.env.PROD ? 'https://skivvy-backend.onrender.com' : 'http://localhost:5000';

  // Load current user on mount and listen for auth/user updates so messenger appears immediately after login/updates
  useEffect(() => {
    const loadUser = () => setMe(authAPI.getCurrentUser());

    // initial load
    loadUser();

    // when other parts of the app dispatch storage or user-updated events we should refresh the user
    const onStorage = () => loadUser();
    const onUserUpdated = (e) => {
      const payload = e?.detail;
      if (payload) setMe(payload);
      else loadUser();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('user-updated', onUserUpdated);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('user-updated', onUserUpdated);
    };
  }, []);

  useEffect(() => {
    if (!me) {
      setThreads([]);
      setLoading(false);
      return;
    }
    
    let mounted = true;
    let cancelled = false;
    
    const fetchConversations = async () => {
      if (cancelled) return;
      setLoading(true);
      setError(null);
      try {
        const list = await chatAPI.listConversations();
        if (mounted && !cancelled) {
          if (list?.success) {
            setThreads(list.conversations || []);
          } else {
            setThreads([]);
          }
        }
      } catch (e) {
        if (mounted && !cancelled) {
          setError('Failed to load');
          setThreads([]);
        }
      } finally {
        if (mounted && !cancelled) {
          setLoading(false);
        }
      }
    };

    fetchConversations();
    
    return () => { 
      mounted = false;
      cancelled = true;
    };
  }, [me]); // Only refetch when user changes

  // Real-time socket updates for conversation list
  useEffect(() => {
    if (!socket || !connected) return;

    const handleConversationUpdated = (data) => {
      setThreads((prev) => {
        const existingIndex = prev.findIndex(t => String(t.id) === String(data.conversationId));
        
        if (existingIndex >= 0) {
          // Update existing conversation and move to top
          const updated = [...prev];
          const conversation = {
            ...updated[existingIndex],
            lastMessage: data.lastMessage
          };
          updated.splice(existingIndex, 1);
          return [conversation, ...updated];
        } else {
          // Conversation not in list yet - might be a new one, refetch to get full data
          chatAPI.listConversations().then(list => {
            if (list?.success) {
              setThreads(list.conversations || []);
            }
          });
          return prev;
        }
      });
    };

    const handleNewConversation = (data) => {
      // Add new conversation to the list
      setThreads((prev) => {
        // Check if conversation already exists
        const exists = prev.some(t => t.id === data.conversationId);
        if (exists) return prev;
        
        // Add new conversation at the top
        return [{
          id: data.conversationId,
          peer: data.peer,
          lastMessage: null
        }, ...prev];
      });
    };

    socket.on('conversation_updated', handleConversationUpdated);
    socket.on('new_conversation', handleNewConversation);

    return () => {
      socket.off('conversation_updated', handleConversationUpdated);
      socket.off('new_conversation', handleNewConversation);
    };
  }, [socket, connected]);

  const hasUnread = useMemo(() => {
    // naive heuristic: if last message sender is not me, show a dot
    return threads?.some(t => String(t.lastMessage?.sender) !== String(me?.id));
  }, [threads, me]);

  if (!me) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Panel */}
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{duration: 0.2}}>
        <div className="mb-3 w-96 rounded-2xl shadow-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <MessageCircle className="w-5 h-5 text-orange-500" />
              Messages
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-5 text-sm text-gray-500">Loading…</div>
            ) : error ? (
              <div className="p-5 text-sm text-red-500">{error}</div>
            ) : threads?.length ? (
              threads.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    // Mark as read (optimistically update sender to me so unread dot disappears)
                    setThreads(prev => prev.map(x => x.id === t.id
                      ? { ...x, lastMessage: { ...(x.lastMessage || {}), sender: me?.id } }
                      : x
                    ));
                    setOpen(false);
                    navigate(`/chat/${t.peer?.id || ''}`);
                  }}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {t.peer?.profileImage ? (
                      <img src={t.peer.profileImage.startsWith('http://') || t.peer.profileImage.startsWith('https://') 
                        ? t.peer.profileImage 
                        : `${API_BASE_URL}${t.peer.profileImage}`} alt={t.peer?.displayName || t.peer?.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-orange-700 text-xs font-semibold">
                        {(t.peer?.displayName || t.peer?.username || 'U').split(' ').map(n=>n[0]).join('').toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{t.peer?.displayName || t.peer?.username || 'Unknown'}</div>
                    <div className="text-xs text-gray-500 truncate">{t.lastMessage?.text || ''}</div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-5 text-sm text-gray-500">No conversations yet</div>
            )}
          </div>
          <div className="px-4 py-2 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-1">
            Recent chats
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>
        </motion.div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-full shadow-xl hover:bg-black"
        aria-label="Messages"
      >
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="font-medium">Messages</span>
        {threads?.slice(0,3).map((t, idx) => (
          <span key={t.id} className={`w-6 h-6 rounded-full overflow-hidden border-2 border-gray-900 -mr-2 ${idx===0?'ml-2':''}`}>
            {t.peer?.profileImage ? (
              <img src={t.peer.profileImage.startsWith('http://') || t.peer.profileImage.startsWith('https://') 
                ? t.peer.profileImage 
                : `${API_BASE_URL}${t.peer.profileImage}`} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-[10px] bg-orange-200 text-orange-800 font-semibold">
                {(t.peer?.displayName || t.peer?.username || 'U').slice(0,2).toUpperCase()}
              </span>
            )}
          </span>
        ))}
        {hasUnread && <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full ring-2 ring-white" />}
      </button>
    </div>
  );
};

export default FloatingMessenger;


