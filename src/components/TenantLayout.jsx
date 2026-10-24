import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Palette,
  Mail,
  Users,
  ScrollText,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import API from "../api";
import ThemeToggle from "./ThemeToggle";
import SupportChatWidget from "./SupportChatWidget";
import "./TenantLayout.css";
import { resetAnalytics, trackEvent, Events } from "../analytics";
import { clearSession, getStoredTenant, getStoredUser, initialsOf } from "../utils/session";

const WORKSPACE_LINKS = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard, match: (p) => p === "/app" || p === "/app/" },
  { to: "/app/challans", label: "Challans", icon: FileText, match: (p) => /^\/app\/challan\/[^/]+\/edit/.test(p) },
  { to: "/app/challan/new", label: "New challan", icon: PlusCircle },
];

const ADMIN_LINKS = [
  { to: "/app/users", label: "Team", icon: Users },
  { to: "/app/settings", label: "Design settings", icon: Palette },
  { to: "/app/email-settings", label: "Email settings", icon: Mail },
  { to: "/app/terms", label: "Terms & conditions", icon: ScrollText },
];

const COLLAPSE_KEY = "tenant_sidebar_collapsed";

export default function TenantLayout() {
  const [isOpen, setOpen] = useState(false);
  const [isCollapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [usage, setUsage] = useState(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = getStoredUser();
  const tenant = getStoredTenant();
  const isAdmin = user?.role === "tenant_admin";

  // Refresh the quota whenever the user moves between pages (e.g. after creating a challan).
  useEffect(() => {
    let cancelled = false;
    API.get("/dashboard")
      .then((res) => {
        if (!cancelled && res.data?.usage) setUsage(res.data.usage);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const toggleCollapsed = () => {
    setCollapsed((value) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, value ? "0" : "1");
      } catch {
        /* ignore */
      }
      return !value;
    });
  };

  const logout = () => {
    trackEvent(Events.LOGOUT, { role: user?.role });
    resetAnalytics();
    clearSession();
    navigate("/login");
  };

  const hasLimit = usage && usage.limit != null && usage.limit !== -1;
  const usedPct = hasLimit ? Math.min(((usage.used || 0) / Math.max(usage.limit, 1)) * 100, 100) : 0;
  const atLimit = hasLimit && usage.used >= usage.limit;

  const renderLink = ({ to, label, icon: Icon, match }) => (
    <NavLink
      key={to}
      to={to}
      title={isCollapsed ? label : undefined}
      className={({ isActive }) => `side-link ${isActive || match?.(pathname) ? "is-active" : ""}`}
    >
      <Icon size={18} className="side-link-icon" />
      <span className="side-text">{label}</span>
    </NavLink>
  );

  return (
    <div className={`app-shell ${isCollapsed ? "is-collapsed" : ""}`}>
      <aside className={`sidebar ${isOpen ? "is-open" : ""}`} aria-label="Main navigation">
        <div className="sidebar-brand">
          <div className="brand-mark">
            <FileText size={17} />
          </div>
          <div className="side-text sidebar-brand-text">
            <div className="sidebar-brand-name">infiChallan</div>
            <div className="sidebar-brand-sub" title={tenant?.name || ""}>
              {tenant?.name || "Tenant workspace"}
            </div>
          </div>
          <button
            type="button"
            className="sidebar-icon-btn d-none d-md-inline-flex ms-auto"
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>
          <button
            type="button"
            className="sidebar-icon-btn d-md-none ms-auto"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="side-section side-text">Workspace</div>
          {WORKSPACE_LINKS.map(renderLink)}
          {isAdmin && (
            <>
              <div className="side-section side-text">Administration</div>
              {ADMIN_LINKS.map(renderLink)}
            </>
          )}
        </nav>

        <div className="sidebar-foot">
          {usage && (
            <div className="usage-card side-text">
              <div className="d-flex justify-content-between align-items-baseline mb-2">
                <span className="usage-label">PDFs this month</span>
                <span className={`usage-value tabular-nums ${atLimit ? "text-danger" : ""}`}>
                  {hasLimit ? `${usage.used ?? 0} / ${usage.limit}` : "Unlimited"}
                </span>
              </div>
              {hasLimit && (
                <div className={`meter ${atLimit ? "is-full" : ""}`}>
                  <span style={{ width: `${usedPct}%` }} />
                </div>
              )}
            </div>
          )}

          <div className="user-row">
            <div className="avatar" title={user?.name || "User"}>{initialsOf(user?.name)}</div>
            <div className="side-text user-meta">
              <div className="user-name">{user?.name || "User"}</div>
              <div className="user-role">{isAdmin ? "Admin" : "Staff"}</div>
            </div>
            <div className="user-actions">
              <ThemeToggle className="sidebar-icon-btn" />
              <button
                type="button"
                className="sidebar-icon-btn is-danger"
                onClick={logout}
                aria-label="Log out"
                title="Log out"
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && <div className="sidebar-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />}

      <div className="app-main">
        <header className="app-topbar">
          <button
            type="button"
            className="sidebar-icon-btn"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={isOpen}
          >
            <Menu size={20} />
          </button>
          <div className="d-flex align-items-center gap-2">
            <div className="brand-mark" style={{ width: 28, height: 28, borderRadius: 8 }}>
              <FileText size={14} />
            </div>
            <span className="sidebar-brand-name">infiChallan</span>
          </div>
          <ThemeToggle className="sidebar-icon-btn" />
        </header>

        <main className="app-content">
          <Outlet />
        </main>
      </div>

      {/* Read-only documentation assistant */}
      <SupportChatWidget />
    </div>
  );
}
