import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authAPI, chatAPI } from "../utils/api";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { useSocket } from "../hooks/useSocket";

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket, connected } = useSocket();
  const [peer, setPeer] = useState(null);
  const [threads, setThreads] = useState([]); // left sidebar
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const messagesRef = useRef(null);
  const currentUser = authAPI.getCurrentUser();
  const [menuOpenId, setMenuOpenId] = useState(null);

  // Load conversations; if navigated with a user id, open/create conversation
  useEffect(() => {
    (async () => {
      // If /chat/:id where id is user id
      let targetConversationId = null;
      if (id) {
        const convo = await chatAPI.getOrCreateConversation(id);
        if (convo?.success) {
          targetConversationId = convo.conversationId;
          setConversationId(targetConversationId);
        }
      }

      const list = await chatAPI.listConversations();
      if (list?.success) {
        setThreads(
          list.conversations.map((c) => ({
            id: c.id,
            name: c.peer?.displayName || c.peer?.username || "Unknown",
            avatar: c.peer?.profileImage || null,
            peerId: c.peer?.id,
            last: c.lastMessage?.text || "",
          }))
        );

        const active = targetConversationId || list.conversations[0]?.id;
        if (active) {
          setConversationId(active);
          const selected = list.conversations.find((c) => c.id === active);
          if (selected?.peer) {
            setPeer({
              id: selected.peer.id,
              username: selected.peer.username,
              displayName: selected.peer.displayName,
              profile: { profileImage: selected.peer.profileImage },
            });
          }
          const msgs = await chatAPI.getMessages(active);
          if (msgs?.success) setMessages(msgs.messages);
        }
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!messagesRef.current || messages.length === 0) return;
    // Scroll the messages pane, not the window
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !connected) return;

    const handleMessageReceived = (data) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) => {
          // Check if message already exists (avoid duplicates)
          const exists = prev.some(m => String(m._id || m.id) === String(data.message._id || data.message.id));
          if (exists) return prev;
          return [...prev, data.message];
        });
      }
    };

    const handleMessageEdited = (data) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) =>
          prev.map((m) =>
            String(m._id || m.id) === String(data.messageId)
              ? { ...m, text: data.message.text }
              : m
          )
        );
      }
    };

    const handleMessageDeleted = (data) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) =>
          prev.filter((m) => String(m._id || m.id) !== String(data.messageId))
        );
      }
    };

    const handleConversationUpdated = (data) => {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === data.conversationId
            ? { ...t, last: data.lastMessage?.text || "" }
            : t
        )
      );
    };

    const handleError = (error) => {
      console.error('Socket error:', error);
    };

    socket.on('message_received', handleMessageReceived);
    socket.on('message_edited', handleMessageEdited);
    socket.on('message_deleted', handleMessageDeleted);
    socket.on('conversation_updated', handleConversationUpdated);
    socket.on('error', handleError);

    return () => {
      socket.off('message_received', handleMessageReceived);
      socket.off('message_edited', handleMessageEdited);
      socket.off('message_deleted', handleMessageDeleted);
      socket.off('conversation_updated', handleConversationUpdated);
      socket.off('error', handleError);
    };
  }, [socket, connected, conversationId]);

  // Join/leave conversation room when conversationId changes
  useEffect(() => {
    if (!socket || !connected || !conversationId) return;

    socket.emit('join_conversation', conversationId);

    return () => {
      socket.emit('leave_conversation', conversationId);
    };
  }, [socket, connected, conversationId]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || !conversationId) return;

    if (socket && connected) {
      // Send via socket for real-time
      socket.emit('new_message', {
        conversationId,
        text: trimmed
      });
      setInput("");
    } else {
      // Fallback to REST API if socket not connected
      const resp = await chatAPI.sendMessage(conversationId, trimmed);
      if (resp?.success) {
        setMessages((prev) => [...prev, resp.message]);
        setInput("");
      }
    }
  };

  const API_BASE_URL = import.meta.env.PROD
    ? "https://skivvy-backend.onrender.com"
    : "http://localhost:5000";

  const selectThread = async (t) => {
    setConversationId(t.id);
    setPeer({
      id: t.peerId,
      username: t.name,
      displayName: t.name,
      profile: { profileImage: t.avatar },
    });
    const msgs = await chatAPI.getMessages(t.id);
    if (msgs?.success) setMessages(msgs.messages);
  };

  return (
    <div className="bg-background min-h-fit mt-20 pt-1 flex justify-center">
      <div className="max-w-screen bg-card shadow-lg flex h-[calc(100vh-5rem)] overflow-hidden">
        {/* Sidebar */}
        <aside className="w-96 border-r border-border bg-card flex flex-col backdrop:blur-lg">
          <div className="p-3 border-b border-gray-200 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 text-text-primary flex items-center justify-center"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="font-semibold text-text-primary text-lg">Messages</div>
            <div className={`ml-auto w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} title={connected ? 'Connected' : 'Disconnected'} />
          </div>
          <div className="p-2">
            <input
              placeholder="Search"
              className="w-full px-4 py-2 border border-border rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 duration-300 bg-card/70"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => selectThread(t)}
                className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-background text-left ${
                  peer && t.name === (peer.displayName || peer.username)
                    ? "bg-orange-300"
                    : ""
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-orange-200 overflow-hidden flex items-center justify-center">
                  {t.avatar ? (
                    <img
                      src={`${API_BASE_URL}${t.avatar}`}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-orange-700 font-semibold">
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-text-primary truncate text-base">
                    {t.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{t.last}</div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Thread */}
        <section className="flex-1 flex flex-col w-screen">
          <div className="p-4 border-b border-gray-200 flex items-cenert gap-3 ">
            <div className="w-10 h-10 rounded-full bg-orange-200 overflow-hidden flex items-center justify-center">
              {peer?.profile?.profileImage ? (
                <img
                  src={`${API_BASE_URL}${peer.profile.profileImage}`}
                  alt={peer.displayName || peer.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-text-primary font-semibold text-sm">
                  {(peer ? peer.displayName || peer.username : "Chat")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              )}
            </div>
            <div className="font-semibold text-text-primary text-lg">
              {peer ? peer.displayName || peer.username : "Chat"}
            </div>
          </div>
          <div
            ref={messagesRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-card"
          >
            {messages.map((m, index) => {
              const isMine = String(m.sender) === String(currentUser?.id);
              const msgDate = new Date(m.createdAt);
              const prevMsg = index > 0 ? messages[index - 1] : null;
              const prevMsgDate = prevMsg ? new Date(prevMsg.createdAt) : null;
              const isNewDay =
                !prevMsgDate ||
                msgDate.toDateString() !== prevMsgDate.toDateString();

              const formatChatDate = (date) => {
                const today = new Date();
                const d = new Date(date);
                const diff =
                  today.setHours(0, 0, 0, 0) - d.setHours(0, 0, 0, 0);
                const oneDay = 1000 * 60 * 60 * 24;

                if (diff === 0) return "Today";
                if (diff === oneDay) return "Yesterday";
                return d.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              };

              return (
                <React.Fragment key={m._id || m.id}>
                  {/* Date Separator */}
                  {isNewDay && (
                    <div className="text-center my-4">
                      <span className="bg-orange-100 text-orange-700 text-xs px-4 py-1 rounded-full shadow-sm">
                        {formatChatDate(m.createdAt)}
                      </span>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`group flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`relative inline-block max-w-[70%] px-3 py-2 rounded-full break-words whitespace-pre-wrap ${
                        isMine
                          ? "bg-orange-500 text-white"
                          : "bg-gray-300 text-gray-800 border border-gray-200"
                      }`}
                    >
                      {m.text}
                      {isMine && (
                        <>
                          <button
                            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-white border border-gray-200 shadow`}
                            onClick={() =>
                              setMenuOpenId(
                                menuOpenId === (m._id || m.id)
                                  ? null
                                  : m._id || m.id
                              )
                            }
                          >
                            <MoreVertical className="w-4 h-4 text-gray-700" />
                          </button>
                          {menuOpenId === (m._id || m.id) && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full ml-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                              <button
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                                onClick={async () => {
                                  const text = prompt("Edit message", m.text);
                                  setMenuOpenId(null);
                                  if (text != null && text.trim()) {
                                    if (socket && connected) {
                                      socket.emit('edit_message', {
                                        conversationId,
                                        messageId: m._id || m.id,
                                        text: text.trim()
                                      });
                                    } else {
                                      const resp = await chatAPI.updateMessage(
                                        conversationId,
                                        m._id || m.id,
                                        text.trim()
                                      );
                                      if (resp?.success) {
                                        setMessages((prev) =>
                                          prev.map((x) =>
                                            String(x._id || x.id) ===
                                            String(m._id || m.id)
                                              ? { ...x, text: resp.message.text }
                                              : x
                                          )
                                        );
                                      }
                                    }
                                  }
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                onClick={async () => {
                                  setMenuOpenId(null);
                                  const ok = confirm("Delete this message?");
                                  if (ok) {
                                    if (socket && connected) {
                                      socket.emit('delete_message', {
                                        conversationId,
                                        messageId: m._id || m.id
                                      });
                                    } else {
                                      const resp = await chatAPI.deleteMessage(
                                        conversationId,
                                        m._id || m.id
                                      );
                                      if (resp?.success) {
                                        setMessages((prev) =>
                                          prev.filter(
                                            (x) =>
                                              String(x._id || x.id) !==
                                              String(m._id || m.id)
                                          )
                                        );
                                      }
                                    }
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

            <div ref={bottomRef} />
          </div>
          <div className="p-4 flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full bg-card focus:ring-2 focus:ring-orange-500 focus:border-orange-500 duration-300"
            />
            <button
              onClick={sendMessage}
              className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full"
            >
              Send
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Chat;
