import { EMAIL, SOCIAL_LINKS } from '../../data';
import { Magnetic } from '../ui/Magnetic';

export default function Connect() {
  return (
    <section className="mb-4">
      <h3 className="mb-5 text-sm font-medium text-zinc-900 dark:text-zinc-100">Connect</h3>
      <div className="flex flex-col gap-3">
        <a
          href={`mailto:${EMAIL}`}
          className="text-sm text-zinc-500 underline-offset-2 transition-colors hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          {EMAIL}
        </a>
        <div className="flex flex-wrap gap-3">
          {SOCIAL_LINKS.map(({ label, link }) => (
            <Magnetic key={label} intensity={0.4} range={80}>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
              >
                {label}
              </a>
            </Magnetic>
          ))}
        </div>
      </div>
    </section>
  );
}
