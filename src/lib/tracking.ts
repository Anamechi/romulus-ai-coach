// Lightweight tracking helpers for Meta Pixel + Conversions API (CAPI).
// Pixel is loaded site-wide in index.html (ID 2014599869476161).
// Server-side relay lives at supabase/functions/meta-capi.

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
const PIXEL_ID = "2014599869476161";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    pintrk?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
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
      // If fbclid is present and no fbc cookie has been set yet by the Pixel,
      // synthesize one so server-side matching works on first pageview.
      if (found.fbclid && !getCookie("_fbc")) {
        const fbc = `fb.1.${Date.now()}.${found.fbclid}`;
        try {
          document.cookie = `_fbc=${fbc}; path=/; max-age=${60 * 60 * 24 * 90}; SameSite=Lax`;
        } catch {
          // ignore
        }
      }
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

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : undefined;
}

function uuidv4(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  // Fallback (RFC4122 v4)
  const bytes = new Uint8Array(16);
  (crypto as Crypto).getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Fire Meta Pixel events. Safe no-op if fbq isn't loaded yet.
 * Pass an `eventID` in params to enable dedup with CAPI.
 */
export function trackMeta(
  event: string,
  params?: Record<string, unknown>,
  type: "track" | "trackCustom" = "track",
  eventID?: string,
): void {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    const opts = eventID ? { eventID } : undefined;
    if (params && opts) window.fbq(type, event, params, opts);
    else if (params) window.fbq(type, event, params);
    else window.fbq(type, event);
  } catch {
    // swallow
  }
}

export function trackGA(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !window.gtag) return;
  try {
    window.gtag("event", event, params || {});
  } catch {
    // swallow
  }
}

interface CapiUserData {
  em?: string;
  ph?: string;
}

interface CapiOptions {
  eventName: string;
  eventId: string;
  userData?: CapiUserData;
  customData?: Record<string, unknown>;
}

/**
 * Send the matching server-side event to our meta-capi edge function.
 * Fire-and-forget; failures are silent so they never block navigation.
 */
async function sendCapiEvent(opts: CapiOptions): Promise<void> {
  if (typeof window === "undefined") return;
  const url = `https://xxdbmkllubljncwvxkrl.supabase.co/functions/v1/meta-capi`;
  const fbp = getCookie("_fbp");
  const fbc = getCookie("_fbc");
  const payload = {
    event_name: opts.eventName,
    event_id: opts.eventId,
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: window.location.href,
    action_source: "website",
    user_data: {
      ...(opts.userData?.em ? { em: opts.userData.em } : {}),
      ...(opts.userData?.ph ? { ph: opts.userData.ph } : {}),
      ...(fbp ? { fbp } : {}),
      ...(fbc ? { fbc } : {}),
    },
    custom_data: opts.customData ?? {},
  };
  try {
    const body = JSON.stringify(payload);
    // Prefer sendBeacon so outbound clicks don't cancel the request.
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon(url, blob);
      if (ok) return;
    }
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // swallow
  }
}

/**
 * Standard handler for the "Pre-order on Amazon" button.
 * Fires deduped Meta Pixel (browser) + CAPI (server) events for Lead and
 * the custom PreorderClick, then returns the UTM-decorated destination URL.
 */
export function trackPreorderClick(destinationUrl: string): string {
  const utms = getStoredUtms();
  const leadEventId = uuidv4();
  const clickEventId = uuidv4();

  const leadCustom = {
    content_name: "Systems Before Scale Preorder",
    content_category: "book",
    ...utms,
  };
  const clickCustom = {
    content_name: "Systems Before Scale",
    destination: "amazon",
    ...utms,
  };

  // Browser pixel (with eventID for dedup)
  trackMeta("Lead", leadCustom, "track", leadEventId);
  trackMeta("PreorderClick", clickCustom, "trackCustom", clickEventId);

  // Server-side CAPI mirror
  void sendCapiEvent({
    eventName: "Lead",
    eventId: leadEventId,
    customData: leadCustom,
  });
  void sendCapiEvent({
    eventName: "PreorderClick",
    eventId: clickEventId,
    customData: clickCustom,
  });

  trackGA("preorder_click", {
    content_name: "Systems Before Scale",
    destination: "amazon",
    outbound: true,
    ...utms,
  });

  return appendUtmsToUrl(destinationUrl);
}

// Exported for future call sites that want raw access.
export { sendCapiEvent, uuidv4 };
