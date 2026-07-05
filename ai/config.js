/**
 * Bibine AI
 * Configuration centrale
 */

module.exports = {

    // Activation générale
    enabled: true,

    // Ollama
    ollama: {

        url: process.env.OLLAMA_URL || "http://localhost:11434/api/generate",

        model: process.env.OLLAMA_MODEL || "qwen2.5:3b",

        timeout: 8000,

        temperature: 0.85,

        top_p: 0.90,

        maxTokens: 120

    },

    // Bibine
    bibine: {

        name: "Bibine",

        version: "2.0.0",

        maxSentences: 2,

        emojis: true,

        suspense: true,

        humour: 4,

        folie: 2,

        humeurAuto: true,

        commentairesEntreTours: true

    },

    // Cache
    cache: {

        enabled: true,

        maxEntries: 500,

        ttl: 300000

    },

    // Mémoire
    memory: {

        enabled: true,

        historySize: 100,

        playerHistory: 50

    },

    // Evènements
    events: {

        enabled: true,

        probability: 0.10

    }

};