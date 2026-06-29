"use client";

import { useEffect, useState } from "react";
import { businessProfile } from "@/lib/business-profile";

export interface ContactSettings {
  phoneLabel: string;
  phone: string;
  phoneHref: string;
  whatsappNumber: string;
  emailLabel: string;
  email: string;
  addressLabel: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
}

export const defaultContactSettings: ContactSettings = {
  phoneLabel: "Call/Call Helpline",
  phone: businessProfile.phone,
  phoneHref: businessProfile.phoneHref,
  whatsappNumber: businessProfile.whatsappNumber,
  emailLabel: "Send Professional Email",
  email: businessProfile.email,
  addressLabel: "HQ Location",
  address: `${businessProfile.name}, ${businessProfile.city}, ${businessProfile.region}, ${businessProfile.country}`,
  instagramUrl: "",
  facebookUrl: "",
};

export function getWhatsappUrlFromSettings(
  settings: Pick<ContactSettings, "whatsappNumber">,
  message = "Hello, I want information about your event services."
) {
  return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function useContactSettings() {
  const [settings, setSettings] = useState<ContactSettings>(defaultContactSettings);

  useEffect(() => {
    let isMounted = true;

    async function fetchContactSettings() {
      try {
        const res = await fetch("/api/contact-settings");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setSettings({ ...defaultContactSettings, ...json.data });
        }
      } catch {
        // Keep fallback settings.
      }
    }

    fetchContactSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  return settings;
}
