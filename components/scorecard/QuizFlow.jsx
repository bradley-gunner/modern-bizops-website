'use client';
import { useState, useMemo, useEffect } from 'react';
import { getQuestionsFor } from '@/lib/scorecard/questions';
import SectionHeader from './SectionHeader';
import QuestionCard from './QuestionCard';
import EmailGateForm from './EmailGateForm';
import ResultView from './ResultView';

const STORAGE_KEY = 'scorecard:state';

function pruneStaleAnswers(answers) {
  const visible = new Set(getQuestionsFor(answers).map((q) => q.id));
  const out = {};
  for (const id of Object.keys(answers)) {
    if (visible.has(id)) out[id] = answers[id];
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

  // Restore on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.step) setStep(parsed.step);
        if (typeof parsed.currentIndex === 'number') setCurrentIndex(parsed.currentIndex);
        if (parsed.result) setResult(parsed.result);
      }
    } catch {}
    setRestored(true);
  }, []);

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
      const next = {
        ...prev,
        [currentQuestion.id]: {
          value: option.value,
          ...(typeof option.score === 'number' ? { score: option.score } : {}),
        },
      };
      // q2 change can hide q15; prune so stale answers cannot leak to submit.
      if (currentQuestion.id === 'q2') {
        return pruneStaleAnswers(next);
      }
      return next;
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

  async function submit({ firstName, email, company }) {
    setStep('submitting');
    try {
      const res = await fetch('/api/scorecard/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email, company, utms, answers }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Something went wrong. Please try again.');
        setStep('error');
        return;
      }
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
      <QuestionCard question={currentQuestion} answers={answers} selected={selected} onSelect={recordAnswer} />
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
