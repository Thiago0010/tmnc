# Backend Ice Wall — deploy no PythonAnywhere

## O que faz
Proxy leve (Flask) entre o frontend (React/Vite) e a API de IA da NVIDIA (NIM).
O frontend em `src/services/ai.js` já chama `VITE_AI_API_URL` esperando uma
resposta estilo OpenAI (`choices[0].message.content` com JSON). Este backend
repassa a chamada para a NVIDIA usando a chave guardada em `.env` (nunca exposta
no frontend).

## Variáveis de ambiente (`.env`)

Copie `backend/.env.example` para `backend/.env` e preencha:

```
NVIDIA_API_KEY=sua_chave_da_nvidia_aqui
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=meta/llama-3.1-8b-instruct
PORT=5000
```

A chave da NVIDIA se pega em: https://build.nvidia.com (nível NIM).

## Endpoints

- `GET /health` — status + se a IA está configurada
- `POST /v1/chat/completions` — compatível OpenAI (usado pelo `analyzeNews` do frontend)
- `POST /analyze` — recebe `{ "text": "..." }` e retorna `{ verdict, confidence, explanation, signals, source }`

## Como conectar o frontend

Crie um `.env` na raiz do frontend (ou defina no Vite) com:

```
VITE_AI_API_URL=https://SEU-USUARIO.pythonanywhere.com/v1/chat/completions
VITE_AI_API_KEY=qualquer-coisa  # exigido pelo frontend, não usado pelo backend
VITE_AI_MODEL=meta/llama-3.1-8b-instruct
```

Depois rode `npm run build` (ou `npm run dev`) e teste a aba "Analisar notícia".

## Deploy no PythonAnywhere (passo a passo)

1. Faça login em https://www.pythonanywhere.com
2. Abra a aba **Web** → **Add a new web app** → **Manual configuration** → Python 3.10+
3. Em **Files**, crie a pasta do projeto e faça upload de `backend/app.py`, `backend/requirements.txt`, `backend/.env`
4. Abra um **Bash console** e instale as dependências:
   ```
   python3 -m venv /home/SEU-USUARIO/venv-icewall
   source /home/SEU-USUARIO/venv-icewall/bin/activate
   pip install -r /home/SEU-USUARIO/caminho/para/backend/requirements.txt
   ```
5. Na aba **Web** → **Source code**, defina:
   - **Working directory**: `/home/SEU-USUARIO/caminho/para/backend`
   - **WSGI configuration file**: aponte para o `wsgi.py` do PythonAnywhere (gerado automaticamente) e edite para importar o app:

   ```python
   import sys
   sys.path.append('/home/SEU-USUARIO/caminho/para/backend')
   from app import app as application
   ```
6. Em **Environment variables**, adicione `NVIDIA_API_KEY`, `NVIDIA_BASE_URL`, `NVIDIA_MODEL`.
   (Ou deixe o `.env` na pasta — o `load_dotenv()` do app carrega automaticamente.)
7. Clique em **Reload** no app web.
8. Teste: `curl https://SEU-USUARIO.pythonanywhere.com/health`

O plano gratuito do PythonAnywhere só permite requisições de saída para uma lista
restrita de sites. `integrate.api.nvidia.com` precisa estar na lista de permitidos
(whitelist) — se o plano gratuito não permitir, será necessário pagar o plano
mais barato para liberar a saída para esse domínio.
