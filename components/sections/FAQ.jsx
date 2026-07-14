import Section from "../ui/Section";
import Accordion from "../ui/Accordion";

const faqItems = [
  {
    question:
      "How is this different from a marketing agency or CRM consultant?",
    answer:
      "Agencies execute tactics. CRM consultants configure software. I build the operational system that connects your marketing, sales, and delivery into one revenue engine, and I coach your team to run it. When we are done, you do not need me anymore. That is the point.",
  },
  {
    question: "We are only a $3M company. Are we too small for this?",
    answer:
      "If you have a sales team, a marketing function, and clients to serve, you have a revenue engine, even if it is held together with duct tape. The earlier you build the right systems, the faster you grow and the less painful the scaling process is.",
  },
  {
    question: "What if my team resists the changes?",
    answer:
      "That is why this is done-with-you, not done-to-you. Your team is involved throughout: mapping their own processes, defining their own metrics, choosing the tools they will actually use. People do not resist change they helped create.",
  },
  {
    question: "How is my maturity stage determined?",
    answer:
      "Three ways, in sequence. First, the Revenue Intelligence Platform connects to your existing tools and analyzes your actual data: CRM completeness, pipeline stage distribution, integration coverage. That takes about 30 minutes of your time and produces data-driven scores on 15-20 competencies without any self-reporting. Second, a structured questionnaire covers what data alone cannot assess. Third, a 60-90 minute assessment call with me personally, where I validate the preliminary scores and surface anything the data cannot capture. This is part of the engagement, not the free discovery call. You see the scoring rationale for every competency. Nothing is a black box.",
  },
  {
    question: "I have been burned by consultants before.",
    answer:
      "I hear this a lot. Most consulting engagements fail because the consultant builds something in a silo that the team rejects, or because the engagement ends and nobody knows how to maintain what was built. My model solves both problems: your team builds it with my coaching, so they own it. And every recommendation comes from your actual maturity assessment, not a generic template applied to every client regardless of where they are.",
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
