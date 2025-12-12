"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type HeroBannerProps = {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
};

export function HeroBanner({
  title = "Discover apps you'll actually use",
  subtitle = "Hand picked for you",
  ctaText = "Browse charts",
  ctaHref = "/?section=top-charts"
}: HeroBannerProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    // Reduce to 8 particles instead of 20
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 1.5,
    }));
    setParticles(newParticles);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  return (
    <section className="relative rounded-2xl p-8 shadow-sm overflow-hidden">
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: "linear-gradient(120deg, #e3f2fd, #ffffff, #e8f5e9, #f3e5f5, #e3f2fd)",
          backgroundSize: "300% 300%",
          animation: "gradientShift 15s ease infinite",
        }}
      />

      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-primary-blue rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={prefersReducedMotion ? { opacity: 0.5 } : {
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={prefersReducedMotion ? {} : {
              duration: 3,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between z-10">
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            animate={prefersReducedMotion ? {} : {
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={prefersReducedMotion ? {} : {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="h-6 w-6 text-primary" />
          </motion.div>
          <div>
            <motion.p
              className="text-sm font-medium text-ink-secondary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {subtitle}
            </motion.p>
            <motion.h2
              className="text-2xl font-normal text-ink"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {title}
            </motion.h2>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          <Link
            href={ctaHref}
            className="group inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-white hover:shadow-md"
          >
            {ctaText}
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
