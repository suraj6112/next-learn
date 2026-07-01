"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUp, Heart, Play, Share2, Volume2, VolumeX, X } from "lucide-react";
import Link from "next/link";

interface ReelItem {
  id: string;
  videoUrl: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  likes: string;
}

interface CmsReelItem {
  _id: string;
  title: string;
  category: string;
  subcategory?: string;
  description?: string;
  cloudinaryUrl: string;
}

export default function ReelsSection() {
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [muted, setMuted] = useState(true);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const viewerVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const viewerSlideRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const viewerContainerRef = useRef<HTMLDivElement | null>(null);
  const isViewerOpen = viewerIndex !== null;

  useEffect(() => {
    async function fetchReels() {
      try {
        const res = await fetch("/api/gallery?reels=true&showOnHome=true");
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setReels(
            (json.data as CmsReelItem[]).slice(0, 6).map((item, index) => ({
              id: item._id,
              videoUrl: item.cloudinaryUrl,
              title: item.title,
              description: item.description || `${item.category}${item.subcategory ? ` / ${item.subcategory}` : ""}`,
              category: item.category,
              subcategory: item.subcategory,
              likes: `${Math.max(1, index + 2)}.${index + 3}K`,
            }))
          );
          return;
        }

      } catch (err) {
        console.error("Failed to load dynamic reels", err);
      }
    }
    fetchReels();
  }, []);

  const reelFilters = useMemo(() => {
    const labels = reels.map((item) => item.subcategory || item.category).filter(Boolean);
    return ["All", ...Array.from(new Set(labels)).slice(0, 8)];
  }, [reels]);

  const visibleReels = useMemo(
    () => selectedFilter === "All"
      ? reels.slice(0, 6)
      : reels.filter((item) => (item.subcategory || item.category) === selectedFilter).slice(0, 6),
    [reels, selectedFilter]
  );

  const toggleMute = () => {
    setMuted(!muted);
    [...Object.values(videoRefs.current), ...Object.values(viewerVideoRefs.current)].forEach((video) => {
      if (video) {
        video.muted = !muted;
      }
    });
  };

  const toggleLike = (id: string) => {
    setLikedReels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleViewerPlayback = (id: string) => {
    const video = viewerVideoRefs.current[id];
    if (video) {
      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  };

  const openViewer = (index: number) => {
    Object.values(videoRefs.current).forEach((video) => video?.pause());
    setViewerIndex(index);
  };

  const closeViewer = useCallback(() => {
    Object.values(viewerVideoRefs.current).forEach((video) => video?.pause());
    setViewerIndex(null);
  }, []);

  const scrollViewerTo = useCallback((index: number) => {
    const nextIndex = Math.max(0, Math.min(visibleReels.length - 1, index));
    const reel = visibleReels[nextIndex];
    if (!reel) return;
    viewerSlideRefs.current[reel.id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setViewerIndex(nextIndex);
  }, [visibleReels]);

  const shareReel = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Website link copied to share this reel!");
    } catch {
      alert("Copy failed. Please copy the website link manually.");
    }
  };

  const chooseFilter = (label: string) => {
    setSelectedFilter(label);
    setViewerIndex(null);
    Object.values(videoRefs.current).forEach((video) => video?.pause());
    Object.values(viewerVideoRefs.current).forEach((video) => video?.pause());
  };

  useEffect(() => {
    if (!isViewerOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isViewerOpen]);

  useEffect(() => {
    if (viewerIndex === null) return;
    const reel = visibleReels[viewerIndex];
    if (!reel) return;

    const frameId = window.requestAnimationFrame(() => {
      viewerSlideRefs.current[reel.id]?.scrollIntoView({ block: "start" });
      Object.entries(viewerVideoRefs.current).forEach(([id, video]) => {
        if (!video) return;
        video.muted = muted;
        if (id === reel.id) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [muted, visibleReels, viewerIndex]);

  useEffect(() => {
    if (!isViewerOpen || !viewerContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries.find((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.6);
        const activeId = activeEntry?.target.getAttribute("data-reel-id");
        if (!activeId) return;

        const nextIndex = visibleReels.findIndex((reel) => reel.id === activeId);
        if (nextIndex === -1) return;

        setViewerIndex((current) => (current === nextIndex ? current : nextIndex));
      },
      { root: viewerContainerRef.current, threshold: [0.6] }
    );

    visibleReels.forEach((reel) => {
      const slide = viewerSlideRefs.current[reel.id];
      if (slide) observer.observe(slide);
    });

    return () => observer.disconnect();
  }, [isViewerOpen, visibleReels]);

  useEffect(() => {
    if (!isViewerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowDown") scrollViewerTo((viewerIndex ?? 0) + 1);
      if (event.key === "ArrowUp") scrollViewerTo((viewerIndex ?? 0) - 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeViewer, isViewerOpen, scrollViewerTo, viewerIndex]);

  if (reels.length === 0 || visibleReels.length === 0) return null;

  return (
    <section className="py-24 bg-black border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-gold uppercase">Cinematic Reels</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2">
              Reels by <span className="text-gold gold-glow-text">Function</span>
            </h2>
          </div>
          <Link
            href="/gallery"
            className="flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-hover transition-colors group"
          >
            Explore Complete Video Gallery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {reelFilters.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {reelFilters.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => chooseFilter(label)}
                className={`rounded-md border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors clickable ${
                  selectedFilter === label
                    ? "border-gold bg-gold text-black"
                    : "border-white/10 bg-charcoal text-white/70 hover:border-gold/30 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Global Sound Control */}
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleMute}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold/5 text-xs text-gold font-bold hover:bg-gold/10 transition-colors clickable"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{muted ? "Unmute All Reels" : "Mute Reels"}</span>
          </button>
        </div>

        {/* Vertical Reels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {visibleReels.map((reel, index) => {
            const isLiked = !!likedReels[reel.id];
            return (
              <div
                key={reel.id}
                className="relative aspect-[9/16] max-w-[360px] mx-auto w-full rounded-2xl overflow-hidden glass-panel group transition-transform duration-300 hover:scale-[1.02]"
              >
                {/* Loop Video */}
                <video
                  ref={(el) => {
                    videoRefs.current[reel.id] = el;
                  }}
                  src={reel.videoUrl}
                  loop
                  muted={muted}
                  playsInline
                  autoPlay
                  onClick={() => openViewer(index)}
                  className="w-full h-full object-cover cursor-pointer"
                />

                {/* Video Play Overlay indicator */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

                {/* Hover Play Button Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="p-4 rounded-full bg-black/60 border border-gold/30 text-gold backdrop-blur-sm">
                    <Play className="w-6 h-6 fill-gold" />
                  </div>
                </div>

                {/* Left Side Reel Info (Bottom) */}
                <div className="absolute bottom-0 left-0 w-[80%] p-6 flex flex-col gap-2 pointer-events-none">
                  <h3 className="text-white text-base font-bold tracking-wide">{reel.title}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                    {reel.subcategory || reel.category}
                  </span>
                  <p className="text-white/70 text-xs font-light line-clamp-2">{reel.description}</p>
                </div>

                {/* Right Side Control Buttons */}
                <div className="absolute bottom-6 right-4 flex flex-col items-center gap-5 z-10">
                  {/* Like Button */}
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleLike(reel.id);
                    }}
                    className="flex flex-col items-center gap-1 group clickable"
                  >
                    <div
                      className={`p-3 rounded-full border backdrop-blur-md transition-all duration-300 ${
                        isLiked
                          ? "bg-red-500/20 border-red-500 text-red-500 scale-110"
                          : "bg-black/40 border-white/10 text-white hover:border-gold hover:text-gold"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500" : ""}`} />
                    </div>
                    <span className="text-[10px] text-white/80 font-semibold">{reel.likes}</span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      void shareReel();
                    }}
                    className="flex flex-col items-center gap-1 clickable"
                  >
                    <div className="p-3 rounded-full bg-black/40 border border-white/10 text-white hover:border-gold hover:text-gold backdrop-blur-md transition-colors">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-white/80 font-semibold">Share</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isViewerOpen && (
        <div className="fixed inset-0 z-[100] bg-black text-white">
          <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between gap-3 bg-gradient-to-b from-black/80 to-transparent px-4 py-4 sm:px-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Cinematic Reels</span>
              <p className="text-xs text-white/60">Swipe up/down to explore</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition-colors hover:border-gold hover:text-gold clickable"
                aria-label={muted ? "Unmute reel" : "Mute reel"}
              >
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <button
                onClick={closeViewer}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition-colors hover:border-gold hover:text-gold clickable"
                aria-label="Close reel viewer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            ref={viewerContainerRef}
            className="h-dvh snap-y snap-mandatory overflow-y-auto overscroll-contain scroll-smooth"
          >
            {visibleReels.map((reel, index) => {
              const isLiked = !!likedReels[reel.id];
              return (
                <div
                  key={reel.id}
                  ref={(el) => {
                    viewerSlideRefs.current[reel.id] = el;
                  }}
                  data-reel-id={reel.id}
                  className="relative flex h-dvh snap-start snap-always items-center justify-center bg-black px-0 sm:px-6"
                >
                  <div className="relative h-dvh w-full overflow-hidden bg-black sm:h-[92dvh] sm:max-w-[520px] sm:rounded-lg sm:border sm:border-white/10">
                    <video
                      ref={(el) => {
                        viewerVideoRefs.current[reel.id] = el;
                      }}
                      src={reel.videoUrl}
                      loop
                      muted={muted}
                      playsInline
                      autoPlay={index === viewerIndex}
                      onClick={() => toggleViewerPlayback(reel.id)}
                      className="h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />

                    <div className="absolute bottom-0 left-0 right-20 z-10 p-5 sm:p-6">
                      <h3 className="text-lg font-bold tracking-wide text-white sm:text-xl">{reel.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/70">{reel.description}</p>
                      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-white/45">
                        {index + 1} / {visibleReels.length}
                      </p>
                    </div>

                    <div className="absolute bottom-6 right-4 z-20 flex flex-col items-center gap-5">
                      <button
                        onClick={() => toggleLike(reel.id)}
                        className="flex flex-col items-center gap-1 clickable"
                        aria-label="Like reel"
                      >
                        <div
                          className={`rounded-full border p-3 backdrop-blur-md transition-all duration-300 ${
                            isLiked
                              ? "scale-110 border-red-500 bg-red-500/20 text-red-500"
                              : "border-white/10 bg-black/40 text-white hover:border-gold hover:text-gold"
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500" : ""}`} />
                        </div>
                        <span className="text-[10px] font-semibold text-white/80">{reel.likes}</span>
                      </button>

                      <button onClick={() => void shareReel()} className="flex flex-col items-center gap-1 clickable" aria-label="Share reel">
                        <div className="rounded-full border border-white/10 bg-black/40 p-3 text-white backdrop-blur-md transition-colors hover:border-gold hover:text-gold">
                          <Share2 className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-semibold text-white/80">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pointer-events-none absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
            <button
              onClick={() => scrollViewerTo((viewerIndex ?? 0) - 1)}
              disabled={(viewerIndex ?? 0) === 0}
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-30 clickable"
              aria-label="Previous reel"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollViewerTo((viewerIndex ?? 0) + 1)}
              disabled={(viewerIndex ?? 0) === visibleReels.length - 1}
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-30 clickable"
              aria-label="Next reel"
            >
              <ArrowDown className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
