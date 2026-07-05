module.exports = {
  enabled: true,
  ollama: {
    url: process.env.OLLAMA_URL || 'http://localhost:11434/api/generate',
    model: process.env.OLLAMA_MODEL || 'qwen2.5:3b',
    timeout: Number(process.env.OLLAMA_TIMEOUT_MS || 8000),
    temperature: 0.85,
    top_p: 0.9,
    maxTokens: 140
  },
  bibine: {
    name: 'Bibine',
    maxSentences: 2,
    usePhraseBank: true,
    avoidRepeatingAction: true
  },
  memory: {
    persistent: true,
    historySize: 100
  },
  events: {
    enabled: true,
    happyHourEvery: 12,
    chaosEvery: 20
  }
};
