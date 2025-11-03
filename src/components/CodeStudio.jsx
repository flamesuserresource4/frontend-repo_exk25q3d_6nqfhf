import React, { useEffect, useMemo, useState } from 'react';
import { Monitor, SplitSquareHorizontal, Save } from 'lucide-react';

const CODE_KEY = 'flareos_code';

const defaultCode = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FlareOS Live Preview</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif; padding: 20px; }
      .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
      button { background: black; color: white; padding: 8px 12px; border-radius: 8px; border: none; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Welcome to FlareOS Live Preview</h1>
      <p>Edit the code on the left to see changes in real-time.</p>
      <button onclick="alert('Hello from the preview!')">Click me</button>
    </div>
  </body>
</html>`;

export default function CodeStudio() {
  const [code, setCode] = useState(() => localStorage.getItem(CODE_KEY) || defaultCode);
  const [split, setSplit] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem(CODE_KEY, code);
    }, 150);
    return () => clearTimeout(id);
  }, [code]);

  const srcDoc = useMemo(() => code, [code]);

  return (
    <div className="h-full grid grid-rows-[auto_1fr] bg-black/20 rounded-xl ring-1 ring-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <SplitSquareHorizontal size={16} />
          Live Code Studio
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => localStorage.setItem(CODE_KEY, code)} className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15">
            <Save size={14} /> Save
          </button>
          <button onClick={() => setSplit(s => !s)} className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15">
            <Monitor size={14} /> {split ? 'Editor Only' : 'Split View'}
          </button>
        </div>
      </div>

      <div className={`grid ${split ? 'md:grid-cols-2' : 'grid-cols-1'} h-full`}>
        <div className="border-r border-white/10 min-h-[60vh]">
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            className="w-full h-full bg-transparent outline-none p-4 text-sm leading-6 font-mono text-white/90"
            spellCheck={false}
          />
        </div>
        <div className="min-h-[60vh] bg-white">
          <iframe title="preview" srcDoc={srcDoc} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
