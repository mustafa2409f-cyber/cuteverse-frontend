import { motion } from 'framer-motion';

/** Cute blob mascot with a happy face, built in SVG. */
export default function Mascot({ size = 220, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      aria-label="CuteVerse mascot"
      role="img"
    >
      <defs>
        <linearGradient id="mascotBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFC9D6" />
          <stop offset="55%" stopColor="#EDE7FF" />
          <stop offset="100%" stopColor="#B9E4FE" />
        </linearGradient>
        <linearGradient id="mascotCheek" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF7BA0" stopOpacity="0" />
          <stop offset="50%" stopColor="#FF7BA0" stopOpacity=".55" />
          <stop offset="100%" stopColor="#FF7BA0" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* ears */}
      <ellipse cx="55" cy="52" rx="16" ry="26" fill="#FFC9D6" transform="rotate(-18 55 52)" />
      <ellipse cx="145" cy="52" rx="16" ry="26" fill="#FFC9D6" transform="rotate(18 145 52)" />
      <ellipse cx="55" cy="55" rx="8" ry="15" fill="#FF9FBE" transform="rotate(-18 55 55)" />
      <ellipse cx="145" cy="55" rx="8" ry="15" fill="#FF9FBE" transform="rotate(18 145 55)" />
      {/* body */}
      <path
        d="M100 34c-38 0-62 27-62 60 0 38 28 66 62 66s62-28 62-66c0-33-24-60-62-60z"
        fill="url(#mascotBody)"
      />
      {/* belly */}
      <ellipse cx="100" cy="138" rx="34" ry="26" fill="#fff" opacity=".55" />
      {/* cheeks */}
      <ellipse cx="62" cy="112" rx="13" ry="8" fill="url(#mascotCheek)" />
      <ellipse cx="138" cy="112" rx="13" ry="8" fill="url(#mascotCheek)" />
      {/* eyes */}
      <motion.g
        animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }}
        style={{ transformOrigin: '100px 96px' }}
      >
        <circle cx="78" cy="94" r="9" fill="#4A3B52" />
        <circle cx="122" cy="94" r="9" fill="#4A3B52" />
        <circle cx="81" cy="91" r="3" fill="#fff" />
        <circle cx="125" cy="91" r="3" fill="#fff" />
      </motion.g>
      {/* blush marks */}
      <circle cx="70" cy="110" r="4" fill="#FF7BA0" opacity=".5" />
      <circle cx="130" cy="110" r="4" fill="#FF7BA0" opacity=".5" />
      {/* mouth */}
      <path d="M88 116c4 7 20 7 24 0" stroke="#4A3B52" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* star accessory */}
      <motion.g
        animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ transformOrigin: '160px 70px' }}
      >
        <path
          d="M160 52l4 9 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z"
          fill="#FFD66B"
          stroke="#F5B942"
          strokeWidth="1.5"
        />
      </motion.g>
      {/* tiny heart */}
      <motion.path
        d="M42 78c-3-5-10-2-10 3 0 5 6 8 10 12 4-4 10-7 10-12 0-5-7-8-10-3z"
        fill="#FF7BA0"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{ transformOrigin: '42px 85px' }}
      />
    </motion.svg>
  );
}
