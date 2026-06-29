import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Fire Show, Cold Pyro, Wedding Entry and Event Planning | SKY SFX",
  description:
    "Explore SKY SFX services including fire shows, cold pyro entry, wedding entry planning, sangeet choreography, corporate event SFX, and luxury event planning.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
