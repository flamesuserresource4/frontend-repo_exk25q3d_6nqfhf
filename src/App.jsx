import React from 'react';
import Hero3D from './components/Hero3D';
import ApiKeyManager from './components/ApiKeyManager';
import AgentManager from './components/AgentManager';
import ModeWorkbench from './components/ModeWorkbench';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      <Hero3D />
      <main id="dashboard" className="mx-auto max-w-6xl space-y-6 px-6 py-10 md:space-y-8 md:px-10">
        <section className="grid gap-6 md:grid-cols-2">
          <ApiKeyManager />
          <AgentManager />
        </section>
        <section>
          <ModeWorkbench />
        </section>
        <footer className="py-10 text-center text-xs text-white/50">
          FlareOS • Immersive AI Workspace Prototype
        </footer>
      </main>
    </div>
  );
}
