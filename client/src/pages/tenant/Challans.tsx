import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { 
  FileText, 
  Search, 
  Plus, 
  MoreVertical, 
  Download, 
  Printer,
  Trash2,
  ExternalLink,
  Filter,
  KeyRound,
  X,
  AlertCircle
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

const TenantChallans: React.FC = () => {
  const [challans, setChallans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [otpModal, setOtpModal] = useState<{ open: boolean, challan_no: string, otp: string }>({ open: false, challan_no: '', otp: '' });
  const [filters, setFilters] = useState({ fromDate: '', toDate: '', status: 'all' });
  const [selectedSet, setSelectedSet] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchChallans();
  }, []);

  const fetchChallans = async () => {
    try {
      const { data } = await api.get('/tenant/challans');
      setChallans(data);
    } catch (err) {
      console.error("fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (challan_no: string) => {
    try {
      const { data } = await api.post(`/tenant/challan/${challan_no}/send_otp`);
      setOtpModal({ open: true, challan_no, otp: '' });
      alert(data.message || 'OTP sent to customer');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await api.post(`/tenant/challan/${otpModal.challan_no}/verify_otp`, { otp: otpModal.otp });
      setOtpModal({ open: false, challan_no: '', otp: '' });
      fetchChallans();
      setMsg('✅ Challan delivered successfully!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Verification failed');
    }
  };

  const generatePDF = async (challan: any) => {
    const doc = new jsPDF();
    const qrData = await QRCode.toDataURL(`CHALLAN:${challan.challan_no}|SN:${challan.serial_number}`);
    
    // Header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('SERVICE CHALLAN', 20, 25);
    
    doc.setFontSize(10);
    doc.text(`No: ${challan.challan_no}`, 160, 20);
    doc.text(`Date: ${new Date(challan.date || challan.created_at).toLocaleDateString()}`, 160, 26);

    // Customer Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER DETAILS', 20, 55);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Name: ${challan.customer_name}`, 20, 65);
    doc.text(`Phone: ${challan.contact_number}`, 20, 71);
    doc.text(`Email: ${challan.email}`, 20, 77);

    // Device Info
    doc.setFont('helvetica', 'bold');
    doc.text('DEVICE DETAILS', 110, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(`Serial/Model: ${challan.serial_number}`, 110, 65);
    doc.text(`Status: ${challan.status.toUpperCase()}`, 110, 71);

    // Problem Table
    let accessories = [];
    try {
      accessories = typeof challan.accessories === 'string' ? JSON.parse(challan.accessories) : (challan.accessories || []);
    } catch(e) { accessories = []; }

    autoTable(doc, {
      startY: 90,
      head: [['Description of Problem', 'Accessories Received']],
      body: [[challan.problem, (Array.isArray(accessories) ? accessories : []).join(', ')]],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });

    // QR Code
    doc.addImage(qrData, 'PNG', 160, 250, 30, 30);
    doc.setFontSize(8);
    doc.text('Scan to track status', 160, 285);

    // Footer
    doc.setFontSize(10);
    doc.text('Terms & Conditions:', 20, 250);
    doc.setFontSize(8);
    doc.text('1. Not responsible for data loss.', 20, 256);
    doc.text('2. Items not collected within 30 days will be disposed.', 20, 261);

    if (challan.status === 'delivered') {
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(60);
      doc.text('DELIVERED', 50, 150, { angle: 45 });
    }

    doc.save(`Challan_${challan.challan_no}.pdf`);
  };

  const updateStatus = async (challan: any, status: string) => {
    if (status === 'delivered') {
      handleSendOTP(challan.challan_no);
      return;
    }
    try {
      await api.patch(`/tenant/challans/${challan.id}`, { status });
      fetchChallans();
    } catch (err) {
      console.error("status update failed", err);
    }
  };

  const toggleRowSelect = (challan_no: string) => {
    const s = new Set(selectedSet);
    if (s.has(challan_no)) s.delete(challan_no);
    else s.add(challan_no);
    setSelectedSet(s);
  };

  const toggleSelectAll = () => {
    if (selectedSet.size === filtered.length && filtered.length > 0) {
      setSelectedSet(new Set());
    } else {
      setSelectedSet(new Set(filtered.map(c => c.challan_no)));
    }
  };

  const handleDelete = async (challan: any) => {
    if (!window.confirm(`Delete challan ${challan.challan_no}?`)) return;
    setProcessing(true);
    setMsg('');
    try {
      await api.delete(`/tenant/challan/${challan.challan_no}`);
      setMsg('🗑️ Challan deleted successfully');
      fetchChallans();
    } catch (err) {
      console.error(err);
      setMsg('❌ Failed to delete challan');
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    setProcessing(true);
    setConfirmBulkDelete(false);
    setMsg('');
    const items = Array.from(selectedSet);
    try {
      const results = await Promise.allSettled(
        items.map(no => api.delete(`/tenant/challan/${no}`))
      );

      const failed = results.reduce((acc: string[], r, idx) => {
        if (r.status === 'rejected') {
          acc.push(items[idx]);
        }
        return acc;
      }, []);

      if (failed.length === 0) {
        setMsg(`✅ Deleted ${items.length} challan(s) successfully.`);
      } else {
        setMsg(`⚠️ Deleted ${items.length - failed.length} challan(s). Failed: ${failed.join(", ")}`);
      }

      setSelectedSet(new Set());
      fetchChallans();
    } catch (err) {
      console.error("bulk delete error", err);
      setMsg('❌ Bulk delete failed.');
    } finally {
      setProcessing(false);
    }
  };

  const filtered = challans.filter(c => {
    const matchesSearch = c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
                          c.challan_no.toLowerCase().includes(search.toLowerCase());

    const challanDate = new Date(c.date || c.created_at);
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;
    if (toDate) toDate.setHours(23, 59, 59, 999);

    const matchesDate = (!fromDate || challanDate >= fromDate) &&
                        (!toDate || challanDate <= toDate);

    const matchesStatus = filters.status === 'all' || c.status === filters.status;

    return matchesSearch && matchesDate && matchesStatus;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 relative">
      {msg && (
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          msg.startsWith('✅') || msg.startsWith('🗑️') || msg.startsWith('⚠️')
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <div className="flex items-center gap-3">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{msg}</span>
          </div>
          <button onClick={() => setMsg('')} className="hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
      )}

      {processing && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-2xl">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-3 shadow-2xl">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-white font-medium">Processing...</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Service Challans</h1>
          <p className="text-zinc-500">View and manage all repair requests</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedSet.size > 0 && (
            <button
              onClick={() => setConfirmBulkDelete(true)}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors border border-red-500/20"
            >
              <Trash2 size={18} />
              Delete Selected ({selectedSet.size})
            </button>
          )}
          <Link
            to="/challans/new"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus size={18} />
            Create New
          </Link>
        </div>
      </div>

      {/* Filter Card */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">From Date</label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">To Date</label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={() => setFilters({ fromDate: '', toDate: '', status: 'all' })}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-xl text-sm font-medium transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input 
              type="text" 
              placeholder="Search by customer or ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950 text-zinc-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedSet.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 font-semibold">Challan No</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Created At</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filtered.map((challan) => (
                <tr key={challan.id} className={`hover:bg-zinc-800/30 transition-colors group ${selectedSet.has(challan.challan_no) ? 'bg-blue-500/5' : ''}`}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedSet.has(challan.challan_no)}
                      onChange={() => toggleRowSelect(challan.challan_no)}
                      className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => generatePDF(challan)}
                      className="text-sm font-mono text-blue-400 font-medium hover:underline cursor-pointer transition-all"
                    >
                      {challan.challan_no}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">{challan.customer_name}</p>
                      <p className="text-xs text-zinc-500">{challan.contact_number}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={challan.status}
                      onChange={(e) => updateStatus(challan, e.target.value)}
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-zinc-950 border border-zinc-800 focus:outline-none ${
                        challan.status === 'delivered' ? 'text-emerald-400 border-emerald-500/20' :
                        challan.status === 'pending' ? 'text-amber-400 border-amber-500/20' :
                        challan.status === 'cancelled' ? 'text-red-400 border-red-500/20' :
                        'text-zinc-500'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {new Date(challan.date || challan.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {challan.status === 'pending' && (
                        <button 
                          onClick={() => handleSendOTP(challan.challan_no)}
                          className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-500 transition-colors"
                          title="Verify for Delivery"
                        >
                          <KeyRound size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => generatePDF(challan)}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </button>
                      <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                        <Printer size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(challan)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 italic">
                    No challans found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {otpModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Verify Delivery</h3>
              <button onClick={() => setOtpModal({ ...otpModal, open: false })} className="text-zinc-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-zinc-400">Enter the 6-digit OTP sent to the customer for challan <span className="text-blue-400 font-mono">{otpModal.challan_no}</span></p>
              <input 
                type="text"
                maxLength={6}
                value={otpModal.otp}
                onChange={(e) => setOtpModal({ ...otpModal, otp: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-center text-2xl font-bold tracking-widest text-white focus:outline-none focus:border-blue-500"
                placeholder="000000"
              />
              <button 
                onClick={handleVerifyOTP}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20"
              >
                Confirm Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmBulkDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
              <h3 className="text-xl font-bold text-white">Confirm Bulk Delete</h3>
              <button onClick={() => setConfirmBulkDelete(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                <AlertCircle size={24} className="shrink-0" />
                <p className="text-sm font-medium">
                  Are you sure you want to delete <strong>{selectedSet.size}</strong> challan(s)? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setConfirmBulkDelete(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-600/20"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantChallans;