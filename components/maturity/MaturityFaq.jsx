import Link from "next/link";

// An FAQ answer is a plain string in the registry (that string is also the
// source of truth for the FAQPage JSON-LD). When an item carries an optional
// `aLinks` array of { text, href }, we linkify those exact phrases in the
// rendered accordion only, leaving the schema string untouched.
//
// An href starting with http is an outbound citation, so it renders as a plain
// anchor that opens in a new tab with rel="noopener noreferrer"; internal hrefs
// stay next/link.
function renderAnswer(it) {
  if (!it.aLinks || it.aLinks.length === 0) return it.a;
  let remaining = it.a;
  const nodes = [];
  let key = 0;
  for (const { text, href } of it.aLinks) {
    const idx = remaining.indexOf(text);
    if (idx === -1) continue;
    if (idx > 0) nodes.push(remaining.slice(0, idx));
    nodes.push(
      href.startsWith("http") ? (
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-navy underline"
        >
          {text}
        </a>
      ) : (
        <Link key={key++} href={href} className="text-navy underline">
          {text}
        </Link>
      )
    );
    remaining = remaining.slice(idx + text.length);
  }
  if (remaining) nodes.push(remaining);
  return nodes;
}

export default function MaturityFaq({ items }) {
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <details
          key={i}
          className="bg-white border border-border rounded-xl p-5 group"
        >
          <summary className="font-display font-semibold text-navy text-lg cursor-pointer list-none flex justify-between items-center gap-4">
            {it.q}
            <span className="text-amber group-open:rotate-45 transition-transform shrink-0">
              +
            </span>
          </summary>
          <p className="mt-3 text-text-mid leading-relaxed">{renderAnswer(it)}</p>
        </details>
      ))}
    </div>
  );
}
