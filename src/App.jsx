import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ShieldCheck, GraduationCap, Bot, SearchCheck, User } from 'lucide-react'
import Particles from './components/Particles'
import Home from './pages/Home'
import Learn from './pages/Learn'
import AI from './pages/AI'
import Analyze from './pages/Analyze'
import Profile from './pages/Profile'

const TABS = [
  { id: 'home', label: 'Início', Icon: ShieldCheck, C: Home },
  { id: 'learn', label: 'Aprender', Icon: GraduationCap, C: Learn },
  { id: 'ai', label: 'IA', Icon: Bot, C: AI },
  { id: 'analyze', label: 'Analisar', Icon: SearchCheck, C: Analyze },
  { id: 'profile', label: 'Perfil', Icon: User, C: Profile },
]
const clamp = n => Math.max(0, Math.min(100, n))

export default function App() {
  const [tab, setTab] = useState('home')
  const [s, setS] = useState({ xp: 120, wall: 72, streak: 3, done: [] })
  const up = d => setS(p => ({ ...p, xp: p.xp + (d.xp || 0), wall: clamp(p.wall + (d.wall || 0)),
    done: d.lesson && !p.done.includes(d.lesson) ? [...p.done, d.lesson] : p.done }))
  const Page = TABS.find(t => t.id === tab).C
  return (
    <div className="app">
      <div className="aurora" /><Particles />
      <header className="app-header">
        <img src="/logo.jpeg" alt="Ice Wall" className="app-header-logo" />
        <span className="app-header-title">Ice Wall</span>
      </header>
      <AnimatePresence mode="wait">
        <motion.main key={tab} initial={{ opacity: 0, filter: 'blur(8px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(8px)' }} transition={{ duration: 0.22 }}>
          <Page s={s} up={up} go={setTab} />
        </motion.main>
      </AnimatePresence>
      <nav className="nav" aria-label="Navegação principal">
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setTab(id)} className={tab === id ? 'on' : ''} aria-current={tab === id ? 'page' : undefined}>
            {tab === id && <motion.span layoutId="nav" className="pill" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
            <Icon size={22} />
          </button>
        ))}
      </nav>
    </div>
  )
}
