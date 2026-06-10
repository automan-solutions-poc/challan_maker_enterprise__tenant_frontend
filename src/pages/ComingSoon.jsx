import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowLeft } from "lucide-react";

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/10 blur-[140px] rounded-full -z-10" />

      <div className="max-w-xl w-full text-center">

        {/* Icon */}
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-600/30">
          <Clock size={36} />
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight font-display">
          Coming Soon
        </h1>

        {/* Description */}
        <p className="text-zinc-400 text-lg leading-relaxed mb-10">
          We're working hard to bring this feature to life.
          Stay tuned - something amazing is on the way.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

      </div>
    </div>
  );
};

export default ComingSoon;
