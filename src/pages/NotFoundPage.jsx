import React from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";
import AuthShell from "../components/AuthShell";

export default function NotFoundPage() {
  const signedIn = Boolean(localStorage.getItem("tenant_token"));
  return (
    <AuthShell
      icon={<Compass size={24} />}
      title="Page not found"
      subtitle="The link may be broken, or the page may have moved."
    >
      <div className="d-flex flex-column flex-sm-row gap-2">
        <Link to={signedIn ? "/app/dashboard" : "/"} className="btn btn-primary flex-fill">
          <ArrowLeft size={16} /> {signedIn ? "Back to dashboard" : "Back to home"}
        </Link>
      </div>
    </AuthShell>
  );
}
