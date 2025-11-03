import React, { useEffect, useState } from 'react';
import { Key, Shield, Eye, EyeOff } from 'lucide-react';

const PROVIDERS = [
  { id: 'openai', label: 'OpenAI' },
  { id: 'gemini', label: 'Google Gemini' },
  { id: 'anthropic', label: 'Anthropic' },
];

function mask(str) {
  if (!str) return '';
  const visible = 4;
  const masked = str.length > visible ? '*'.repeat(str.length - visible) + str.slice(-visible) : '*'.repeat(str.length);
  return masked;
}

export default function ApiKeyManager() {
  const [keys, setKeys] = useState({ openai: '', gemini: '', anthropic: '' });
  const [show, setShow] = useState({ openai: false, gemini: false, anthropic: false });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('flareos_api_keys');
      if (raw) setKeys(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const save = () => {
    localStorage.setItem('flareos_api_keys', JSON.stringify(keys));
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
          Keys stored locally
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
    </div>
  );
}
