import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Case Studies | Wedding, Corporate and SFX Shows | SKY SFX",
  description:
    "View SKY SFX event case studies for weddings, corporate events, fire shows, cold pyro entries, choreography, and premium event production.",
  alternates: {
    canonical: "/events",
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
