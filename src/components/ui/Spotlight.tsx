import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react';
import React, { useCallback, useRef } from 'react';
import { cn } from '../../lib/utils';

type SpotlightProps = {
  className?: string;
  size?: number;
  springOptions?: { stiffness?: number; damping?: number; mass?: number };
};

export function Spotlight({
  className,
  size = 200,
  springOptions = { stiffness: 300, damping: 30 },
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-size);
  const mouseY = useMotionValue(-size);
  const isHovered = useRef(false);

  const springX = useSpring(mouseX, springOptions);
  const springY = useSpring(mouseY, springOptions);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const handleMouseEnter = useCallback(() => {
    isHovered.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHovered.current = false;
    mouseX.set(-size);
    mouseY.set(-size);
  }, [mouseX, mouseY, size]);

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${springX}px ${springY}px, var(--spotlight-color, rgba(120,120,120,0.12)), transparent 80%)`;

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
        style={{ background }}
      />
      {/* children are rendered by the parent, this is just the glow layer */}
    </div>
  );
}

// Wrapper that applies spotlight to its children
type SpotlightCardProps = {
  children: React.ReactNode;
  className?: string;
  spotlightSize?: number;
};

export function SpotlightCard({ children, className, spotlightSize = 200 }: SpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-spotlightSize);
  const mouseY = useMotionValue(-spotlightSize);

  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(-spotlightSize);
    mouseY.set(-spotlightSize);
  }, [mouseX, mouseY, spotlightSize]);

  const background = useMotionTemplate`radial-gradient(${spotlightSize}px circle at ${springX}px ${springY}px, rgba(120,120,120,0.1), transparent 80%)`;

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{ background }}
      />
      {children}
    </div>
  );
}
