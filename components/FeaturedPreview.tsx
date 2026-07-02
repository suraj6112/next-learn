"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Play, Volume2, VolumeX, X } from "lucide-react";
import VideoWithLoader from "@/components/VideoWithLoader";

interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  subcategory?: string;
  mediaType: "image" | "video";
  cloudinaryUrl: string;
  thumbnail?: string;
}

export default function FeaturedPreview() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const slideRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const viewerContainerRef = useRef<HTMLDivElement | null>(null);
  const isViewerOpen = viewerIndex !== null;

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/gallery?featured=true&showOnHome=true");
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setItems(json.data.slice(0, 3));
          return;
        }

      } catch (err) {
        console.error("Failed to load featured gallery", err);
      }
    }
    fetchFeatured();
  }, []);

  const closeViewer = useCallback(() => {
    Object.values(videoRefs.current).forEach((video) => video?.pause());
    setViewerIndex(null);
  }, []);

  const navigateViewer = useCallback(
    (direction: "prev" | "next") => {
      setViewerIndex((current) => {
        if (current === null) return current;
        const nextIndex = direction === "prev" ? current - 1 : current + 1;
        if (nextIndex < 0) return items.length - 1;
        if (nextIndex >= items.length) return 0;
        return nextIndex;
      });
    },
    [items.length]
  );

  const toggleMute = () => {
    setMuted((current) => {
      const nextMuted = !current;
      Object.values(videoRefs.current).forEach((video) => {
        if (video) video.muted = nextMuted;
      });
      return nextMuted;
    });
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
    const activeItem = items[viewerIndex];

    const frameId = window.requestAnimationFrame(() => {
      if (activeItem) {
        slideRefs.current[activeItem._id]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }

      Object.entries(videoRefs.current).forEach(([id, video]) => {
        if (!video) return;
        video.muted = muted;
        if (id === activeItem?._id) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [items, muted, viewerIndex]);

  useEffect(() => {
    if (!isViewerOpen || !viewerContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries.find((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.6);
        const activeId = activeEntry?.target.getAttribute("data-featured-id");
        if (!activeId) return;

        const nextIndex = items.findIndex((item) => item._id === activeId);
        if (nextIndex === -1) return;

        setViewerIndex((current) => (current === nextIndex ? current : nextIndex));
      },
      { root: viewerContainerRef.current, threshold: [0.6] }
    );

    items.forEach((item) => {
      const slide = slideRefs.current[item._id];
      if (slide) observer.observe(slide);
    });

    return () => observer.disconnect();
  }, [isViewerOpen, items]);

  useEffect(() => {
    if (!isViewerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft") navigateViewer("prev");
      if (event.key === "ArrowRight") navigateViewer("next");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeViewer, isViewerOpen, navigateViewer]);

  const currentItem = viewerIndex !== null ? items[viewerIndex] : null;

  if (items.length === 0) return null;

  return (
    <section className="py-24 bg-black border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-gold uppercase">Visual Showroom</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2">
              Featured <span className="text-gold gold-glow-text">Moments</span>
            </h2>
          </div>
          <Link
            href="/gallery"
            className="flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-hover transition-colors group"
          >
            View Full Gallery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={item._id}
              onClick={() => setViewerIndex(index)}
              className="relative aspect-video cursor-pointer rounded-2xl overflow-hidden glass-panel border border-white/5 group transition-all duration-300 hover:scale-[1.02]"
            >
              {item.mediaType === "video" ? (
                <div className="w-full h-full relative">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-black" />
                  )}
                  {/* Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-3 rounded-full bg-black/60 border border-gold/30 text-gold backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-gold" />
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={item.cloudinaryUrl}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                />
              )}

              {/* Gradient info overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 flex flex-col justify-end pointer-events-none">
                <span className="text-[10px] font-bold text-gold uppercase tracking-widest">
                  {item.subcategory ? `${item.category} / ${item.subcategory}` : item.category}
                </span>
                <h3 className="text-white font-bold text-base mt-1 group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isViewerOpen && currentItem && (
        <div className="fixed inset-0 z-[100] bg-black text-white">
          <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between gap-3 bg-gradient-to-b from-black/80 to-transparent px-4 py-4 sm:px-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Visual Showroom</span>
              <p className="text-xs text-white/60">Swipe left/right to explore</p>
            </div>
            <div className="flex items-center gap-2">
              {currentItem.mediaType === "video" && (
                <button
                  onClick={toggleMute}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition-colors hover:border-gold hover:text-gold clickable"
                  aria-label={muted ? "Unmute media" : "Mute media"}
                >
                  {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
              )}
              <button
                onClick={closeViewer}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition-colors hover:border-gold hover:text-gold clickable"
                aria-label="Close featured viewer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            ref={viewerContainerRef}
            className="flex h-dvh snap-x snap-mandatory overflow-x-auto overscroll-contain scroll-smooth"
          >
            {items.map((item, index) => (
              <div
                key={item._id}
                ref={(el) => {
                  slideRefs.current[item._id] = el;
                }}
                data-featured-id={item._id}
                className="relative flex h-dvh w-screen shrink-0 snap-center snap-always items-center justify-center bg-black px-0 sm:px-8"
              >
                <div className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-black sm:h-[86dvh] sm:max-w-6xl sm:rounded-lg sm:border sm:border-white/10">
                  {item.mediaType === "video" ? (
                    <VideoWithLoader
                      ref={(el) => {
                        videoRefs.current[item._id] = el;
                      }}
                      src={item.cloudinaryUrl}
                      loop
                      muted={muted}
                      playsInline
                      autoPlay={index === viewerIndex}
                      controls
                      preload={index === viewerIndex ? "metadata" : "none"}
                      poster={item.thumbnail}
                      wrapperClassName="relative h-full w-full"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <img
                      src={item.cloudinaryUrl}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 sm:p-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
                      {item.subcategory ? `${item.category} / ${item.subcategory}` : item.category}
                    </span>
                    <h3 className="mt-2 max-w-3xl text-lg font-bold text-white sm:text-2xl">{item.title}</h3>
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-white/45">
                      {index + 1} / {items.length}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigateViewer("prev")}
            className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition-colors hover:border-gold hover:text-gold sm:flex clickable"
            aria-label="Previous featured item"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigateViewer("next")}
            className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition-colors hover:border-gold hover:text-gold sm:flex clickable"
            aria-label="Next featured item"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
}
