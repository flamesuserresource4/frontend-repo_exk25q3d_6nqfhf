import React, { useMemo, useState } from 'react';
import Navigation from './components/Navigation';
import ChatCenter from './components/ChatCenter';
import CodeStudio from './components/CodeStudio';
import MemoryManager from './components/MemoryManager';
import ApiKeyManager from './components/ApiKeyManager';
import Hero3D from './components/Hero3D';
import { Rocket, Database, Monitor, Settings, BookOpen, Info, History } from 'lucide-react';
import { motion } from 'framer-motion';

function SectionWrapper({ title, subtitle, children, right }) {
  return (
    <div className="h-full w-full bg-gradient-to-b from-zinc-950 to-black text-white">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/20 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {subtitle && <p className="text-xs text-white/60">{subtitle}</p>}
          </div>
          {right}
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  const [current, setCurrent] = useState('home');

  const content = useMemo(() => {
    switch (current) {
      case 'home':
        return (
          <div id="app" className="h-full w-full bg-black text-white">
            <Hero3D />
            <div className="mx-auto max-w-6xl px-4 md:px-6 -mt-24 relative z-10">
              <div className="grid gap-4 md:grid-cols-3">
                {[{t:'Chat', d:'Start a conversation with real API-ready threads.'},{t:'Code', d:'Edit HTML in real time with a live preview and auto-save.'},{t:'Memory', d:'Store persistent key-value notes synced to backend.'}].map((c,i)=> (
                  <motion.div key={c.t} initial={{ y: 20, opacity: 0}} whileInView={{ y: 0, opacity: 1}} transition={{ delay: 0.05*i, duration: 0.5 }} viewport={{ once: true }} className="rounded-xl ring-1 ring-white/10 p-5 bg-white/5">
                    <div className="text-sm font-medium mb-1">{c.t}</div>
                    <p className="text-white/60 text-sm">{c.d}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'chat':
        return (
          <SectionWrapper title="Chat" subtitle="Converse and keep your history. Real API, local-first.">
            <ChatCenter />
          </SectionWrapper>
        );
      case 'history':
        return (
          <SectionWrapper title="History" subtitle="Quick overview of your recent chats.">
            <div className="rounded-xl ring-1 ring-white/10 bg-white/5 p-6 text-sm text-white/70 flex items-center gap-3">
              <History size={16} />
              Your detailed history is inside Chat. This page can summarize, export, and search across threads.
            </div>
          </SectionWrapper>
        );
      case 'code':
        return (
          <SectionWrapper title="Code Studio" subtitle="Real-time editing with instant preview & backend sync.">
            <CodeStudio />
          </SectionWrapper>
        );
      case 'memory':
        return (
          <SectionWrapper title="Memory" subtitle="Lightweight persistent key-value storage (synced).">
            <MemoryManager />
          </SectionWrapper>
        );
      case 'database':
        return (
          <SectionWrapper title="Database" subtitle="Model data for your app.">
            <div className="rounded-xl ring-1 ring-white/10 bg-white/5 p-6 grid gap-3">
              <div className="flex items-center gap-2 text-sm text-white/70"><Database size={16} /> Schema Designer</div>
              <textarea className="min-h-[220px] bg-black/40 rounded-md p-3 text-sm font-mono outline-none focus:ring-2 focus:ring-white/20" placeholder="Type your schema JSON here..." />
              <div className="text-xs text-white/50">Tip: Works offline. For persistence, we now sync to the backend.
              </div>
            </div>
          </SectionWrapper>
        );
      case 'preview':
        return (
          <SectionWrapper title="Live Preview" subtitle="Render external links or local code">
            <div className="rounded-xl ring-1 ring-white/10 overflow-hidden">
              <iframe title="preview" srcDoc="<html><body style='font-family:Inter;padding:24px'><h1>Preview</h1><p>Open the Code Studio for live editing.</p></body></html>" className="w-full min-h-[65vh] bg-white" />
            </div>
          </SectionWrapper>
        );
      case 'settings':
        return (
          <SectionWrapper title="Settings" subtitle="Configure keys and preferences" right={<Settings size={16} className="text-white/60" />}>
            <div className="grid gap-6">
              <ApiKeyManager />
              <div className="rounded-xl ring-1 ring-white/10 bg-white/5 p-6 grid gap-4">
                <div>
                  <div className="text-sm mb-1">Theme</div>
                  <div className="text-xs text-white/60">Dark by default. Light mode coming soon.</div>
                </div>
                <div>
                  <div className="text-sm mb-1">Authentication</div>
                  <div className="text-xs text-white/60">Optional: Continue with GitHub from the sidebar.</div>
                </div>
              </div>
            </div>
          </SectionWrapper>
        );
      case 'docs':
        return (
          <SectionWrapper title="Docs" subtitle="Usage and concepts" right={<BookOpen size={16} className="text-white/60" />}>
            <div className="prose prose-invert max-w-none">
              <h2>FlareOS</h2>
              <p>A fast workspace that works without accounts. Chat, code, and store memory locally — now with backend sync and API key management.</p>
              <ul>
                <li>Local-first with cloud sync</li>
                <li>Live code preview</li>
                <li>Anonymous device identity</li>
              </ul>
            </div>
          </SectionWrapper>
        );
      case 'about':
        return (
          <SectionWrapper title="About" subtitle="What is this?" right={<Info size={16} className="text-white/60" />}>
            <div className="rounded-xl ring-1 ring-white/10 bg-white/5 p-6 text-sm text-white/70">
              FlareOS MVP: smooth UI, local-first features, optional GitHub auth, 3D Spline hero, and real backend APIs for chats, memory, code, and keys.
            </div>
          </SectionWrapper>
        );
      default:
        return null;
    }
  }, [current]);

  return (
    <div className="min-h-screen w-full grid md:grid-cols-[260px_1fr] bg-black text-white">
      <Navigation current={current} onNavigate={setCurrent} />
      <div className="min-h-screen">
        {content}
      </div>
    </div>
  );
}
