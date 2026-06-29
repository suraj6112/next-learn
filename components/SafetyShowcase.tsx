"use client";

import { ShieldCheck, Flame, Users, Sparkles } from "lucide-react";

export default function SafetyShowcase() {
  const safetyCards = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-gold" />,
      title: "100% Certified Safe Equipment",
      description: "We use only premium, low-temperature cold-pyros and non-toxic combustion liquids that guarantee absolute crowd safety.",
    },
    {
      icon: <Users className="w-8 h-8 text-gold" />,
      title: "Highly Trained Pyrotechnicians",
      description: "Our core fire performers and crew have years of live experience and carry full on-site emergency protocols.",
    },
    {
      icon: <Flame className="w-8 h-8 text-gold" />,
      title: "Controlled Fire Measures",
      description: "All stage fire hoops, poi-spinners, and flame blasters are calibrated with precise digital safe distance boundaries.",
    },
  ];

  return (
    <section className="py-24 bg-charcoal border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">Safety & Standards</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2">
            Spectacle <span className="text-gold gold-glow-text">Without Risk</span>
          </h2>
          <p className="text-white/60 text-sm mt-4 font-light leading-relaxed">
            Your safety is our absolute priority. We combine jaw-dropping visual art with rigorous, professional security standards.
          </p>
        </div>

        {/* Safety Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {safetyCards.map((card, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-black border border-white/5 hover:border-gold/30 transition-all duration-300 flex flex-col gap-4 group hover:shadow-xl hover:shadow-gold/5"
            >
              <div className="p-3 bg-gold/5 rounded-xl border border-gold/10 w-fit group-hover:bg-gold/10 transition-colors">
                {card.icon}
              </div>
              <h3 className="text-white text-lg font-bold tracking-wide mt-2">{card.title}</h3>
              <p className="text-white/60 text-sm font-light leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
