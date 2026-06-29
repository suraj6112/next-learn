import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileActionBar from "@/components/MobileActionBar";
import CustomCursor from "@/components/CustomCursor";
import ConversionTracker from "@/components/ConversionTracker";
import { getSiteUrl } from "@/lib/seo-services";
import { getLocalBusinessSchema, getOrganizationSchema, getWebsiteSchema } from "@/lib/site-seo";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "SKY SFX | Wedding Entry Choreography & Fire Show Events",
  description:
    "Premium Wedding Entry Choreography, Fire Shows, Fireworks displays, and Luxury Event Planning services. Transform your event with cinematic visual spectacles.",
  keywords: [
    "wedding entry choreography",
    "groom grand entry",
    "bride floral entry",
    "fire show events",
    "pyrotechnics fireworks",
    "event planner sangeet",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SKY SFX | Wedding Entry Choreography & Fire Show Events",
    description:
      "Premium Wedding Entry Choreography, Fire Shows, Fireworks displays, and Luxury Event Planning services.",
    url: "/",
    siteName: "SKY SFX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SKY SFX | Wedding Entry Choreography & Fire Show Events",
    description:
      "Premium wedding entry choreography, fire shows, fireworks displays, and luxury event planning services.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-gold selection:text-black">
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getLocalBusinessSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebsiteSchema()) }}
        />
        <ConversionTracker />
        {/* Luxury Custom Cursor */}
        <CustomCursor />

        {/* Global Navbar */}
        <Navbar />

        {/* Main Site Container */}
        <main className="grow pb-16 md:pb-0">{children}</main>

        {/* Sticky Mobile Action Footer */}
        <MobileActionBar />
      </body>
    </html>
  );
}
