import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ChevronDown, X } from "lucide-react";
import { chatAPI, authAPI } from "../utils/api";
import {motion} from 'framer-motion';

const FloatingMessenger = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [me, setMe] = useState(null);

  const API_BASE_URL = import.meta.env.PROD ? 'https://skivvy-backend.onrender.com' : 'http://localhost:5000';

  // Get user once on mount
  useEffect(() => {
    const user = authAPI.getCurrentUser();
    setMe(user);
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
                    // Optimistically mark as read so the dot disappears
                    setThreads(prev => prev.map(x => x.id === t.id
                      ? { ...x, lastMessage: { ...(x.lastMessage || {}), sender: me?.id } }
                      : x
                    ));
                    navigate(`/chat/${t.peer?.id || ''}`);
                  }}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {t.peer?.profileImage ? (
                      <img src={`${API_BASE_URL}${t.peer.profileImage}`} alt={t.peer?.displayName || t.peer?.username} className="w-full h-full object-cover" />
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
              <img src={`${API_BASE_URL}${t.peer.profileImage}`} alt="avatar" className="w-full h-full object-cover" />
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


