/*
 * Analisador de notícias: tenta usar uma API de IA externa quando
 * VITE_AI_API_URL e VITE_AI_API_KEY estiverem definidos; senão, usa
 * regras locais heurísticas. Funciona off-line graças ao fallback.
 */
const API_URL = import.meta.env.VITE_AI_API_URL
const API_KEY = import.meta.env.VITE_AI_API_KEY
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'gpt-3.5-turbo'

const LOCAL_RULES = [
  { re: /urgente|agora|hoje|imediat|1h|24h|corra|rápido/i, w: 20, t: 'Cria urgência artificial para impedir reflexão' },
  { re: /pix|transfer(?:ência|ência)?|dep[óo]sito|boleto/i, w: 20, t: 'Pede dinheiro ou transferência' },
  { re: /bit\.ly|tinyurl|\.top|\.xyz|\.click|http:\/\//i, w: 25, t: 'Link encurtado ou domínio suspeito' },
  { re: /senha|código|CPF|cart[ãa]o|RG|documento/i, w: 20, t: 'Pede dado sensível' },
  { re: /ganhou|pr[eê]mio|parab(?:én|e)ns|gr[áa]tis|sorteio/i, w: 20, t: 'Promete algo bom demais para ser verdade' },
  { re: /bloquead|suspens|exclu|cancelad/i, w: 15, t: 'Ameaça bloquear ou excluir sua conta' },
  { re: /m(?:ã|a)e|pai|filho|parente|amigo.*novo n[uú]mero/i, w: 20, t: 'Familiar em número novo pedindo dinheiro' },
  { re: /fake news|mentira|inverdade|conspira/i, w: 10, t: 'Linguagem própria de boatos' },
  { re: /\b(notícia|reporta(?:r|ção)|jornal|ve[íi]culo)/i, w: -10, t: 'Aponta para conteúdo jornalístico' },
]

function localVerdict(text) {
  let score = 50
  const signals = []
  const low = text.toLowerCase()
  for (const { re, w, t } of LOCAL_RULES) {
    if (re.test(text)) {
      score += w
      signals.push(t)
    }
  }
  score = Math.max(0, Math.min(100, score))
  let verdict, label
  if (score >= 65) { verdict = 'FALSA'; label = 'Provavelmente falsa' }
  else if (score >= 40) { verdict = 'SUSPEITA'; label = 'Suspeita / verificar' }
  else { verdict = 'VERDADEIRA'; label = 'Provavelmente verdadeira' }
  return { verdict, label, score, signals }
}

export async function analyzeNews(text) {
  if (!text || !text.trim()) {
    return { verdict: null, label: null, score: 0, signals: [], source: 'erro', error: 'Texto vazio' }
  }

  // Tenta API externa de IA
  if (API_URL && API_KEY) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + API_KEY },
        body: JSON.stringify({ model: AI_MODEL, messages: [
          { role: 'system', content: 'Você é um verificador de fatos. Responda APENAS em JSON com: verdict ("VERDADEIRA","FALSA","SUSPEITA"), confidence (0-100), explanation (curto em português), signals (lista curta de sinais).' },
          { role: 'user', content: 'Analise esta notícia: ' + text },
        ] }),
      })
      if (res.ok) {
        const data = await res.json()
        const content = data.choices?.[0]?.message?.content || '{}'
        const parsed = JSON.parse(content.replace(/```json|```/g, '').trim())
        return { ...parsed, source: 'ia' }
      }
    } catch (e) {
      // cai para o local
    }
  }

  // Fallback local (funciona off-line)
  const r = localVerdict(text)
  return { verdict: r.verdict, label: r.label, confidence: r.score, explanation: r.signals.length ? r.signals.join('. ') + '.' : 'Nenhum sinal clássico detectado.', signals: r.signals, source: 'local' }
}
