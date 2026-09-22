
import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowLeft } from "lucide-react";

import { motion } from 'framer-motion';

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background Glows */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10"
      />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/5 blur-[100px] rounded-full -z-10" />

      <div className="max-w-xl w-full text-center relative z-10">

        {/* Icon with Floating Animation */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-12 shadow-[0_20px_50px_rgba(59,130,246,0.3)] border border-blue-400/20"
        >
          <Clock size={40} className="text-white" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-7xl font-black mb-8 tracking-tighter font-display"
        >
          Coming Soon
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-zinc-400 text-xl md:text-2xl leading-relaxed mb-16 font-medium"
        >
          Our team is crafting something exceptional. <br className="hidden md:block" />
          The future of repair management is almost here.
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-white text-black hover:bg-zinc-200 px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl hover:scale-105"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default ComingSoon;
