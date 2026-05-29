"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    // Only register on production-like origin (not preview in some embedded contexts).
    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        // Periodically check for updates so users don't get stuck on stale assets.
        setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
      } catch {
        // swallow — offline support is a nice-to-have, not critical
      }
    };
    // Defer to after first paint
    if ("requestIdleCallback" in window) {
      (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(register);
    } else {
      setTimeout(register, 1000);
    }
  }, []);
  return null;
}
