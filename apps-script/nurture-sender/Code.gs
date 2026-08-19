/**
 * Modern BizOps - Nurture Sender (Apps Script)
 * Sequencer + sender for the TEMPLATED nurture emails (Emails 2-6) of the AI
 * Revenue Scan track. Sends as Bradley via GmailApp, BCC the free HubSpot
 * logging address, advances state in HubSpot, and stops anyone who has replied /
 * booked / unsubscribed.
 *
 * HARD GUARDRAIL: this script NEVER sends Email 1. E1 is a personalized Gmail
 * draft-for-approval owned by Bradley + the Cowork skill. The TEMPLATES table
 * has no step-1 entry, so E1 cannot be sent here.
 *
 * SPINE B (the /playbook track) WAS DELETED 2026-08-18 with the /playbook lead
 * magnet itself. Verified in HubSpot the same day: all 8 contacts carrying a
 * lead_magnet value were Bradley's own test rows, the single playbook one was
 * bradley+pbtest@, and every nurture_* field was empty or test-only. The sender
 * had never run on a real person, so nothing was stranded and no migration was
 * needed. The B-spine copy lives in git history and in the Pivot Copy Pass v2
 * doc. The lm_welcome_playbook UTM registry row is RETIRED IN PLACE, not
 * deleted, because historical links keep firing it.
 *
 * Design: docs/superpowers/specs/2026-07-27-apps-script-nurture-sender-design.md
 * Approved copy: Marketing Systems/Email Loop - Sequence Plan and Drafts.md (Rev 5,
 * approved 2026-08-18; record in Email Loop - Pivot Copy Pass v2 (2026-08-18).md).
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

// FALLBACK SIGNATURES ONLY. Normal operation never uses these: getSignatureHtml_()
// reads the real signature out of Gmail on every run, so whatever Bradley sets there
// is what ships. These exist for the one case where that fetch fails, and their only
// job is to be indistinguishable from the live block when it does.
//
// 2026-08-19: re-synced against the signature Bradley set in Gmail, read directly from
// Settings. Two things changed and both were stale here. The tagline is now
// "Go-to-market AI automation for B2B businesses" (was the longer pre-pivot
// "More leads, more booked calls, less busywork" line), and the retired "RevOps Coach"
// role is gone from the live block, which closes the last standing item on it.
//
// The live block has NO "--" delimiter, so these do not either. A fallback that adds one
// would be visibly different from the 99-percent case it stands in for.
//
// Deliberate divergence, one item: the live signature links www.modernbizops.com, which
// 308-redirects to the apex. These use the apex directly, matching bookLink() and this
// repo's canonical-host rule, so the fallback costs a redirect hop less than the real
// thing. Flagged to Bradley as an optional tidy-up in Gmail; not worth a mismatch here.

// Plain text. ASCII only, so no client mis-decodes it.
var SIGNATURE_TEXT = [
  'Bradley de Wet',
  'Founder | Modern BizOps',
  'Go-to-market AI automation for B2B businesses',
  '',
  'Get my free AI Revenue Scan: ' + SCORECARD_URL,
  SITE_URL + ' | ' + LINKEDIN_URL + ' | ' + YOUTUBE_URL
].join('\n');

var SIGNATURE_HTML_FALLBACK = [
  'Bradley de Wet',
  'Founder &middot; Modern BizOps',
  'Go-to-market AI automation for B2B businesses',
  '',
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
    // The <a> rewrite runs before entity stripping, so anchor text ending in an arrow
    // ("Get my free AI Revenue Scan &rarr;") leaves a double space before the URL it
    // appends. Collapse only that, never the deliberate spacing elsewhere in the block.
    .replace(/ +\(http/g, ' (http')
    .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

/** Build the /book link for E5/E6, carrying the nurture-email UTM (Sequence Plan section 7).
 *  Apex host (canonical) to avoid the www 308 redirect hop.
 *
 *  2026-08-18 (Rev 5): the campaign becomes lm_welcome_scan. Sequence Plan section 7
 *  retires lm_welcome_scorecard and lm_welcome_playbook IN PLACE (registry rows are
 *  never deleted, because historical links keep firing them). The sender has never
 *  sent a live email, so no historical link of ours carries the old campaign.
 *
 *  KNOWN DISCREPANCY, left as the approved doc has it: section 7 changed the CAMPAIGN
 *  to lm_welcome_scan but left the utm_content list reading welcome_scorecard_0X_v1.
 *  Content is kept on the track identifier, which deliberately stayed "scorecard" (same
 *  reason /scorecard and lead_magnet=scorecard did). Flagged to Bradley rather than
 *  resolved here; it is a one-line change either way and nothing has shipped on it.
 *
 *  Both values still need registering in UTM Campaign Registry - Content.csv and the
 *  dashboard REGISTERED_CONTENT allowlist before switch-on.
 */
