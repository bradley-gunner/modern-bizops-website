import Button from "@/components/ui/Button";

// The standard closing / mid-article CTA across the site: a navy card that
// frames the offer and its value before the button, matching the card
// LearnPageShell renders by default. Pages that own their CTAs (inlineCtas, or
// root-level pages outside the shell) use this so their CTAs read the same as
// the single-CTA pages instead of dropping a bare button into the prose. The
// Button fires cta_click via its ctaLocation exactly as before.
//
// It lives under learn/ for historical reasons; the homepage, /about, /pricing
// and the offer pages all use it now, so treat it as site-wide.
//
// PASS `children` when a CTA does not fit heading + body + one button: the
// homepage and /about close with two buttons and their own reassurance lines,
// and the homepage keeps a larger closing headline on purpose. Children own
// the whole inside of the card and get the chrome, which is the part that has
// to stay identical everywhere.
export default function CtaCallout({
  eyebrow,
  heading,
  body,
  buttonLabel,
  href,
  ctaLocation,
  children,
}) {
  return (
    <div className="mx-auto my-11 max-w-[760px] rounded-2xl bg-navy px-8 py-12 text-center text-white shadow-[0_22px_50px_-20px_rgba(14,31,56,0.6)] md:px-12 md:py-14">
      {children ?? (
        <>
          {eyebrow && (
            <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.26em] text-amber-light">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="mb-4 font-display text-2xl font-semibold text-white md:text-[28px]">
              {heading}
            </h2>
          )}
          {body && (
            <p className="mx-auto mb-6 max-w-[52ch] text-white/80">{body}</p>
          )}
          <Button href={href} ctaLocation={ctaLocation}>
            {buttonLabel}
          </Button>
        </>
      )}
    </div>
  );
}
