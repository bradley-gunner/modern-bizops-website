import VizBlock from "@/components/learn/VizBlock";

// The 4.2 page's skimmable spine and its most likely AI-Overview citation, so
// every cell is a real DOM text node, never a baked image. Each row is one job
// the revenue engine needs done; the columns answer it the way the page does:
// the fundamental that has to exist first, the DIY move with an assistant you
// already pay for, and the named tool that automates it at Level 4-5. The
// "Fundamental first" column is tinted amber because it is the whole thesis.
//
// On desktop it renders as one semantic <table>; on mobile the five jobs stack
// into five cards. Both are built from the same JOBS data, so the cell text is
// identical either way. The cells are condensed from the page's prose; the full
// prices and detail live verbatim in the job sections below the table.
const COLUMNS = [
  "Fundamental first",
  "DIY move, assistant you already have",
  "The tool at Level 4-5",
];

const JOBS = [
  {
    job: "Know your best-fit customer",
    cells: [
      "A written ideal customer profile. You cannot automate targeting you have not defined.",
      "Export closed-won and closed-lost as two CSVs and ask your assistant what your best customers had in common that your lost deals did not.",
      "Sybill runs conversation intelligence across your calls and surfaces how your best-fit buyers actually talk.",
    ],
  },
  {
    job: "Keep the CRM clean",
    cells: [
      "Governance. Decide what a field means and when a stage advances, or the data rots no matter the software.",
      "Have your assistant flag duplicates and standardize fields in a spreadsheet, or point it at your CRM's MCP server or API and let it make the changes directly.",
      "HubSpot's MCP server lets a rep move a deal or update a field by typing a sentence, with the agent reading and writing the CRM directly.",
    ],
  },
  {
    job: "Enrich and de-dupe every new record",
    cells: [
      "The de-dupe and field rules from job two. Enrichment multiplies whatever it touches.",
      "Paste a batch of company names into your assistant and ask it to pull public firmographics and match them to your ICP tiers.",
      "Clay fires enrichment and cleanup on every new record automatically. Check Breeze Intelligence first if you are already in HubSpot.",
    ],
  },
  {
    job: "Qualify leads on the first pass",
    cells: [
      "A written qualification framework. An AI qualifies against your criteria, and vague criteria qualify vaguely.",
      "Give your assistant your rules and a batch of raw leads and have it score and rank them with a one-line reason each.",
      "Inbound agents like 11x's Julian and Artisan's Aaron respond within seconds of a form fill.",
    ],
  },
  {
    job: "Read pipeline health honestly",
    cells: [
      "Stage discipline. Forecasting AI inherits whatever fiction your undefined stages carry.",
      "Export your open pipeline and have your assistant flag stale deals, deals stuck in a stage, and deals missing a close date.",
      "Gong, Clari, and Salesloft ship agentic forecasting, all now leading with governance built in.",
    ],
  },
];

// Index of the amber "Fundamental first" column among the value columns.
const FIRST = 0;

export default function FiveJobsTable() {
  return (
    <VizBlock
      label="The stack, by the job it does"
      title="Five jobs, and what each one needs before a tool touches it"
    >
      {/* Desktop: one semantic table. */}
      <table className="hidden w-full border-collapse text-left align-top md:table">
        <thead>
          <tr>
            <th
              scope="col"
              className="w-[16%] border-b border-white/15 py-3 pr-4 font-display text-[13px] font-semibold uppercase tracking-[0.06em] text-text-light"
            >
              The job
            </th>
            {COLUMNS.map((col, c) => (
              <th
                key={col}
                scope="col"
                className={`border-b border-white/15 px-4 py-3 font-display text-[15px] font-semibold ${
                  c === FIRST
                    ? "rounded-t-lg bg-amber/[0.12] text-amber-light"
                    : "text-white"
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {JOBS.map((row) => (
            <tr key={row.job}>
              <th
                scope="row"
                className="border-b border-white/10 py-4 pr-4 align-top font-display text-[15px] font-semibold text-white"
              >
                {row.job}
              </th>
              {row.cells.map((cell, c) => (
                <td
                  key={c}
                  className={`border-b border-white/10 px-4 py-4 align-top text-[14px] leading-[1.45] ${
                    c === FIRST
                      ? "bg-amber/[0.07] text-[#F4E8DA]"
                      : "text-[#DCE3EE]"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: the five jobs stacked into five cards. */}
      <div className="flex flex-col gap-4 md:hidden">
        {JOBS.map((row) => (
          <div
            key={row.job}
            className="rounded-[14px] border border-white/10 bg-white/[0.045] px-5 py-5"
          >
            <p className="mb-3 font-display text-[18px] font-semibold text-white">
              {row.job}
            </p>
            <dl className="flex flex-col gap-3">
              {COLUMNS.map((col, c) => (
                <div key={col}>
                  <dt
                    className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${
                      c === FIRST ? "text-amber-light" : "text-text-light"
                    }`}
                  >
                    {col}
                  </dt>
                  <dd className="mt-0.5 text-[14px] leading-[1.45] text-[#DCE3EE]">
                    {row.cells[c]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </VizBlock>
  );
}
