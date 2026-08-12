/**
 * Modern BizOps - Nurture Sender (Apps Script)
 * Sequencer + sender for the TEMPLATED nurture emails (Emails 2-6) of both the
 * scorecard and playbook spines. Sends as Bradley via GmailApp, BCC the free
 * HubSpot logging address, advances state in HubSpot, and stops anyone who has
 * replied / booked / unsubscribed.
 *
 * HARD GUARDRAIL: this script NEVER sends Email 1 of either spine. Both E1s are
 * personalized Gmail drafts-for-approval owned by Bradley + the Cowork skills.
 * The TEMPLATES table has no step-1 entry, so E1 cannot be sent here.
 *
 * Design: docs/superpowers/specs/2026-07-27-apps-script-nurture-sender-design.md
 * Approved copy: Marketing Systems/Email Loop - Sequence Plan and Drafts.md (Rev 4).
 *
 * SETUP (see README.md):
 *   1. Script Properties: HUBSPOT_TOKEN, HUBSPOT_BCC, SEND_MODE (start "dry_run").
 *   2. Run bootstrapProperties() once (creates the nurture_* HubSpot fields).
 *   3. Run run() manually in dry_run and verify the log.
 *   4. Run installTrigger() once to schedule the daily run.
 *   5. Flip SEND_MODE to "live" only after verification passes.
 */

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------

/** Day offset from nurture_started_at at which each templated email is due. */
var CADENCE = { 2: 3, 3: 7, 4: 12, 5: 18, 6: 25 };

var HUBSPOT_API = 'https://api.hubapi.com';
var HS_PORTAL_ID = '244508932'; // na2 (informational; api.hubapi.com routes by token)

/** Gmail default signature (Sequence Plan section 6). GmailApp does NOT auto-append
 *  it, so it is built into every send. Emails go out as minimal HTML (htmlBody) with
 *  a plain-text fallback: HTML gives real LinkedIn/YouTube links and correct rendering
 *  of the "·"/"→" glyphs, which mangle in a plain-text part on some clients. */
var LINKEDIN_URL = 'https://linkedin.com/in/bradleydewet';
var YOUTUBE_URL = 'https://youtube.com/@BradleydeWetModernBizOps';
var SITE_URL = 'https://modernbizops.com';
var SCORECARD_URL = 'https://modernbizops.com/scorecard';

// Plain-text fallback signature. ASCII only, so no client mis-decodes it.
// 2026-08-12: retired "RevOps Coach" (a title Bradley does not use any more) and
// the pre-pivot "one machine, more money less chaos" line, and renamed the free
// diagnostic to the AI Revenue Scan. SCORECARD_URL is unchanged on purpose. The
// product got a new name. The /scorecard route stayed the same.
var SIGNATURE_TEXT = [
  '--',
  'Bradley de Wet',
  'Founder | Modern BizOps',
  'AI automation for B2B go-to-market. More leads, more booked calls, less busywork.',
  'Get my free AI Revenue Scan: ' + SCORECARD_URL,
  SITE_URL + ' | ' + LINKEDIN_URL + ' | ' + YOUTUBE_URL
].join('\n');

// HTML signature FALLBACK. Used only if the live Gmail-signature fetch fails.
var SIGNATURE_HTML_FALLBACK = [
  '--',
  'Bradley de Wet',
  'Founder &middot; Modern BizOps',
  'AI automation for B2B go-to-market. More leads, more booked calls, less busywork.',
  '<a href="' + SCORECARD_URL + '">Get my free AI Revenue Scan &rarr;</a>',
  '<a href="' + SITE_URL + '">modernbizops.com</a> | ' +
    '<a href="' + LINKEDIN_URL + '">LinkedIn</a> | ' +
    '<a href="' + YOUTUBE_URL + '">YouTube</a>'
].join('<br>');

/**
 * The real HTML signature from Bradley's Gmail settings (the primary send-as
 * address), fetched live so it always matches what's set in Gmail. Cached for
 * the run. Falls back to SIGNATURE_HTML_FALLBACK if the fetch fails.
 *
 * Uses the Gmail ADVANCED SERVICE (the `Gmail` symbol), which must be enabled in
 * the editor: Services (+) -> Gmail API -> Add. The advanced service enables the
 * Gmail API on the script's system Cloud project automatically, so this works
 * without touching the Cloud console (a raw REST call does not).
 */
var SIGNATURE_HTML_CACHE = null;

function getSignatureHtml_() {
  if (SIGNATURE_HTML_CACHE !== null) return SIGNATURE_HTML_CACHE;
  var html = '';
  try {
    var resp = Gmail.Users.Settings.SendAs.list('me');
    var list = (resp && resp.sendAs) || [];
    var chosen = null;
    for (var i = 0; i < list.length; i++) { if (list[i].isPrimary) { chosen = list[i]; break; } }
    if (!chosen && list.length) chosen = list[0];
    if (chosen && chosen.signature) html = chosen.signature;
    if (!html) log_('Gmail signature is empty; using fallback.');
  } catch (e) {
    log_('Gmail signature fetch error; using fallback: ' + e);
  }
  SIGNATURE_HTML_CACHE = html || SIGNATURE_HTML_FALLBACK;
  return SIGNATURE_HTML_CACHE;
}

/** Minimal HTML-to-text for the plain-text fallback part (links kept as "text (url)"). */
function htmlToText_(html) {
  return String(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|tr|li|h[1-6])>/gi, '\n')
    .replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '$2 ($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ').replace(/&middot;/gi, '|').replace(/&rarr;/gi, '')
    .replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&#39;|&rsquo;/gi, "'").replace(/&quot;/gi, '"')
    .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

/** Build the /book link for E5/E6, carrying the nurture-email UTM (Sequence Plan section 7).
 *  Apex host (canonical) to avoid the www 308 redirect hop. */
function bookLink(track, step) {
  return 'https://modernbizops.com/book' +
    '?utm_source=email&utm_medium=nurture' +
    '&utm_campaign=lm_welcome_' + track +
    '&utm_content=welcome_' + track + '_0' + step + '_v1';
}

// --- Approved templated copy (Rev 4, E2-6 both spines). No em dashes. ---------
// Backtick literals so straight apostrophes render verbatim in the sent email.

var SPINE_A = {
  2: {
    subject: `the fix you've probably already tried`,
    body: [
`Hey {{firstName}},`,
`Been thinking about your scorecard result since it came through. The biggest gap on it was {{topGap}}, and if you're like most founders I talk to, you've already thrown something at that. Another hire, a new tool, a push to just follow up faster. And it helped for a month, then drifted back to where it was.`,
`Am I close? Because if that's how it went, the problem was never effort. It's that the thing underneath, how the work actually gets done and handed off, still lives in people's heads instead of in a system anyone can run.`,
`That's the part we'd fix together. Not more activity, just a clear, repeatable way that {{topGap}} gets handled, so it stops depending on you noticing and chasing. When that clicks, the first thing most founders feel isn't the revenue. It's that they've stopped being the bottleneck the whole thing waits on.`,
`Does that match what you've already tried? Reply and tell me, I read every one.`,
`Talk soon,\nBradley`
    ].join('\n\n')
  },
  3: {
    subject: `it's probably deeper than that`,
    body: [
`Hey {{firstName}},`,
`Quick follow-up to the last one. I said we'd fix the system under {{topGap}}, but I want to be honest about what I usually find once I'm actually in there.`,
`The gap the scorecard flagged is real, but it's almost never the root. It's a symptom. The real thing is usually that too much of the business still runs through you. The deals you personally have to touch, the accounts that only stay because you check in, the stuff that quietly wobbles the week you take time off. My guess is you could name the two or three things right now that only work because you're the one doing them.`,
`Am I wrong? If I'm not, that's the actual work. We find those two or three places and build the system that runs them without you, one at a time. I did a version of this years ago at a software company where the numbers were soft. Instead of hiring, we fixed how leads got scored and followed up, and doubled conversion with the same team. Same idea, different building.`,
`So what's the one thing in your business that only works because you're the one doing it? Hit reply, I'd genuinely like to know.`,
`Talk soon,\nBradley`
    ].join('\n\n')
  }
};