function bookLink(track, step) {
  return 'https://modernbizops.com/book' +
    '?utm_source=email&utm_medium=nurture' +
    '&utm_campaign=lm_welcome_scan' +
    '&utm_content=welcome_' + track + '_0' + step + '_v1';
}

// --- Approved templated copy (Rev 5, E2-6). No em dashes. --------------------
// Backtick literals so straight apostrophes render verbatim in the sent email.
//
// Rev 5 (2026-08-18) rewrote E2, E3 and E6 onto the operations-debt pillar and
// merged the E4 delivery-model revision. Rev 4 contained no mention of AI across
// all six emails, because it was written for the retired RevOps coaching business
// and survived review by not contradicting anything. E2's old opening ("Another
// hire, a new tool...") also broke doc 08 tone rule 3, which forbids implying
// headcount reduction; PR #72 rephrased the same claim off the website.

var SPINE_A = {
  2: {
    subject: `the fix you've probably already tried`,
    body: [
`Hey {{firstName}},`,
`Been thinking about your Scan result since it came through. Your weakest area was {{topGap}}, and if you're like most people I talk to, you've already thrown something at that. A new tool, probably an AI one, and it helped for about a month before drifting back to where it was.`,
`Am I close? Because if that's how it went, the problem was never effort. It probably wasn't the tool either.`,
`Here's what I find most of the time. The tool was fine. What it was reading was not. Half the records missing a field, a process that lives in two people's heads, a handoff that only works because someone remembers to chase it. AI doesn't fix any of that. It inherits it.`,
`That's the part we'd fix first. Not more activity, and not another tool stacked on top. The unglamorous work underneath {{topGap}}, so that whatever you automate on top of it actually holds.`,
`Does that match what you've already tried? Reply and tell me, I read every one.`,
`Talk soon,\nBradley`
    ].join('\n\n')
  },
  3: {
    subject: `it's probably deeper than that`,
    body: [
`Hey {{firstName}},`,
`Quick follow-up to the last one. I said we'd fix what sits under {{topGap}}, and I want to be honest about what that usually turns out to be.`,
`The gap your Scan flagged is real, but it's rarely the root. Most of the time the root is debt you've been carrying for years and reasonably ignoring. Fields nobody fills in. Two systems that disagree about the same customer. A process that works because one specific person remembers it.`,
`None of that mattered much while it was merely annoying. It matters now, because it decides whether anything you automate on top of it works at all. And it's the part nobody wants to sell you, which is most of the reason it never gets done.`,
`I've done this in the seat, not from a slide. At Contactually I built the onboarding program that cut first-90-day churn in half, and the win wasn't a clever idea. It was fixing how the work actually got handed off.`,
`So what's the thing in your business that only works because one specific person remembers it? Hit reply, I'd genuinely like to know.`,
`Talk soon,\nBradley`
    ].join('\n\n')
  }
};

/** E4/E5/E6. "Shared" is historical: they were written spine-neutral when there
 *  were two spines. Kept as their own table so the E2/E3 rewrites stay separable. */
var SHARED = {
  4: {
    subject: `you've probably done this before`,
    body: [
`Hey {{firstName}},`,
`If you've been at this a while, my guess is you've already paid someone once to fix exactly this. A consultant, an agency, a CRM person. And what you got was a deck or a report that looked great and then sat in a drive nobody opened again.`,
`Tell me if I'm off, but that's the pattern for most people I meet, and it's why a little skepticism about me is fair. So let me be clear about what this isn't. I don't hand you a strategy doc and disappear. I build one named system at a time, at a fixed price you see before we start, and I don't build things you need me around to keep running. Someone on your team owns each system, the runbook is written before I ship it, and I stay until it sticks.`,
`The whole point is that you stop needing me. That's the difference between paying for advice and ending up with something that actually keeps working on its own. If that's the kind of help that'd be worth it to you, reply and tell me, and I'll show you what the first system would be.`,
`Best,\nBradley`
    ].join('\n\n')
  },
  5: {
    subject: `worth 45 minutes?`,
    body: [
`Hey {{firstName}},`,
`It's been a couple of weeks or so since you took the Scan. My guess is the takeaway is still in the back of your mind but hasn't made it onto the list yet, because there's always something more urgent than the thing that's only costing you slowly.`,
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
`Here's what I think is true for you, and tell me if I'm off. The thing capping what AI can actually do for your business probably isn't the AI. It's what sits underneath it. And fixing that isn't a transformation project. It's picking the one place the mess costs you most and doing the boring work there first.`,
`You can absolutely do that yourself. Most of what I know about how is sitting on the site for free.`,
`If you'd rather have someone who's built these do it with you, so it happens in weeks instead of someday, I'm around. Reply here anytime, or grab a time whenever it makes sense: {{book_link}}`,
`Either way, I'll still send something worth reading now and then. Thanks for letting me into your inbox.`,
`Best,\nBradley`
    ].join('\n\n')
  }
};

