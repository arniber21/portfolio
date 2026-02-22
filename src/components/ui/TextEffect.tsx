import {
  AnimatePresence,
  motion,
  type Transition,
  type Variants,
} from 'motion/react';
import React, { type ElementType } from 'react';
import { cn } from '../../lib/utils';

type PresetType = 'blur' | 'fade-in-blur' | 'scale' | 'fade' | 'slide';
type PerType = 'word' | 'char' | 'line';

type TextEffectProps = {
  children: React.ReactNode;
  per?: PerType;
  as?: ElementType;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  className?: string;
  preset?: PresetType;
  delay?: number;
  trigger?: boolean;
  onAnimationComplete?: () => void;
  onAnimationStart?: () => void;
  speedReveal?: number;
  speedSegment?: number;
};

const defaultStaggerTimes: Record<PerType, number> = {
  char: 0.03,
  word: 0.05,
  line: 0.1,
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const presetVariants: Record<
  PresetType,
  { container: Variants; item: Variants }
> = {
  blur: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(12px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, filter: 'blur(12px)' },
    },
  },
  'fade-in-blur': {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20, filter: 'blur(12px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
      exit: { opacity: 0, y: 20, filter: 'blur(12px)' },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0 },
    },
  },
  fade: {
    container: defaultContainerVariants,
    item: defaultItemVariants,
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  },
};

function splitIntoSegments(text: string, per: PerType): string[] {
  if (per === 'line') return text.split('\n');
  if (per === 'word') return text.split(/(\s+)/);
  return text.split('');
}

function normalizeText(children: React.ReactNode): string {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return String(child);
      }
      return '';
    })
    .join('');
}

export function TextEffect({
  children,
  per = 'word',
  as: Tag = 'p',
  variants,
  className,
  preset = 'fade',
  delay = 0,
  trigger = true,
  onAnimationComplete,
  onAnimationStart,
  speedReveal = 1,
  speedSegment = 1,
}: TextEffectProps) {
  const selectedVariants = presetVariants[preset];
  const containerVariants = variants?.container ?? selectedVariants.container;
  const itemVariants = variants?.item ?? selectedVariants.item;

  const staggerTime =
    (defaultStaggerTimes[per] / speedReveal) * (per === 'char' ? speedSegment : 1);

  const modifiedContainerVariants: Variants = {
    ...containerVariants,
    visible: {
      ...((containerVariants.visible as object) ?? {}),
      transition: {
        ...(typeof containerVariants.visible === 'object' &&
        containerVariants.visible !== null &&
        'transition' in containerVariants.visible
          ? (containerVariants.visible as { transition?: Transition }).transition
          : {}),
        staggerChildren: staggerTime,
        delayChildren: delay,
      },
    },
  };

  const text = normalizeText(children);
  const segments = splitIntoSegments(text, per);
  const MotionTag = motion.create(Tag as keyof JSX.IntrinsicElements);

  return (
    <AnimatePresence mode="popLayout">
      {trigger && (
        <MotionTag
          className={cn('whitespace-pre-wrap', className)}
          variants={modifiedContainerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onAnimationComplete={onAnimationComplete}
          onAnimationStart={onAnimationStart}
        >
          {segments.map((segment, index) => (
            <motion.span
              key={`${per}-${index}-${segment}`}
              variants={itemVariants}
              className={per === 'line' ? 'block' : 'inline-block'}
            >
              {segment === ' ' ? '\u00A0' : segment}
            </motion.span>
          ))}
        </MotionTag>
      )}
    </AnimatePresence>
  );
}
