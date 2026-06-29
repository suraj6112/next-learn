import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { getCaseStudies } from "@/lib/case-study-dynamic";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Case Studies | Wedding Entry, Fire Show and Event SFX Portfolio | SKY SFX",
  description:
    "Explore SKY SFX case studies for cold pyro entries, fire shows, wedding entries, destination weddings, and corporate event SFX.",
  alternates: {
    canonical: "/case-studies",
  },
};

export default async function CaseStudiesPage() {
  const items = await getCaseStudies();

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">Portfolio</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold mt-2">
            Event <span className="text-gold gold-glow-text">Case Studies</span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg mt-4 font-light leading-relaxed">
            Real event stories showing how SKY SFX plans wedding entries, fire shows, cold pyro, and stage effects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <article key={item.slug} className="rounded-lg bg-charcoal border border-white/5 overflow-hidden group">
              <Link href={`/case-studies/${item.slug}`} className="block relative aspect-video bg-black overflow-hidden">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover opacity-78 group-hover:scale-105 transition-transform duration-500"
                />
                {item.isFeatured && (
                  <span className="absolute top-4 left-4 bg-gold text-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                    Featured
                  </span>
                )}
              </Link>
              <div className="p-6">
                <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider mb-3">
                  <MapPin className="w-4 h-4" />
                  {item.city}
                </div>
                <h2 className="font-serif text-xl font-bold line-clamp-2 group-hover:text-gold transition-colors">
                  <Link href={`/case-studies/${item.slug}`}>{item.title}</Link>
                </h2>
                <p className="text-white/58 text-sm leading-7 mt-3 line-clamp-3">{item.result}</p>
                <Link href={`/case-studies/${item.slug}`} className="inline-flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider mt-5">
                  View Case Study
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
