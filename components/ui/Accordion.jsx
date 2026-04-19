"use client";

import { useState } from "react";

function AccordionItem({ question, answer, isOpen, onToggle, index }) {
  const buttonId = `faq-btn-${index}`;
  const panelId = `faq-panel-${index}`;

  return (
    <div className="border-b border-border">
      <h3 className="m-0">
        <button
          id={buttonId}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-center justify-between py-5 text-left"
        >
          <span className="font-body font-semibold text-text-primary text-base pr-4">
            {question}
          </span>
          <svg
            className={`h-5 w-5 shrink-0 text-navy transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!isOpen}
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="font-body text-text-mid leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="rounded-[10px]">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          index={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}
