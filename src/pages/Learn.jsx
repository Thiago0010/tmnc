import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Lock, X } from 'lucide-react'
import { LESSONS } from '../data'

function Lesson({ L, close, up }) {
  const [i, setI] = useState(0), [pick, setPick] = useState(null), [shake, setShake] = useState(0)
  const q = L.qs[i], done = pick !== null
  const choose = n => {
    if (done) return
    setPick(n)
    if (n === q.a) up({ xp: 10, wall: 2 }); else { up({ wall: -4 }); setShake(k => k + 1) }
  }
  const next = () => {
    if (i + 1 < L.qs.length) { setI(i + 1); setPick(null) } else { up({ xp: 30, wall: 5, lesson: L.id }); close() }
  }
  return (
    <motion.div className="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 240 }}>
      <div className="row"><button className="icon" onClick={close} aria-label="Fechar"><X /></button>
        <div className="bar grow"><motion.i animate={{ width: `${((i + (done ? 1 : 0)) / L.qs.length) * 100}%` }} /></div></div>
      <motion.div key={i + '-' + shake} animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}} className="col">
        <h2>{q.q}</h2>
        {q.o.map((o, n) => (
          <motion.button key={n} whileTap={{ scale: 0.97 }} onClick={() => choose(n)}
            className={'opt ' + (done ? (n === q.a ? 'ok' : n === pick ? 'bad' : 'dim') : '')}>{o}</motion.button>
        ))}
        {done && (
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={'card fb ' + (pick === q.a ? 'ok' : 'bad')}>
            <b>{pick === q.a ? 'Muro reforçado!' : 'O muro rachou.'}</b><p>{q.why}</p>
            <button className="btn" onClick={next}>{i + 1 < L.qs.length ? 'Continuar' : 'Concluir lição'}</button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function Learn({ s, up }) {
  const [open, setOpen] = useState(null)
  return (
    <div className="page">
      <header><h1>Aprender</h1><p className="muted">Uma trilha, cinco golpes a menos</p></header>
      <div className="path">
        {LESSONS.map((L, n) => {
          const done = s.done.includes(L.id), locked = n > 0 && !s.done.includes(LESSONS[n - 1].id)
          return (
            <motion.button key={L.id} disabled={locked} onClick={() => setOpen(L)} whileTap={{ scale: 0.94 }}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: n * 0.08 }}
              className={'node ' + (done ? 'done' : locked ? 'lock' : 'now')} style={{ marginLeft: [0, 70, 0, -70][n % 4] }}>
              <span className="ring">{done ? <Check /> : locked ? <Lock size={22} /> : L.emoji}</span>
              <span>{L.title}</span>
            </motion.button>
          )
        })}
      </div>
      <AnimatePresence>{open && <Lesson L={open} close={() => setOpen(null)} up={up} />}</AnimatePresence>
    </div>
  )
}
