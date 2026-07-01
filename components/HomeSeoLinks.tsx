import Link from "next/link";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { getLocationSeoPages, getSeoServices } from "@/lib/seo-dynamic";

export default async function HomeSeoLinks() {
  const [services, locationPages] = await Promise.all([
    getSeoServices(),
    getLocationSeoPages(),
  ]);

  const serviceLinks = services.slice(0, 6);
  const cityLinks = locationPages.slice(0, 8);

  if (serviceLinks.length === 0 && cityLinks.length === 0) return null;

  return (
    <section className="border-t border-white/5 bg-black py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {serviceLinks.length > 0 && (
            <div className="rounded-lg border border-white/5 bg-charcoal p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="rounded-lg border border-gold/20 bg-gold/10 p-2 text-gold">
                  <Search className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Service Pages</p>
                  <h3 className="text-xl font-bold text-white">Explore by Requirement</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {serviceLinks.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="flex min-h-14 items-center justify-between rounded-md border border-white/10 bg-black/25 px-4 py-3 text-sm font-semibold text-white/75 transition-colors hover:border-gold/30 hover:text-gold"
                  >
                    {service.shortTitle || service.title}
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {cityLinks.length > 0 && (
            <div className="rounded-lg border border-white/5 bg-charcoal p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="rounded-lg border border-gold/20 bg-gold/10 p-2 text-gold">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gold">City Landing Pages</p>
                  <h3 className="text-xl font-bold text-white">Find SKY SFX Near You</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {cityLinks.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/locations/${page.slug}`}
                    className="flex min-h-14 items-center justify-between rounded-md border border-white/10 bg-black/25 px-4 py-3 text-sm font-semibold text-white/75 transition-colors hover:border-gold/30 hover:text-gold"
                  >
                    {page.title}
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
