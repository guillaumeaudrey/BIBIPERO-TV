const { OllamaClient } = require("./OllamaClient");
const { buildAnnouncementPrompt } = require("./PromptBuilder");
const { BibiMemory } = require("./Memory");
const { pickMood } = require("./Moods");

const FORBIDDEN_ACTION_WORDS = [
  "avance", "avances", "recule", "recules", "bois", "boire", "gorgée", "gorgées",
  "passe ton tour", "donne", "prends", "relance", "échange"
];

function fallbackAnnouncement({ player, action }) {
  const name = player?.name || "joueur";
  const category = action?.category || "carte";

  const lines = {
    bonus: `🍀 ${name}, j'ai comme l'impression que la chance vient de te faire un clin d'œil. Profite de la lumière, ça ne dure jamais longtemps ici !`,
    malus: `😈 ${name}, le plateau vient de sourire... et je n'aime pas trop ce sourire. Ça sent le petit moment de solitude !`,
    boire: `🍺 ${name}, Bibi te regarde avec ce fameux regard de taverne. Le public attend la suite !`,
    "final-boire": `🔥 ${name}, on arrive dans la zone où les héros tremblent et les verres brillent. La finale commence à sentir très fort !`,
    de: `🎲 ${name}, le hasard vient de sortir de sa cachette. Et crois-moi, il n'est pas venu pour décorer la table !`,
    relance: `🎲 ${name}, le destin n'avait visiblement pas fini de jouer avec toi. Ça repart pour un petit frisson !`,
    designation: `👀 ${name}, tous les regards se tournent vers toi. Choisis bien ton moment de gloire... ou de honte !`,
    "gage-social": `😂 ${name}, Bibi sent venir un grand moment de télévision. Respire, souris, et assume la scène !`,
    retour: `🙃 ${name}, le plateau vient de te faire une petite blague. Pas sûr que tu la trouves drôle tout de suite !`
  };

  return lines[category] || `🍺 ${name}, Bibi annonce un nouveau moment de chaos contrôlé. Prépare ton plus beau regard de champion !`;
}

function cleanText(text = "", context = {}) {
  let cleaned = text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/^Bibi\s*:?\s*/i, "")
    .replace(/["“”]/g, "")
    .trim();

  const effect = context.action?.text || context.state?.text || "";
  if (effect && cleaned.toLowerCase().includes(effect.toLowerCase().slice(0, 30))) {
    return "";
  }

  const lowered = cleaned.toLowerCase();
  if (FORBIDDEN_ACTION_WORDS.some(w => lowered.includes(w))) {
    return "";
  }

  const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 2);
  cleaned = sentences.join(" ").trim();

  if (cleaned.length > 220) cleaned = cleaned.slice(0, 217).trim() + "...";
  return cleaned;
}

class BibiAI {
  constructor(options = {}) {
    this.client = options.client || new OllamaClient(options);
    this.enabled = options.enabled !== false;
    this.memory = options.memory || new BibiMemory();
    this.roomMoods = new Map();
  }

  getMood(roomCode) {
    const code = roomCode || "default";
    if (!this.roomMoods.has(code)) this.roomMoods.set(code, pickMood(code));
    return this.roomMoods.get(code);
  }

  async announce(context) {
    const memory = this.memory.remember(context);
    const mood = this.getMood(context.roomCode);

    if (!this.enabled) return fallbackAnnouncement(context);

    try {
      const prompt = buildAnnouncementPrompt({ ...context, memory, mood });
      const rawText = await this.client.generate(prompt);
      const text = cleanText(rawText, context);
      return text || fallbackAnnouncement(context);
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
