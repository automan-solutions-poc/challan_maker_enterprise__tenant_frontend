import React, { useState, useEffect } from 'react';
import { Save, Mail, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../api';

const EmailSettings: React.FC = () => {
  const [config, setConfig] = useState({
    smtp_server: '',
    smtp_port: '',
    smtp_user: '',
    smtp_pass: '',
    sender_name: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data } = await api.get('/tenant/settings');
      setConfig({
        smtp_server: data.smtp_server || '',
        smtp_port: data.smtp_port || '',
        smtp_user: data.smtp_user || '',
        smtp_pass: '', // Don't show password
        sender_name: data.sender_name || ''
      });
    } catch (err) {
      console.error('Failed to fetch email settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/tenant/settings', config);
      setMessage('Email configuration updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to update email settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-zinc-500">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Email Settings</h1>
          <p className="text-zinc-500">Configure your own SMTP server to send challans from your business email.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 flex items-center gap-3">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-4">
            <Mail size={14} />
            SMTP Server
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">SMTP Host</label>
              <input 
                value={config.smtp_server}
                onChange={(e) => setConfig({...config, smtp_server: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-blue-500 transition-all"
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">SMTP Port</label>
              <input 
                value={config.smtp_port}
                onChange={(e) => setConfig({...config, smtp_port: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-blue-500 transition-all"
                placeholder="587"
              />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-4">
            <Shield size={14} />
            Authentication
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Username / Email</label>
              <input 
                value={config.smtp_user}
                onChange={(e) => setConfig({...config, smtp_user: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-blue-500 transition-all"
                placeholder="your-email@gmail.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Password / App Password</label>
              <input 
                type="password"
                value={config.smtp_pass}
                onChange={(e) => setConfig({...config, smtp_pass: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-blue-500 transition-all"
                placeholder="••••••••••••"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-4">
            <AlertCircle size={14} />
            Sender Information
          </h3>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Display Name</label>
            <input 
              value={config.sender_name}
              onChange={(e) => setConfig({...config, sender_name: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-blue-500 transition-all"
              placeholder="Phoenix Computers Support"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;
