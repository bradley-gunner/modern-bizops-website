// Per-page hero motifs for /learn pages.
//
// Every motif is an inline <svg> so it is part of the server-rendered document
// rather than a fetched asset. None of them carries load-bearing copy: the H1,
// dek, and byline are real HTML in LearnHero, and any <text> in here is
// decorative. Each motif is drawn on a 420x300 viewBox and inherits the hero's
// dark band, so all fills are the light end of the brand palette.
//
// Add a motif by exporting a component here and registering it in MOTIFS at the
// foot of the file; a page then selects it by key from its registry entry.

const NAVY_MID = "#1C3A5C";
const AMBER_LIGHT = "#E8873A";
const CREAM = "#F6F2EB";
const TEXT_LIGHT = "#8A9AB0";
const RED = "#B83A2B";
const GREEN = "#4E9A5A";

// Shared chevron path. A stage block 58 wide with a 22-deep arrow notch, drawn
// from an x origin so a row of them can be laid out by offset alone.
function chevron(x) {
  return `M${x} 0 h58 l22 26 -22 26 H${x} l22 -26 z`;
}

function Defs({ id, from, to }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={from} />
        <stop offset="1" stopColor={to} />
      </linearGradient>
    </defs>
  );
}

// Fallback motif, and page 01's Stage 1 highlight. The four chevrons are the
// four maturity stages; `highlightStage` (1-4) marks where the page sits.
export function StageChevrons({ highlightStage = null }) {
  return (
    <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg" role="img">
      <title>
        The four stages of the GTM Maturity Framework as a forward
        progression
      </title>
      <Defs id="motif-stages" from="#244E88" to="#2468A8" />
      <g transform="translate(20,90)">
        {[0, 92, 184, 276].map((x, i) => (
          <path
            key={x}
            d={chevron(x)}
            fill={
              highlightStage === i + 1 ? AMBER_LIGHT : "url(#motif-stages)"
            }
            opacity={highlightStage && highlightStage !== i + 1 ? 0.42 : 1}
          />
        ))}
      </g>
      <g fontFamily="Jost, sans-serif" fontSize="12" fill={TEXT_LIGHT}>
        {["1", "2", "3", "4"].map((n, i) => (
          <text key={n} x={20 + i * 92 + 29} y="175" textAnchor="middle">
            {n}
          </text>
        ))}
      </g>
      {/* Neutral by design: this motif is also the library-wide fallback, so
          its wording has to hold on any page that has no motif of its own. */}
      <text
        x="20"
        y="222"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={TEXT_LIGHT}
      >
        FOUR STAGES. ONE DIRECTION.
      </text>
    </svg>
  );
}

export function Stage1Chevrons() {
  return <StageChevrons highlightStage={1} />;
}

