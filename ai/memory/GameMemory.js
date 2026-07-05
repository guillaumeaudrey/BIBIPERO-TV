const fs = require("fs");
const path = require("path");

class GameMemory {

    constructor() {

        this.folder = path.join(__dirname, "data");
        this.file = path.join(this.folder, "players.json");

        if (!fs.existsSync(this.folder))
            fs.mkdirSync(this.folder, { recursive: true });

        if (!fs.existsSync(this.file))
            fs.writeFileSync(this.file, "{}");

        this.players = JSON.parse(
            fs.readFileSync(this.file, "utf8")
        );

    }

    save() {

        fs.writeFileSync(
            this.file,
            JSON.stringify(this.players, null, 2)
        );

    }

    get(name) {

        if (!this.players[name]) {

            this.players[name] = {

                games: 0,
                drinks: 0,
                bonuses: 0,
                maluses: 0,
                legendary: 0

            };

        }

        return this.players[name];

    }

    update(playerName, action) {

        const p = this.get(playerName);

        p.games++;

        switch (action.category) {

            case "bonus":
                p.bonuses++;
                break;

            case "malus":
                p.maluses++;
                break;

            case "boire":
            case "final-boire":
                p.drinks++;
                break;

        }

        if (action.isLegendary)
            p.legendary++;

        this.save();

        return p;

    }

}

module.exports = {

    GameMemory

};