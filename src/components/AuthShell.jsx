import React from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import "../pages/LoginPage.css";

/**
 * Shared frame for sign-in, sign-up and status screens.
 * `icon` renders a tinted tile above the title; `wide` allows a roomier card.
 */
export default function AuthShell({ title, subtitle, icon, iconTone, children, footer, wide = false }) {
  return (
    <div className="auth-page">
      <div className="auth-bg" aria-hidden="true" />
      <header className="auth-topbar">
        <Link to="/" className="auth-brand">
          <span className="brand-mark">
            <FileText size={16} />
          </span>
          <span>infiChallan</span>
        </Link>
        <ThemeToggle className="auth-theme-toggle" />
      </header>

      <main className="auth-main">
        <div className={`auth-card ${wide ? "is-wide" : ""}`}>
          {(icon || title) && (
            <div className="auth-head">
              {icon && <div className={`icon-tile auth-icon ${iconTone ? `tone-${iconTone}` : ""}`}>{icon}</div>}
              {title && <h1 className="auth-title">{title}</h1>}
              {subtitle && <p className="auth-subtitle">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
        {footer && <div className="auth-footer">{footer}</div>}
      </main>
    </div>
  );
}
