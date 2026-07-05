const { OllamaClient } = require('./OllamaClient');
const { buildAnnouncementPrompt } = require('./PromptBuilder');
const { BibineMemory } = require('./memory/BibineMemory');
const { GameMemory } = require('./memory/GameMemory');
const { MoodManager } = require('./mood/MoodManager');
const { GameAnalyzer } = require('./game/GameAnalyzer');
const { EventManager } = require('./events/EventManager');
const config = require('./config');

class BibineAI {
  constructor(options = {}) {
    this.client = options.client || new OllamaClient(options);
    this.enabled = options.enabled ?? config.enabled;
    this.memory = new BibineMemory();
    this.gameMemory = new GameMemory();
    this.mood = new MoodManager();
    this.gameAnalyzer = new GameAnalyzer();
    this.events = new EventManager();
  }

  fallback(context = {}) {
    const name = context.player?.name || 'Joueur';
    const event = context.activeEvent;
    if (event === 'legendary') return `👑 ${name}... Bibine sent que la taverne vient de basculer dans la légende.`;
    if (event === 'chaos') return `🔥 ${name}... le chaos commence à sourire, et ce n'est jamais bon signe.`;
    return `🍺 ${name}... Bibine garde un œil sur toi.`;
  }

  clean(text = '') {
    return text
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/^Bibine\s*:?\s*/i, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  async announce(context = {}) {
    if (!this.enabled) return this.fallback(context);

    try {
      const name = context.player?.name || 'Joueur';
      const action = context.action || {};

      context.playerStats = this.memory.update(name, action);
      context.persistentStats = this.gameMemory.update(name, action);
      context.gameStats = {
        totalPlayers: context.players?.length || 0,
        totalActions: context.totalActions || context.state?.totalActions || 0,
        roomCode: context.roomCode || ''
      };
      context.mood = this.mood.update(context.gameStats, action);
      context.gameAnalysis = this.gameAnalyzer.analyze(context);
      context.activeEvent = this.events.update(context);

      const prompt = buildAnnouncementPrompt(context);
      const response = await this.client.generate(prompt);
      return response ? this.clean(response) : this.fallback(context);
    } catch (err) {
      console.error('BibineAI :', err.message);
      return this.fallback(context);
    }
  }
}

function createBibineAI(options = {}) { return new BibineAI(options); }
module.exports = { BibineAI, createBibineAI };
