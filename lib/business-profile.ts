export const businessProfile = {
  name: "SKY SFX",
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+91 99999 99999",
  phoneHref: `tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE_E164 || "+919999999999"}`,
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "bookings@skysfx.in",
  city: process.env.NEXT_PUBLIC_BUSINESS_CITY || "Jaipur",
  region: process.env.NEXT_PUBLIC_BUSINESS_REGION || "Rajasthan",
  country: "India",
  googleProfileUrl: process.env.NEXT_PUBLIC_GOOGLE_PROFILE_URL || "",
  googleReviewUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "",
};

export function getWhatsappUrl(message = "Hello, I want information about your event services.") {
  return `https://wa.me/${businessProfile.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
