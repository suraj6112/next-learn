import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, MapPin, PhoneCall, Sparkles } from "lucide-react";
import {
  getServiceAreaSchema,
} from "@/lib/seo-locations";
import { getLocationSeoPageBySlug, getLocationSeoPages } from "@/lib/seo-dynamic";
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
  const pages = await getLocationSeoPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLocationSeoPageBySlug(slug);

  if (!page) {
    return {};
  }

  const siteUrl = getSiteUrl();
  const canonical = `/locations/${page.slug}`;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${siteUrl}${canonical}`,
      siteName: "SKY SFX",
      images: [
        {
          url: page.service.heroImage,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
      type: "website",
    },
  };
}

export default async function LocationSeoPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getLocationSeoPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/locations/${page.slug}`;
  const related = await getRelatedContent({
    serviceSlug: page.service.slug,
    locationSlug: page.location.slug,
  });
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Locations", url: `${siteUrl}/locations` },
    { name: page.title, url: pageUrl },
  ]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Do you provide ${page.service.shortTitle} in ${page.location.city}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, SKY SFX provides ${page.service.shortTitle.toLowerCase()} in ${page.location.region} for weddings, corporate events, sangeet functions, launches, and private celebrations.`,
        },
      },
      {
        "@type": "Question",
        name: `Can ${page.service.shortTitle} be customized for venues in ${page.location.city}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, the setup is planned around venue size, event type, entry route, permissions, production schedule, and safety requirements in ${page.location.city}.`,
        },
      },
      {
        "@type": "Question",
        name: `How do I book ${page.service.shortTitle} in ${page.location.city}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Share your event date, venue, guest size, and required service through the inquiry form. The team will suggest a suitable concept and setup.",
        },
      },
    ],
  };

  return (
    <div className="bg-black text-white min-h-screen pt-28 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getServiceAreaSchema(page)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="relative min-h-[74vh] flex items-end overflow-hidden border-b border-white/5">
        <Image
          src={page.service.heroImage}
          alt={page.title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-42"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/78 to-black/25" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-gold uppercase mb-5">
              <MapPin className="w-4 h-4" />
              {page.location.region}
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-extrabold leading-tight">
              {page.service.shortTitle} in <span className="text-gold gold-glow-text">{page.location.city}</span>
            </h1>
            <p className="text-white/72 text-base sm:text-lg mt-5 leading-relaxed font-light">
              {page.metaDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                href={{
                  pathname: "/contact",
                  query: { service: page.service.shortTitle, location: page.location.city },
                }}
                className="px-8 py-3.5 bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-xs rounded-md shadow-lg transition-all duration-300 flex items-center justify-center gap-2 gold-glow-btn clickable"
              >
                Book in {page.location.city}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/services/${page.service.slug}`}
                className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-wider text-xs rounded-md transition-all duration-300 flex items-center justify-center gap-2 clickable"
              >
                View Service Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          <div>
            <span className="text-xs font-bold tracking-widest text-gold uppercase">Local Service Page</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3 mb-6">
              {page.service.shortTitle} planning for {page.location.city} events
            </h2>
            <p className="text-white/68 text-base leading-8 font-light mb-6">{page.location.intro}</p>
            <p className="text-white/68 text-base leading-8 font-light">
              SKY SFX can plan {page.service.shortTitle.toLowerCase()} for {page.location.city} weddings, sangeet nights,
              corporate events, launches, college events, private parties, and luxury celebrations. Every setup is
              adapted to venue rules, guest distance, camera angles, event flow, and production timing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
              {page.service.highlights.slice(0, 4).map((highlight) => (
                <div key={highlight} className="p-5 rounded-lg bg-charcoal border border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-gold mb-3" />
                  <p className="text-sm text-white/75 leading-relaxed">{highlight}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-lg bg-charcoal border border-gold/15 p-6 h-fit">
            <div className="p-3 bg-gold/10 rounded-lg border border-gold/20 w-fit text-gold mb-5">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-3">Get Local Quote</h3>
            <p className="text-white/58 text-sm leading-6 mb-6">
              Send your event date, venue name, city, and required effect. The team will suggest a setup for {page.location.city}.
            </p>
            <Link
              href={{
                pathname: "/contact",
                query: { service: page.service.shortTitle, location: page.location.city },
              }}
              className="w-full px-6 py-3 bg-gold text-black rounded-md font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 clickable"
            >
              Request Callback
              <ArrowRight className="w-4 h-4" />
            </Link>
          </aside>
        </div>
      </section>

      <section className="py-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">Coverage Areas</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3 mb-10">
            Areas we cover around {page.location.city}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {page.location.serviceAreas.map((area) => (
              <div key={area} className="px-4 py-4 rounded-lg bg-charcoal border border-white/5 text-center">
                <MapPin className="w-4 h-4 text-gold mx-auto mb-2" />
                <span className="text-white/72 text-xs font-semibold">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">Booking FAQ</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3 mb-8">
            {page.service.shortTitle} in {page.location.city}: common questions
          </h2>
          <div className="space-y-4">
            <div className="p-6 rounded-lg bg-charcoal border border-white/5">
              <Sparkles className="w-5 h-5 text-gold mb-3" />
              <h3 className="font-bold text-white">Do you provide {page.service.shortTitle} in {page.location.city}?</h3>
              <p className="text-white/62 text-sm leading-7 mt-2">
                Yes, SKY SFX provides {page.service.shortTitle.toLowerCase()} in {page.location.region} for weddings,
                corporate events, sangeet functions, launches, and private celebrations.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-charcoal border border-white/5">
              <Sparkles className="w-5 h-5 text-gold mb-3" />
              <h3 className="font-bold text-white">Can the setup be customized for my venue?</h3>
              <p className="text-white/62 text-sm leading-7 mt-2">
                Yes, the final setup is planned around venue size, event type, entry route, permission rules, guest
                distance, power availability, and production timing.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-charcoal border border-white/5">
              <Sparkles className="w-5 h-5 text-gold mb-3" />
              <h3 className="font-bold text-white">How early should I inquire?</h3>
              <p className="text-white/62 text-sm leading-7 mt-2">
                For wedding season and destination events, early booking is better because artist, operator, and machine
                availability can fill quickly.
              </p>
            </div>
          </div>
        </div>
      </section>
      <RelatedContent blogs={related.blogs} packages={related.packages} caseStudies={related.caseStudies} />
    </div>
  );
}
