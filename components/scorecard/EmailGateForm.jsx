'use client';
import { useState } from 'react';

export default function EmailGateForm({ onSubmit, submitting }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ firstName, email, company });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[14px] border border-border p-6 md:p-8 max-w-xl mx-auto">
      <h2 className="font-display text-2xl md:text-3xl text-navy mb-2 text-center">One last step before your results.</h2>
      <p className="font-body text-text-mid text-center mb-6">
        Tell me who you are and your full Scan result is on screen the moment you submit.
      </p>
      <div className="space-y-4 mb-5">
        <div>
          <label htmlFor="firstName" className="block font-body text-sm font-semibold text-text-primary mb-1">First name</label>
          <input
            id="firstName" type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
            className="w-full border border-border rounded-[10px] px-4 py-3 font-body text-text-primary focus:outline-none focus:border-amber"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-body text-sm font-semibold text-text-primary mb-1">Email</label>
          <input
            id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border rounded-[10px] px-4 py-3 font-body text-text-primary focus:outline-none focus:border-amber"
          />
        </div>
        <div>
          <label htmlFor="company" className="block font-body text-sm font-semibold text-text-primary mb-1">Company</label>
          <input
            id="company" type="text" required value={company} onChange={(e) => setCompany(e.target.value)}
            className="w-full border border-border rounded-[10px] px-4 py-3 font-body text-text-primary focus:outline-none focus:border-amber"
          />
        </div>
      </div>
      <button
        type="submit" disabled={submitting}
        className="w-full inline-flex items-center justify-center font-body font-semibold bg-amber text-white hover:bg-amber-light disabled:opacity-60 transition-colors duration-200 rounded-full px-8 py-3"
      >
        {submitting ? 'Sending...' : 'Show me my number'}
      </button>
      <p className="font-body text-xs text-text-light text-center mt-5">
        I will follow up with one personal note. No newsletter, no drip sequence. You can ask for your data to be deleted at any time.
      </p>
    </form>
  );
}
