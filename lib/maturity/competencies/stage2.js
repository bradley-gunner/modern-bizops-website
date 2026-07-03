export const STAGE_2 = [
  {
    id: 7,
    slug: "revenue-forecasting",
    stage: 2,
    name: "Revenue Forecasting",
    appliesTo: "ALL",
    shortDef:
      "A reliable, explainable revenue forecast built on a documented methodology, not gut feel.",
    definition:
      "The ability to produce a reliable, explainable revenue forecast using a documented methodology that combines pipeline data, historical conversion rates, and operational judgment, with a process for reconciling differences between bottom-up and top-down views.",
    data: {
      tools: ["HubSpot", "Salesforce", "Pipedrive", "Close"],
      points: [
        "My pipeline coverage ratio and stage conversion rates.",
        "The deal age distribution across open pipeline.",
        "Close date accuracy, how often deals close when they were originally projected to.",
      ],
    },
    questions: {
      ask: [
        "How do you produce your monthly or quarterly revenue forecast?",
        "How often does your forecast miss by more than 20%?",
        "Does your finance team use your revenue forecast for planning decisions?",
        "Walk me through how you produced your last forecast.",
      ],
      listenFor:
        "Whether you can describe a methodology or whether it comes down to looking at the pipeline and using experience. A described methodology is a real forecast, a gut check is not.",
    },
  },
  {
    id: 8,
    slug: "gtm-operating-cadence",
    stage: 2,
    name: "GTM Operating Cadence",
    appliesTo: "ALL",
    shortDef:
      "A structured schedule of revenue reviews with defined agendas, data, and decision authority, so decisions happen on a rhythm instead of reactively.",
    definition:
      "The ability to design and maintain a structured schedule of revenue reviews, pipeline inspection, forecast calls, cross-functional funnel reviews, quarterly business reviews, with defined agendas, data inputs, decision authorities, and participants, so that revenue decisions happen on a predictable rhythm rather than reactively.",
    data: {
      tools: ["HubSpot", "Salesforce", "your CRM dashboards"],
      points: [
        "CRM activity timestamps, to see whether reviews leave a trace of real updates.",
        "Pipeline stage change frequency. Consistent movement suggests regular reviews are driving action.",
      ],
    },
    questions: {
      ask: [
        "Describe your weekly or monthly revenue review rhythm.",
        "Who attends your pipeline review and what data do you look at?",
        "When something breaks in the business, how do you typically find out about it?",
        "Walk me through what happened in your last pipeline review.",
      ],
      listenFor:
        "Whether you can describe the last review specifically, who was there, what data you looked at, what decision got made. If not, the cadence is informal at best.",
    },
  },
  {
    id: 9,
    slug: "pipeline-hygiene-governance",
    stage: 2,
    name: "Pipeline Hygiene and Governance",
    appliesTo: "ALL",
    shortDef:
      "Enforcing data quality inside the active pipeline so it stays a reliable forecast input, not a historical record of activity.",
    definition:
      "The ability to enforce data quality standards within the active pipeline, manage stale and inflated deals, enforce stage criteria, and maintain a pipeline that is a reliable forecast input rather than a historical record of sales activity.",
    data: {
      tools: ["HubSpot", "Salesforce", "Pipedrive", "Close"],
      points: [
        "Average deal age by stage.",
        "The percentage of deals with a close date in the past.",
        "Last-activity date distribution, and the percentage of deals with all required stage fields populated.",
      ],
    },
    questions: {
      ask: [
        "What happens to a deal if a rep hasn't updated it in 30 days?",
        "How do you handle deals that have been in the same stage longer than your average sales cycle?",
        "Who is responsible for removing dead deals from the pipeline?",
        "Let's pull up the three oldest open deals. What's the current status of each one?",
      ],
      listenFor:
        "How accurate and specific the answer is when I look at the actual oldest deals with you, and how you react to seeing the data. That reaction reveals the true hygiene state.",
    },
  },
  {
    id: 10,
    slug: "sales-to-service-handoff",
    stage: 2,
    name: "Sales-to-Service Handoff",
    appliesTo: "ALL",
    shortDef:
      "A structured, verified handoff that transfers full context to delivery or success, closing the gap between what sales promised and what delivery inherits.",
    definition:
      "The ability to transfer a newly closed client from the sales team to the delivery or customer success team with complete context, including goals, stakeholders, commitments made, and implementation requirements, through a structured, verified process that closes the gap between what sales promised and what delivery inherits.",
    data: {
      tools: ["HubSpot", "Salesforce", "HubSpot Service", "Zendesk"],
      points: [
        "Whether required handoff fields are filled in on closed-won deals.",
        "The time between close-won and first CS activity.",
        "My early, 0 to 90 day, churn rate.",
      ],
    },
    questions: {
      ask: [
        "What information does your delivery or CS team receive when a new client is closed?",
        "What's the most common complaint your delivery team has about the clients sales passes them?",
        "Has a client ever been surprised by something after they signed that was discussed during the sales process?",
        "What do you wish you knew before the kickoff call that you typically find out later?",
      ],
      listenFor:
        "The gap list your CS or delivery lead gives you when asked what they wish they knew earlier. That list is the handoff gap, made concrete.",
    },
  },
  {
    id: 11,
    slug: "customer-onboarding-activation",
    stage: 2,
    name: "Customer Onboarding and Activation",
    appliesTo: "ALL",
    shortDef:
      "A structured onboarding program that delivers a defined first-value milestone on a target timeframe, with intervention triggers when a client falls behind.",
    definition:
      "The ability to guide newly acquired clients through a structured onboarding program that delivers a defined first-value milestone within a target timeframe, with documented milestones, accountability for completion, and intervention triggers when a client falls behind the expected activation pace.",
    data: {
      tools: ["HubSpot Service", "Zendesk", "Intercom"],
      points: [
        "Average time from close to first major milestone.",
        "Onboarding stage completion rate in my CRM or CS platform.",
        "My early, 0 to 90 day, churn rate as a proxy for onboarding failure.",
      ],
    },
    questions: {
      ask: [
        "What does a successful first 30 days look like for a new client?",
        "What's the first meaningful result a new client experiences with you?",
        "What percentage of new clients complete your full onboarding process?",
        "Tell me about the last client who churned in the first 90 days. What happened?",
      ],
      listenFor:
        "Whether I can trace that early churn to a specific onboarding failure, or whether the explanation stays vague, like they weren't a good fit.",
    },
  },
  {
    id: 12,
    slug: "lead-source-strategy",
    stage: 2,
    name: "Lead Source Strategy",
    appliesTo: "ALL",
    shortDef:
      "Defining and measuring the channel mix that generates opportunities, and allocating resources based on channel-level efficiency data instead of habit.",
    definition:
      "The ability to define and measure the mix of channels used to generate revenue opportunities, and to make resource allocation decisions based on channel-level efficiency data rather than habit or intuition.",
    data: {
      tools: ["HubSpot", "Salesforce", "HubSpot Marketing"],
      points: [
        "My lead source field completion rate in the CRM.",
        "The number of distinct source values. Too many means no taxonomy, too few likely means incomplete tracking.",
        "Stage conversion rate and deal size variation by source.",
      ],
    },
    questions: {
      ask: [
        "What percentage of your new clients come from referrals versus your own marketing efforts?",
        "How do you decide where to invest marketing budget?",
        "Which channel produces your best customers, highest value or longest retained?",
        "If you had an extra $10K to spend on marketing this quarter, where would you put it and why?",
      ],
      listenFor:
        "Whether my reasoning is data-driven or gut-driven. That reasoning, not the answer itself, is the real score.",
    },
  },
  {
    id: 13,
    slug: "shared-revenue-definitions-slas",
    stage: 2,
    name: "Shared Revenue Definitions and SLAs",
    appliesTo: "ALL",
    shortDef:
      "One data dictionary for revenue terms across marketing, sales, and success, with SLAs for handoff timing and feedback enforced through the CRM.",
    definition:
      "The ability to establish and maintain a common data dictionary for revenue-relevant terms across marketing, sales, and customer success, including service level agreements for handoff timing and feedback, and to enforce both through CRM workflows and governance review.",
    data: {
      tools: ["HubSpot", "Salesforce", "Pipedrive"],
      points: [
        "CRM field consistency for stage, source, and lead status values.",
        "Lead response time, from lead creation to first contact attempt.",
        "Disqualification reason field completion rate.",
      ],
    },
    questions: {
      ask: [
        "How do marketing and sales define a qualified lead? Is it the same definition?",
        "What is your committed response time for a new inbound lead?",
        "How does sales tell marketing when a lead was bad quality?",
        "If I asked your marketing lead and your top salesperson to each describe a qualified lead, would I get the same answer?",
      ],
      listenFor:
        "Your face when I ask that last question. The honest reaction tells me more than the answer does.",
    },
  },
  {
    id: 14,
    slug: "lead-handoff-process",
    stage: 2,
    name: "Lead Handoff Process",
    appliesTo: "ALL",
    shortDef:
      "The defined trigger, required data, timing SLA, and accept-or-return mechanism that moves a lead from marketing ownership to sales ownership.",
    definition:
      "The ability to define and enforce the specific mechanics by which a lead or account moves from marketing ownership to sales ownership, including the trigger, the required data, the timing SLA, and the mechanism for sales to accept or return leads with a reason code.",
    data: {
      tools: ["HubSpot", "Salesforce", "HubSpot Marketing"],
      points: [
        "Time from lead creation to first sales activity.",
        "Whether a disqualification reason code field exists and gets used.",
        "My MQL-to-SQL conversion rate, and the percentage of leads untouched for more than 48 hours.",
      ],
    },
    questions: {
      ask: [
        "What specifically triggers a lead being handed from marketing to sales?",
        "What happens to a lead if sales doesn't follow up within your SLA?",
        "How do you capture when sales rejects a marketing-qualified lead, and why?",
        "Walk me through the last lead that came in and never went anywhere. What happened to it?",
      ],
      listenFor:
        "Whether that last lead's story reveals a defined process breaking down, or no process at all.",
    },
  },
  {
    id: 15,
    slug: "marketing-sales-feedback-loop",
    stage: 2,
    name: "Marketing-Sales Feedback Loop",
    appliesTo: "ALL",
    shortDef:
      "A structured, recurring exchange where sales feeds lead quality back to marketing and marketing feeds campaign signals forward to sales.",
    definition:
      "The ability to create a structured, recurring process by which sales feeds lead quality intelligence back to marketing, and marketing feeds forward-looking campaign and intent signals to sales, so both functions continuously improve based on shared data rather than siloed metrics.",
    data: {
      tools: ["HubSpot", "Salesforce", "HubSpot Marketing"],
      points: [
        "Whether a lead quality rating field exists in the CRM, and whether it's populated.",
        "My MQL-to-SQL conversion rate trend. Improving usually means the feedback loop is working.",
      ],
    },
    questions: {
      ask: [
        "How does your sales team tell marketing when a campaign is producing bad leads?",
        "When did marketing last change something based on sales feedback?",
        "Does your sales team know what campaigns marketing is running this month?",
        "What did marketing plan for next month, and what did sales say about the last campaign?",
      ],
      listenFor:
        "The gap between what my marketing lead and my sales lead each say when asked these questions separately. That gap is the score.",
    },
  },
  {
    id: 16,
    slug: "sales-playbook",
    stage: 2,
    name: "Sales Playbook",
    appliesTo: "ALL",
    shortDef:
      "Documented, maintained guidance for how the sales team sells, so performance is replicable rather than dependent on individual talent.",
    definition:
      "The ability to document and maintain repeatable guidance for how the sales team sells, covering key scenarios, objection handling, discovery questions, and stage-specific moves, so that sales performance is replicable rather than dependent on individual talent.",
    data: {
      tools: ["HubSpot", "Salesforce", "Pipedrive"],
      points: [
        "CRM stage conversion rates by rep. High variance usually means no shared playbook.",
        "Average sales cycle by rep, where high variance again points to no shared process.",
      ],
    },
    questions: {
      ask: [
        "What do you do when a prospect says your price is too high?",
        "Does your sales team have a documented process for discovery calls?",
        "When was your playbook last updated?",
        "How do you handle a prospect who is comparing you to a competitor?",
      ],
      listenFor:
        "Whether two different salespeople answer that last question the same way. Convergence means the playbook is in practice, divergence means it's missing or ignored.",
    },
  },
  {
    id: 17,
    slug: "rep-onboarding-ramp",
    stage: 2,
    name: "Rep Onboarding and Ramp",
    appliesTo: "ALL",
    shortDef:
      "A structured program with milestone checkpoints and a documented ramp curve that brings new salespeople to full productivity on a defined timeframe.",
    definition:
      "The ability to bring new salespeople to full productivity within a defined timeframe through a structured onboarding program with milestone checkpoints, a documented ramp curve, and management accountability for ramp outcomes.",
    data: {
      tools: ["HubSpot", "Salesforce", "Pipedrive"],
      points: [
        "Time from hire date to first closed deal, by rep cohort.",
        "First-90-day pipeline creation by rep.",
        "CRM activity in the first 30 days. Zero activity usually means no structured onboarding.",
      ],
    },
    questions: {
      ask: [
        "How long does it typically take a new salesperson to close their first deal?",
        "What does your first 30 days for a new sales hire look like?",
        "What percentage of your sales hires in the last two years are still with you?",
        "Walk me through what happened with your last sales hire who didn't work out. When did you know it wasn't going to work?",
      ],
      listenFor:
        "Whether you can pinpoint the moment you knew a ramp was failing, and what you actually did about it. A vague answer means ramp failure is invisible until it's a resignation.",
    },
  },
  {
    id: 18,
    slug: "tech-stack-rationalization",
    stage: 2,
    name: "Tech Stack Rationalization",
    appliesTo: "ALL",
    shortDef:
      "Inventorying the revenue tech stack, assessing redundancy and gaps, and deciding deliberately what to add, replace, or cut, so the stack enforces the process.",
    definition:
      "The ability to inventory the current revenue technology stack, assess redundancy and capability gaps, calculate total cost and utilization, and make deliberate decisions about what to add, replace, or eliminate, so that the stack enforces the process rather than fighting it.",
    data: {
      tools: ["HubSpot", "Salesforce", "your CRM dashboards"],
      points: [
        "Number of connected integrations and CRM data sync health.",
        "Integration error rate.",
        "Number of tools in the stack, from website detection and questionnaire responses.",
      ],
    },
    questions: {
      ask: [
        "List the tools your revenue team uses daily.",
        "What tools are you paying for that the team does not consistently use?",
        "When did you last evaluate whether your tools were the right ones for where the business is now?",
        "Walk me through your tech workflow for a new deal, from lead to close.",
      ],
      listenFor:
        "Every manual step in that workflow that should be automated, and every system switch that causes friction. Each one is a rationalization opportunity.",
    },
  },
  {
    id: 19,
    slug: "revenue-automation-ai-adoption",
    stage: 2,
    name: "Revenue Automation and AI Adoption",
    appliesTo: "ALL",
    shortDef:
      "Systematically identifying, implementing, and extracting value from AI and workflow automation across revenue, calibrated to where the business actually is.",
    definition:
      "The ability to systematically identify, implement, and extract value from AI tools and workflow automation across the revenue function, calibrated to the company's current operational maturity, from basic task automation at early stages to AI-powered intelligence and prediction at later stages.",
    data: {
      tools: ["HubSpot", "Salesforce", "your CRM dashboards"],
      points: [
        "Number of active CRM workflows and automations.",
        "Integration count with sales engagement or conversation intelligence tools.",
        "CRM field auto-population rate, what percentage of fields fill in automatically versus by hand.",
      ],
    },
    questions: {
      ask: [
        "What tasks in your revenue process currently happen automatically without anyone doing them manually?",
        "What AI tools does your team use regularly in their sales or marketing workflow?",
        "Where does your team spend the most time on administrative or repetitive tasks?",
        "Have you tried automating that? What stopped you?",
      ],
      listenFor:
        "Every time you say someone has to manually do something. Each one is an automation opportunity, and your answer to what stopped you tells me whether the barrier is data quality, budget, or bandwidth.",
    },
  },
  {
    id: 20,
    slug: "revenue-reporting-infrastructure",
    stage: 2,
    name: "Revenue Reporting Infrastructure",
    appliesTo: "ALL",
    shortDef:
      "Dashboards and reports that leaders actually use to run the business, so decisions come from trusted data instead of the most convincing spreadsheet.",
    definition:
      "The ability to build, maintain, and govern a set of dashboards and reports that leaders use to run the business, covering the metrics that matter at each function, so that decisions are made from trusted data rather than from whoever assembled the most convincing spreadsheet.",
    data: {
      tools: ["HubSpot", "Salesforce", "your CRM dashboards", "Looker", "Power BI"],
      points: [
        "Whether the CRM has active dashboards, and how often they're actually used.",
        "Data sync health across connected tools.",
      ],
    },
    questions: {
      ask: [
        "Where do you go to see how your business is performing right now?",
        "How often do meetings start with disagreement about which numbers are right?",
        "Who is responsible for maintaining your revenue dashboards?",
        "Can you show me your most-used revenue dashboard, live?",
      ],
      listenFor:
        "What you pull up first, and how confidently you navigate it. That tells me more than any self-assessment.",
    },
  },
  {
    id: 21,
    slug: "unit-economics",
    stage: 2,
    name: "Unit Economics",
    appliesTo: "ALL",
    shortDef:
      "Calculating and using customer acquisition cost, lifetime value, and payback period by segment and channel to drive investment and pricing decisions.",
    definition:
      "The ability to calculate, track, and use the core unit economics of the business, customer acquisition cost, customer lifetime value, and payback period, by segment and channel, and to use these metrics to make channel investment, pricing, and growth investment decisions.",
    data: {
      tools: ["QuickBooks", "Xero"],
      points: [
        "Revenue by customer cohort in my billing and finance data.",
        "Marketing and sales expense data.",
        "Customer tenure data.",
      ],
    },
    questions: {
      ask: [
        "What does it cost you to acquire a new client?",
        "How long does a client typically stay with you?",
        "Do you calculate your customer lifetime value, and if so, how?",
        "If you were going to invest an extra $50K in growth next quarter, how would you decide where to put it?",
      ],
      listenFor:
        "Whether that investment answer is data-driven or just a channel preference. That's the real score.",
    },
  },
  {
    id: 22,
    slug: "capacity-planning",
    stage: 2,
    name: "Capacity Planning",
    appliesTo: "ALL",
    shortDef:
      "Modeling revenue output at different hiring scenarios, accounting for ramp and attrition, to know when to add capacity and what kind pays back fastest.",
    definition:
      "The ability to model the revenue output of the current and planned team at different hiring scenarios, accounting for ramp time and expected attrition, to determine when additional capacity is needed and what type of capacity produces the highest revenue return.",
    data: {
      tools: ["HubSpot", "Salesforce", "your CRM dashboards"],
      points: [
        "Revenue per sales rep, and pipeline created per SDR.",
        "Time from hire to first closed deal.",
        "Rep attrition rate.",
      ],
    },
    questions: {
      ask: [
        "How do you decide when to hire the next salesperson?",
        "Do you know how long it takes a new sales hire to become fully productive?",
        "Do you have a model that connects your headcount to your revenue targets?",
        "If you hire two salespeople today, what would you expect your revenue to look like in 12 months?",
      ],
      listenFor:
        "Whether I can answer that last question with real confidence, or whether hiring is purely reactive to missed targets.",
    },
  },
  {
    id: 23,
    slug: "change-management-adoption",
    stage: 2,
    name: "Change Management and Adoption",
    appliesTo: "ALL",
    shortDef:
      "Planning and executing changes to revenue process and tools so they actually get adopted, instead of getting reverted within weeks.",
    definition:
      "The ability to plan and execute changes to revenue processes and tools in a way that achieves actual adoption, including stakeholder alignment, communication, training, and adoption tracking, rather than deploying changes that the team reverts around within weeks.",
    data: {
      tools: ["HubSpot", "Salesforce", "your CRM dashboards"],
      points: [
        "New CRM field adoption rate after a rollout.",
        "Workflow trigger rates, whether automated workflows are actually firing.",
        "Stage definition adherence after a pipeline redesign.",
      ],
    },
    questions: {
      ask: [
        "Think of the last significant process change you made. How long did it take before the whole team was actually following the new process?",
        "How do you handle a team member who reverts to the old way of doing things?",
        "What's the biggest process improvement you tried that didn't stick, and why?",
        "When you decided to change something, what did you do to make sure the team actually followed the new approach?",
      ],
      listenFor:
        "Whether that last answer is a structured plan, stakeholder alignment, training, a follow-up check, or just an announcement and a hope.",
    },
  },
];
