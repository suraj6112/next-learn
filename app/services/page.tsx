import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Film, Flame, Sparkles } from "lucide-react";
import { getSeoServices } from "@/lib/seo-dynamic";

export const dynamic = "force-dynamic";

function getServiceIcon(category: string) {
  const value = category.toLowerCase();
  if (value.includes("fire") || value.includes("pyro")) return Flame;
  if (value.includes("video") || value.includes("media")) return Film;
  return Sparkles;
}

export default async function Services() {
  const services = await getSeoServices({ includeFallback: false });

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-24 relative">
      <div className="absolute top-[10%] left-[-10%] w-[350px] h-[350px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] bg-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">What We Offer</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white mt-2 leading-tight">
            Our Elite <span className="text-gold gold-glow-text">Services</span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg mt-4 font-light leading-relaxed">
            Browse SKY SFX services published from the admin SEO CMS. Each service page includes details, highlights,
            process, FAQs, and city-specific booking pages.
          </p>
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gold/10 border border-gold/20 text-gold rounded-md text-xs font-bold uppercase tracking-wider hover:bg-gold/15 transition-colors clickable"
          >
            Browse Services By City
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service) => {
              const Icon = getServiceIcon(service.category);
              return (
                <article
                  key={service.slug}
                  className="overflow-hidden rounded-lg bg-charcoal border border-white/5 hover:border-gold/25 transition-all duration-300 flex flex-col group hover:shadow-2xl hover:shadow-gold/5"
                >
                  <Link href={`/services/${service.slug}`} className="relative block aspect-video overflow-hidden bg-black">
                    {service.heroImage ? (
                      <Image
                        src={service.heroImage}
                        alt={service.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover opacity-75 transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-black" />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/25 to-transparent" />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold">
                      <Icon className="h-3.5 w-3.5" />
                      {service.category}
                    </span>
                    {service.videoUrl && (
                      <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/75">
                        Video
                      </span>
                    )}
                  </Link>

                  <div className="p-6 sm:p-8 flex flex-1 flex-col">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-wide mb-3 text-white group-hover:text-gold transition-colors">
                      {service.shortTitle}
                    </h2>
                    <p className="text-white/65 text-sm leading-7 mb-6 line-clamp-4">
                      {service.metaDescription}
                    </p>

                    {service.highlights.length > 0 && (
                      <ul className="space-y-3 mb-8">
                        {service.highlights.slice(0, 4).map((highlight) => (
                          <li key={highlight} className="flex items-start gap-3 text-xs sm:text-sm text-white/55">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-gold mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <Link
                      href={`/services/${service.slug}`}
                      className="mt-auto flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-hover transition-colors group/link w-fit clickable"
                    >
                      Explore Service Page
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-white/5 bg-charcoal p-10 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-gold" />
            <h2 className="mt-4 text-xl font-bold text-white">No services published yet</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/55">
              Add active SEO Services from the admin SEO CMS to show them on this page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
