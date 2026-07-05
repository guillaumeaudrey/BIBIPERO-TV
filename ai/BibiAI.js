const { OllamaClient } = require("./OllamaClient");
const { buildAnnouncementPrompt } = require("./PromptBuilder");

function fallbackAnnouncement({ player, action, caseNumber, dice }) {
  const name = player?.name || "joueur";
  const title = action?.title || "carte";
  const effect = action?.text || "c'est parti";
  const diceText = dice ? ` avec un dé ${dice}` : "";
  return `🍺 ${name}${diceText}, Bibi t'a à l'œil ! ${title} : ${effect}`;
}

class BibiAI {
  constructor(options = {}) {
    this.client = options.client || new OllamaClient(options);
    this.enabled = options.enabled !== false;
  }

  async announce(context) {
    if (!this.enabled) {
      return fallbackAnnouncement(context);
    }

    try {
      const prompt = buildAnnouncementPrompt(context);
      const text = await this.client.generate(prompt);

      if (!text) {
        return fallbackAnnouncement(context);
      }

      return text
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .replace(/^Bibi\s*:?\s*/i, "")
        .trim();
    } catch (error) {
      console.warn("BibiAI indisponible :", error.message);
      return fallbackAnnouncement(context);
    }
  }
}

function createBibiAI(options = {}) {
  return new BibiAI(options);
}

module.exports = { BibiAI, createBibiAI };
