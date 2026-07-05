const { OllamaClient } = require("./OllamaClient");
const { buildAnnouncementPrompt } = require("./PromptBuilder");
const config = require("./config");
const { BibineMemory } = require("./memory/BibineMemory");
const { GameMemory } = require("./memory/GameMemory");
const { MoodManager } = require("./mood/MoodManager");
const { GameAnalyzer } = require("./game/GameAnalyzer");

class BibineAI {

    constructor(options = {}) {

    this.client = options.client || new OllamaClient();

    this.enabled = options.enabled ?? config.enabled;

    this.memory = new BibineMemory();

    this.gameMemory = new GameMemory();

    this.mood = new MoodManager();

    this.gameAnalyzer = new GameAnalyzer();

}

    fallback(context) {

        const joueur = context.player?.name || "Joueur";

        return `🍺 ${joueur}... Bibine garde un œil sur toi...`;

    }

    clean(text) {

        return text
            .replace(/<think>[\s\S]*?<\/think>/gi, "")
            .replace(/^Bibine\s*:?/i, "")
            .replace(/\n{3,}/g, "\n\n")
            .trim();

    }

    async announce(context) {

        if (!this.enabled)
            return this.fallback(context);

        try {

           const stats = this.memory.update(
    context.player?.name || "Joueur",
    context.action || {}
);

            context.playerStats = stats;
            const persistentStats = this.gameMemory.update(
    context.player?.name || "Joueur",
    context.action || {}
);

context.persistentStats = persistentStats;

            context.gameStats = {

    totalPlayers: context.players?.length || 0,

    totalActions: context.totalActions || 0,

    roomCode: context.roomCode || ""

};

            
            context.mood = this.mood.update(context.gameStats);

            context.gameAnalysis = this.gameAnalyzer.analyze(context);

            const prompt = buildAnnouncementPrompt(context);

            const response = await this.client.generate(prompt);

            if (!response)
                return this.fallback(context);

            return this.clean(response);

        }
        catch (err) {

            console.error("BibineAI :", err.message);

            return this.fallback(context);

        }

    }

}

function createBibineAI(options = {}) {

    return new BibineAI(options);

}

module.exports = {

    BibineAI,

    createBibineAI

};