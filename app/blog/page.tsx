import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { getBlogPosts } from "@/lib/blog-dynamic";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Event SFX Blog | Wedding Entry, Fire Show and Cold Pyro Guides | SKY SFX",
  description:
    "Read SKY SFX guides about cold pyro entry cost, wedding fire show safety, bride entry ideas, choreography, event planning, and corporate stage effects.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">Knowledge Base</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold mt-2">
            Event SFX <span className="text-gold gold-glow-text">Guides</span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg mt-4 font-light leading-relaxed">
            Practical guides for wedding entries, fire shows, cold pyro, sangeet choreography, corporate SFX, and event planning decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="rounded-lg bg-charcoal border border-white/5 overflow-hidden group">
              <Link href={`/blog/${post.slug}`} className="block relative aspect-video bg-black overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover opacity-78 group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <div className="p-6">
                <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider mb-3">
                  <BookOpen className="w-4 h-4" />
                  Guide
                </div>
                <h2 className="font-serif text-xl font-bold line-clamp-2 group-hover:text-gold transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-white/58 text-sm leading-7 mt-3 line-clamp-3">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider mt-5">
                  Read Guide
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