var SPINE_B = {
  2: {
    subject: `the fix you've probably already tried`,
    body: [
`Hey {{firstName}},`,
`Been thinking about you since you grabbed the playbook. If you're like most founders who pick it up, you're somewhere in Stage 1 or 2, which just means the business still runs mostly through you and a couple of key people. And my guess is you've already tried to fix that by hiring, another person to take things off your plate, hoping it'd free you up.`,
`Am I close? Because if it went the way it usually does, the new hire helped for a bit, but the important stuff still routes back to you, because it was never written down anywhere they could actually run it themselves.`,
`That's the part we'd fix together. Not another hire, just taking the two or three things that only work because you do them and building the systems that run them without you. When that lands, the thing founders tell me they notice first is the quiet. The business stops pinging them for every small decision.`,
`Does that match where you are? Reply and tell me, I read every one.`,
`Talk soon,\nBradley`
    ].join('\n\n')
  },
  3: {
    subject: `where's your version of chasing invoices?`,
    body: [
`Hey {{firstName}},`,
`Wanted to tell you about the job that taught me this, because it wasn't from a book.`,
`I was COO of a marketing agency once. Good business, real clients. But every single month I was personally chasing people to pay their invoices. Following up, resending, waiting around. The fix was boring: we moved the retainer clients to auto-charge on a card, and the chasing just stopped. What got me wasn't the cash flow, it was how much weight came off my head. This thing I quietly dreaded every month just went away, because a system finally did what I'd been doing by hand.`,
`My guess is you've got a version of that. Some task you do every week, maybe every day, that a system should really be handling instead, and you just haven't had the time to build it. If that's true, that's exactly the work we'd do together, one of those off your plate at a time, until the business runs on something other than your attention.`,
`So what's your version of chasing invoices? Reply and tell me, I'd genuinely like to know.`,
`Talk soon,\nBradley`
    ].join('\n\n')
  }
};

/** Shared, spine-neutral E4/E5/E6. */
var SHARED = {
  4: {
    subject: `you've probably done this before`,
    body: [
`Hey {{firstName}},`,
`If you've been at this a while, my guess is you've already paid someone once to fix exactly this. A consultant, an agency, a CRM person. And what you got was a deck or a report that looked great and then sat in a drive nobody opened again.`,
`Tell me if I'm off, but that's the pattern for most founders I meet, and it's why a little skepticism about me is fair. So let me be clear about what this isn't. I don't hand you a strategy doc and disappear, and I don't build things you need me around to keep running. Your team does the building. I bring the roadmap and sit with you while you put it in, so your people can run it and train the next hire on it after I'm gone.`,
`The whole point is that you stop needing me. That's the difference between paying for advice and ending up with something that actually keeps working on its own. If that's the kind of help that'd be worth it to you, reply and tell me, and I'll show you what the first 90 days would look like.`,
`Best,\nBradley`
    ].join('\n\n')
  },
  5: {
    subject: `worth 45 minutes?`,
    body: [
`Hey {{firstName}},`,
`It's been a week and a half or so since you first took a hard look at where the business is leaking. My guess is the takeaway is still in the back of your mind but hasn't made it onto the list yet, because there's always something more urgent than the thing that's only costing you slowly.`,
`If that's about right, the next step is just to talk. I do a free 45-minute call, and it's not a pitch. We get into what's actually going on, and I give you my honest read on whether there's real value in us working together. If there isn't, I'll tell you on the call and save us both the time.`,
`Either way you'd walk away with a clearer picture of which gap to close first and what it'd take. That alone is usually worth the 45 minutes.`,
`If you want to grab a time: {{book_link}}`,
`Not there yet? No pressure. Stay on the list and reply whenever with what you're working through.`,
`Talk soon,\nBradley`
    ].join('\n\n')
  },
  6: {
    subject: `last one from me for now`,
    body: [
`Hey {{firstName}},`,
`Last one from me for a while, so I'll keep it short.`,
`Here's what I think is true for you, and tell me if I'm off. What's really capping your growth isn't how hard you're working. It's that too much of the business still runs on you instead of on systems you can trust. And closing that isn't some big transformation, it's picking the one place you're most in the middle of and building the thing that takes you out of it. You can absolutely start that on your own.`,
`If you'd rather have someone who's built these do it alongside you, so it happens in weeks instead of someday, I'm around. Reply here anytime, or grab a time whenever it makes sense: {{book_link}}`,
`Either way, I'll still send something worth reading now and then. Thanks for letting me into your inbox.`,
`Best,\nBradley`
    ].join('\n\n')
  }
};

/** track -> step (2..6) -> {subject, body}. Note: NO step 1. */
var TEMPLATES = {
  scorecard: { 2: SPINE_A[2], 3: SPINE_A[3], 4: SHARED[4], 5: SHARED[5], 6: SHARED[6] },
  playbook:  { 2: SPINE_B[2], 3: SPINE_B[3], 4: SHARED[4], 5: SHARED[5], 6: SHARED[6] }
};

