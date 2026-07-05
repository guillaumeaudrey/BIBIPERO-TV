const { OllamaClient } = require("./OllamaClient");
const { buildAnnouncementPrompt } = require("./PromptBuilder");
const config = require("./config");
const { BibineMemory } = require("./memory/BibineMemory");

class BibineAI {

    constructor(options = {}) {

    this.client = options.client || new OllamaClient();

    this.enabled = options.enabled ?? config.enabled;

    this.memory = new BibineMemory();

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

           const stats = this.memory.update(context.player.name,context.action);

            context.playerStats = stats;

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