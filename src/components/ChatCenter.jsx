import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Send, Trash2, Plus, Cloud, CloudOff } from 'lucide-react';

const LS_KEY = 'flareos_chats';
const DID_KEY = 'flareos_device';
const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

function getDeviceId() {
  let id = localStorage.getItem(DID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DID_KEY, id);
  }
  return id;
}

function loadChatsLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveChatsLocal(chats) {
  localStorage.setItem(LS_KEY, JSON.stringify(chats));
}

export default function ChatCenter() {
  const [chats, setChats] = useState(loadChatsLocal());
  const [activeId, setActiveId] = useState(chats[0]?.id || null);
  const [input, setInput] = useState('');
  const [online, setOnline] = useState(true);
  const inputRef = useRef(null);
  const clientId = getDeviceId();

  useEffect(() => {
    saveChatsLocal(chats);
  }, [chats]);

  // Initial sync from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/chats/${clientId}`);
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        const threads = data.threads || [];
        setChats(threads);
        if (threads.length) setActiveId(threads[0].id);
        setOnline(true);
      } catch (e) {
        setOnline(false);
      }
    })();
  }, [clientId]);

  const activeChat = useMemo(() => chats.find(c => c.id === activeId) || null, [chats, activeId]);

  async function newChat() {
    if (input.trim()) {
      await sendMessage();
      return;
    }
    const id = crypto.randomUUID();
    const chat = { id, title: 'New Chat', messages: [], createdAt: Date.now() };
    setChats([chat, ...chats]);
    setActiveId(id);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  async function sendMessage() {
    if (!input.trim()) return;
    try {
      const res = await fetch(`${API}/api/chats/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: clientId, thread_id: activeId || null, message: input.trim() })
      });
      const data = await res.json();
      if (res.ok && data.thread) {
        const t = data.thread;
        setChats(prev => {
          const without = prev.filter(c => c.id !== t.id);
          return [t, ...without];
        });
        setActiveId(t.id);
        setInput('');
        setOnline(true);
        setTimeout(() => inputRef.current?.focus(), 0);
        return;
      }
      throw new Error('send failed');
    } catch (e) {
      // Fallback local echo
      const userMsg = { role: 'user', content: input.trim(), ts: Date.now() };
      const aiMsg = { role: 'assistant', content: `Echo: ${input.trim()}`, ts: Date.now() };
      if (!activeChat) {
        const id = crypto.randomUUID();
        const chat = { id, title: input.trim().slice(0, 30) || 'New Chat', messages: [userMsg, aiMsg], createdAt: Date.now() };
        setChats([chat, ...chats]);
        setActiveId(id);
      } else {
        setChats(prev => prev.map(c => c.id === activeId ? { ...c, title: c.messages.length === 0 ? input.trim().slice(0,30) : c.title, messages: [...c.messages, userMsg, aiMsg] } : c));
      }
      setInput('');
      setOnline(false);
    }
  }

  async function deleteChat(id) {
    setChats(chats.filter(c => c.id !== id));
    if (activeId === id) setActiveId(null);
    try {
      await fetch(`${API}/api/chats/${clientId}/${id}`, { method: 'DELETE' });
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="h-full grid grid-rows-[auto_1fr_auto] bg-black/20 rounded-xl ring-1 ring-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <button onClick={newChat} className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15">
            <Plus size={14} /> New Chat
          </button>
        </div>
        <div className="text-xs text-white/60 flex items-center gap-2">{online ? <Cloud size={14} className="text-emerald-400"/> : <CloudOff size={14} className="text-amber-400"/>}{online ? 'Online' : 'Offline (local)'}</div>
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-4 border-r border-white/10 max-h-[60vh] overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-4 text-sm text-white/50">No chats yet. Create one to get started.</div>
          ) : (
            <ul>
              {chats.map(c => (
                <li key={c.id} className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer ${activeId === c.id ? 'bg-white/5' : 'hover:bg-white/5'}`}>
                  <button className="flex-1 text-left" onClick={() => setActiveId(c.id)}>
                    <div className="truncate">{c.title || 'Untitled'}</div>
                    <div className="text-[11px] text-white/40">{new Date(c.createdAt || Date.now()).toLocaleString()}</div>
                  </button>
                  <button onClick={() => deleteChat(c.id)} className="text-white/50 hover:text-white">
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="col-span-8 max-h-[60vh] overflow-y-auto">
          {!activeChat ? (
            <div className="h-full grid place-items-center text-white/50 text-sm">Start a chat to begin.</div>
          ) : (
            <div className="p-4 space-y-3">
              {activeChat.messages?.length === 0 && (
                <div className="text-white/40 text-sm">Send a message to start the conversation.</div>
              )}
              {activeChat.messages?.map((m, idx) => (
                <div key={idx} className={`px-3 py-2 rounded-lg text-sm max-w-prose ${m.role === 'user' ? 'bg-white/10 ml-auto' : 'bg-white/5'}`}>
                  <div className="text-[11px] text-white/40 mb-1">{m.role}</div>
                  <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 border-t border-white/10">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey ? (e.preventDefault(), sendMessage()) : null}
          placeholder="Type a message and press Enter"
          className="flex-1 bg-white/5 rounded-md px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        <button onClick={sendMessage} className="inline-flex items-center gap-2 rounded-md bg-white text-black px-3 py-2 text-sm font-medium hover:bg-white/90">
          <Send size={14} /> Send
        </button>
      </div>
    </div>
  );
}
