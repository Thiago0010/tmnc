import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, ShieldAlert, ShieldCheck } from 'lucide-react'
import { SCAMS, RULES } from '../data'

function Game({ up }) {
  const [i, setI] = useState(0), [typing, setTyping] = useState(true), [ans, setAns] = useState(null), [hits, setHits] = useState(0)
  useEffect(() => { setTyping(true); const t = setTimeout(() => setTyping(false), 1100); return () => clearTimeout(t) }, [i])
  const m = SCAMS[i]
  if (!m) return (
    <div className="card center col"><h2>{hits}/{SCAMS.length} detectados</h2>
      <p className="muted">{hits >= 5 ? 'Muro de gelo sólido.' : 'Releia as dicas e tente de novo.'}</p>
      <button className="btn" onClick={() => { setI(0); setHits(0) }}>Jogar de novo</button></div>)
  const pick = g => { const ok = g === m.scam; setAns(ok); if (ok) setHits(h => h + 1); up({ xp: ok ? 10 : 0, wall: ok ? 2 : -6 }) }
  const next = () => { setAns(null); setI(i + 1) }
  return (
    <div className="col">
      <div className="row muted small"><span>Mensagem {i + 1} de {SCAMS.length}</span></div>
      <div className="chat">
        <div className="avatar"><Bot size={20} /></div>
        <motion.div key={i + String(typing)} initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="bubble">
          {typing ? <span className="dots"><i /><i /><i /></span> : <><small className="gold">{m.from}</small><p>{m.text}</p></>}
        </motion.div>
      </div>
      {!typing && ans === null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="two">
          <button className="btn danger" onClick={() => pick(true)}><ShieldAlert size={18} /> É golpe</button>
          <button className="btn safe" onClick={() => pick(false)}><ShieldCheck size={18} /> É seguro</button>
        </motion.div>)}
      <AnimatePresence>{ans !== null && (
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={'card fb ' + (ans ? 'ok' : 'bad')}>
          <b>{ans ? 'Detectado!' : 'Essa passou.'}</b><p>{m.why}</p><button className="btn" onClick={next}>Próxima</button>
        </motion.div>)}
      </AnimatePresence>
    </div>
  )
}

function Scan() {
  const [t, setT] = useState(''), [r, setR] = useState(null)
  const run = () => { const hit = RULES.filter(x => x.re.test(t)); setR({ score: Math.min(100, hit.reduce((a, x) => a + x.w, 0)), hit }) }
  const lvl = r && (r.score >= 60 ? ['Alto risco', 'var(--danger)'] : r.score >= 30 ? ['Suspeita', 'var(--gold)'] : ['Baixo risco', 'var(--ok)'])
  return (
    <div className="col">
      <textarea value={t} onChange={e => setT(e.target.value)} placeholder="Cole aqui a mensagem que você recebeu" rows={5} />
      <button className="btn" disabled={!t.trim()} onClick={run}>Analisar mensagem</button>
      {r && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <div className="row"><b>{lvl[0]}</b><span style={{ color: lvl[1] }}>{r.score}/100</span></div>
        <div className="bar"><motion.i initial={{ width: 0 }} animate={{ width: `${r.score}%` }} style={{ background: lvl[1] }} /></div>
        <ul>{r.hit.length ? r.hit.map(x => <li key={x.t}>{x.t}</li>) : <li>Nenhum sinal clássico encontrado.</li>}</ul>
        <p className="muted small">Análise por regras locais. Na dúvida, confirme pelo canal oficial.</p>
      </motion.div>}
    </div>
  )
}

export default function AI({ up }) {
  const [tab, setTab] = useState('game')
  return (
    <div className="page">
      <header><h1>IA Gelo</h1><p className="muted">Treine seu olho contra golpistas</p></header>
      <div className="seg">{[['game', 'Jogar'], ['scan', 'Analisar']].map(([id, l]) =>
        <button key={id} onClick={() => setTab(id)} className={tab === id ? 'on' : ''}>
          {tab === id && <motion.span layoutId="seg" className="pill" />}<em>{l}</em></button>)}</div>
      {tab === 'game' ? <Game up={up} /> : <Scan />}
    </div>
  )
}
