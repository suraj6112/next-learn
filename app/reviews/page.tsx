import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";
import { businessProfile } from "@/lib/business-profile";
import ReviewActions from "@/components/ReviewActions";
import ReviewBusinessDetails from "@/components/ReviewBusinessDetails";

export const metadata: Metadata = {
  title: "Reviews | SKY SFX Wedding Entry, Fire Show and Event SFX",
  description:
    "Read and share reviews for SKY SFX wedding entry choreography, SFX fire shows, cold pyro entry, event planning, and corporate stage effects.",
  alternates: {
    canonical: "/reviews",
  },
};

const reviewSteps = [
  "Open the Google review link.",
  "Select your star rating based on your event experience.",
  "Mention the service used, event city, and what you liked.",
  "Add event photos or videos if available.",
];

export default function ReviewsPage() {
  const googleReviewHref = businessProfile.googleReviewUrl || "/api/google-review";
  const googleProfileHref = businessProfile.googleProfileUrl || "/contact";

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">Client Trust</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold mt-2">
            Review <span className="text-gold gold-glow-text">{businessProfile.name}</span>
          </h1>
          <p className="text-white/62 text-base sm:text-lg mt-5 leading-relaxed font-light">
            Your Google review helps new families, couples, brands, and event planners find reliable SFX fire show,
            wedding entry, cold pyro, choreography, and event production services.
          </p>
          <ReviewActions googleReviewHref={googleReviewHref} googleProfileHref={googleProfileHref} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="rounded-lg bg-charcoal border border-white/5 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gold/10 rounded-lg border border-gold/20 text-gold">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold tracking-widest text-gold uppercase">Review Guide</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1">How to leave a helpful review</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviewSteps.map((step, index) => (
                <div key={step} className="p-5 rounded-lg bg-black/35 border border-white/5">
                  <span className="text-gold font-serif text-3xl font-bold">0{index + 1}</span>
                  <p className="text-white/68 text-sm leading-7 mt-3">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <ReviewBusinessDetails />
        </section>
      </div>
    </div>
  );
}