var LAST_STEP = 6;
var UNSUBSCRIBE_PATTERNS = [/\bunsubscribe\b/i, /\bremove me\b/i, /\bstop\b/i];

/** HubSpot contact properties the run needs. */
var FETCH_PROPS = [
  'email', 'firstname', 'createdate', 'lead_magnet', 'engagement_status',
  'nurture_track', 'nurture_step', 'nurture_status',
  'nurture_last_sent_at', 'nurture_started_at',
  'scorecard_top_gap', 'scorecard_email1_status', 'playbook_email1_status'
];

var DAY_MS = 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// ENTRY POINT (daily trigger)
// ---------------------------------------------------------------------------

function run() {
  var mode = props_().getProperty('SEND_MODE') || 'dry_run';
  var live = (mode === 'live');
  log_('=== Nurture run start (SEND_MODE=' + mode + ') ===');

  var contacts = fetchActiveContacts_();
  log_('Fetched ' + contacts.length + ' candidate contact(s).');

  var sent = 0, skipped = 0, stopped = 0;
  for (var i = 0; i < contacts.length; i++) {
    try {
      var outcome = processContact_(contacts[i], live);
      if (outcome === 'sent') sent++;
      else if (outcome === 'stopped') stopped++;
      else skipped++;
    } catch (e) {
      log_('ERROR on contact ' + (contacts[i] && contacts[i].id) + ': ' + e);
      skipped++;
    }
  }

  log_('=== Done. sent=' + sent + ' stopped=' + stopped + ' skipped=' + skipped +
    (live ? '' : ' (DRY RUN, nothing sent, no state advanced)') + ' ===');
}

/**
 * @return {string} 'sent' | 'stopped' | 'skipped'
 */
