class MoodManager {
  constructor() { this.current = 'animateur'; }
  update(gameStats = {}, action = {}) {
    const n = gameStats.totalActions || 0;
    if (action.isLegendary) return (this.current = 'epique');
    if (n < 10) return (this.current = 'animateur');
    if (n < 20) return (this.current = 'tavernier');
    if (n < 35) return (this.current = 'taquin');
    if (n < 50) return (this.current = 'roi');
    return (this.current = 'chaos');
  }
}
module.exports = { MoodManager };
