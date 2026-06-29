import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Wedding Entry, Fire Show and Event SFX Videos | SKY SFX",
  description:
    "Explore photos and videos of wedding entries, SFX fire shows, cold pyro entry, choreography, corporate event effects, and luxury event productions by SKY SFX.",
  alternates: {
    canonical: "/gallery",
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
