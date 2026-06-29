import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact SKY SFX | Book Fire Show, Wedding Entry and Event SFX",
  description:
    "Contact SKY SFX to book SFX fire shows, cold pyro entry, wedding entry choreography, sangeet choreography, corporate event SFX, and event planning services.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
