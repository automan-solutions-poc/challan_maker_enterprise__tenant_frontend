// src/compopnents/TenantLayout.jsx
import React from "react";
import { Container, Nav, Button } from "react-bootstrap";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Palette,
  Mail,
  ScrollText,
  LogOut,
} from "lucide-react";
import "./TenantLayout.css";

export default function TenantLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("tenant_user") || "null");
  const tenant = JSON.parse(localStorage.getItem("tenant_info") || "null");

  const logout = () => {
    localStorage.removeItem("tenant_token");
    localStorage.removeItem("tenant_user");
    localStorage.removeItem("tenant_info");
    navigate("/login");
  };

  return (
    <div className="tenant-layout d-flex">
      {/* Sidebar */}
      <aside className="tenant-sidebar bg-dark text-white d-flex flex-column justify-content-between">
        <div>
          {/* Company Header */}
          <div className="tenant-header text-center py-4 border-bottom border-secondary">
            <div className="tenant-logo mx-auto mb-2">
              {tenant?.name?.[0]?.toUpperCase() || user?.tenant_name?.[0] || "T"}
            </div>
            <h5 className="tenant-name mb-0">{tenant?.name || user?.tenant_name}</h5>
          </div>

         <Nav className="tenant-nav flex-column">
  <Nav.Link as={NavLink} to="/app/dashboard" className="tenant-link text-white">
    <LayoutDashboard size={18} className="me-2" /> Dashboard
  </Nav.Link>

  <Nav.Link as={NavLink} to="/app/challans" className="tenant-link text-white">
    <FileText size={18} className="me-2" /> Challans
  </Nav.Link>

  <Nav.Link as={NavLink} to="/app/challan/new" className="tenant-link text-white">
    <PlusCircle size={18} className="me-2" /> New Challan
  </Nav.Link>

  {/* Admin-only links */}
  {user?.role === "tenant_admin" && (
    <>
      <Nav.Link as={NavLink} to="/app/settings" className="tenant-link text-white">
        <Palette size={18} className="me-2" /> Design Settings
      </Nav.Link>

      <Nav.Link as={NavLink} to="/app/email-settings" className="tenant-link text-white">
        <Mail size={18} className="me-2" /> Email Settings
      </Nav.Link>

      <Nav.Link as={NavLink} to="/app/terms" className="tenant-link text-white">
        <FileText size={18} className="me-2" /> Terms & Conditions
      </Nav.Link>
    </>
  )}
</Nav>

        </div>

        {/* Footer (Logout Button) */}
        <div className="tenant-footer border-top border-secondary p-3">
          <Button
            variant="outline-light"
            className="w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={logout}
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="tenant-content flex-grow-1 bg-light">
        <Container fluid className="p-4">
          <Outlet />
        </Container>
      </main>
    </div>
  );
}
