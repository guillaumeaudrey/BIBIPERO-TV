class EventManager {
    constructor() {
        this.activeEvent = null;
        this.lastEventAction = 0;
    }

    update(context = {}) {
        const totalActions = context.gameStats?.totalActions || 0;
        const isLegendary = context.action?.isLegendary === true;
        const category = context.action?.category || "";

        if (isLegendary) {
            this.activeEvent = "legendary";
            this.lastEventAction = totalActions;
            return this.activeEvent;
        }

        if (totalActions > 0 && totalActions % 12 === 0) {
            this.activeEvent = "happy-hour";
            this.lastEventAction = totalActions;
            return this.activeEvent;
        }

        if (totalActions > 0 && totalActions % 20 === 0) {
            this.activeEvent = "chaos";
            this.lastEventAction = totalActions;
            return this.activeEvent;
        }

        if (category === "final-boire") {
            this.activeEvent = "final";
            this.lastEventAction = totalActions;
            return this.activeEvent;
        }

        if (this.activeEvent && totalActions - this.lastEventAction <= 3) {
            return this.activeEvent;
        }

        this.activeEvent = null;
        return null;
    }
}

module.exports = { EventManager };