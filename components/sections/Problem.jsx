import Section from "../ui/Section";

export default function Problem() {
  return (
    <Section bg="white">
      <h2 className="font-display text-[32px] md:text-[38px] font-semibold text-navy mb-8">
        Sound Familiar?
      </h2>
      <div className="space-y-6 font-body text-text-primary text-base md:text-lg leading-relaxed">
        <p>
          You built this business from the ground up. You&apos;ve got real
          revenue, a real team, and real clients. But somewhere along the way,
          growth started requiring more people — and your margins started
          shrinking.
        </p>
        <p>
          Your sales team is buried in manual work. Marketing generates leads but
          no one can prove which ones actually turn into revenue. Client
          onboarding is inconsistent — some clients love you, others churn in 90
          days. Your CRM is a mess that nobody trusts.
        </p>
        <p>
          And you? You&apos;re spending your Sunday nights building spreadsheets
          because the reports in your system don&apos;t tell you what you need to
          know.
        </p>
        <p>
          You know the business should be further along. You see competitors
          growing faster and wonder what they&apos;re doing differently.
        </p>
      </div>
    </Section>
  );
}
