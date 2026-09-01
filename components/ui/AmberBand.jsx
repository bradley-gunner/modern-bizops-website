// THE THROUGHLINE. Board item web-personality-design.
//
// David Ellis (Tugboat), slides 11 and 22, joint highest-rated finding in his
// audit: he would have assumed this was a minimally-tweaked Squarespace or Wix
// site if he had not already known otherwise. His examples of what a throughline
// looks like were Twilio red and Miro yellow.
//
// THE HUE DID NOT CHANGE, AND THAT WAS THE DECISION. Amber #B5520A is already
// the logo's colour and already the site's accent. What it never had was AREA:
// before this it appeared as 13px eyebrows, small price numbers and hairline
// left borders, and a colour used only at 13px cannot be a throughline no
// matter how distinctive it is. Twilio red and Miro yellow own whole fields.
// Inventing a new brand colour would also have invalidated the OG cards, the
// carousel template, the deck system and the app, all of which are amber today.
//
// ONE PER PRIMARY PAGE, AT THE PAGE'S TURN. The band carries the single
// sentence that page most wants remembered, and it lands where the page pivots
// from problem to answer. That constraint is the whole design: a band on every
// second section is wallpaper, and a band on a decorative section is worse than
// none. If a fourth caller appears, check it is a real turn before adding it.
//
// It lives in one component so the three pages cannot drift apart, which is the
// failure mode for any "consistent treatment" held in three files.
//
// CONTRAST. Cream on this amber is 4.51:1, which clears WCAG AA for body text,
// and white is 5.03:1. Navy on it is 3.28:1 and does NOT clear AA, so nothing
// in here is set in navy and nothing should be added in navy.
export default function AmberBand({ children, statement }) {
  return (
    <section className="bg-amber">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-14 md:py-20">
        <div className="max-w-[860px]">
          <p className="font-display text-[28px] md:text-[40px] font-semibold text-cream leading-[1.2]">
            {statement}
          </p>
          {children && (
            <div className="mt-6 font-body text-cream/90 text-base md:text-lg leading-relaxed">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Links inside a band: cream body text is already at the AA floor, so a link
// has to separate itself by weight and underline rather than by another colour.
export const bandLinkClass =
  "font-semibold text-white underline underline-offset-4 decoration-2 hover:text-cream transition-colors";
