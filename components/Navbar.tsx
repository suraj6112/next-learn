"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Flame, Menu, MessageCircle, Phone, X } from "lucide-react";
import { getWhatsappUrlFromSettings, useContactSettings } from "@/lib/use-contact-settings";
import { conversionEvents, trackEvent } from "@/lib/analytics";
import SocialBrandIcon from "@/components/SocialBrandIcon";

const PRIMARY_NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const EXPLORE_NAV_ITEMS = [
  { label: "Packages", href: "/packages" },
  { label: "Blog", href: "/blog" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Locations", href: "/locations" },
  { label: "Events", href: "/events" },
  { label: "Reviews", href: "/reviews" },
];

const NAV_ITEMS = [...PRIMARY_NAV_ITEMS, ...EXPLORE_NAV_ITEMS];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const contactSettings = useContactSettings();
  const whatsappUrl = getWhatsappUrlFromSettings(contactSettings);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-black/86 backdrop-blur-md border-b border-gold/15 shadow-2xl shadow-black/30"
          : "py-5 bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 bg-gold/10">
              <Flame className="h-6 w-6 text-gold transition-colors duration-300 group-hover:text-orange" />
            </span>
            <span className="text-xl font-bold tracking-widest text-white">
              SKY<span className="text-gold">SFX</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-full px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-300 ${
                    isActive ? "bg-gold/10 text-gold" : "text-white/76 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="relative group">
              <button
                type="button"
                className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-300 ${
                  EXPLORE_NAV_ITEMS.some((item) => pathname === item.href)
                    ? "bg-gold/10 text-gold"
                    : "text-white/76 hover:bg-white/5 hover:text-white"
                }`}
              >
                Explore
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="w-56 rounded-lg bg-black/95 backdrop-blur-lg border border-gold/15 p-2 shadow-2xl">
                  {EXPLORE_NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                          isActive ? "text-gold bg-gold/10" : "text-white/75 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Call / Contact CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={contactSettings.phoneHref}
              onClick={() => trackEvent(conversionEvents.phoneClick, { placement: "navbar_desktop" })}
              className="hidden xl:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition-colors duration-300 hover:border-gold/30 hover:text-gold"
            >
              <Phone className="w-4 h-4 text-gold" />
              <span>{contactSettings.phone}</span>
            </a>
            {(contactSettings.instagramUrl || contactSettings.facebookUrl) && (
              <div className="hidden xl:flex items-center gap-2">
                {contactSettings.instagramUrl && (
                  <a
                    href={contactSettings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition-colors hover:border-gold/30 hover:text-gold"
                    aria-label="Open Instagram"
                  >
                    <SocialBrandIcon type="instagram" className="h-4 w-4" />
                  </a>
                )}
                {contactSettings.facebookUrl && (
                  <a
                    href={contactSettings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition-colors hover:border-gold/30 hover:text-gold"
                    aria-label="Open Facebook"
                  >
                    <SocialBrandIcon type="facebook" className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
            <Link
              href="/contact"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-gold hover:bg-gold-hover rounded-md transition-all duration-300 gold-glow-btn"
            >
              Get Free Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full border border-white/10 bg-white/5 p-2 text-white transition-colors hover:border-gold/30 hover:text-gold focus:outline-none"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-lg border-b border-gold/15 py-5 px-4 animate-fade-in">
          <div className="mx-auto flex max-w-md flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                    isActive ? "bg-gold/10 text-gold" : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href={contactSettings.phoneHref}
              onClick={() => {
                setIsOpen(false);
                trackEvent(conversionEvents.phoneClick, { placement: "navbar_mobile" });
              }}
              className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85"
            >
              <Phone className="w-4 h-4 text-gold" />
              <span>{contactSettings.phone}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setIsOpen(false);
                trackEvent(conversionEvents.whatsappClick, { placement: "navbar_mobile" });
              }}
              className="flex items-center justify-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-300"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </a>
            {(contactSettings.instagramUrl || contactSettings.facebookUrl) && (
              <div className="grid grid-cols-2 gap-2">
                {contactSettings.instagramUrl && (
                  <a
                    href={contactSettings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80"
                  >
                    <SocialBrandIcon type="instagram" className="h-4 w-4" />
                    Instagram
                  </a>
                )}
                {contactSettings.facebookUrl && (
                  <a
                    href={contactSettings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80"
                  >
                    <SocialBrandIcon type="facebook" className="h-4 w-4" />
                    Facebook
                  </a>
                )}
              </div>
            )}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="w-full rounded-lg bg-gold py-3 text-center text-sm font-bold uppercase tracking-wider text-black"
            >
              Get Free Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
