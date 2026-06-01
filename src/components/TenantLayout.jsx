import React, { useState } from "react";
import { Container, Nav, Button } from "react-bootstrap";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Palette,
  Mail,
  LogOut,
  Menu,
  Sun,
  Moon,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useTheme } from "../ThemeContext";
import "./TenantLayout.css";

export default function TenantLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("tenant_user") || "null");

  const logout = () => {
    localStorage.removeItem("tenant_token");
    localStorage.removeItem("tenant_user");
    localStorage.removeItem("tenant_info");
    navigate("/login");
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="tenant-layout">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`tenant-sidebar ${isSidebarOpen ? "is-open" : ""} ${isSidebarCollapsed ? "is-collapsed" : ""}`}
      >
        <div className="d-flex flex-column h-100">
          {/* Company Header */}
          <div className="tenant-header px-4 py-4 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3 overflow-hidden">
              <div className="tenant-logo d-flex align-items-center justify-content-center shadow-sm flex-shrink-0">
                <Zap size={20} fill="currentColor" />
              </div>
              <div className="overflow-hidden sidebar-text">
                <h5 className="tenant-name mb-0 fw-bold">InfiChallan</h5>
                <small className="text-muted text-uppercase tracking-wider" style={{ fontSize: '9px', fontWeight: '700' }}>Enterprise Edition</small>
              </div>
            </div>

            <Button
              variant="link"
              className="text-muted p-0 d-none d-md-flex align-items-center justify-content-center sidebar-collapse-toggle"
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </Button>
          </div>

          <Nav className="tenant-nav flex-column">
            <Nav.Link
              as={NavLink}
              to="/app/dashboard"
              className="tenant-link"
              onClick={() => setSidebarOpen(false)}
            >
              <LayoutDashboard size={18} className="sidebar-icon" /> <span className="sidebar-text">Dashboard</span>
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/app/challans"
              className="tenant-link"
              onClick={() => setSidebarOpen(false)}
            >
              <FileText size={18} className="sidebar-icon" /> <span className="sidebar-text">Challans</span>
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/app/challan/new"
              className="tenant-link"
              onClick={() => setSidebarOpen(false)}
            >
              <PlusCircle size={18} className="sidebar-icon" /> <span className="sidebar-text">New Challan</span>
            </Nav.Link>

            {/* Admin-only links */}
            {user?.role === "tenant_admin" && (
              <>
                <div className="nav-section-title mt-3 mb-1 sidebar-text">ADMINISTRATION</div>
                <Nav.Link
                  as={NavLink}
                  to="/app/settings"
                  className="tenant-link"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Palette size={18} className="sidebar-icon" /> <span className="sidebar-text">Design Settings</span>
                </Nav.Link>

                <Nav.Link
                  as={NavLink}
                  to="/app/email-settings"
                  className="tenant-link"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Mail size={18} className="sidebar-icon" /> <span className="sidebar-text">Email Settings</span>
                </Nav.Link>

                <Nav.Link
                  as={NavLink}
                  to="/app/terms"
                  className="tenant-link"
                  onClick={() => setSidebarOpen(false)}
                >
                  <FileText size={18} className="sidebar-icon" /> <span className="sidebar-text">Terms & Conditions</span>
                </Nav.Link>
              </>
            )}
          </Nav>

          <div className="tenant-footer p-3">
            <div className="mb-3 px-2">
              <div className="d-flex align-items-center gap-2 mb-3">
                 <div className="bg-primary rounded-circle flex-shrink-0" style={{ width: '8px', height: '8px' }}></div>
                 <small className="text-muted fw-semibold sidebar-text">Logged in as {user?.name || 'User'}</small>
              </div>
              <Button
                variant="link"
                className="theme-toggle-btn w-100 d-flex align-items-center justify-content-start gap-3 p-2 text-decoration-none"
                onClick={toggleTheme}
              >
                {theme === "light" ? (
                  <><Moon size={18} className="sidebar-icon" /> <span className="sidebar-text">Dark Mode</span></>
                ) : (
                  <><Sun size={18} className="sidebar-icon" /> <span className="sidebar-text">Light Mode</span></>
                )}
              </Button>
            </div>
            <Button
              variant="outline-danger"
              className="logout-btn w-100 d-flex align-items-center justify-content-center gap-2 py-2"
              onClick={logout}
              style={{ borderRadius: '12px' }}
            >
              <LogOut size={16} className="sidebar-icon" />
              <span className="sidebar-text">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`tenant-content ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Container fluid className="p-4">
          <Outlet />
        </Container>
      </main>
    </div>
  );
}
