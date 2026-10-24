import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import AuthShell from "../components/AuthShell";

export default function Unauthorized() {
  return (
    <AuthShell
      icon={<ShieldAlert size={24} />}
      iconTone="warning"
      title="Admins only"
      subtitle="Your role doesn't include access to this page. Ask a workspace admin if you need it."
    >
      <Link to="/app/challans" className="btn btn-primary w-100">
        <ArrowLeft size={16} /> Go to challans
      </Link>
    </AuthShell>
  );
}
