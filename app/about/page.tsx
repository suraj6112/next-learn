"use client";

import { motion } from "framer-motion";
import { Shield, Sparkles, Smile, Star, PhoneCall } from "lucide-react";
import Link from "next/link";

export default function About() {
  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-gold/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <span className="text-xs font-bold tracking-widest text-gold uppercase">Who We Are</span>
            <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white leading-tight">
              Crafting <span className="text-gold gold-glow-text">Breathtaking</span> Moments
            </h1>
            <p className="text-white/70 text-base sm:text-lg font-light leading-relaxed">
              At **SKY SFX**, we don't just organize events; we deliver awe-inspiring visual marvels. We are a specialized collective of premium wedding choreographers, certified pyrotechnic safety experts, and high-end production designers.
            </p>
            <p className="text-white/50 text-sm font-light leading-relaxed">
              Over the past 5+ years, we have brought our magic to over 100+ high-profile weddings, corporate functions, and cultural galas. We believe that grand entries and fire shows require not just art, but rigorous precision and safety, allowing couples and audiences to experience total peace of mind.
            </p>
          </motion.div>

          {/* Right Visual Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-video rounded-2xl overflow-hidden border border-gold/20 shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"
              alt="Thematic Setup"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          </motion.div>
        </div>

        {/* Why Choose Us & Safety Core */}
        <div className="border-t border-white/5 pt-20 mb-20">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-widest text-gold uppercase">Our Core Pillars</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2">
              Why We Are <span className="text-gold gold-glow-text">The Best</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-charcoal border border-white/5 hover:border-gold/20 transition-all duration-300">
              <div className="p-4 bg-gold/5 border border-gold/15 rounded-xl text-gold w-fit mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">Absolute Safety Standards</h3>
              <p className="text-white/60 text-sm font-light leading-relaxed">
                We strictly deploy low-temperature cold fire pyrotechnics (Sparkular systems) and maintain fire protective barriers, with safety extinguishers and water-mists fully operational on every live site.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-charcoal border border-white/5 hover:border-gold/20 transition-all duration-300">
              <div className="p-4 bg-gold/5 border border-gold/15 rounded-xl text-gold w-fit mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">Elite Choreographers</h3>
              <p className="text-white/60 text-sm font-light leading-relaxed">
                Our dance crew features professional directors who design custom, beginner-friendly dance tracks and props tailored to make families of all generations look majestic on stage.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-charcoal border border-white/5 hover:border-gold/20 transition-all duration-300">
              <div className="p-4 bg-gold/5 border border-gold/15 rounded-xl text-gold w-fit mb-6">
                <Smile className="w-6 h-6" />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">Flawless Conversion</h3>
              <p className="text-white/60 text-sm font-light leading-relaxed">
                We handle the complete execution loop—music production, backdrop synchronization, light programming, and staging—so you can fully live the magic of your special day.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action card */}
        <div className="rounded-3xl border border-gold/20 bg-gradient-to-r from-gold/5 to-orange/5 p-8 sm:p-12 text-center flex flex-col items-center gap-6 max-w-4xl mx-auto shadow-2xl">
          <PhoneCall className="w-10 h-10 text-gold animate-bounce" />
          <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white">Let's Design Your Dream Event Production</h3>
          <p className="text-white/70 text-sm sm:text-base font-light max-w-lg leading-relaxed">
            Have custom requirements or a complex, high-end theme in mind? Our specialist consultants are ready to outline your master event blueprint.
          </p>
          <Link
            href="/contact"
            className="px-8 py-3.5 bg-gold hover:bg-gold-hover text-black text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-300 shadow-md gold-glow-btn clickable"
          >
            Get Free Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
