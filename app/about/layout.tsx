import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SKY SFX | Premium Wedding SFX, Fire Shows and Event Production",
  description:
    "Learn about SKY SFX, a premium event SFX, wedding entry, fire show, choreography, and luxury event planning team for cinematic celebrations.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
