import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, HelpCircle, MapPin, Sparkles } from "lucide-react";
import { getCaseStudies, getCaseStudyBySlug } from "@/lib/case-study-dynamic";
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
  const items = await getCaseStudies();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCaseStudyBySlug(slug);
  if (!item) return {};

  const siteUrl = getSiteUrl();
  const canonical = `/case-studies/${item.slug}`;

  return {
    title: item.metaTitle,
    description: item.metaDescription,
    keywords: item.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: item.metaTitle,
      description: item.metaDescription,
      url: `${siteUrl}${canonical}`,
      siteName: "SKY SFX",
      images: [
        {
          url: item.coverImage,
          width: 1200,
          height: 630,
          alt: item.title,
        },
      ],
      type: "article",
    },
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getCaseStudyBySlug(slug);
  if (!item) notFound();

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/case-studies/${item.slug}`;
  const related = await getRelatedContent({
    serviceSlug: item.relatedServiceSlug,
    locationSlug: item.relatedLocationSlug,
    exclude: { caseStudySlug: item.slug },
  });
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: item.metaDescription,
    image: item.coverImage,
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
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: item.title,
    description: item.metaDescription,
    location: {
      "@type": "Place",
      name: item.venue || item.city,
      address: item.city,
    },
    organizer: {
      "@type": "Organization",
      name: "SKY SFX",
      url: siteUrl,
    },
  };
  const faqSchema =
    item.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: item.faqs.map((faq) => ({
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
    { name: "Case Studies", url: `${siteUrl}/case-studies` },
    { name: item.title, url: pageUrl },
  ]);

  return (
    <div className="bg-black text-white min-h-screen pt-28 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="relative min-h-[72vh] flex items-end overflow-hidden border-b border-white/5">
        <Image src={item.coverImage} alt={item.title} fill priority sizes="100vw" className="object-cover opacity-42" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/78 to-black/25" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-gold uppercase mb-5">
              <MapPin className="w-4 h-4" />
              {item.city} {item.venue ? `/ ${item.venue}` : ""}
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-extrabold leading-tight">{item.title}</h1>
            <p className="text-white/72 text-base sm:text-lg mt-5 leading-relaxed font-light">{item.metaDescription}</p>
          </div>
        </div>
      </section>

      <section className="py-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          <div className="space-y-10">
            <StoryBlock label="Objective" text={item.objective} />
            <StoryBlock label="Execution" text={item.execution} />
            <StoryBlock label="Result" text={item.result} />
          </div>

          <aside className="rounded-lg bg-charcoal border border-gold/15 p-6 h-fit">
            <div className="p-3 bg-gold/10 rounded-lg border border-gold/20 w-fit text-gold mb-5">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-3">Case Details</h3>
            <div className="space-y-3 text-sm text-white/68">
              <p><span className="text-white font-semibold">City:</span> {item.city}</p>
              <p><span className="text-white font-semibold">Event:</span> {item.eventType}</p>
              {item.venue && <p><span className="text-white font-semibold">Venue:</span> {item.venue}</p>}
            </div>
            <div className="border-t border-white/5 mt-6 pt-6 space-y-3">
              {item.highlights.map((highlight) => (
                <div key={highlight} className="flex items-center gap-2 text-white/70 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-gold" />
                  {highlight}
                </div>
              ))}
            </div>
            <Link
              href={{
                pathname: "/contact",
                query: { service: item.eventType, location: item.city },
              }}
              className="mt-6 w-full px-6 py-3 bg-gold text-black rounded-md font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 clickable"
            >
              Plan Similar Event
              <ArrowRight className="w-4 h-4" />
            </Link>
          </aside>
        </div>
      </section>

      {item.mediaUrls.length > 0 && (
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold tracking-widest text-gold uppercase">Media</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3 mb-10">Event visuals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {item.mediaUrls.map((url) => (
                <div key={url} className="relative aspect-video rounded-lg overflow-hidden bg-charcoal border border-white/5">
                  {url.includes(".mp4") || url.includes("/video/") ? (
                    <video src={url} controls className="w-full h-full object-cover" />
                  ) : (
                    <Image src={url} alt={item.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-85" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {item.faqs.length > 0 && (
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold tracking-widest text-gold uppercase">FAQ</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3 mb-8">Case study questions</h2>
            <div className="space-y-4">
              {item.faqs.map((faq) => (
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
      <RelatedContent blogs={related.blogs} packages={related.packages} caseStudies={related.caseStudies} />
    </div>
  );
}

function StoryBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <span className="text-xs font-bold tracking-widest text-gold uppercase">{label}</span>
      <p className="text-white/70 text-base leading-8 mt-3 font-light">{text}</p>
    </div>
  );
}
