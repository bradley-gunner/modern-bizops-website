import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";

export const metadata = {
  title: "Security and Data Handling Overview",
  description:
    "How Modern BizOps accesses, protects, and handles your data.",
  alternates: { canonical: "https://modernbizops.com/security" },
  robots: "noindex, nofollow",
};

// VERSION COUPLING: the version string shown below (security-2026-06-17) is the
// reference version recorded alongside the app's clickwrap registry
// (server/src/lib/legalDocs.js). This page is not clickwrap-accepted, but the Terms
// and DPA point to it. If this document's text changes, bump BOTH this string AND
// the app's registry in the same change window so the two never drift.
const VERSION = "security-2026-06-17";

// Shared body rhythm: no @tailwindcss/typography plugin is installed, so the inert
// `prose` class adds no spacing. These arbitrary variants give paragraphs, lists,
// and headings consistent spacing so the document reads as a clean, final page.
const bodyStyles =
  "[&>p]:mb-5 [&>p]:leading-relaxed " +
  "[&>ul]:mb-5 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 " +
  "[&>h2]:font-display [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:text-navy [&>h2]:mt-10 [&>h2]:mb-4";

const th = "py-2 px-3 text-left font-semibold text-navy align-top border-b border-border";
const td = "py-2 px-3 align-top border-b border-border";

