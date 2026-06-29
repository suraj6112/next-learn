"use client";

import { motion } from "framer-motion";
import { Sparkles, Flame, Music, Globe, ArrowRight, WandSparkles, Building2 } from "lucide-react";
import Link from "next/link";

const SERVICES_DATA = [
  {
    slug: "wedding-entry",
    icon: <Flame className="w-8 h-8 text-gold" />,
    title: "Wedding Entry Choreography & Pyro",
    description: "Make your grand entrance a moment of luxury. We design synchronized groom entries, bridal walks under custom setups, and couple entries flanked by spectacular cold spark tunnels and low-lying dry-ice cloud effects.",
    details: [
      "Royal Vintage Car or ATV Entry Concepts",
      "Phoolon ki Chaadar Bridal Walkways",
      "Choreographed Classical Dancer Escorts",
      "Cold Sparklers / Sparkular Archways",
      "Dancing on Clouds (Dry-Ice) Fog Stage",
    ],
  },
  {
    slug: "sangeet-choreography",
    icon: <Music className="w-8 h-8 text-gold" />,
    title: "Sangeet & Dance Choreography",
    description: "Celebrate love through professional dance storytelling. From beginners to seasoned performers, our expert choreographers design custom medleys for sangeet nights that combine easy steps with cinematic impact.",
    details: [
      "Custom medleys for Bride & Groom families",
      "Beginner-friendly Romantic Couple Waltz & Salsa",
      "Cousins high-energy flashmob choreography",
      "Backlit Silhouette/Shadow Storytelling Acts",
      "Cute animated dance acts for kids",
    ],
  },
  {
    slug: "fire-show",
    icon: <Sparkles className="w-8 h-8 text-gold" />,
    title: "Premium Fire Shows & Pyrotechnics",
    description: "Add real flame excitement with state-regulated safety standards. Our crew delivers extreme fire acts, fire-breathing segments, coordinated poi/hoop spinners, and magnificent outdoor aerial fireworks.",
    details: [
      "Synchronized Spinning Fire Poi & hoops",
      "Thrilling Live Fire Breathers & Eaters",
      "Custom Burning Letters (e.g. initials 'M & K')",
      "Concert-style Co2 and Confetti Blasters",
      "Heavy-duty outdoor sky-shot fireworks displays",
    ],
  },
  {
    slug: "cold-pyro-entry",
    icon: <WandSparkles className="w-8 h-8 text-gold" />,
    title: "Cold Pyro Entry & Sparkular Effects",
    description: "Design a cinematic bride, groom, couple, varmala, or reception entry using cold pyro fountains, sparkular tunnels, dry ice cloud, confetti, and music-synced stage cues.",
    details: [
      "Cold Pyro Tunnel for Couple Entry",
      "Sparkular Effects for Varmala Moments",
      "Bride and Groom Entry Cue Planning",
      "Dry Ice Cloud and Confetti Add-ons",
      "Camera-friendly Machine Placement",
    ],
  },
  {
    slug: "corporate-event-sfx",
    icon: <Building2 className="w-8 h-8 text-gold" />,
    title: "Corporate Event SFX & Stage Effects",
    description: "Create high-impact product launches, award nights, annual functions, college events, and concert reveals with timed SFX, CO2, confetti, cold pyro, and stage coordination.",
    details: [
      "Product Launch Reveal Effects",
      "CO2 Jets and Confetti Blasters",
      "Award Night and Artist Entry Cues",
      "Corporate Stage Show Flow",
      "Production Team Coordination",
    ],
  },
  {
    slug: "event-planning",
    icon: <Globe className="w-8 h-8 text-gold" />,
    title: "Complete Luxury Event Planning",
    description: "Complete management of staging, production, decors, and artist coordination so you can live the experience stress-free from pre-wedding functions to the final reception dinner.",
    details: [
      "Custom royal or modern theme venue decors",
      "Concert-grade line-array sound & intelligent truss lighting",
      "Haldi, Mehendi & Cocktail sundowner setups",
      "Staging and LED screen console structures",
      "Celebrity and professional emcee bookings",
    ],
  },
];

export default function Services() {
  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-24 relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-[10%] left-[-10%] w-[350px] h-[350px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] bg-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">What We Offer</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white mt-2 leading-tight">
            Our Elite <span className="text-gold gold-glow-text">Services</span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg mt-4 font-light leading-relaxed">
            From professional choreography and safe, heart-racing pyrotechnic fire shows to end-to-end luxury event productions, we design memories that resonate.
          </p>
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gold/10 border border-gold/20 text-gold rounded-md text-xs font-bold uppercase tracking-wider hover:bg-gold/15 transition-colors clickable"
          >
            Browse Services By City
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Services Showcase Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {SERVICES_DATA.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-8 sm:p-10 rounded-2xl bg-charcoal border border-white/5 hover:border-gold/25 transition-all duration-300 flex flex-col justify-between group hover:shadow-2xl hover:shadow-gold/5"
            >
              <div>
                <div className="p-4 bg-gold/5 rounded-xl border border-gold/15 w-fit text-gold mb-6 group-hover:bg-gold/10 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-wide mb-4 text-white group-hover:text-gold transition-colors">
                  {service.title}
                </h3>
                <p className="text-white/70 text-sm sm:text-base font-light leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Sub-Items List */}
                <ul className="space-y-3 mb-8">
                  {service.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-3 text-xs sm:text-sm text-white/50">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/services/${service.slug}`}
                className="flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-hover transition-colors group/link mt-auto w-fit clickable"
              >
                Explore Service Page
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
