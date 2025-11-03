import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Save, Settings } from 'lucide-react';

const DEFAULT_AGENT = {
  name: 'Nova',
  model: 'openai:gpt-4o-mini',
  tone: 'pragmatic',
  purpose: 'Full-stack coding assistant focused on DX and reliability.',
};

export default function AgentManager() {
  const [agents, setAgents] = useState([]);
  const [draft, setDraft] = useState(DEFAULT_AGENT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('flareos_agents');
      if (raw) setAgents(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const saveAgents = (list) => {
    setAgents(list);
    localStorage.setItem('flareos_agents', JSON.stringify(list));
  };

  const addAgent = () => {
    const next = [...agents, { ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() }];
    saveAgents(next);
    setDraft(DEFAULT_AGENT);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  const cloneAgent = (id) => {
    const src = agents.find((a) => a.id === id);
    if (!src) return;
    const copy = { ...src, id: crypto.randomUUID(), name: `${src.name} Copy` };
    saveAgents([...agents, copy]);
  };

  const removeAgent = (id) => {
    saveAgents(agents.filter((a) => a.id !== id));
  };

  const count = useMemo(() => agents.length, [agents]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/90 backdrop-blur md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Settings className="h-5 w-5 text-emerald-400" />
        <h3 className="text-lg font-semibold">Agent Creator</h3>
        <span className="ml-auto text-xs text-white/60">{count} saved</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-white/60">Name</label>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none ring-emerald-400/40 placeholder:text-white/40 focus:ring-2"
              placeholder="Agent name"
            />
          </div>
          <div>
            <label className="text-xs text-white/60">Model</label>
            <input
              value={draft.model}
              onChange={(e) => setDraft({ ...draft, model: e.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none ring-emerald-400/40 placeholder:text-white/40 focus:ring-2"
              placeholder="e.g. openai:gpt-4o, gemini:1.5-pro, anthropic:sonnet"
            />
          </div>
          <div>
            <label className="text-xs text-white/60">Tone</label>
            <input
              value={draft.tone}
              onChange={(e) => setDraft({ ...draft, tone: e.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none ring-emerald-400/40 placeholder:text-white/40 focus:ring-2"
              placeholder="helpful, pragmatic, creative, expert"
            />
          </div>
          <div>
            <label className="text-xs text-white/60">Purpose</label>
            <textarea
              value={draft.purpose}
              onChange={(e) => setDraft({ ...draft, purpose: e.target.value })}
              rows={3}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none ring-emerald-400/40 placeholder:text-white/40 focus:ring-2"
              placeholder="What should this agent do?"
            />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={addAgent} className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400">
              <Plus className="h-4 w-4" />
              Create Agent
            </button>
            {saved && <span className="text-xs text-emerald-300">Saved ✓</span>}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-white/70">Saved Agents</div>
          <div className="grid gap-3">
            {agents.length === 0 && (
              <div className="rounded-lg border border-white/10 bg-black/40 p-4 text-sm text-white/60">
                No agents yet. Create your first on the left.
              </div>
            )}
            {agents.map((a) => (
              <div key={a.id} className="flex items-start justify-between rounded-lg border border-white/10 bg-black/40 p-4">
                <div>
                  <div className="font-medium">{a.name}</div>
                  <div className="text-xs text-white/60">{a.model} • {a.tone}</div>
                  <p className="mt-1 text-sm text-white/70">{a.purpose}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => cloneAgent(a.id)} className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs hover:bg-white/10">Clone</button>
                  <button onClick={() => removeAgent(a.id)} className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-200 hover:bg-red-500/20">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