/** track -> step (2..6) -> {subject, body}. Note: NO step 1.
 *
 *  ROUTING DECISION (2026-08-18): the track branch is KEPT with a single track
 *  rather than collapsed away. Three reasons. (1) The E1 gate reads
 *  {track}_email1_status, so removing the track only moves that string somewhere
 *  else. (2) deriveTrack_ is what stops a contact with a missing or unknown
 *  lead_magnet being enrolled; collapsing would make Scan copy the default for
 *  anything the enrollment query returns. (3) lead_magnet is a live HubSpot
 *  enumeration and a second magnet is a copy table away, not a refactor.
 *
 *  The track identifier stays "scorecard" deliberately, matching what the site
 *  writes (app/api/scorecard/submit/route.js) and the scorecard_top_gap /
 *  scorecard_email1_status properties that already exist. The product was renamed;
 *  the route and the attribution identifiers were not. */
var TEMPLATES = {
  scorecard: { 2: SPINE_A[2], 3: SPINE_A[3], 4: SHARED[4], 5: SHARED[5], 6: SHARED[6] }
};

var LAST_STEP = 6;

/** Opt-out phrases. A bare /\bstop\b/i used to be in here and was removed 2026-08-18:
 *  "stop" is an ordinary English word, and a warm reply like "I want to stop wasting
 *  money on tools" would have matched it. That matters more than it looks, because ANY
 *  reply already halts the sequence. The only thing this scan decides is `replied`
 *  (Bradley takes the thread over) versus `unsubscribed` (permanent, never re-enroll).
 *  So a false positive here does not stop an email, it silently and permanently buries
 *  an engaged lead. These patterns require actual opt-out intent instead. */
var UNSUBSCRIBE_PATTERNS = [
  /\bunsubscribe\b/i,
  /\bremove me\b/i,
  /\btake me off\b/i,
  /\bopt\s*-?\s*out\b/i,
  /\bstop\s+(emailing|email|sending|contacting|messaging)\b/i,
  /^\s*stop[.!]?\s*$/i   // the whole reply is the single word, the SMS convention
];

/** Strip the quoted original from a reply before scanning it.
 *
 *  Load-bearing, and not merely tidy. GmailApp's getPlainBody() returns the WHOLE body,
 *  including the quoted copy of the email we sent. The Sequence Plan defers a CAN-SPAM
 *  footer reading "Not for you? Just reply 'unsubscribe'" and says it goes in at scale.
 *  The day that footer ships, every ordinary reply would quote it, match
 *  /\bunsubscribe\b/, and permanently suppress the lead who just answered. Cutting the
 *  quote out means the scan only ever reads what the person actually typed. */
function stripQuoted_(text) {
  var lines = String(text || '').split('\n');
  var out = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.charAt(0) === '>') break;                       // quoted block
    if (/^\s*On .+ wrote:\s*$/.test(line)) break;             // Gmail attribution
    if (/^\s*-{2,}\s*Original Message\s*-{2,}/i.test(line)) break;
    if (/^\s*From:\s.+/.test(line) && i > 0) break;          // Outlook header block
    out.push(line);
  }
  return out.join('\n');
}

/** HubSpot contact properties the run needs. */
var FETCH_PROPS = [
  'email', 'firstname', 'createdate', 'lead_magnet', 'engagement_status',
  'nurture_track', 'nurture_step', 'nurture_status',
  'nurture_last_sent_at', 'nurture_started_at',
  'scorecard_top_gap', 'scorecard_email1_status'
];

/** Properties we want but can survive without. Kept separate from FETCH_PROPS so
 *  fetchActiveContacts_ can retry without them if this portal does not expose one.
 *
 *  engagements_last_meeting_booked is a standard HubSpot property, set when a meeting
 *  is booked through the Meetings tool, which is exactly how /book works. It is the
 *  booked-exit signal (see BOOKED EXIT below). */
