import Image from "next/image";
import Link from "next/link";
import { ArrowRight, IndianRupee, MessageSquare, Sparkles } from "lucide-react";
import { getPackages } from "@/lib/package-dynamic";

const quotePrompts = [
  "Wedding Entry Setup",
  "Cold Pyro Package",
  "Sangeet Production",
  "Complete Event Planning",
];

export default async function HomePackages() {
  const packages = (await getPackages()).slice(0, 3);

  return (
    <section className="border-t border-white/5 bg-black py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Packages & Quotes</span>
            <h2 className="mt-2 font-serif text-3xl font-bold sm:text-5xl">
              Fast <span className="text-gold gold-glow-text">Planning Blocks</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/60">
              Pick a package or send a direct quote request for the exact function you want to plan.
            </p>
          </div>
          <Link href="/packages" className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-hover">
            Compare Packages
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {packages.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {packages.map((item) => (
                <article key={item.slug} className="group overflow-hidden rounded-lg border border-white/5 bg-charcoal">
                  <Link href={`/packages/${item.slug}`} className="relative block aspect-video overflow-hidden bg-black">
                    <Image
                      src={item.coverImage}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover opacity-75 transition-transform duration-500 group-hover:scale-105"
                    />
                    {item.isFeatured && (
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                        <Sparkles className="h-3 w-3" />
                        Featured
                      </span>
                    )}
                  </Link>
                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold">
                      <IndianRupee className="h-4 w-4" />
                      {item.startingPrice || "Custom quote"}
                    </div>
                    <h3 className="line-clamp-2 font-serif text-lg font-bold leading-tight transition-colors group-hover:text-gold">
                      <Link href={`/packages/${item.slug}`}>{item.name}</Link>
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/58">{item.shortDescription}</p>
                    <Link href={`/packages/${item.slug}`} className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold">
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-white/5 bg-charcoal p-8">
              <p className="text-sm leading-7 text-white/60">
                Packages are being prepared. You can still request a custom quote for any wedding function, SFX effect, or event setup.
              </p>
            </div>
          )}

          <div className="rounded-lg border border-gold/15 bg-charcoal p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold">No Confusion</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Ask for Exact Quote</h3>
            <p className="mt-3 text-xs leading-6 text-white/55">
              Select one requirement and send it directly to the SKY SFX team.
            </p>
            <div className="mt-6 space-y-3">
              {quotePrompts.map((prompt) => (
                <Link
                  key={prompt}
                  href={`/contact?eventType=${encodeURIComponent(prompt)}&requirement=${encodeURIComponent(`I want a quote for ${prompt}. Please share options, availability, and pricing.`)}`}
                  className="flex items-center justify-between rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm font-semibold text-white/75 transition-colors hover:border-gold/30 hover:text-gold"
                >
                  {prompt}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
            <Link
              href="/contact"
              className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-gold px-5 py-3 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-gold-hover"
            >
              <MessageSquare className="h-4 w-4" />
              Custom Requirement
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
