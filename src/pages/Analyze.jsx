import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchCheck, ShieldAlert, ShieldCheck, Shield, Copy, Trash2, Clock } from 'lucide-react'
import { analyzeNews } from '../services/ai'

const box = { show: { transition: { staggerChildren: 0.08 } } }
const it = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }

const STORAGE_KEY = 'iw_analyses'

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveHistory(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50))) } catch {}
}

const VERDICT_STYLE = {
  VERDADEIRA: { color: 'var(--ok)', icon: ShieldCheck, label: 'Provavelmente verdadeira' },
  FALSA:      { color: 'var(--danger)', icon: ShieldAlert, label: 'Provavelmente falsa' },
  SUSPEITA:   { color: 'var(--gold)', icon: ShieldAlert, label: 'Suspeita — verificar' },
}

export default function Analyze({ s, up }) {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState(loadHistory())

  const run = useCallback(async () => {
    if (!text.trim()) return
    setLoading(true)
    const r = await analyzeNews(text)
    setResult({ ...r, text, at: new Date().toISOString() })
    setHistory(h => { const n = [r, ...h]; saveHistory(n); return n })
    setLoading(false)
  }, [text])

  const clear = () => { setResult(null); setText('') }
  const del = i => { setHistory(h => { const n = h.filter((_, k) => k !== i); saveHistory(n); return n }) }

  const style = result ? VERDICT_STYLE[result.verdict] : null

  return (
    <motion.div variants={box} initial="hidden" animate="show" className="page">
      <header>
        <h1>Analisar notícia</h1>
        <p className="muted">Cole um texto e descubre se é verdade ou mentira</p>
      </header>

      <div className="card">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Cole aqui a notícia, mensagem ou print que você recebeu…"
          rows={6}
        />
        <div className="row">
          <span className="muted small">{text.length} caracteres</span>
          <button className="btn" disabled={loading || !text.trim()} onClick={run}>
            {loading ? <span>Analisando…</span> : <><SearchCheck size={18} /> Verificar notícia</>}
          </button>
        </div>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card verdict">
          <div className="row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: '50%', background: style.color, color: '#050A18' }}>
                <style.icon size={20} />
              </div>
              <div>
                <b style={{ color: style.color }}>{result.verdict}</b>
                <div className="muted small">{style.label}</div>
              </div>
            </div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: '1.6rem', fontWeight: 800 }}>
              {result.confidence ?? 0}%
            </div>
          </div>
          <p className="muted small" style={{ marginTop: 8 }}>{result.explanation}</p>
          {result.signals && result.signals.length && (
            <ul style={{ marginTop: 8, paddingLeft: 18, display: 'grid', gap: 4 }}>
              {result.signals.map(sg => <li key={sg} className="small muted">{sg}</li>)}
            </ul>
          )}
          <div className="row" style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
            <button className="icon" onClick={clear} aria-label="Nova análise"><Shield size={18} /></button>
            <button className="icon" onClick={() => { navigator.clipboard.writeText(result.text); }} aria-label="Copiar"><Copy size={18} /></button>
            <span className="muted small"><Clock size={16} /> {new Date(result.at).toLocaleTimeString('pt-BR')}</span>
          </div>
        </motion.div>
      )}

      <h3 className="muted small" style={{ marginTop: 26, marginBottom: 8 }}>Histórico</h3>
      <div className="badges">
        {history.length ? history.map((r, i) => (
          <motion.div key={i} whileHover={{ y: -4 }} className={'card badge small-hist ' + (r.source === 'ia' ? '' : 'local')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <div style={{ maxWidth: '62%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                <b>{r.text.slice(0, 45)}</b>{r.text.length > 45 ? '…' : ''}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', opacity: .7 }}>{r.source === 'ia' ? 'IA' : 'local'}</span>
                <button className="icon" onClick={() => del(i)} aria-label="Remover"><Trash2 size={16} /></button>
              </div>
            </div>
            <div style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: '.72rem' }}>
              <span className="muted">{r.verdict}</span>
              <span className="muted">{new Date(r.at).toLocaleDateString('pt-BR')}</span>
            </div>
          </motion.div>
        )) : (
          <p className="muted small" style={{ textAlign: 'center', opacity: .5 }}>Nenhuma análise ainda.</p>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="card center col" style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(5,10,24,.85)', backdropFilter: 'blur(8px)' }}
          >
            <div className="muted small">Consultando a IA…</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
