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
import { mapResultToHubSpotProperties } from '@/lib/scorecard/hubspotResultProperties';
import { answeredQuestions } from '@/lib/scorecard/scorecardExport';
import { renderResultPdf } from '@/lib/scorecard/pdfDocument';

let propertiesEnsured = false;

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

const REQUIRED_ANSWER_IDS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14'];

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
    const { firstName, email, company, utms, answers, hutk, pageUri, pageName } = body || {};

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

    // Submit through the HubSpot form so the hutk cookie attaches the visitor
    // session and HubSpot sets a real Original Source. This creates/updates the
    // contact; we do NOT create a deal (deals are made manually after Bradley
    // qualifies the lead).
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

    const result = buildResult(answers);

    // Look up the contact the form just created/updated so we can flag it for
    // the manual qualification queue and notify Bradley. If HubSpot has not
    // finished indexing the contact yet, still return the result so the user
    // sees their scorecard; Bradley can flag lifecycle from the queue.
    const contactId = await findContactByEmail(email);

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
      await writeScorecardResultProperties(
        contactId,
        mapResultToHubSpotProperties(result, answers, meta)
      );
      await createContactTask({
        contactId,
        subject: `New lead to qualify: ${firstName || email} (Stage ${result.placement.stage})`,
        body: `New scorecard submission. Stage ${result.placement.stage} (${result.placement.name}). Model: ${result.modelLabel}. Headline gap: ${result.headline.lead}`,
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
            'Modern-BizOps-Scorecard',
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
            body: `Scorecard result PDF for ${firstName || email}${company ? ` (${company})` : ''}. Stage ${result.placement.stage} ${result.placement.name}. Dollar gap ${result.headline.floorDollars} to ${result.headline.medianDollars}. Model ${result.modelLabel}.`,
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
