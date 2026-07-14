import Script from "next/script";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { getOrganizationSchema, getServiceSchema, getPersonSchema, getFAQSchema } from "./schema";
import { GA_MEASUREMENT_ID, CLARITY_PROJECT_ID } from "@/lib/analytics";
import UtmCapture from "@/components/UtmCapture";

// next/font self-hosts both fonts, adds <link rel="preload"> automatically,
// and applies font-display: swap - no manual preload tags needed.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: true,
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
});

export const metadata = {
  title: {
    default: "Modern BizOps | Revenue Operations Consulting and Coaching for Founder-Led B2B",
    template: "%s | Modern BizOps",
  },
  description:
    "Making marketing, sales, and service one machine. Software-assisted RevOps coaching for founder-led B2B companies from $3M to $50M. More money, less chaos.",
  metadataBase: new URL("https://modernbizops.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://modernbizops.com",
    siteName: "Modern BizOps",
    title: "Modern BizOps | Revenue Operations Consulting and Coaching for Founder-Led B2B",
    description:
      "Making marketing, sales, and service one machine. Software-assisted RevOps coaching for founder-led B2B companies from $3M to $50M. More money, less chaos.",
    images: [
      {
        url: "https://modernbizops.com/og/og-homepage.png",
        width: 1200,
        height: 630,
        alt: "Modern BizOps - Grow Your Revenue Without Growing Your Headcount",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modern BizOps | Revenue Operations Consulting and Coaching for Founder-Led B2B",
    description:
      "Making marketing, sales, and service one machine. Software-assisted RevOps coaching for founder-led B2B companies from $3M to $50M.",
    images: ["https://modernbizops.com/og/og-homepage.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getServiceSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getPersonSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getFAQSchema()) }}
        />
        {/* Meta Pixel - dormant until paid ads */}
        {/* LinkedIn Insight Tag - dormant until paid ads */}
      </head>
      <body className="min-h-screen antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber focus:text-white focus:rounded-full focus:font-body focus:font-semibold focus:text-sm"
        >
          Skip to main content
        </a>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {/* Microsoft Clarity - session recordings and heatmaps for CRO.
            Production only so local dev and preview sessions are not recorded. */}
        {process.env.NODE_ENV === "production" && (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
            `}
          </Script>
        )}
        <UtmCapture />
        {children}
      </body>
    </html>
  );
}
