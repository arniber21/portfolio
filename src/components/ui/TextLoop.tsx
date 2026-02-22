import {
  AnimatePresence,
  motion,
  type Transition,
  type Variants,
} from 'motion/react';
import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

type TextLoopProps = {
  children: React.ReactNode[];
  className?: string;
  interval?: number;
  transition?: Transition;
  variants?: Variants;
  onIndexChange?: (index: number) => void;
};

export function TextLoop({
  children,
  className,
  interval = 2000,
  transition = { duration: 0.3 },
  variants,
  onIndexChange,
}: TextLoopProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % React.Children.count(children);
        onIndexChange?.(next);
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [children, interval, onIndexChange]);

  const motionVariants: Variants = variants ?? {
    initial: { y: 20, opacity: 0, filter: 'blur(4px)' },
    animate: { y: 0, opacity: 1, filter: 'blur(0px)' },
    exit: { y: -20, opacity: 0, filter: 'blur(4px)' },
  };

  return (
    <span className={cn('relative inline-flex overflow-hidden', className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={currentIndex}
          variants={motionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
        >
          {React.Children.toArray(children)[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
