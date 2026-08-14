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
          Find out why AI has not stuck in your business yet, and what it is costing you.
        </h1>
        <p className="font-body text-lg md:text-xl text-text-mid max-w-[620px] mx-auto mb-6">
          Built for leaders who keep hearing what AI should be doing for them, and have the abandoned tools to show for it.
        </p>
        <button
          onClick={onStart}
          className="inline-flex items-center justify-center font-body font-semibold bg-amber text-white hover:bg-amber-light transition-colors duration-200 rounded-full px-10 py-4 text-lg"
        >
          Start the Scan
        </button>
        <p className="font-body text-sm text-text-light mt-3">Sixteen questions. About five minutes. No call.</p>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[760px] px-6 md:px-8 py-16 md:py-24 space-y-8">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-semibold text-navy mb-3">What you will get back</h2>
            <p className="font-body text-text-mid leading-relaxed">
              Why AI has or has not worked for you so far. The dollar value of the gaps at your size, peer-benchmarked, with sources cited. Which automations you are ready to start on now, and which need a connected read to call. What we could see from your public surfaces if you give us your URL. And the first move we would make in your seat.
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
              Every score here is self-reported plus observed from your public surfaces, so the read is as good as your answers and what your website gives away. The {AUDIT.name} is the connected version. It computes maturity and readiness from your actual records against the certified framework, then ranks what to automate first. If this result looks about right to you, that is the point to go get the computed one.
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
