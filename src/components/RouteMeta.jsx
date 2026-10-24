import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://infichallan.store";
const BRAND = "InfiChallan";
const DEFAULT_DESCRIPTION =
  "InfiChallan is service challan and job card software for computer, laptop and printer repair shops. Create branded PDF challans, track jobs by QR code, email customers and verify every pickup with an OTP. Free to start.";

// Public, indexable pages. Everything else (the workspace, invites, status screens) is noindex.
const PUBLIC_PAGES = {
  "/": {
    title: `${BRAND} — Service Challan & Job Card Software for Repair Shops`,
    description: DEFAULT_DESCRIPTION,
  },
  "/signup": {
    title: `Create a free account — ${BRAND}`,
    description:
      "Start free with InfiChallan: branded service challans, QR job tracking and OTP-verified handover for your repair counter. 20 PDFs a month, no setup fees.",
  },
  "/login": {
    title: `Sign in — ${BRAND}`,
    description: "Sign in to your InfiChallan workspace to create challans, track repair jobs and hand over devices.",
  },
};

const PRIVATE_TITLES = [
  [/^\/app\/?$/, "Dashboard"],
  [/^\/app\/dashboard/, "Dashboard"],
  [/^\/app\/challans/, "Challans"],
  [/^\/app\/challan\/new/, "New challan"],
  [/^\/app\/challan\/[^/]+\/edit/, "Edit challan"],
  [/^\/app\/users/, "Team"],
  [/^\/app\/settings/, "Design settings"],
  [/^\/app\/email-settings/, "Email settings"],
  [/^\/app\/terms/, "Terms & conditions"],
  [/^\/track\//, "Track your job"],
  [/^\/pending-approval/, "Awaiting approval"],
  [/^\/accept-invite/, "Accept invite"],
  [/^\/unauthorized/, "Admins only"],
  [/^\/coming-soon/, "Coming soon"],
];

const upsertMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setCanonical = (href) => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

export default function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    const page = PUBLIC_PAGES[path];

    if (page) {
      document.title = page.title;
      upsertMeta("name", "description", page.description);
      upsertMeta("name", "robots", "index, follow, max-image-preview:large");
      upsertMeta("property", "og:title", page.title);
      upsertMeta("property", "og:description", page.description);
      upsertMeta("property", "og:url", `${SITE_URL}${path === "/" ? "/" : path}`);
      setCanonical(`${SITE_URL}${path === "/" ? "/" : path}`);
      return;
    }

    const match = PRIVATE_TITLES.find(([re]) => re.test(path));
    document.title = `${match ? match[1] : "Page not found"} — ${BRAND}`;
    upsertMeta("name", "description", DEFAULT_DESCRIPTION);
    upsertMeta("name", "robots", "noindex, nofollow");
    setCanonical(null);
  }, [pathname]);

  return null;
}
