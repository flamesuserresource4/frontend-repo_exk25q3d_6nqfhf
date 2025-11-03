import React, { useMemo, useRef, useState } from 'react';
import { Terminal, Code, MessageSquare } from 'lucide-react';

function Tabs({ mode, setMode }) {
  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'ide', label: 'IDE', icon: Code },
    { id: 'console', label: 'Console', icon: Terminal },
  ];
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 p-1">
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = mode === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setMode(t.id)}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
              active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
            }`}
          >
            <Icon className="h-4 w-4" />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function ChatPane() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Welcome to FlareOS — your immersive AI workspace.' },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { role: 'user', text: input.trim() }]);
    setInput('');
  };

  return (
    <div className="flex h-80 flex-col overflow-hidden rounded-lg border border-white/10 bg-black/40">
      <div className="flex-1 space-y-2 overflow-auto p-3">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.role === 'user' ? 'ml-auto bg-emerald-500/20 text-emerald-100' : 'bg-white/10 text-white/90'}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 p-2">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Message your agent..."
            className="flex-1 rounded-md border border-white/10 bg-black/60 px-3 py-2 text-sm outline-none ring-emerald-400/40 placeholder:text-white/40 focus:ring-2"
          />
          <button onClick={send} className="rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-black hover:bg-emerald-400">Send</button>
        </div>
      </div>
    </div>
  );
}

function IDEPane() {
  const [code, setCode] = useState(`// FlareOS: Quick start\nfunction greet(name) {\n  return ` + "`Hello, ${name}!`" + `;\n}\n\nconsole.log(greet('World'));`);

  return (
    <div className="flex h-80 flex-col overflow-hidden rounded-lg border border-white/10 bg-black/50">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-xs text-white/60">
        <div>main.js — JavaScript</div>
        <div className="rounded bg-white/5 px-2 py-1">Monaco-like editor</div>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        className="h-full w-full flex-1 resize-none bg-transparent p-3 font-mono text-xs text-white/90 outline-none"
      />
    </div>
  );
}

function ConsolePane() {
  const [lines, setLines] = useState(["fl4re@workspace:~$ echo 'Welcome to FlareOS'", 'Welcome to FlareOS']);
  const [cmd, setCmd] = useState('');

  const run = () => {
    const input = `fl4re@workspace:~$ ${cmd}`;
    let output = '';
    try {
      if (cmd.startsWith('echo ')) {
        output = cmd.slice(5);
      } else if (cmd === 'help') {
        output = 'Available: help, echo <text>, date';
      } else if (cmd === 'date') {
        output = new Date().toString();
      } else if (!cmd.trim()) {
        output = '';
      } else {
        output = 'Command not found in demo shell';
      }
    } catch (e) {
      output = String(e);
    }
    setLines((l) => [...l, input, output].filter(Boolean));
    setCmd('');
  };

  return (
    <div className="flex h-80 flex-col overflow-hidden rounded-lg border border-white/10 bg-black/70">
      <div className="flex-1 overflow-auto p-3 font-mono text-xs text-emerald-200">
        {lines.map((ln, i) => (
          <div key={i} className="whitespace-pre-wrap">{ln}</div>
        ))}
      </div>
      <div className="border-t border-white/10 p-2">
        <div className="flex items-center gap-2">
          <span className="select-none font-mono text-xs text-emerald-300">$</span>
          <input
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && run()}
            placeholder="Type a command (help, echo, date)"
            className="flex-1 rounded-md border border-white/10 bg-black/60 px-3 py-2 text-sm outline-none ring-emerald-400/40 placeholder:text-white/40 focus:ring-2"
          />
          <button onClick={run} className="rounded-md bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15">Run</button>
        </div>
      </div>
    </div>
  );
}

export default function ModeWorkbench() {
  const [mode, setMode] = useState('chat');

  const Pane = useMemo(() => {
    if (mode === 'ide') return IDEPane;
    if (mode === 'console') return ConsolePane;
    return ChatPane;
  }, [mode]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/90 backdrop-blur md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Workspace</h3>
        <Tabs mode={mode} setMode={setMode} />
      </div>
      <Pane />
    </div>
  );
}
