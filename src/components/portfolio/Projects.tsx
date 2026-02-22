import { XIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { PROJECTS } from '../../data';
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from '../ui/MorphingDialog';
import { SpotlightCard } from '../ui/Spotlight';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4 } },
};

function externalLinkLabel(link: string) {
  return link.includes('github.com') ? 'GitHub' : 'Website';
}

function TagPills({ tags, awards }: { tags?: string[]; awards?: string[] }) {
  const hasContent = (tags?.length ?? 0) > 0 || (awards?.length ?? 0) > 0;
  if (!hasContent) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {awards?.map((award) => (
        <span
          key={award}
          className="rounded-full border border-amber-200 px-2.5 py-0.5 text-xs text-amber-600 dark:border-amber-700/50 dark:text-amber-400"
        >
          {award}
        </span>
      ))}
      {tags?.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export default function Projects() {
  if (PROJECTS.length === 0) return null;

  return (
    <section className="section-stack">
      <p className="editorial-kicker mb-1">Selected Work</p>
      <div className="editorial-rule mb-5 flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium italic text-zinc-900 dark:text-zinc-100">Projects</h3>
        <a
          href="/projects"
          className="editorial-link text-xs text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          All projects →
        </a>
      </div>
      <motion.div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {PROJECTS.map((project) => (
          <motion.div key={project.id} variants={itemVariants}>
            <MorphingDialog>
              <MorphingDialogTrigger className="h-full w-full text-left">
                <SpotlightCard className="flex h-full flex-col rounded-xl border border-zinc-100 p-4 dark:border-zinc-800">
                  <p className="mb-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {project.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {project.description}
                  </p>
                  <TagPills tags={project.tags} awards={project.awards} />
                </SpotlightCard>
              </MorphingDialogTrigger>

              <MorphingDialogContent>
                <div className="p-6">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <MorphingDialogTitle className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                      {project.name}
                    </MorphingDialogTitle>
                    <MorphingDialogClose className="shrink-0 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
                      <XIcon size={16} />
                    </MorphingDialogClose>
                  </div>
                  <MorphingDialogDescription className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {project.description}
                  </MorphingDialogDescription>
                  <TagPills tags={project.tags} awards={project.awards} />
                  <div className="mt-4 flex items-center gap-4">
                    {project.blogSlug && (
                      <a
                        href={`/blog/${project.blogSlug}`}
                        className="editorial-link text-xs font-medium text-zinc-700 dark:text-zinc-300 dark:hover:text-zinc-100"
                      >
                        Read post →
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="editorial-link text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                      >
                        {externalLinkLabel(project.link)} →
                      </a>
                    )}
                  </div>
                </div>
              </MorphingDialogContent>
            </MorphingDialog>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
