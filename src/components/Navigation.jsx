import React from 'react';
import { Home, MessageSquare, History, FileCode, Brain, Database, Monitor, Settings, BookOpen, Info, Github } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'chat', label: 'Chat', icon: MessageSquare },
  { key: 'history', label: 'History', icon: History },
  { key: 'code', label: 'Code', icon: FileCode },
  { key: 'memory', label: 'Memory', icon: Brain },
  { key: 'database', label: 'Database', icon: Database },
  { key: 'preview', label: 'Preview', icon: Monitor },
  { key: 'settings', label: 'Settings', icon: Settings },
  { key: 'docs', label: 'Docs', icon: BookOpen },
  { key: 'about', label: 'About', icon: Info },
];

export default function Navigation({ current, onNavigate }) {
  return (
    <aside className="h-screen w-full max-w-64 bg-gradient-to-b from-zinc-950 to-black/80 border-r border-white/10 hidden md:flex md:flex-col">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-white/10 ring-1 ring-white/15 grid place-items-center">
            <span className="text-xs font-bold">FO</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold">FlareOS</h1>
            <p className="text-[11px] text-white/50">MVP Workspace</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const active = current === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`w-full px-4 py-2.5 flex items-center gap-3 text-sm transition-colors ${
                active ? 'text-white bg-white/5' : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <a
          href="https://github.com/login"
          target="_blank"
          rel="noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-white text-black py-2 text-sm font-medium hover:bg-white/90 transition"
        >
          <Github size={16} /> Continue with GitHub
        </a>
        <p className="mt-2 text-[11px] text-white/50 leading-snug">
          Optional sign-in. All features work without an account.
        </p>
      </div>
    </aside>
  );
}
