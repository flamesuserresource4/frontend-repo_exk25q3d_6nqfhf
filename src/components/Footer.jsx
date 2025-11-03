import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-white/60">© {new Date().getFullYear()} FlareForge AI Studio. All rights reserved.</p>
        <div className="flex items-center gap-4 text-sm text-white/70">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#" className="hover:text-white">Docs</a>
          <a href="#" className="hover:text-white">Changelog</a>
        </div>
      </div>
    </footer>
  );
}
