"use client";

import { useState } from "react";
import Image from "next/image";

const VIDEO_ID = "M241NEC30D4";

export default function VSSLPlayer() {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="aspect-video rounded-[14px] overflow-hidden mb-10 shadow-lg">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1&color=white`}
          title="Why AI Automation Fails for Small and Mid-Sized Businesses"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="relative w-full aspect-video rounded-[14px] overflow-hidden mb-10 shadow-lg cursor-pointer group block"
      aria-label="Play: Why AI Automation Fails for Small and Mid-Sized Businesses"
    >
      <Image
        src="/og/watch-poster.png"
        alt="Bradley de Wet on camera, beside the title Why AI automation fails"
        fill
        sizes="(max-width: 768px) 100vw, 900px"
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-navy/30 group-hover:bg-navy/40 transition-colors duration-200">
        {/* Sized as a share of the poster, not a fixed 80px. The thumbnail
            leaves a deliberate gap between its text block and Bradley's face,
            and a fixed circle ate both ends of that gap once the poster
            dropped to phone width. 9% is the desktop size (80px of 900px);
            the floor keeps it clear of the text at 320px. */}
        <div className="w-[9%] min-w-[34px] max-w-[80px] aspect-square bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-200">
          <svg
            className="w-[40%] h-[40%] text-amber ml-[5%]"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
}
