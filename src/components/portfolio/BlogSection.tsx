import { motion } from 'motion/react';
import { BLOG_POSTS } from '../../data';
import { AnimatedBackground } from '../ui/AnimatedBackground';

export default function BlogSection() {
  if (BLOG_POSTS.length === 0) return null;

  return (
    <section className="section-stack">
      <p className="editorial-kicker mb-1">Notes</p>
      <div className="editorial-rule mb-5 flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium italic text-zinc-900 dark:text-zinc-100">Writing</h3>
        <a
          href="/blog"
          className="editorial-link text-xs text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          All writing →
        </a>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <AnimatedBackground
          className="bg-zinc-100 dark:bg-zinc-800/60"
          transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
          enableHover
        >
          {BLOG_POSTS.map((post) => (
            <a
              key={post.uid}
              data-id={post.uid}
              href={post.link}
              className="block rounded-lg border-b border-zinc-200/70 px-3 py-2 transition-colors last:border-b-0 dark:border-zinc-700/60"
            >
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{post.title}</p>
              <p className="meta-italic text-xs text-zinc-500 dark:text-zinc-400">
                {post.description}
              </p>
            </a>
          ))}
        </AnimatedBackground>
      </motion.div>
    </section>
  );
}
