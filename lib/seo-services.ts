export type SeoService = {
  slug: string;
  title: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  category: string;
  heroImage: string;
  intro: string;
  highlights: string[];
  process: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

export const servicePages: SeoService[] = [
  {
    slug: "fire-show",
    title: "Professional SFX Fire Show for Weddings and Events",
    shortTitle: "SFX Fire Show",
    metaTitle: "SFX Fire Show for Weddings & Events | SKY SFX",
    metaDescription:
      "Book professional SFX fire shows for weddings, corporate events, concerts, college events, and luxury celebrations with trained artists and safety-focused execution.",
    keywords: [
      "sfx fire show",
      "fire show booking",
      "fire show for wedding",
      "professional fire show",
      "event fire show",
      "fire artists for event",
    ],
    category: "Fire Shows",
    heroImage:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=1600",
    intro:
      "SKY SFX designs high-impact fire show experiences for weddings, sangeet nights, corporate events, college festivals, and grand stage productions. The show can include fire poi, fire hoops, fire breathing concepts, performer entries, and dramatic stage moments planned around your event timeline.",
    highlights: [
      "Fire poi, fire hoops, fire staff, and choreographed performer acts",
      "Entry-focused fire concepts for bride, groom, couple, or artists",
      "Indoor and outdoor planning based on venue permission and safety clearance",
      "Professional team coordination with event planners, anchors, and production crew",
      "Photo and video friendly moments designed for social media impact",
    ],
    process: [
      "Understand event type, venue layout, crowd distance, and performance timing",
      "Plan fire act format, artist count, music cue, and entry direction",
      "Confirm safety zone, permissions, and backstage handling requirements",
      "Execute the show with trained performers and production coordination",
    ],
    faqs: [
      {
        question: "Can I book a fire show for a wedding entry?",
        answer:
          "Yes, fire show concepts can be planned for wedding entries, couple entries, sangeet openings, and outdoor celebration moments after checking venue safety conditions.",
      },
      {
        question: "Is the fire show safe for events?",
        answer:
          "The setup is planned with performer spacing, crowd distance, venue restrictions, and controlled execution. Final feasibility depends on the venue and local permissions.",
      },
      {
        question: "Can the fire show be customized with music?",
        answer:
          "Yes, the performance can be choreographed around music cues, entry timing, anchor announcements, and photographer positions.",
      },
    ],
  },
  {
    slug: "cold-pyro-entry",
    title: "Cold Pyro Entry and Sparkular Effects for Weddings",
    shortTitle: "Cold Pyro Entry",
    metaTitle: "Cold Pyro Entry for Wedding, Bride & Groom Entry | SKY SFX",
    metaDescription:
      "Create a luxury wedding entry with cold pyro, sparkular machines, spark tunnels, couple entry effects, and stage-safe visual moments.",
    keywords: [
      "cold pyro entry",
      "sparkular entry",
      "wedding cold pyro",
      "bride entry pyro",
      "groom entry pyro",
      "couple entry sparkular",
    ],
    category: "Wedding Entries",
    heroImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600",
    intro:
      "Cold pyro and sparkular entries create a premium cinematic look for bride entry, groom entry, couple entry, varmala, reception entry, and stage reveal moments. SKY SFX plans the machines, timing, cueing, and visual composition so the entry looks grand in person and powerful on camera.",
    highlights: [
      "Cold pyro tunnel for couple, bride, groom, or family entry",
      "Sparkular stage reveal for varmala, reception, and sangeet opening",
      "Music-synced firing cues for cinematic video shots",
      "Machine placement planned around photographer and videographer angles",
      "Can be combined with dry ice cloud, confetti, CO2, and choreography",
    ],
    process: [
      "Select entry route, stage position, and machine count",
      "Plan music cue, firing duration, and camera-friendly timing",
      "Coordinate power, machine placement, and venue safety requirements",
      "Execute the entry with operator cues and event team coordination",
    ],
    faqs: [
      {
        question: "What is cold pyro entry?",
        answer:
          "Cold pyro entry uses sparkular-style machines to create a fountain-like spark effect for wedding and event entries with controlled timing and placement.",
      },
      {
        question: "Can cold pyro be used for bride entry?",
        answer:
          "Yes, it is commonly used for bride entry, groom entry, couple entry, varmala, reception entry, and stage reveal moments.",
      },
      {
        question: "How many machines are required?",
        answer:
          "The machine count depends on the entry route, venue size, camera angle, and desired visual density. A small entry may need fewer machines while a grand tunnel needs more.",
      },
    ],
  },
  {
    slug: "wedding-entry",
    title: "Luxury Wedding Entry Planning for Bride, Groom and Couple",
    shortTitle: "Wedding Entry",
    metaTitle: "Wedding Entry Planner for Bride, Groom & Couple Entry | SKY SFX",
    metaDescription:
      "Book cinematic wedding entry planning with choreography, cold pyro, flower entry, royal groom entry, couple entry, dry ice cloud, and premium SFX.",
    keywords: [
      "wedding entry planner",
      "bride entry",
      "groom entry",
      "couple entry",
      "royal wedding entry",
      "wedding entry choreography",
    ],
    category: "Wedding Entries",
    heroImage:
      "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=1600",
    intro:
      "A wedding entry should feel personal, emotional, and memorable. SKY SFX builds entry concepts for brides, grooms, couples, families, and artists using choreography, props, cold pyro, dry ice cloud, confetti, flower concepts, and production timing.",
    highlights: [
      "Bride entry, groom entry, couple entry, and family entry planning",
      "Royal, romantic, traditional, modern, and cinematic concepts",
      "Choreographed escorts, flower entries, props, and stage reveals",
      "Cold pyro, dry ice cloud, confetti, and lighting cue coordination",
      "Designed for reels, wedding films, and professional photo coverage",
    ],
    process: [
      "Understand the couple story, theme, venue, and entry route",
      "Create entry concept, music plan, choreography, and SFX requirements",
      "Coordinate rehearsal, stage direction, props, and production cues",
      "Execute the final entry with cue-based team coordination",
    ],
    faqs: [
      {
        question: "Do you plan both bride and groom entry?",
        answer:
          "Yes, SKY SFX plans bride entry, groom entry, couple entry, family entry, and reception entry concepts.",
      },
      {
        question: "Can you combine choreography with SFX?",
        answer:
          "Yes, entries can combine choreography, cold pyro, dry ice cloud, confetti, lighting cues, props, and music timing.",
      },
      {
        question: "Can the entry be customized for our theme?",
        answer:
          "Yes, the entry can be customized around royal, traditional, romantic, Bollywood, modern, or luxury wedding themes.",
      },
    ],
  },
  {
    slug: "sangeet-choreography",
    title: "Sangeet and Wedding Dance Choreography",
    shortTitle: "Sangeet Choreography",
    metaTitle: "Sangeet Choreographer for Wedding Dance Performances | SKY SFX",
    metaDescription:
      "Book wedding sangeet choreography for bride, groom, family performances, couple dance, flashmob, kids dance, and cinematic stage acts.",
    keywords: [
      "sangeet choreographer",
      "wedding choreography",
      "dance choreography for wedding",
      "couple dance choreographer",
      "family sangeet dance",
      "bride groom dance",
    ],
    category: "Choreography",
    heroImage:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1600",
    intro:
      "SKY SFX creates wedding sangeet choreography that is easy to learn, emotionally engaging, and stage-ready. From couple dance and family performances to cousins flashmob and kids acts, every performance is planned for audience energy and camera impact.",
    highlights: [
      "Bride and groom couple dance choreography",
      "Family sangeet performances for parents, siblings, cousins, and friends",
      "Beginner-friendly steps with clean stage formations",
      "Theme-based medleys, storytelling acts, and flashmob concepts",
      "Optional stage effects, lighting cues, and entry moments",
    ],
    process: [
      "Understand songs, performers, comfort level, and function timeline",
      "Build custom medley, formations, and choreography structure",
      "Conduct rehearsals and polish transitions",
      "Coordinate final stage blocking and show flow",
    ],
    faqs: [
      {
        question: "Can beginners learn the choreography?",
        answer:
          "Yes, routines can be designed for beginners with simple, clean, and impressive steps.",
      },
      {
        question: "Do you choreograph couple dance?",
        answer:
          "Yes, couple dance, bride solo, groom solo, family acts, kids acts, and group performances can be choreographed.",
      },
      {
        question: "Can SFX be added to a dance performance?",
        answer:
          "Yes, selected performances can include cold pyro, confetti, dry ice cloud, lighting cues, or stage reveal moments where suitable.",
      },
    ],
  },
  {
    slug: "event-planning",
    title: "Luxury Event Planning and Production Services",
    shortTitle: "Event Planning",
    metaTitle: "Luxury Event Planner for Weddings, Sangeet & Corporate Events | SKY SFX",
    metaDescription:
      "Plan premium weddings, sangeet nights, corporate events, college festivals, and luxury celebrations with decor, production, artists, SFX, and stage management.",
    keywords: [
      "event planner",
      "wedding event planner",
      "luxury event planning",
      "corporate event planner",
      "sangeet event planner",
      "event production company",
    ],
    category: "Event Planning",
    heroImage:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1600",
    intro:
      "SKY SFX supports complete event planning and production for weddings, sangeet nights, receptions, corporate events, college events, and private celebrations. The service can include concept planning, decor coordination, stage production, artist management, SFX, and show flow.",
    highlights: [
      "Wedding, reception, sangeet, corporate, college, and private events",
      "Stage, sound, lighting, LED, decor, entry, artist, and SFX coordination",
      "Show flow planning for anchors, performances, reveals, and entries",
      "Vendor and production team alignment for smoother execution",
      "Premium visual concepts built for guest experience and content creation",
    ],
    process: [
      "Understand event objective, guest profile, date, venue, and budget range",
      "Create concept, service scope, production plan, and visual direction",
      "Coordinate vendors, artists, rehearsals, and event-day logistics",
      "Execute the event with on-ground supervision and cue management",
    ],
    faqs: [
      {
        question: "Do you handle complete event planning?",
        answer:
          "Yes, SKY SFX can support planning, production, artist coordination, SFX, choreography, stage flow, and event-day execution based on the package.",
      },
      {
        question: "Can you plan corporate events?",
        answer:
          "Yes, corporate events, product launches, annual functions, college events, concerts, and private celebrations can be planned.",
      },
      {
        question: "Can event planning include fire show and cold pyro?",
        answer:
          "Yes, SFX such as fire show, cold pyro, confetti, dry ice cloud, and stage reveal effects can be included after checking venue feasibility.",
      },
    ],
  },
  {
    slug: "corporate-event-sfx",
    title: "Corporate Event SFX, Stage Effects and Show Production",
    shortTitle: "Corporate Event SFX",
    metaTitle: "Corporate Event SFX, Stage Effects & Fire Show | SKY SFX",
    metaDescription:
      "Book stage SFX for corporate events, product launches, annual functions, award nights, college festivals, and concerts with pyro, CO2, confetti, and fire acts.",
    keywords: [
      "corporate event sfx",
      "stage effects for event",
      "product launch sfx",
      "event pyro effects",
      "co2 jet event",
      "confetti blast event",
    ],
    category: "Corporate Events",
    heroImage:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1600",
    intro:
      "Corporate events need clean timing, strong stage reveals, and reliable production coordination. SKY SFX provides stage effects and show moments for launches, annual functions, award nights, concerts, college festivals, and brand activations.",
    highlights: [
      "Product reveal, award entry, artist entry, and launch countdown effects",
      "CO2 jets, confetti blast, cold pyro, dry ice cloud, and fire acts",
      "Cue-based execution with anchor, AV, lighting, and stage manager",
      "Brand-safe show concepts for premium guest experience",
      "Photo, video, and social media friendly moments",
    ],
    process: [
      "Review event script, stage design, venue rules, and production plan",
      "Select suitable SFX for reveal, opening, artist entry, or finale",
      "Coordinate cue sheets with AV, lights, anchor, and stage manager",
      "Execute effects on exact show cues with trained operators",
    ],
    faqs: [
      {
        question: "Can SFX be used for product launches?",
        answer:
          "Yes, product reveal moments can use cold pyro, confetti, CO2, dry ice cloud, lighting cues, and countdown-based show effects.",
      },
      {
        question: "Do you work with corporate production teams?",
        answer:
          "Yes, SKY SFX can coordinate with event agencies, production teams, anchors, AV teams, and stage managers.",
      },
      {
        question: "Can fire show be added to a corporate event?",
        answer:
          "Yes, a fire show can be added where venue rules, safety distance, and permissions allow it.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return servicePages.find((service) => service.slug === slug);
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
