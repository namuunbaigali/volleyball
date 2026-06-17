'use client';

import { useEffect } from 'react';
import { useMotionValue, useTransform, animate, motion } from 'framer-motion';

export default function AnimatedCounter({
  value,
  duration = 1.2,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration, ease: 'easeOut' });
    return () => controls.stop();
  }, [value, duration, count]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
