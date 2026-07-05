const DEFAULT_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/generate";
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:3b";

function withTimeout(ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { controller, timer };
}

class OllamaClient {
  constructor(options = {}) {
    this.url = options.url || DEFAULT_URL;
    this.model = options.model || DEFAULT_MODEL;
    this.timeoutMs = Number(options.timeoutMs || process.env.OLLAMA_TIMEOUT_MS || 8000);
  }

  async generate(prompt) {
    const { controller, timer } = withTimeout(this.timeoutMs);

    try {
      const response = await fetch(this.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          options: {
            temperature: 0.85,
            top_p: 0.9,
            num_predict: 120
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama HTTP ${response.status}`);
      }

      const data = await response.json();
      return (data.response || "").trim();
    } finally {
      clearTimeout(timer);
    }
  }
}

module.exports = { OllamaClient };
