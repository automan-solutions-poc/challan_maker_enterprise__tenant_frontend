import React, { useState, useEffect } from 'react';
import api from '../../api';
import { 
  Store, 
  Users, 
  FileText, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-4 md:p-8 text-zinc-500">Loading stats...</div>;

  const cards = [
    { label: 'Total Tenants', value: stats.totalTenants, icon: Store, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active Subscriptions', value: stats.activeSubs, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Total Challans', value: stats.totalChallans, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Total Revenue', value: `$${stats.revenue}`, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
        <p className="text-zinc-500">Real-time performance metrics for Challan Maker Enterprise</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon size={24} />
              </div>
              <span className="text-emerald-500 text-xs font-medium flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} />
                +12%
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-zinc-500 text-sm font-medium">{card.label}</p>
              <h3 className="text-3xl font-bold text-white">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Recent Tenants</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">
                    T{i}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Repair Shop {i + 1}</p>
                    <p className="text-xs text-zinc-500">shop{i+1}@example.com</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                  Pro Plan
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">System Health</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Database Load</span>
                <span className="text-white">24%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[24%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Storage Usage</span>
                <span className="text-white">68%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[68%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
