# Ice Wall

Frontend do app de segurança digital. React 18 + Vite + Framer Motion + Lucide.

## Rodar
    npm install
    npm run dev

## Design system (tokens em `src/styles.css`)
- Cores: `--bg` #050A18, `--ice` #6CC8FF, `--blue` #2B7BFF, `--gold` #F5B942, `--ok` #4BE3A5, `--danger` #FF5C7A
- Tipografia: Sora (títulos), Manrope (texto)
- Raios: 12 / 20 / 28. Easing: `--ease`
- Componentes: Shield, Card, Btn (padrão, danger, safe), Bar, Node, Sheet, Bubble, Seg, Nav
- Movimento: uma entrada orquestrada na Home; o resto responde a toques. Respeita `prefers-reduced-motion`.
- Conteúdo editável em `src/data.js` (lições, mensagens do jogo, regras do analisador)
