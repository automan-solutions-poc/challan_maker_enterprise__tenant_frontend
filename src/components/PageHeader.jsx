import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PageHeader({ eyebrow, title, subtitle, actions, back }) {
  return (
    <header className="page-header">
      <div className="min-w-0">
        {back && (
          <Link to={back.to} className="page-back">
            <ArrowLeft size={14} /> {back.label}
          </Link>
        )}
        {eyebrow && <div className="page-eyebrow">{eyebrow}</div>}
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}
