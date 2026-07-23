import { MOTIFS, DEFAULT_MOTIF } from "@/components/learn/motifs";

// Hero band for /learn pages. The band is the only themed surface in the visual
// system: it alternates navy/teal by publish order so the library does not read
// as one template repeated. The data blocks stay navy on every page.
const THEMES = {
  navy: "radial-gradient(1100px 520px at 78% -30%, #16294a 0%, #0E1F38 62%)",
  teal: "radial-gradient(1100px 520px at 78% -30%, #12706F 0%, #0A3E3E 64%)",
};

// Splits the H1 so `accentWord` renders italic amber. Matching on the raw
// substring keeps the H1 a single text run in the DOM, so it is still read as
// one heading. An accentWord that is not present is a no-op rather than an
// error: the H1 renders plain and the page is still correct.
function renderH1(h1, accentWord) {
  if (!accentWord) return h1;
  const at = h1.indexOf(accentWord);
  if (at === -1) return h1;
  return (
    <>
      {h1.slice(0, at)}
      <span className="text-amber-light italic">{accentWord}</span>
      {h1.slice(at + accentWord.length)}
    </>
  );
}

export default function LearnHero({
  kicker,
  h1,
  accentWord,
  dek,
  byline,
  cta,
  motif = DEFAULT_MOTIF,
  theme = "navy",
  children,
}) {
  const Motif = MOTIFS[motif] ?? MOTIFS[DEFAULT_MOTIF];

  return (
    // Full bleed: the band spans the viewport, its contents cap at the mockup's
    // 1080. That is wider than the 720 article column below, so the hero
    // deliberately breaks out rather than lining up with the prose. The mockup's
    // bottom radius is dropped here on purpose: it read as a card edge once the
    // band ran to the viewport edges (Bradley, 2026-07-16).
    <div
      className="w-full overflow-hidden text-cream"
      style={{ background: THEMES[theme] ?? THEMES.navy }}
    >
      <div className="relative z-[2] mx-auto flex max-w-[1080px] flex-col items-center gap-9 px-6 py-12 md:flex-row md:px-14 md:pt-[54px] md:pb-[50px]">
        <div className="min-w-0 flex-1 md:basis-[56%]">
          {children}
          {kicker && (
            <div className="mb-3.5 text-[13px] font-medium uppercase tracking-[0.26em] text-amber-light">
              {kicker}
            </div>
          )}
          <h1 className="mb-4 font-display text-[38px] font-semibold leading-[1.05] text-white md:text-[50px]">
            {renderH1(h1, accentWord)}
          </h1>
          {dek && (
            <p className="mb-[22px] max-w-[46ch] text-[17px] leading-[1.5] text-[#D7DEEA] md:text-[18px]">
              {dek}
            </p>
          )}
          {byline && (
            <p className="max-w-[54ch] border-t border-white/[0.12] pt-4 text-[13.5px] leading-[1.5] text-text-light">
              {byline}
            </p>
          )}
          {/* Optional above-the-fold CTA, rendered as part of the hero band so
              it reads as a designed element rather than a bare button dropped on
              the article below. Only pages that pass `cta` get one. */}
          {cta && <div className="mt-6">{cta}</div>}
        </div>
        {/* w-full is load-bearing on the stacked layout: the row's items-center
            makes this column shrink-to-fit on the cross axis, which would
            resolve the motif's own w-full to zero and silently drop it. */}
        <div className="flex w-full min-w-0 flex-1 justify-center md:basis-[44%]" aria-hidden="true">
          <div className="w-full max-w-[420px]">
            <Motif />
          </div>
        </div>
      </div>
    </div>
  );
}
