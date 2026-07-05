const fs = require('fs');
const path = require('path');
class GameMemory {
  constructor() {
    this.folder = path.join(__dirname, 'data');
    this.file = path.join(this.folder, 'players.json');
    fs.mkdirSync(this.folder, { recursive: true });
    if (!fs.existsSync(this.file)) fs.writeFileSync(this.file, '{}');
    try { this.players = JSON.parse(fs.readFileSync(this.file, 'utf8')); }
    catch { this.players = {}; }
  }
  save() { fs.writeFileSync(this.file, JSON.stringify(this.players, null, 2)); }
  get(name = 'Joueur') {
    if (!this.players[name]) this.players[name] = { actions: 0, drinks: 0, bonuses: 0, maluses: 0, legendary: 0, wins: 0 };
    return this.players[name];
  }
  update(playerName, action = {}) {
    const p = this.get(playerName);
    const c = action.category || '';
    p.actions++;
    if (c === 'bonus') p.bonuses++;
    if (c === 'malus') p.maluses++;
    if (['boire','final-boire'].includes(c)) p.drinks++;
    if (action.isLegendary) p.legendary++;
    this.save();
    return p;
  }
}
module.exports = { GameMemory };
