const config = require("./config");

class OllamaClient {

    constructor() {

        this.url = config.ollama.url;
        this.model = config.ollama.model;

    }

    async generate(prompt) {

        const controller = new AbortController();

        const timeout = setTimeout(() => {

            controller.abort();

        }, config.ollama.timeout);

        try {

            const response = await fetch(this.url, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

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

            if (!response.ok)
                throw new Error(`Ollama ${response.status}`);

            const json = await response.json();

            return (json.response || "")
                .replace(/<think>[\s\S]*?<\/think>/gi, "")
                .trim();

        }
        finally {

            clearTimeout(timeout);

        }

    }

}

module.exports = {

    OllamaClient

};