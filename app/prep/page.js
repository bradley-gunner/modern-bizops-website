import PrepForm from "@/components/PrepForm";

export const metadata = {
  title: "Pre-Call Prep | Modern BizOps",
  description:
    "Pre-call prep questionnaire for booked Modern BizOps discovery calls.",
  alternates: {
    canonical: "https://modernbizops.com/prep",
  },
  robots: {
    index: false,
    follow: false,
  },
};

// The form is personalized via ?email=&firstName= query params, so we render
// dynamically at request time rather than pre-generating a static page.
export const dynamic = "force-dynamic";

export default function PrepPage() {
  return <PrepForm />;
}
