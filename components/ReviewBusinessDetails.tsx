"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { businessProfile } from "@/lib/business-profile";
import { getVisiblePhoneContacts, useContactSettings } from "@/lib/use-contact-settings";
import SocialBrandIcon from "@/components/SocialBrandIcon";

export default function ReviewBusinessDetails() {
  const contactSettings = useContactSettings();
  const phoneContacts = getVisiblePhoneContacts(contactSettings);

  return (
    <aside className="rounded-lg bg-charcoal border border-gold/15 p-6 h-fit">
      <h3 className="font-serif text-2xl font-bold mb-4">Business Details</h3>
      <div className="space-y-3 text-sm text-white/68">
        <p>
          <span className="text-white font-semibold">Name:</span> {businessProfile.name}
        </p>
        {phoneContacts.map((item) => (
          <p key={item.key}>
            <span className="text-white font-semibold">{item.label}:</span>{" "}
            <a href={item.href} className="text-gold hover:underline">
              {item.phone}
            </a>
          </p>
        ))}
        <p>
          <span className="text-white font-semibold">Email:</span>{" "}
          <a href={`mailto:${contactSettings.email}`} className="text-gold hover:underline">
            {contactSettings.email}
          </a>
        </p>
        <p>
          <span className="text-white font-semibold">Base:</span> {contactSettings.address}
        </p>
      </div>
      <div className="border-t border-white/5 mt-6 pt-6 space-y-3">
        {["Wedding Entry", "SFX Fire Show", "Cold Pyro Entry", "Event Planning"].map((item) => (
          <div key={item} className="flex items-center gap-2 text-white/70 text-sm">
            <CheckCircle2 className="w-4 h-4 text-gold" />
            {item}
          </div>
        ))}
      </div>
      {contactSettings.instagramUrl && (
        <div className="mt-6 grid grid-cols-1 gap-2">
          <a
            href={contactSettings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/80 transition-colors hover:border-gold/30 hover:text-gold clickable"
          >
            <SocialBrandIcon type="instagram" className="h-4 w-4" />
            Instagram
          </a>
        </div>
      )}
      <Link
        href="/contact"
        className="mt-6 w-full px-6 py-3 bg-gold text-black rounded-md font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 clickable"
      >
        Book Consultation
        <ArrowRight className="w-4 h-4" />
      </Link>
    </aside>
  );
}
