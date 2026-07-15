import Link from "next/link";

export default function CompetencyDetail({ competency: c }) {
  return (
    <div className="mt-5">
      <p className="text-navy/90 text-lg leading-relaxed max-w-[70ch]">
        {c.definition}
      </p>
      <p className="mt-4 text-sm text-text-mid">
        I score every competency 1 to 5, and here is exactly what I look at.
      </p>
      <div className="mt-6 grid md:grid-cols-2 gap-5">
        <div className="bg-cream border border-border rounded-2xl p-6">
          <h4 className="font-body font-semibold text-amber text-sm tracking-wide uppercase mb-3">
            The data
          </h4>
          <p className="text-sm text-text-mid mb-3">
            The tools I connect to, and what I read inside them:
          </p>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {c.data.tools.map((t) => (
              <span
                key={t}
                className="text-xs bg-white border border-border rounded-md px-2 py-1 text-navy font-medium"
              >
                {t}
              </span>
            ))}
            <span className="text-xs italic text-text-light">and others</span>
          </div>
          <ul className="space-y-2">
            {c.data.points.map((p, i) => (
              <li
                key={i}
                className="text-[15px] text-navy/90 leading-snug pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-navy-light before:rounded-sm"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-cream border border-border rounded-2xl p-6">
          <h4 className="font-body font-semibold text-amber text-sm tracking-wide uppercase mb-3">
            The questions I ask
          </h4>
          <ul className="space-y-3">
            {c.questions.ask.map((q, i) => (
              <li key={i} className="text-[15px] italic text-navy/90 leading-snug">
                {`“${q}”`}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-text-mid bg-white border-l-[3px] border-amber-light rounded-r-lg px-3 py-2">
            <span className="font-semibold text-navy">What I listen for: </span>
            {c.questions.listenFor}
          </p>
        </div>
      </div>
      {c.learnMoreUrl && (
        <p className="mt-6">
          <Link
            href={c.learnMoreUrl}
            className="text-amber font-semibold hover:underline"
          >
            Read the full breakdown of {c.name} &rarr;
          </Link>
        </p>
      )}
    </div>
  );
}
