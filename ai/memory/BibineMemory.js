class BibineMemory {

    constructor() {

        this.players = new Map();

    }

    get(name) {

        if (!this.players.has(name)) {

            this.players.set(name, {

                name,

                drinks: 0,
                bonuses: 0,
                maluses: 0,
                legendary: 0,

                streakBonus: 0,
                streakMalus: 0,

                lastCategory: "",

                actions: 0

            });

        }

        return this.players.get(name);

    }

    update(playerName, action) {

        const p = this.get(playerName);

        p.actions++;

        switch (action.category) {

            case "bonus":

                p.bonuses++;
                p.streakBonus++;
                p.streakMalus = 0;

                break;

            case "malus":

                p.maluses++;
                p.streakMalus++;
                p.streakBonus = 0;

                break;

            case "boire":
            case "final-boire":

                p.drinks++;

                break;

        }

        if (action.isLegendary)
            p.legendary++;

        p.lastCategory = action.category;

        return p;

    }

}

module.exports = {

    BibineMemory

};