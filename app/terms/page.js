import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/ui/Section";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Modern BizOps LLC.",
  robots: "noindex, nofollow",
};

// VERSION COUPLING: the version string shown below (tos-2026-06-17) is recorded
// in the app's clickwrap acceptance log (server/src/lib/legalDocs.js) as proof of
// which version each client accepted. If this document's text changes, bump BOTH
// this string AND the app's registry in the same change window so they never drift.
const VERSION = "tos-2026-06-17";

// Shared body rhythm: no @tailwindcss/typography plugin is installed, so the inert
// `prose` class adds no spacing. These arbitrary variants give paragraphs, lists,
// and headings consistent spacing so the document reads as a clean, final page.
const bodyStyles =
  "[&>p]:mb-5 [&>p]:leading-relaxed " +
  "[&>ul]:mb-5 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-1 " +
  "[&>h2]:font-display [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:text-navy [&>h2]:mt-10 [&>h2]:mb-4";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main>
        <Section bg="white" narrow>
          <article className="prose max-w-none font-body text-text-primary">
            <h1 className="font-display text-[32px] md:text-[42px] font-semibold text-navy mb-2">
              Terms of Service
            </h1>
            <p className="text-text-light text-sm mb-1">
              Last updated June 17, 2026
            </p>
            <p className="text-text-light text-sm mb-1">
              Effective on acceptance.
            </p>
            <p className="text-text-light text-xs mb-10">
              Version: {VERSION} (effective June 17, 2026)
            </p>

            <div className={bodyStyles}>
              <p>
                These Terms of Service (&quot;Terms&quot;) are a binding
                agreement between <strong>Modern BizOps LLC</strong>, a Virginia
                limited liability company with offices at 2502 Kenmore Rd,
                Henrico, VA 23228 (&quot;Modern BizOps,&quot; &quot;we,&quot;
                &quot;us,&quot; or &quot;our&quot;), and the business that
                accepts these Terms (&quot;Client,&quot; &quot;you,&quot; or
                &quot;your&quot;). By clicking &quot;I agree,&quot; creating an
                account, or using the Modern BizOps platform or coaching
                services (together, the &quot;Services&quot;), you agree to
                these Terms, to the <strong>Data Processing Agreement</strong>{" "}
                linked here (
                <a href="/dpa" className="text-amber hover:underline">
                  https://modernbizops.com/dpa
                </a>
                ), and to the <strong>Privacy Policy</strong> linked here (
                <a href="/privacy" className="text-amber hover:underline">
                  https://modernbizops.com/privacy
                </a>
                ). If you do not agree, do not use the Services.
              </p>
              <p>
                If you are accepting on behalf of a company, you represent that
                you are authorized to bind that company, and &quot;you&quot; and
                &quot;Client&quot; mean that company.
              </p>

              <h2>1. The Services</h2>
              <p>
                Modern BizOps provides revenue operations coaching and a
                software platform (the &quot;Platform,&quot; at
                app.modernbizops.com) that connects to your business systems,
                analyzes your revenue operations, and produces audits,
                recommendations, and related deliverables. The specific scope,
                fees, and term of a coaching engagement are set out in a
                separate order, proposal, or statement of work
                (&quot;Order&quot;). If an Order conflicts with these Terms, the
                Order controls for that engagement.
              </p>
              <p>
                We may update, improve, or change features of the Platform over
                time. We will not materially reduce core functionality you are
                paying for during an active engagement without notice.
              </p>

              <h2>2. Accounts and acceptable use</h2>
              <p>
                You are responsible for activity under your account and for
                keeping your login credentials secure. You agree to provide
                accurate information and to promptly update it.
              </p>
              <p>
                You agree not to: (a) use the Services in violation of law or
                any third party&apos;s rights; (b) upload data you do not have
                the right to share with us; (c) attempt to breach, probe, or
                disrupt the security or integrity of the Platform; (d) reverse
                engineer, copy, or resell the Platform except as the law allows;
                or (e) use the Services to build a competing product.
              </p>

              <h2>3. Your data and the systems you connect</h2>
              <p>
                <strong>Your data stays yours.</strong> As between you and us,
                you own all data you provide or that we retrieve from systems
                you connect, including your business records, customer
                information, and analytics (&quot;Client Data&quot;). You grant
                us a limited license to access, process, store, and analyze
                Client Data solely to provide the Services and produce your
                deliverables.
              </p>
              <p>
                <strong>Connected systems.</strong> When you connect a
                third-party system (such as a CRM, support, marketing, or
                financial tool), you authorize us to access it on your behalf.
                Where the integration supports it, we request{" "}
                <strong>read-only</strong> access. You can disconnect a system
                at any time, and you are responsible for your own agreements
                with those third-party providers.
              </p>
              <p>
                <strong>Processing terms.</strong> Our handling of Client Data,
                including personal information within it, is governed by the
                Data Processing Agreement, which is incorporated into these
                Terms by reference. Where the DPA conflicts with these Terms on
                a data-protection matter, the DPA controls.
              </p>
              <p>
                <strong>Security.</strong> We maintain administrative,
                technical, and physical safeguards designed to protect Client
                Data, described in our Security and Data Handling Overview (
                <a href="/security" className="text-amber hover:underline">
                  https://modernbizops.com/security
                </a>
                ). No system is perfectly secure, but we commit to the practices
                described there and in the DPA.
              </p>

              <h2>4. Confidentiality</h2>
              <p>
                Each party may receive non-public information of the other
                (&quot;Confidential Information&quot;). Confidential Information
                includes your Client Data, our non-public Platform materials and
                methods, and the terms of any Order. Each party agrees to (a)
                use the other&apos;s Confidential Information only to perform
                under these Terms, (b) protect it with at least reasonable care,
                and (c) not disclose it except to its personnel and advisors who
                need it and are bound by confidentiality. These obligations do
                not apply to information that is public through no fault of the
                receiving party, independently developed, or rightfully received
                from a third party, and they do not prevent a disclosure
                required by law if the receiving party gives reasonable notice
                where permitted.
              </p>
              <p>
                <strong>Professional and regulated clients.</strong> If you are
                a regulated professional (for example, an investment adviser,
                broker-dealer, attorney, or accountant), nothing in these Terms
                waives any privilege, confidentiality duty, or regulatory
                obligation you owe your own clients. We will treat data you
                connect that is subject to those duties as Confidential
                Information and process it only as needed to deliver the
                Services. We are not your subcontractor for purposes of your
                professional licensing unless we agree to that in a signed
                writing.
              </p>

              <h2>5. Fees and payment</h2>
              <p>
                Fees are stated in your Order. Unless the Order says otherwise,
                fees are due as invoiced, are non-refundable once the applicable
                work has begun, and exclude taxes. Late amounts may accrue
                interest at the lower of 1.5% per month or the maximum the law
                allows. Payment card processing is handled by our payment
                processor; we do not store full card numbers.
              </p>

              <h2>6. Term, suspension, and termination</h2>
              <p>
                These Terms apply while you use the Services. Either party may
                terminate an engagement as the Order provides, or for the other
                party&apos;s material breach that stays uncured 30 days after
                written notice. We may suspend access if your use threatens the
                security or lawful operation of the Platform, or for
                non-payment, with notice where practical.
              </p>
              <p>
                <strong>On termination,</strong> your right to use the Services
                ends. We will, at your request made within 30 days, return or
                delete Client Data as described in the DPA. Sections that by
                their nature should survive (including 3, 4, 7, 8, 9, and 10)
                survive termination.
              </p>

              <h2>7. Warranties and disclaimers</h2>
              <p>
                We will perform the Services in a professional and workmanlike
                manner. <strong>Except for that, the Services are provided
                &quot;as is.&quot;</strong> We do not warrant that the Platform
                will be uninterrupted or error-free, and we do not guarantee any
                specific business result, revenue outcome, or return on
                investment. Our analyses and recommendations are advisory.{" "}
                <strong>
                  We do not provide legal, tax, accounting, investment, or other
                  licensed professional advice, and nothing in the Services is a
                  substitute for advice from your own licensed professionals.
                </strong>{" "}
                You remain responsible for your business decisions and for your
                own regulatory compliance.
              </p>

              <h2>8. Limitation of liability</h2>
              <p>
                To the maximum extent the law allows: (a) neither party is
                liable for indirect, incidental, special, consequential, or
                punitive damages, or for lost profits or revenue; and (b) each
                party&apos;s total liability arising out of or relating to these
                Terms will not exceed the fees you paid to us in the 12 months
                before the event giving rise to the claim. These limits do not
                apply to your payment obligations, either party&apos;s breach of
                confidentiality, your misuse of the Platform, or a party&apos;s
                gross negligence, willful misconduct, or indemnification
                obligations.
              </p>

              <h2>9. Indemnification</h2>
              <p>
                You will defend and indemnify us against third-party claims
                arising from your Client Data, your use of the Services in
                violation of these Terms or law, or your violation of a third
                party&apos;s rights. We will defend and indemnify you against
                third-party claims that the Platform, as provided by us,
                infringes that third party&apos;s US intellectual property
                rights. The indemnifying party&apos;s obligations are
                conditioned on prompt notice and reasonable cooperation.
              </p>

              <h2>10. Governing law and disputes</h2>
              <p>
                These Terms are governed by the laws of the Commonwealth of
                Virginia, without regard to conflict-of-laws rules. The state
                and federal courts located in Virginia have exclusive
                jurisdiction, and each party consents to venue there. Before
                filing, the parties will attempt in good faith to resolve any
                dispute through direct discussion for 30 days.
              </p>

              <h2>11. Changes to these Terms</h2>
              <p>
                We may update these Terms. If we make material changes, we will
                notify you by email or through the Platform and update the
                &quot;Last updated&quot; date. Changes apply to use of the
                Services after they take effect. If you do not agree to a
                material change, your remedy is to stop using the Services and
                terminate per Section 6. We keep a record of which version you
                accepted and when.
              </p>

              <h2>12. General</h2>
              <p>
                These Terms, the DPA, the Privacy Policy, and any Order are the
                entire agreement between us on this subject and replace prior
                discussions. If a provision is unenforceable, the rest stays in
                effect. Neither party may assign these Terms without the
                other&apos;s consent, except to a successor in a merger or sale
                of substantially all assets. Our failure to enforce a provision
                is not a waiver. Notices to us go to{" "}
                <a
                  href="mailto:access@bradleydewet.com"
                  className="text-amber hover:underline"
                >
                  access@bradleydewet.com
                </a>
                .
              </p>

              <p className="mt-10">
                <strong>
                  By clicking &quot;I agree&quot; or using the Services, you
                  acknowledge that you have read and agree to these Terms, the
                  Data Processing Agreement, and the Privacy Policy.
                </strong>
              </p>
            </div>
          </article>
        </Section>
      </main>
      <Footer />
    </>
  );
}
