import { SECTION_LABELS, SECTION_SUBLINES } from '@/lib/scorecard/voice';

export default function SectionHeader({ section }) {
  return (
    <div className="mb-8 text-center">
      <p className="font-body text-xs font-semibold tracking-widest uppercase text-amber mb-2">
        Section {section} of 3
      </p>
      <h2 className="font-display text-2xl md:text-3xl font-semibold text-navy mb-2">
        {SECTION_LABELS[section]}
      </h2>
      <p className="font-body text-text-mid italic">{SECTION_SUBLINES[section]}</p>
    </div>
  );
}
