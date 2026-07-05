const { OllamaClient } = require("./OllamaClient");
const { buildAnnouncementPrompt } = require("./PromptBuilder");
const { BibiMemory } = require("./Memory");

function fallbackAnnouncement({ player, action, dice }) {
  const name = player?.name || "joueur";
  const diceText = dice ? ` avec ce dé ${dice}` : "";
  const category = action?.category || "carte";

  if (String(category).toLowerCase().includes("malus")) {
    return `😈 ${name}${diceText}... Bibi sent que les ennuis arrivent.`;
  }
  if (String(category).toLowerCase().includes("bonus")) {
    return `🍀 ${name}${diceText}... la chance vient peut-être de changer de camp.`;
  }
  if (action?.isLegendary) {
    return `🔥 Silence dans la salle... ${name} vient de réveiller quelque chose de légendaire.`;
  }
  return `🍺 ${name}${diceText}, Bibi t'a à l'œil... que le spectacle commence !`;
}

class BibiAI {
  constructor(options = {}) {
    this.client = options.client || new OllamaClient(options);
    this.memory = options.memory || new BibiMemory();
    this.enabled = options.enabled !== false;
  }

  async announce(context = {}) {
    const memorySummary = this.memory.update(context);
    const fullContext = { ...context, memory: memorySummary };

    if (!this.enabled) {
      return fallbackAnnouncement(fullContext);
    }

    try {
      const prompt = buildAnnouncementPrompt(fullContext);
      const text = await this.client.generate(prompt);

      if (!text) {
        return fallbackAnnouncement(fullContext);
      }

      return text
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .replace(/^Bibi\s*:?\s*/i, "")
        .trim();
    } catch (error) {
      console.warn("BibiAI indisponible :", error.message);
      return fallbackAnnouncement(fullContext);
    }
  }

  getMemory(roomCode) {
    return this.memory.summary(roomCode);
  }
}

function createBibiAI(options = {}) {
  return new BibiAI(options);
}

module.exports = { BibiAI, createBibiAI };
