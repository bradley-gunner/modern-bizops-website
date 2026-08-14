import { NextResponse, after } from 'next/server';
import {
  assertHubSpotConfigured,
  ensureCustomContactProperties,
  submitHubSpotForm,
  markContactForReview,
  findContactByEmail,
  pickUtmProperties,
  createContactTask,
  ensureScorecardResultProperties,
  writeScorecardResultProperties,
  uploadPrivateFileToHubSpot,
  createContactNote,
  BRADLEY_OWNER_ID,
  UTM_CUSTOM_PROPERTIES,
  LEAD_MAGNET_PROPERTY,
} from '@/lib/hubspot';
import { buildResult } from '@/lib/scorecard/resultRender';
import { observeWebsite } from '@/lib/scorecard/observed';
import { mapResultToHubSpotProperties } from '@/lib/scorecard/hubspotResultProperties';
import { answeredQuestions } from '@/lib/scorecard/scorecardExport';
import { renderResultPdf } from '@/lib/scorecard/pdfDocument';

// The observed pass (lib/scorecard/observed.js) budgets ~9s and runs in
// parallel with the HubSpot form submit below; give the function room for
// both plus the enrichment writes so Vercel does not cut the response off.
export const maxDuration = 30;

let propertiesEnsured = false;

// HubSpot's contact search index lags briefly after the form submission creates
// the contact, so a single lookup often returns null for a first-time submitter
// and the whole enrichment block (review flag, scorecard properties, task, PDF)
// gets skipped. Retry past the lag so enrichment reliably lands. Mirrors
// app/api/submit-form/route.js. The result is returned to the user regardless,
// so this only bounds how long we wait for the contact to appear.
async function findContactByEmailWithRetry(email, attempts = 5, delayMs = 400) {
  for (let attempt = 0; attempt < attempts; attempt++) {
    const id = await findContactByEmail(email);
    if (id) return id;
    if (attempt < attempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return null;
}

// Run heavy, non-blocking follow-up work after the response is sent so the
// prospect's on-screen result is not delayed by PDF rendering + file upload.
// On Vercel `after` keeps the function alive (waitUntil); outside a request
// scope (unit tests, direct invocation) it throws, so we run inline instead.
async function runAfterResponse(fn) {
  try {
    after(fn);
  } catch {
    await fn();
  }
}

function safeFileName(parts) {
  const base = parts
    .filter(Boolean)
    .join('-')
    .replace(/[^a-zA-Z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${base || 'scorecard-result'}.pdf`;
}

// q16 (churn) is conditional by business model, so it is not in the required
// set; everything else the quiz always shows is.
const REQUIRED_ANSWER_IDS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15'];

function validateAnswers(answers) {
  if (!answers || typeof answers !== 'object') return false;
  for (const id of REQUIRED_ANSWER_IDS) {
    if (!answers[id] || typeof answers[id].value !== 'string') return false;
  }
  return true;
}

export async function POST(request) {
  try {
    assertHubSpotConfigured();

    const body = await request.json();
    const { firstName, email, company, website, utms, answers, hutk, pageUri, pageName } = body || {};

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!validateAnswers(answers)) {
      return NextResponse.json({ error: 'Answers payload is malformed' }, { status: 400 });
    }

    if (!propertiesEnsured) {
      await ensureCustomContactProperties([
        ...UTM_CUSTOM_PROPERTIES,
        LEAD_MAGNET_PROPERTY,
      ]);
      await ensureScorecardResultProperties();
      propertiesEnsured = true;
    }

    // The observed pass reads the prospect's public surfaces (page source,
    // DNS, sitemap) under its own hard budget. It runs in parallel with the
    // HubSpot form submit so a slow site costs as little wall-clock as
    // possible, and it never rejects: an unreadable site produces the
    // graceful-absence block, not an error. Nothing it reads is stored
    // anywhere except the result payload built below.
    const observedPromise = website ? observeWebsite(website) : Promise.resolve(null);

    // Submit through the HubSpot form so the hutk cookie attaches the visitor
    // session and HubSpot sets a real Original Source. This creates/updates the
    // contact; we do NOT create a deal (deals are made manually after Bradley
    // qualifies the lead).
    // `website` is deliberately NOT in the form fields: the v3 form API
    // rejects fields the form definition does not carry. It lands on the
    // contact through the enrichment PATCH below instead.
    const submission = await submitHubSpotForm({
      properties: {
        email,
        firstname: firstName || '',
        company: company || '',
        lead_magnet: 'scorecard',
        ...pickUtmProperties(utms),
      },
      context: { hutk, pageUri, pageName },
    });

    if (!submission.ok) {
      return NextResponse.json({ error: 'Failed to submit lead' }, { status: 502 });
    }

    const observed = await observedPromise;
    const result = buildResult(answers, { observed });

    // Look up the contact the form just created/updated so we can flag it for
    // the manual qualification queue and notify Bradley. Retry past HubSpot's
    // search-index lag so a first-time submitter's contact is still enriched. If
    // it never appears, still return the result so the user sees their scorecard;
    // Bradley can flag lifecycle from the queue.
    const contactId = await findContactByEmailWithRetry(email);

    if (contactId) {
      // markContactForReview is the single writer of lifecyclestage=lead +
      // hs_lead_status=NEW; the attribution form submit above never sets lead
      // status, so this does not double-handle the queue signal.
      await markContactForReview(contactId);

      const meta = { firstName, company, generatedAt: result.generatedAt };

      // Additively persist the already-computed result onto the contact. This
      // is a PATCH, so it does not re-stamp Original Source and leaves the
      // form-sourced raw inputs / UTM attribution untouched. Includes the
      // dollar-gap range and the full scorecard_result_json. Non-fatal.
      await writeScorecardResultProperties(contactId, {
        ...mapResultToHubSpotProperties(result, answers, meta),
        // The standard HubSpot `website` property, written via PATCH because
        // the attribution form's field set does not include it.
        ...(website ? { website } : {}),
      });
      // The burned-attempt flag leads the subject on purpose: it marks the
      // priority segment on the record before any call happens.
      await createContactTask({
        contactId,
        subject: `New lead to qualify: ${firstName || email} (${result.burnedAttempt ? 'BURNED ATTEMPT, ' : ''}${result.band.name})`,
        body: `New AI Revenue Scan submission. Readiness band: ${result.band.name} (composite ${result.band.composite} of 5). Model: ${result.modelLabel}. Burned attempt: ${result.burnedAttempt ? 'yes' : 'no'}. Website given: ${website ? 'yes' : 'no'}. Connect comfort (q13): ${answers.q13?.score ?? 'n/a'} of 5.`,
        ownerId: BRADLEY_OWNER_ID,
        priority: 'HIGH',
        dueInHours: 24,
      });

      // Render the branded PDF, upload it PRIVATE to HubSpot Files, store the
      // file id on the contact, and drop a Note with the PDF attached on the
      // timeline. Backgrounded so it never delays the prospect's result, and
      // fully guarded so a failure here never affects the on-screen result.
      await runAfterResponse(async () => {
        try {
          const fileName = safeFileName([
            'Modern-BizOps-AI-Revenue-Scan',
            company || firstName || email.split('@')[0],
            result.generatedAt.slice(0, 10),
          ]);
          const pdfBuffer = await renderResultPdf(result, {
            meta,
            questions: answeredQuestions(answers),
          });
          const file = await uploadPrivateFileToHubSpot({
            buffer: pdfBuffer,
            fileName,
            folderPath: '/scorecard-results',
          });
          await writeScorecardResultProperties(contactId, {
            scorecard_pdf_url: file.id,
          });
          await createContactNote({
            contactId,
            body: `AI Revenue Scan result PDF for ${firstName || email}${company ? ` (${company})` : ''}. Band ${result.band.name} (composite ${result.band.composite}). Dollar gap ${result.opportunity.floorDollars} to ${result.opportunity.medianDollars}. Model ${result.modelLabel}.${result.burnedAttempt ? ' Burned attempt.' : ''}`,
            attachmentIds: file.id,
          });
        } catch (bgErr) {
          console.error('[submit-scorecard] PDF/file/note step failed:', bgErr);
        }
      });
    }

    return NextResponse.json({ success: true, contactId, result });
  } catch (err) {
    console.error('[submit-scorecard] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
