// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TenantDashboard from "./pages/TenantDashboard";
import ChallansPage from "./pages/ChallansPage";
import ChallanForm from "./pages/ChallanForm";
import SettingsPage from "./pages/SettingsPage";
import TenantLayout from "./compopnents/TenantLayout";
import ProtectedRoute from "./compopnents/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import EmailSettingsPage from "./pages/EmailSettingsPage";
import TermsConditionsPage from "./pages/TermsConditionsPage";

export default function App() {
  return (
    <Routes>
      {/* Redirect to login by default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ================================
          PROTECTED TENANT ROUTES
      ================================== */}
      <Route
        path="/app"
        element={
          <ProtectedRoute allowedRoles={["tenant_admin", "tenant_staff"]}>
            <TenantLayout />
          </ProtectedRoute>
        }
      >
        {/* Common routes: admin + staff */}
        <Route index element={<TenantDashboard />} />
        <Route path="dashboard" element={<TenantDashboard />} />
        <Route path="challans" element={<ChallansPage />} />
        <Route path="challan/new" element={<ChallanForm />} />
        <Route path="challan/:challan_no/edit" element={<ChallanForm editMode />} />

        {/* ================================
           ADMIN-ONLY ROUTES
        ================================== */}
        <Route
          path="settings"
          element={
            <ProtectedRoute allowedRoles={["tenant_admin"]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="email-settings"
          element={
            <ProtectedRoute allowedRoles={["tenant_admin"]}>
              <EmailSettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="terms"
          element={
            <ProtectedRoute allowedRoles={["tenant_admin"]}>
              <TermsConditionsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
