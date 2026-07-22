// A single governing sentence promoted out of the prose into a styled pull-quote.
// The words are never changed, only their treatment: the AI cluster's shared
// line, "AI amplifies the operational state it is applied to," anchors all three
// pages, so each one lifts it out of the paragraph it already sits in rather than
// repeating it. On the cream article it reads as its own moment.
export default function PullQuote({ children }) {
  return (
    <blockquote className="my-8 border-l-4 border-amber-light bg-navy/[0.03] py-5 pl-6 pr-5 font-display text-[22px] font-semibold leading-[1.35] text-navy md:text-[26px]">
      {children}
    </blockquote>
  );
}
