/**
 * Only allow http(s) URLs on trusted API origin for window.open / print flows.
 */
export function resolveTrustedAssetUrl(pathOrUrl, apiOrigin) {
  if (!pathOrUrl) return null;
  const raw = String(pathOrUrl).trim();
  if (!raw) return null;

  if (/^https?:\/\//i.test(raw)) {
    try {
      const u = new URL(raw);
      if (!["http:", "https:"].includes(u.protocol)) return null;
      const origin = (apiOrigin || "").replace(/\/$/, "");
      if (origin && u.origin !== origin) {
        return null;
      }
      return u.href;
    } catch {
      return null;
    }
  }

  // Protocol-relative URLs and any non-http scheme (script, data, etc.).
  if (raw.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(raw)) {
    return null;
  }

  const origin = (apiOrigin || "").replace(/\/$/, "");
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${origin}${path}`;
}
