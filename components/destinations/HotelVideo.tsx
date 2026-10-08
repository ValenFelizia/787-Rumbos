"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { Play } from "lucide-react";

export type HotelVideoProps = {
  /** Public URL of the mp4/webm. Required to render anything. */
  videoUrl?: string | null;
  /** Poster image URL. Required together with videoUrl for a valid CMS row. */
  posterUrl?: string | null;
  hotelName?: string | null;
  caption?: string | null;
  destinationName: string;
  /**
   * When true, the poster uses priority fetch (above the fold).
   * Default false → lazy via next/image.
   */
  priority?: boolean;
};

/** Pure guard: nothing in the DOM unless a video file URL exists. */
export function shouldShowHotelVideo(props: Pick<HotelVideoProps, "videoUrl">): boolean {
  return typeof props.videoUrl === "string" && props.videoUrl.trim() !== "";
}

/**
 * Tap-to-play hotel clip. Mounts `<video>` only after the visitor taps play
 * so zero video bytes download beforehand. Fixed 16/9 box → CLS = 0.
 * No autoplay attribute; playback starts from the user gesture via play().
 */
export function HotelVideo({
  videoUrl,
  posterUrl,
  hotelName,
  caption,
  destinationName,
  priority = false,
}: HotelVideoProps) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!playing) return;
    const node = videoRef.current;
    if (!node) return;
    // User already tapped; start playback without an autoplay attribute.
    void node.play().catch(() => {
      // Autoplay policies can still block; controls remain available.
    });
  }, [playing]);

  if (!shouldShowHotelVideo({ videoUrl })) return null;

  const poster = typeof posterUrl === "string" && posterUrl.trim() !== "" ? posterUrl : null;
  // CMS requires a poster when a video is set; without one we still avoid
  // mounting a broken player, and never show an empty poster placeholder.
  if (!poster) return null;

  const label = hotelName?.trim()
    ? `Video del hotel ${hotelName.trim()} en ${destinationName}`
    : `Video del hotel en ${destinationName}`;

  return (
    <div className="space-y-3">
      <h3
        id={titleId}
        className="font-[family-name:var(--font-brand-heading)] text-xl font-bold tracking-tight"
      >
        {hotelName?.trim() ? hotelName.trim() : "Video del hotel"}
      </h3>

      <div
        className="relative w-full overflow-hidden rounded-2xl border border-[#0b4058]/10 bg-[#0b4058]/5 shadow-sm"
        style={{ aspectRatio: "16 / 9" }}
      >
        {playing ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={videoUrl!}
            controls
            playsInline
            preload="none"
            poster={poster}
            aria-labelledby={titleId}
          />
        ) : (
          <>
            <Image
              src={poster}
              alt={label}
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover"
              priority={priority}
            />
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-[#0b4058]/25 transition-colors hover:bg-[#0b4058]/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dae553]"
              aria-label={`Reproducir ${label}`}
            >
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-[#0b4058] shadow-md transition-transform duration-200 hover:scale-105">
                <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" aria-hidden />
              </span>
            </button>
          </>
        )}
      </div>

      {caption?.trim() ? (
        <p className="text-sm text-[#0b4058]/75 leading-relaxed text-pretty">{caption.trim()}</p>
      ) : null}
    </div>
  );
}
