import Section from "../ui/Section";
import Accordion from "../ui/Accordion";

const faqItems = [
  {
    question:
      "How is this different from a marketing agency or CRM consultant?",
    answer:
      "Agencies execute tactics. CRM consultants configure software. I build the operational system that connects your marketing, sales, and delivery into one revenue engine, and I coach your team to run it. When we're done, you don't need me anymore. That's the point.",
  },
  {
    question: "We're only a $3M company. Are we too small for this?",
    answer:
      "If you have a sales team, a marketing function, and clients to serve, you have a revenue engine, even if it's held together with duct tape. The earlier you build the right systems, the faster you grow and the less painful the scaling process is.",
  },
  {
    question: "What if my team resists the changes?",
    answer:
      "That's exactly why this is done-with-you, not done-to-you. Your team is involved in every phase: mapping their own processes, defining their own metrics, choosing the AI tools they'll actually use. People don't resist change they helped create.",
  },
  {
    question: "What kind of AI tools will we implement?",
    answer:
      "Depends on where your biggest time drains are. Common implementations include AI-powered lead scoring, automated follow-up sequences, chatbots for initial customer support, and automated reporting dashboards. We focus on tools that save your team measurable hours per week. Not shiny objects.",
  },
  {
    question: "I've been burned by consultants before.",
    answer:
      "I hear this a lot. Most consulting engagements fail because the consultant builds something in a silo that the team rejects, or because the engagement ends and nobody knows how to maintain what was built. My model solves both problems: your team builds it with my guidance, so they own it. And every recommendation comes from your actual data, not a generic template.",
  },
  {
    question: "What's the investment?",
    answer:
      "It depends on your company's size and complexity. Engagements range from $8,000 for early-stage companies to $25,000+ for mature organizations. Book a discovery call and we'll scope it to your situation.",
  },
];

export default function FAQ() {
  return (
    <Section bg="white" id="faq">
      <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-10">
        Common Questions
      </h2>
      <Accordion items={faqItems} />
    </Section>
  );
}
