import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";

export const metadata = {
  title: "Data Processing Agreement",
  description: "Data Processing Agreement for Modern BizOps LLC.",
  alternates: { canonical: "https://modernbizops.com/dpa" },
  robots: "noindex, nofollow",
};

// VERSION COUPLING: the version string shown below (dpa-2026-06-17) is recorded
// in the app's clickwrap acceptance log (server/src/lib/legalDocs.js) as proof of
// which version each client accepted. If this document's text changes, bump BOTH
// this string AND the app's registry in the same change window so they never drift.
const VERSION = "dpa-2026-06-17";

// Shared body rhythm: no @tailwindcss/typography plugin is installed, so the inert
// `prose` class adds no spacing. These arbitrary variants give paragraphs, lists,
// and headings consistent spacing so the document reads as a clean, final page.
const bodyStyles =
  "[&>p]:mb-5 [&>p]:leading-relaxed " +
  "[&>ul]:mb-5 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-1 " +
  "[&>h2]:font-display [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:text-navy [&>h2]:mt-10 [&>h2]:mb-4";

export default function DpaPage() {
  return (
    <>
      <Header />
      <main>
        <Section bg="white" narrow>
          <article className="prose max-w-none font-body text-text-primary">
            <h1 className="font-display text-[32px] md:text-[42px] font-semibold text-navy mb-2">
              Data Processing Agreement
            </h1>
            <p className="text-text-light text-sm mb-1">
              Last updated June 17, 2026
            </p>
            <p className="text-text-light text-xs mb-10">
              Version: {VERSION} (effective June 17, 2026)
            </p>

            <div className={bodyStyles}>
              <p>
                This Data Processing Agreement (&quot;DPA&quot;) supplements and
                is incorporated into the Modern BizOps Terms of Service (
                <a href="/terms" className="text-amber hover:underline">
                  https://modernbizops.com/terms
                </a>
                ) between <strong>Modern BizOps LLC</strong> (&quot;Modern
                BizOps,&quot; &quot;we,&quot; &quot;us&quot;) and the client
                that accepts it (&quot;Client,&quot; &quot;you&quot;). It
                governs our processing of Client Data that contains personal
                information. If the Terms and this DPA conflict on a
                data-protection matter, this DPA controls.
              </p>

              <h2>1. Definitions</h2>
              <p>
                Terms not defined here have the meaning given in the Terms or in
                applicable privacy law.
              </p>
              <ul>
                <li>
                  <strong>Client Data</strong> means data you provide or that we
                  retrieve from systems you connect, as described in the Terms.
                </li>
                <li>
                  <strong>Personal Information</strong> means information within
                  Client Data that identifies or relates to an identifiable
                  individual, as defined by applicable privacy law (including
                  the CCPA/CPRA and other US state privacy laws).
                </li>
                <li>
                  <strong>Applicable Privacy Law</strong> means privacy and
                  data-protection laws that apply to our processing of Personal
                  Information under this DPA, including the California Consumer
                  Privacy Act as amended by the CPRA, other US state privacy
                  laws, and, where relevant to your industry, the
                  Gramm-Leach-Bliley Act (GLBA) and SEC Regulation S-P.
                </li>
                <li>
                  <strong>Process / Processing</strong> means any operation
                  performed on Personal Information.
                </li>
                <li>
                  <strong>Subprocessor</strong> means a third party we engage to
                  process Personal Information on our behalf.
                </li>
                <li>
                  <strong>Security Incident</strong> means a breach of security
                  leading to the accidental or unlawful destruction, loss,
                  alteration, unauthorized disclosure of, or access to, Personal
                  Information.
                </li>
              </ul>

              <h2>2. Roles of the parties</h2>
              <p>
                For Personal Information in Client Data,{" "}
                <strong>
                  you are the controller / business and we are the processor /
                  service provider.
                </strong>{" "}
                We process Personal Information only on your documented
                instructions, which include the Terms, this DPA, your Order, and
                your configuration and use of the Platform. We are not a
                &quot;third party&quot; under the CCPA/CPRA with respect to your
                Personal Information, and we do not &quot;sell&quot; or
                &quot;share&quot; it as those terms are defined.
              </p>
              <p>
                If we believe an instruction violates Applicable Privacy Law, we
                will tell you and may pause that processing.
              </p>

              <h2>3. Scope of processing</h2>
              <p>The details of our processing are:</p>
              <ul>
                <li>
                  <strong>Subject matter:</strong> delivery of the revenue
                  operations audit, analysis, coaching, and related deliverables
                  described in your Order.
                </li>
                <li>
                  <strong>Duration:</strong> the term of your engagement, plus
                  the return-or-deletion period in Section 11.
                </li>
                <li>
                  <strong>Nature and purpose:</strong> accessing, collecting,
                  organizing, analyzing, and reporting on Client Data to produce
                  your deliverables, and operating and securing the Platform.
                </li>
                <li>
                  <strong>Types of Personal Information:</strong> contact and
                  professional details of your staff and customers, CRM and
                  pipeline records, support and marketing records, transactional
                  and financial records contained in connected systems, and
                  access credentials for connected systems. The exact set
                  depends on which systems you connect.
                </li>
                <li>
                  <strong>Categories of data subjects:</strong> your personnel,
                  your customers and prospects, and other individuals whose
                  information appears in the systems you connect.
                </li>
              </ul>
              <p>
                You are responsible for ensuring you have the right and any
                necessary notices or consents to provide Client Data to us and
                to connect the systems you choose.
              </p>

              <h2>4. Our obligations</h2>
              <p>We will:</p>
              <p>
                <strong>(a) Purpose limitation.</strong> Process Personal
                Information only to provide the Services and for no other
                purpose. We will not retain, use, or disclose it outside our
                direct business relationship with you, and we will not combine
                it with data from other sources except to perform a service you
                have requested. We certify we understand and will comply with
                these restrictions (CCPA/CPRA service-provider certification).
              </p>
              <p>
                <strong>(b) No sale or sharing.</strong> Never sell or share
                Personal Information, and never use it for cross-context
                behavioral advertising.
              </p>
              <p>
                <strong>(c) Read-only where available.</strong> Request
                read-only access to connected systems wherever the integration
                supports it, consistent with our Security and Data Handling
                Overview.
              </p>
              <p>
                <strong>(d) Confidentiality.</strong> Limit access to Personal
                Information to personnel who need it to deliver the Services and
                who are bound by confidentiality obligations.
              </p>
              <p>
                <strong>(e) Security.</strong> Maintain administrative,
                technical, and physical safeguards appropriate to the risk, as
                described in our Security and Data Handling Overview (
                <a href="/security" className="text-amber hover:underline">
                  https://modernbizops.com/security
                </a>
                ), including encryption of Personal Information in transit and
                at rest, access controls, and credential protection. These
                safeguards are designed to meet the &quot;reasonable
                security&quot; standard under Applicable Privacy Law and, where
                your industry requires it, the safeguards expectations of the
                GLBA Safeguards Rule and SEC Regulation S-P.
              </p>
              <p>
                <strong>(f) Assist with individual rights.</strong> Provide
                reasonable assistance, taking into account the nature of the
                processing, to help you respond to requests from individuals to
                access, correct, delete, or obtain a copy of their Personal
                Information, and to honor opt-outs. If we receive such a request
                directly, we will forward it to you rather than respond on your
                behalf, unless you instruct otherwise.
              </p>
              <p>
                <strong>(g) Assist with compliance.</strong> Provide information
                reasonably necessary to help you meet your own obligations,
                including data protection assessments and regulatory inquiries,
                to the extent the information is within our control.
              </p>

              <h2>5. Subprocessors</h2>
              <p>
                You authorize us to use Subprocessors to provide the Services.
                We will:
              </p>
              <ul>
                <li>
                  impose data-protection obligations on each Subprocessor that
                  are no less protective than this DPA;
                </li>
                <li>remain responsible for each Subprocessor&apos;s performance; and</li>
                <li>
                  maintain a current list of Subprocessors in our Security and
                  Data Handling Overview and give you advance notice of any new
                  Subprocessor that processes Personal Information, with a
                  reasonable opportunity to object on reasonable data-protection
                  grounds.
                </li>
              </ul>
              <p>
                <strong>Artificial intelligence providers.</strong> Some
                Services use AI providers (currently including Anthropic,
                OpenAI, and Google) as Subprocessors. We use these providers
                through their business or enterprise API tiers. Under those
                tiers&apos; terms, Personal Information we send is{" "}
                <strong>not used to train the providers&apos; models</strong>,
                and the providers may use it only to return results to us. We
                will not enable any model-training use of your Personal
                Information without your prior consent.
              </p>

              <h2>6. Security Incidents</h2>
              <p>
                If we become aware of a Security Incident affecting your
                Personal Information, we will notify you{" "}
                <strong>without undue delay after we become aware of it</strong>
                . The notice will describe, to the extent known, the nature of
                the incident, the data and individuals affected, the likely
                consequences, and the measures taken or proposed. We will
                cooperate reasonably with your investigation and remediation. We
                aim to notify you quickly enough to help regulated clients meet
                their own notification deadlines, including the
                customer-notification timeline under SEC Regulation S-P. Our
                notice is not an acknowledgment of fault.
              </p>

              <h2>7. GLBA and SEC Regulation S-P (financial-industry clients)</h2>
              <p>
                Where you are a financial institution subject to the GLBA or an
                entity subject to SEC Regulation S-P, we acknowledge that
                Personal Information may include &quot;nonpublic personal
                information&quot; or &quot;customer information&quot; as those
                rules define it. With respect to that information we will:
                maintain safeguards appropriate to its sensitivity as described
                in Section 4(e); use and disclose it only as permitted by this
                DPA and as needed to deliver the Services; and support your
                service-provider oversight obligations by making our security
                documentation available for your due diligence and monitoring
                (Section 9). We do not become a financial institution or a
                regulated entity by performing the Services.
              </p>

              <h2>8. Professional and legal confidentiality clients</h2>
              <p>
                Where you are an attorney, accountant, or other regulated
                professional, Personal Information we process for you may be
                subject to professional privilege or confidentiality duties you
                owe your own clients. We will treat that information as
                Confidential Information, process it only as needed to deliver
                the Services, and not assert any right to use or disclose it
                that would be inconsistent with those duties. Nothing here
                waives any privilege.
              </p>

              <h2>9. Audit and oversight</h2>
              <p>
                To support your due-diligence and monitoring obligations, we
                will, on reasonable request and no more than once per year
                unless a regulator or a Security Incident requires otherwise:
                provide our current Security and Data Handling Overview and any
                security certifications or summaries we maintain; respond to a
                reasonable written security questionnaire; and make a
                knowledgeable representative available to discuss our controls.
                Any audit will respect our confidentiality and security
                obligations to other clients and will not require access to our
                systems or other clients&apos; data.
              </p>

              <h2>10. International transfers</h2>
              <p>
                We process and store Personal Information in the United States.
                If you direct us to process data subject to non-US transfer
                requirements, the parties will put any additional terms in place
                that the law requires before that processing begins.
              </p>

              <h2>11. Return and deletion</h2>
              <p>
                On termination or expiration of your engagement, or earlier on
                your written request, we will return or delete Personal
                Information in our possession within 30 days, at your choice,
                except for copies we are required to retain by law or that exist
                in routine backups, which we will protect and delete on our
                normal cycle. On request, we will confirm deletion in writing.
              </p>

              <h2>12. Liability</h2>
              <p>
                Each party&apos;s liability under this DPA is subject to the
                limitations of liability in the Terms. This DPA does not expand
                either party&apos;s aggregate liability beyond those limits.
              </p>

              <h2>13. Term and order of precedence</h2>
              <p>
                This DPA takes effect when you accept it (by clickwrap or
                signature) and continues while we process Personal Information
                for you. It survives termination of the Terms until all Personal
                Information is returned or deleted. On any data-protection
                matter, this DPA prevails over the Terms and any Order.
              </p>

              <h2>Acceptance</h2>
              <p>
                <strong>Clickwrap.</strong> By accepting the Terms of Service at
                account creation, you accept this DPA. We record the version you
                accepted and the date and time of acceptance.
              </p>
              <p>
                <strong>Countersigned (on request).</strong> Regulated clients
                who require a signed copy may execute below. A signed copy
                supplements, and does not replace, your clickwrap acceptance.
              </p>

              <div className="mt-8 grid gap-8 rounded-lg border border-border bg-cream p-6 sm:grid-cols-2">
                <div>
                  <p className="font-semibold text-navy mb-4">
                    Modern BizOps LLC
                  </p>
                  <p className="text-sm text-text-mid">
                    Signature: ______________________
                  </p>
                  <p className="text-sm text-text-mid">Name: Bradley de Wet</p>
                  <p className="text-sm text-text-mid">Title: Member</p>
                  <p className="text-sm text-text-mid">Date: ____________</p>
                </div>
                <div>
                  <p className="font-semibold text-navy mb-4">Client</p>
                  <p className="text-sm text-text-mid">
                    Signature: ______________________
                  </p>
                  <p className="text-sm text-text-mid">Name: ____________</p>
                  <p className="text-sm text-text-mid">Title: ____________</p>
                  <p className="text-sm text-text-mid">Entity: ____________</p>
                  <p className="text-sm text-text-mid">Date: ____________</p>
                </div>
              </div>
            </div>
          </article>
        </Section>
      </main>
      <Footer />
    </>
  );
}
