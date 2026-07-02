"use client";

import { useEffect, useState } from "react";
import { businessProfile } from "@/lib/business-profile";

export interface ContactSettings {
  phoneLabel: string;
  phone: string;
  phoneHref: string;
  phoneLabel2: string;
  phone2: string;
  phoneHref2: string;
  whatsappNumber: string;
  emailLabel: string;
  email: string;
  addressLabel: string;
  address: string;
  instagramUrl: string;
}

export const defaultContactSettings: ContactSettings = {
  phoneLabel: "Call/Call Helpline",
  phone: businessProfile.phone,
  phoneHref: businessProfile.phoneHref,
  phoneLabel2: "Alternate Call",
  phone2: "",
  phoneHref2: "",
  whatsappNumber: businessProfile.whatsappNumber,
  emailLabel: "Send Professional Email",
  email: businessProfile.email,
  addressLabel: "HQ Location",
  address: `${businessProfile.name}, ${businessProfile.city}, ${businessProfile.region}, ${businessProfile.country}`,
  instagramUrl: "",
};

export function getWhatsappUrlFromSettings(
  settings: Pick<ContactSettings, "whatsappNumber">,
  message = "Hello, I want information about your event services."
) {
  return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatWhatsAppNumber(value: string) {
  const digits = normalizeDigits(value);
  if (!digits) return "";
  if (digits.startsWith("91") && digits.length === 12) {
    return `+91 ${digits.slice(2)}`;
  }
  return value.startsWith("+") ? value : `+${value}`;
}

export function getVisiblePhoneContacts(settings: ContactSettings) {
  const contacts = [
    {
      label: settings.phoneLabel || "Call",
      phone: settings.phone,
      href: settings.phoneHref,
      key: "primary",
    },
  ];

  if (settings.phone2?.trim()) {
    contacts.push({
      label: settings.phoneLabel2 || "Alternate Call",
      phone: settings.phone2,
      href: settings.phoneHref2 || `tel:${settings.phone2.replace(/[^\d+]/g, "")}`,
      key: "secondary",
    });
    return contacts;
  }

  const primaryDigits = normalizeDigits(settings.phone);
  const whatsappDigits = normalizeDigits(settings.whatsappNumber);
  if (whatsappDigits && whatsappDigits !== primaryDigits) {
    contacts.push({
      label: "WhatsApp Number",
      phone: formatWhatsAppNumber(settings.whatsappNumber),
      href: `tel:+${whatsappDigits}`,
      key: "whatsapp",
    });
  }

  return contacts;
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
