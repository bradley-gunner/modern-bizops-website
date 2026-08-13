import Script from "next/script";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { getOrganizationSchema, getServiceSchema, getPersonSchema } from "./schema";
import { GA_MEASUREMENT_ID, CLARITY_PROJECT_ID, HUBSPOT_PORTAL_ID } from "@/lib/analytics";
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

// The site-wide fallbacks. `default` and the three descriptions below are what
// a page inherits when it sets none of its own, and they described the retired
// offer until 2026-08-12: "Revenue Operations Consulting and Coaching", "RevOps
// coaching", and the "$3M to $50M" band that moved into ICP qualification and
// off the public surfaces. The template is untouched. Every page that renders
// its own title still gets " | Modern BizOps" appended unless it opts out.
const SITE_TITLE = "Modern BizOps | AI Automation for B2B Go-to-Market";
const SITE_DESCRIPTION =
  "The AI automation partner for B2B go-to-market: more leads, more booked calls, more closed deals, and a team with less busywork. Fixed published prices.";

export const metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s | Modern BizOps",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL("https://modernbizops.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://modernbizops.com",
    siteName: "Modern BizOps",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "https://modernbizops.com/og/og-homepage.png",
        width: 1200,
        height: 630,
        alt: "Modern BizOps, the AI automation partner for B2B go-to-market",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
        {/* Organization, Service, and Person are site-wide identity schema, so
            they belong in the shared head. The homepage FAQPage schema does not:
            FAQPage structured data must match FAQs visible on the page, so
            emitting the homepage Q&As on every page put a mismatched FAQPage on
            pages that never show them (and a second, competing FAQPage on pages
            with their own FAQ). It now lives on the homepage only, next to the
            <FAQ /> that renders those exact Q&As. */}
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
        {/* HubSpot tracking code. Two jobs, and the second one is the reason
            this is not optional: it powers HubSpot's buyer intent (which
            companies are visiting), AND it is the only thing that sets the
            `hubspotutk` cookie that lib/hubspot-client.js reads and the
            scorecard and playbook forms send as context.hutk. Without it those
            forms were posting an empty hutk and HubSpot was recording Original
            Source as INTEGRATION.

            Production only, matching Clarity above. Note the same caveat: on
            Vercel, NODE_ENV is "production" for PREVIEW deployments too, so
            this does not exclude previews. That matters more here than it does
            for Clarity, because buyer intent turns a visit into a company in the
            Visitors list. The enforcement lives in HubSpot rather than in this
            check: Settings > Tracking & Analytics > Advanced Tracking >
            "Limit tracking to these domains", with modernbizops.com the only
            external domain listed. Turn that on once this is confirmed
            reporting, not before, or tracking fails silently. */}
        {process.env.NODE_ENV === "production" && (
          <Script
            id="hs-script-loader"
            src={`https://js-na2.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js`}
            strategy="afterInteractive"
          />
        )}
        <UtmCapture />
        {children}
      </body>
    </html>
  );
}
