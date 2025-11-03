import React from 'react';
import Spline from '@splinetool/react-spline';
import { Rocket, Github } from 'lucide-react';

export default function Hero3D() {
  return (
    <section className="relative w-full h-[70vh] md:h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Subtle gradient overlays for depth without blocking interaction */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-violet-400" />
            Live 3D • Cyberpunk Vibes
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
            FlareForge AI Studio
          </h1>
          <p className="mt-4 max-w-2xl text-white/70 md:text-lg">
            Describe. Animate. Collaborate. Forge. Build full-stack apps in an immersive 3D workspace with parallel AI agents.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#features"
              className="group inline-flex items-center gap-2 rounded-lg bg-white text-black px-5 py-3 font-medium transition hover:bg-white/90"
            >
              <Rocket className="h-4 w-4 transition group-hover:translate-x-0.5" />
              Explore Features
            </a>
            <a
              href="https://github.com/" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-3 font-medium text-white/90 backdrop-blur transition hover:bg-white/10"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
