import { getBusinessModelBenchmark } from '@/lib/scorecard/businessModelBenchmarks';

function resolvePeerAnchor(template, answers) {
  if (!template) return '';
  const q2 = answers?.q2?.value;
  const label = q2 ? getBusinessModelBenchmark(q2).label : 'small-to-mid business';
  return template.replaceAll('{model_label}', label);
}

export default function QuestionCard({ question, answers, selected, onSelect }) {
  const peerAnchor = resolvePeerAnchor(question.peerAnchorTemplate, answers);
  return (
    <div className="bg-white rounded-[14px] border border-border p-6 md:p-8">
      {peerAnchor && (
        <p className="font-body text-sm italic text-text-mid mb-4">{peerAnchor}</p>
      )}
      <h3 className="font-display text-xl md:text-2xl text-navy mb-6">{question.prompt}</h3>
      <div className="space-y-3">
        {question.options.map((opt) => {
          const isSelected = selected?.value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-4 rounded-[10px] border cursor-pointer transition-colors ${
                isSelected ? 'border-amber bg-amber/10' : 'border-border bg-cream hover:bg-amber/5'
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={isSelected}
                onChange={() => onSelect(opt)}
                className="mt-1"
              />
              <span className="font-body text-text-primary">
                {opt.label}
                {opt.description && (
                  <span data-description className="block font-body text-sm text-text-mid mt-1">{opt.description}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
