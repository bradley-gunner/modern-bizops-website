"use client";

import { useState } from "react";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics";

const VIDEO_ID = "M241NEC30D4";

// `className` owns the outer spacing. It defaulted to a baked-in mb-10, which
// was right while the only two callers were mid-page blocks. The homepage hero
// puts this in a two-column grid where a 40px bottom margin misaligns it
// against the column beside it, so the margin became the caller's business.
export default function VSSLPlayer({
  ctaLocation = "watch_hero",
  className = "mb-10",
}) {
  const [playing, setPlaying] = useState(false);

  // The facade click is the only play signal this component can see. Once the
  // iframe mounts the video belongs to YouTube and reports nothing back without
  // the IFrame Player API. So this measures intent to watch, not watch time.
  // Retention for this video already lives in YouTube Studio, which has the
  // real drop-off curve; shipping a worse copy of it here would be the wrong
  // trade.
  //
  // It cannot double-count: the button unmounts the moment `playing` flips, so
  // there is no guard to write.
  //
  // The param is `cta_location` rather than a new `video_*` param, deliberately.
  // cta_location is already registered as a GA4 custom dimension, and an
  // UNREGISTERED event param is not queryable through the GA4 Data API (only
  // DebugView and Realtime) — which is exactly what the dashboard and the
  // weekly brief pull from. A `video_location` param would look correct in
  // DebugView and come back empty in every report. Event NAMES need no
  // registration, so `video_start` itself is queryable straight away. If a
  // second video is ever added, register a `video_id` dimension in GA4 BEFORE
  // emitting it, for the same reason.
  function handlePlay() {
    trackEvent("video_start", { cta_location: ctaLocation });
    setPlaying(true);
  }

  if (playing) {
    return (
      <div
        className={`aspect-video rounded-[14px] overflow-hidden shadow-lg ${className}`}
      >
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
      onClick={handlePlay}
      className={`relative w-full aspect-video rounded-[14px] overflow-hidden shadow-lg cursor-pointer group block ${className}`}
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
