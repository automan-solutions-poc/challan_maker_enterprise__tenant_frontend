import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Mail, 
  Bell, 
  Shield,
  Save,
  Loader2,
  FileText
} from 'lucide-react';

const TenantSettings: React.FC = () => {
  const { tenant } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/tenant/settings').then(({ data }) => {
      setData(data);
    });
  }, []);

  if (!data) return <div className="p-8 text-zinc-500">Loading settings...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Store Settings</h1>
        <p className="text-zinc-500">Configure your store branding and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold text-white mb-2">Branding</h3>
          <p className="text-sm text-zinc-500">Customize how your store appears to customers on challans and emails.</p>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Store Name</label>
              <input 
                defaultValue={data.tenant.name}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Theme Color</label>
              <div className="flex gap-3">
                {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => (
                  <button 
                    key={color}
                    className={`w-10 h-10 rounded-full border-2 ${data.tenant.theme_color === color ? 'border-white' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-zinc-800">
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold text-white mb-2">Email Configuration</h3>
          <p className="text-sm text-zinc-500">Set up your own SMTP server to send challans from your own email address.</p>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
              <div className="flex items-center gap-3">
                <Mail className="text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-white">System Default SMTP</p>
                  <p className="text-xs text-zinc-500">Currently using ChallanMaker's email server</p>
                </div>
              </div>
              <Link to="/email-settings" className="text-xs font-bold text-blue-500 uppercase tracking-wider hover:underline">Configure Custom</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-zinc-800">
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold text-white mb-2">Legal & Terms</h3>
          <p className="text-sm text-zinc-500">Manage the terms and conditions that appear on your customer receipts.</p>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-3">
                <FileText className="text-zinc-500" />
                <div>
                  <p className="text-sm font-medium text-white">Terms & Conditions</p>
                  <p className="text-xs text-zinc-500">Last updated: {new Date(data.tenant.updated_at || data.tenant.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <Link to="/terms" className="text-xs font-bold text-blue-500 uppercase tracking-wider hover:underline">Edit Terms</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
          <Save size={20} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default TenantSettings;
