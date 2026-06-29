import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SKY SFX",
    short_name: "SKY SFX",
    description:
      "Premium wedding entry choreography, SFX fire shows, cold pyro, stage effects, and luxury event planning services.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#D4AF37",
    categories: ["business", "entertainment", "lifestyle"],
  };
}
