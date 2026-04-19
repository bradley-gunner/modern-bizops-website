export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Modern BizOps",
    url: "https://modernbizops.com",
    description:
      "Revenue growth coaching for $3M–$15M companies. Done-with-you coaching that builds sales, marketing, and delivery systems.",
    founder: {
      "@type": "Person",
      name: "Bradley de Wet",
    },
  };
}

export function getServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Revenue Growth Coaching",
    provider: {
      "@type": "Organization",
      name: "Modern BizOps",
    },
    description:
      "Done-with-you coaching that builds the operational systems to grow revenue without proportionally growing headcount. 7-phase methodology with proprietary diagnostic technology.",
    areaServed: "Worldwide",
    serviceType: "Business Coaching",
  };
}

export function getPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Bradley de Wet",
    jobTitle: "Founder & Revenue Operations Coach",
    worksFor: {
      "@type": "Organization",
      name: "Modern BizOps",
    },
    description:
      "15+ years building revenue operations inside high-growth, VC-backed startups. Helps $3M–$15M companies build revenue engines that grow without proportional headcount growth.",
  };
}

export function getFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is this different from a marketing agency or CRM consultant?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Agencies execute tactics. CRM consultants configure software. I build the operational system that connects your marketing, sales, and delivery into one revenue engine, and I coach your team to run it. When we're done, you don't need me anymore.",
        },
      },
      {
        "@type": "Question",
        name: "We're only a $3M company. Are we too small for this?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "If you have a sales team, a marketing function, and clients to serve, you have a revenue engine, even if it's held together with duct tape. The earlier you build the right systems, the faster you grow.",
        },
      },
      {
        "@type": "Question",
        name: "What if my team resists the changes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "That's exactly why this is done-with-you, not done-to-you. Your team is involved in every phase: mapping their own processes, defining their own metrics, choosing the AI tools they'll actually use. People don't resist change they helped create.",
        },
      },
      {
        "@type": "Question",
        name: "What kind of AI tools will we implement?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Depends on where your biggest time drains are. Common implementations include AI-powered lead scoring, automated follow-up sequences, chatbots for initial customer support, and automated reporting dashboards. We focus on tools that save your team measurable hours per week, not shiny objects.",
        },
      },
      {
        "@type": "Question",
        name: "I've been burned by consultants before.",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most consulting engagements fail because the consultant builds something in a silo that the team rejects, or because the engagement ends and nobody knows how to maintain what was built. My model solves both problems: your team builds it with my guidance, so they own it. And every recommendation comes from your actual data, not a generic template.",
        },
      },
      {
        "@type": "Question",
        name: "What's the investment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on your company's size and complexity. Engagements range from $8,000 for early-stage companies to $25,000+ for mature organizations. Book a discovery call and we'll scope it to your situation.",
        },
      },
    ],
  };
}
