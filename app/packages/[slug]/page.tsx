import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, HelpCircle, IndianRupee, Sparkles } from "lucide-react";
import { getPackageBySlug, getPackages } from "@/lib/package-dynamic";
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
  const packages = await getPackages();
  return packages.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPackageBySlug(slug);
  if (!item) return {};

  const siteUrl = getSiteUrl();
  const canonical = `/packages/${item.slug}`;

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
          alt: item.name,
        },
      ],
      type: "website",
    },
  };
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getPackageBySlug(slug);
  if (!item) notFound();

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/packages/${item.slug}`;
  const related = await getRelatedContent({
    serviceSlug: item.relatedServiceSlug,
    locationSlug: item.relatedLocationSlug,
    exclude: { packageSlug: item.slug },
  });
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: item.name,
    description: item.metaDescription,
    provider: {
      "@type": "Organization",
      name: "SKY SFX",
      url: siteUrl,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: item.startingPrice || "Custom quote",
      url: pageUrl,
      availability: "https://schema.org/InStock",
    },
    url: pageUrl,
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
    { name: "Packages", url: `${siteUrl}/packages` },
    { name: item.name, url: pageUrl },
  ]);

  return (
    <div className="bg-black text-white min-h-screen pt-28 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="relative min-h-[72vh] flex items-end overflow-hidden border-b border-white/5">
        <Image src={item.coverImage} alt={item.name} fill priority sizes="100vw" className="object-cover opacity-42" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/78 to-black/25" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-gold uppercase mb-5">
              <IndianRupee className="w-4 h-4" />
              {item.startingPrice || "Custom quote"}
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-extrabold leading-tight">{item.name}</h1>
            <p className="text-white/72 text-base sm:text-lg mt-5 leading-relaxed font-light">{item.shortDescription}</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                href={{
                  pathname: "/contact",
                  query: { service: item.name },
                }}
                className="px-8 py-3.5 bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-xs rounded-md shadow-lg transition-all duration-300 flex items-center justify-center gap-2 gold-glow-btn clickable"
              >
                Get Package Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
              {item.relatedServiceSlug && (
                <Link href={`/services/${item.relatedServiceSlug}`} className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-wider text-xs rounded-md transition-all duration-300 flex items-center justify-center gap-2 clickable">
                  View Service
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          <div>
            <span className="text-xs font-bold tracking-widest text-gold uppercase">Package Overview</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3 mb-6">What this package includes</h2>
            <p className="text-white/68 text-base leading-8 font-light">{item.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
              {item.inclusions.map((inclusion) => (
                <div key={inclusion} className="p-5 rounded-lg bg-charcoal border border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-gold mb-3" />
                  <p className="text-sm text-white/75 leading-relaxed">{inclusion}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-lg bg-charcoal border border-gold/15 p-6 h-fit">
            <div className="p-3 bg-gold/10 rounded-lg border border-gold/20 w-fit text-gold mb-5">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-3">Ideal For</h3>
            <div className="space-y-3">
              {item.idealFor.map((ideal) => (
                <div key={ideal} className="flex items-center gap-2 text-white/70 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-gold" />
                  {ideal}
                </div>
              ))}
            </div>
            <Link
              href={{
                pathname: "/contact",
                query: { service: item.name },
              }}
              className="mt-6 w-full px-6 py-3 bg-gold text-black rounded-md font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 clickable"
            >
              Request Price
              <ArrowRight className="w-4 h-4" />
            </Link>
          </aside>
        </div>
      </section>

      {item.faqs.length > 0 && (
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold tracking-widest text-gold uppercase">FAQ</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3 mb-8">Package questions</h2>
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
