"use client";

import { useState } from "react";

const VIDEO_ID = "4fVPWZ8MNEg";

export default function VSSLPlayer() {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="aspect-video rounded-[14px] overflow-hidden mb-10 shadow-lg">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1&color=white`}
          title="How $3M-$15M Founders Grow Revenue Without Growing Headcount"
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
      aria-label="Play: How $3M-$15M Founders Grow Revenue Without Growing Headcount"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
        alt="Video thumbnail: How $3M-$15M Founders Grow Revenue Without Growing Headcount"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-navy/30 group-hover:bg-navy/40 transition-colors duration-200">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-200">
          <svg
            className="w-8 h-8 text-amber ml-1"
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
