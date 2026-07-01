import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { getCaseStudies } from "@/lib/case-study-dynamic";

export default async function HomeCaseStudies() {
  const items = (await getCaseStudies()).slice(0, 3);

  if (items.length === 0) return null;

  return (
    <section className="border-t border-white/5 bg-black py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Event Proof</span>
            <h2 className="mt-2 font-serif text-3xl font-bold sm:text-5xl">
              Real Event <span className="text-gold gold-glow-text">Case Studies</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/60">
              See how SKY SFX plans entries, SFX timing, stage flow, and celebration moments for real clients.
            </p>
          </div>
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-hover">
            View All Case Studies
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item) => (
            <article key={item.slug} className="group overflow-hidden rounded-lg border border-white/5 bg-charcoal">
              <Link href={`/case-studies/${item.slug}`} className="relative block aspect-video overflow-hidden bg-black">
                <Image
                  src={item.coverImage}
                  alt={item.title}
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
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold">
                  <MapPin className="h-4 w-4" />
                  {item.city}
                </div>
                <h3 className="font-serif text-xl font-bold leading-tight text-white transition-colors group-hover:text-gold">
                  <Link href={`/case-studies/${item.slug}`}>{item.title}</Link>
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-white/58">{item.result}</p>
                <Link href={`/case-studies/${item.slug}`} className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold">
                  Plan Similar Event
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
