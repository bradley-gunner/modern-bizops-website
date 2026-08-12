'use client';
import { useState, useEffect } from 'react';
import { captureUtms, getUtms } from '@/lib/utm';
import { trackMagnetStart } from '@/lib/analytics';
import { LADDER } from '@/lib/offers';
import QuizFlow from './QuizFlow';

// The paid next rung, named from the single source of truth so this page can
// never disagree with the ladder. Nothing here quotes a price.
const AUDIT = LADDER.find((rung) => rung.id === 'audit');

function Landing({ onStart }) {
  return (
    <main>
      <section className="mx-auto max-w-[820px] px-6 md:px-8 pt-10 pb-16 md:pt-16 md:pb-24 text-center">
        <p className="font-body text-sm font-semibold tracking-widest uppercase text-amber mb-4">
          Free AI Revenue Scan
        </p>
        <h1 className="font-display text-[32px] md:text-[48px] leading-tight font-semibold text-navy mb-6">
          Find the dollar amount your operating system is leaving on the table this year.
        </h1>
        <p className="font-body text-lg md:text-xl text-text-mid max-w-[620px] mx-auto mb-6">
          Built for founders who feel like every dollar of revenue growth requires another hire.
        </p>
        <button
          onClick={onStart}
          className="inline-flex items-center justify-center font-body font-semibold bg-amber text-white hover:bg-amber-light transition-colors duration-200 rounded-full px-10 py-4 text-lg"
        >
          Find your number
        </button>
        <p className="font-body text-sm text-text-light mt-3">Fifteen questions. About five minutes. No call.</p>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[760px] px-6 md:px-8 py-16 md:py-24 space-y-8">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-semibold text-navy mb-3">What you will get back</h2>
            <p className="font-body text-text-mid leading-relaxed">
              Your stage on the Revenue Operations Maturity Model, a framework we built for scoring how a revenue engine actually runs. The dollar gap between you and peers in your business model on revenue per employee, sales cycle velocity and retention. And the one operational gap we would close first.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl md:text-2xl font-semibold text-navy mb-3">What we are comparing you against</h2>
            <p className="font-body text-text-mid leading-relaxed">
              Benchmark numbers drawn from published industry data (SaaS Capital, HRBench, The Bridge Group, Deltek, Recurly, Statista and others), keyed to your business model, so a services firm gets compared against services firms and a SaaS company against SaaS companies. Sources are cited next to every number, and where a segment has no representative published data, the page says so.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl md:text-2xl font-semibold text-navy mb-3">What this is not</h2>
            <p className="font-body text-text-mid leading-relaxed">
              Every number here comes from your own estimate of your own business, so the read is only as good as those estimates. The {AUDIT.name} is the paid version. It connects to your CRM and revenue tools and scores more than forty competencies off your live data. Then it ranks what to automate first. If the numbers here look about right to you, that is the point to go get the real ones.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ScorecardExperience() {
  const [mode, setMode] = useState('landing');
  const [utms, setUtms] = useState({});

  // UTMs live in the client URL and localStorage, so this must run after
  // hydration; reading them during render would mismatch the server render.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    captureUtms();
    setUtms(getUtms());
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function startQuiz() {
    trackMagnetStart('scorecard');
    setMode('quiz');
  }

  if (mode === 'quiz') {
    return <QuizFlow utms={utms} />;
  }
  return <Landing onStart={startQuiz} />;
}
