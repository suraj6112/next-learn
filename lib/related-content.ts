import { getBlogPosts } from "@/lib/blog-dynamic";
import { getCaseStudies } from "@/lib/case-study-dynamic";
import { getPackages } from "@/lib/package-dynamic";

type RelatedContentOptions = {
  serviceSlug?: string;
  locationSlug?: string;
  limit?: number;
  exclude?: {
    blogSlug?: string;
    packageSlug?: string;
    caseStudySlug?: string;
  };
};

function matches(value: string | undefined, expected: string | undefined) {
  return !expected || value === expected;
}

export async function getRelatedContent(options: RelatedContentOptions) {
  const limit = options.limit || 3;
  const [blogs, packages, caseStudies] = await Promise.all([getBlogPosts(), getPackages(), getCaseStudies()]);

  return {
    blogs: blogs
      .filter((item) => item.slug !== options.exclude?.blogSlug)
      .filter((item) => matches(item.relatedServiceSlug, options.serviceSlug))
      .filter((item) => matches(item.relatedLocationSlug, options.locationSlug))
      .slice(0, limit),
    packages: packages
      .filter((item) => item.slug !== options.exclude?.packageSlug)
      .filter((item) => matches(item.relatedServiceSlug, options.serviceSlug))
      .filter((item) => matches(item.relatedLocationSlug, options.locationSlug))
      .slice(0, limit),
    caseStudies: caseStudies
      .filter((item) => item.slug !== options.exclude?.caseStudySlug)
      .filter((item) => matches(item.relatedServiceSlug, options.serviceSlug))
      .filter((item) => matches(item.relatedLocationSlug, options.locationSlug))
      .slice(0, limit),
  };
}
