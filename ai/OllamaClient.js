const config = require('./config');

class OllamaClient {
  constructor(options = {}) {
    this.url = options.url || config.ollama.url;
    this.model = options.model || config.ollama.model;
    this.timeout = options.timeout || config.ollama.timeout;
  }

  async generate(prompt) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          options: {
            temperature: config.ollama.temperature,
            top_p: config.ollama.top_p,
            num_predict: config.ollama.maxTokens
          }
        })
      });
      if (!response.ok) throw new Error(`Ollama HTTP ${response.status}`);
      const data = await response.json();
      return (data.response || '')
        .replace(/<think>[\s\S]*?<\/think>/gi, '')
        .replace(/^Bibine\s*:?\s*/i, '')
        .trim();
    } finally {
      clearTimeout(timer);
    }
  }
}
module.exports = { OllamaClient };