var OPTIONAL_FETCH_PROPS = ['engagements_last_meeting_booked'];

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

  // Exit check 2b: BOOKED EXIT.
  //
  // Added 2026-08-18. The design doc said "booked is set by the calendar/booking side"
  // and the sender only honored it, but NOTHING anywhere ever set it: a repo-wide grep
  // for nurture_status outside this file returns only the design doc. So a lead who
  // booked a discovery call stayed 'active' and kept receiving the rest of the
  // sequence, including E5 "worth 45 minutes?" asking them to book the call they had
  // already booked, and then E6. That is the single worst thing this sender could do
  // to a lead who just converted.
  //
  // HubSpot stamps engagements_last_meeting_booked when a meeting is booked through
  // the Meetings tool. Only a booking at or after the nurture anchor counts, so an
  // older unrelated meeting cannot suppress a fresh sequence.
  var meetingBooked = toMillis_(p.engagements_last_meeting_booked);
  if (meetingBooked && meetingBooked >= startedAt) {
    if (live) patchContact_(contact.id, { nurture_status: 'booked' });
    log_('STOP ' + label + ': meeting booked (engagements_last_meeting_booked), now in the sales motion.');
    return 'stopped';
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
  var topGap = topGapLabel_(p.scorecard_top_gap);
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

/**
 * Normalize scorecard_top_gap into something that reads correctly mid-sentence.
 *
 * Two real defects this fixes, both found 2026-08-18 before the first live send.
 *
 * 1. THE LITERAL STRING 'None'. When the Scan surfaces no dollar line it writes
 *    scorecard_top_gap = 'None' (lib/scorecard/hubspotResultProperties.js, the
 *    hasDollarGap === false branch). 'None' is truthy, so the old
 *    `(p.scorecard_top_gap || '').trim() || fallback` passed it straight through and
 *    E2 read "Your weakest area was None." E3 read "I said we'd fix what sits under
 *    None." The E1 skill already treats 'None' as a real case, so this was a known
 *    sentinel that the sender simply did not know about.
 *
 * 2. TITLE CASE. The labels arrive as 'Revenue per employee', 'Sales cycle',
 *    'Gross revenue retention'. Every {{topGap}} slot in the approved copy is
 *    mid-sentence ("the unglamorous work underneath {{topGap}}"), so the capital is
 *    wrong. Only the first letter is lowered, and only when the rest of the label has
 *    no capitals of its own, so a future acronym label stays intact.
 */
function topGapLabel_(raw) {
  var v = String(raw == null ? '' : raw).trim();
  if (!v || v.toLowerCase() === 'none') return 'the gap it flagged';
  var rest = v.slice(1);
  if (rest === rest.toLowerCase()) return v.charAt(0).toLowerCase() + rest;
  return v;
}

function deriveTrack_(leadMagnet) {
  var lm = (leadMagnet || '').trim().toLowerCase();
  if (lm === 'scorecard') return 'scorecard';
  // 'playbook' deliberately returns '' since 2026-08-18: the magnet is retired and
  // its spine is deleted, so a playbook contact is skipped rather than mis-routed
  // into Scan copy. Only Bradley's own test row carries that value.
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
    var text = stripQuoted_(last.getPlainBody() || '');
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

/** True once a run has decided the optional properties are not fetchable here. */
var OPTIONAL_PROPS_OK = true;

function fetchActiveContacts_() {
  // Try with the optional properties; fall back to the required set if the portal
  // rejects one. A missing booked-exit signal degrades the sequence. A 400 that takes
  // the whole run down would stop it entirely, so this must never be fatal.
  try {
    return fetchContactsWithProps_(FETCH_PROPS.concat(OPTIONAL_FETCH_PROPS));
  } catch (e) {
    OPTIONAL_PROPS_OK = false;
    log_('WARNING: contact search rejected the optional properties (' +
      OPTIONAL_FETCH_PROPS.join(', ') + '), retrying without them. The BOOKED EXIT is ' +
      'INACTIVE for this run, so a lead who booked a call can still receive E5/E6. ' +
      'Check that the property exists in the portal. Error: ' + e);
    return fetchContactsWithProps_(FETCH_PROPS);
  }
}

function fetchContactsWithProps_(propNames) {
  var results = [];
  var after = null;
  do {
    var payload = {
      filterGroups: [
        { filters: [{ propertyName: 'nurture_status', operator: 'EQ', value: 'active' }] },
        { filters: [
            { propertyName: 'nurture_status', operator: 'NOT_HAS_PROPERTY' },
            { propertyName: 'lead_magnet', operator: 'IN', values: ['scorecard'] }
        ] }
      ],
      properties: propNames,
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
      options: [{ label: 'Scorecard', value: 'scorecard' }] },
    { name: 'nurture_step', label: 'Nurture Step', type: 'number', fieldType: 'number' },
    { name: 'nurture_last_sent_at', label: 'Nurture Last Sent At', type: 'datetime', fieldType: 'date' },
    { name: 'nurture_status', label: 'Nurture Status', type: 'enumeration', fieldType: 'select',
      options: ['active', 'replied', 'booked', 'unsubscribed', 'completed'].map(function (v) {
        return { label: v.charAt(0).toUpperCase() + v.slice(1), value: v };
      }) },
    { name: 'nurture_started_at', label: 'Nurture Started At', type: 'datetime', fieldType: 'date' },
    // E1 gate fields (string, so any writer can set 'sent'; the sender only reads === 'sent').
    { name: 'scorecard_email1_status', label: 'Scorecard Email 1 Status', type: 'string', fieldType: 'text' }
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
