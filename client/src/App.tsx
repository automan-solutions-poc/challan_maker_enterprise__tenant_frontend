import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import { Menu, FileText } from 'lucide-react';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminTenants from './pages/admin/Tenants';

// Tenant Pages
import TenantLogin from './pages/tenant/Login';
import TenantDashboard from './pages/tenant/Dashboard';
import CreateChallan from './pages/tenant/CreateChallan';
import TenantChallans from './pages/tenant/Challans';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!role) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-zinc-950 overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-h-screen max-w-full">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <FileText className="text-blue-500" size={20} />
            <span className="font-bold text-white text-lg">infiChallan</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-zinc-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto max-h-[calc(100vh-65px)] lg:max-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

import TenantSettings from './pages/tenant/Settings';
import TermsConditions from './pages/tenant/TermsConditions';
import EmailSettings from './pages/tenant/EmailSettings';
import LandingPage from './pages/LandingPage';
import ComingSoon from './pages/CominSoon';
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/coming-soon" element={< ComingSoon/>} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<TenantLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/tenants" element={<AdminTenants />} />
            <Route path="/admin/subscriptions" element={<div className="p-8 text-zinc-500">Subscription Management coming soon...</div>} />
            <Route path="/admin/logs" element={<div className="p-8 text-zinc-500">Activity Logs coming soon...</div>} />
          </Route>

          {/* Tenant Routes */}
          <Route element={<ProtectedRoute allowedRole="tenant" />}>
            <Route path="/dashboard" element={<TenantDashboard />} />
            <Route path="/challans" element={<TenantChallans />} />
            <Route path="/challans/new" element={<CreateChallan />} />
            <Route path="/users" element={<div className="p-8 text-zinc-500">Staff Management coming soon...</div>} />
            <Route path="/settings" element={<TenantSettings />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/email-settings" element={<EmailSettings />} />
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}