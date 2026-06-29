"use client";

import { ArrowRight, Star } from "lucide-react";
import { conversionEvents, trackEvent } from "@/lib/analytics";

export default function ReviewActions({
  googleReviewHref,
  googleProfileHref,
}: {
  googleReviewHref: string;
  googleProfileHref: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
      <a
        href={googleReviewHref}
        onClick={() => trackEvent(conversionEvents.reviewClick, { placement: "reviews_page", target: "write_review" })}
        target={googleReviewHref.startsWith("http") ? "_blank" : undefined}
        rel={googleReviewHref.startsWith("http") ? "noopener noreferrer" : undefined}
        className="px-8 py-3.5 bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-xs rounded-md shadow-lg transition-all duration-300 flex items-center justify-center gap-2 gold-glow-btn clickable"
      >
        Write Google Review
        <Star className="w-4 h-4 fill-black" />
      </a>
      <a
        href={googleProfileHref}
        onClick={() => trackEvent(conversionEvents.reviewClick, { placement: "reviews_page", target: "view_profile" })}
        target={googleProfileHref.startsWith("http") ? "_blank" : undefined}
        rel={googleProfileHref.startsWith("http") ? "noopener noreferrer" : undefined}
        className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-wider text-xs rounded-md transition-all duration-300 flex items-center justify-center gap-2 clickable"
      >
        View Google Profile
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}
