import { AnimatePresence, motion, type Transition } from 'motion/react';
import React, { useCallback, useId, useState } from 'react';
import { cn } from '../../lib/utils';

type AnimatedBackgroundProps = {
  children:
    | React.ReactElement<{ 'data-id': string }>
    | React.ReactElement<{ 'data-id': string }>[];
  defaultValue?: string;
  onValueChange?: (newActiveId: string | null) => void;
  className?: string;
  transition?: Transition;
  enableHover?: boolean;
};

export function AnimatedBackground({
  children,
  defaultValue,
  onValueChange,
  className,
  transition = { type: 'spring', bounce: 0, duration: 0.3 },
  enableHover = false,
}: AnimatedBackgroundProps) {
  const [activeId, setActiveId] = useState<string | null>(defaultValue ?? null);
  const uniqueId = useId();

  const handleSetActiveId = useCallback(
    (id: string | null) => {
      setActiveId(id);
      onValueChange?.(id);
    },
    [onValueChange]
  );

  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        const id = child.props['data-id'];
        const isActive = activeId === id;

        return React.cloneElement(
          child as React.ReactElement<{
            'data-id': string;
            onClick?: () => void;
            onMouseEnter?: () => void;
            onMouseLeave?: () => void;
            className?: string;
            children?: React.ReactNode;
          }>,
          {
            onClick: () => {
              if (!enableHover) handleSetActiveId(id);
            },
            onMouseEnter: () => {
              if (enableHover) handleSetActiveId(id);
            },
            onMouseLeave: () => {
              if (enableHover) handleSetActiveId(null);
            },
            className: cn(child.props.className, 'relative'),
            children: (
              <>
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      layoutId={`background-${uniqueId}`}
                      className={cn('absolute inset-0 rounded-lg', className)}
                      transition={transition}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10">{child.props.children}</span>
              </>
            ),
          }
        );
      })}
    </div>
  );
}
