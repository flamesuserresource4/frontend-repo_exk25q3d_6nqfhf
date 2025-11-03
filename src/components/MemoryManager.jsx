import React, { useEffect, useState } from 'react';
import { PlusCircle, Trash2, Cloud, CloudOff } from 'lucide-react';

const MEM_KEY = 'flareos_memory';
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

function loadMemory() {
  try {
    const raw = localStorage.getItem(MEM_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMemory(items) {
  localStorage.setItem(MEM_KEY, JSON.stringify(items));
}

export default function MemoryManager() {
  const [items, setItems] = useState(loadMemory());
  const [keyName, setKeyName] = useState('');
  const [value, setValue] = useState('');
  const [online, setOnline] = useState(true);
  const clientId = getDeviceId();

  useEffect(() => {
    saveMemory(items);
  }, [items]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/memory/${clientId}`);
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        setItems(data.items || []);
        setOnline(true);
      } catch (e) {
        setOnline(false);
      }
    })();
  }, [clientId]);

  async function addItem() {
    if (!keyName.trim()) return;
    const body = { client_id: clientId, key: keyName.trim(), value };
    try {
      const res = await fetch(`${API}/api/memory`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok && data.item) {
        const next = [data.item, ...items.filter(i => i.key !== data.item.key)];
        setItems(next);
        setOnline(true);
      } else {
        throw new Error('save failed');
      }
    } catch (e) {
      const exists = items.find(i => i.key === keyName.trim());
      const next = exists ? items.map(i => i.key === keyName.trim() ? { ...i, value } : i) : [{ key: keyName.trim(), value, ts: Date.now() }, ...items];
      setItems(next);
      setOnline(false);
    }
    setKeyName('');
    setValue('');
  }

  async function removeItem(key) {
    setItems(items.filter(i => i.key !== key));
    try {
      await fetch(`${API}/api/memory/${clientId}/${encodeURIComponent(key)}`, { method: 'DELETE' });
      setOnline(true);
    } catch (e) {
      setOnline(false);
    }
  }

  return (
    <div className="h-full grid grid-rows-[auto_auto_1fr] bg-black/20 rounded-xl ring-1 ring-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 text-sm text-white/70 flex items-center gap-2">
        Persistent Memory
        {online ? <Cloud size={14} className="text-emerald-400 ml-2"/> : <CloudOff size={14} className="text-amber-400 ml-2"/>}
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-3 border-b border-white/10">
        <input
          value={keyName}
          onChange={e => setKeyName(e.target.value)}
          placeholder="Key"
          className="md:col-span-1 bg-white/5 rounded-md px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Value"
          className="md:col-span-3 bg-white/5 rounded-md px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        <button onClick={addItem} className="md:col-span-1 inline-flex items-center justify-center gap-2 rounded-md bg-white text-black px-3 py-2 text-sm font-medium hover:bg-white/90">
          <PlusCircle size={16} /> Save
        </button>
      </div>

      <div className="overflow-y-auto max-h-[60vh] p-2">
        {items.length === 0 ? (
          <div className="p-4 text-sm text-white/50">No memory stored yet.</div>
        ) : (
          <ul className="divide-y divide-white/10">
            {items.map((i) => (
              <li key={i.key} className="flex items-center gap-3 px-3 py-3">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white/40">{new Date(i.ts || Date.now()).toLocaleString()}</div>
                  <div className="font-medium truncate">{i.key}</div>
                  <div className="text-sm text-white/80 truncate">{i.value}</div>
                </div>
                <button onClick={() => removeItem(i.key)} className="text-white/60 hover:text-white">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
