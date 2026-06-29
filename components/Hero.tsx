"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, CheckCircle2, MessageCircle, Phone, Sparkles } from "lucide-react";
import { getWhatsappUrlFromSettings, useContactSettings } from "@/lib/use-contact-settings";

export default function Hero() {
  const contactSettings = useContactSettings();
  const whatsappUrl = getWhatsappUrlFromSettings(
    contactSettings,
    "Hello! I am visiting your website and want to inquire about a custom choreography/fire show event package."
  );

  return (
    <section className="relative flex min-h-190 h-dvh w-full items-center justify-center overflow-hidden bg-black px-4 pt-24 pb-24 sm:px-6">
      {/* Cinematic Looping Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full scale-105 object-cover opacity-45"
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-celebration-fireworks-in-the-night-sky-3765-large.mp4"
          type="video/mp4"
        />
      </video>

      {/* Radial Gold Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/55 to-black/25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_22%,#000000_92%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/80 to-transparent" />

      {/* Hero Content */}
      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-5 text-center sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex max-w-full items-center gap-2 rounded-full border border-gold/30 bg-black/35 px-3 py-1.5 backdrop-blur-md sm:px-4"
        >
          <Sparkles className="h-4 w-4 shrink-0 animate-spin text-gold" style={{ animationDuration: "6s" }} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold sm:text-xs">
            Making Every Celebration Unforgettable
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl font-serif text-4xl font-extrabold leading-[1.05] tracking-wide text-white sm:text-6xl md:text-7xl"
        >
          Grand Wedding Entries & <span className="text-gold gold-glow-text">Cinematic Fire Shows</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl text-sm font-light leading-7 text-white/72 sm:text-lg sm:leading-8"
        >
          Luxury sangeet choreography, breathtaking professional pyrotechnics, and complete event design crafted to turn your special day into a legendary production.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {["Certified SFX Team", "Wedding Ready Setups", "Fast Callback"].map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/70 backdrop-blur-sm"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
              {item}
            </span>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-3 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4"
        >
          <Link
            href="/contact"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-gold px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg transition-all duration-300 hover:bg-gold-hover sm:w-auto sm:px-8 sm:py-4 sm:text-sm gold-glow-btn"
          >
            <Calendar className="w-4 h-4" />
            Get Free Quote
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all duration-300 hover:border-gold hover:text-gold sm:w-auto sm:px-8 sm:py-4 sm:text-sm"
          >
            <MessageCircle className="w-4 h-4 text-green-400" />
            Inquire via WhatsApp
          </a>
        </motion.div>

        <motion.a
          href={contactSettings.phoneHref}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/58 transition-colors hover:text-gold"
        >
          <Phone className="h-3.5 w-3.5 text-gold" />
          <span>Direct call: {contactSettings.phone}</span>
        </motion.a>
      </div>

      {/* Floating Spark Effects (Pure CSS Animation overlay) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute bottom-[-10%] left-[20%] w-0.5 h-25 bg-linear-to-t from-gold/50 to-transparent animate-pulse" />
        <div className="absolute bottom-[-20%] left-[60%] w-0.75 h-37.5 bg-linear-to-t from-orange/50 to-transparent animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-[-5%] left-[80%] w-0.5 h-20 bg-linear-to-t from-gold/40 to-transparent animate-pulse" style={{ animationDelay: "3s" }} />
      </div>

      {/* Scroll Down Indicator */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <span className="block w-16 text-center text-[10px] font-semibold uppercase tracking-widest text-white/50">
            Scroll
          </span>
          <div className="relative h-12 w-px overflow-hidden bg-white/10">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gold animate-[bounce_2s_infinite]" />
          </div>
        </div>
      </div>
    </section>
  );
}
