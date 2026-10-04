import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Shield,
  QrCode,
  CheckCircle2,
  ArrowRight,
  Globe,
  Lock,
  BarChart3,
  Mail,
  LayoutDashboard,
  PlusCircle,
  Palette,
  Users,
  Menu,
  X,
  Clock,
  Download,
  Image as ImageIcon,
  SunMoon,
  KeyRound,
  Printer,
  Package,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV = [
  { href: '#product', label: 'Product' },
  { href: '#workflow', label: 'Workflow' },
  { href: '#features', label: 'Features' },
  { href: '#studio', label: 'Branding' },
  { href: '#free', label: 'Free' },
];

const SHOWCASE = [
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    nav: 'Dashboard',
    title: 'Live dashboard',
    blurb: 'See total challans, pending jobs, and deliveries the moment you sign in.',
    points: ['Total, pending, and delivered counts', 'Challans over time', 'Status mix and PDF quota'],
  },
  {
    id: 'create',
    icon: PlusCircle,
    nav: 'New challan',
    title: 'Create a challan',
    blurb: 'Capture the job once — customer, device, parts, warranty, and photos — with a live receipt preview.',
    points: ['Customer, city, and contact', 'Serial number and problem notes', 'Line items, accessories, and warranty'],
  },
  {
    id: 'library',
    icon: FileText,
    nav: 'Library',
    title: 'Challan library',
    blurb: 'Filter by date and status, then download the PDF, print the QR, or open the job again.',
    points: ['Pending and delivered filters', 'PDF download', 'QR view and print'],
  },
  {
    id: 'handover',
    icon: KeyRound,
    nav: 'Handover',
    title: 'Secure handover',
    blurb: 'Email a one-time code to the customer and mark the job delivered only after they confirm.',
    points: ['OTP sent to the customer email', 'Verify before delivery', 'Resend the PDF anytime'],
  },
  {
    id: 'brand',
    icon: Palette,
    nav: 'Branding',
    title: 'Your brand on every PDF',
    blurb: 'Logo, colors, fonts, address, and footer note — the receipt looks like your shop, not a template.',
    points: ['Logo upload and theme color', 'Company details and tagline', 'Footer note and accessories toggle'],
  },
  {
    id: 'team',
    icon: Users,
    nav: 'Team',
    title: 'Admin and staff',
    blurb: 'Owners control design, email, and terms. Staff create and manage challans from the same workspace.',
    points: ['Tenant admin and staff roles', 'Invite teammates by email', 'Shared challan history'],
  },
  {
    id: 'email',
    icon: Mail,
    nav: 'Email',
    title: 'Customer email',
    blurb: 'Choose the sender name customers see, then mail the PDF or a test message from your shop.',
    points: ['Multiple sender names', 'A default display name', 'PDF resend from the challan list'],
  },
];

const WORKFLOW = [
  { title: 'Intake', text: 'Log the customer, serial number, problem, accessories, and photos of the device.' },
  { title: 'Receipt', text: 'Save the challan. A branded PDF and QR code are ready to share.' },
  { title: 'Track', text: 'The job sits as pending on the dashboard and in the challan list.' },
  { title: 'Notify', text: 'Email the PDF, or send an OTP when the customer comes to collect.' },
  { title: 'Deliver', text: 'Verify the code and the status flips to delivered.' },
];

const SAMPLE_JOBS = [
  { no: 'CH-1042', name: 'Asha Mehta', device: 'Laptop · SN-44190', status: 'pending' },
  { no: 'CH-1041', name: 'Ravi Kumar', device: 'Printer · SN-22018', status: 'delivered' },
  { no: 'CH-1038', name: 'Northwind Traders', device: 'Desktop · SN-11802', status: 'pending' },
];

const BRAND_COLORS = ['#2563eb', '#0f766e', '#b45309', '#7c3aed', '#be123c'];

