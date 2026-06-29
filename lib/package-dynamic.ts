/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import { defaultPackages } from "@/lib/package-defaults";
import Package from "@/models/Package";

export type PackageData = {
  _id?: string;
  name: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  coverImage: string;
  shortDescription: string;
  description: string;
  relatedServiceSlug?: string;
  relatedLocationSlug?: string;
  startingPrice?: string;
  idealFor: string[];
  inclusions: string[];
  faqs: Array<{ question: string; answer: string }>;
  isFeatured: boolean;
  sortOrder: number;
  isActive: boolean;
};

function toPackage(doc: any): PackageData {
  return {
    _id: String(doc._id || ""),
    name: doc.name,
    slug: doc.slug,
    metaTitle: doc.metaTitle,
    metaDescription: doc.metaDescription,
    keywords: Array.isArray(doc.keywords) ? doc.keywords : [],
    coverImage: doc.coverImage,
    shortDescription: doc.shortDescription,
    description: doc.description,
    relatedServiceSlug: doc.relatedServiceSlug || "",
    relatedLocationSlug: doc.relatedLocationSlug || "",
    startingPrice: doc.startingPrice || "",
    idealFor: Array.isArray(doc.idealFor) ? doc.idealFor : [],
    inclusions: Array.isArray(doc.inclusions) ? doc.inclusions : [],
    faqs: Array.isArray(doc.faqs) ? doc.faqs : [],
    isFeatured: doc.isFeatured === true,
    sortOrder: Number(doc.sortOrder) || 0,
    isActive: doc.isActive !== false,
  };
}

const fallbackPackages: PackageData[] = defaultPackages.map((item) => ({ ...item }));

export async function getPackages(options: { includeFallback?: boolean; includeInactive?: boolean } = {}) {
  try {
    await dbConnect();
    const filter = options.includeInactive ? {} : { isActive: true };
    const docs = await Package.find(filter).sort({ sortOrder: 1, name: 1 }).lean();
    const packages = docs.map(toPackage);
    return packages.length > 0 || options.includeFallback === false ? packages : fallbackPackages;
  } catch {
    return options.includeFallback === false ? [] : fallbackPackages;
  }
}

export async function getPackageBySlug(slug: string) {
  const packages = await getPackages();
  return packages.find((item) => item.slug === slug);
}
