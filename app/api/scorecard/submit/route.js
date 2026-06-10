import { NextResponse } from 'next/server';
import {
  assertHubSpotConfigured,
  ensureCustomContactProperties,
  upsertContactByEmail,
  pickUtmProperties,
  findExistingRevopsDealForContact,
  createContactTask,
  hsHeaders,
  HUBSPOT_BASE,
  REVOPS_PIPELINE_ID,
  NEW_LEAD_STAGE,
  BRADLEY_OWNER_ID,
  UTM_CUSTOM_PROPERTIES,
} from '@/lib/hubspot';
import { buildResult } from '@/lib/scorecard/resultRender';

let utmPropertiesEnsured = false;

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
    const { firstName, email, company, utms, answers } = body || {};

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!validateAnswers(answers)) {
      return NextResponse.json({ error: 'Answers payload is malformed' }, { status: 400 });
    }

    if (!utmPropertiesEnsured) {
      await ensureCustomContactProperties(UTM_CUSTOM_PROPERTIES);
      utmPropertiesEnsured = true;
    }

    const contactProps = {
      firstname: firstName || '',
      company: company || '',
      ...pickUtmProperties(utms),
    };
    const { id: contactId } = await upsertContactByEmail(email, contactProps);

    const result = buildResult(answers);

    const existingDealId = await findExistingRevopsDealForContact(contactId);
    let dealId = existingDealId;

    if (!existingDealId) {
      const contactName = firstName || email;
      const dealRes = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/deals`, {
        method: 'POST',
        headers: hsHeaders(),
        body: JSON.stringify({
          properties: {
            dealname: `Maturity Scorecard - ${contactName}`,
            pipeline: REVOPS_PIPELINE_ID,
            dealstage: NEW_LEAD_STAGE,
            dealtype: 'newbusiness',
            engagement_type: 'DWY Coaching',
            project_type: 'RevOps Coaching',
            hubspot_owner_id: BRADLEY_OWNER_ID,
          },
          associations: [
            {
              to: { id: contactId },
              types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }],
            },
          ],
        }),
      });

      if (!dealRes.ok) {
        const err = await dealRes.text();
        console.error('[submit-scorecard] HubSpot deal creation failed:', err);
        return NextResponse.json({ error: 'Failed to create deal' }, { status: 502 });
      }

      const deal = await dealRes.json();
      dealId = deal.id;

      await createContactTask({
        contactId,
        subject: `Scorecard lead: ${firstName || email} (Stage ${result.placement.stage})`,
        body: `New scorecard submission. Stage ${result.placement.stage} (${result.placement.name}). Model: ${result.modelLabel}. Headline gap: ${result.headline.lead}`,
        ownerId: BRADLEY_OWNER_ID,
        priority: 'HIGH',
        dueInHours: 24,
      });
    }

    return NextResponse.json({ success: true, contactId, dealId, result });
  } catch (err) {
    console.error('[submit-scorecard] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
