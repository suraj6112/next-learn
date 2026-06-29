"use client";

import Link from "next/link";
import { Phone, MessageSquare, ClipboardList } from "lucide-react";
import { conversionEvents, trackEvent } from "@/lib/analytics";
import { getWhatsappUrlFromSettings, useContactSettings } from "@/lib/use-contact-settings";

export default function MobileActionBar() {
  const contactSettings = useContactSettings();
  const whatsappUrl = getWhatsappUrlFromSettings(contactSettings);

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-black/90 backdrop-blur-md border-t border-gold/15 py-2 px-3 flex justify-around items-center">
      {/* Call Button */}
      <a
        href={contactSettings.phoneHref}
        onClick={() => trackEvent(conversionEvents.phoneClick, { placement: "mobile_action_bar" })}
        className="flex flex-col items-center gap-1 text-white/80 hover:text-gold transition-colors duration-200"
      >
        <Phone className="w-5 h-5 text-gold" />
        <span className="text-[10px] font-medium uppercase tracking-wider">Call Now</span>
      </a>

      {/* Divider */}
      <div className="h-6 w-[1px] bg-white/10" />

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        onClick={() => trackEvent(conversionEvents.whatsappClick, { placement: "mobile_action_bar" })}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1 text-white/80 hover:text-green-400 transition-colors duration-200"
      >
        <MessageSquare className="w-5 h-5 text-green-500" />
        <span className="text-[10px] font-medium uppercase tracking-wider">WhatsApp</span>
      </a>

      {/* Divider */}
      <div className="h-6 w-[1px] bg-white/10" />

      {/* Get Quote Button */}
      <Link
        href="/contact"
        onClick={() => trackEvent(conversionEvents.quoteClick, { placement: "mobile_action_bar" })}
        className="flex flex-col items-center gap-1 text-white/80 hover:text-gold transition-colors duration-200"
      >
        <ClipboardList className="w-5 h-5 text-gold" />
        <span className="text-[10px] font-medium uppercase tracking-wider">Get Quote</span>
      </Link>
    </div>
  );
}
