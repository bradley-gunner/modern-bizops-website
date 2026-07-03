// The four maturity stages. Definitions are the plain-language versions from
// the maturity-model visual, voiced for a founder. Competency membership is
// derived from each competency's `stage` field, not duplicated here.
export const STAGES = [
  { n: 1, name: "Reactive", tag: "It runs on you",
    def: "Revenue depends on your effort, relationships, and judgment. Nothing is consistent without you in it. The team follows you, not a system." },
  { n: 2, name: "Repeatable", tag: "It runs on a system",
    def: "A system exists that the team can follow without you managing every interaction. The CRM is the record and core processes are written down. But the data is not fully trusted and the forecast is still a gut call." },
  { n: 3, name: "Predictable", tag: "It runs on data",
    def: "The business runs on trusted data. Shared definitions, a real operating cadence, and a reliable forecast mean you know what will happen before it happens. Growth no longer requires proportional headcount." },
  { n: 4, name: "Compounding", tag: "It improves itself",
    def: "The system improves itself. Leading indicators catch problems before they hit revenue. Expansion grows without chasing new logos. The revenue function is a strategic asset, not a fire to fight." },
];
