import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blog-dynamic";
import { getCaseStudies } from "@/lib/case-study-dynamic";
import { getLocationSeoPages, getSeoServices } from "@/lib/seo-dynamic";
import { getPackages } from "@/lib/package-dynamic";
import { getSiteUrl } from "@/lib/seo-services";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [servicePages, locationSeoPages, blogPosts, packages, caseStudies] = await Promise.all([
    getSeoServices(),
    getLocationSeoPages(),
    getBlogPosts(),
    getPackages(),
    getCaseStudies(),
  ]);
  const staticRoutes = ["", "/about", "/services", "/locations", "/blog", "/packages", "/case-studies", "/gallery", "/events", "/reviews", "/contact"];
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...servicePages.map((service) => ({
      url: `${siteUrl}/services/${service.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...locationSeoPages.map((page) => ({
      url: `${siteUrl}/locations/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...packages.map((item) => ({
      url: `${siteUrl}/packages/${item.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...caseStudies.map((item) => ({
      url: `${siteUrl}/case-studies/${item.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
