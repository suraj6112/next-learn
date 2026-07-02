/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import SeoLocation from "@/models/SeoLocation";
import SeoService from "@/models/SeoService";
import {
  ServiceLocation,
  LocationSeoPage,
  serviceLocations as fallbackLocations,
} from "@/lib/seo-locations";
import { SeoService as SeoServiceType, servicePages as fallbackServices } from "@/lib/seo-services";

function normalizeArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
}

function normalizeFaqs(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item: any) => ({
      question: String(item?.question || "").trim(),
      answer: String(item?.answer || "").trim(),
    }))
    .filter((item) => item.question && item.answer);
}

function toService(doc: any): SeoServiceType {
  return {
    slug: doc.slug,
    title: doc.title,
    shortTitle: doc.shortTitle,
    metaTitle: doc.metaTitle,
    metaDescription: doc.metaDescription,
    keywords: normalizeArray(doc.keywords),
    category: doc.category,
    heroImage: doc.heroImage,
    videoUrl: doc.videoUrl || "",
    intro: doc.intro,
    highlights: normalizeArray(doc.highlights),
    process: normalizeArray(doc.process),
    faqs: normalizeFaqs(doc.faqs),
  };
}

function toLocation(doc: any): ServiceLocation {
  return {
    slug: doc.slug,
    city: doc.city,
    region: doc.region,
    state: doc.state,
    serviceAreas: normalizeArray(doc.serviceAreas),
    intro: doc.intro,
    videoUrl: doc.videoUrl || "",
  };
}

export async function getSeoServices(options: { includeFallback?: boolean; includeInactive?: boolean } = {}) {
  try {
    await dbConnect();
    const filter = options.includeInactive ? {} : { isActive: true };
    const docs = await SeoService.find(filter).sort({ sortOrder: 1, title: 1 }).lean();
    const services = docs.map(toService);
    return services.length > 0 || options.includeFallback === false ? services : fallbackServices;
  } catch {
    return options.includeFallback === false ? [] : fallbackServices;
  }
}

export async function getSeoLocations(options: { includeFallback?: boolean; includeInactive?: boolean } = {}) {
  try {
    await dbConnect();
    const filter = options.includeInactive ? {} : { isActive: true };
    const docs = await SeoLocation.find(filter).sort({ sortOrder: 1, city: 1 }).lean();
    const locations = docs.map(toLocation);
    return locations.length > 0 || options.includeFallback === false ? locations : fallbackLocations;
  } catch {
    return options.includeFallback === false ? [] : fallbackLocations;
  }
}

export async function getSeoServiceBySlug(slug: string) {
  const services = await getSeoServices();
  return services.find((service) => service.slug === slug);
}

export function createLocationSeoPage(service: SeoServiceType, location: ServiceLocation): LocationSeoPage {
  const slug = `${service.slug}-in-${location.slug}`;
  return {
    slug,
    service,
    location,
    title: `${service.shortTitle} in ${location.city}`,
    metaTitle: `${service.shortTitle} in ${location.city} | SKY SFX`,
    metaDescription: `Book ${service.shortTitle.toLowerCase()} in ${location.region} for weddings, corporate events, launches, sangeet nights, and premium celebrations with SKY SFX.`,
    keywords: [
      `${service.shortTitle.toLowerCase()} in ${location.city.toLowerCase()}`,
      `${service.shortTitle.toLowerCase()} ${location.city.toLowerCase()}`,
      `${service.category.toLowerCase()} in ${location.city.toLowerCase()}`,
      ...service.keywords,
    ],
  };
}

export async function getLocationSeoPages() {
  const [services, locations] = await Promise.all([getSeoServices(), getSeoLocations()]);
  return locations.flatMap((location) => services.map((service) => createLocationSeoPage(service, location)));
}

export async function getLocationSeoPageBySlug(slug: string) {
  const pages = await getLocationSeoPages();
  return pages.find((page) => page.slug === slug);
}

export async function getLocationSeoPagesForService(serviceSlug: string) {
  const pages = await getLocationSeoPages();
  return pages.filter((page) => page.service.slug === serviceSlug);
}