export default function SecurityPage() {
  return (
    <>
      <Header />
      <main>
        <Section bg="white" narrow>
          <article className="prose max-w-none font-body text-text-primary">
            <h1 className="font-display text-[32px] md:text-[42px] font-semibold text-navy mb-2">
              Security and Data Handling Overview
            </h1>
            <p className="text-text-light text-sm mb-1">Modern BizOps LLC</p>
            <p className="text-text-light text-sm mb-1">
              Last updated June 17, 2026
            </p>
            <p className="text-text-light text-xs mb-10">
              Version: {VERSION} (effective June 17, 2026)
            </p>

            <div className={bodyStyles}>
              <p>
                If you are in a regulated industry, your own rules (GLBA and SEC
                Regulation S-P for financial advisors, professional
                confidentiality duties for attorneys and accountants) require
                you to vet any vendor that touches your clients&apos; data
                before you connect it. This document is built to make that
                vetting fast. It tells you what we access, where it goes, who
                else touches it, and what happens if something goes wrong.
              </p>

              <h2>The short version</h2>
              <p>
                We connect to your business systems on a{" "}
                <strong>read-only</strong> basis wherever the integration
                allows. We use what we pull to build your audit and
                recommendations, and nothing else. We do not sell it, we do not
                use it to train AI models, and we delete or return it when we are
                done. Everything below is the detail behind those four
                sentences.
              </p>

              <h2>1. How we access your systems</h2>
              <p>
                When you connect a tool, you authorize access through that
                provider&apos;s standard OAuth flow. We never see or store your
                passwords for those systems. Where the provider offers read-only
                scopes, we request read-only, so we can analyze your data but
                cannot change anything in your systems. You can revoke our access
                at any time from your own account with that provider, or by
                disconnecting the integration in the portal.
              </p>
              <p>
                For a few tools that do not offer OAuth, you provide an API key
                or upload a CSV export instead. Those follow the same rules:
                used only for your audit, stored securely, deleted on request.
              </p>

              <h2>2. What data we actually pull</h2>
              <p>
                We pull only what the audit needs. The exact fields depend on
                which systems you connect. As a guide:
              </p>
              <div className="mb-6 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className={th}>System type</th>
                      <th className={th}>What we read</th>
                      <th className={th}>What we never touch</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={td}>CRM (e.g. HubSpot)</td>
                      <td className={td}>
                        Deals, pipeline stages, contact and company records,
                        activity history
                      </td>
                      <td className={td}>Anything you do not connect</td>
                    </tr>
                    <tr>
                      <td className={td}>Support / ticketing</td>
                      <td className={td}>
                        Ticket volumes, response times, categories
                      </td>
                      <td className={td}>
                        Message bodies beyond what&apos;s needed for metrics
                      </td>
                    </tr>
                    <tr>
                      <td className={td}>Marketing / email</td>
                      <td className={td}>Campaign and engagement metrics</td>
                      <td className={td}>
                        Subscriber lists beyond your instruction
                      </td>
                    </tr>
                    <tr>
                      <td className={td}>Financial (e.g. QuickBooks)</td>
                      <td className={td}>
                        Revenue, invoice, and margin figures
                      </td>
                      <td className={td}>
                        Bank credentials; we see reports, not your bank login
                      </td>
                    </tr>
                    <tr>
                      <td className={td}>Scheduling / project tools</td>
                      <td className={td}>
                        Meeting and task data for process analysis
                      </td>
                      <td className={td}>
                        Personal calendar content outside scope
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                If a system would expose your own clients&apos; nonpublic
                personal information, you can scope the connection down, use a
                limited account, or skip that integration for a trial. We would
                rather analyze less than hold data you are not comfortable
                sharing.
              </p>

              <h2>3. Where your data lives and how it is protected</h2>
              <ul>
                <li>
                  <strong>Hosting:</strong> The Platform runs on Render, a
                  US-based cloud provider, in US data centers.
                </li>
                <li>
                  <strong>Encryption:</strong> Connections are encrypted in
                  transit using TLS. The credentials and access tokens for your
                  connected systems are encrypted at rest using AES-256-GCM. The
                  Platform runs on Render, which encrypts stored data at rest.
                </li>
                <li>
                  <strong>Access control:</strong> On our side, access is limited
                  to our founder. Nobody else browses your data. Access to
                  credentials and connected-system tokens is restricted and
                  stored securely.
                </li>
                <li>
                  <strong>Separation:</strong> Each client&apos;s data is
                  logically separated within the Platform.
                </li>
                <li>
                  <strong>Credentials:</strong> OAuth tokens and API keys are
                  stored encrypted and used only to retrieve your data for your
                  audit.
                </li>
              </ul>

              <h2>4. Subprocessors (who else touches the data)</h2>
              <p>
                We use a small set of vendors to run the Platform. Each is bound
                by terms at least as protective as the commitments in our DPA.
              </p>
              <div className="mb-6 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className={th}>Subprocessor</th>
                      <th className={th}>Role</th>
                      <th className={th}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={td}>Render</td>
                      <td className={td}>Cloud hosting</td>
                      <td className={td}>
                        US-based; hosts the application and database
                      </td>
                    </tr>
                    <tr>
                      <td className={td}>Anthropic</td>
                      <td className={td}>AI analysis</td>
                      <td className={td}>
                        Business/API tier; your data is not used to train models
                      </td>
                    </tr>
                    <tr>
                      <td className={td}>OpenAI</td>
                      <td className={td}>AI analysis</td>
                      <td className={td}>
                        Business/API tier; your data is not used to train models
                      </td>
                    </tr>
                    <tr>
                      <td className={td}>Google (Gemini)</td>
                      <td className={td}>AI analysis</td>
                      <td className={td}>
                        Business/API tier; your data is not used to train models
                      </td>
                    </tr>
                    <tr>
                      <td className={td}>HubSpot</td>
                      <td className={td}>CRM and marketing for Modern BizOps</td>
                      <td className={td}>
                        Holds your contact/billing details, not your connected
                        business data
                      </td>
                    </tr>
                    <tr>
                      <td className={td}>Stripe</td>
                      <td className={td}>Payment processing</td>
                      <td className={td}>
                        Handles card payments; we do not store full card numbers
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                We keep this list current and give notice before adding a new
                subprocessor that would process your data.
              </p>

              <h2>5. Artificial intelligence</h2>
              <p>
                Part of the audit uses AI to analyze your data and draft
                recommendations. We send data to the AI providers above through
                their <strong>business or enterprise API tiers</strong>. Under
                those tiers&apos; terms, your data is{" "}
                <strong>not used to train their models</strong>, and they may
                use it only to return results to us. We do not feed your data
                into consumer AI tools, and we do not use it to improve any
                model.
              </p>

              <h2>6. Data retention and deletion</h2>
              <p>
                We keep your data only as long as we need it to deliver your
                engagement. When we finish, or earlier if you ask, we return or
                delete your data within 30 days, your choice. The only
                exceptions are routine backups (which roll off on their normal
                cycle) and anything we are legally required to keep. We will
                confirm deletion in writing if you want it.
              </p>

              <h2>7. If something goes wrong</h2>
              <p>
                If we ever discover a security incident affecting your data, we
                will tell you{" "}
                <strong>without undue delay after we become aware of it</strong>.
                We will tell you what happened, what data was involved, and what
                we are doing about it, and we will cooperate with your response.
                We aim to notify you quickly enough to help you meet your own
                notification deadlines, including the customer-notification
                clock under SEC Regulation S-P.
              </p>

              <h2>8. What we commit to in writing</h2>
              <p>
                These practices are not just marketing. The binding versions
                live in:
              </p>
              <ul>
                <li>
                  <strong>Terms of Service</strong> (
                  <a href="/terms" className="text-amber hover:underline">
                    https://modernbizops.com/terms
                  </a>
                  ). The overall agreement.
                </li>
                <li>
                  <strong>Data Processing Agreement</strong> (
                  <a href="/dpa" className="text-amber hover:underline">
                    https://modernbizops.com/dpa
                  </a>
                  ). How we handle data that contains personal information, with
                  the GLBA/Reg S-P, CCPA/CPRA, and confidentiality commitments
                  spelled out.
                </li>
                <li>
                  <strong>Privacy Policy</strong> (
                  <a href="/privacy" className="text-amber hover:underline">
                    https://modernbizops.com/privacy
                  </a>
                  ). How we handle personal information generally.
                </li>
              </ul>
              <p>
                If your compliance team has a security questionnaire, send it
                over. We would rather answer twenty questions up front than have
                you hesitate to connect the systems that make the audit worth
                doing.
              </p>

              <p className="mt-10">
                <strong>Questions:</strong>{" "}
                <a
                  href="mailto:access@bradleydewet.com"
                  className="text-amber hover:underline"
                >
                  access@bradleydewet.com
                </a>
              </p>
            </div>
          </article>
        </Section>
      </main>
      <Footer />
    </>
  );
}
