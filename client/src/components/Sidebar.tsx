import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Store,
  CreditCard,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { role, logout } = useAuth();
  const location = useLocation();

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/tenants', icon: Store, label: 'Tenants' },
    { to: '/admin/subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { to: '/admin/logs', icon: Activity, label: 'Activity Logs' },
  ];

  const tenantLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/challans', icon: FileText, label: 'Challans' },
    { to: '/users', icon: Users, label: 'Staff' },
    { to: '/terms', icon: FileText, label: 'Terms' },
    { to: '/email-settings', icon: Settings, label: 'Email Setup' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const links = role === 'admin' ? adminLinks : tenantLinks;

  return (
    <div className="w-64 bg-zinc-950 text-zinc-400 h-full flex flex-col border-r border-zinc-800">
      <div className="p-6 border-bottom border-zinc-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="text-blue-500" />
          infiChallan
        </h1>
        <p className="text-xs mt-1 text-zinc-500 uppercase tracking-widest font-semibold">Enterprise Edition</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === link.to 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                : 'hover:bg-zinc-900 hover:text-white'
            }`}
          >
            <link.icon size={18} />
            <span className="text-sm font-medium">{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
