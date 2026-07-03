// Problem-language hero hooks for message testing. Only DEFAULT_VARIANT renders
// today; the array is the fixture a future bucketing layer selects from.
export const HERO_VARIANTS = [
  {
    id: "predictable",
    h1: "Right now, your revenue runs on you.",
    sub: "Here is the system that changes that. The Revenue Operations Maturity Model: four stages and 44 competencies that move you from revenue that depends on your effort to revenue you can predict.",
  },
  {
    id: "headcount",
    h1: "Grow revenue without adding headcount.",
    sub: "The Revenue Operations Maturity Model shows you which parts of your revenue engine are built, and which parts still run on you.",
  },
  {
    id: "runs-without-you",
    h1: "Build a business that runs without you.",
    sub: "The Revenue Operations Maturity Model is the path, from revenue that depends on you to revenue that compounds on its own.",
  },
  {
    id: "b2b",
    h1: "Right now, your B2B revenue runs on you.",
    sub: "Here is the system that changes that. The Revenue Operations Maturity Model: four stages and 44 competencies that move a founder-led B2B company from revenue that depends on you to revenue you can predict.",
  },
];

export const DEFAULT_VARIANT_ID = "predictable";

export function getHeroVariant(id = DEFAULT_VARIANT_ID) {
  return HERO_VARIANTS.find((v) => v.id === id) || HERO_VARIANTS[0];
}
