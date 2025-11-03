import React, { useState } from 'react';
import Navigation from './components/Navigation.jsx';
import Hero3D from './components/Hero3D.jsx';
import Features from './components/Features.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [current, setCurrent] = useState('home');

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-[1400px] flex">
        <Navigation current={current} onNavigate={setCurrent} />
        <main id="app" className="flex-1 min-h-screen">
          <Hero3D />
          <Features />
          <section className="py-14 border-t border-white/10 bg-gradient-to-b from-black via-zinc-950 to-black">
            <div className="mx-auto max-w-6xl px-6 md:px-10">
              <h3 className="text-xl md:text-2xl font-semibold">Why FlareForge?</h3>
              <p className="mt-3 text-white/70 max-w-3xl">
                A production-ready, immersive studio that turns natural language into full-stack apps with real-time
                visualization. Built for speed, collaboration, and creative flow.
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card title="3D-First UI" text="A holographic canvas powered by Spline and Three.js — interact with your build in real time." />
                <Card title="Local-First + Cloud" text="Work offline with graceful sync. Keep your flow, wherever you are." />
                <Card title="No Lock-In" text="Export clean, editable codebases any time. Your code, your rules." />
              </div>
            </div>
          </section>
          <Footer />
        </main>
      </div>
    </div>
  );
}

function Card({ title, text }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <h4 className="font-medium">{title}</h4>
      <p className="mt-2 text-sm text-white/70 leading-relaxed">{text}</p>
    </div>
  );
}
