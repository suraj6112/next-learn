"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeftRight, HelpCircle } from "lucide-react";

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0-100)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  const onMouseDown = () => setIsDragging(true);

  return (
    <section className="py-24 bg-charcoal border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">Event Transformations</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2">
            The Venue <span className="text-gold gold-glow-text">Metamorphosis</span>
          </h2>
          <p className="text-white/60 text-sm mt-4 font-light leading-relaxed">
            Drag the gold slider bar to see how we transform a raw, empty banquet space into a majestic dreamscape wedding production.
          </p>
        </div>

        {/* Drag Container */}
        <div
          ref={containerRef}
          className="relative aspect-[16/9] w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gold/15 select-none touch-none"
        >
          {/* AFTER Image (Full background) */}
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200"
            alt="After Decor"
            className="absolute inset-0 w-full h-full object-cover"
            draggable="false"
          />
          <div className="absolute top-4 right-4 bg-gold/90 text-black px-3 py-1 rounded font-bold text-xs uppercase z-10 shadow">
            After: Dream Wedding Production
          </div>

          {/* BEFORE Image (Clipped container width) */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src="https://images.unsplash.com/photo-1505232458627-539696144064?auto=format&fit=crop&q=80&w=1200"
              alt="Before Empty Space"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ width: containerRef.current?.getBoundingClientRect().width }}
              draggable="false"
            />
            <div className="absolute top-4 left-4 bg-white/90 text-black px-3 py-1 rounded font-bold text-xs uppercase z-10 shadow">
              Before: Raw Empty Venue
            </div>
          </div>

          {/* Slider line & handle */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-gold cursor-ew-resize z-20"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={onMouseDown}
            onTouchStart={onMouseDown}
          >
            {/* Draggable gold coin handle */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gold hover:bg-gold-hover border-4 border-black text-black flex items-center justify-center shadow-lg transition-colors duration-200 pointer-events-none">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-2 mt-8 text-white/50 text-xs">
          <HelpCircle className="w-4 h-4 text-gold" />
          <span>Interactive Slider: Drag left/right to witness the magic.</span>
        </div>
      </div>
    </section>
  );
}
