import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

export function SettingsPage() {
  const [profile, setProfile] = useState(null);
  const [apiKeys, setApiKeys] = useState(null);
  const [webhook, setWebhook] = useState('');
  const [exportData, setExportData] = useState(null);
  const load = () => { api.get('/settings/profile').then((r)=>setProfile(r.data)); api.get('/settings/api-keys').then((r)=>setApiKeys(r.data)); api.get('/settings/webhooks').then((r)=>setWebhook(r.data?.webhook_url || '')); };
  useEffect(() => { load(); }, []);
  if (!profile || !apiKeys) return <p>Loading settings...</p>;
  async function saveProfile(e) { e.preventDefault(); await api.put('/settings/profile', { name: profile.name }); load(); }
  async function rotateKey() { await api.post('/settings/api-keys/rotate'); load(); }
  async function saveWebhook(e) { e.preventDefault(); await api.put('/settings/webhooks', { webhook_url: webhook }); load(); }
  async function runExport() { const { data } = await api.get('/settings/export'); setExportData(data); }
  return <div><h2>Settings</h2><form className="card" onSubmit={saveProfile}><h3>Profile</h3><input value={profile.name} onChange={(e)=>setProfile({ ...profile, name:e.target.value })} /><button className="btn" type="submit">Save Profile</button></form><div className="card"><h3>API Key</h3><p><code>{apiKeys.api_key}</code></p><button className="btn" type="button" onClick={rotateKey}>Rotate</button></div><form className="card" onSubmit={saveWebhook}><h3>Webhook</h3><input value={webhook} onChange={(e)=>setWebhook(e.target.value)} placeholder="https://example.com/webhook" /><button className="btn" type="submit">Save Webhook</button></form><div className="card"><h3>Data Export</h3><button className="btn" type="button" onClick={runExport}>Export JSON</button>{exportData ? <pre>{JSON.stringify(exportData, null, 2)}</pre> : null}</div></div>;
}
