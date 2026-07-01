"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios";

interface EventItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  mediaUrls: string[];
}

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get("/api/events");
        const json = res.data;
        if (json.success && json.data) {
          setEvents(json.data);
        }
      } catch (err) {
        console.error("Failed to load events", err);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">Case Studies</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white mt-2 leading-tight">
            Our Past <span className="text-gold gold-glow-text">Productions</span>
          </h1>
          <p className="text-white/60 text-sm mt-4 font-light leading-relaxed">
            Take a deep dive into our elite past event case studies. Read how we coordinate choreography, safe fireworks, and production structures to make headlines.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-charcoal border border-white/5 hover:border-gold/25 transition-all duration-300 flex flex-col justify-between group hover:shadow-2xl hover:shadow-gold/5"
            >
              <div>
                {/* Media Image */}
                <div className="relative aspect-video rounded-xl overflow-hidden mb-6 border border-white/5">
                  {event.mediaUrls[0] ? (
                    <img
                      src={event.mediaUrls[0]}
                      alt={event.title}
                      className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-black" />
                  )}
                  <span className="absolute top-3 left-3 bg-black/80 border border-gold/20 text-gold font-semibold uppercase tracking-widest text-[10px] px-3 py-1 rounded-full backdrop-blur-sm">
                    {event.category}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold tracking-wide text-white group-hover:text-gold transition-colors mb-3">
                  {event.title}
                </h3>
                <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  {event.description}
                </p>
              </div>

              <Link
                href={`/contact?eventType=${event.category}&requirement=I want an event production similar to: ${event.title}`}
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gold hover:text-gold-hover transition-colors group/link clickable"
              >
                Inquire For A Setup Like This
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
