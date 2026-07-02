import { getSiteUrl } from "@/lib/seo-services";
import { businessProfile } from "@/lib/business-profile";

export const siteSeo = {
  name: businessProfile.name,
  legalName: businessProfile.name,
  description:
    "Premium wedding entry choreography, SFX fire shows, cold pyro entry, stage effects, sangeet choreography, and luxury event planning services.",
  phone: businessProfile.phone,
  email: businessProfile.email,
  sameAs: [
    "https://www.instagram.com/",
    "https://www.youtube.com/",
  ],
};

export function getOrganizationSchema() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteSeo.name,
    legalName: siteSeo.legalName,
    url: siteUrl,
    description: siteSeo.description,
    email: siteSeo.email,
    telephone: siteSeo.phone,
    sameAs: siteSeo.sameAs,
  };
}

export function getLocalBusinessSchema() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteSeo.name,
    url: siteUrl,
    description: siteSeo.description,
    email: siteSeo.email,
    telephone: siteSeo.phone,
    areaServed: [
      businessProfile.city,
      businessProfile.region,
      "Jaipur",
      "Udaipur",
      "Jodhpur",
      "Delhi NCR",
      "Gurgaon",
      "Mumbai",
      "India",
    ],
    priceRange: "$$",
  };
}

export function getWebsiteSchema() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteSeo.name,
    url: siteUrl,
    description: siteSeo.description,
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
