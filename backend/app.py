import os
import json
import logging
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import requests

load_dotenv()

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("icewall-backend")

app = Flask(__name__)

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "")
NVIDIA_BASE_URL = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1").rstrip("/")
NVIDIA_MODEL = os.getenv("NVIDIA_MODEL", "meta/llama-3.1-8b-instruct")

SYSTEM_PROMPT = (
    "Você é um verificador de fatos especialista em golpes digitais. "
    "Responda APENAS em JSON válido com as chaves: "
    "verdict (\"VERDADEIRA\",\"FALSA\",\"SUSPEITA\"), "
    "confidence (0-100), explanation (curto em português), "
    "signals (lista curta de strings em português). Não adicione texto fora do JSON."
)


def call_nvidia(news_text):
    """Chama a API de chat da NVIDIA (NIM) e retorna o conteúdo do JSON da IA."""
    if not NVIDIA_API_KEY:
        raise RuntimeError("NVIDIA_API_KEY não configurada no .env")

    url = f"{NVIDIA_BASE_URL}/chat/completions"
    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Content-Type": "application/json",
    }
    body = {
        "model": NVIDIA_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Analise esta notícia: {news_text}"},
        ],
        "temperature": 0.2,
        "max_tokens": 500,
    }

    log.info("Chamando NVIDIA NIM: %s", url)
    resp = requests.post(url, headers=headers, json=body, timeout=60)
    log.info("Resposta NVIDIA status: %s", resp.status_code)
    resp.raise_for_status()

    data = resp.json()
    content = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
    # Remove blocos de markdown caso a IA envolva o JSON em ```json
    content = content.replace("```json", "").replace("```", "").strip()
    parsed = json.loads(content)

    return {
        "verdict": parsed.get("verdict", "SUSPEITA"),
        "confidence": int(parsed.get("confidence", 50)),
        "explanation": parsed.get("explanation", ""),
        "signals": parsed.get("signals", []),
        "source": "ia",
    }


@app.get("/health")
def health():
    return jsonify({"status": "ok", "ai_configured": bool(NVIDIA_API_KEY)})


@app.post("/v1/chat/completions")
def chat_completions():
    """Proxy compatível com OpenAI. O frontend envia o payload padrão e recebe
    a resposta da NVIDIA direta (choices[0].message.content com o JSON da análise)."""
    if not NVIDIA_API_KEY:
        return jsonify({"error": "NVIDIA_API_KEY não configurada"}), 500

    body = request.get_json(silent=True) or {}
    messages = body.get("messages", [])
    user_text = ""
    for m in reversed(messages):
        if m.get("role") == "user":
            user_text = m.get("content", "")
            break

    try:
        result = call_nvidia(user_text)
        # Devolve no formato OpenAI para o analyzeNews do frontend funcionar sem mudanças
        return jsonify({
            "id": "icewall-1",
            "model": NVIDIA_MODEL,
            "choices": [{
                "index": 0,
                "message": {"role": "assistant", "content": json.dumps(result, ensure_ascii=False)},
                "finish_reason": "stop",
            }],
        })
    except requests.HTTPError as e:
        log.error("Erro HTTP da NVIDIA: %s", e)
        return jsonify({"error": f"NVIDIA API error: {e.response.status_code}"}), 502
    except Exception as e:
        log.exception("Falha na análise de IA")
        return jsonify({"error": str(e)}), 500


@app.post("/analyze")
def analyze():
    """Endpoint simplificado: recebe { text } e retorna o veredito já parseado."""
    body = request.get_json(silent=True) or {}
    text = body.get("text", "").strip()
    if not text:
        return jsonify({"error": "texto vazio"}), 400

    try:
        result = call_nvidia(text)
        return jsonify(result)
    except Exception as e:
        log.exception("Falha no endpoint /analyze")
        return jsonify({"error": str(e), "source": "erro"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=True)
