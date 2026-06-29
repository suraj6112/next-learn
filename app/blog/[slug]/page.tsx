import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, HelpCircle, Sparkles } from "lucide-react";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/blog-dynamic";
import { getRelatedContent } from "@/lib/related-content";
import { getSiteUrl } from "@/lib/seo-services";
import { getBreadcrumbSchema } from "@/lib/site-seo";
import RelatedContent from "@/components/RelatedContent";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) return {};

  const siteUrl = getSiteUrl();
  const canonical = `/blog/${post.slug}`;

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${siteUrl}${canonical}`,
      siteName: "SKY SFX",
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/blog/${post.slug}`;
  const related = await getRelatedContent({
    serviceSlug: post.relatedServiceSlug,
    locationSlug: post.relatedLocationSlug,
    exclude: { blogSlug: post.slug },
  });
  const publishedAt = post.publishedAt ? new Date(post.publishedAt) : new Date();
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    image: post.coverImage,
    datePublished: publishedAt.toISOString(),
    dateModified: publishedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: "SKY SFX",
    },
    publisher: {
      "@type": "Organization",
      name: "SKY SFX",
    },
    mainEntityOfPage: pageUrl,
  };
  const faqSchema =
    post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Blog", url: `${siteUrl}/blog` },
    { name: post.title, url: pageUrl },
  ]);
  const paragraphs = post.content.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);

  return (
    <div className="bg-black text-white min-h-screen pt-28 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article>
        <section className="relative min-h-[70vh] flex items-end overflow-hidden border-b border-white/5">
          <Image src={post.coverImage} alt={post.title} fill priority sizes="100vw" className="object-cover opacity-42" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/78 to-black/25" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-gold uppercase mb-5">
              <CalendarDays className="w-4 h-4" />
              {publishedAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-extrabold leading-tight">{post.title}</h1>
            <p className="text-white/72 text-base sm:text-lg mt-5 leading-relaxed font-light">{post.excerpt}</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-7">
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-white/72 text-base leading-8 font-light">
                  {paragraph}
                </p>
              ))}
            </div>

            {(post.relatedServiceSlug || post.relatedLocationSlug) && (
              <div className="mt-12 p-6 rounded-lg bg-charcoal border border-gold/15">
                <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider mb-4">
                  <Sparkles className="w-4 h-4" />
                  Related SEO Links
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {post.relatedServiceSlug && (
                    <Link href={`/services/${post.relatedServiceSlug}`} className="px-5 py-3 bg-gold text-black rounded-md text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2">
                      Related Service
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  {post.relatedServiceSlug && post.relatedLocationSlug && (
                    <Link href={`/locations/${post.relatedServiceSlug}-in-${post.relatedLocationSlug}`} className="px-5 py-3 bg-white/5 border border-white/10 text-white rounded-md text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2">
                      Related City Page
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {post.faqs.length > 0 && (
          <section className="py-16 border-t border-white/5">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <span className="text-xs font-bold tracking-widest text-gold uppercase">FAQ</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3 mb-8">Common questions</h2>
              <div className="space-y-4">
                {post.faqs.map((faq) => (
                  <div key={faq.question} className="p-6 rounded-lg bg-charcoal border border-white/5">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-white">{faq.question}</h3>
                        <p className="text-white/62 text-sm leading-7 mt-2">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
      <RelatedContent blogs={related.blogs} packages={related.packages} caseStudies={related.caseStudies} />
    </div>
  );
}
