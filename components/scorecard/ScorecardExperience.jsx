'use client';
import { useState, useEffect } from 'react';
import { captureUtms, getUtms } from '@/lib/utm';
import QuizFlow from './QuizFlow';

function Landing({ onStart }) {
  return (
    <main>
      <section className="mx-auto max-w-[820px] px-6 md:px-8 pt-10 pb-16 md:pt-16 md:pb-24 text-center">
        <p className="font-body text-sm font-semibold tracking-widest uppercase text-amber mb-4">
          Free Diagnostic
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
        <p className="font-body text-sm text-text-light mt-3">Fifteen questions. About five minutes.</p>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[760px] px-6 md:px-8 py-16 md:py-24 space-y-8">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-semibold text-navy mb-3">What you will get back</h2>
            <p className="font-body text-text-mid leading-relaxed">
              A maturity stage placement against the 44-competency framework I use with paying clients, the dollar gap between you and peers in your business model on three specific metrics (revenue per employee, sales cycle velocity, retention), and the one operational gap I would attack first.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl md:text-2xl font-semibold text-navy mb-3">What I am comparing you against</h2>
            <p className="font-body text-text-mid leading-relaxed">
              Real benchmark numbers sourced from named public reports (The Bridge Group, SaaS Capital, Optifai, Deltek, Recurly, others), keyed to your business model so the comparison is to peers like you, not to a generic SMB blend. Sources cited next to every number.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl md:text-2xl font-semibold text-navy mb-3">What this is not</h2>
            <p className="font-body text-text-mid leading-relaxed">
              This is a directional read from sixteen questions. It is not the full assessment I run with paying clients, which connects to your CRM and revenue tools and scores all 44 competencies. If the numbers below feel right, that is the signal to take the next step.
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

  if (mode === 'quiz') {
    return <QuizFlow utms={utms} />;
  }
  return <Landing onStart={() => setMode('quiz')} />;
}
