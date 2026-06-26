import { NextResponse } from 'next/server';
import {
  assertHubSpotConfigured,
  ensureCustomContactProperties,
  submitHubSpotForm,
  markContactForReview,
  findContactByEmail,
  pickUtmProperties,
  createContactTask,
  BRADLEY_OWNER_ID,
  UTM_CUSTOM_PROPERTIES,
  LEAD_MAGNET_PROPERTY,
} from '@/lib/hubspot';
import { buildResult } from '@/lib/scorecard/resultRender';

let propertiesEnsured = false;

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
      await markContactForReview(contactId);
      await createContactTask({
        contactId,
        subject: `New lead to qualify: ${firstName || email} (Stage ${result.placement.stage})`,
        body: `New scorecard submission. Stage ${result.placement.stage} (${result.placement.name}). Model: ${result.modelLabel}. Headline gap: ${result.headline.lead}`,
        ownerId: BRADLEY_OWNER_ID,
        priority: 'HIGH',
        dueInHours: 24,
      });
    }

    return NextResponse.json({ success: true, contactId, result });
  } catch (err) {
    console.error('[submit-scorecard] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
