import VizBlock from "@/components/learn/VizBlock";

// The 5.2 page's signature block: the three software categories founder-led
// businesses confuse, side by side. Every category, purpose, and buy-signal is
// a real DOM text node (never an image), verbatim from the page's own prose, so
// the comparison stays crawlable and AI-extractable. Desktop renders one
// semantic <table>; mobile stacks the three categories into three cards, both
// built from the same ROWS so the cell text is identical either way.
const HEADERS = ["Category", "What it is for", "When it is worth it at $3M–$50M"];

const ROWS = [
  {
    category:
      "Your billing platform's built-in dunning (Stripe Billing, Chargebee, Recurly, Maxio)",
    forWhat:
      "Retries, dunning emails, and card-updater for failed subscription charges",
    when: "Almost always the first and only step you need. You already pay for it. Configure it before buying anything.",
  },
  {
    category:
      "Dedicated recovery software (Butter Payments, Gravy, Churn Buster, Stunning)",
    forWhat:
      "Smarter retry timing, deeper dunning sequences, and recovery specialists layered on top of your billing platform",
    when: "Worth it when your card-billed volume is high enough that a few extra points of recovery is real money, and your team is not going to manage retries closely. Below meaningful volume, the built-in tools get you most of the way.",
  },
  {
    category:
      "Debt collection / accounts-receivable software (Upflow, HighRadius, and the collections tools)",
    forWhat:
      "Chasing invoices that are already seriously overdue, and formal collections",
    when: "A different problem from dunning. Relevant only if you carry large, aging B2B receivables. For most recurring-revenue businesses, auto-charge billing prevents the need for this entirely.",
  },
];

export default function PaymentRecoveryTable() {
  return (
    <VizBlock
      label="The honest comparison"
      title="Three categories founder-led businesses confuse"
    >
      {/* Desktop: one semantic table. */}
      <table className="hidden w-full border-collapse text-left align-top md:table">
        <thead>
          <tr>
            {HEADERS.map((h, c) => (
              <th
                key={h}
                scope="col"
                className={`border-b border-white/15 px-4 py-3 font-display text-[15px] font-semibold ${
                  c === 0 ? "w-[30%] text-white" : "text-white"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.category}>
              <th
                scope="row"
                className="border-b border-white/10 px-4 py-4 align-top font-display text-[14px] font-semibold text-amber-light"
              >
                {row.category}
              </th>
              <td className="border-b border-white/10 px-4 py-4 align-top text-[14px] leading-[1.45] text-[#DCE3EE]">
                {row.forWhat}
              </td>
              <td className="border-b border-white/10 px-4 py-4 align-top text-[14px] leading-[1.45] text-[#DCE3EE]">
                {row.when}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: the three categories stacked into three cards. */}
      <div className="flex flex-col gap-4 md:hidden">
        {ROWS.map((row) => (
          <div
            key={row.category}
            className="rounded-[14px] border border-white/10 bg-white/[0.045] px-5 py-5"
          >
            <p className="mb-3 font-display text-[16px] font-semibold text-amber-light">
              {row.category}
            </p>
            <dl className="flex flex-col gap-3">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-light">
                  {HEADERS[1]}
                </dt>
                <dd className="mt-0.5 text-[14px] leading-[1.45] text-[#DCE3EE]">
                  {row.forWhat}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-light">
                  {HEADERS[2]}
                </dt>
                <dd className="mt-0.5 text-[14px] leading-[1.45] text-[#DCE3EE]">
                  {row.when}
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </VizBlock>
  );
}
