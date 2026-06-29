import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { getLocationSeoPages, getSeoLocations } from "@/lib/seo-dynamic";

export const metadata: Metadata = {
  title: "Service Locations for Event SFX, Fire Shows and Wedding Entries | SKY SFX",
  description:
    "Find SKY SFX service pages for fire shows, cold pyro entry, wedding entry planning, choreography, event planning, and corporate SFX by city.",
  alternates: {
    canonical: "/locations",
  },
};

export const dynamic = "force-dynamic";

export default async function LocationsPage() {
  const [serviceLocations, locationSeoPages] = await Promise.all([getSeoLocations(), getLocationSeoPages()]);

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">Service Areas</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold mt-2">
            Event SFX Services <span className="text-gold gold-glow-text">By Location</span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg mt-4 font-light leading-relaxed">
            Browse city-specific pages for fire shows, cold pyro entry, wedding entries, choreography, event planning,
            and corporate stage SFX.
          </p>
        </div>

        <div className="space-y-10">
          {serviceLocations.map((location) => {
            const pages = locationSeoPages.filter((page) => page.location.slug === location.slug);
            return (
              <section key={location.slug} className="rounded-lg bg-charcoal border border-white/5 p-6 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                  <div>
                    <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-gold uppercase">
                      <MapPin className="w-4 h-4" />
                      {location.region}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-2">{location.city}</h2>
                    <p className="text-white/58 text-sm leading-6 mt-2 max-w-2xl">{location.intro}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pages.map((page) => (
                    <Link
                      key={page.slug}
                      href={`/locations/${page.slug}`}
                      className="flex items-center justify-between gap-4 rounded-lg bg-black/35 border border-white/5 hover:border-gold/30 p-4 transition-colors clickable"
                    >
                      <span className="text-sm font-semibold text-white/80">{page.title}</span>
                      <ArrowRight className="w-4 h-4 text-gold shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
