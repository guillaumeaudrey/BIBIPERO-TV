class MoodManager {

    constructor() {

        this.current = "animateur";

    }

    update(game) {

        const actions = game.totalActions || 0;

        if (actions < 10)
            this.current = "animateur";

        else if (actions < 20)
            this.current = "tavernier";

        else if (actions < 35)
            this.current = "pirate";

        else if (actions < 50)
            this.current = "roi";

        else
            this.current = "chaos";

        return this.current;

    }

}

module.exports = {

    MoodManager

};