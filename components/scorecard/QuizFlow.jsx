'use client';
import { useState, useMemo, useEffect } from 'react';
import { getQuestionsFor } from '@/lib/scorecard/questions';
import { trackFormSubmit, trackLeadGenerated, identifyLead } from '@/lib/analytics';
import { getHubspotutk } from '@/lib/hubspot-client';
import SectionHeader from './SectionHeader';
import QuestionCard from './QuestionCard';
import EmailGateForm from './EmailGateForm';
import ResultView from './ResultView';

const STORAGE_KEY = 'scorecard:state';

// Drops any answer that no longer corresponds to a visible question OR to a
// live option on that question. The option check matters on restore: a retired
// option value (the revenue bands were realigned to the /book set) would sit in
// a restored session as a value nothing can score, and every ROI generator
// would quietly return null, so the visitor would get the no-gap result with no
// error anywhere. Better to re-ask than to compute from a value that is gone.
function pruneStaleAnswers(answers) {
  const out = {};
  for (const q of getQuestionsFor(answers)) {
    const answer = answers[q.id];
    if (!answer) continue;
    if (!q.options.some((o) => o.value === answer.value)) continue;
    out[q.id] = answer;
  }
  return out;
}

export default function QuizFlow({ utms = {} }) {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState('questions');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [restored, setRestored] = useState(false);

  // Restore on mount. sessionStorage is client-only, so this must run after
  // hydration; a lazy useState initializer would mismatch the server render.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.result) setResult(parsed.result);
        const kept = pruneStaleAnswers(parsed.answers || {});
        const dropped =
          Object.keys(kept).length !== Object.keys(parsed.answers || {}).length;
        // An already-computed result is self-contained and still valid, so it
        // survives. Partial progress built on a retired option value does not:
        // restart rather than resume onto answers that can no longer be scored.
        if (!dropped || parsed.result) {
          setAnswers(kept);
          if (parsed.step) setStep(parsed.step);
          if (typeof parsed.currentIndex === 'number') setCurrentIndex(parsed.currentIndex);
        }
      }
    } catch {}
    setRestored(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist on change (after restore)
  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, step, currentIndex, result }),
      );
    } catch {}
  }, [restored, answers, step, currentIndex, result]);

  const visibleQuestions = useMemo(() => getQuestionsFor(answers), [answers]);
  const safeIndex = Math.min(currentIndex, visibleQuestions.length - 1);
  const currentQuestion = visibleQuestions[safeIndex];
  const isLast = safeIndex === visibleQuestions.length - 1;

  function recordAnswer(option) {
    setAnswers((prev) => {
      const kept = prev[currentQuestion.id];
      const next = {
        ...prev,
        [currentQuestion.id]: {
          value: option.value,
          ...(typeof option.score === 'number' ? { score: option.score } : {}),
          // An exact figure the taker already typed survives a band change;
          // their real number is their real number.
          ...(typeof kept?.exact === 'number' && !option.notTracked ? { exact: kept.exact } : {}),
        },
      };
      // q2 change can hide q16; prune so stale answers cannot leak to submit.
      if (currentQuestion.id === 'q2') {
        return pruneStaleAnswers(next);
      }
      return next;
    });
  }

  // The optional exact figure on a banded financial input. Stored beside the
  // band; resolveInput() prefers it in the ROI math when it passes bounds.
  function recordExact(exact) {
    setAnswers((prev) => {
      const current = prev[currentQuestion.id];
      if (!current) return prev;
      const { exact: _dropped, ...rest } = current;
      return {
        ...prev,
        [currentQuestion.id]: typeof exact === 'number' ? { ...rest, exact } : rest,
      };
    });
  }

  function next() {
    if (isLast) {
      setStep('email');
    } else {
      setCurrentIndex(safeIndex + 1);
    }
  }

  function back() {
    if (safeIndex > 0) setCurrentIndex(safeIndex - 1);
  }

  async function submit({ firstName, email, company, website }) {
    setStep('submitting');
    try {
      const res = await fetch('/api/scorecard/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          email,
          company,
          website,
          utms,
          answers,
          hutk: getHubspotutk(),
          pageUri: typeof window !== 'undefined' ? window.location.href : '',
          pageName: typeof document !== 'undefined' ? document.title : '',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Something went wrong. Please try again.');
        setStep('error');
        return;
      }
      // Fire analytics AFTER the API accepts the submission so we never count
      // failed attempts as leads. `generate_lead` is the GA4-recommended
      // conversion event; `lead_magnet` distinguishes it from the playbook flow.
      trackFormSubmit('scorecard', {
        lead_magnet: 'scorecard',
        has_company: Boolean(company),
        has_website: Boolean(website),
      });
      trackLeadGenerated('scorecard');
      identifyLead(email);

      setResult(data.result);
      setStep('result');
    } catch (err) {
      setError('Network error. Please try again.');
      setStep('error');
    }
  }

  if (step === 'result' && result) {
    return (
      <div className="mx-auto max-w-3xl px-6 md:px-8 py-12">
        <ResultView result={result} />
      </div>
    );
  }

  if (step === 'email' || step === 'submitting') {
    return (
      <div className="mx-auto max-w-2xl px-6 md:px-8 py-12">
        <EmailGateForm onSubmit={submit} submitting={step === 'submitting'} />
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="mx-auto max-w-xl px-6 md:px-8 py-12 text-center">
        <p className="font-body text-text-mid mb-4">{error}</p>
        <button
          onClick={() => setStep('email')}
          className="font-body font-semibold bg-amber text-white rounded-full px-8 py-3"
        >
          Try again
        </button>
      </div>
    );
  }

  const selected = answers[currentQuestion.id];
  return (
    <div className="mx-auto max-w-2xl px-6 md:px-8 py-12">
      <SectionHeader section={currentQuestion.section} />
      <QuestionCard question={currentQuestion} selected={selected} onSelect={recordAnswer} onExact={recordExact} />
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={back}
          disabled={safeIndex === 0}
          className="font-body text-text-mid hover:text-text-primary disabled:opacity-60"
        >
          Back
        </button>
        <button
          onClick={next}
          disabled={!selected}
          className="font-body font-semibold bg-amber text-white hover:bg-amber-light disabled:opacity-40 transition-colors duration-200 rounded-full px-8 py-3"
        >
          Next
        </button>
      </div>
    </div>
  );
}
