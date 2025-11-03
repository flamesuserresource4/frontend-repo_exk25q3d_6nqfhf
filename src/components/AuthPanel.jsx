import React, { useState } from 'react';
import { User, Mail, LockKeyhole, LogIn } from 'lucide-react';

export default function AuthPanel() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [message, setMessage] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    // Demo-only: just mock success and persist a session flag locally
    if (!form.email || !form.password || (mode === 'signup' && !form.name)) {
      setMessage('Please fill in all required fields.');
      return;
    }
    localStorage.setItem('flareos_session', JSON.stringify({ email: form.email, name: form.name || 'Flare User' }));
    setMessage('Signed in locally — connect to backend auth to go fully live.');
  };

  const isAuthed = Boolean(localStorage.getItem('flareos_session'));
  const session = isAuthed ? JSON.parse(localStorage.getItem('flareos_session')) : null;

  const logout = () => {
    localStorage.removeItem('flareos_session');
    setMessage('Signed out.');
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/90 backdrop-blur md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <User className="h-5 w-5 text-emerald-400" />
        <h3 className="text-lg font-semibold">Account</h3>
      </div>

      {isAuthed ? (
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 p-4">
          <div>
            <div className="text-sm">Signed in as</div>
            <div className="font-medium">{session.name} <span className="text-white/60">({session.email})</span></div>
          </div>
          <button onClick={logout} className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">Sign out</button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="text-xs text-white/60">Name</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none ring-emerald-400/40 placeholder:text-white/40 focus:ring-2"
                />
              </div>
            </div>
          )}
          <div>
            <label className="text-xs text-white/60">Email</label>
            <div className="mt-1 flex items-center gap-2">
              <Mail className="h-4 w-4 text-white/40" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@flareos.com"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none ring-emerald-400/40 placeholder:text-white/40 focus:ring-2"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-white/60">Password</label>
            <div className="mt-1 flex items-center gap-2">
              <LockKeyhole className="h-4 w-4 text-white/40" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none ring-emerald-400/40 placeholder:text-white/40 focus:ring-2"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400">
              <LogIn className="h-4 w-4" /> {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
            <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-xs text-white/70 hover:text-white">
              {mode === 'login' ? 'Create an account' : 'Have an account? Sign in'}
            </button>
          </div>
          {message && <p className="text-xs text-emerald-300">{message}</p>}
        </form>
      )}
    </div>
  );
}
