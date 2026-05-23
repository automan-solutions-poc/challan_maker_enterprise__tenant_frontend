import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import {
  ArrowLeft,
  Download,
  FileText,
  User,
  Phone,
  Mail,
  Cpu,
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Hash
} from 'lucide-react';
import { generatePDF } from '../../utils/pdfGenerator';

const ChallanDetails: React.FC = () => {
  const { challan_no } = useParams<{ challan_no: string }>();
  const navigate = useNavigate();
  const [challan, setChallan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChallan = async () => {
      try {
        const { data } = await api.get('/tenant/challans');
        const found = data.find((c: any) => c.challan_no === challan_no);
        if (found) {
          setChallan(found);
        } else {
          setError('Challan not found');
        }
      } catch (err) {
        console.error('Error fetching challan details:', err);
        setError('Failed to load challan details');
      } finally {
        setLoading(false);
      }
    };

    fetchChallan();
  }, [challan_no]);

  if (loading) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-zinc-500">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading challan details...</span>
        </div>
      </div>
    );
  }

  if (error || !challan) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Challans
        </button>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">{error || 'Challan Not Found'}</h2>
          <p className="text-zinc-500 mb-6">The challan you are looking for does not exist or has been removed.</p>
          <Link to="/challans" className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-xl transition-colors">
            Go to Challans
          </Link>
        </div>
      </div>
    );
  }

  const accessories = typeof challan.accessories === 'string' ? JSON.parse(challan.accessories) : (challan.accessories || []);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-zinc-900 rounded-xl text-zinc-400 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Challan Details</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                challan.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                challan.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                challan.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                'bg-zinc-800 text-zinc-500'
              }`}>
                {challan.status}
              </span>
            </div>
            <p className="text-zinc-500 flex items-center gap-2 mt-1">
              <Hash size={14} />
              <span className="font-mono">{challan.challan_no}</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => generatePDF(challan)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium transition-all shadow-lg shadow-blue-600/20"
        >
          <Download size={18} />
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <User size={14} />
              Customer Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Customer Name</label>
                <p className="text-white font-medium">{challan.customer_name}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 text-zinc-500">Contact Number</label>
                <div className="flex items-center gap-2 text-white">
                  <Phone size={14} className="text-zinc-600" />
                  <p>{challan.contact_number}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 text-zinc-500">Email Address</label>
                <div className="flex items-center gap-2 text-white">
                  <Mail size={14} className="text-zinc-600" />
                  <p className="break-all">{challan.email}</p>
                </div>
              </div>

              {challan.city && (
                <div>
                  <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 text-zinc-500">City</label>
                  <p className="text-white">{challan.city}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
             <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={14} />
              Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Challan Created</p>
                  <p className="text-xs text-zinc-500">{new Date(challan.created_at).toLocaleString()}</p>
                </div>
              </div>
              {challan.status === 'delivered' && (
                <div className="flex gap-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Marked as Delivered</p>
                    <p className="text-xs text-zinc-500">Device returned to customer</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Device & Problem Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Cpu size={14} />
              Device Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 text-zinc-500">Serial / Model Number</label>
                <p className="text-white font-mono bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg inline-block">
                  {challan.serial_number}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 text-zinc-500">Warranty Status</label>
                <p className="text-white">{challan.warranty || 'None'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 text-zinc-500">Dispatch Method</label>
                <p className="text-white">{challan.dispatch_through || 'Self Pickup'}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 text-zinc-500">Problem Description</label>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-300 whitespace-pre-wrap">
                {challan.problem}
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <CheckSquare size={14} />
              Accessories Received
            </h3>

            <div className="flex flex-wrap gap-2">
              {accessories.length > 0 ? (
                accessories.map((acc: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-400">
                    {acc}
                  </span>
                ))
              ) : (
                <p className="text-sm text-zinc-500 italic">No accessories listed</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallanDetails;
