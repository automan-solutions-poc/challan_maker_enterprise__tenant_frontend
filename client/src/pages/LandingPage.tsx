import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Shield, 
  Zap, 
  Users, 
  QrCode, 
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Star,
  ChevronDown,
  Plus,
  Minus,
  Globe,
  Lock,
  BarChart3,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LandingPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    { q: "Is my data secure?", a: "Absolutely. We use enterprise-grade encryption and isolated tenant databases to ensure your store's data is never accessible by anyone else." },
    { q: "Can I use my own logo on the challans?", a: "Yes! Our Pro and Enterprise plans allow full branding customization, including your logo, store address, and custom terms and conditions." },
    { q: "How does the QR code tracking work?", a: "Every challan generated has a unique QR code. When a customer scans it, they are taken to a secure, live tracking page showing the current status of their repair." },
    { q: "Do you offer a free trial?", a: "We offer a 14-day full-featured trial for all our plans. No credit card required to start." }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30 font-sans">
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
            {/* <Link to="/admin/login" className="hover:text-white transition-colors">Admin</Link> */}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Sign In</Link>
            {/* <Link to="/coming-soon" className="bg-white text-black px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all">
              Get Started
            </Link> */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-blue-600/10 blur-[120px] -z-10 rounded-full" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/10 blur-[100px] -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium mb-8">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Trusted by Repair Centers Across City
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[0.9] font-display">
              The Modern OS for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-200 to-zinc-500">Repair Stores.</span>
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              Stop using paper. Start using infiChallan. Generate professional receipts, track repairs with QR codes, and grow your business with data.
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

          {/* Social Proof Logos */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-24 pt-12 border-t border-zinc-900"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600 mb-8">Powering the world's best service centers</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale">
              {['TechFix', 'MobileHub', 'LaptopPro', 'iRepair', 'GadgetCare'].map(brand => (
                <span key={brand} className="text-2xl font-black font-display italic tracking-tighter">{brand}</span>
              ))}
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
            <div className="flex gap-4">
              <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Uptime</div>
              </div>
              <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                <div className="text-2xl font-bold text-white">1M+</div>
                <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Challans</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Feature */}
            <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-blue-600/20">
                  <QrCode size={24} />
                </div>
                <h3 className="text-3xl font-bold mb-4 font-display">Live QR Tracking</h3>
                <p className="text-zinc-400 max-w-md leading-relaxed">
                  Every device gets a unique identity. Customers scan their receipt to see exactly where their device is in the repair pipeline. No more phone calls asking for updates.
                </p>
              </div>
              <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-blue-600/10 to-transparent rounded-tl-[5rem] border-t border-l border-zinc-800/50 translate-y-10 translate-x-10 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-700" />
            </div>

            {/* Small Feature */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-8">
                <Shield size={24} className="text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-display">Bank-Level Security</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Multi-tenant isolation ensures your customer database is never shared. Data is encrypted at rest and in transit.
              </p>
            </div>

            {/* Small Feature */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-8">
                <Smartphone size={24} className="text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-display">Mobile First</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Generate challans from your tablet or phone while talking to the customer. The entire interface is optimized for touch.
              </p>
            </div>

            {/* Large Feature */}
            <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-8">
                  <BarChart3 size={24} className="text-orange-500" />
                </div>
                <h3 className="text-3xl font-bold mb-4 font-display">Business Intelligence</h3>
                <p className="text-zinc-400 max-w-md leading-relaxed">
                  Track your most common repair types, monitor technician productivity, and see your revenue trends with built-in analytics.
                </p>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-6 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 font-display">Loved by store owners.</h2>
            <p className="text-zinc-500">Don't just take our word for it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Alex Rivera', role: 'Owner, TechFix NY', text: 'infiChallan changed how we work. We used to lose receipts all the time. Now everything is digital and the customers love the QR tracking.' },
              { name: 'Sarah Chen', role: 'Manager, MobileHub', text: 'The multi-staff feature is a lifesaver. I can see exactly which technician is working on what device and how long it\'s taking.' },
              { name: 'Marcus Thorne', role: 'Founder, LaptopPro', text: 'Professional PDFs with our logo make us look like a much bigger company. It built instant trust with our corporate clients.' },
            ].map((t, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 p-10 rounded-[2rem] relative">
                <div className="flex gap-1 text-orange-500 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                </div>
                <p className="text-zinc-300 mb-8 italic leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-blue-500">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-xs text-zinc-500">{t.role}</div>
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
            <h2 className="text-4xl md:text-6xl font-bold mb-6 font-display">Simple, fair pricing.</h2>
            <p className="text-zinc-500">All plans include a 14-day free trial. No hidden fees.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Starter', price: '-', desc: 'Perfect for small shops', features: ['100 Challans / month', '2 Staff Accounts', 'QR Code Tracking', 'Email Support'] },
              { name: 'Professional', price: '-', desc: 'For growing businesses', features: ['Unlimited Challans', '10 Staff Accounts', 'Full Branding', 'Priority Support', 'Analytics Dashboard'], popular: true },
              { name: 'Enterprise', price: '-', desc: 'For multi-location chains', features: ['Unlimited Everything', 'Custom Domain', 'Dedicated Manager', 'API Access', 'SLA Guarantee'] },
            ].map((plan, i) => (
              <div key={i} className={`p-12 rounded-[2.5rem] border ${plan.popular ? 'bg-blue-600 border-blue-500 shadow-2xl shadow-blue-600/30 scale-105 z-10' : 'bg-zinc-900 border-zinc-800'} relative flex flex-col`}>
                {plan.popular && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-blue-600 px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">Recommended</span>
                )}
                <div className="mb-8">
                  <h4 className="text-2xl font-bold mb-2 font-display">{plan.name}</h4>
                  <p className={plan.popular ? 'text-blue-100' : 'text-zinc-500'}>{plan.desc}</p>
                </div>
                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-5xl font-black font-display">${plan.price}</span>
                  <span className={plan.popular ? 'text-blue-200' : 'text-zinc-500'}>/mo</span>
                </div>
                <ul className="space-y-5 mb-12 flex-grow">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 size={18} className={plan.popular ? 'text-blue-200' : 'text-emerald-500'} />
                      <span className={plan.popular ? 'text-blue-50' : 'text-zinc-300'}>{f}</span>
                    </li>
                  ))}
                </ul>
                {/* <Link to="/coming-soon" className={`w-full block text-center py-5 rounded-2xl font-bold text-lg transition-all ${
                  plan.popular ? 'bg-white text-blue-600 hover:bg-zinc-100' : 'bg-zinc-800 text-white hover:bg-zinc-700'
                }`}>
                  Start Free Trial
                </Link> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6 bg-zinc-900/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center font-display">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-zinc-800/50 transition-colors"
                >
                  <span className="font-bold">{faq.q}</span>
                  {activeFaq === i ? <Minus size={20} /> : <Plus size={20} />}
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed"
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
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-blue-800 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-600/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 font-display">Ready to modernize <br />your repair store?</h2>
            <p className="text-blue-100 text-lg mb-12 max-w-xl mx-auto">Join hundreds of successful stores already using infiChallan. No credit card required.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/coming-soon" className="w-full sm:w-auto bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-zinc-100 transition-all shadow-xl">
                Get Started Now
              </Link>
              <Link to="/coming-soon" className="w-full sm:w-auto bg-blue-700/50 text-white border border-blue-400/30 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all">
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
                <p className='text-white'><b><i>Nashik,Maharashtra</i></b></p>
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
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-zinc-400">Company</h5>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Portal</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
            <div>© {new Date().getFullYear()} Challan Maker Enterprise. All rights reserved.</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-zinc-400">Privacy Policy</a>
              <a href="#" className="hover:text-zinc-400">Terms of Service</a>
              <a href="#" className="hover:text-zinc-400">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
