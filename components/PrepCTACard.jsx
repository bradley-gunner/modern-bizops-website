import Button from "@/components/ui/Button";

/**
 * Prep questionnaire call-to-action card. Rendered server-side on the
 * thank-you page. The parent passes email + firstName read from the
 * page's searchParams so the /prep deep link pre-fills.
 */
export default function PrepCTACard({ email = "", firstName = "" }) {
  const prepParams = new URLSearchParams();
  if (email) prepParams.set("email", email);
  if (firstName) prepParams.set("firstName", firstName);
  const prepHref = prepParams.toString()
    ? `/prep?${prepParams.toString()}`
    : "/prep";

  return (
    <div className="bg-amber-pale border border-amber/30 rounded-[14px] p-6 md:p-8 mb-8">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 bg-amber rounded-full flex items-center justify-center shrink-0">
          <span className="font-display text-white text-base font-semibold">
            ★
          </span>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold text-navy mb-2">
            One quick thing before our call
          </h2>
          <p className="font-body text-text-primary leading-relaxed">
            {firstName ? `${firstName}, ` : ""}I&apos;ve put together 11
            questions (about 5 minutes) that help me walk into our call with a
            real point of view on your business. Doing this now means we spend
            our 45 minutes on the real conversation, not on catching up.
          </p>
        </div>
      </div>
      <ul className="font-body text-text-mid text-sm space-y-1.5 ml-11 mb-6">
        <li>• Takes about 5 minutes</li>
        <li>
          • Covers your current revenue motion, team, and what you&apos;re
          trying to solve
        </li>
        <li>
          • Not a sales qualifier. Your responses go straight to my prep notes
        </li>
      </ul>
      <div className="ml-11">
        <Button href={prepHref} size="default">
          Complete the prep questionnaire
        </Button>
        <p className="font-body text-sm text-text-light mt-3">
          Aim to finish it at least 24 hours before our call. Takes ~5 minutes.
        </p>
      </div>
    </div>
  );
}
