import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Flame, HelpCircle, MapPin, Sparkles } from "lucide-react";
import { getLocationSeoPagesForService, getSeoServiceBySlug, getSeoServices } from "@/lib/seo-dynamic";
import { getSiteUrl } from "@/lib/seo-services";
import { getBreadcrumbSchema } from "@/lib/site-seo";
import { getRelatedContent } from "@/lib/related-content";
import RelatedContent from "@/components/RelatedContent";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const services = await getSeoServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getSeoServiceBySlug(slug);

  if (!service) {
    return {};
  }

  const siteUrl = getSiteUrl();
  const canonical = `/services/${service.slug}`;

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `${siteUrl}${canonical}`,
      siteName: "SKY SFX",
      images: [
        {
          url: service.heroImage,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
      type: "website",
    },
  };
}

export default async function ServiceSeoPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getSeoServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/services/${service.slug}`;
  const serviceLocationPages = await getLocationSeoPagesForService(service.slug);
  const related = await getRelatedContent({ serviceSlug: service.slug });
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Services", url: `${siteUrl}/services` },
    { name: service.shortTitle, url: pageUrl },
  ]);
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.metaDescription,
    provider: {
      "@type": "Organization",
      name: "SKY SFX",
      url: siteUrl,
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    serviceType: service.shortTitle,
    url: pageUrl,
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="bg-black text-white min-h-screen pt-28 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="relative min-h-[76vh] flex items-end overflow-hidden border-b border-white/5">
        <Image
          src={service.heroImage}
          alt={service.title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/75 to-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-gold uppercase mb-5">
              <Sparkles className="w-4 h-4" />
              {service.category}
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-extrabold leading-tight">
              {service.title}
            </h1>
            <p className="text-white/72 text-base sm:text-lg mt-5 leading-relaxed font-light">
              {service.metaDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                href={{
                  pathname: "/contact",
                  query: { service: service.shortTitle },
                }}
                className="px-8 py-3.5 bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-xs rounded-md shadow-lg transition-all duration-300 flex items-center justify-center gap-2 gold-glow-btn clickable"
              >
                Book This Service
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/gallery"
                className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-wider text-xs rounded-md transition-all duration-300 flex items-center justify-center gap-2 clickable"
              >
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {service.videoUrl && (
        <section className="py-20 border-b border-white/5">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold tracking-widest text-gold uppercase">Service Video</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3 mb-8">
              See {service.shortTitle} in action
            </h2>
            <div className="overflow-hidden rounded-lg border border-gold/15 bg-black">
              <video
                src={service.videoUrl}
                controls
                preload="metadata"
                poster={service.heroImage}
                className="w-full aspect-video bg-black object-contain"
              />
            </div>
          </div>
        </section>
      )}

      <section className="py-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          <div>
            <span className="text-xs font-bold tracking-widest text-gold uppercase">Service Overview</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3 mb-6">
              Designed for premium event impact
            </h2>
            <p className="text-white/68 text-base leading-8 font-light">{service.intro}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
              {service.highlights.map((highlight) => (
                <div key={highlight} className="p-5 rounded-lg bg-charcoal border border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-gold mb-3" />
                  <p className="text-sm text-white/75 leading-relaxed">{highlight}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-lg bg-charcoal border border-gold/15 p-6 h-fit">
            <div className="p-3 bg-gold/10 rounded-lg border border-gold/20 w-fit text-gold mb-5">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-3">Quick Inquiry</h3>
            <p className="text-white/58 text-sm leading-6 mb-6">
              Share your event date, venue city, guest size, and required service. The team can suggest a suitable concept and setup.
            </p>
            <Link
              href={{
                pathname: "/contact",
                query: { service: service.shortTitle },
              }}
              className="w-full px-6 py-3 bg-gold text-black rounded-md font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 clickable"
            >
              Get Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </aside>
        </div>
      </section>

      <section className="py-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">How It Works</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3 mb-10">Planning and execution flow</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {service.process.map((step, index) => (
              <div key={step} className="p-6 rounded-lg bg-charcoal border border-white/5">
                <span className="text-gold font-serif text-3xl font-bold">0{index + 1}</span>
                <p className="text-white/70 text-sm leading-7 mt-4">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {serviceLocationPages.length > 0 && (
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold tracking-widest text-gold uppercase">Service Locations</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3 mb-10">
              {service.shortTitle} available by city
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {serviceLocationPages.map((locationPage) => (
                <Link
                  key={locationPage.slug}
                  href={`/locations/${locationPage.slug}`}
                  className="flex items-center justify-between gap-4 rounded-lg bg-charcoal border border-white/5 hover:border-gold/30 p-5 transition-colors clickable"
                >
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/80">
                    <MapPin className="w-4 h-4 text-gold" />
                    {locationPage.title}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gold shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">FAQ</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3 mb-8">Common questions</h2>
          <div className="space-y-4">
            {service.faqs.map((faq) => (
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
      <RelatedContent blogs={related.blogs} packages={related.packages} caseStudies={related.caseStudies} />
    </div>
  );
}