function WindowChrome({ title, children }) {
  return (
    <div className="rounded-lg border border-[#e2e8f0] bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-4 h-10 border-b border-[#e2e8f0] bg-[#f1f5f9]">
        <span className="text-[11px] font-medium text-[#64748b]">{title}</span>
      </div>
      <div className="p-4 md:p-5 text-[#1e293b]">{children}</div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <WindowChrome title="Dashboard">
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Total', value: '128', tone: 'text-[#1e293b]' },
          { label: 'Pending', value: '17', tone: 'text-amber-300' },
          { label: 'Delivered', value: '111', tone: 'text-emerald-300' },
        ].map((card) => (
          <div key={card.label} className="rounded-xl bg-[#f1f5f9] border border-[#e2e8f0] p-3">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">{card.label}</div>
            <div className={`text-xl font-bold mt-1 ${card.tone}`}>{card.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-[#f1f5f9] border border-[#e2e8f0] p-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-zinc-400">Challans this week</span>
          <BarChart3 size={14} className="text-blue-400" />
        </div>
        <div className="flex items-end gap-2 h-24">
          {[40, 62, 48, 80, 55, 92, 70].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-[#6366f1]" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
        <span>PDF quota</span>
        <span className="text-[#1e293b] font-semibold">12 / 20</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-[#e2e8f0] overflow-hidden">
        <div className="h-full w-[60%] bg-[#6366f1] rounded-full" />
      </div>
    </WindowChrome>
  );
}

function CreatePreview() {
  return (
    <WindowChrome title="New challan">
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          ['Customer', 'Asha Mehta'],
          ['City', 'Pune'],
          ['Serial', 'SN-44190'],
          ['Warranty', 'Chargeable'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-[#f1f5f9] border border-[#e2e8f0] px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
            <div className="text-sm text-[#1e293b] mt-0.5">{value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-[#f1f5f9] border border-[#e2e8f0] px-3 py-2 mb-3">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500">Problem</div>
        <div className="text-sm text-[#64748b] mt-0.5">Display flicker after drop. Adapter included.</div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {['Laptop', 'Adapter', 'Carry Case'].map((tag) => (
          <span key={tag} className="text-[11px] px-2 py-1 rounded-md bg-[#eef2ff] text-[#6366f1]">
            {tag}
          </span>
        ))}
        <span className="text-[11px] px-2 py-1 rounded-md bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0] inline-flex items-center gap-1">
          <ImageIcon size={11} /> 2 photos
        </span>
      </div>
      <div className="rounded-lg border border-dashed border-[#cbd5e1] bg-[#f1f5f9] p-3">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Live preview</div>
        <div className="bg-white text-zinc-900 rounded-lg p-3 text-xs">
          <div className="font-bold text-sm">AutoMan Computers</div>
          <div className="text-zinc-500">Service challan · CH-1042</div>
          <div className="mt-2 flex justify-between"><span>Display assembly</span><span>1</span></div>
        </div>
      </div>
    </WindowChrome>
  );
}

function LibraryPreview({ activeStatus, onStatus }) {
  const rows = SAMPLE_JOBS.filter((job) => activeStatus === 'all' || job.status === activeStatus);
  return (
    <WindowChrome title="Challans">
      <div className="flex gap-2 mb-3">
        {['all', 'pending', 'delivered'].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onStatus(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-colors ${
              activeStatus === key
                ? 'btn-fill bg-[#6366f1] text-white border-[#6366f1]'
                : 'bg-white text-[#64748b] border-[#e2e8f0] hover:text-[#1e293b]'
            }`}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {rows.map((job) => (
          <div key={job.no} className="flex items-center justify-between gap-3 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0] px-3 py-2.5">
            <div>
              <div className="text-sm font-semibold">{job.no} · {job.name}</div>
              <div className="text-[11px] text-zinc-500">{job.device}</div>
            </div>
            <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
              job.status === 'delivered' ? 'bg-[#eef2ff] text-[#6366f1]' : 'bg-[#fef3c7] text-[#b45309]'
            }`}>
              {job.status}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2 text-[11px] text-zinc-400">
        <span className="inline-flex items-center gap-1"><Download size={12} /> PDF</span>
        <span className="inline-flex items-center gap-1"><QrCode size={12} /> QR</span>
        <span className="inline-flex items-center gap-1"><Mail size={12} /> Resend</span>
      </div>
    </WindowChrome>
  );
}

function HandoverPreview({ delivered, code, onCode, onVerify }) {
  return (
    <WindowChrome title="Delivery OTP">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="text-sm font-semibold">CH-1042 · Asha Mehta</div>
          <div className="text-xs text-zinc-500">asha@example.com</div>
        </div>
        <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
          delivered ? 'bg-[#eef2ff] text-[#6366f1]' : 'bg-[#fef3c7] text-[#b45309]'
        }`}>
          {delivered ? 'delivered' : 'pending'}
        </span>
      </div>
      <p className="text-xs text-[#64748b] mb-3">Try the demo code <span className="text-[#1e293b] font-semibold">482913</span>.</p>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => onCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric"
          placeholder="6-digit code"
          className="flex-1 bg-white border border-[#cbd5e1] rounded-md px-3 py-2 text-sm text-[#1e293b] outline-none focus:border-[#6366f1]"
        />
        <button
          type="button"
          onClick={onVerify}
          className="btn-fill px-4 rounded-md bg-[#6366f1] text-sm font-medium text-white hover:bg-[#4f46e5]"
        >
          Verify
        </button>
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        {delivered ? 'Code matched. The challan is marked delivered.' : 'The customer receives this code by email before pickup.'}
      </p>
    </WindowChrome>
  );
}

function BrandPreview({ color, onColor }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="rounded-lg border border-[#e2e8f0] bg-[#f1f5f9] p-4">
        <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Theme color</div>
        <div className="flex gap-2 mb-4">
          {BRAND_COLORS.map((swatch) => (
            <button
              key={swatch}
              type="button"
              aria-label={`Use ${swatch}`}
              onClick={() => onColor(swatch)}
              className="w-8 h-8 rounded-full border-2"
              style={{ background: swatch, borderColor: color === swatch ? '#1e293b' : 'transparent' }}
            />
          ))}
        </div>
        <div className="space-y-2 text-sm">
          <div className="rounded-lg bg-[#f1f5f9] border border-[#e2e8f0] px-3 py-2">AutoMan Computers</div>
          <div className="rounded-lg bg-[#f1f5f9] border border-[#e2e8f0] px-3 py-2 text-zinc-400">Excellence in service</div>
          <div className="rounded-lg bg-[#f1f5f9] border border-[#e2e8f0] px-3 py-2 text-zinc-400">Footer: Thank you for trusting us.</div>
        </div>
      </div>
      <div className="rounded-2xl bg-zinc-100 text-zinc-900 p-5 shadow-inner">
        <div className="h-2 rounded-full mb-4" style={{ background: color }} />
        <div className="text-lg font-semibold" style={{ color }}>AutoMan Computers</div>
        <div className="text-xs text-zinc-500 mb-4">Service challan · CH-1042</div>
        <div className="text-sm font-semibold">Asha Mehta</div>
        <div className="text-xs text-zinc-500 mb-3">Pune · Laptop SN-44190</div>
        <div className="border-t border-zinc-200 pt-3 text-xs flex justify-between">
          <span>Display assembly</span><span>Qty 1</span>
        </div>
        <div className="mt-6 text-[11px] text-zinc-400">Thank you for trusting us.</div>
      </div>
    </div>
  );
}

function TeamPreview() {
  return (
    <WindowChrome title="Team">
      {[
        ['Priya Shah', 'Admin', 'Design, email, terms, team'],
        ['Imran Qureshi', 'Staff', 'Create and update challans'],
      ].map(([name, role, access]) => (
        <div key={name} className="flex items-center justify-between gap-3 py-3 border-b border-[#e2e8f0] last:border-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#eef2ff] text-[#6366f1] flex items-center justify-center text-sm font-semibold">
              {name[0]}
            </div>
            <div>
              <div className="text-sm font-semibold">{name}</div>
              <div className="text-[11px] text-zinc-500">{access}</div>
            </div>
          </div>
          <span className="text-xs text-[#64748b]">{role}</span>
        </div>
      ))}
    </WindowChrome>
  );
}

function EmailPreview() {
  return (
    <WindowChrome title="Email settings">
      <div className="text-xs text-zinc-500 mb-2">Customer-visible sender names</div>
      <div className="flex flex-wrap gap-2 mb-4">
        {['AutoMan Computers', 'AutoMan Service Desk'].map((name, i) => (
          <span key={name} className={`text-xs px-3 py-1.5 rounded-md border ${i === 0 ? 'border-[#6366f1] bg-[#eef2ff] text-[#6366f1]' : 'border-[#e2e8f0] text-[#64748b]'}`}>
            {name}{i === 0 ? ' · default' : ''}
          </span>
        ))}
      </div>
      <div className="rounded-lg bg-[#f1f5f9] border border-[#e2e8f0] text-[#1e293b] p-4 text-sm">
        <div className="text-[11px] uppercase tracking-wider text-zinc-400">From</div>
        <div className="font-semibold">AutoMan Computers</div>
        <div className="mt-3 font-semibold">Your service challan CH-1042</div>
        <p className="text-zinc-600 text-xs mt-1 mb-0">PDF attached. Scan the QR or reply with the pickup code when you collect the device.</p>
      </div>
    </WindowChrome>
  );
}

const PREVIEWS = {
  dashboard: DashboardPreview,
  create: CreatePreview,
  team: TeamPreview,
  brand: null,
};

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('dashboard');
  const [step, setStep] = useState(0);
  const [listStatus, setListStatus] = useState('all');
  const [otp, setOtp] = useState('');
  const [otpNote, setOtpNote] = useState('');
  const [delivered, setDelivered] = useState(false);
  const [brandColor, setBrandColor] = useState(BRAND_COLORS[0]);

  const feature = SHOWCASE.find((item) => item.id === active) || SHOWCASE[0];
  const activeIndex = Math.max(0, SHOWCASE.findIndex((item) => item.id === active));

  const verifyOtp = () => {
    if (otp === '482913') {
      setDelivered(true);
      setOtpNote('');
    } else {
      setDelivered(false);
      setOtpNote('That code does not match. Use 482913.');
    }
  };

  const renderPreview = () => {
    if (active === 'library') return <LibraryPreview activeStatus={listStatus} onStatus={setListStatus} />;
    if (active === 'handover') {
      return (
        <HandoverPreview
          delivered={delivered}
          code={otp}
          onCode={(value) => { setOtp(value); setOtpNote(''); }}
          onVerify={verifyOtp}
        />
      );
    }
    if (active === 'brand') return <BrandPreview color={brandColor} onColor={setBrandColor} />;
    if (active === 'email') return <EmailPreview />;
    const Preview = PREVIEWS[active] || DashboardPreview;
    return <Preview />;
  };

  return (
    <div className="product-landing min-h-screen selection:bg-[#6366f1]/20 font-sans relative">
      <style>{`
        .product-landing {
          background: #e7edf2;
          color: #3e4c5e;
        }
        .product-landing h1 {
          font-size: clamp(1.9rem, 3.6vw, 2.6rem);
          line-height: 1.3;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: #2c3848;
        }
        .product-landing h2 {
          font-size: clamp(1.45rem, 2.2vw, 1.8rem);
          line-height: 1.35;
          font-weight: 500;
          letter-spacing: -0.015em;
          color: #2c3848;
        }
        .product-landing a {
          text-decoration: none;
        }
        .product-landing button,
        .product-landing input {
          font-family: inherit;
          color: inherit;
        }
        .product-landing .btn-fill,
        .product-landing button.is-active,
        .product-landing .workflow-steps button.is-active {
          color: #fff;
        }
        .workspace-nav button {
          border: 0;
          box-shadow: none;
          background-color: transparent;
        }
        .product-landing .brand-mark,
        .product-landing .btn-fill,
        .workspace-nav button.is-active {
          background: #5b6ad6;
          color: #fff;
          border-color: transparent;
        }
        .product-landing .brand-band {
          background: #f7f8fa;
          color: #2c3848;
          border: 1px solid #d5dde6;
        }
        .workspace-nav button:hover:not(.is-active) {
          background: #f1f5f9;
        }
        .workspace-nav button.is-active:hover,
        .product-landing .btn-fill:hover {
          filter: brightness(1.06);
        }
        .workflow-steps button,
        .workflow-next {
          appearance: none;
          cursor: pointer;
          box-shadow: none;
        }
        .workflow-steps button {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          border: 1px solid #e2e8f0;
          background: #fff;
          color: #1e293b;
          border-radius: 8px;
          padding: 12px 14px;
          text-align: left;
        }
        .workflow-steps button .step-index {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          background: #f8fafc;
          color: #1e293b;
          flex-shrink: 0;
        }
        .workflow-steps button.is-active {
          background: #5b6ad6;
          border-color: transparent;
          color: #fff;
        }
        .workflow-steps button.is-active .step-index {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }
        .product-landing .workflow-next {
          border: 0;
          background: #5b6ad6;
          color: #fff;
          border-radius: 12px;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
      <nav className="fixed top-0 w-full z-50 bg-[#e7edf2]/95 border-b border-[#d5dde6]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3 no-underline text-[#1e293b]">
            <div className="brand-mark w-9 h-9 rounded-xl flex items-center justify-center">
              <FileText className="text-white" size={18} />
            </div>
            <span className="text-lg font-semibold">infiChallan</span>
          </a>

          <div className="hidden md:flex items-center gap-7 text-sm text-[#64748b]">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-[#64748b] hover:text-[#1e293b] transition-colors no-underline">{item.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:inline-flex text-[#1e293b] border border-[#cbd5e1] bg-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#f1f5f9] no-underline">
              Sign in
            </Link>
            <Link to="/signup" className="btn-fill bg-[#6366f1] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#4f46e5] no-underline">
              Get started
            </Link>
            <button type="button" className="md:hidden p-2 text-[#1e293b] bg-white border border-[#cbd5e1] rounded-md" onClick={() => setMenuOpen((open) => !open)} aria-label="Menu">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-[#e2e8f0] bg-[#f8fafc] px-6 py-4 flex flex-col gap-3">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="text-[#1e293b] no-underline">{item.label}</a>
            ))}
            <Link to="/login" className="text-[#1e293b] no-underline" onClick={() => setMenuOpen(false)}>Sign in</Link>
          </div>
        )}
      </nav>

      <section id="top" className="relative pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-sm text-[#5c6b7e] mb-4">For repair and service counters</p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-5">
              Every job in.<br />
              Every handover proven.
            </h1>
            <p className="text-[#64748b] text-lg max-w-xl mb-8 leading-relaxed">
              infiChallan is the workspace your counter staff actually open: branded challans, a live preview, QR codes, customer email, and OTP delivery — from one tenant account.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/signup" className="btn-fill inline-flex items-center justify-center gap-2 bg-[#6366f1] text-white px-5 py-3 rounded-md font-medium text-sm no-underline hover:bg-[#4f46e5]">
                Create a free account
                <ArrowRight size={16} />
              </Link>
              <a href="#product" className="inline-flex items-center justify-center bg-white text-[#1e293b] border border-[#cbd5e1] px-5 py-3 rounded-md font-medium text-sm no-underline hover:bg-[#f1f5f9]">
                Tour the product
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#64748b]">
              <span className="inline-flex items-center gap-2"><CheckCircle2 size={14} className="text-[#6366f1]" /> PDF challans</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 size={14} className="text-[#6366f1]" /> QR on every job</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 size={14} className="text-[#6366f1]" /> OTP at pickup</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <DashboardPreview />
          </motion.div>
        </div>
      </section>

      <section id="product" className="scroll-mt-20 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">Click through the workspace</h2>
              <p className="text-[#64748b] text-lg mb-0">Open a screen the way a tenant would. The stage on the right is the live preview.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#64748b] tabular-nums">
                {String(activeIndex + 1).padStart(2, '0')} / {String(SHOWCASE.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                aria-label="Previous screen"
                onClick={() => setActive(SHOWCASE[(activeIndex - 1 + SHOWCASE.length) % SHOWCASE.length].id)}
                className="w-10 h-10 rounded-md border border-[#cbd5e1] bg-white flex items-center justify-center hover:bg-[#f1f5f9]"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Next screen"
                onClick={() => setActive(SHOWCASE[(activeIndex + 1) % SHOWCASE.length].id)}
                className="btn-fill w-10 h-10 rounded-md bg-[#6366f1] flex items-center justify-center hover:bg-[#4f46e5]"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-[#e2e8f0] bg-white overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-4 md:px-6 h-14 border-b border-[#e2e8f0] bg-[#f1f5f9]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="brand-mark w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white">
                  <FileText size={15} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold leading-tight">AutoMan Computers</div>
                  <div className="text-xs text-[#64748b]">Tenant workspace</div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-[#64748b]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Signed in
              </div>
            </div>

            <div className="grid lg:grid-cols-[232px_1fr]">
              <div className="workspace-nav flex lg:flex-col gap-1 p-3 overflow-x-auto border-b lg:border-b-0 lg:border-r border-[#e2e8f0]">
                {SHOWCASE.map((item) => {
                  const Icon = item.icon;
                  const selected = item.id === active;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActive(item.id)}
                      className={`shrink-0 lg:w-full text-left rounded-xl px-3 py-2.5 flex items-center gap-3 transition-colors ${
                        selected ? 'is-active text-white' : 'text-[#64748b] hover:text-[#1e293b]'
                      }`}
                    >
                      <Icon size={16} className="shrink-0" />
                      <span className="text-sm font-medium whitespace-nowrap">{item.nav}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 md:p-6 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                  >
                    <div className="mb-5 flex flex-col xl:flex-row xl:items-end justify-between gap-4">
                      <div className="max-w-xl">
                        <h3 className="text-2xl font-bold mb-1">{feature.title}</h3>
                        <p className="text-[#64748b] mb-0">{feature.blurb}</p>
                      </div>
                      <ul className="list-none p-0 m-0 space-y-1.5 shrink-0">
                        {feature.points.map((point) => (
                          <li key={point} className="flex items-center gap-2 text-xs text-[#64748b]">
                            <CheckCircle2 size={13} className="text-[#6366f1] shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {otpNote && active === 'handover' && <p className="text-sm text-red-700 mb-3">{otpNote}</p>}
                    {renderPreview()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="scroll-mt-20 py-16 px-6 border-y border-[#d5dde6]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">From intake to pickup</h2>
          <p className="text-[#64748b] text-lg mb-8 max-w-2xl">A job moves through five moments. Select a step to see what the counter does.</p>
          <div className="workflow-steps grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
            {WORKFLOW.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setStep(index)}
                className={step === index ? 'is-active' : ''}
              >
                <span className="step-index">{index + 1}</span>
                <span className="font-semibold text-sm">{item.title}</span>
              </button>
            ))}
          </div>
          <div className="rounded-lg border border-[#e2e8f0] bg-[#f1f5f9] p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-12 h-12 rounded-md bg-[#6366f1] text-white flex items-center justify-center shrink-0 text-lg font-semibold">
              {step + 1}
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">{WORKFLOW[step].title}</h3>
              <p className="text-[#64748b] mb-0 text-lg">{WORKFLOW[step].text}</p>
            </div>
            <button
              type="button"
              onClick={() => setStep((current) => (current + 1) % WORKFLOW.length)}
              className="workflow-next md:ml-auto"
            >
              Next step <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8">Everything on the tenant side</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: FileText, title: 'Professional PDFs', text: 'Each saved challan produces a downloadable receipt with your company details.' },
              { icon: QrCode, title: 'QR on the job', text: 'Open, view, and print the QR attached to a challan from the list.' },
              { icon: Mail, title: 'Email the receipt', text: 'Resend the PDF to the customer, and set the sender name they see.' },
              { icon: KeyRound, title: 'OTP delivery', text: 'Send a code to the customer email and confirm it before marking delivered.' },
              { icon: Package, title: 'Accessories checklist', text: 'Record what arrived with the device — laptop, adapter, HDD, toner, and more.' },
              { icon: ImageIcon, title: 'Condition photos', text: 'Attach images while creating the challan so the intake is documented.' },
              { icon: Palette, title: 'Design settings', text: 'Logo, theme color, font, address, phone, tagline, and footer note.' },
              { icon: Printer, title: 'Terms on the document', text: 'Write your shop terms once. They travel with the challan.' },
              { icon: Users, title: 'Team seats', text: 'Admins manage people. Staff stay on challans, without design access.' },
              { icon: BarChart3, title: 'Usage you can see', text: 'Dashboard charts plus the monthly PDF count in the sidebar.' },
              { icon: SunMoon, title: 'Light and dark', text: 'The workspace follows the counter, not the other way around.' },
              { icon: Shield, title: 'Your data, your tenant', text: 'Each shop is its own account. Staff only see that workspace.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-lg border border-[#e2e8f0] bg-white p-5">
                  <Icon size={18} className="text-[#6366f1] mb-4" />
                  <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-[#64748b] mb-0 leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="studio" className="py-16 px-6 border-y border-[#d5dde6]">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">Brand the receipt yourself</h2>
            <p className="text-[#64748b] text-lg">Pick a color. The sample challan updates the same way Design Settings recolors your PDFs.</p>
          </div>
          <BrandPreview color={brandColor} onColor={setBrandColor} />
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4">
          {[
            { icon: Clock, title: 'Pending until pickup', text: 'New challans start pending. Delivered is a separate, filterable state.' },
            { icon: Download, title: 'Download or resend', text: 'Staff can pull the PDF or email it again without rebuilding the job.' },
            { icon: Lock, title: 'Approval before access', text: 'New shops wait for approval, then land in the workspace.' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-lg border border-[#e2e8f0] bg-white p-5">
                <Icon className="text-[#6366f1] mb-4" size={20} />
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-[#64748b] mb-0">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="free" className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="p-8 md:p-12 rounded-lg border border-[#e2e8f0] bg-white">
            <p className="text-sm font-medium text-[#6366f1] mb-3">MVP subscription</p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">Free to start</h2>
            <p className="text-[#64748b] text-lg mb-8 max-w-lg">
              New accounts begin on the MVP plan with professional challans, QR codes, and a clear monthly limit.
            </p>
            <ul className="space-y-3 mb-8 text-left list-none p-0">
              {[
                '20 PDFs per month',
                '2 user accounts — 1 admin and 1 staff',
                'QR codes and OTP delivery',
                'Branded design, terms, and email sender names',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#1e293b]">
                  <CheckCircle2 size={16} className="shrink-0 text-[#6366f1]" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="btn-fill inline-flex items-center justify-center gap-2 bg-[#6366f1] text-white px-5 py-3 rounded-md font-medium text-sm no-underline hover:bg-[#4f46e5]">
              Create free account
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 px-6">
        <div className="brand-band max-w-6xl mx-auto rounded-2xl p-8 md:p-12">
          <h2 className="mb-3">Open the counter workspace.</h2>
          <p className="text-[#5c6b7e] text-lg mb-8 max-w-2xl">Sign up, wait for approval, then create the first challan with your logo on it.</p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link to="/signup" className="btn-fill px-5 py-3 rounded-md font-medium no-underline">Get started free</Link>
            <Link to="/login" className="text-[#2c3848] border border-[#d5dde6] bg-white px-5 py-3 rounded-md font-medium no-underline">Sign in</Link>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="brand-mark w-8 h-8 rounded-xl flex items-center justify-center">
                <FileText className="text-white" size={16} />
              </div>
              <span className="text-lg font-semibold">infiChallan</span>
            </div>
            <p className="text-[#64748b] max-w-sm">Challans, QR codes, customer email, and pickup confirmation for service businesses.</p>
          </div>
          <div>
            <h5 className="font-semibold mb-4 text-sm">Product</h5>
            <ul className="space-y-2 text-sm text-[#64748b] list-none p-0 m-0">
              {NAV.map((item) => (
                <li key={item.href}><a href={item.href} className="text-[#64748b] hover:text-[#1e293b] no-underline">{item.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4 text-sm">Account</h5>
            <ul className="space-y-2 text-sm text-[#64748b] list-none p-0 m-0">
              <li><Link to="/login" className="text-[#64748b] hover:text-[#1e293b] no-underline">Sign in</Link></li>
              <li><Link to="/signup" className="text-[#64748b] hover:text-[#1e293b] no-underline">Create account</Link></li>
              <li className="inline-flex items-center gap-2"><Globe size={14} /> Tenant workspace</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-[#e2e8f0] text-xs text-[#64748b]">
          © {new Date().getFullYear()} Challan Maker Enterprise.
        </div>
      </footer>
    </div>
  );
}
