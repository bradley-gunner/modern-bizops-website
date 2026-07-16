import Image from "next/image";

// Foot-of-page trust signal on every /learn page. Bradley's real headshot is
// the only photograph in the visual system: no stock photography, and no
// AI-generated photos of him with fabricated clients.
//
// The credential line is the registry's approved byline, passed in by the
// shell, so this component never introduces a claim of its own.
export default function AuthorCard({ credential }) {
  return (
    <aside className="mx-auto mt-11 flex max-w-[760px] items-center gap-5 rounded-2xl border border-border bg-cream px-6 py-[22px]">
      <Image
        src="/img/bradley-headshot.jpg"
        alt="Bradley de Wet"
        width={68}
        height={68}
        className="h-[68px] w-[68px] flex-none rounded-full border-2 border-amber-light object-cover"
      />
      <div className="text-[15px] leading-[1.5] text-text-mid">
        <b className="mb-[3px] block font-display text-[21px] font-semibold text-navy">
          Bradley de Wet
        </b>
        {credential}
      </div>
    </aside>
  );
}