function processContact_(contact, live) {
  var p = contact.properties || {};
  var email = (p.email || '').trim();
  var label = email || ('id ' + contact.id);

  if (!email) { log_('SKIP ' + label + ': no email.'); return 'skipped'; }

  // Exit check 1: Test contacts never receive a send.
  if ((p.engagement_status || '') === 'Test') {
    log_('SKIP ' + label + ': engagement_status=Test.');
    return 'skipped';
  }

  var track = (p.nurture_track || deriveTrack_(p.lead_magnet) || '').trim();
  if (!track || !TEMPLATES[track]) {
    log_('SKIP ' + label + ': no resolvable nurture_track (lead_magnet=' + p.lead_magnet + ').');
    return 'skipped';
  }
  // Persist a derived track so future runs and reporting see it.
  if (!p.nurture_track && live) patchContact_(contact.id, { nurture_track: track });

  var status = (p.nurture_status || 'active').trim();

  // Exit check 2: an already-terminal status stops the track.
  if (status === 'unsubscribed' || status === 'booked' ||
      status === 'replied' || status === 'completed') {
    log_('STOP ' + label + ': nurture_status=' + status + '.');
    return 'stopped';
  }

  var step = parseInt(p.nurture_step || '0', 10) || 0;
  if (step >= LAST_STEP) {
    if (live) patchContact_(contact.id, { nurture_status: 'completed' });
    log_('STOP ' + label + ': step ' + step + ' >= last, marking completed.');
    return 'stopped';
  }

  var targetStep = step + 1;

  // E1 gate: never send E2 until this lead's personalized Email 1 has been sent.
  // The Email 1 skills stage a Gmail draft that Bradley sends by hand, so the
  // reliable "E1 was sent" signal is a real message from Bradley to this lead in
  // his Sent mail. An explicit {track}_email1_status = 'sent' is honored as a
  // fast path; otherwise we auto-detect that first sent email (dated on/after the
  // lead's funnel entry = its createdate) and anchor the cadence to its date.
  var startedAt = toMillis_(p.nurture_started_at);
  if (targetStep === 2) {
    var e1Field = track + '_email1_status';
    var e1Status = (p[e1Field] || '').trim();
    var funnelEntry = toMillis_(p.createdate);

    if (e1Status === 'sent') {
      if (!startedAt) {
        startedAt = detectEmail1Sent_(email, funnelEntry) || Date.now();
        if (live) patchContact_(contact.id, { nurture_started_at: startedAt, nurture_status: 'active' });
        log_('ANCHOR ' + label + ': set nurture_started_at (E1 marked sent).');
      }
    } else {
      // Not marked sent; look for the personalized Email 1 in Bradley's Sent mail.
      startedAt = detectEmail1Sent_(email, funnelEntry);
      if (!startedAt) {
        log_('SKIP ' + label + ': E1 gate not cleared (no personalized Email 1 sent yet).');
        return 'skipped';
      }
      var gatePatch = { nurture_started_at: startedAt, nurture_status: 'active' };
      gatePatch[e1Field] = 'sent';
      if (live) patchContact_(contact.id, gatePatch);
      log_('E1 DETECTED ' + label + ': personalized Email 1 found in Sent mail; gate cleared, anchored to its date.');
    }
  }

  if (!startedAt) {
    log_('SKIP ' + label + ': no nurture_started_at anchor yet.');
    return 'skipped';
  }

  // Exit check 3 + 4: reply / unsubscribe detection via Gmail.
  var reference = toMillis_(p.nurture_last_sent_at) || startedAt;
  var replyOutcome = detectReply_(email, reference);
  if (replyOutcome === 'unsubscribed') {
    if (live) patchContact_(contact.id, { nurture_status: 'unsubscribed' });
    log_('STOP ' + label + ': inbound reply asked to unsubscribe.');
    return 'stopped';
  }
  if (replyOutcome === 'replied') {
    if (live) patchContact_(contact.id, { nurture_status: 'replied' });
    log_('STOP ' + label + ': inbound reply detected, Bradley owns the thread.');
    return 'stopped';
  }

  // Is the next email due?
  var dueDay = CADENCE[targetStep];
  var daysSinceAnchor = (Date.now() - startedAt) / DAY_MS;
  if (daysSinceAnchor < dueDay) {
    log_('WAIT ' + label + ': next is E' + targetStep + ' on day ' + dueDay +
      ', currently day ' + daysSinceAnchor.toFixed(1) + '.');
    return 'skipped';
  }

  // Idempotency guard: never re-send a step we've already advanced past.
  if (step >= targetStep) {
    log_('SKIP ' + label + ': step already at/past E' + targetStep + '.');
    return 'skipped';
  }

  var msg = renderTemplate_(track, targetStep, p);
  if (!msg) {
    log_('SKIP ' + label + ': no template for ' + track + ' E' + targetStep + '.');
    return 'skipped';
  }

  if (!live) {
    log_('DRY-RUN would send ' + track + ' E' + targetStep + ' to ' + label +
      ' | subject: ' + msg.subject);
    return 'sent';
  }

  GmailApp.sendEmail(email, msg.subject, msg.text, {
    htmlBody: msg.html,
    bcc: props_().getProperty('HUBSPOT_BCC'),
    name: 'Bradley de Wet'
  });

  var patch = {
    nurture_step: targetStep,
    nurture_last_sent_at: Date.now()
  };
  if (targetStep === LAST_STEP) patch.nurture_status = 'completed';
  patchContact_(contact.id, patch);

  log_('SENT ' + track + ' E' + targetStep + ' to ' + label +
    (targetStep === LAST_STEP ? ' (track completed)' : ''));
  return 'sent';
}

// ---------------------------------------------------------------------------
// TEMPLATE RENDERING
// ---------------------------------------------------------------------------

function renderTemplate_(track, step, p) {
  var t = TEMPLATES[track] && TEMPLATES[track][step];
  if (!t) return null;

  var firstName = (p.firstname || '').trim() || 'there';
  var topGap = (p.scorecard_top_gap || '').trim() || 'the gap it flagged';
  var link = bookLink(track, step);
  var sigHtml = getSignatureHtml_();
  var sigText = htmlToText_(sigHtml) || SIGNATURE_TEXT;

  var subject = t.subject.replace(/\{\{firstName\}\}/g, firstName);

  // Plain-text part (fallback): raw tokens + plain rendering of the signature.
  var text = t.body
    .replace(/\{\{firstName\}\}/g, firstName)
    .replace(/\{\{topGap\}\}/g, topGap)
    .replace(/\{\{book_link\}\}/g, link) + '\n\n' + sigText;

  // HTML part (primary): escaped merge values, linked book URL, <br> line breaks,
  // then the live Gmail signature appended exactly as set in Gmail.
  var htmlBody = t.body
    .replace(/\{\{firstName\}\}/g, escapeHtml_(firstName))
    .replace(/\{\{topGap\}\}/g, escapeHtml_(topGap))
    .replace(/\{\{book_link\}\}/g, '<a href="' + link + '">' + link + '</a>')
    .replace(/\n/g, '<br>');
  var html = '<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;' +
    'line-height:1.5;color:#222222">' + htmlBody + '</div><br><br>' + sigHtml;

  return { subject: subject, text: text, html: html };
}

