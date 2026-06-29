"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import { Award, Users, Flame, Hourglass } from "lucide-react";

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
}

interface HomeStatItem {
  key: string;
  label: string;
  value: number;
  suffix: string;
  sortOrder: number;
  isActive: boolean;
}

const DEFAULT_STATS: HomeStatItem[] = [
  { key: "events-completed", label: "Events Completed", value: 100, suffix: "+", sortOrder: 1, isActive: true },
  { key: "happy-clients", label: "Happy Clients", value: 500, suffix: "+", sortOrder: 2, isActive: true },
  { key: "premium-fire-shows", label: "Premium Fire Shows", value: 50, suffix: "+", sortOrder: 3, isActive: true },
  { key: "years-experience", label: "Years Experience", value: 5, suffix: "+", sortOrder: 4, isActive: true },
];

function getStatIcon(stat: HomeStatItem) {
  const key = `${stat.key} ${stat.label}`.toLowerCase();
  if (key.includes("client")) return <Users className="w-6 h-6" />;
  if (key.includes("fire") || key.includes("pyro")) return <Flame className="w-6 h-6" />;
  if (key.includes("year") || key.includes("experience")) return <Hourglass className="w-6 h-6" />;
  return <Award className="w-6 h-6" />;
}

function StatItem({ icon, value, suffix, label }: StatItemProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 2000; // 2 seconds
    const increment = end / (duration / 16); // ~60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center p-8 rounded-2xl glass-panel glass-panel-hover text-center transition-all duration-300"
    >
      <div className="p-4 rounded-full bg-gold/5 border border-gold/20 text-gold mb-4">
        {icon}
      </div>
      <span className="font-serif text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
        {count}
        <span className="text-gold">{suffix}</span>
      </span>
      <span className="text-white/60 text-xs sm:text-sm uppercase tracking-widest font-semibold mt-2">
        {label}
      </span>
    </div>
  );
}

export default function StatsCounter() {
  const [stats, setStats] = useState<HomeStatItem[]>(DEFAULT_STATS);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/home-stats");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setStats(json.data);
        }
      } catch (err) {
        console.error("Failed to load home stats", err);
      }
    }

    fetchStats();
  }, []);

  return (
    <section className="py-20 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat) => (
            <StatItem
              key={stat.key}
              icon={getStatIcon(stat)}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
