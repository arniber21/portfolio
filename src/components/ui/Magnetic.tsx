import { motion, useMotionValue, useSpring } from 'motion/react';
import React, { useCallback, useRef } from 'react';

type MagneticProps = {
  children: React.ReactNode;
  intensity?: number;
  range?: number;
  className?: string;
  springOptions?: { stiffness?: number; damping?: number; mass?: number };
};

export function Magnetic({
  children,
  intensity = 0.6,
  range = 100,
  className,
  springOptions = { stiffness: 150, damping: 15, mass: 0.1 },
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springOptions);
  const springY = useSpring(y, springOptions);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const dist = Math.sqrt(distX ** 2 + distY ** 2);

      if (dist < range) {
        x.set(distX * intensity);
        y.set(distY * intensity);
      }
    },
    [intensity, range, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
