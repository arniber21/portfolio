import {
  AnimatePresence,
  motion,
  type MotionProps,
  type Transition,
  type Variants,
} from 'motion/react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useClickOutside } from '../../hooks/useClickOutside';
import { cn } from '../../lib/utils';

type MorphingDialogContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  uniqueId: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
};

const MorphingDialogContext = createContext<MorphingDialogContextType | null>(null);

function useMorphingDialog() {
  const ctx = useContext(MorphingDialogContext);
  if (!ctx) throw new Error('useMorphingDialog must be used within MorphingDialog');
  return ctx;
}

// Root
type MorphingDialogProps = {
  children: React.ReactNode;
  transition?: Transition;
};

export function MorphingDialog({ children, transition }: MorphingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <MorphingDialogContext.Provider value={{ isOpen, setIsOpen, uniqueId, triggerRef }}>
      {children}
    </MorphingDialogContext.Provider>
  );
}

// Trigger
type MorphingDialogTriggerProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
} & MotionProps;

export function MorphingDialogTrigger({
  children,
  className,
  style,
  ...motionProps
}: MorphingDialogTriggerProps) {
  const { setIsOpen, uniqueId, triggerRef } = useMorphingDialog();

  return (
    <motion.div
      ref={triggerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn('cursor-pointer', className)}
      style={style}
      onClick={() => setIsOpen(true)}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

// Content
type MorphingDialogContentProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function MorphingDialogContent({
  children,
  className,
  style,
}: MorphingDialogContentProps) {
  const { isOpen, setIsOpen, uniqueId } = useMorphingDialog();
  const contentRef = useRef<HTMLDivElement>(null);
  useClickOutside(contentRef, () => setIsOpen(false));

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              ref={contentRef}
              layoutId={`dialog-${uniqueId}`}
              className={cn(
                'w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900',
                className
              )}
              style={style}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

// Close
type MorphingDialogCloseProps = {
  children: React.ReactNode;
  className?: string;
};

export function MorphingDialogClose({ children, className }: MorphingDialogCloseProps) {
  const { setIsOpen } = useMorphingDialog();
  return (
    <button
      className={cn('cursor-pointer', className)}
      onClick={() => setIsOpen(false)}
      aria-label="Close dialog"
    >
      {children}
    </button>
  );
}

// Title / Description passthroughs
type MorphingDialogTitleProps = {
  children: React.ReactNode;
  className?: string;
} & MotionProps;

export function MorphingDialogTitle({
  children,
  className,
  ...motionProps
}: MorphingDialogTitleProps) {
  const { uniqueId } = useMorphingDialog();
  return (
    <motion.div
      layoutId={`dialog-title-${uniqueId}`}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

type MorphingDialogDescriptionProps = {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  disableLayoutAnimation?: boolean;
} & MotionProps;

export function MorphingDialogDescription({
  children,
  className,
  variants,
  disableLayoutAnimation,
  ...motionProps
}: MorphingDialogDescriptionProps) {
  const { uniqueId } = useMorphingDialog();
  return (
    <motion.div
      layoutId={disableLayoutAnimation ? undefined : `dialog-desc-${uniqueId}`}
      className={className}
      variants={variants}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

// Image
type MorphingDialogImageProps = {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
} & MotionProps;

export function MorphingDialogImage({
  src,
  alt,
  className,
  style,
  ...motionProps
}: MorphingDialogImageProps) {
  const { uniqueId } = useMorphingDialog();
  return (
    <motion.img
      layoutId={`dialog-img-${uniqueId}`}
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...motionProps}
    />
  );
}
