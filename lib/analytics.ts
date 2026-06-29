export function trackEvent(eventName: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;

  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (!gtag) return;

  gtag("event", eventName, params);
}

export const conversionEvents = {
  phoneClick: "phone_click",
  whatsappClick: "whatsapp_click",
  inquirySubmit: "inquiry_submit",
  reviewClick: "review_click",
  quoteClick: "quote_click",
};