function escapeHtml_(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function deriveTrack_(leadMagnet) {
  var lm = (leadMagnet || '').trim().toLowerCase();
  if (lm === 'scorecard') return 'scorecard';
  if (lm === 'playbook') return 'playbook';
  return '';
}

// ---------------------------------------------------------------------------
// GMAIL REPLY / UNSUBSCRIBE DETECTION
// ---------------------------------------------------------------------------

/**
 * @return {string} 'unsubscribed' | 'replied' | 'none'
 */
function detectReply_(email, sinceMillis) {
  var days = Math.ceil((Date.now() - sinceMillis) / DAY_MS);
  if (days < 1) days = 1;
  if (days > 400) days = 400; // keep the Gmail query bounded

  var threads = GmailApp.search('from:' + email + ' newer_than:' + days + 'd', 0, 20);
  var found = 'none';
  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    var last = messages[messages.length - 1];
    if (last.getDate().getTime() <= sinceMillis) continue;
    if (!isFrom_(last, email)) continue; // newest message must be inbound

    found = 'replied';
    var text = (last.getPlainBody() || '');
    for (var k = 0; k < UNSUBSCRIBE_PATTERNS.length; k++) {
      if (UNSUBSCRIBE_PATTERNS[k].test(text)) return 'unsubscribed';
    }
  }
  return found;
}

function isFrom_(message, email) {
  var from = (message.getFrom() || '').toLowerCase();
  return from.indexOf(email.toLowerCase()) !== -1;
}

/**
 * Detect the lead's personalized Email 1: the earliest message Bradley sent TO
 * this address on/after the funnel-entry time (createdate). Returns its epoch-
 * millis date, or 0 if none. At the E1 gate the sender has not sent anything to
 * the lead yet, so the first Bradley -> lead email is Email 1, not one of E2-6.
 * The createdate floor keeps a pre-existing unrelated thread from clearing the gate.
 */
function detectEmail1Sent_(email, sinceMillis) {
  var me = getMyEmail_();
  var threads = GmailApp.search('to:' + email + ' from:me', 0, 20);
  var earliest = 0;
  for (var i = 0; i < threads.length; i++) {
    var msgs = threads[i].getMessages();
    for (var j = 0; j < msgs.length; j++) {
      var m = msgs[j];
      var when = m.getDate().getTime();
      if (sinceMillis && when < sinceMillis) continue;
      if (me && (m.getFrom() || '').toLowerCase().indexOf(me) === -1) continue;
      var to = ((m.getTo() || '') + ',' + (m.getCc() || '')).toLowerCase();
      if (to.indexOf(email.toLowerCase()) === -1) continue;
      if (earliest === 0 || when < earliest) earliest = when;
    }
  }
  return earliest;
}

function getMyEmail_() {
  try { return (Session.getActiveUser().getEmail() || '').toLowerCase(); } catch (e) { return ''; }
}

// ---------------------------------------------------------------------------
// HUBSPOT API
// ---------------------------------------------------------------------------

function fetchActiveContacts_() {
  var results = [];
  var after = null;
  do {
    var payload = {
      filterGroups: [
        { filters: [{ propertyName: 'nurture_status', operator: 'EQ', value: 'active' }] },
        { filters: [
            { propertyName: 'nurture_status', operator: 'NOT_HAS_PROPERTY' },
            { propertyName: 'lead_magnet', operator: 'IN', values: ['scorecard', 'playbook'] }
        ] }
      ],
      properties: FETCH_PROPS,
      limit: 100
    };
    if (after) payload.after = after;

    var res = hsFetch_('POST', '/crm/v3/objects/contacts/search', payload);
    var body = JSON.parse(res.getContentText());
    (body.results || []).forEach(function (c) { results.push(c); });
    after = body.paging && body.paging.next ? body.paging.next.after : null;
  } while (after);
  return results;
}

function patchContact_(id, propsObj) {
  hsFetch_('PATCH', '/crm/v3/objects/contacts/' + id, { properties: propsObj });
}

