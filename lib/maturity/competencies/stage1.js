/**
 * @typedef {Object} Competency
 * @property {number} id            Display id (from maturity-model.html STAGES)
 * @property {string} slug          URL-safe, used for anchor deep-links
 * @property {number} stage         1..4
 * @property {string} name          Exact name from the source list
 * @property {string} appliesTo     "ALL" or a short model note for model-specific
 * @property {string} shortDef      One line for the grid card
 * @property {string} definition    Full lead, near-verbatim from the framework spec
 * @property {{tools: string[], points: string[]}} data   Named tools + what I read
 * @property {{ask: string[], listenFor: string}} questions  Merged Tier 2 + Tier 3
 *
 * NOTE: there is deliberately no `rubric` field. The 1-5 scoring key stays private.
 */
export const STAGE_1 = [
  {
    id: 5,
    slug: "pipeline-stage-design",
    stage: 1,
    name: "Pipeline Stage Design",
    appliesTo: "ALL",
    shortDef:
      "Pipeline stages defined as buyer decision milestones, not sales activities, each with a documented exit criterion before a deal advances.",
    definition:
      "The ability to define your pipeline stages as buyer decision milestones, the things the buyer actually did, rather than sales activities, with a documented exit criterion for each stage that must be verified before a deal moves forward.",
    data: {
      tools: ["HubSpot", "Salesforce", "Pipedrive", "Close"],
      points: [
        "Your pipeline stage configuration, and whether the stages are custom to your process or the CRM defaults.",
        "The time-in-stage distribution across open deals. A stage where everything piles up usually means the exit criteria are missing or vague.",
        "Stage-to-stage conversion rates.",
        "Whether exit-criteria fields exist on the deal record, and whether they actually get filled in.",
      ],
    },
    questions: {
      ask: [
        "What has to be true for a deal to move from your second-to-last stage to closed?",
        "What actually makes a deal qualified in your process?",
        "How do you handle a deal where the rep has done everything, but the buyer has not confirmed the next step?",
        "Walk me through the last deal you won, stage by stage.",
      ],
      listenFor:
        "Buyer actions versus sales activities. If every stage is I sent the proposal or I had the meeting, the stages are activity-based and the pipeline cannot forecast.",
    },
  },
  // ...author the other 5 stage-1 competencies here (ids 1,2,3,4,6) per Task 2.
];
