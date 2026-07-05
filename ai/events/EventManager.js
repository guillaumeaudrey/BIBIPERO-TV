const config = require('../config');
class EventManager {
  constructor() { this.activeEvent = null; this.lastEventAction = 0; }
  update(context = {}) {
    const total = context.gameStats?.totalActions || 0;
    const cat = context.action?.category || '';
    if (context.action?.isLegendary) return this.set('legendary', total);
    if (cat === 'final-boire') return this.set('final', total);
    if (total > 0 && total % config.events.chaosEvery === 0) return this.set('chaos', total);
    if (total > 0 && total % config.events.happyHourEvery === 0) return this.set('happy-hour', total);
    if (this.activeEvent && total - this.lastEventAction <= 3) return this.activeEvent;
    this.activeEvent = null;
    return null;
  }
  set(name, total) { this.activeEvent = name; this.lastEventAction = total; return name; }
}
module.exports = { EventManager };
