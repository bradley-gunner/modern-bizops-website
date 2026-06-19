export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Modern BizOps",
    url: "https://modernbizops.com",
    description:
      "Revenue growth coaching for founder-led B2B companies from $3M to $50M. Done-with-you coaching that builds sales, marketing, and delivery systems.",
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
      "Done-with-you coaching that builds the operational systems to grow revenue without proportionally growing headcount. A four-phase engagement built on the Revenue Operations Maturity Model and the Revenue Intelligence Platform.",
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
      "15+ years building revenue operations inside high-growth, VC-backed startups. Helps founder-led B2B companies from $3M to $50M build revenue engines that grow without proportional headcount growth.",
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
          text: "Agencies execute tactics. CRM consultants configure software. I build the operational system that connects your marketing, sales, and delivery into one revenue engine, and I coach your team to run it. When we are done, you do not need me anymore. That is the point.",
        },
      },
      {
        "@type": "Question",
        name: "We are only a $3M company. Are we too small for this?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "If you have a sales team, a marketing function, and clients to serve, you have a revenue engine, even if it is held together with duct tape. The earlier you build the right systems, the faster you grow and the less painful the scaling process is.",
        },
      },
      {
        "@type": "Question",
        name: "What if my team resists the changes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "That is why this is done-with-you, not done-to-you. Your team is involved throughout: mapping their own processes, defining their own metrics, choosing the tools they will actually use. People do not resist change they helped create.",
        },
      },
      {
        "@type": "Question",
        name: "How is my maturity stage determined?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Three ways, in sequence. First, the Revenue Intelligence Platform connects to your existing tools and analyzes your actual data: CRM completeness, pipeline stage distribution, integration coverage. That takes about 30 minutes of your time and produces data-driven scores on 15-20 competencies without any self-reporting. Second, a structured questionnaire covers what data alone cannot assess. Third, a 60-90 minute discovery call with you personally, where I validate the preliminary scores and surface anything the data cannot capture. You see the scoring rationale for every competency. Nothing is a black box.",
        },
      },
      {
        "@type": "Question",
        name: "I have been burned by consultants before.",
        acceptedAnswer: {
          "@type": "Answer",
          text: "I hear this a lot. Most consulting engagements fail because the consultant builds something in a silo that the team rejects, or because the engagement ends and nobody knows how to maintain what was built. My model solves both problems: your team builds it with my coaching, so they own it. And every recommendation comes from your actual maturity assessment, not a generic template applied to every client regardless of where they are.",
        },
      },
    ],
  };
}
