"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

type AnimatedLoaderProps = {
  size?: number;
  className?: string;
};

export function AnimatedLoader({ size = 24, className = "" }: AnimatedLoaderProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      <Loader2
        size={size}
        className="animate-spin text-primary-blue"
      />
    </motion.div>
  );
}