function hsFetch_(method, path, payload) {
  var token = props_().getProperty('HUBSPOT_TOKEN');
  if (!token) throw new Error('Missing Script Property HUBSPOT_TOKEN');
  var options = {
    method: method,
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    muteHttpExceptions: true
  };
  if (payload) options.payload = JSON.stringify(payload);

  var res = UrlFetchApp.fetch(HUBSPOT_API + path, options);
  var code = res.getResponseCode();
  if (code < 200 || code >= 300) {
    throw new Error('HubSpot ' + method + ' ' + path + ' -> ' + code + ': ' + res.getContentText());
  }
  return res;
}

/** HubSpot datetime values come back as epoch-millis strings; normalize to Number. */
function toMillis_(value) {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  var n = Number(value);
  if (!isNaN(n)) return n;
  var d = new Date(value);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

// ---------------------------------------------------------------------------
// ONE-TIME SETUP
// ---------------------------------------------------------------------------

/** Create the nurture_* contact properties if they do not already exist. Idempotent. */
function bootstrapProperties() {
  var defs = [
    { name: 'nurture_track', label: 'Nurture Track', type: 'enumeration', fieldType: 'select',
      options: [{ label: 'Scorecard', value: 'scorecard' }, { label: 'Playbook', value: 'playbook' }] },
    { name: 'nurture_step', label: 'Nurture Step', type: 'number', fieldType: 'number' },
    { name: 'nurture_last_sent_at', label: 'Nurture Last Sent At', type: 'datetime', fieldType: 'date' },
    { name: 'nurture_status', label: 'Nurture Status', type: 'enumeration', fieldType: 'select',
      options: ['active', 'replied', 'booked', 'unsubscribed', 'completed'].map(function (v) {
        return { label: v.charAt(0).toUpperCase() + v.slice(1), value: v };
      }) },
    { name: 'nurture_started_at', label: 'Nurture Started At', type: 'datetime', fieldType: 'date' },
    // E1 gate fields (string, so any writer can set 'sent'; the sender only reads === 'sent').
    { name: 'scorecard_email1_status', label: 'Scorecard Email 1 Status', type: 'string', fieldType: 'text' },
    { name: 'playbook_email1_status', label: 'Playbook Email 1 Status', type: 'string', fieldType: 'text' }
  ];

  defs.forEach(function (def) {
    if (propertyExists_(def.name)) {
      log_('Property exists, skipping: ' + def.name);
      return;
    }
    var payload = {
      name: def.name,
      label: def.label,
      type: def.type,
      fieldType: def.fieldType,
      groupName: 'contactinformation'
    };
    if (def.options) payload.options = def.options;
    hsFetch_('POST', '/crm/v3/properties/contacts', payload);
    log_('Created property: ' + def.name);
  });
  log_('bootstrapProperties() done.');
}

function propertyExists_(name) {
  var token = props_().getProperty('HUBSPOT_TOKEN');
  var res = UrlFetchApp.fetch(HUBSPOT_API + '/crm/v3/properties/contacts/' + name, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token },
    muteHttpExceptions: true
  });
  var code = res.getResponseCode();
  if (code === 200) return true;
  if (code === 404) return false;
  throw new Error('Property check ' + name + ' -> ' + code + ': ' + res.getContentText());
}

/** Install the daily time-based trigger on run() if one is not already present. */
function installTrigger() {
  var existing = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existing.length; i++) {
    if (existing[i].getHandlerFunction() === 'run') {
      log_('Daily run() trigger already installed.');
      return;
    }
  }
  ScriptApp.newTrigger('run').timeBased().everyDays(1).atHour(8).create();
  log_('Installed daily run() trigger (~08:00 project time).');
}

/** Diagnostic: print the live Gmail signature the sender will use. Run manually to verify. */
function logSignature() {
  SIGNATURE_HTML_CACHE = null; // force a fresh fetch
  var html = getSignatureHtml_();
  var usedFallback = (html === SIGNATURE_HTML_FALLBACK);
  log_('Using ' + (usedFallback ? 'FALLBACK signature (Gmail fetch failed/empty)' : 'live Gmail signature') + ':');
  log_('--- HTML ---\n' + html);
  log_('--- Plain-text rendering ---\n' + htmlToText_(html));
}

// ---------------------------------------------------------------------------
// UTIL
// ---------------------------------------------------------------------------

function props_() { return PropertiesService.getScriptProperties(); }
function log_(msg) { console.log(msg); }
