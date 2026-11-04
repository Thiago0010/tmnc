import { motion } from 'framer-motion'
export default function Shield({ wall, size = 230 }) {
  return (
    <div className="shield" style={{ width: size, height: size }} role="img" aria-label={`Integridade do muro: ${wall}%`}>
      <div className="orbit" /><div className="orbit o2" />
      <motion.svg viewBox="0 0 200 220" animate={{ y: [0, -9, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
        <defs>
          <linearGradient id="gi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#CFEFFF" /><stop offset=".5" stopColor="#4FA8FF" /><stop offset="1" stopColor="#1B3FA8" /></linearGradient>
          <linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFE3A0" /><stop offset="1" stopColor="#E59A1B" /></linearGradient>
        </defs>
        <path d="M100 8 L184 38 V104 C184 154 148 192 100 212 C52 192 16 154 16 104 V38 Z" fill="url(#gi)" stroke="url(#gg)" strokeWidth="4" />
        <path d="M100 28 L166 50 V104 C166 142 138 174 100 192 C62 174 34 142 34 104 V50 Z" fill="rgba(5,10,24,.5)" />
        <rect x="76" y="100" width="48" height="38" rx="9" fill="url(#gg)" />
        <path d="M86 100 V88 a14 14 0 0 1 28 0 V100" stroke="url(#gg)" strokeWidth="7" fill="none" strokeLinecap="round" />
        <motion.g animate={{ opacity: (100 - wall) / 100 }} stroke="#050A18" fill="none" strokeWidth="2.5" strokeLinecap="round">
          <path d="M100 8 L92 58 L114 90 L98 150" /><path d="M184 72 L142 92 L132 134" /><path d="M16 80 L54 98 L50 140" />
        </motion.g>
      </motion.svg>
    </div>
  )
}
