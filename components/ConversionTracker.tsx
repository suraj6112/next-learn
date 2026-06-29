"use client";

import { useEffect } from "react";
import { conversionEvents, trackEvent } from "@/lib/analytics";

export default function ConversionTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      if (href.startsWith("/contact")) {
        trackEvent(conversionEvents.quoteClick, {
          placement: "site_link",
          href,
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
