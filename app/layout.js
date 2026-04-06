import Script from "next/script";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { getOrganizationSchema, getServiceSchema, getPersonSchema, getFAQSchema } from "./schema";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Modern BizOps — Revenue Growth Coaching for SMBs",
    template: "%s | Modern BizOps",
  },
  description:
    "Grow your revenue without growing your headcount. Done-with-you coaching that builds the sales, marketing, and delivery systems that turn growth into profit.",
  metadataBase: new URL("https://modernbizops.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://modernbizops.com",
    siteName: "Modern BizOps",
    title: "Modern BizOps — Revenue Growth Coaching for SMBs",
    description:
      "Grow your revenue without growing your headcount. Done-with-you coaching that builds the sales, marketing, and delivery systems that turn growth into profit.",
    images: [
      {
        url: "/logos/og-image-dark.png",
        width: 1200,
        height: 630,
        alt: "Modern BizOps — Revenue Growth Coaching for SMBs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modern BizOps — Revenue Growth Coaching for SMBs",
    description:
      "Grow your revenue without growing your headcount. Done-with-you coaching for $3M–$15M companies.",
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
        {/* Meta Pixel — dormant until paid ads */}
        {/* LinkedIn Insight Tag — dormant until paid ads */}
      </head>
      <body className="min-h-screen antialiased">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z6WJF5K49D"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z6WJF5K49D');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
