import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import MaturityFaq from "@/components/maturity/MaturityFaq";
import LearnHero from "@/components/learn/LearnHero";
import AuthorCard from "@/components/learn/AuthorCard";
import { AUTHOR_CREDENTIAL } from "@/lib/learn/registry";

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
        {/* The hero band is full-bleed to the top of main, so the breadcrumb and
            the last-updated line live inside it rather than above it. The dek is
            the page's title tag verbatim (or the registry's subhead override
            where the title would repeat the H1), and stays a plain paragraph
            rather than a heading so it never lands in a generated contents list. */}
        <LearnHero
          kicker={entry.visual.kicker}
          h1={entry.h1}
          accentWord={entry.visual.accentWord}
          dek={entry.subhead ?? entry.title}
          byline={`${entry.byline} Last updated ${formatLastUpdated(entry.lastUpdated)}.`}
          motif={entry.visual.motif}
          theme={entry.visual.theme}
        >
          <nav aria-label="Breadcrumb" className="mb-5 text-[13px] text-white/50">
            {entry.breadcrumb.map((b, i) => {
              const isLast = i === entry.breadcrumb.length - 1;
              // noLink crumbs (e.g. "Learn", which has no index route yet)
              // render as plain text so the trail never links to a 404.
              return (
                <span key={b.url}>
                  {i > 0 && <span className="mx-1.5">/</span>}
                  {isLast ? (
                    <span className="text-white/75">{b.name}</span>
                  ) : b.noLink ? (
                    <span>{b.name}</span>
                  ) : (
                    <Link
                      href={b.url.replace("https://modernbizops.com", "") || "/"}
                      className="underline-offset-2 hover:text-amber-light hover:underline"
                    >
                      {b.name}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>
        </LearnHero>

        <Section bg="cream" narrow className="pt-10 md:pt-12">
          <article className="space-y-6 text-lg text-text-mid leading-relaxed">
            {children}
          </article>
          <AuthorCard credential={AUTHOR_CREDENTIAL} />
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
