import { motion } from 'motion/react';
import { BLOG_POSTS } from '../../data';
import { AnimatedBackground } from '../ui/AnimatedBackground';

export default function BlogSection() {
  if (BLOG_POSTS.length === 0) return null;

  return (
    <section className="mb-10">
      <h3 className="mb-5 text-sm font-medium text-zinc-900 dark:text-zinc-100">Writing</h3>
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
              className="block rounded-lg px-3 py-2 transition-colors"
            >
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{post.title}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{post.description}</p>
            </a>
          ))}
        </AnimatedBackground>
      </motion.div>
    </section>
  );
}
