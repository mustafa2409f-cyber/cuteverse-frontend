import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';

const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Floating({
  children,
  delay = 0,
  duration = 6,
  x = 0,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
}) {
  if (reduced) return <>{children}</>;
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: `${x}%` }}
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
          <Floating key={i} delay={i * 0.7} duration={4 + (i % 5)} x={(i * 37) % 100}>
            <div style={{ top: `${8 + ((i * 53) % 84)}%`, position: 'absolute' }}>
              <Icon size={size} className={`${colors[i % colors.length]} opacity-60 fill-current`} />
            </div>
          </Floating>
        );
      })}
    </div>
  );
}
