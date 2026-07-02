"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Mail, MapPin, MessageSquare, Phone, Send, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { conversionEvents, trackEvent } from "@/lib/analytics";
import { getVisiblePhoneContacts, getWhatsappUrlFromSettings, useContactSettings } from "@/lib/use-contact-settings";
import SocialBrandIcon from "@/components/SocialBrandIcon";

function ContactFormContent() {
  const searchParams = useSearchParams();
  const prefilledService = searchParams.get("service") || "";
  const prefilledLocation = searchParams.get("location") || "";
  const prefilledRequirement = searchParams.get("requirement") || "";

  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    eventType: prefilledService || "Wedding Entries",
    eventDate: "",
    message:
      prefilledRequirement ||
      (prefilledLocation ? `I want ${prefilledService || "event service"} in ${prefilledLocation}.` : ""),
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const contactSettings = useContactSettings();
  const phoneContacts = getVisiblePhoneContacts(contactSettings);
  const whatsappUrl = getWhatsappUrlFromSettings(
    contactSettings,
    "Hello! I am on your contact page and want to discuss an event booking."
  );

  // Exit intent popup state
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [popupData, setPopupData] = useState({ name: "", mobile: "" });
  const [popupSubmitted, setPopupSubmitted] = useState(false);

  useEffect(() => {
    // Detect mouse leaving window top (Exit intent)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 20) {
        const hasSeenPopup = sessionStorage.getItem("exit_popup_seen");
        if (!hasSeenPopup) {
          setShowExitPopup(true);
          sessionStorage.setItem("exit_popup_seen", "true");
        }
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post("/api/inquiries", formData);
      const data = res.data;
      if (data.success) {
        trackEvent(conversionEvents.inquirySubmit, {
          form: "main_contact",
          event_type: formData.eventType,
        });
        setSuccess("Thank you! Your inquiry was successfully sent. Our team will contact you shortly.");
        setFormData({ name: "", mobile: "", eventType: "Wedding Entries", eventDate: "", message: "" });
      } else {
        setError(data.message || "Failed to submit form");
      }
    } catch {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePopupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!popupData.name || !popupData.mobile) return;
    setLoading(true);
    try {
      await axios.post("/api/inquiries", {
        ...popupData,
        eventType: "Quick Callback Request",
        eventDate: new Date().toISOString().split("T")[0],
        message: "Requested an urgent callback via Exit-Intent Popup.",
      });
      trackEvent(conversionEvents.inquirySubmit, {
        form: "exit_popup",
        event_type: "Quick Callback Request",
      });
      setPopupSubmitted(true);
      setTimeout(() => {
        setShowExitPopup(false);
      }, 2500);
    } catch {
      // Gracefully ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[10%] left-[-15%] w-[400px] h-[400px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">Let&apos;s Connect</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white mt-2 leading-tight">
            Initiate Your <span className="text-gold gold-glow-text">Production</span>
          </h1>
          <p className="text-white/60 text-sm mt-4 font-light leading-relaxed">
            Fill out the form below to lock your booking dates or get a fully customizable free price estimation directly from our event directors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Side */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-2xl bg-charcoal border border-gold/10">
            <h2 className="text-xl font-bold tracking-wide mb-6 text-white">Get a Custom Quote</h2>

            {success && (
              <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 shrink-0" />
                  <span>{success}</span>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <a
                    href={contactSettings.phoneHref}
                    onClick={() => trackEvent(conversionEvents.phoneClick, { placement: "contact_success" })}
                    className="flex items-center justify-center gap-2 rounded-lg border border-green-500/25 bg-black/30 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:text-gold"
                  >
                    <Phone className="h-4 w-4 text-gold" />
                    Call Now
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent(conversionEvents.whatsappClick, { placement: "contact_success" })}
                    className="flex items-center justify-center gap-2 rounded-lg border border-green-500/25 bg-green-500/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-green-300 transition-colors hover:bg-green-500/15"
                  >
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 bg-black border border-white/10 hover:border-gold/30 focus:border-gold rounded-lg outline-none text-white text-sm transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-4 py-3 bg-black border border-white/10 hover:border-gold/30 focus:border-gold rounded-lg outline-none text-white text-sm transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Event Type</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black border border-white/10 hover:border-gold/30 focus:border-gold rounded-lg outline-none text-white text-sm transition-colors"
                  >
                    <option value="Wedding Entries">Wedding Entries</option>
                    <option value="Fire Shows & Pyrotechnics">Fire Shows & Pyrotechnics</option>
                    <option value="Sangeet Choreography">Sangeet Choreography</option>
                    <option value="Complete Event Management">Complete Event Management</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Event Date</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-white/10 hover:border-gold/30 focus:border-gold rounded-lg outline-none text-white text-sm transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Your Message / Requirements</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder="Share details about your setup, required choreography, or number of pyro machines..."
                  className="w-full px-4 py-3 bg-black border border-white/10 hover:border-gold/30 focus:border-gold rounded-lg outline-none text-white text-sm transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-sm rounded-lg transition-all duration-300 shadow-lg gold-glow-btn flex items-center justify-center gap-2 clickable"
              >
                {loading ? (
                  <span>Sending inquiry...</span>
                ) : (
                  <>
                    <span>Submit Inquiry</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Info side */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div className="p-8 rounded-2xl bg-charcoal border border-white/5 flex flex-col gap-7">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Fast Response</span>
                <h2 className="mt-1 text-xl font-bold tracking-wide text-white">Direct Connect</h2>
                <p className="mt-2 text-xs leading-6 text-white/50">
                  Urgent dates, venue checks, and production planning ke liye direct team se connect karein.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <a
                  href={contactSettings.phoneHref}
                  onClick={() => trackEvent(conversionEvents.phoneClick, { placement: "contact_direct_cta" })}
                  className="flex items-center justify-center gap-2 rounded-lg bg-gold px-4 py-3 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-gold-hover clickable"
                >
                  <Phone className="h-4 w-4" />
                  Call Now
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent(conversionEvents.whatsappClick, { placement: "contact_direct_cta" })}
                  className="flex items-center justify-center gap-2 rounded-lg border border-green-500/25 bg-green-500/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-green-300 transition-colors hover:bg-green-500/15 clickable"
                >
                  <MessageSquare className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>

              {contactSettings.instagramUrl && (
                <div className="rounded-xl border border-white/5 bg-black/25 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gold">View Our Work</p>
                  <div className="mt-3 grid grid-cols-1 gap-3">
                    <a
                      href={contactSettings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-gold/30 hover:text-gold clickable"
                    >
                      <SocialBrandIcon type="instagram" className="h-4 w-4" />
                      Instagram
                    </a>
                  </div>
                </div>
              )}

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-gold/5 rounded-xl border border-gold/10 text-gold shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  {phoneContacts.map((item, index) => (
                    <div key={item.key} className={index > 0 ? "mt-3 border-t border-white/5 pt-3" : ""}>
                      <h4 className={index > 0 ? "text-white/70 font-bold text-xs" : "text-white/80 font-bold text-sm"}>
                        {item.label}
                      </h4>
                      <a
                        href={item.href}
                        onClick={() =>
                          trackEvent(conversionEvents.phoneClick, {
                            placement: index === 0 ? "contact_direct_connect" : "contact_direct_connect_secondary",
                          })
                        }
                        className="text-white hover:text-gold transition-colors text-base font-semibold mt-1 block"
                      >
                        {item.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-gold/5 rounded-xl border border-gold/10 text-gold shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white/80 font-bold text-sm">{contactSettings.emailLabel}</h4>
                  <a href={`mailto:${contactSettings.email}`} className="text-white hover:text-gold transition-colors text-base font-semibold mt-1 block">
                    {contactSettings.email}
                  </a>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-gold/5 rounded-xl border border-gold/10 text-gold shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white/80 font-bold text-sm">{contactSettings.addressLabel}</h4>
                  <span className="text-white/60 text-sm font-light mt-1 block leading-relaxed">
                    {contactSettings.address}
                  </span>
                </div>
              </div>
            </div>

            {/* Safety badge */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gold/5 to-transparent border border-gold/15 flex items-start gap-4">
              <div className="p-3 bg-gold/10 rounded-full border border-gold/20 text-gold shrink-0">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-gold font-bold text-base tracking-wide">100% Risk Free Booking</h4>
                <p className="text-white/60 text-xs sm:text-sm font-light mt-1.5 leading-relaxed">
                  Date shifts are fully accommodated in case of emergency calendar modifications. No hidden service taxes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Intent Dialog Popup */}
      <AnimatePresence>
        {showExitPopup && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-charcoal border border-gold/25 p-8 rounded-2xl max-w-md w-full relative shadow-2xl"
            >
              <button
                onClick={() => setShowExitPopup(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors clickable"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center flex flex-col items-center gap-4">
                <div className="p-3 bg-gold/10 rounded-full border border-gold/25 text-gold animate-bounce">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gold gold-glow-text">Wait! Don&apos;t Go Empty Handed</h3>
                <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed">
                  Leaving so soon? Get a **Free Custom Choreography Track List & Pyro Layout Blueprint** for your wedding date! Just leave your mobile below.
                </p>

                {popupSubmitted ? (
                  <div className="w-full py-4 text-center text-sm font-bold text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg">
                    Sparkles! Callback Request Submitted.
                  </div>
                ) : (
                  <form onSubmit={handlePopupSubmit} className="w-full flex flex-col gap-3 mt-4">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={popupData.name}
                      onChange={(e) => setPopupData({ ...popupData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-white/10 hover:border-gold/30 focus:border-gold rounded-lg outline-none text-white text-xs transition-colors"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Your Mobile / WhatsApp"
                      value={popupData.mobile}
                      onChange={(e) => setPopupData({ ...popupData, mobile: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-white/10 hover:border-gold/30 focus:border-gold rounded-lg outline-none text-white text-xs transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-xs rounded-lg transition-all duration-300 clickable"
                    >
                      {loading ? "Sending..." : "Request Call Back"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  return (
    <Suspense fallback={<div className="bg-black text-white min-h-screen flex items-center justify-center">Loading contact...</div>}>
      <ContactFormContent />
    </Suspense>
  );
}
