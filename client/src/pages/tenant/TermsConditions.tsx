import React, { useState, useEffect } from 'react';
import { Save, FileText, AlertCircle } from 'lucide-react';
import api from '../../api';

const TermsConditions: React.FC = () => {
  const [terms, setTerms] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const { data } = await api.get('/tenant/settings');
      setTerms(data.terms_conditions || '');
    } catch (err) {
      console.error('Failed to fetch terms');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/tenant/settings', { terms_conditions: terms });
      setMessage('Terms & Conditions updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to update terms');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-zinc-500">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Terms & Conditions</h1>
          <p className="text-zinc-500">These will appear at the bottom of your generated Challan PDFs.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 flex items-center gap-3">
          <CheckCircle size={18} />
          {message}
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-zinc-400 mb-4 text-sm font-bold uppercase tracking-widest">
          <FileText size={14} />
          Editor
        </div>
        <textarea 
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          className="w-full h-[400px] bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-zinc-300 focus:outline-none focus:border-blue-500 transition-all font-mono text-sm leading-relaxed"
          placeholder="Enter your store's terms and conditions here..."
        />
        <div className="mt-4 flex items-start gap-3 p-4 bg-blue-600/5 border border-blue-600/10 rounded-xl">
          <AlertCircle className="text-blue-400 shrink-0" size={18} />
          <p className="text-xs text-zinc-500 leading-relaxed">
            Tip: Use clear, concise language. These terms are legally binding between you and your customer once the challan is signed.
          </p>
        </div>
      </div>
    </div>
  );
};

const CheckCircle: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

export default TermsConditions;
