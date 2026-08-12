// Section 2: the trust strip, immediately after the hero (never later), per the
// 12-site convergence in doc 14.
//
// There is no client logo wall to show, because Modern BizOps has no clients
// yet. A false or implied one is a detectable lie in a market whose best buyers
// are diligence-heavy, so this strip does the honest version: the operator
// record, then the iExcel-era client names under the attribution rule.
//
// THE LABEL BELOW IS LOAD-BEARING AND NON-NEGOTIABLE. Bradley cleared all 28
// iExcel-era clients for public naming on one condition: they are always framed
// as "clients I worked with while I was at iExcel" and never stated or implied
// to be Modern BizOps clients. Dropping or softening that label puts this block
// in the same fabrication class as the homepage result cards that were removed.
//
// Every number here is from the verified career record; do not round them up.
// "Over a decade" is deliberate: the live LinkedIn headline still says fifteen
// years and nothing new ever asserts that.
const METRICS = [
  "Over a decade in the executor seat",
  "$318K churn-adjusted ARR closed",
  "About $1M churn saved",
  "4.5 years as an agency COO",
  "20+ tools the audit connects to",
];

const IEXCEL_CLIENTS = [
  "Dapper Labs",
  "Tock",
  "SalesIntel",
  "Modus Create",
  "1Huddle",
  "Otta",
  "Jenni.ai",
];

export default function TrustStrip() {
  return (
    <section className="bg-white border-y border-border">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-7">
        <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {METRICS.map((metric, i) => (
            <li
              key={metric}
              className="flex items-center gap-3 font-body text-[13px] font-medium text-text-mid"
            >
              {i > 0 && (
                <span className="text-border" aria-hidden="true">
                  &middot;
                </span>
              )}
              <span>{metric}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-5 border-t border-border/70 text-center">
          {/* The label used to be set `text-xs uppercase tracking-[0.18em]
              text-text-light`, which did two harmful things at once. It
              rendered the brand name as "IEXCEL", and it set the sentence that
              does the attribution work visually beneath the names it governs,
              so the eye read seven client logos with a caption underneath. The
              label is the load-bearing part. It now reads at full navy while
              the names stay at navy/75, so the frame lands first. The words are
              exact and non-negotiable; only their treatment changed. */}
          <p className="font-body text-[15px] md:text-base font-semibold text-navy mb-3">
            Clients I worked with while I was at iExcel:
          </p>
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-2">
            {IEXCEL_CLIENTS.map((client) => (
              <li
                key={client}
                className="font-display text-lg md:text-xl font-semibold text-navy/75"
              >
                {client}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
