import { motion } from 'motion/react';
import { WORK_EXPERIENCE } from '../../data';
import { cn } from '../../lib/utils';
import { SpotlightCard } from '../ui/Spotlight';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

type WorkExperienceProps = {
  variant?: 'all' | 'intel' | 'rest';
};

export default function WorkExperience({ variant = 'all' }: WorkExperienceProps) {
  const jobs = WORK_EXPERIENCE.filter((job) => {
    if (variant === 'intel') return job.company === 'Intel';
    if (variant === 'rest') return job.company !== 'Intel';
    return true;
  });

  if (jobs.length === 0) return null;

  return (
    <section className="section-stack">
      <p className="editorial-kicker mb-5">
        {variant === 'intel' ? 'Current Work' : 'Professional'}
      </p>
      <motion.div
        className="flex flex-col gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {jobs.map((job) => (
          <motion.div key={job.id} variants={itemVariants}>
            <SpotlightCard
              className={cn(
                'rounded-xl border border-zinc-200/85 px-4 py-3 dark:border-zinc-700/70',
                job.accent === 'baby-blue' &&
                  'border-sky-200/90 bg-sky-50/40 [--spotlight-color:rgba(125,211,252,0.24)] dark:border-sky-400/35 dark:bg-sky-950/20 dark:[--spotlight-color:rgba(56,189,248,0.18)]'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <a
                    href={`/work/${job.detailsSlug}`}
                    className={cn(
                      'editorial-link text-sm font-medium text-zinc-900 dark:text-zinc-100',
                      job.accent === 'baby-blue' &&
                        'decoration-sky-300 hover:text-sky-700 hover:decoration-sky-500 dark:hover:text-sky-200'
                    )}
                  >
                    {job.title}
                  </a>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {job.company}
                    {job.location && (
                      <span className="meta-italic text-zinc-400 dark:text-zinc-500">
                        {' · '}{job.location}
                      </span>
                    )}
                  </p>
                  {job.description && (
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {job.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-4">
                    <a
                      href={`/work/${job.detailsSlug}`}
                      className="editorial-link text-xs font-medium text-zinc-700 dark:text-zinc-300 dark:hover:text-zinc-100"
                    >
                      Read details →
                    </a>
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-link text-xs text-zinc-500 dark:text-zinc-400"
                    >
                      Company site →
                    </a>
                  </div>
                </div>
                <span className="meta-italic shrink-0 whitespace-nowrap text-xs tabular-nums text-zinc-400 dark:text-zinc-500 pt-0.5">
                  {job.start} – {job.end}
                </span>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
