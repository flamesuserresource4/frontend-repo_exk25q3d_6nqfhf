import React, { useEffect, useState } from 'react';
import { Key, Shield, Eye, EyeOff, Cloud, CloudOff } from 'lucide-react';

const PROVIDERS = [
  { id: 'openai', label: 'OpenAI' },
  { id: 'gemini', label: 'Google Gemini' },
  { id: 'anthropic', label: 'Anthropic' },
];

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

function mask(str) {
  if (!str) return '';
  const visible = 4;
  const masked = str.length > visible ? '*'.repeat(str.length - visible) + str.slice(-visible) : '*'.repeat(str.length);
  return masked;
}

export default function ApiKeyManager() {
  const clientId = getDeviceId();
  const [keys, setKeys] = useState({ openai: '', gemini: '', anthropic: '' });
  const [show, setShow] = useState({ openai: false, gemini: false, anthropic: false });
  const [saved, setSaved] = useState(false);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/keys/${clientId}`);
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        const providers = data.providers || {};
        setKeys({ openai: providers.openai || '', gemini: providers.gemini || '', anthropic: providers.anthropic || '' });
        setOnline(true);
      } catch (e) {
        // fallback to local
        try {
          const raw = localStorage.getItem('flareos_api_keys');
          if (raw) setKeys(JSON.parse(raw));
        } catch {}
        setOnline(false);
      }
    })();
  }, [clientId]);

  const save = async () => {
    try {
      const res = await fetch(`${API}/api/keys`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: clientId, providers: keys }) });
      if (!res.ok) throw new Error('save failed');
      setOnline(true);
    } catch (e) {
      // local fallback
      localStorage.setItem('flareos_api_keys', JSON.stringify(keys));
      setOnline(false);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/90 backdrop-blur md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Key className="h-5 w-5 text-emerald-400" />
        <h3 className="text-lg font-semibold">API Key Manager</h3>
        <span className="ml-auto inline-flex items-center gap-2 text-xs text-white/60">
          <Shield className="h-4 w-4" />
          {online ? (<span className="inline-flex items-center gap-1"><Cloud className="h-4 w-4 text-emerald-400"/> Synced</span>) : (<span className="inline-flex items-center gap-1"><CloudOff className="h-4 w-4 text-amber-400"/> Local</span>)}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PROVIDERS.map((p) => (
          <div key={p.id} className="space-y-2">
            <label className="text-sm text-white/70">{p.label}</label>
            <div className="flex items-center gap-2">
              <input
                type={show[p.id] ? 'text' : 'password'}
                value={keys[p.id]}
                onChange={(e) => setKeys({ ...keys, [p.id]: e.target.value })}
                placeholder={`Paste ${p.label} API key`}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none ring-emerald-400/40 placeholder:text-white/40 focus:ring-2"
              />
              <button
                className="rounded-md border border-white/10 bg-white/5 p-2 text-white/80 hover:bg-white/10"
                onClick={() => setShow({ ...show, [p.id]: !show[p.id] })}
                aria-label="Toggle visibility"
              >
                {show[p.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-white/50">{keys[p.id] ? mask(keys[p.id]) : 'Not set'}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button onClick={save} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400">Save Keys</button>
        {saved && <span className="text-xs text-emerald-300">Saved ✓</span>}
      </div>
      <p className="mt-3 text-xs text-white/50">Keys are stored for your device. For production, enable encryption at rest and server-side redaction.</p>
    </div>
  );
}
