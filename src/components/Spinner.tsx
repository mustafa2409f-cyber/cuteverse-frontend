import { motion } from 'framer-motion';

export default function Spinner({ size = 48, label = 'Loading…' }: { size?: number; label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-blush-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blush-400 border-r-lav-400" />
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-peach-300" />
      </motion.div>
      <motion.p
        className="font-display text-sm font-bold text-lav-400"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        {label}
      </motion.p>
    </div>
  );
}
