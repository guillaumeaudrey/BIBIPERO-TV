class BibineMemory {
  constructor() { this.players = new Map(); }
  get(name = 'Joueur') {
    if (!this.players.has(name)) {
      this.players.set(name, { name, actions: 0, drinks: 0, bonuses: 0, maluses: 0, legendary: 0, streakBonus: 0, streakMalus: 0, lastCategory: '' });
    }
    return this.players.get(name);
  }
  update(playerName, action = {}) {
    const p = this.get(playerName);
    const category = action.category || '';
    p.actions++;
    if (category === 'bonus') { p.bonuses++; p.streakBonus++; p.streakMalus = 0; }
    else if (category === 'malus') { p.maluses++; p.streakMalus++; p.streakBonus = 0; }
    else { p.streakBonus = 0; p.streakMalus = 0; }
    if (['boire','final-boire'].includes(category)) p.drinks++;
    if (action.isLegendary) p.legendary++;
    p.lastCategory = category;
    return p;
  }
}
module.exports = { BibineMemory };
