import { motion } from 'motion/react';
import { WORK_EXPERIENCE } from '../../data';
import { SpotlightCard } from '../ui/Spotlight';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function WorkExperience() {
  if (WORK_EXPERIENCE.length === 0) return null;

  return (
    <section className="mb-10">
      <h3 className="mb-5 text-sm font-medium text-zinc-900 dark:text-zinc-100">Work Experience</h3>
      <motion.div
        className="flex flex-col gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {WORK_EXPERIENCE.map((job) => (
          <motion.div key={job.id} variants={itemVariants}>
            <SpotlightCard className="rounded-xl px-4 py-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{job.title}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-2 hover:underline"
                    >
                      {job.company}
                    </a>
                    {job.location && (
                      <span className="text-zinc-400 dark:text-zinc-500">
                        {' · '}{job.location}
                      </span>
                    )}
                  </p>
                  {job.description && (
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {job.description}
                    </p>
                  )}
                </div>
                <span className="shrink-0 whitespace-nowrap text-xs tabular-nums text-zinc-400 dark:text-zinc-500 pt-0.5">
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