// 02 crm-architecture-and-governance: records stacking into a governed spine.
export function CrmRecords() {
  return (
    <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg" role="img">
      <title>
        Customer records aligned to a single governed structure, with one
        malformed record out of line
      </title>
      <Defs id="motif-crm" from="#244E88" to="#2468A8" />
      <rect x="20" y="52" width="8" height="176" rx="4" fill={AMBER_LIGHT} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(48,${58 + i * 44})`}>
          <rect
            width={i === 2 ? 214 : 268}
            height="30"
            rx="7"
            fill={i === 2 ? "none" : "url(#motif-crm)"}
            stroke={i === 2 ? RED : "none"}
            strokeWidth={i === 2 ? 1.5 : 0}
            strokeDasharray={i === 2 ? "5 4" : "0"}
          />
          <circle cx="18" cy="15" r="6" fill={i === 2 ? RED : CREAM} opacity={i === 2 ? 1 : 0.55} />
          <rect x="36" y="10" width={i === 2 ? 96 : 150} height="4" rx="2" fill={CREAM} opacity="0.4" />
          <rect x="36" y="19" width={i === 2 ? 52 : 92} height="4" rx="2" fill={CREAM} opacity="0.22" />
        </g>
      ))}
      <text
        x="48"
        y="262"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={TEXT_LIGHT}
      >
        ONE STRUCTURE. ONE SOURCE OF TRUTH.
      </text>
    </svg>
  );
}

// 03 pipeline-stage-design: the approved reference motif. Buyer decisions move
// forward on the top row; activity stalls in red on the bottom.
export function PipelineChevrons() {
  return (
    <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg" role="img">
      <title>Pipeline stages as chevrons, with one stalled deal in red</title>
      <Defs id="motif-pipeline" from="#244E88" to="#2468A8" />
      <g transform="translate(20,60)">
        <path d={chevron(0)} fill="url(#motif-pipeline)" />
        <path d={chevron(92)} fill="url(#motif-pipeline)" />
        <path d={chevron(184)} fill="url(#motif-pipeline)" />
        <path d={chevron(276)} fill={AMBER_LIGHT} />
      </g>
      <g transform="translate(20,150)">
        <path d={chevron(0)} fill={NAVY_MID} opacity="0.6" />
        <path d={chevron(92)} fill={NAVY_MID} opacity="0.6" />
        <path d={chevron(184)} fill={RED} />
        <circle cx="215" cy="26" r="7" fill={CREAM} />
        <text
          x="215"
          y="30"
          textAnchor="middle"
          fontFamily="Jost, sans-serif"
          fontSize="11"
          fontWeight="600"
          fill={RED}
        >
          !
        </text>
      </g>
      <text
        x="20"
        y="230"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={TEXT_LIGHT}
      >
        BUYER DECISIONS MOVE FORWARD.
      </text>
      <text
        x="20"
        y="250"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill="#D45040"
      >
        ACTIVITY STALLS IN PLACE.
      </text>
    </svg>
  );
}

// 04 ideal-customer-profile: concentric tiers, best-fit at the centre.
export function IcpTarget() {
  return (
    <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg" role="img">
      <title>
        Concentric customer tiers narrowing to a best-fit centre, with poor-fit
        prospects outside the rings
      </title>
      <g transform="translate(160,132)">
        <circle r="104" fill="none" stroke={NAVY_MID} strokeWidth="1.5" opacity="0.7" />
        <circle r="70" fill="none" stroke="#244E88" strokeWidth="2" />
        <circle r="38" fill="none" stroke={AMBER_LIGHT} strokeWidth="2" opacity="0.8" />
        <circle r="12" fill={AMBER_LIGHT} />
        {[
          [-52, -34],
          [44, -50],
          [58, 40],
          [-62, 46],
          [10, 62],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill={CREAM} opacity="0.5" />
        ))}
        {[
          [-128, -78],
          [136, -92],
          [148, 84],
          [-140, 92],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" fill={RED} opacity="0.75" />
        ))}
      </g>
      <text
        x="20"
        y="272"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={TEXT_LIGHT}
      >
        FIT IS A DEFINITION, NOT A FEELING.
      </text>
    </svg>
  );
}

// 05 revenue-lifecycle-design: one continuous loop, not a straight funnel.
export function LifecycleLoop() {
  return (
    <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg" role="img">
      <title>
        The revenue lifecycle as a closed loop running from first contact
        through onboarding to expansion
      </title>
      <defs>
        <marker
          id="motif-loop-arrow"
          markerWidth="9"
          markerHeight="9"
          refX="6"
          refY="4.5"
          orient="auto"
        >
          <path d="M0 0 L9 4.5 L0 9 z" fill={AMBER_LIGHT} />
        </marker>
      </defs>
      <ellipse
        cx="200"
        cy="130"
        rx="132"
        ry="82"
        fill="none"
        stroke="#244E88"
        strokeWidth="2.5"
        markerEnd="url(#motif-loop-arrow)"
      />
      {[
        [200, 48, "MARKET"],
        [332, 130, "SELL"],
        [200, 212, "DELIVER"],
        [68, 130, "EXPAND"],
      ].map(([x, y, label], i) => (
        <g key={label}>
          <circle cx={x} cy={y} r="9" fill={i === 0 ? AMBER_LIGHT : CREAM} opacity={i === 0 ? 1 : 0.75} />
          <text
            x={x}
            y={y + (y > 130 ? 26 : y < 130 ? -16 : 4)}
            textAnchor="middle"
            fontFamily="Jost, sans-serif"
            fontSize="10.5"
            letterSpacing="0.12em"
            fill={TEXT_LIGHT}
          >
            {label}
          </text>
        </g>
      ))}
      <text
        x="20"
        y="278"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={TEXT_LIGHT}
      >
        ONE MAP, END TO END.
      </text>
    </svg>
  );
}

// 06 data-quality-management: a clean grid with the decayed cells picked out.
export function DataIntegrityGrid() {
  const cells = [];
  const bad = new Set([3, 9, 14, 22, 27]);
  for (let r = 0; r < 5; r += 1) {
    for (let c = 0; c < 7; c += 1) {
      const i = r * 7 + c;
      cells.push(
        <rect
          key={i}
          x={20 + c * 40}
          y={54 + r * 34}
          width="30"
          height="24"
          rx="5"
          fill={bad.has(i) ? RED : "#244E88"}
          opacity={bad.has(i) ? 0.9 : 0.55}
        />
      );
    }
  }
  return (
    <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg" role="img">
      <title>
        A grid of customer records with decayed and duplicate entries picked out
        in red
      </title>
      {cells}
      <text
        x="20"
        y="262"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={TEXT_LIGHT}
      >
        DATA DECAYS WHETHER OR NOT
      </text>
      <text
        x="20"
        y="280"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill="#D45040"
      >
        YOU ARE WATCHING.
      </text>
    </svg>
  );
}

// 07 lead-qualification-framework: a funnel that sorts rather than collects.
export function QualifyFunnel() {
  return (
    <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg" role="img">
      <title>
        A qualification funnel sorting inbound leads, with unqualified leads
        routed out
      </title>
      <Defs id="motif-funnel" from="#244E88" to="#2468A8" />
      <path
        d="M96 52 H324 L246 150 V212 L174 240 V150 Z"
        fill="url(#motif-funnel)"
        opacity="0.85"
      />
      {[
        [120, 34],
        [162, 26],
        [210, 32],
        [258, 24],
        [300, 34],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="5" fill={CREAM} opacity="0.55" />
      ))}
      <circle cx="210" cy="186" r="7" fill={AMBER_LIGHT} />
      {[
        [78, 132],
        [58, 158],
        [342, 132],
        [362, 158],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" fill={RED} opacity="0.8" />
      ))}
      <text
        x="20"
        y="278"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={TEXT_LIGHT}
      >
        QUALIFY OUT, NOT JUST IN.
      </text>
    </svg>
  );
}

// 08 fractional-coo: one senior operator against a flat org, no fake faces.
export function LeadershipMotif() {
  return (
    <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg" role="img">
      <title>
        A senior operator connected into an existing team without adding a
        permanent layer
      </title>
      <Defs id="motif-lead" from="#244E88" to="#2468A8" />
      <rect x="164" y="48" width="92" height="46" rx="10" fill={AMBER_LIGHT} />
      <path d="M210 94 V126" stroke={AMBER_LIGHT} strokeWidth="2" strokeDasharray="5 4" />
      <path d="M78 126 H342" stroke={NAVY_MID} strokeWidth="2" />
      {[78, 166, 254, 342].map((x) => (
        <g key={x}>
          <path d={`M${x} 126 V152`} stroke={NAVY_MID} strokeWidth="2" />
          <rect x={x - 34} y="152" width="68" height="40" rx="9" fill="url(#motif-lead)" />
        </g>
      ))}
      <text
        x="20"
        y="252"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={AMBER_LIGHT}
      >
        SENIOR JUDGEMENT, PART TIME.
      </text>
      <text
        x="20"
        y="272"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={TEXT_LIGHT}
      >
        NOT A PERMANENT LAYER.
      </text>
    </svg>
  );
}

// 09 net-revenue-retention: the existing base expanding past churn.
export function RetentionExpansion() {
  return (
    <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg" role="img">
      <title>
        An existing revenue base expanding above 100 percent while churn pulls
        against it
      </title>
      <line x1="20" y1="150" x2="400" y2="150" stroke={NAVY_MID} strokeWidth="1.5" strokeDasharray="4 4" />
      <text
        x="20"
        y="142"
        fontFamily="Jost, sans-serif"
        fontSize="10.5"
        letterSpacing="0.1em"
        fill={TEXT_LIGHT}
      >
        100%
      </text>
      {[
        [64, 34, "#244E88"],
        [128, 52, "#244E88"],
        [192, 30, RED],
        [256, 68, GREEN],
        [320, 96, AMBER_LIGHT],
      ].map(([x, h, fill]) => (
        <rect
          key={x}
          x={x}
          y={fill === RED ? 150 : 150 - h}
          width="46"
          height={h}
          rx="6"
          fill={fill}
          opacity={fill === "#244E88" ? 0.75 : 1}
        />
      ))}
      <text
        x="20"
        y="252"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={TEXT_LIGHT}
      >
        THE CUSTOMERS YOU ALREADY HAVE
      </text>
      <text
        x="20"
        y="272"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={AMBER_LIGHT}
      >
        ARE THE CHEAPEST GROWTH YOU OWN.
      </text>
    </svg>
  );
}

// 10 marketing-and-sales-alignment: two inputs converging into one machine.
export function TwoIntoOne() {
  return (
    <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg" role="img">
      <title>
        Marketing and sales converging from two separate tracks into one revenue
        machine
      </title>
      <Defs id="motif-align" from="#244E88" to="#2468A8" />
      <path
        d="M28 74 H150 C206 74 206 130 262 130"
        fill="none"
        stroke="#244E88"
        strokeWidth="2.5"
      />
      <path
        d="M28 186 H150 C206 186 206 130 262 130"
        fill="none"
        stroke="#244E88"
        strokeWidth="2.5"
      />
      <circle cx="28" cy="74" r="8" fill={CREAM} opacity="0.7" />
      <circle cx="28" cy="186" r="8" fill={CREAM} opacity="0.7" />
      <text
        x="42"
        y="60"
        fontFamily="Jost, sans-serif"
        fontSize="10.5"
        letterSpacing="0.12em"
        fill={TEXT_LIGHT}
      >
        MARKETING
      </text>
      <text
        x="42"
        y="210"
        fontFamily="Jost, sans-serif"
        fontSize="10.5"
        letterSpacing="0.12em"
        fill={TEXT_LIGHT}
      >
        SALES
      </text>
      <rect x="262" y="104" width="128" height="52" rx="12" fill="url(#motif-align)" />
      <rect x="278" y="120" width="96" height="4" rx="2" fill={AMBER_LIGHT} />
      <rect x="278" y="132" width="62" height="4" rx="2" fill={CREAM} opacity="0.4" />
      <text
        x="20"
        y="262"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={AMBER_LIGHT}
      >
        ONE MACHINE, NOT TWO TEAMS.
      </text>
    </svg>
  );
}

// 17 fractional-coo-cost: four ways to fix operations. Three columns lift away
// when the money stops (fractional, full-time, project); the fourth stays
// rooted in amber (build it and name an internal owner). The page's whole
// argument in one image.
export function FourPaths() {
  const leaving = [30, 126, 222];
  return (
    <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg" role="img">
      <title>
        Four ways to fix operations as columns: three lift away when the spend
        stops, and one stays rooted in the business
      </title>
      <Defs id="motif-paths" from="#244E88" to="#2468A8" />
      <line
        x1="22"
        y1="206"
        x2="398"
        y2="206"
        stroke={NAVY_MID}
        strokeWidth="1.5"
      />
      {leaving.map((x) => (
        <g key={x}>
          {/* the standing column */}
          <rect x={x} y="122" width="62" height="84" rx="7" fill="url(#motif-paths)" opacity="0.5" />
          {/* the piece that has lifted off, fading as it leaves */}
          <rect
            x={x}
            y="86"
            width="62"
            height="24"
            rx="7"
            fill="none"
            stroke={TEXT_LIGHT}
            strokeWidth="1.5"
            strokeDasharray="5 4"
            opacity="0.7"
          />
          <path
            d={`M${x + 31} 78 l-7 9 h14 z`}
            fill={TEXT_LIGHT}
            opacity="0.7"
          />
        </g>
      ))}
      {/* the column that stays: taller, solid amber, anchored below the line */}
      <rect x="318" y="98" width="62" height="108" rx="7" fill={AMBER_LIGHT} />
      <rect x="308" y="206" width="82" height="10" rx="4" fill={AMBER_LIGHT} opacity="0.55" />
      <text
        x="22"
        y="248"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={TEXT_LIGHT}
      >
        THREE PATHS LEAVE WHEN THE MONEY STOPS.
      </text>
      <text
        x="22"
        y="268"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={AMBER_LIGHT}
      >
        ONE STAYS IN THE BUILDING.
      </text>
    </svg>
  );
}

// Wave 2 AI cluster (4.1/4.2/4.3): a small operational signal amplified into a
// much larger one. It is the single governing metaphor the three AI pages share,
// "AI amplifies the operational state it is applied to," rendered as an op-amp
// that takes three short input bars and returns three tall output ones. The
// theme rotation (teal/navy) keeps adjacent pages distinct while reusing it.
export function Amplifier() {
  return (
    <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg" role="img">
      <title>
        A small operational signal amplified into a much larger one, the idea
        that AI amplifies the state it is applied to
      </title>
      <Defs id="motif-amp" from="#244E88" to="#2468A8" />
      <line x1="24" y1="180" x2="396" y2="180" stroke={NAVY_MID} strokeWidth="1.5" />
      {/* Input: three short bars, the operational state going in. */}
      {[
        [48, 22],
        [72, 34],
        [96, 26],
      ].map(([x, h]) => (
        <rect
          key={x}
          x={x}
          y={180 - h}
          width="18"
          height={h}
          rx="4"
          fill="url(#motif-amp)"
          opacity="0.7"
        />
      ))}
      {/* The amplifier itself, an op-amp triangle pointing to the output. */}
      <path d="M150 132 V228 L238 180 Z" fill={AMBER_LIGHT} />
      <path d="M244 180 h30" stroke={AMBER_LIGHT} strokeWidth="2.5" />
      <path d="M274 180 l-9 6 v-12 z" fill={AMBER_LIGHT} />
      {/* Output: the same shape scaled up, middle bar picked out in amber. */}
      {[
        [286, 58, "url(#motif-amp)", 0.7],
        [320, 92, AMBER_LIGHT, 1],
        [354, 70, "url(#motif-amp)", 0.7],
      ].map(([x, h, fill, op]) => (
        <rect
          key={x}
          x={x}
          y={180 - h}
          width="22"
          height={h}
          rx="5"
          fill={fill}
          opacity={op}
        />
      ))}
      <text
        x="24"
        y="252"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={TEXT_LIGHT}
      >
        SMALL STATE IN. AMPLIFIED OUT.
      </text>
      <text
        x="24"
        y="272"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={AMBER_LIGHT}
      >
        AI SCALES WHAT IT FINDS.
      </text>
    </svg>
  );
}

// 2.4 reduce-customer-churn: an account's health declining over time toward a
// cancellation, with the amber intervention marker placed well before the end,
// where a course-correction can still change the outcome. The whole page in one
// image: leading (intervene early) versus lagging (the cancellation).
export function InterveneTimeline() {
  return (
    <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg" role="img">
      <title>
        An account&rsquo;s health declining over time toward a cancellation, with
        an intervention marked well before the end
      </title>
      <line x1="22" y1="212" x2="398" y2="212" stroke={NAVY_MID} strokeWidth="1.5" />
      {/* The declining health line. */}
      <path
        d="M30 74 C120 96 150 150 208 160 C280 172 322 198 386 206"
        fill="none"
        stroke="#244E88"
        strokeWidth="3"
      />
      {/* The early intervention marker and the corrected, recovering path. */}
      <path
        d="M176 150 C224 138 256 118 300 104"
        fill="none"
        stroke={AMBER_LIGHT}
        strokeWidth="2"
        strokeDasharray="5 4"
      />
      <path d="M300 104 l-3 12 11 -5 z" fill={AMBER_LIGHT} />
      <circle cx="176" cy="150" r="9" fill={AMBER_LIGHT} />
      <text
        x="112"
        y="138"
        fontFamily="Jost, sans-serif"
        fontSize="10.5"
        letterSpacing="0.1em"
        fill={AMBER_LIGHT}
      >
        INTERVENE HERE
      </text>
      {/* The cancellation endpoint, if nobody intervened. */}
      <circle cx="386" cy="206" r="7" fill={RED} />
      <text
        x="322"
        y="198"
        fontFamily="Jost, sans-serif"
        fontSize="10.5"
        letterSpacing="0.1em"
        fill={TEXT_LIGHT}
      >
        CANCELLED
      </text>
      <text
        x="22"
        y="252"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={TEXT_LIGHT}
      >
        MOST CHURN IS DECIDED
      </text>
      <text
        x="22"
        y="272"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={AMBER_LIGHT}
      >
        LONG BEFORE THE CANCELLATION.
      </text>
    </svg>
  );
}

// 5.2 payment-recovery: a payment caught mid-fall and returned to the revenue
// stack by a retry loop. The money was already earned; the loop is speed.
export function RecoveryLoop() {
  return (
    <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg" role="img">
      <title>
        A failed payment caught mid-fall and returned to the revenue stack by a
        retry loop
      </title>
      <Defs id="motif-recover" from="#244E88" to="#2468A8" />
      {/* The revenue stack: three coins, bottom-left. */}
      {[196, 176, 156].map((y, i) => (
        <g key={y}>
          <ellipse cx="108" cy={y} rx="46" ry="14" fill="url(#motif-recover)" />
          <ellipse
            cx="108"
            cy={y - 3}
            rx="46"
            ry="14"
            fill="none"
            stroke={i === 2 ? AMBER_LIGHT : "#2A5488"}
            strokeWidth="1.5"
          />
        </g>
      ))}
      {/* The failed payment, caught mid-fall. */}
      <ellipse cx="312" cy="96" rx="30" ry="30" fill="none" stroke={AMBER_LIGHT} strokeWidth="2.5" />
      <text
        x="312"
        y="103"
        textAnchor="middle"
        fontFamily="Jost, sans-serif"
        fontSize="22"
        fontWeight="700"
        fill={AMBER_LIGHT}
      >
        $
      </text>
      {/* The retry loop returning it to the stack. */}
      <path
        d="M286 118 C232 168 176 150 132 138"
        fill="none"
        stroke={AMBER_LIGHT}
        strokeWidth="2"
        strokeDasharray="5 4"
      />
      <path d="M132 138 l13 -1 -8 -9 z" fill={AMBER_LIGHT} />
      <text
        x="22"
        y="252"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={TEXT_LIGHT}
      >
        REVENUE YOU ALREADY EARNED,
      </text>
      <text
        x="22"
        y="272"
        fontFamily="Jost, sans-serif"
        fontSize="12.5"
        letterSpacing="0.1em"
        fill={AMBER_LIGHT}
      >
        RECOVERED BEFORE IT IS GONE.
      </text>
    </svg>
  );
}

export const MOTIFS = {
  stageChevrons: StageChevrons,
  stage1Chevrons: Stage1Chevrons,
  crmRecords: CrmRecords,
  pipelineChevrons: PipelineChevrons,
  icpTarget: IcpTarget,
  lifecycleLoop: LifecycleLoop,
  dataIntegrityGrid: DataIntegrityGrid,
  qualifyFunnel: QualifyFunnel,
  leadershipMotif: LeadershipMotif,
  retentionExpansion: RetentionExpansion,
  twoIntoOne: TwoIntoOne,
  fourPaths: FourPaths,
  amplifier: Amplifier,
  interveneTimeline: InterveneTimeline,
  recoveryLoop: RecoveryLoop,
};

export const DEFAULT_MOTIF = "stageChevrons";
