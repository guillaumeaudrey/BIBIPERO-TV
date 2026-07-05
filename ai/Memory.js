class BibiMemory {
  constructor() {
    this.rooms = new Map();
  }

  getRoom(roomCode = "default") {
    if (!this.rooms.has(roomCode)) {
      this.rooms.set(roomCode, {
        startedAt: Date.now(),
        totalAnnouncements: 0,
        players: {},
        categories: {},
        legendaryCount: 0,
        lastPlayer: null,
        lastCategory: null
      });
    }
    return this.rooms.get(roomCode);
  }

  remember(context = {}) {
    const roomCode = context.roomCode || "default";
    const room = this.getRoom(roomCode);
    const playerName = context.player?.name || context.state?.playerName || "joueur";
    const category = context.action?.category || context.state?.category || "inconnue";

    if (!room.players[playerName]) {
      room.players[playerName] = {
        actions: 0,
        drinks: 0,
        bonus: 0,
        malus: 0,
        legendary: 0,
        streak: 0,
        lastCategory: null
      };
    }

    const p = room.players[playerName];
    p.actions += 1;

    if (["boire", "final-boire"].includes(category)) p.drinks += 1;
    if (category === "bonus") p.bonus += 1;
    if (category === "malus") p.malus += 1;
    if (context.action?.isLegendary || context.state?.isLegendary) {
      p.legendary += 1;
      room.legendaryCount += 1;
    }

    p.streak = p.lastCategory === category ? p.streak + 1 : 1;
    p.lastCategory = category;

    room.categories[category] = (room.categories[category] || 0) + 1;
    room.totalAnnouncements += 1;
    room.lastPlayer = playerName;
    room.lastCategory = category;

    return this.snapshot(roomCode, playerName);
  }

  snapshot(roomCode = "default", playerName = "joueur") {
    const room = this.getRoom(roomCode);
    const p = room.players[playerName] || {};
    const durationMin = Math.max(1, Math.round((Date.now() - room.startedAt) / 60000));

    return {
      room: {
        durationMin,
        totalAnnouncements: room.totalAnnouncements,
        legendaryCount: room.legendaryCount,
        mostUsedCategory: Object.entries(room.categories).sort((a, b) => b[1] - a[1])[0]?.[0] || "aucune"
      },
      player: {
        actions: p.actions || 0,
        drinks: p.drinks || 0,
        bonus: p.bonus || 0,
        malus: p.malus || 0,
        legendary: p.legendary || 0,
        streak: p.streak || 0,
        lastCategory: p.lastCategory || "aucune"
      }
    };
  }
}

module.exports = { BibiMemory };
