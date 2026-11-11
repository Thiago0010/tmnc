import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Settings, LogOut, Check } from 'lucide-react'
import { LESSONS } from '../data'

export default function Profile({ s }) {
  const lvl = Math.floor(s.xp / 100) + 1
  const nextXp = s.xp % 100
  const [opt, setOpt] = useState(null)

  return (
    <div className="page">
      <header>
        <h1>Perfil</h1>
        <p className="muted">Nível {lvl} · Guardião do Gelo</p>
      </header>

      <div className="card center">
        <div className="shield" style={{ width: 96, height: 96, margin: '0 auto 12px' }}>
          <Shield size={48} className="gold" />
        </div>
        <div className="row"><b>Ice Wall</b><span className="muted small">v1.0.0</span></div>
        <div className="row"><b>Plano</b><span className="muted small">Essencial</span></div>
      </div>

      <div className="card">
        <div className="row"><b>Próximo nível</b><span className="gold">{nextXp}/100 XP</span></div>
        <div className="bar"><motion.i animate={{ width: `${nextXp}%` }} /></div>
        <div className="row muted small" style={{ marginTop: 6, justifyContent: 'space-between' }}>
          <span>Muro: {s.wall}%</span>
          <span>Streak: {s.streak} dias</span>
          <span>Lições: {s.done.length}/{LESSONS.length}</span>
        </div>
      </div>

      <h3 className="muted small">Conquistas</h3>
      <div className="badges">
        {LESSONS.map(L => (
          <motion.div key={L.id} whileHover={{ y: -4 }} className={'card badge ' + (s.done.includes(L.id) ? 'got' : '')}>
            <span>{L.emoji}</span>
            <small>{L.title}</small>
          </motion.div>
        ))}
      </div>

      <div className="card">
        <motion.button
          key="settings"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.97 }}
          className="opt"
          onClick={() => setOpt('settings')}
        >
          <Settings size={18} className="gold" /> <b>Configurações</b>
        </motion.button>
        <motion.button
          key="sair"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.97 }}
          className="opt"
          onClick={() => setOpt('sair')}
        >
          <LogOut size={18} className="danger" /> <b>Sair</b>
        </motion.button>
      </div>

      <AnimatePresence>
        {opt === 'settings' && (
          <motion.div className="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}>
            <div className="row"><button className="icon" onClick={() => setOpt(null)} aria-label="Fechar"><Check /></button>
              <div className="bar grow"></div></div>
            <h2>Configurações</h2>
            <div className="card">
              <div className="row"><b>Notificações</b><span className="muted small">Receba alertas de golpes</span></div>
              <div className="row"><b>Modo escuro</b><span className="muted small">Sempre ativo</span></div>
              <div className="row"><b>Idioma</b><span className="muted small">Português</span></div>
            </div>
          </motion.div>
        )}
        {opt === 'sair' && (
          <motion.div className="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}>
            <div className="row"><button className="icon" onClick={() => setOpt(null)} aria-label="Fechar"><Check /></button>
              <div className="bar grow"></div></div>
            <h2>Sair da conta</h2>
            <p className="muted">Tem certeza que deseja sair? Seu progresso local será mantido.</p>
            <div className="two">
              <button className="btn" onClick={() => setOpt(null)}>Cancelar</button>
              <button className="btn danger" onClick={() => {}}>Sair</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
