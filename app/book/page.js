import BookPageClient from "@/components/BookPageClient";

export const metadata = {
  title: "Book a Free Discovery Call",
  description:
    "Book a free 45-minute discovery call with Bradley de Wet. We'll look at your current revenue engine, identify friction points, and determine whether this is the right fit.",
  alternates: {
    canonical: "https://modernbizops.com/book",
  },
  robots: { index: false, follow: false },
};

export default function BookPage() {
  return <BookPageClient />;
}
