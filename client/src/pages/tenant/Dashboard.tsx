import React, { useState, useEffect } from 'react';
import api from '../../api';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Search,
  Filter
} from 'lucide-react';

const TenantDashboard: React.FC = () => {
  const [challans, setChallans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tenant/challans').then(({ data }) => {
      setChallans(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-4 md:p-8 text-zinc-500">Loading dashboard...</div>;

  const stats = [
    { label: 'Pending', value: challans.filter(c => c.status === 'pending').length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'In Progress', value: challans.filter(c => c.status === 'repairing').length, icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Completed', value: challans.filter(c => c.status === 'completed').length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Delivered', value: challans.filter(c => c.status === 'delivered').length, icon: FileText, color: 'text-zinc-400', bg: 'bg-zinc-400/10' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Store Dashboard</h1>
          <p className="text-zinc-500">Manage your repair service operations</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-xl border border-zinc-800 flex items-center gap-2 text-sm font-medium transition-colors">
            <Filter size={16} />
            Filter
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors">
            <Plus size={16} />
            New Challan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Recent Service Challans</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950 text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Challan No</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Device / Serial</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {challans.slice(0, 5).map((challan) => (
                <tr key={challan.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-blue-400 font-medium">{challan.challan_no}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-white">{challan.customer_name}</p>
                      <p className="text-xs text-zinc-500">{challan.contact_number}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <p className="text-sm text-zinc-300">{challan.problem}</p>
                      <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter">{challan.serial_number}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      challan.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                      challan.status === 'repairing' ? 'bg-blue-500/10 text-blue-400' :
                      challan.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-zinc-800 text-zinc-500'
                    }`}>
                      {challan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-500">
                    {new Date(challan.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {challans.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 italic">
                    No challans found. Create your first one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
