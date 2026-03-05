import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

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
  if (!role) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto max-h-screen">
        {children}
      </main>
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
