class BibineMemory {
  constructor() {
    this.rooms = new Map();
  }

  getRoom(roomCode = "default") {
    if (!this.rooms.has(roomCode)) {
      this.rooms.set(roomCode, {
        totalCards: 0,
        categories: {},
        players: {},
        lastEvents: [],
        startedAt: Date.now()
      });
    }
    return this.rooms.get(roomCode);
  }

  update(context = {}) {
    const roomCode = context.roomCode || "default";
    const room = this.getRoom(roomCode);
    const playerName = context.player?.name || context.state?.playerName || "joueur";
    const category = context.action?.category || context.state?.category || "inconnue";
    const title = context.action?.title || context.state?.title || "Carte";
    const isLegendary = Boolean(context.action?.isLegendary || context.state?.isLegendary);

    room.totalCards += 1;
    room.categories[category] = (room.categories[category] || 0) + 1;

    if (!room.players[playerName]) {
      room.players[playerName] = {
        cards: 0,
        bonus: 0,
        malus: 0,
        boire: 0,
        legendary: 0,
        lastCategory: null,
        streakCategory: null,
        streakCount: 0
      };
    }

    const stats = room.players[playerName];
    stats.cards += 1;

    const key = String(category).toLowerCase();
    if (key.includes("bonus")) stats.bonus += 1;
    if (key.includes("malus")) stats.malus += 1;
    if (key.includes("boire")) stats.boire += 1;
    if (isLegendary) stats.legendary += 1;

    if (stats.lastCategory === category) {
      stats.streakCategory = category;
      stats.streakCount += 1;
    } else {
      stats.streakCategory = category;
      stats.streakCount = 1;
    }

    stats.lastCategory = category;

    room.lastEvents.unshift({
      playerName,
      category,
      title,
      isLegendary,
      at: Date.now()
    });
    room.lastEvents = room.lastEvents.slice(0, 8);

    return this.summary(roomCode, playerName);
  }

  summary(roomCode = "default", playerName = null) {
    const room = this.getRoom(roomCode);
    const current = playerName ? room.players[playerName] : null;
    const topDrink = Object.entries(room.players)
      .sort((a, b) => (b[1].boire || 0) - (a[1].boire || 0))[0];
    const topBonus = Object.entries(room.players)
      .sort((a, b) => (b[1].bonus || 0) - (a[1].bonus || 0))[0];
    const topMalus = Object.entries(room.players)
      .sort((a, b) => (b[1].malus || 0) - (a[1].malus || 0))[0];

    return {
      totalCards: room.totalCards,
      categories: room.categories,
      currentPlayerStats: current,
      topDrink: topDrink ? { name: topDrink[0], count: topDrink[1].boire } : null,
      topBonus: topBonus ? { name: topBonus[0], count: topBonus[1].bonus } : null,
      topMalus: topMalus ? { name: topMalus[0], count: topMalus[1].malus } : null,
      lastEvents: room.lastEvents
    };
  }
}

module.exports = { BibineMemory };
