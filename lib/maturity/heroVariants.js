// Problem-language hero hooks for message testing. Only DEFAULT_VARIANT renders
// today; the array is the fixture a future bucketing layer selects from.
export const HERO_VARIANTS = [
  {
    id: "predictable",
    h1: "Right now, your revenue runs on you.",
    sub: "There is a path from here to a business that runs on a system, and then improves itself. It has four stages. Find where you are, and we will show you what to build next.",
  },
  {
    // The id stays "headcount" on purpose: it is the bucketing key and it ships
    // to GA4 as the `hero_variant` param, so renaming it would split this
    // variant's history in two. The h1 no longer makes a claim about hiring,
    // per doc 08's 2026-08-18 tone rule that the gains show up as raises and
    // hires rather than as headcount avoided. It read "Grow revenue without
    // adding headcount." until then. This variant does not render today;
    // DEFAULT_VARIANT_ID is "predictable".
    id: "headcount",
    h1: "Grow revenue without growing the busywork.",
    sub: "The GTM Maturity Framework shows you which parts of your revenue engine are built, and which parts still run on you.",
  },
  {
    id: "runs-without-you",
    h1: "Build a business that runs without you.",
    sub: "The GTM Maturity Framework is the path, from revenue that depends on you to revenue that compounds on its own.",
  },
  {
    id: "b2b",
    h1: "Right now, your B2B revenue runs on you.",
    sub: "There is a path from here to a business that runs on a system, and then improves itself. It has four stages. Find where you are, and we will show you what to build next.",
  },
];

export const DEFAULT_VARIANT_ID = "predictable";

export function getHeroVariant(id = DEFAULT_VARIANT_ID) {
  return HERO_VARIANTS.find((v) => v.id === id) || HERO_VARIANTS[0];
}
