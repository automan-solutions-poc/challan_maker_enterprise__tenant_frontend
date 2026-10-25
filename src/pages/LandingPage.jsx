import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Shield,
  QrCode,
  CheckCircle2,
  ArrowRight,
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
  ChevronDown,
  ClipboardList,
  BellRing,
  BadgeCheck,
  Sparkles,
  MapPin,
  Play,
} from 'lucide-react';
import {
  motion,
  animate,
  AnimatePresence,
  MotionConfig,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

const CONTACT_EMAIL = 'info@infichallan.com';
const LOCATION = 'Nashik, Maharashtra';

const NAV = [
  { href: '#product', label: 'Product' },
  { href: '#workflow', label: 'Workflow' },
  { href: '#features', label: 'Features' },
  { href: '#studio', label: 'Branding' },
  { href: '#free', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
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
  { icon: ClipboardList, title: 'Intake', text: 'Log the customer, serial number, problem, accessories, and photos of the device.' },
  { icon: FileText, title: 'Receipt', text: 'Save the challan. A branded PDF and QR code are ready to share.' },
  { icon: Clock, title: 'Track', text: 'The job sits as pending on the dashboard and in the challan list.' },
  { icon: BellRing, title: 'Notify', text: 'Email the PDF, or send an OTP when the customer comes to collect.' },
  { icon: BadgeCheck, title: 'Deliver', text: 'Verify the code and the status flips to delivered.' },
];

const STATS = [
  { value: '6-digit', label: 'OTP before every pickup' },
  { value: '0', label: 'customer contact details in the QR' },
  { value: '5', label: 'steps from intake to handover' },
  { value: '20', label: 'free PDFs every month' },
];

const FEATURES = [
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
];

const DETAILS = [
  { icon: Clock, title: 'Pending until pickup', text: 'New challans start pending. Delivered is a separate, filterable state.' },
  { icon: Download, title: 'Download or resend', text: 'Staff can pull the PDF or email it again without rebuilding the job.' },
  { icon: Lock, title: 'Approval before access', text: 'New shops wait for approval, then land in the workspace.' },
];

const FAQ = [
  {
    q: 'Do my customers need an account?',
    a: 'No. Customers receive the challan PDF by email and can scan the QR code to see the job status. The pickup code also arrives in their inbox.',
  },
  {
    q: 'What does the QR code reveal?',
    a: 'It links to a tracking page for that job — status, items, device photos, and your shop details. The code itself carries no customer contact information.',
  },
  {
    q: 'What happens after 20 PDFs in a month?',
    a: 'The MVP plan counts generated PDFs and resets every month. Reissuing the delivered copy of an existing challan does not count against the limit.',
  },
  {
    q: 'Why does a new account need approval?',
    a: 'After you verify your email, each new shop is reviewed before the workspace opens. You will see the status on the pending-approval screen.',
  },
];

const SAMPLE_JOBS = [
  { no: 'CH-1042', name: 'Asha Mehta', device: 'Laptop · SN-44190', status: 'pending' },
  { no: 'CH-1041', name: 'Ravi Kumar', device: 'Printer · SN-22018', status: 'delivered' },
  { no: 'CH-1038', name: 'Northwind Traders', device: 'Desktop · SN-11802', status: 'pending' },
];

const BRAND_COLORS = ['#4f46e5', '#0f766e', '#b45309', '#7c3aed', '#be123c'];

const EASE = [0.22, 1, 0.36, 1];
const STEP_MS = 4500;

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ value, duration = 1.4 }) {
  const [, digits = '0', suffix = ''] = String(value).match(/^(\d+)(.*)$/) || [];
  const target = Number(digits);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(reduceMotion ? target : 0);

  useEffect(() => {
    if (!inView || reduceMotion) return undefined;
    const controls = animate(0, target, {
      duration,
      ease: EASE,
      onUpdate: (latest) => setCurrent(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, target, duration]);

  return <span ref={ref} className="tabular-nums">{current}{suffix}</span>;
}

function SpotlightCard({ className = '', children }) {
  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };
  return (
    <div className={`spotlight ${className}`} onMouseMove={onMove}>
      <div className="relative">{children}</div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, lede, center = false }) {
  return (
    <Reveal className={`max-w-2xl mb-12 ${center ? 'mx-auto text-center' : ''}`}>
      <p className="eyebrow mb-[1rem]">{eyebrow}</p>
      <h2 className="display-lg mb-[1rem]">{title}</h2>
      {lede && <p className="text-lg text-[#5b6474] leading-relaxed">{lede}</p>}
    </Reveal>
  );
}

function FilmSection() {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    setStarted(true);
    videoRef.current?.play().catch(() => {});
  };

  return (
    <section id="film" className="scroll-mt-20 pt-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          center
          eyebrow="Watch the film"
          title={<>infiChallan in <em>50 seconds</em></>}
          lede="From a paper slip on the counter to an OTP-verified handover."
        />
        <Reveal>
          <div className="paper relative rounded-3xl overflow-hidden aspect-video bg-[#12141c]">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src={`${process.env.PUBLIC_URL}/videos/infichallan-promo.mp4`}
              poster={`${process.env.PUBLIC_URL}/videos/infichallan-promo-poster.jpg`}
              preload="none"
              playsInline
              controls={started}
              onEnded={() => setStarted(false)}
            />
            {!started && (
              <button
                type="button"
                onClick={start}
                aria-label="Play the infiChallan film"
                className="absolute inset-0 flex items-center justify-center group bg-[#12141c]/10 hover:bg-[#12141c]/20 transition-colors"
              >
                <span className="btn-accent w-20 h-20 md:w-24 md:h-24 rounded-full shadow-[0_0_0_10px_rgba(79,70,229,0.18)] transition-transform duration-300 group-hover:scale-105">
                  <Play size={30} className="ml-1" fill="currentColor" />
                </span>
                <span className="absolute bottom-[1.25rem] left-[1.25rem] rounded-full bg-white/90 backdrop-blur px-[0.75rem] py-1 text-xs font-medium text-[#12141c]">
                  0:50 · sound on
                </span>
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StatusPill({ status }) {
  const delivered = status === 'delivered';
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
      delivered ? 'bg-[#e7f6ef] text-[#047857]' : 'bg-[#fdf3e1] text-[#b45309]'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${delivered ? 'bg-[#10b981]' : 'bg-[#f59e0b]'}`} />
      {status}
    </span>
  );
}

function WindowChrome({ title, children }) {
  return (
    <div className="surface rounded-2xl overflow-hidden">
      <div className="flex items-center gap-[0.75rem] px-[1rem] h-10 border-b border-[#ecebe7] bg-[#fbfaf8]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#e5e3de]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#e5e3de]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#e5e3de]" />
        </div>
        <span className="text-[11px] font-medium text-[#8a909c]">{title}</span>
      </div>
      <div className="p-[1rem] md:p-5 text-[#12141c]">{children}</div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <WindowChrome title="Dashboard">
      <div className="grid grid-cols-3 gap-2.5 mb-[1rem]">
        {[
          { label: 'Total', value: '128', tone: 'text-[#12141c]' },
          { label: 'Pending', value: '17', tone: 'text-[#b45309]' },
          { label: 'Delivered', value: '111', tone: 'text-[#047857]' },
        ].map((card) => (
          <div key={card.label} className="rounded-xl bg-[#f7f6f3] border border-[#ecebe7] p-[0.75rem]">
            <div className="text-[10px] uppercase tracking-wider text-[#8a909c]">{card.label}</div>
            <div className={`text-2xl font-semibold mt-1 tabular-nums ${card.tone}`}><CountUp value={card.value} duration={1.2} /></div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-[#f7f6f3] border border-[#ecebe7] p-[0.75rem]">
        <div className="flex items-center justify-between mb-[0.75rem]">
          <span className="text-xs text-[#6b7280]">Challans this week</span>
          <BarChart3 size={14} className="text-[#4f46e5]" />
        </div>
        <div className="flex items-end gap-2 h-24">
          {[40, 62, 48, 80, 55, 92, 70].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-md bar origin-bottom"
              style={{ height: `${h}%` }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 + i * 0.06, ease: EASE }}
            />
          ))}
        </div>
      </div>
      <div className="mt-[1rem] flex items-center justify-between text-xs text-[#6b7280]">
        <span>PDF quota</span>
        <span className="text-[#12141c] font-semibold tabular-nums"><CountUp value="12" /> / 20</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-[#ecebe7] overflow-hidden">
        <motion.div
          className="h-full w-[60%] bar rounded-full origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
        />
      </div>
    </WindowChrome>
  );
}

function CreatePreview() {
  return (
    <WindowChrome title="New challan">
      <div className="grid grid-cols-2 gap-2 mb-[0.75rem]">
        {[
          ['Customer', 'Asha Mehta'],
          ['City', 'Pune'],
          ['Serial', 'SN-44190'],
          ['Warranty', 'Chargeable'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-[#f7f6f3] border border-[#ecebe7] px-[0.75rem] py-2">
            <div className="text-[10px] uppercase tracking-wider text-[#8a909c]">{label}</div>
            <div className="text-sm text-[#12141c] mt-0.5">{value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-[#f7f6f3] border border-[#ecebe7] px-[0.75rem] py-2 mb-[0.75rem]">
        <div className="text-[10px] uppercase tracking-wider text-[#8a909c]">Problem</div>
        <div className="text-sm text-[#5b6474] mt-0.5">Display flicker after drop. Adapter included.</div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-[0.75rem]">
        {['Laptop', 'Adapter', 'Carry Case'].map((tag) => (
          <span key={tag} className="text-[11px] font-medium px-2 py-1 rounded-md bg-[#eef0ff] text-[#4338ca]">
            {tag}
          </span>
        ))}
        <span className="text-[11px] px-2 py-1 rounded-md bg-white text-[#5b6474] border border-[#ecebe7] inline-flex items-center gap-1">
          <ImageIcon size={11} /> 2 photos
        </span>
      </div>
      <div className="rounded-xl border border-dashed border-[#d9d6cf] bg-[#fbfaf8] p-[0.75rem]">
        <div className="text-[10px] uppercase tracking-wider text-[#8a909c] mb-2">Live preview</div>
        <div className="bg-white rounded-lg p-[0.75rem] text-xs border border-[#ecebe7]">
          <div className="font-semibold text-sm">AutoMan Computers</div>
          <div className="text-[#8a909c]">Service challan · CH-1042</div>
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
      <div className="inline-flex gap-1 p-1 rounded-lg bg-[#f2f1ed] mb-[0.75rem]">
        {['all', 'pending', 'delivered'].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onStatus(key)}
            className={`relative px-[0.75rem] py-1.5 rounded-md text-xs font-semibold capitalize transition-colors ${
              activeStatus === key ? 'text-[#12141c]' : 'text-[#6b7280] hover:text-[#12141c]'
            }`}
          >
            {activeStatus === key && (
              <motion.span
                layoutId="library-filter"
                className="absolute inset-0 rounded-md bg-white shadow-sm"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{key}</span>
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {rows.map((job) => (
          <div key={job.no} className="flex items-center justify-between gap-[0.75rem] rounded-xl bg-[#f7f6f3] border border-[#ecebe7] px-[0.75rem] py-2.5">
            <div>
              <div className="text-sm font-semibold">{job.no} · {job.name}</div>
              <div className="text-[11px] text-[#8a909c]">{job.device}</div>
            </div>
            <StatusPill status={job.status} />
          </div>
        ))}
      </div>
      <div className="mt-[0.75rem] flex gap-[1rem] text-[11px] text-[#6b7280]">
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
      <div className="flex items-start justify-between gap-[0.75rem] mb-[1rem]">
        <div>
          <div className="text-sm font-semibold">CH-1042 · Asha Mehta</div>
          <div className="text-xs text-[#8a909c]">asha@example.com</div>
        </div>
        <motion.span
          key={delivered ? 'delivered' : 'pending'}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
        >
          <StatusPill status={delivered ? 'delivered' : 'pending'} />
        </motion.span>
      </div>
      <p className="text-xs text-[#5b6474] mb-[0.75rem]">Try the demo code <span className="text-[#12141c] font-semibold tracking-wider">482913</span>.</p>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => onCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric"
          placeholder="6-digit code"
          aria-label="Delivery code"
          className="flex-1 min-w-0 bg-white border border-[#d9d6cf] rounded-lg px-[0.75rem] py-2 text-sm tracking-[0.3em] text-[#12141c] outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10 transition"
        />
        <button type="button" onClick={onVerify} className="btn-primary-lp px-[1rem] rounded-lg text-sm">
          Verify
        </button>
      </div>
      <p className={`mt-[0.75rem] text-xs ${delivered ? 'text-[#047857]' : 'text-[#8a909c]'}`}>
        {delivered ? 'Code matched. The challan is marked delivered.' : 'The customer receives this code by email before pickup.'}
      </p>
    </WindowChrome>
  );
}

function ReceiptPaper({ color }) {
  return (
    <div className="paper rounded-2xl overflow-hidden text-[#12141c]">
      <div className="px-6 py-[1.25rem] text-white transition-colors duration-500" style={{ background: color }}>
        <div className="flex items-start justify-between gap-[1rem]">
          <div>
            <div className="text-lg font-semibold leading-tight">AutoMan Computers</div>
            <div className="text-xs text-white/75">Excellence in service · Pune</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-white/70">Service challan</div>
            <div className="text-sm font-semibold tabular-nums">CH-1042</div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between gap-[1rem] mb-[1.25rem]">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#8a909c] mb-1">Customer</div>
            <div className="text-sm font-semibold">Asha Mehta</div>
            <div className="text-xs text-[#6b7280]">Laptop · SN-44190</div>
          </div>
          <div className="w-14 h-14 rounded-lg border border-[#ecebe7] flex items-center justify-center shrink-0">
            <QrCode size={34} style={{ color }} className="transition-colors duration-500" />
          </div>
        </div>
        <div className="border-t border-[#ecebe7] text-xs">
          {[
            ['Display assembly', '1'],
            ['Diagnostic', '1'],
          ].map(([item, qty]) => (
            <div key={item} className="flex justify-between py-2.5 border-b border-[#f2f1ed]">
              <span>{item}</span><span className="text-[#6b7280]">Qty {qty}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-[1rem]">
          {['Adapter', 'Carry Case'].map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded border border-[#ecebe7] text-[#6b7280]">{tag}</span>
          ))}
        </div>
        <div className="mt-6 pt-[1rem] border-t border-dashed border-[#e5e3de] text-[11px] text-[#8a909c] italic">
          Thank you for trusting us.
        </div>
      </div>
    </div>
  );
}

function BrandPreview({ color, onColor }) {
  return (
    <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-[1.25rem] items-start">
      <div className="surface rounded-2xl p-[1.25rem]">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8a909c] mb-[0.75rem]">Theme color</div>
        <div className="flex gap-2.5 mb-6">
          {BRAND_COLORS.map((swatch) => (
            <button
              key={swatch}
              type="button"
              aria-label={`Use ${swatch}`}
              aria-pressed={color === swatch}
              onClick={() => onColor(swatch)}
              className="w-9 h-9 rounded-full transition-transform hover:scale-110"
              style={{
                background: swatch,
                boxShadow: color === swatch ? `0 0 0 2px #fff, 0 0 0 4px ${swatch}` : 'none',
              }}
            />
          ))}
        </div>
        <div className="space-y-2.5 text-sm">
          {[
            ['Company', 'AutoMan Computers'],
            ['Tagline', 'Excellence in service'],
            ['Footer note', 'Thank you for trusting us.'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-[#f7f6f3] border border-[#ecebe7] px-[0.75rem] py-2">
              <div className="text-[10px] uppercase tracking-wider text-[#8a909c]">{label}</div>
              <div className="text-[#12141c]">{value}</div>
            </div>
          ))}
        </div>
      </div>
      <ReceiptPaper color={color} />
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
        <div key={name} className="flex items-center justify-between gap-[0.75rem] py-[0.75rem] border-b border-[#ecebe7] last:border-0">
          <div className="flex items-center gap-[0.75rem]">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#eef0ff] to-[#e0e3ff] text-[#4338ca] flex items-center justify-center text-sm font-semibold">
              {name[0]}
            </div>
            <div>
              <div className="text-sm font-semibold">{name}</div>
              <div className="text-[11px] text-[#8a909c]">{access}</div>
            </div>
          </div>
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#ecebe7] text-[#5b6474]">{role}</span>
        </div>
      ))}
    </WindowChrome>
  );
}

