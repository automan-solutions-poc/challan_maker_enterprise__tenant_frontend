// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TenantDashboard from "./pages/TenantDashboard";
import ChallansPage from "./pages/ChallansPage";
import ChallanForm from "./pages/ChallanForm";
import SettingsPage from "./pages/SettingsPage";
import UsersPage from "./pages/UsersPage";
import TenantLayout from "./components/TenantLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import EmailSettingsPage from "./pages/EmailSettingsPage";
import TermsConditionsPage from "./pages/TermsConditionsPage";
import LandingPage from "./pages/LandingPage";
import ComingSoon from "./pages/ComingSoon";
import SignupPage from "./pages/SignupPage";
import AcceptInvitePage from "./pages/AcceptInvitePage";
import PendingApprovalPage from "./pages/PendingApprovalPage";
import TrackChallanPage from "./pages/TrackChallanPage";
import NotFoundPage from "./pages/NotFoundPage";
import { isTokenExpired } from "./utils/tokenUtils";
import { isTenantPendingApproval } from "./utils/tenantStatus";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/coming-soon" element={<ComingSoon />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/accept-invite" element={<AcceptInvitePage />} />
      <Route path="/track/:challan_no" element={<TrackChallanPage />} />
      <Route
        path="/pending-approval"
        element={
          (() => {
            const token = localStorage.getItem("tenant_token");
            if (!token || isTokenExpired(token)) {
              return <Navigate to="/login" replace />;
            }
            if (!isTenantPendingApproval()) {
              return <Navigate to="/app/dashboard" replace />;
            }
            return <PendingApprovalPage />;
          })()
        }
      />
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
          path="users"
          element={
            <ProtectedRoute allowedRoles={["tenant_admin"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
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
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
