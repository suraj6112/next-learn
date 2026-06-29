/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import { defaultCaseStudies } from "@/lib/case-study-defaults";
import CaseStudy from "@/models/CaseStudy";

export type CaseStudyData = {
  _id?: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  coverImage: string;
  city: string;
  venue?: string;
  relatedServiceSlug?: string;
  relatedLocationSlug?: string;
  eventType: string;
  objective: string;
  execution: string;
  result: string;
  highlights: string[];
  mediaUrls: string[];
  faqs: Array<{ question: string; answer: string }>;
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  eventDate?: Date | string;
};

function toCaseStudy(doc: any): CaseStudyData {
  return {
    _id: String(doc._id || ""),
    title: doc.title,
    slug: doc.slug,
    metaTitle: doc.metaTitle,
    metaDescription: doc.metaDescription,
    keywords: Array.isArray(doc.keywords) ? doc.keywords : [],
    coverImage: doc.coverImage,
    city: doc.city,
    venue: doc.venue || "",
    relatedServiceSlug: doc.relatedServiceSlug || "",
    relatedLocationSlug: doc.relatedLocationSlug || "",
    eventType: doc.eventType,
    objective: doc.objective,
    execution: doc.execution,
    result: doc.result,
    highlights: Array.isArray(doc.highlights) ? doc.highlights : [],
    mediaUrls: Array.isArray(doc.mediaUrls) ? doc.mediaUrls : [],
    faqs: Array.isArray(doc.faqs) ? doc.faqs : [],
    sortOrder: Number(doc.sortOrder) || 0,
    isFeatured: doc.isFeatured === true,
    isActive: doc.isActive !== false,
    eventDate: doc.eventDate,
  };
}

const fallbackCaseStudies: CaseStudyData[] = defaultCaseStudies.map((item) => ({ ...item }));

export async function getCaseStudies(options: { includeFallback?: boolean; includeInactive?: boolean } = {}) {
  try {
    await dbConnect();
    const filter = options.includeInactive ? {} : { isActive: true };
    const docs = await CaseStudy.find(filter).sort({ sortOrder: 1, eventDate: -1, title: 1 }).lean();
    const items = docs.map(toCaseStudy);
    return items.length > 0 || options.includeFallback === false ? items : fallbackCaseStudies;
  } catch {
    return options.includeFallback === false ? [] : fallbackCaseStudies;
  }
}

export async function getCaseStudyBySlug(slug: string) {
  const items = await getCaseStudies();
  return items.find((item) => item.slug === slug);
}
