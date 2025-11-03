import React from 'react';
import { Sparkles, Layers, Database, Users, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Parallel AI Agents',
    desc: 'Run multiple models at once for planning, coding, tests, and design — faster builds with smart auto-switching.',
  },
  {
    icon: Layers,
    title: 'Real-time Preview',
    desc: 'Instant updates as you edit. Monaco-powered editor with live sandbox and smooth animations.',
  },
  {
    icon: Database,
    title: 'Integrated DB Studio',
    desc: 'Visual schema editing, live queries, and migrations — all in sync with your app.',
  },
  {
    icon: Users,
    title: 'Collaborative by Default',
    desc: 'Presence, cursors, and shared history. Create together with CRDT-powered conflict-free editing.',
  },
  {
    icon: Shield,
    title: 'Key Management',
    desc: 'Use your own API keys securely. Choose providers and track usage without vendor lock-in.',
  },
  {
    icon: Zap,
    title: '3D Immersion',
    desc: 'React Three Fiber visuals that respond to code changes — particles, holograms, and physics.',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative bg-black text-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight">Forge at the speed of thought</h2>
        <p className="mt-3 text-white/70 max-w-2xl">
          Describe. Animate. Collaborate. Forge. A studio built for non-devs and teams to turn vibes into full-stack apps.
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 grid place-items-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-base font-medium">{title}</h3>
              </div>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
