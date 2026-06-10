// Lightweight tracking helpers for Meta Pixel + UTM pass-through.
// Pixel is loaded site-wide in index.html (ID 2014599869476161).

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "fbclid",
  "gclid",
] as const;

const STORAGE_KEY = "drmba_utms";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    pintrk?: (...args: unknown[]) => void;
  }
}

/**
 * Read UTM params from current URL and persist them to sessionStorage so they
 * survive in-app navigation. Call once on app mount.
 */
export function captureUtmsFromUrl(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    UTM_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) found[k] = v;
    });
    if (Object.keys(found).length > 0) {
      const existing = getStoredUtms();
      const merged = { ...existing, ...found };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
    return getStoredUtms();
  } catch {
    return {};
  }
}

export function getStoredUtms(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/**
 * Append captured UTMs (and click IDs) to an outbound URL so destination
 * analytics (or post-click attribution) can read them.
 */
export function appendUtmsToUrl(url: string): string {
  const utms = getStoredUtms();
  if (Object.keys(utms).length === 0) return url;
  try {
    const u = new URL(url);
    Object.entries(utms).forEach(([k, v]) => {
      if (!u.searchParams.has(k)) u.searchParams.set(k, v);
    });
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Fire Meta Pixel events. Safe no-op if fbq isn't loaded yet.
 */
export function trackMeta(
  event: string,
  params?: Record<string, unknown>,
  type: "track" | "trackCustom" = "track",
): void {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    if (params) window.fbq(type, event, params);
    else window.fbq(type, event);
  } catch {
    // swallow
  }
}

/**
 * Standard handler for the "Pre-order on Amazon" button.
 * Fires Meta Lead + custom PreorderClick, then returns the UTM-decorated URL.
 */
export function trackPreorderClick(destinationUrl: string): string {
  const utms = getStoredUtms();
  trackMeta("Lead", {
    content_name: "Systems Before Scale Preorder",
    content_category: "book",
    ...utms,
  });
  trackMeta(
    "PreorderClick",
    {
      content_name: "Systems Before Scale",
      destination: "amazon",
      ...utms,
    },
    "trackCustom",
  );
  return appendUtmsToUrl(destinationUrl);
}
