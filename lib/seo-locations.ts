import { SeoService, getSiteUrl, servicePages } from "@/lib/seo-services";

export type ServiceLocation = {
  slug: string;
  city: string;
  region: string;
  state: string;
  serviceAreas: string[];
  intro: string;
};

export type LocationSeoPage = {
  slug: string;
  service: SeoService;
  location: ServiceLocation;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
};

export const serviceLocations: ServiceLocation[] = [
  {
    slug: "jaipur",
    city: "Jaipur",
    region: "Jaipur, Rajasthan",
    state: "Rajasthan",
    serviceAreas: ["Vaishali Nagar", "Malviya Nagar", "C-Scheme", "Jagatpura", "Tonk Road", "Ajmer Road"],
    intro:
      "Jaipur weddings and premium events often need royal entry concepts, cinematic SFX, and strong stage moments that match palace venues, resorts, lawns, and banquet settings.",
  },
  {
    slug: "udaipur",
    city: "Udaipur",
    region: "Udaipur, Rajasthan",
    state: "Rajasthan",
    serviceAreas: ["Lake Pichola", "Fateh Sagar", "Hiran Magri", "Badi Road", "Shobhagpura", "Goverdhan Vilas"],
    intro:
      "Udaipur destination weddings need elegant, camera-friendly event experiences for lake venues, resorts, palace-style celebrations, and luxury wedding functions.",
  },
  {
    slug: "jodhpur",
    city: "Jodhpur",
    region: "Jodhpur, Rajasthan",
    state: "Rajasthan",
    serviceAreas: ["Ratanada", "Sardarpura", "Pal Road", "Umaid Heritage", "Mandore Road", "Paota"],
    intro:
      "Jodhpur events work beautifully with royal entry concepts, bold fire visuals, and carefully planned SFX for heritage venues, open lawns, and wedding resorts.",
  },
  {
    slug: "delhi",
    city: "Delhi",
    region: "Delhi NCR",
    state: "Delhi",
    serviceAreas: ["South Delhi", "West Delhi", "Dwarka", "Rohini", "Chattarpur", "Aerocity"],
    intro:
      "Delhi events need polished production, fast coordination, and premium visual moments for weddings, corporate events, launches, farmhouses, and banquet venues.",
  },
  {
    slug: "gurgaon",
    city: "Gurgaon",
    region: "Gurgaon, Haryana",
    state: "Haryana",
    serviceAreas: ["Golf Course Road", "Sohna Road", "DLF Phase 1-5", "Sector 29", "Manesar", "Cyber City"],
    intro:
      "Gurgaon corporate events, weddings, and premium private parties often need precise stage cues, strong reveals, and clean SFX execution for luxury venues.",
  },
  {
    slug: "mumbai",
    city: "Mumbai",
    region: "Mumbai, Maharashtra",
    state: "Maharashtra",
    serviceAreas: ["Bandra", "Andheri", "Juhu", "Powai", "Lower Parel", "Navi Mumbai"],
    intro:
      "Mumbai weddings, launches, and entertainment events need sharp timing, compact planning, and premium SFX that works within venue rules and production schedules.",
  },
  {
    slug: "indore",
    city: "Indore",
    region: "Indore, Madhya Pradesh",
    state: "Madhya Pradesh",
    serviceAreas: ["Vijay Nagar", "Rau", "MR 10", "Bhanwar Kuwa", "Palasia", "Super Corridor"],
    intro:
      "Indore weddings, corporate events, college festivals, and private celebrations need energetic entries, safe SFX planning, and premium stage moments for hotels, lawns, resorts, and banquet venues.",
  },
];

const locationServiceSlugs = [
  "fire-show",
  "cold-pyro-entry",
  "wedding-entry",
  "sangeet-choreography",
  "event-planning",
  "corporate-event-sfx",
];

const cityKeyword = (service: SeoService, location: ServiceLocation) =>
  `${service.shortTitle.toLowerCase()} in ${location.city.toLowerCase()}`;

export const locationSeoPages: LocationSeoPage[] = serviceLocations.flatMap((location) =>
  servicePages
    .filter((service) => locationServiceSlugs.includes(service.slug))
    .map((service) => {
      const slug = `${service.slug}-in-${location.slug}`;
      return {
        slug,
        service,
        location,
        title: `${service.shortTitle} in ${location.city}`,
        metaTitle: `${service.shortTitle} in ${location.city} | SKY SFX`,
        metaDescription: `Book ${service.shortTitle.toLowerCase()} in ${location.region} for weddings, corporate events, launches, sangeet nights, and premium celebrations with SKY SFX.`,
        keywords: [
          cityKeyword(service, location),
          `${service.shortTitle.toLowerCase()} ${location.city.toLowerCase()}`,
          `${service.category.toLowerCase()} in ${location.city.toLowerCase()}`,
          ...service.keywords,
        ],
      };
    })
);

export function getLocationPageBySlug(slug: string) {
  return locationSeoPages.find((page) => page.slug === slug);
}

export function getLocationPagesForService(serviceSlug: string) {
  return locationSeoPages.filter((page) => page.service.slug === serviceSlug);
}

export function getServiceAreaSchema(page: LocationSeoPage) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.title,
    description: page.metaDescription,
    provider: {
      "@type": "LocalBusiness",
      name: "SKY SFX",
      url: siteUrl,
      areaServed: page.location.region,
    },
    areaServed: {
      "@type": "City",
      name: page.location.city,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: page.location.state,
      },
    },
    serviceType: page.service.shortTitle,
    url: `${siteUrl}/locations/${page.slug}`,
  };
}
