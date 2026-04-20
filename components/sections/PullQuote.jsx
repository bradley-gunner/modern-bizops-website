import Section from "../ui/Section";

export default function PullQuote() {
  return (
    <Section bg="cream">
      <div className="max-w-[760px] mx-auto pl-6 border-l-4 border-amber">
        <blockquote>
          <p className="font-display text-[22px] md:text-[26px] font-semibold italic text-navy leading-snug mb-4">
            &ldquo;Working with Bradley was a genuinely great experience. He quickly became a trusted partner and brought much-needed clarity and structure to our marketing and operations.&rdquo;
          </p>
          <footer className="font-body text-sm text-text-mid font-medium">
            Katie Ellis MacMillan, Marketing Leader
          </footer>
        </blockquote>
      </div>
    </Section>
  );
}
