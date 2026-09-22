import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Shield,
  QrCode,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Star,
  Plus,
  Globe,
  Lock,
  BarChart3,
  Mail
} from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-blue-500/30 font-sans relative overflow-x-hidden">
      {/* Subtle Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04]"
           style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <FileText className="text-white" size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight">infiChallan</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors no-underline">Features</a>
            {/* <a href="#testimonials" className="hover:text-white transition-colors no-underline">Testimonials</a> */}
            <a href="#pricing" className="hover:text-white transition-colors no-underline">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="bg-white/[0.06] text-white border border-white/[0.08] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/[0.1] hover:scale-105 transition-all duration-300 backdrop-blur-xl no-underline">Sign In</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] bg-blue-600/20 blur-[140px] -z-10 rounded-full animate-pulse" />
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] text-zinc-400 text-xs font-semibold mb-10 tracking-wider uppercase">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              Enterprise-Grade Solution
            </div>
            <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter mb-10 leading-[0.85]">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500">Repair Game.</span>
            </h1>
            <p className="text-zinc-400 text-xl md:text-2xl max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
              Ditch the paperwork. Embrace the future. Professional receipts, QR tracking, and powerful analytics designed for modern service centers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:from-blue-500 hover:to-blue-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 group">
                Start Your Free Trial
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/signup" className="w-full sm:w-auto bg-white/[0.04] text-white border border-white/[0.08] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/[0.08] transition-all backdrop-blur-xl">
                Book a Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Built for speed. <br />Designed for trust.</h2>
              <p className="text-zinc-500 text-lg">We've obsessed over every detail of the repair workflow so you don't have to.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Feature */}
            <div className="md:col-span-2 group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/40 to-blue-400/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <div className="relative bg-[#0e0e16]/90 backdrop-blur-xl border border-white/[0.06] rounded-[2.5rem] p-8 overflow-hidden h-full">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/30">
                    <QrCode size={28} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 tracking-tight">Live QR Tracking</h3>
                  <p className="text-zinc-400 text-base max-w-md leading-relaxed">
                    Every device gets a unique identity. Customers scan their receipt to see exactly where their device is in the repair pipeline.
                  </p>
                </div>
                <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-blue-600/10 to-transparent rounded-tl-[5rem] border-t border-l border-white/[0.04]" />
              </div>
            </div>

            {/* Small Feature */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600/40 to-emerald-400/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <div className="relative bg-[#0e0e16]/90 backdrop-blur-xl border border-white/[0.06] rounded-[2.5rem] p-8 h-full">
                <div className="w-12 h-12 bg-white/[0.04] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/[0.06]">
                  <Shield size={24} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">Bank-Level Security</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Multi-tenant isolation ensures your customer database is never shared. Data is encrypted at rest.
                </p>
              </div>
            </div>

            {/* Small Feature */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/40 to-purple-400/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <div className="relative bg-[#0e0e16]/90 backdrop-blur-xl border border-white/[0.06] rounded-[2.5rem] p-8 h-full">
                <div className="w-12 h-12 bg-white/[0.04] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/[0.06]">
                  <Smartphone size={24} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">Mobile First</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Generate challans from your tablet or phone. The entire interface is optimized for touch and speed.
                </p>
              </div>
            </div>

            {/* Large Feature */}
            <div className="md:col-span-2 group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600/40 to-orange-400/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <div className="relative bg-[#0e0e16]/90 backdrop-blur-xl border border-white/[0.06] rounded-[2.5rem] p-8 overflow-hidden h-full">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/[0.04] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/[0.06]">
                    <BarChart3 size={24} className="text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 tracking-tight">Business Intelligence</h3>
                  <p className="text-zinc-400 text-base max-w-md leading-relaxed">
                    Track your most common repair types and monitor technician productivity with built-in advanced analytics.
                  </p>
                </div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-500/5 blur-[100px] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*
      <section id="testimonials" className="py-32 px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-blue-600/5 blur-[120px] -z-10 rounded-full" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Loved by experts.</h2>
            <p className="text-zinc-500 text-lg">Trusted by hundreds of repair businesses worldwide.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Alex Rivera', role: 'Owner, TechFix NY', text: 'infiChallan changed how we work. We used to lose receipts all the time. Now everything is digital and the customers love the QR tracking.' },
              { name: 'Sarah Chen', role: 'Manager, MobileHub', text: 'The multi-staff feature is a lifesaver. I can see exactly which technician is working on what device and how long it\'s taking.' },
              { name: 'Marcus Thorne', role: 'Founder, LaptopPro', text: 'Professional PDFs with our logo make us look like a much bigger company. It built instant trust with our corporate clients.' },
            ].map((t, i) => (
              <div key={i} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-600/20 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                <div className="relative bg-[#0e0e16]/90 backdrop-blur-xl border border-white/[0.06] p-12 rounded-[2.5rem] h-full">
                  <div className="flex gap-1 text-blue-500 mb-8">
                    {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-zinc-300 text-lg mb-10 italic leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-700/20 rounded-2xl flex items-center justify-center font-bold text-blue-400 border border-blue-500/10">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">{t.name}</div>
                      <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Scalable pricing.</h2>
            <p className="text-zinc-500 text-base">Pick a plan that grows with your business.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Starter', price: '0', desc: 'Perfect for small shops', features: ['100 Challans / month', '2 Staff Accounts', 'QR Code Tracking', 'Email Support'] },
              { name: 'Professional', price: '49', desc: 'For growing businesses', features: ['Unlimited Challans', '10 Staff Accounts', 'Full Branding', 'Priority Support', 'Analytics Dashboard'], popular: true },
              { name: 'Enterprise', price: '199', desc: 'For multi-location chains', features: ['Unlimited Everything', 'Custom Domain', 'Dedicated Manager', 'API Access', 'SLA Guarantee'] },
            ].map((plan, i) => (
              <div key={i} className={`group relative ${plan.popular ? 'scale-105 z-10' : ''}`}>
                {plan.popular && (
                  <div className="absolute -inset-1 bg-gradient-to-b from-blue-500/40 via-blue-600/20 to-transparent rounded-[2.5rem] blur-md" />
                )}
                <div className={`relative p-8 rounded-[2.5rem] border h-full flex flex-col transition-all duration-500 ${
                  plan.popular
                  ? 'bg-gradient-to-b from-blue-600 to-blue-700 border-blue-400/30 shadow-[0_0_60px_rgba(59,130,246,0.2)]'
                  : 'bg-[#0e0e16]/90 backdrop-blur-xl border-white/[0.06] hover:border-white/[0.12]'
                }`}>
                  {plan.popular && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-400 to-blue-300 text-blue-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">Most Popular</span>
                  )}
                  <div className="mb-6">
                    <h4 className="text-2xl font-bold mb-2 tracking-tight">{plan.name}</h4>
                    <p className={`text-sm ${plan.popular ? 'text-blue-100' : 'text-zinc-500'}`}>{plan.desc}</p>
                  </div>
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-4xl font-black tracking-tighter">${plan.price}</span>
                    <span className={`text-sm font-bold ${plan.popular ? 'text-blue-200' : 'text-zinc-500'}`}>/mo</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-blue-400/30' : 'bg-emerald-500/10'}`}>
                          <CheckCircle2 size={12} className={plan.popular ? 'text-white' : 'text-emerald-400'} />
                        </div>
                        <span className={plan.popular ? 'text-blue-50' : 'text-zinc-300'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup" className={`w-full block text-center py-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                    plan.popular
                    ? 'bg-white text-blue-600 hover:scale-[1.02] shadow-xl shadow-black/10'
                    : 'bg-white/[0.06] text-white hover:bg-white/[0.1] hover:scale-[1.02] border border-white/[0.06]'
                  }`}>
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/30 via-blue-500/20 to-indigo-600/30 rounded-[4.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[3rem] p-8 md:p-16 text-center overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.15)]">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/20 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-[0.9]">Start building <br />for the future.</h2>
              <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">Join 500+ service centers modernizing their business with infiChallan.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup" className="w-full sm:w-auto bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-base hover:scale-105 transition-all shadow-2xl shadow-black/20">
                  Get Started Now
                </Link>
                <Link to="/signup" className="w-full sm:w-auto bg-blue-900/30 text-white border border-white/20 backdrop-blur-md px-8 py-4 rounded-xl font-bold text-base hover:bg-blue-900/40 transition-all">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <FileText className="text-white" size={18} />
                </div>
                <span className="text-xl font-bold">infiChallan</span>
              </div>
              <p className="text-zinc-500 max-w-xs leading-relaxed mb-8">
                The enterprise-grade operating system for modern repair businesses. Scale with confidence.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white/[0.04] rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-pointer border border-white/[0.06]">
                  <Globe size={18} />
                </div>
                <div className="w-10 h-10 bg-white/[0.04] rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-pointer border border-white/[0.06]">
                  <Lock size={18} />
                </div>
                <div className="w-10 h-10 bg-white/[0.04] rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-pointer border border-white/[0.06]">
                  <Mail size={18} />
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-zinc-400">Product</h5>
              <ul className="space-y-3 text-sm text-zinc-500 list-none p-0 m-0">
                <li><a href="#features" className="hover:text-white transition-colors no-underline">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors no-underline">Pricing</a></li>
                <li><Link to="/coming-soon" className="hover:text-white transition-colors no-underline">API Docs</Link></li>
                <li><Link to="/coming-soon" className="hover:text-white transition-colors no-underline">Security</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-zinc-400">Company</h5>
              <ul className="space-y-3 text-sm text-zinc-500 list-none p-0 m-0">
                <li><Link to="/coming-soon" className="hover:text-white transition-colors no-underline">About Us</Link></li>
                <li><Link to="/coming-soon" className="hover:text-white transition-colors no-underline">Careers</Link></li>
                <li><Link to="/coming-soon" className="hover:text-white transition-colors no-underline">Contact</Link></li>
                <li><Link to="/admin/login" className="hover:text-white transition-colors no-underline">Admin Portal</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
            <div>© {new Date().getFullYear()} Challan Maker Enterprise. All rights reserved.</div>
            <div className="flex gap-8">
              <Link to="/coming-soon" className="hover:text-zinc-400 no-underline">Privacy Policy</Link>
              <Link to="/coming-soon" className="hover:text-zinc-400 no-underline">Terms of Service</Link>
              <Link to="/coming-soon" className="hover:text-zinc-400 no-underline">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
