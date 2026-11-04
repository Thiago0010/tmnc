import { motion } from 'framer-motion'
import { LESSONS } from '../data'
export default function Profile({ s }) {
  const lvl = Math.floor(s.xp / 100) + 1
  return (
    <div className="page">
      <header><h1>Perfil</h1><p className="muted">Nível {lvl} · Guardião do Gelo</p></header>
      <div className="card">
        <div className="row"><b>Próximo nível</b><span className="gold">{s.xp % 100}/100 XP</span></div>
        <div className="bar"><motion.i animate={{ width: `${s.xp % 100}%` }} /></div>
      </div>
      <h3>Conquistas</h3>
      <div className="badges">
        {LESSONS.map(L => <motion.div key={L.id} whileHover={{ y: -4 }} className={'card badge ' + (s.done.includes(L.id) ? 'got' : '')}>
          <span>{L.emoji}</span><small>{L.title}</small></motion.div>)}
      </div>
    </div>
  )
}
