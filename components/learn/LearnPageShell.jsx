import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import MaturityFaq from "@/components/maturity/MaturityFaq";

function formatLastUpdated(dateStr) {
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function LearnPageShell({ entry, children }) {
  return (
    <>
      <Header />
      <main>
        <Section bg="cream" narrow>
          <nav aria-label="Breadcrumb" className="text-sm text-text-light mb-6">
            {entry.breadcrumb.map((b, i) => {
              const isLast = i === entry.breadcrumb.length - 1;
              return (
                <span key={b.url}>
                  {i > 0 && <span className="mx-2">/</span>}
                  {isLast ? (
                    <span className="text-text-mid">{b.name}</span>
                  ) : (
                    <Link
                      href={b.url.replace("https://modernbizops.com", "") || "/"}
                      className="hover:text-navy"
                    >
                      {b.name}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>

          <h1 className="font-display font-semibold text-navy text-4xl md:text-5xl leading-tight">
            {entry.h1}
          </h1>
          {/* On-page subhead (dek): the page's title tag verbatim (or the
              registry's subhead override where the title would repeat the H1),
              styled as a visual element rather than a semantic heading so it
              never shows up in an auto-generated table of contents. */}
          <p className="font-display text-navy-mid text-2xl md:text-3xl leading-snug mt-4">
            {entry.subhead ?? entry.title}
          </p>
          <p className="text-text-mid italic mt-4">{entry.byline}</p>
          <p className="text-xs text-text-light mt-2">
            Last updated {formatLastUpdated(entry.lastUpdated)}
          </p>

          <article className="mt-10 space-y-6 text-lg text-text-mid leading-relaxed">
            {children}
          </article>
        </Section>

        <Section bg="white" narrow>
          <h2 className="font-display font-semibold text-navy text-3xl mb-6 text-center">
            FAQ
          </h2>
          <MaturityFaq items={entry.faq} />
        </Section>

        <Section bg="navy" narrow>
          <div className="text-center">
            <p className="text-white/80 mb-6 max-w-[58ch] mx-auto">{entry.ctaText}</p>
            <Button href={entry.ctaUrl} ctaLocation="learn_mid_page">
              {entry.ctaButtonLabel}
            </Button>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
