import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import AuthShell from "../components/AuthShell";

const ComingSoon = () => {
  return (
    <AuthShell
      icon={<Sparkles size={24} />}
      title="Coming soon"
      subtitle="We're putting the finishing touches on this. Check back shortly."
    >
      <Link to="/" className="btn btn-primary w-100">
        <ArrowLeft size={16} /> Back to home
      </Link>
    </AuthShell>
  );
};

export default ComingSoon;
