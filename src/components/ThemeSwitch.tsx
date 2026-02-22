import { Monitor, Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '../lib/utils';

type Theme = 'light' | 'dark' | 'system';

const THEMES: { value: Theme; icon: React.ReactNode; label: string }[] = [
  { value: 'light', icon: <Sun size={12} />, label: 'Light' },
  { value: 'dark', icon: <Moon size={12} />, label: 'Dark' },
  { value: 'system', icon: <Monitor size={12} />, label: 'System' },
];

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem('theme') as Theme) ?? 'system';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  root.classList.toggle('dark', isDark);
  localStorage.setItem('theme', theme);
}

export function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(getStoredTheme());
  }, []);

  const handleChange = useCallback((next: Theme) => {
    setTheme(next);
    applyTheme(next);
  }, []);

  if (!mounted) {
    return <div className="h-7 w-[88px] rounded-full bg-zinc-100 dark:bg-zinc-800" />;
  }

  return (
    <div className="relative flex items-center gap-0.5 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
      {THEMES.map(({ value, icon, label }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            onClick={() => handleChange(value)}
            aria-label={`Switch to ${label} theme`}
            className={cn(
              'relative flex h-5 w-7 items-center justify-center rounded-full text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
              isActive && 'text-zinc-900 dark:text-zinc-100'
            )}
          >
            <AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="theme-indicator"
                  className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-zinc-700"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
            <span className="relative z-10">{icon}</span>
          </button>
        );
      })}
    </div>
  );
}
