// The four maturity stages. Competency membership is derived from each
// competency's `stage` field, not duplicated here.
//
// `def`  - plain-language stage definition (used in the full-map depth section).
// `felt` - the stage in the founder's own words, for self-recognition.
// `meet` - "here is where we would meet you" if this is your stage.
// `peek` - a few representative competency slugs shown as a taste (not the full list).
export const STAGES = [
  {
    n: 1,
    name: "Reactive",
    tag: "It runs on you",
    def: "Revenue depends on your effort, relationships, and judgment. Nothing is consistent without you in it. The team follows you, not a system.",
    felt: "Nothing happens without you. Every deal runs through your inbox and your gut. Growth means you working more hours, and you cannot really step away.",
    meet: "We get you out of the founder trap first. A clear picture of who your best-fit customer actually is, and a pipeline that means something. A few foundations, not a system overhaul.",
    peek: ["ideal-customer-profile", "pipeline-stage-design", "lead-qualification-framework"],
  },
  {
    n: 2,
    name: "Repeatable",
    tag: "It runs on a system",
    def: "A system exists that the team can follow without you managing every interaction. The CRM is the record and core processes are written down. But the data is not fully trusted and the forecast is still a gut call.",
    felt: "The team can follow a process without you in every deal, and the CRM is the record. But you do not fully trust the numbers, the forecast is still a gut call, and growth feels like pushing.",
    meet: "We make the data trustworthy and the forecast real, so you can lead from the numbers instead of your gut. We target the few gaps between you and predictable, and nothing more.",
    peek: ["revenue-forecasting", "pipeline-hygiene-governance", "shared-revenue-definitions-slas"],
  },
  {
    n: 3,
    name: "Predictable",
    tag: "It runs on data",
    def: "The business runs on trusted data. Shared definitions, a real operating cadence, and a reliable forecast mean you know what will happen before it happens. Growth no longer requires proportional headcount.",
    felt: "You mostly know what will happen before it happens. The forecast holds, the dashboards are trusted, and growth no longer means hiring in lockstep. But the next gear is not obvious.",
    meet: "You are where most companies want to be. Here it is precision work: retention, expansion, and the leading indicators that compound. We sharpen, we do not rebuild.",
    peek: ["net-revenue-retention-management", "win-loss-analysis", "deal-health-scoring"],
  },
  {
    n: 4,
    name: "Compounding",
    tag: "It improves itself",
    def: "The system improves itself. Leading indicators catch problems before they hit revenue. Expansion grows without chasing new logos. The revenue function is a strategic asset, not a fire to fight.",
    felt: "The system catches problems before they hit revenue, and expansion grows without chasing new logos. Revenue is a strategic asset, not a fire you fight.",
    meet: "You are compounding. Here it is about protecting and extending the edge, focusing only on the highest-leverage plays, if any. Honestly, you may not need us.",
    peek: ["scenario-modeling-sensitivity-analysis", "growth-scorecard"],
  },
];
