import React, { useMemo, useState } from 'react';
import { Database, Settings, FileCode, Monitor } from 'lucide-react';

function Tabs({ tab, setTab }) {
  const tabs = [
    { id: 'db', label: 'Database', icon: Database },
    { id: 'editor', label: 'Code', icon: FileCode },
    { id: 'config', label: 'Config', icon: Settings },
    { id: 'preview', label: 'Preview', icon: Monitor },
  ];
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 p-1">
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
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

function DatabasePane() {
  const [schemas, setSchemas] = useState([
    { name: 'users', fields: [
      { name: 'id', type: 'uuid' },
      { name: 'email', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'createdAt', type: 'datetime' },
    ]},
    { name: 'projects', fields: [
      { name: 'id', type: 'uuid' },
      { name: 'ownerId', type: 'uuid' },
      { name: 'name', type: 'string' },
      { name: 'updatedAt', type: 'datetime' },
    ]},
  ]);

  const [newField, setNewField] = useState({ table: 'users', name: '', type: 'string' });

  const addField = () => {
    if (!newField.name) return;
    setSchemas((sc) => sc.map((s) => s.name === newField.table ? { ...s, fields: [...s.fields, { name: newField.name, type: newField.type }] } : s));
    setNewField({ ...newField, name: '' });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {schemas.map((s) => (
          <div key={s.name} className="rounded-lg border border-white/10 bg-black/40 p-4">
            <div className="mb-2 font-medium">{s.name}</div>
            <div className="space-y-1 text-sm text-white/70">
              {s.fields.map((f, i) => (
                <div key={i} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-1">
                  <span>{f.name}</span>
                  <span className="text-white/50">{f.type}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-white/10 bg-black/40 p-4">
        <div className="mb-2 text-sm text-white/70">Add field</div>
        <div className="grid gap-2 md:grid-cols-4">
          <select
            value={newField.table}
            onChange={(e) => setNewField({ ...newField, table: e.target.value })}
            className="rounded-md border border-white/10 bg-black/60 px-3 py-2 text-sm"
          >
            {schemas.map((s) => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
          </select>
          <input
            placeholder="field name"
            value={newField.name}
            onChange={(e) => setNewField({ ...newField, name: e.target.value })}
            className="rounded-md border border-white/10 bg-black/60 px-3 py-2 text-sm"
          />
          <select
            value={newField.type}
            onChange={(e) => setNewField({ ...newField, type: e.target.value })}
            className="rounded-md border border-white/10 bg-black/60 px-3 py-2 text-sm"
          >
            <option value="string">string</option>
            <option value="number">number</option>
            <option value="boolean">boolean</option>
            <option value="uuid">uuid</option>
            <option value="datetime">datetime</option>
            <option value="json">json</option>
          </select>
          <button onClick={addField} className="rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-black hover:bg-emerald-400">Add</button>
        </div>
      </div>
    </div>
  );
}

function EditorPane() {
  const [code, setCode] = useState(`// index.js\nexport default function handler(req, res) {\n  res.status(200).json({ ok: true });\n}`);
  return (
    <div className="flex h-96 flex-col overflow-hidden rounded-lg border border-white/10 bg-black/50">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-xs text-white/60">
        <div>pages/api/index.js</div>
        <div className="rounded bg-white/5 px-2 py-1">Editor</div>
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

function ConfigPane() {
  const [cfg, setCfg] = useState({ name: 'My Flare App', framework: 'Next.js', previewPort: 3000 });
  const [envs, setEnvs] = useState([{ key: 'OPENAI_API_KEY', value: '' }]);

  const addEnv = () => setEnvs((e) => [...e, { key: '', value: '' }]);
  const updateEnv = (i, field, val) => setEnvs((arr) => arr.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  const removeEnv = (i) => setEnvs((arr) => arr.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="text-xs text-white/60">Project name</label>
          <input
            value={cfg.name}
            onChange={(e) => setCfg({ ...cfg, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-white/60">Framework</label>
          <select
            value={cfg.framework}
            onChange={(e) => setCfg({ ...cfg, framework: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
          >
            <option>Next.js</option>
            <option>Vite + React</option>
            <option>Expo (React Native)</option>
            <option>FastAPI + React</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-white/60">Preview port</label>
          <input
            type="number"
            value={cfg.previewPort}
            onChange={(e) => setCfg({ ...cfg, previewPort: Number(e.target.value) })}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <div>
        <div className="mb-2 text-sm text-white/70">Environment variables</div>
        <div className="space-y-2">
          {envs.map((e, i) => (
            <div key={i} className="grid items-center gap-2 md:grid-cols-12">
              <input
                value={e.key}
                onChange={(ev) => updateEnv(i, 'key', ev.target.value)}
                placeholder="KEY"
                className="md:col-span-3 rounded-md border border-white/10 bg-black/60 px-3 py-2 text-sm"
              />
              <input
                value={e.value}
                onChange={(ev) => updateEnv(i, 'value', ev.target.value)}
                placeholder="value"
                className="md:col-span-8 rounded-md border border-white/10 bg-black/60 px-3 py-2 text-sm"
              />
              <button onClick={() => removeEnv(i)} className="md:col-span-1 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 hover:bg-red-500/20">Remove</button>
            </div>
          ))}
          <button onClick={addEnv} className="rounded-md bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15">Add variable</button>
        </div>
      </div>
    </div>
  );
}

function PreviewPane() {
  const [html, setHtml] = useState(`<!doctype html>\n<html>\n<head>\n<meta charset='utf-8'/>\n<meta name='viewport' content='width=device-width, initial-scale=1'/>\n<title>Preview</title>\n<style>body{font-family: ui-sans-serif, system-ui; background:#0b0b0d; color:#fff; padding:24px} .card{border:1px solid #333; background:rgba(255,255,255,.03); border-radius:12px; padding:16px}</style>\n</head>\n<body>\n<h1>FlareOS Preview</h1>\n<p>This is a sandboxed preview. Connect build pipeline to render real apps.</p>\n<div class='card'>Hello from FlareOS 🔥</div>\n</body>\n</html>`);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-white/10 bg-black/50">
        <div className="border-b border-white/10 px-3 py-2 text-xs text-white/60">index.html</div>
        <textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          spellCheck={false}
          className="h-64 w-full resize-none bg-transparent p-3 font-mono text-xs text-white/90 outline-none"
        />
      </div>
      <div className="rounded-lg border border-white/10 bg-black/50">
        <div className="border-b border-white/10 px-3 py-2 text-xs text-white/60">Live preview</div>
        <iframe title="preview" srcDoc={html} className="h-64 w-full"></iframe>
      </div>
    </div>
  );
}

export default function WorkspacePanel() {
  const [tab, setTab] = useState('db');
  const Pane = useMemo(() => {
    if (tab === 'editor') return EditorPane;
    if (tab === 'config') return ConfigPane;
    if (tab === 'preview') return PreviewPane;
    return DatabasePane;
  }, [tab]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/90 backdrop-blur md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Project Workspace</h3>
        <Tabs tab={tab} setTab={setTab} />
      </div>
      <Pane />
    </div>
  );
}
