import { motion } from 'framer-motion'
import { Flame, Zap, Crown, ChevronRight } from 'lucide-react'
import Shield from '../components/Shield'
const box = { show: { transition: { staggerChildren: 0.09 } } }
const it = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
export default function Home({ s, go }) {
  const stats = [[Flame, s.streak, 'dias seguidos'], [Zap, s.xp, 'XP'], [Crown, Math.floor(s.xp / 100) + 1, 'nível']]
  return (
    <motion.div variants={box} initial="hidden" animate="show" className="page">
      <motion.header variants={it}><h1>Ice Wall</h1><p className="muted">Seu muro contra golpes digitais</p></motion.header>
      <motion.div variants={it} className="center"><Shield wall={s.wall} /></motion.div>
      <motion.div variants={it} className="card">
        <div className="row"><b>Integridade do muro</b><span className="gold">{s.wall}%</span></div>
        <div className="bar"><motion.i animate={{ width: `${s.wall}%` }} transition={{ type: 'spring', stiffness: 80, damping: 16 }} /></div>
        <p className="muted small">Erre no jogo e o muro racha. Acerte e ele se reconstrói.</p>
      </motion.div>
      <motion.div variants={it} className="stats">
        {stats.map(([I, v, l]) => <div key={l} className="card stat"><I size={20} className="gold" /><b>{v}</b><span className="muted small">{l}</span></div>)}
      </motion.div>
      <motion.button variants={it} whileTap={{ scale: 0.97 }} className="card cta" onClick={() => go('learn')}>
        <div><b>Missão de hoje</b><p className="muted small">Complete 1 lição e ganhe +30 XP</p></div><ChevronRight />
      </motion.button>
      <motion.button variants={it} whileTap={{ scale: 0.97 }} className="card cta ice" onClick={() => go('ai')}>
        <div><b>Desafie a IA Gelo</b><p className="muted small">Ela finge ser golpista. Você descobre.</p></div><ChevronRight />
      </motion.button>
    </motion.div>
  )
}
