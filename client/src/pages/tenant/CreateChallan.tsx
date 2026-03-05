import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { 
  User, 
  Phone, 
  Mail, 
  Cpu, 
  AlertTriangle, 
  CheckSquare,
  ArrowLeft,
  Save,
  Loader2
} from 'lucide-react';

const CreateChallan: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    contact_number: '',
    city: '',
    serial_number: '',
    problem: '',
    accessories: [] as string[],
    warranty: 'None',
    dispatch_through: 'Self Pickup',
    items: [{ description: '', quantity: 1 }]
  });

  const [images, setImages] = useState<File[]>([]);

  const accessoryOptions = ['Charger', 'Battery', 'Bag', 'Mouse', 'Keyboard', 'HDD/SSD', 'RAM'];
  const warrantyOptions = ['None', '3 Months', '6 Months', '1 Year', 'Out of Warranty'];
  const dispatchOptions = ['Self Pickup', 'Courier', 'Home Delivery'];

  const toggleAccessory = (acc: string) => {
    setFormData(prev => ({
      ...prev,
      accessories: prev.accessories.includes(acc) 
        ? prev.accessories.filter(a => a !== acc)
        : [...prev.accessories, acc]
    }));
  };

  const handleItemChange = (idx: number, key: string, value: any) => {
    const updatedItems = [...formData.items];
    updatedItems[idx][key] = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1 }]
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("data", JSON.stringify(formData));

      images.forEach((file) => {
        data.append("images", file);
      });

      await api.post('/tenant/challan', data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      navigate('/challans');

    } catch (err) {
      console.error(err);
      alert('Failed to create challan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-zinc-900 rounded-xl text-zinc-400 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">New Service Challan</h1>
          <p className="text-zinc-500">Register a new device for repair</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Customer Info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-4">
              <User size={14} />
              Customer Information
            </h3>

            <div className="space-y-4">

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Customer Name</label>
                <input 
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-white"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                  <input 
                    required
                    value={formData.contact_number}
                    onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                  <input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">City</label>
                <input 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-white"
                  placeholder="City"
                />
              </div>

            </div>
          </div>


          {/* Device Info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Cpu size={14} />
              Device Details
            </h3>

            <div className="space-y-4">

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Serial Number</label>
                <input 
                  required
                  value={formData.serial_number}
                  onChange={(e) => setFormData({...formData, serial_number: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-white"
                  placeholder="SN-123"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Warranty</label>
                <select 
                  value={formData.warranty}
                  onChange={(e) => setFormData({...formData, warranty: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-white"
                >
                  {warrantyOptions.map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Dispatch Via</label>
                <select 
                  value={formData.dispatch_through}
                  onChange={(e) => setFormData({...formData, dispatch_through: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-white"
                >
                  {dispatchOptions.map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Problem Description</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.problem}
                  onChange={(e) => setFormData({...formData, problem: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Upload Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
              </div>

            </div>
          </div>

        </div>

        {/* Accessories */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-6">
            <CheckSquare size={14} />
            Accessories Received
          </h3>

          <div className="flex flex-wrap gap-3">
            {accessoryOptions.map(acc => (
              <button
                key={acc}
                type="button"
                onClick={() => toggleAccessory(acc)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium ${
                  formData.accessories.includes(acc)
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                }`}
              >
                {acc}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-zinc-900 text-white rounded-xl"
          >
            Discard
          </button>

          <button 
            type="submit"
            disabled={loading}
            className="px-12 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
            Generate Challan
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateChallan;