function EmailPreview() {
  return (
    <WindowChrome title="Email settings">
      <div className="text-xs text-[#8a909c] mb-2">Customer-visible sender names</div>
      <div className="flex flex-wrap gap-2 mb-[1rem]">
        {['AutoMan Computers', 'AutoMan Service Desk'].map((name, i) => (
          <span key={name} className={`text-xs px-[0.75rem] py-1.5 rounded-md border ${i === 0 ? 'border-[#4f46e5]/40 bg-[#eef0ff] text-[#4338ca]' : 'border-[#ecebe7] text-[#5b6474]'}`}>
            {name}{i === 0 ? ' · default' : ''}
          </span>
        ))}
      </div>
      <div className="rounded-xl bg-[#f7f6f3] border border-[#ecebe7] text-[#12141c] p-[1rem] text-sm">
        <div className="text-[11px] uppercase tracking-wider text-[#8a909c]">From</div>
        <div className="font-semibold">AutoMan Computers</div>
        <div className="mt-[0.75rem] font-semibold">Your service challan CH-1042</div>
        <p className="text-[#5b6474] text-xs mt-1">PDF attached. Scan the QR or reply with the pickup code when you collect the device.</p>
      </div>
    </WindowChrome>
  );
}

function HeroVisual() {
  const reduceMotion = useReducedMotion();
  const float = (distance, duration) => (reduceMotion ? {} : {
    animate: { y: [0, -distance, 0] },
    transition: { duration, repeat: Infinity, ease: 'easeInOut' },
  });

  return (
    <div className="relative lg:pl-6">
      <div className="absolute -inset-8 hero-glow pointer-events-none" aria-hidden="true" />
      <div className="relative">
        <DashboardPreview />
      </div>

      <motion.div
        className="hidden sm:block absolute z-10 -left-12 -bottom-24 w-56"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
      >
        <motion.div {...float(6, 6)} className="surface-float rounded-xl p-[1rem]">
          <div className="flex items-center justify-between mb-[0.75rem]">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#8a909c]">Challan PDF</div>
              <div className="text-sm font-semibold text-[#12141c]">CH-1042</div>
            </div>
            <QrCode size={28} className="text-[#4f46e5]" />
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 rounded-full bg-[#ecebe7] w-full" />
            <div className="h-1.5 rounded-full bg-[#ecebe7] w-4/5" />
            <div className="h-1.5 rounded-full bg-[#ecebe7] w-3/5" />
          </div>
          <div className="mt-[0.75rem] inline-flex items-center gap-1.5 text-[11px] text-[#5b6474]">
            <Mail size={12} /> Emailed to customer
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="hidden sm:block absolute z-10 -right-4 -top-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
      >
        <motion.div {...float(5, 5)} className="surface-float rounded-full pl-2 pr-[1rem] py-2 flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-[#e7f6ef] text-[#047857] flex items-center justify-center">
            <BadgeCheck size={16} />
          </span>
          <div className="leading-tight">
            <div className="text-xs font-semibold text-[#12141c]">OTP verified</div>
            <div className="text-[10px] text-[#8a909c]">CH-1041 · delivered</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#e5e3de]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-6 py-[1.25rem] text-left text-[#12141c]"
      >
        <span className="text-base md:text-lg font-medium">{q}</span>
        <ChevronDown size={18} className={`shrink-0 text-[#8a909c] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="pb-[1.25rem] pr-10 text-[#5b6474] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('dashboard');
  const [step, setStep] = useState(0);
  const [listStatus, setListStatus] = useState('all');
  const [otp, setOtp] = useState('');
  const [otpNote, setOtpNote] = useState('');
  const [delivered, setDelivered] = useState(false);
  const [brandColor, setBrandColor] = useState(BRAND_COLORS[0]);

  const feature = SHOWCASE.find((item) => item.id === active) || SHOWCASE[0];
  const activeIndex = Math.max(0, SHOWCASE.findIndex((item) => item.id === active));
  const StepIcon = WORKFLOW[step].icon;

  const reduceMotion = useReducedMotion();
  const [autoplay, setAutoplay] = useState(true);
  const workflowRef = useRef(null);
  const workflowInView = useInView(workflowRef, { amount: 0.5 });
  const playing = autoplay && workflowInView && !reduceMotion;

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.3 });
  const heroParallax = useTransform(scrollY, [0, 700], [0, -56]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'smooth';
    return () => { root.style.scrollBehavior = previous; };
  }, []);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = setTimeout(() => setStep((current) => (current + 1) % WORKFLOW.length), STEP_MS);
    return () => clearTimeout(timer);
  }, [playing, step]);

  const chooseStep = (index) => {
    setAutoplay(false);
    setStep(index);
  };

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
    <MotionConfig reducedMotion="user">
    <div className="product-landing min-h-screen font-sans relative overflow-x-hidden" data-bs-theme="light">
      <style>{`
        :where(.product-landing, .product-landing *, .product-landing *::before, .product-landing *::after) {
          box-sizing: border-box;
          border-width: 0;
          border-style: solid;
          border-color: #ecebe7;
        }
        :where(.product-landing) h1,
        :where(.product-landing) h2,
        :where(.product-landing) h3,
        :where(.product-landing) h5,
        :where(.product-landing) p,
        :where(.product-landing) ul {
          margin: 0;
          padding: 0;
        }
        :where(.product-landing) a {
          color: inherit;
          text-decoration: none;
        }
        :where(.product-landing) button {
          background: transparent;
          cursor: pointer;
          padding: 0;
          font: inherit;
          color: inherit;
        }
        .product-landing {
          background: #faf9f7;
          color: #4a5262;
          -webkit-font-smoothing: antialiased;
        }
        .product-landing ::selection {
          background: rgba(79, 70, 229, 0.18);
        }
        .product-landing .display-xl,
        .product-landing .display-lg {
          font-family: 'Instrument Serif', Georgia, serif;
          font-weight: 400;
          color: #12141c;
          letter-spacing: -0.02em;
        }
        .product-landing .display-xl {
          font-size: clamp(2.6rem, 5.2vw, 4.25rem);
          line-height: 1.02;
        }
        .product-landing .display-lg {
          font-size: clamp(2.1rem, 4vw, 3.25rem);
          line-height: 1.08;
        }
        .product-landing .display-xl em,
        .product-landing .display-lg em {
          font-style: italic;
          background: linear-gradient(100deg, #4f46e5 0%, #7c3aed 60%, #a855f7 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          padding-right: 0.06em;
        }
        .product-landing .eyebrow {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #4f46e5;
        }
        .product-landing .surface {
          background: #fff;
          border: 1px solid #ecebe7;
          box-shadow: 0 1px 2px rgba(18, 20, 28, 0.04), 0 12px 32px -12px rgba(18, 20, 28, 0.10);
        }
        .product-landing .surface-float {
          background: #fff;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid #ecebe7;
          box-shadow: 0 2px 4px rgba(18, 20, 28, 0.04), 0 24px 48px -16px rgba(18, 20, 28, 0.22);
        }
        .product-landing .paper {
          background: #fff;
          border: 1px solid #ecebe7;
          box-shadow: 0 1px 2px rgba(18, 20, 28, 0.04), 0 30px 60px -24px rgba(18, 20, 28, 0.25);
        }
        .product-landing .bar {
          background: linear-gradient(180deg, #6d67f0 0%, #4f46e5 100%);
        }
        .product-landing .hero-bg {
          background:
            radial-gradient(60% 50% at 85% 10%, rgba(124, 58, 237, 0.10), transparent 70%),
            radial-gradient(50% 45% at 10% 0%, rgba(79, 70, 229, 0.10), transparent 70%);
        }
        .product-landing .hero-grid {
          background-image:
            linear-gradient(to right, rgba(18, 20, 28, 0.045) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(18, 20, 28, 0.045) 1px, transparent 1px);
          background-size: 56px 56px;
          -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 75%);
          mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 75%);
        }
        .product-landing .hero-glow {
          background: radial-gradient(closest-side, rgba(99, 91, 255, 0.18), transparent);
          filter: blur(20px);
          animation: lp-breathe 9s ease-in-out infinite;
        }
        @keyframes lp-breathe {
          0%, 100% { opacity: 0.75; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        @keyframes lp-rise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes lp-rise-scale {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to { opacity: 1; transform: none; }
        }
        .product-landing .hero-in {
          animation: lp-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .product-landing .hero-in-visual {
          animation-name: lp-rise-scale;
          animation-duration: 1s;
        }
        @keyframes lp-aurora {
          0% { transform: translate3d(-6%, -4%, 0) rotate(0deg); }
          100% { transform: translate3d(6%, 5%, 0) rotate(20deg); }
        }
        @keyframes lp-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .product-landing .scroll-progress {
          background: linear-gradient(90deg, #4f46e5, #7c3aed, #a855f7);
        }
        .product-landing .badge-shimmer {
          background:
            linear-gradient(110deg, transparent 35%, rgba(79, 70, 229, 0.10) 50%, transparent 65%) 0 0 / 200% 100%,
            rgba(255, 255, 255, 0.7);
          animation: lp-shimmer 6s linear infinite;
        }
        .product-landing .arrow {
          transition: transform 0.25s ease;
        }
        .product-landing a:hover .arrow,
        .product-landing button:hover .arrow {
          transform: translateX(3px);
        }
        .product-landing .btn-primary-lp {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #12141c;
          color: #fff;
          font-weight: 500;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          box-shadow: 0 1px 2px rgba(18, 20, 28, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }
        .product-landing .btn-primary-lp:hover {
          background: #262a36;
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 10px 24px -10px rgba(18, 20, 28, 0.5);
        }
        .product-landing .btn-accent {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(180deg, #5b54ec 0%, #4f46e5 100%);
          color: #fff;
          font-weight: 500;
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
          box-shadow: 0 1px 2px rgba(79, 70, 229, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.18);
        }
        .product-landing .btn-accent:hover {
          color: #fff;
          filter: brightness(1.06);
          transform: translateY(-1px);
          box-shadow: 0 12px 28px -10px rgba(79, 70, 229, 0.6);
        }
        .product-landing .btn-shine {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }
        .product-landing .btn-shine::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 30%, rgba(255, 255, 255, 0.32) 50%, transparent 70%);
          transform: translateX(-120%);
          transition: transform 0.8s ease;
          pointer-events: none;
        }
        .product-landing .btn-shine.bg-white::after {
          background: linear-gradient(110deg, transparent 30%, rgba(79, 70, 229, 0.14) 50%, transparent 70%);
        }
        .product-landing .btn-shine:hover::after {
          transform: translateX(120%);
        }
        .product-landing .btn-primary-lp:active,
        .product-landing .btn-accent:active,
        .product-landing .btn-ghost:active {
          transform: translateY(0) scale(0.98);
        }
        .product-landing .btn-ghost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #fff;
          color: #12141c;
          font-weight: 500;
          border: 1px solid #e5e3de;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .product-landing .btn-ghost:hover {
          background: #f7f6f3;
          border-color: #d9d6cf;
          color: #12141c;
        }
        .product-landing .nav-link-lp {
          color: #5b6474;
          transition: color 0.2s ease;
        }
        .product-landing .nav-link-lp:hover {
          color: #12141c;
        }
        .product-landing .feature-card {
          background: #fff;
          border: 1px solid #ecebe7;
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .product-landing .feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(79, 70, 229, 0.25);
          box-shadow: 0 20px 40px -20px rgba(79, 70, 229, 0.28);
        }
        .product-landing .spotlight {
          position: relative;
          overflow: hidden;
        }
        .product-landing .spotlight::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(280px circle at var(--mx, 50%) var(--my, 0%), rgba(79, 70, 229, 0.09), transparent 65%);
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }
        .product-landing .spotlight:hover::before {
          opacity: 1;
        }
        .product-landing .icon-tile {
          background: linear-gradient(180deg, #f3f2ff 0%, #e9e8ff 100%);
          color: #4f46e5;
          border: 1px solid rgba(79, 70, 229, 0.12);
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), background 0.35s ease, color 0.35s ease;
        }
        .product-landing .feature-card:hover .icon-tile {
          transform: translateY(-2px) rotate(-6deg);
          background: linear-gradient(180deg, #5b54ec 0%, #4f46e5 100%);
          color: #fff;
        }
        .product-landing .dark-panel {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background: #12141c;
          color: #c9cdd6;
        }
        .product-landing .dark-panel::before {
          content: '';
          position: absolute;
          inset: -40%;
          z-index: -1;
          background:
            radial-gradient(30% 30% at 75% 25%, rgba(124, 58, 237, 0.45), transparent 70%),
            radial-gradient(28% 28% at 25% 75%, rgba(79, 70, 229, 0.45), transparent 70%);
          animation: lp-aurora 16s ease-in-out infinite alternate;
          pointer-events: none;
        }
        .product-landing .dark-panel .display-lg {
          color: #fff;
        }
        .product-landing .dark-panel .display-lg em {
          background: linear-gradient(100deg, #a5b4fc 0%, #c4b5fd 100%);
          -webkit-background-clip: text;
          background-clip: text;
        }
        .product-landing .step-dot {
          transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
        }
        .product-landing .tour-tab {
          transition: background 0.2s ease, color 0.2s ease;
        }
        .product-landing .tour-tab:hover:not(.is-active) {
          background: #f7f6f3;
          color: #12141c;
        }
        .product-landing .tour-tab.is-active {
          color: #fff;
        }
        @media (prefers-reduced-motion: reduce) {
          .product-landing *,
          .product-landing *::before,
          .product-landing *::after {
            animation: none !important;
            transition-duration: 0.01ms !important;
          }
        }
        .product-landing .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .product-landing .no-scrollbar {
          scrollbar-width: none;
        }
      `}</style>

      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#faf9f7]/80 backdrop-blur-xl border-b border-[#ecebe7]' : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 text-[#12141c]">
            <div className="w-8 h-8 rounded-lg btn-accent">
              <FileText size={16} />
            </div>
            <span className="text-[17px] font-semibold tracking-tight">infiChallan</span>
          </a>

          <div className="hidden md:flex items-center gap-8 text-sm">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="nav-link-lp">{item.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden sm:inline-flex nav-link-lp px-[0.75rem] py-2 text-sm font-medium">
              Sign in
            </Link>
            <Link to="/signup" className="btn-primary-lp px-[1rem] py-2 rounded-full text-sm">
              Get started
            </Link>
            <button
              type="button"
              className="md:hidden p-2 text-[#12141c] rounded-lg border border-[#e5e3de] bg-white"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-[#ecebe7] bg-[#faf9f7]"
            >
              <div className="px-6 py-[1rem] flex flex-col gap-1">
                {NAV.map((item) => (
                  <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="py-2 text-[#12141c]">{item.label}</a>
                ))}
                <Link to="/login" className="py-2 text-[#12141c]" onClick={() => setMenuOpen(false)}>Sign in</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="scroll-progress absolute left-0 right-0 bottom-0 h-[2px] origin-left"
          style={{ scaleX: progress }}
          aria-hidden="true"
        />
      </nav>

      <main>

      <section id="top" className="relative pt-32 md:pt-40 pb-24 px-6">
        <div className="absolute inset-0 hero-bg pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 hero-grid pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1.12fr_0.88fr] gap-16 lg:gap-10 items-center">
          <div>
            <div className="hero-in badge-shimmer inline-flex items-center gap-2 rounded-full border border-[#e5e3de] backdrop-blur px-[0.75rem] py-1.5 text-xs font-medium text-[#5b6474] mb-7">
              <Sparkles size={13} className="text-[#4f46e5]" />
              For repair and service counters
            </div>
            <h1 className="display-xl mb-6">
              <span className="hero-in block" style={{ animationDelay: '90ms' }}>Every job in.</span>
              <span className="hero-in block" style={{ animationDelay: '180ms' }}><em>Every handover proven.</em></span>
            </h1>
            <p className="hero-in text-lg md:text-xl text-[#5b6474] max-w-xl mb-10 leading-relaxed" style={{ animationDelay: '270ms' }}>
              infiChallan is the workspace your counter staff actually open: branded challans, a live preview, QR codes, customer email, and OTP delivery — from one tenant account.
            </p>
            <div className="hero-in flex flex-col sm:flex-row gap-[0.75rem]" style={{ animationDelay: '360ms' }}>
              <Link to="/signup" className="btn-accent btn-shine px-6 py-3.5 rounded-full text-[15px]">
                Create a free account
                <ArrowRight size={16} className="arrow" />
              </Link>
              <a href="#film" className="btn-ghost px-6 py-3.5 rounded-full text-[15px]">
                <Play size={15} fill="currentColor" />
                Watch the film
              </a>
            </div>
            <div className="hero-in mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#5b6474]" style={{ animationDelay: '450ms' }}>
              {['PDF challans', 'QR on every job', 'OTP at pickup'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#4f46e5]" /> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-in hero-in-visual" style={{ animationDelay: '250ms' }}>
            <motion.div style={{ y: heroParallax }}>
              <HeroVisual />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-8">
        <Reveal className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 rounded-2xl border border-[#ecebe7] bg-white/60 divide-x divide-y md:divide-y-0 divide-[#ecebe7] overflow-hidden">
          {STATS.map((stat) => (
            <div key={stat.label} className="p-6 md:p-8">
              <div className="display-lg !text-[2.5rem] mb-1"><CountUp value={stat.value} /></div>
              <div className="text-sm text-[#5b6474]">{stat.label}</div>
            </div>
          ))}
        </Reveal>
      </section>

      <FilmSection />

      <section id="product" className="scroll-mt-20 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <SectionHeader
              eyebrow="Product tour"
              title={<>Click through the <em>workspace</em></>}
              lede="Open a screen the way a tenant would. The stage on the right is the live preview."
            />
            <div className="flex items-center gap-[0.75rem] mb-12">
              <span className="text-sm text-[#8a909c] tabular-nums">
                {String(activeIndex + 1).padStart(2, '0')} / {String(SHOWCASE.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                aria-label="Previous screen"
                onClick={() => setActive(SHOWCASE[(activeIndex - 1 + SHOWCASE.length) % SHOWCASE.length].id)}
                className="btn-ghost w-11 h-11 rounded-full"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Next screen"
                onClick={() => setActive(SHOWCASE[(activeIndex + 1) % SHOWCASE.length].id)}
                className="btn-primary-lp w-11 h-11 rounded-full"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <Reveal>
            <div className="surface rounded-3xl overflow-hidden">
              <div className="flex items-center justify-between gap-[1rem] px-[1.25rem] md:px-6 h-14 border-b border-[#ecebe7] bg-[#fbfaf8]">
                <div className="flex items-center gap-[0.75rem] min-w-0">
                  <div className="btn-accent w-8 h-8 rounded-lg shrink-0">
                    <FileText size={15} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold leading-tight text-[#12141c]">AutoMan Computers</div>
                    <div className="text-xs text-[#8a909c]">Tenant workspace</div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-[#5b6474]">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-60 animate-ping" />
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-[#10b981]" />
                  </span>
                  Signed in
                </div>
              </div>

              <div className="grid lg:grid-cols-[232px_1fr]">
                <div className="no-scrollbar flex lg:flex-col gap-1 p-[0.75rem] overflow-x-auto border-b lg:border-b-0 lg:border-r border-[#ecebe7] bg-[#fdfcfb]">
                  {SHOWCASE.map((item) => {
                    const Icon = item.icon;
                    const selected = item.id === active;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActive(item.id)}
                        className={`tour-tab relative shrink-0 lg:w-full text-left rounded-xl px-[0.75rem] py-2.5 flex items-center gap-[0.75rem] ${
                          selected ? 'is-active' : 'text-[#5b6474]'
                        }`}
                      >
                        {selected && (
                          <motion.span
                            layoutId="tour-pill"
                            className="absolute inset-0 rounded-xl bg-[#12141c] shadow-[0_8px_20px_-10px_rgba(18,20,28,0.6)]"
                            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                          />
                        )}
                        <Icon size={16} className="relative shrink-0" />
                        <span className="relative text-sm font-medium whitespace-nowrap">{item.nav}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-[1.25rem] md:p-8 min-w-0 bg-gradient-to-br from-white to-[#faf9f7]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                      transition={{ duration: 0.3, ease: EASE }}
                    >
                      <div className="mb-6 flex flex-col xl:flex-row xl:items-end justify-between gap-[1rem]">
                        <div className="max-w-xl">
                          <h3 className="text-2xl font-semibold tracking-tight text-[#12141c] mb-1.5">{feature.title}</h3>
                          <p className="text-[#5b6474]">{feature.blurb}</p>
                        </div>
                        <ul className="list-none space-y-1.5 shrink-0">
                          {feature.points.map((point) => (
                            <li key={point} className="flex items-center gap-2 text-xs text-[#5b6474]">
                              <CheckCircle2 size={13} className="text-[#4f46e5] shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {otpNote && active === 'handover' && <p className="text-sm text-[#be123c] mb-[0.75rem]">{otpNote}</p>}
                      {renderPreview()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="workflow" ref={workflowRef} className="scroll-mt-20 py-24 px-6 bg-white border-y border-[#ecebe7]">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Workflow"
            title={<>From intake <em>to pickup</em></>}
            lede="A job moves through five moments. Select a step to see what the counter does."
          />

          <Reveal className="relative mb-10">
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-px bg-[#ecebe7]" aria-hidden="true" />
            <motion.div
              className="hidden md:block absolute top-6 left-[10%] h-px bg-gradient-to-r from-[#4f46e5] to-[#7c3aed]"
              animate={{ width: `${(step / (WORKFLOW.length - 1)) * 80}%` }}
              transition={{ duration: 0.5, ease: EASE }}
              aria-hidden="true"
            />
            <div className="relative grid grid-cols-5 gap-2">
              {WORKFLOW.map((item, index) => {
                const Icon = item.icon;
                const done = index <= step;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => chooseStep(index)}
                    aria-pressed={step === index}
                    className="flex flex-col items-center gap-[0.75rem] group"
                  >
                    <motion.span
                      animate={{ scale: step === index ? 1.08 : 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                      className={`step-dot w-12 h-12 rounded-full flex items-center justify-center border ${
                        done
                          ? 'bg-[#12141c] text-white border-[#12141c]'
                          : 'bg-white text-[#8a909c] border-[#e5e3de] group-hover:text-[#12141c]'
                      } ${step === index ? 'shadow-[0_0_0_6px_rgba(79,70,229,0.12)]' : ''}`}
                    >
                      <Icon size={18} />
                    </motion.span>
                    <span className={`text-xs md:text-sm font-semibold ${step === index ? 'text-[#12141c]' : 'text-[#8a909c]'}`}>
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <div className="relative overflow-hidden rounded-3xl border border-[#ecebe7] bg-[#faf9f7] p-6 md:p-10">
            {playing && (
              <motion.div
                key={step}
                className="scroll-progress absolute left-0 bottom-0 h-[2px] w-full origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: STEP_MS / 1000, ease: 'linear' }}
                aria-hidden="true"
              />
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex flex-col md:flex-row md:items-center gap-6"
              >
                <div className="icon-tile w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
                  <StepIcon size={22} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#8a909c] mb-1">Step {step + 1} of {WORKFLOW.length}</div>
                  <h3 className="display-lg !text-[2rem] mb-2">{WORKFLOW[step].title}</h3>
                  <p className="text-[#5b6474] text-lg">{WORKFLOW[step].text}</p>
                </div>
                <button
                  type="button"
                  onClick={() => chooseStep((step + 1) % WORKFLOW.length)}
                  className="btn-primary-lp md:ml-auto px-[1.25rem] py-[0.75rem] rounded-full text-sm shrink-0 self-start md:self-auto"
                >
                  {step === WORKFLOW.length - 1 ? 'Start over' : 'Next step'} <ChevronRight size={16} className="arrow" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-20 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Features"
            title={<>Everything on the <em>tenant side</em></>}
            lede="The pieces a busy counter needs, and none of the clutter it doesn't."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[1rem]">
            {FEATURES.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} className="h-full" delay={(index % 3) * 0.08 + Math.floor(index / 3) * 0.04}>
                  <SpotlightCard className="feature-card h-full rounded-2xl p-6">
                    <div className="icon-tile w-10 h-10 rounded-xl flex items-center justify-center mb-[1.25rem]">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-base font-semibold text-[#12141c] mb-2">{item.title}</h3>
                    <p className="text-sm text-[#5b6474] leading-relaxed">{item.text}</p>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="mt-6 grid md:grid-cols-3 rounded-2xl border border-[#ecebe7] bg-white divide-y md:divide-y-0 md:divide-x divide-[#ecebe7]">
            {DETAILS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-6 flex gap-[1rem]">
                  <Icon className="text-[#4f46e5] shrink-0 mt-0.5" size={18} />
                  <div>
                    <h3 className="font-semibold text-sm text-[#12141c] mb-1">{item.title}</h3>
                    <p className="text-sm text-[#5b6474]">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      <section id="studio" className="scroll-mt-20 py-24 px-6 bg-white border-y border-[#ecebe7]">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Branding studio"
            title={<>Brand the receipt <em>yourself</em></>}
            lede="Pick a color. The sample challan updates the same way Design Settings recolors your PDFs."
          />
          <Reveal>
            <BrandPreview color={brandColor} onColor={setBrandColor} />
          </Reveal>
        </div>
      </section>

      <section id="free" className="scroll-mt-20 py-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <SectionHeader
            eyebrow="Pricing"
            title={<>Free to <em>start</em></>}
            lede="New accounts begin on the MVP plan with professional challans, QR codes, and a clear monthly limit."
          />
          <Reveal>
            <div className="dark-panel rounded-3xl p-8 md:p-10">
              <div className="flex items-start justify-between gap-[1rem] mb-8">
                <div>
                  <p className="text-sm font-medium text-[#a5b4fc] mb-2">MVP subscription</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-['Instrument_Serif'] text-6xl text-white leading-none">Free</span>
                    <span className="text-sm text-[#9aa0ad]">to start</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-[0.75rem] py-1 rounded-full bg-white/10 text-white border border-white/15">
                  Default plan
                </span>
              </div>
              <ul className="list-none space-y-3.5 mb-10">
                {[
                  '20 PDFs per month',
                  '2 user accounts — 1 admin and 1 staff',
                  'QR codes and OTP delivery',
                  'Branded design, terms, and email sender names',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-[0.75rem] text-[15px] text-[#e4e6eb]">
                    <span className="w-5 h-5 rounded-full bg-[#4f46e5]/30 text-[#c7d2fe] flex items-center justify-center shrink-0">
                      <CheckCircle2 size={13} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="btn-shine w-full inline-flex items-center justify-center gap-2 bg-white text-[#12141c] px-6 py-3.5 rounded-full font-medium text-[15px] transition hover:bg-[#eef0ff]">
                Create free account
                <ArrowRight size={16} className="arrow" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 py-24 px-6 bg-white border-y border-[#ecebe7]">
        <div className="max-w-3xl mx-auto">
          <SectionHeader eyebrow="FAQ" title={<>Questions, <em>answered</em></>} center />
          <Reveal className="border-t border-[#e5e3de]">
            {FAQ.map((item) => <FaqItem key={item.q} q={item.q} a={item.a} />)}
          </Reveal>
          <Reveal className="mt-10 text-center text-[#5b6474]">
            Still have a question? Write to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-[#4338ca] hover:underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
          </Reveal>
        </div>
      </section>

      <section className="py-24 px-6">
        <Reveal className="dark-panel max-w-6xl mx-auto rounded-3xl px-8 py-16 md:px-16 md:py-20 text-center relative overflow-hidden">
          <h2 className="display-lg mb-[1rem]">Open the <em>counter workspace.</em></h2>
          <p className="text-lg text-[#b4b9c4] mb-10 max-w-xl mx-auto">Sign up, wait for approval, then create the first challan with your logo on it.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-[0.75rem]">
            <Link to="/signup" className="btn-shine inline-flex items-center gap-2 bg-white text-[#12141c] px-6 py-3.5 rounded-full font-medium transition hover:bg-[#eef0ff]">
              Get started free <ArrowRight size={16} className="arrow" />
            </Link>
            <Link to="/login" className="inline-flex items-center text-white border border-white/20 px-6 py-3.5 rounded-full font-medium transition hover:bg-white/10">
              Sign in
            </Link>
          </div>
        </Reveal>
      </section>

      </main>

      <footer className="pt-16 pb-10 px-6 border-t border-[#ecebe7]">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-[1rem]">
              <div className="btn-accent w-8 h-8 rounded-lg">
                <FileText size={16} />
              </div>
              <span className="text-[17px] font-semibold tracking-tight text-[#12141c]">infiChallan</span>
            </div>
            <p className="text-[#5b6474] max-w-sm text-sm leading-relaxed">Challans, QR codes, customer email, and pickup confirmation for service businesses.</p>
          </div>
          <div>
            <h5 className="font-semibold mb-[1rem] text-sm text-[#12141c]">Product</h5>
            <ul className="space-y-2.5 text-sm list-none">
              {NAV.map((item) => (
                <li key={item.href}><a href={item.href} className="nav-link-lp">{item.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-[1rem] text-sm text-[#12141c]">Account</h5>
            <ul className="space-y-2.5 text-sm list-none">
              <li><Link to="/login" className="nav-link-lp">Sign in</Link></li>
              <li><Link to="/signup" className="nav-link-lp">Create account</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-[1rem] text-sm text-[#12141c]">Contact</h5>
            <address className="not-italic space-y-2.5 text-sm">
              <a href={`mailto:${CONTACT_EMAIL}`} className="nav-link-lp flex items-center gap-2 break-all">
                <Mail size={14} className="shrink-0" /> {CONTACT_EMAIL}
              </a>
              <span className="flex items-center gap-2 text-[#5b6474]">
                <MapPin size={14} className="shrink-0" /> {LOCATION}
              </span>
            </address>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 mt-12 border-t border-[#ecebe7] flex flex-col sm:flex-row justify-between gap-2 text-xs text-[#8a909c]">
          <span>© {new Date().getFullYear()} Automan Solutions.</span>
          <span>Built in {LOCATION}, India, for repair and service counters.</span>
        </div>
      </footer>
    </div>
    </MotionConfig>
  );
}
