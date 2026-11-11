import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';

const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Floating({
  children,
  left,
  top,
  delay = 0,
  duration = 6,
}: {
  children: React.ReactNode;
  left: number;
  top: number;
  delay?: number;
  duration?: number;
}) {
  if (reduced) {
    return <div className="pointer-events-none absolute" style={{ left: `${left}%`, top: `${top}%` }}>{children}</div>;
  }
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: `${left}%`, top: `${top}%` }}
      animate={{ y: [0, -22, 0], rotate: [0, 8, -8, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function FloatingHearts({ density = 'normal' }: { density?: 'normal' | 'low' }) {
  const count = density === 'low' ? 5 : 10;
  const items = Array.from({ length: count });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((_, i) => {
        const Icon = i % 3 === 0 ? Heart : i % 3 === 1 ? Sparkles : Star;
        const colors = ['text-blush-300', 'text-lav-300', 'text-sky2-300', 'text-peach-300', 'text-mint-300'];
        const size = 12 + (i % 4) * 5;
        return (
          <Floating
            key={i}
            left={(i * 37 + 5) % 96}
            top={(i * 53 + 6) % 90}
            delay={i * 0.7}
            duration={4 + (i % 5)}
          >
            <Icon size={size} className={`${colors[i % colors.length]} opacity-60 fill-current`} />
          </Floating>
        );
      })}
    </div>
  );
}
