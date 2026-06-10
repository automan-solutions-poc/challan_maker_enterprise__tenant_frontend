import React, { useState } from 'react';
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
  Minus,
  Globe,
  Lock,
  BarChart3,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    { q: "Is my data secure?", a: "Absolutely. We use enterprise-grade encryption and isolated tenant databases to ensure your store's data is never accessible by anyone else." },
    { q: "Can I use my own logo on the challans?", a: "Yes! Our Pro and Enterprise plans allow full branding customization, including your logo, store address, and custom terms and conditions." },
    { q: "How does the QR code tracking work?", a: "Every challan generated has a unique QR code. When a customer scans it, they are taken to a secure, live tracking page showing the current status of their repair." },
    { q: "Do you offer a free trial?", a: "We offer a 14-day full-featured trial for all our plans. No credit card required to start." }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30 font-sans relative overflow-x-hidden">
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.03] mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/feTurbulence%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3")` }} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <FileText className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight font-display">infiChallan</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] bg-blue-600/20 blur-[140px] -z-10 rounded-full animate-pulse" />
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 backdrop-blur-xl border border-white/5 text-zinc-400 text-xs font-semibold mb-10 tracking-wider uppercase">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              Enterprise-Grade Solution
            </div>
            <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter mb-10 leading-[0.85] font-display">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500">Repair Game.</span>
            </h1>
            <p className="text-zinc-400 text-xl md:text-2xl max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
              Ditch the paperwork. Embrace the future. Professional receipts, QR tracking, and powerful analytics designed for modern service centers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/coming-soon" className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 group">
                Start Your Free Trial
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/coming-soon" className="w-full sm:w-auto bg-zinc-900 text-white border border-zinc-800 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all">
                Book a Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-32 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 font-display">Built for speed. <br />Designed for trust.</h2>
              <p className="text-zinc-500 text-lg">We've obsessed over every detail of the repair workflow so you don't have to.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Feature */}
            <div className="md:col-span-2 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-12 relative overflow-hidden group hover:border-blue-500/30 transition-colors duration-500">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-600/40">
                  <QrCode size={28} />
                </div>
                <h3 className="text-4xl font-bold mb-4 font-display tracking-tight">Live QR Tracking</h3>
                <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
                  Every device gets a unique identity. Customers scan their receipt to see exactly where their device is in the repair pipeline.
                </p>
              </div>
              <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-blue-600/20 to-transparent rounded-tl-[5rem] border-t border-l border-white/5 translate-y-10 translate-x-10 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-700" />
            </div>

            {/* Small Feature */}
            <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-12 hover:border-emerald-500/30 transition-all duration-500 group">
              <div className="w-14 h-14 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Shield size={28} className="text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-display tracking-tight">Bank-Level Security</h3>
              <p className="text-zinc-500 leading-relaxed">
                Multi-tenant isolation ensures your customer database is never shared. Data is encrypted at rest.
              </p>
            </div>

            {/* Small Feature */}
            <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-12 hover:border-purple-500/30 transition-all duration-500 group">
              <div className="w-14 h-14 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Smartphone size={28} className="text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-display tracking-tight">Mobile First</h3>
              <p className="text-zinc-500 leading-relaxed">
                Generate challans from your tablet or phone. The entire interface is optimized for touch and speed.
              </p>
            </div>

            {/* Large Feature */}
            <div className="md:col-span-2 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-12 relative overflow-hidden group hover:border-orange-500/30 transition-colors duration-500">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <BarChart3 size={28} className="text-orange-500" />
                </div>
                <h3 className="text-4xl font-bold mb-4 font-display tracking-tight">Business Intelligence</h3>
                <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
                  Track your most common repair types and monitor technician productivity with built-in advanced analytics.
                </p>
              </div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-500/10 blur-[100px] rounded-full group-hover:bg-orange-500/20 transition-colors duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-blue-600/5 blur-[120px] -z-10 rounded-full" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 font-display tracking-tight">Loved by experts.</h2>
            <p className="text-zinc-500 text-lg">Trusted by hundreds of repair businesses worldwide.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Alex Rivera', role: 'Owner, TechFix NY', text: 'infiChallan changed how we work. We used to lose receipts all the time. Now everything is digital and the customers love the QR tracking.' },
              { name: 'Sarah Chen', role: 'Manager, MobileHub', text: 'The multi-staff feature is a lifesaver. I can see exactly which technician is working on what device and how long it\'s taking.' },
              { name: 'Marcus Thorne', role: 'Founder, LaptopPro', text: 'Professional PDFs with our logo make us look like a much bigger company. It built instant trust with our corporate clients.' },
            ].map((t, i) => (
              <div key={i} className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-12 rounded-[2.5rem] relative group hover:border-blue-500/20 transition-all duration-500">
                <div className="flex gap-1 text-blue-500 mb-8">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                </div>
                <p className="text-zinc-300 text-lg mb-10 italic leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center font-bold text-blue-500 border border-blue-500/20">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">{t.name}</div>
                    <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 font-display tracking-tight">Scalable pricing.</h2>
            <p className="text-zinc-500 text-lg">Pick a plan that grows with your business.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Starter', price: '0', desc: 'Perfect for small shops', features: ['100 Challans / month', '2 Staff Accounts', 'QR Code Tracking', 'Email Support'] },
              { name: 'Professional', price: '49', desc: 'For growing businesses', features: ['Unlimited Challans', '10 Staff Accounts', 'Full Branding', 'Priority Support', 'Analytics Dashboard'], popular: true },
              { name: 'Enterprise', price: '199', desc: 'For multi-location chains', features: ['Unlimited Everything', 'Custom Domain', 'Dedicated Manager', 'API Access', 'SLA Guarantee'] },
            ].map((plan, i) => (
              <div key={i} className={`p-12 rounded-[3rem] border transition-all duration-500 ${
                plan.popular
                ? 'bg-blue-600 border-blue-400 shadow-[0_0_50px_rgba(59,130,246,0.3)] scale-105 z-10'
                : 'bg-zinc-900/40 backdrop-blur-md border-white/5 hover:border-white/10'
              } relative flex flex-col group`}>
                {plan.popular && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-blue-600 px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-xl">Most Popular</span>
                )}
                <div className="mb-10">
                  <h4 className="text-3xl font-bold mb-3 font-display tracking-tight">{plan.name}</h4>
                  <p className={`font-medium ${plan.popular ? 'text-blue-100' : 'text-zinc-500'}`}>{plan.desc}</p>
                </div>
                <div className="flex items-baseline gap-2 mb-12">
                  <span className="text-6xl font-black font-display tracking-tighter">${plan.price}</span>
                  <span className={`text-lg font-bold ${plan.popular ? 'text-blue-200' : 'text-zinc-500'}`}>/mo</span>
                </div>
                <ul className="space-y-6 mb-16 flex-grow">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-4 text-sm font-medium">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-blue-400/30' : 'bg-emerald-500/10'}`}>
                        <CheckCircle2 size={14} className={plan.popular ? 'text-white' : 'text-emerald-500'} />
                      </div>
                      <span className={plan.popular ? 'text-blue-50' : 'text-zinc-300'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/coming-soon" className={`w-full block text-center py-6 rounded-2xl font-black text-lg transition-all duration-300 ${
                  plan.popular
                  ? 'bg-white text-blue-600 hover:scale-[1.02] shadow-xl shadow-black/10'
                  : 'bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-[1.02]'
                }`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-16 text-center font-display tracking-tight">Got questions?</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden transition-colors hover:border-white/10">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-8 flex items-center justify-between text-left transition-colors"
                >
                  <span className="text-lg font-bold">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-white/10 transition-transform duration-300 ${activeFaq === i ? 'rotate-180 bg-blue-600 border-blue-500' : ''}`}>
                    {activeFaq === i ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-8 pb-8 text-zinc-400 text-lg leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.2)]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/20 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-5xl md:text-8xl font-black mb-10 font-display tracking-tighter leading-[0.9]">Start building <br />for the future.</h2>
            <p className="text-blue-100 text-xl md:text-2xl mb-16 max-w-2xl mx-auto font-medium">Join 500+ service centers modernizing their business with infiChallan.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/coming-soon" className="w-full sm:w-auto bg-white text-blue-600 px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-black/20">
                Get Started Now
              </Link>
              <Link to="/coming-soon" className="w-full sm:w-auto bg-blue-900/30 text-white border border-white/20 backdrop-blur-md px-12 py-6 rounded-2xl font-black text-xl hover:bg-blue-900/40 transition-all">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="text-white" size={18} />
                </div>
                <span className="text-xl font-bold font-display">infiChallan</span>
              </div>
              <p className="text-zinc-500 max-w-xs leading-relaxed mb-8">
                The enterprise-grade operating system for modern repair businesses. Scale with confidence.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-pointer border border-zinc-800">
                  <Globe size={18} />
                </div>
                <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-pointer border border-zinc-800">
                  <Lock size={18} />
                </div>
                <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-pointer border border-zinc-800">
                  <Mail size={18} />
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-zinc-400">Product</h5>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link to="/coming-soon" className="hover:text-white transition-colors">API Docs</Link></li>
                <li><Link to="/coming-soon" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-zinc-400">Company</h5>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><Link to="/coming-soon" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/coming-soon" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/coming-soon" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Portal</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
            <div>© {new Date().getFullYear()} Challan Maker Enterprise. All rights reserved.</div>
            <div className="flex gap-8">
              <Link to="/coming-soon" className="hover:text-zinc-400">Privacy Policy</Link>
              <Link to="/coming-soon" className="hover:text-zinc-400">Terms of Service</Link>
              <Link to="/coming-soon" className="hover:text-zinc-400">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
