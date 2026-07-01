import Hero from "@/components/Hero";
import StatsCounter from "@/components/StatsCounter";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ReelsSection from "@/components/ReelsSection";
import FeaturedPreview from "@/components/FeaturedPreview";
import SafetyShowcase from "@/components/SafetyShowcase";
import HomeServiceExplorer from "@/components/HomeServiceExplorer";
import HomeCaseStudies from "@/components/HomeCaseStudies";
import HomePackages from "@/components/HomePackages";
import HomeSeoLinks from "@/components/HomeSeoLinks";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

export default function Home() {
  return (
    <div className="relative bg-black min-h-screen overflow-hidden">
      {/* 1. Cinematic Hero Section */}
      <Hero />

      {/* 2. Dynamic Count-Up Statistics Section */}
      <StatsCounter />

      {/* 3. Function-first service discovery */}
      <HomeServiceExplorer />

      {/* 4. Before/After Transformative Comparison Slider */}
      <BeforeAfterSlider />

      {/* 5. Instagram Reels-Style short video Section */}
      <ReelsSection />

      {/* 6. Live DB-driven Featured Showcase */}
      <FeaturedPreview />

      {/* 7. Real event case studies */}
      <HomeCaseStudies />

      {/* 8. Packages and quick quote blocks */}
      <HomePackages />

      {/* 9. SEO service and city links */}
      <HomeSeoLinks />

      {/* 10. Safety & Trust Standards Panel */}
      <SafetyShowcase />

      {/* 11. Direct Booking Banner (Urgency Indicator) */}
      <section className="py-24 bg-linear-to-t from-gold/5 via-black to-black border-t border-white/5 relative">
        <div className="max-w-4xl mx-auto px-4 text-center flex flex-col items-center gap-6">
          <div className="p-3 bg-gold/10 rounded-full border border-gold/30 text-gold animate-bounce">
            <Flame className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold tracking-widest text-gold uppercase">Booking Season Open</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide">
            Ready to Make Your Celebration <span className="text-gold gold-glow-text">Historic?</span>
          </h2>
          <p className="text-white/70 text-sm sm:text-base font-light max-w-xl leading-relaxed">
            Our dates fill up extremely fast, especially for peak wedding seasons. Secure your dynamic entry choreography or certified pyro show today!
          </p>
          <Link
            href="/contact"
            className="mt-4 px-10 py-4 bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-sm rounded-md shadow-lg transition-all duration-300 flex items-center gap-2 gold-glow-btn clickable"
          >
            <span>Book Your Consultation Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
