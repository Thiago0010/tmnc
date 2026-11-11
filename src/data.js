export const LESSONS = [
  { id: 'phishing', title: 'Phishing', emoji: '🎣', qs: [
    { q: 'SMS: "Seu CPF será bloqueado hoje. Regularize em bit.ly/cpf-ok". O que fazer?', o: ['Clicar rápido', 'Ignorar e conferir no app ou site oficial', 'Responder com seus dados'], a: 1, why: 'Urgência + link encurtado são sinais clássicos de golpe.' },
    { q: 'Qual endereço é realmente do Nubank?', o: ['nubank-app.co/login', 'nubank.com.br', 'nubank.com.br.acesso-seguro.net'], a: 1, why: 'O domínio real vem antes da primeira barra. O resto é maquiagem.' } ] },
  { id: 'pix', title: 'Pix e parentes', emoji: '💸', qs: [
    { q: 'Um "parente" manda mensagem de número novo pedindo Pix urgente. Você:', o: ['Faz o Pix', 'Liga para o número antigo dele', 'Pede o CPF dele'], a: 1, why: 'Confirme por outro canal antes de qualquer transferência.' },
    { q: 'Compradores pedem o "código de confirmação" que chegou por SMS.', o: ['Envia o código', 'Nunca compartilha: é a chave da sua conta'], a: 1, why: 'Código por SMS é só seu. Quem pede está tentando entrar na sua conta.' } ] },
  { id: 'senhas', title: 'Senhas fortes', emoji: '🔑', qs: [
    { q: 'Qual senha é mais forte?', o: ['Maria1990!', 'correto-cavalo-bateria-lua', '123456abc'], a: 1, why: 'Frases longas ganham de senhas curtas com símbolos previsíveis.' },
    { q: 'A verificação em duas etapas serve para:', o: ['Deixar o login mais lento', 'Barrar invasores mesmo com a senha vazada', 'Trocar a senha sozinha'], a: 1, why: 'Sem o segundo fator, a senha vazada sozinha não abre a conta.' } ] },
  { id: 'suporte', title: 'Falso suporte', emoji: '📞', qs: [
    { q: 'Ligam do "banco" pedindo para instalar um app de acesso remoto.', o: ['Instala', 'Desliga e liga para o número do cartão', 'Passa só a senha'], a: 1, why: 'Acesso remoto entrega o celular inteiro ao golpista.' },
    { q: 'O banco pede sua senha completa por telefone?', o: ['Às vezes', 'Nunca'], a: 1, why: 'Nenhuma instituição pede senha por telefone, SMS ou chat.' } ] },
  { id: 'whats', title: 'WhatsApp clonado', emoji: '💬', qs: [
    { q: 'Um amigo pede o código de 6 dígitos que chegou "sem querer" no seu SMS.', o: ['Envia', 'Recusa: é o código do seu WhatsApp'], a: 1, why: 'Esse código ativa o seu WhatsApp em outro aparelho.' },
    { q: 'Melhor proteção contra clonagem:', o: ['Verificação em duas etapas', 'Trocar a foto de perfil'], a: 0, why: 'O PIN da verificação em duas etapas bloqueia a ativação em outro chip.' } ] },
]

export const SCAMS = [
  { from: 'Banco', text: 'Compra de R$ 2.890 aprovada. Não reconhece? Cancele em seguro-banco.top/cancelar', scam: true, why: 'Domínio .top estranho e pânico de compra desconhecida.' },
  { from: 'Serviço', text: 'Seu código de verificação é 482913. Não compartilhe com ninguém.', scam: false, why: 'Mensagem automática, sem link e sem pedir nada de volta.' },
  { from: 'Mãe (novo nº)', text: 'Oi, mudei de número. Pode fazer um Pix de R$ 800? Te explico depois.', scam: true, why: 'Número novo + Pix urgente. Confirme ligando para o número antigo.' },
  { from: 'Sorteio', text: 'Parabéns! Você ganhou um iPhone. Pague R$ 19 de frete para receber.', scam: true, why: 'Prêmio que você não disputou e cobrança antecipada.' },
  { from: 'Trabalho', text: 'Reunião de amanhã às 10h confirmada. Link: meet.google.com/abc-defg-hij', scam: false, why: 'Domínio oficial do Meet e contexto esperado.' },
  { from: 'Suporte', text: 'Sua conta será excluída em 1h. Envie o código que enviamos por SMS.', scam: true, why: 'Prazo curto + pedido de código = tentativa de invasão.' },
]

export const RULES = [
  { re: /urgente|agora|hoje|1h|imediat/i, w: 25, t: 'Cria urgência artificial' },
  { re: /pix|transfer|depósito/i, w: 20, t: 'Pede dinheiro' },
  { re: /bit\.ly|tinyurl|\.top|\.xyz|http:\/\//i, w: 30, t: 'Link encurtado ou suspeito' },
  { re: /senha|código|cpf|cartão/i, w: 25, t: 'Pede dado sensível' },
  { re: /ganhou|prêmio|parabéns|grátis/i, w: 20, t: 'Promete algo bom demais' },
  { re: /bloquead|suspens|exclu/i, w: 15, t: 'Ameaça bloquear sua conta' },
]
