import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/tracking";

/**
 * Fires a deduped Meta PageView (browser Pixel + server CAPI with shared
 * event_id) on the initial load and on every client-side route change.
 */
export const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Defer slightly so fbq has time to load on first paint.
    const t = window.setTimeout(() => {
      trackPageView();
    }, 0);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.search]);

  return null;
};
