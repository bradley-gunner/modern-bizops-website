import BookPageClient from "@/components/BookPageClient";

export const metadata = {
  title: "Book a Free Discovery Call",
  description:
    "Book a free 45-minute discovery call with Bradley de Wet. We'll look at your current revenue engine, identify friction points, and determine whether this is the right fit.",
  alternates: {
    canonical: "https://modernbizops.com/book",
  },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Book a Free Discovery Call",
    description:
      "45 minutes. No obligation. Find your biggest revenue growth lever.",
    url: "https://modernbizops.com/book",
    images: [
      {
        url: "https://modernbizops.com/og/og-book.png",
        width: 1200,
        height: 630,
        alt: "Modern BizOps - Book a Free Discovery Call with Bradley de Wet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Free Discovery Call",
    description:
      "45 minutes with Bradley de Wet. No obligation.",
    images: ["https://modernbizops.com/og/og-book.png"],
  },
};

export default function BookPage() {
  return <BookPageClient />;
}
