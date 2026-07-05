const { BIBI_PERSONALITY } = require("./Personality");

function getLeader(players = []) {
  return [...players].sort((a, b) => (b.position || 0) - (a.position || 0))[0]?.name || "personne";
}

function getLast(players = []) {
  return [...players].sort((a, b) => (a.position || 0) - (b.position || 0))[0]?.name || "personne";
}

function memoryLines(memory) {
  if (!memory) return "Aucune mémoire.";
  const stats = memory.currentPlayerStats;
  const lines = [];

  lines.push(`Cartes jouées dans ce salon : ${memory.totalCards || 0}`);

  if (stats) {
    lines.push(`Stats du joueur actuel : ${stats.cards} carte(s), ${stats.bonus} bonus, ${stats.malus} malus, ${stats.boire} boire, ${stats.legendary} légendaire(s).`);
    if (stats.streakCount >= 2) {
      lines.push(`Série actuelle : ${stats.streakCount} cartes de type ${stats.streakCategory}.`);
    }
  }

  if (memory.topDrink?.count > 0) lines.push(`Celui qui tombe le plus sur Boire : ${memory.topDrink.name} (${memory.topDrink.count}).`);
  if (memory.topBonus?.count > 0) lines.push(`Celui qui a le plus de Bonus : ${memory.topBonus.name} (${memory.topBonus.count}).`);
  if (memory.topMalus?.count > 0) lines.push(`Celui qui a le plus de Malus : ${memory.topMalus.name} (${memory.topMalus.count}).`);

  return lines.join("\n");
}

function buildAnnouncementPrompt({ roomCode, gameMode, player, action, caseNumber, dice, state, players, memory }) {
  const safePlayers = players || [];
  const history = (state?.history || [])
    .slice(0, 5)
    .map(h => `- ${h.playerName}: ${h.title} (${h.category})`)
    .join("\n");

  return `${BIBI_PERSONALITY}

Contexte de la partie :
- Salon : ${roomCode || "inconnu"}
- Mode : ${gameMode || "inconnu"}
- Joueurs : ${safePlayers.map(p => p.name).join(", ") || "inconnus"}
- Premier au plateau : ${getLeader(safePlayers)}
- Dernier au plateau : ${getLast(safePlayers)}
- Actions jouées : ${state?.totalActions || 0}
- Dé lancé : ${dice || "aucun"}
- Historique récent :
${history || "Aucun historique."}

Mémoire Bibi :
${memoryLines(memory)}

Carte à présenter sans répéter son effet :
- Joueur : ${player?.name || state?.playerName || "joueur"}
- Case : ${caseNumber || state?.caseNumber || 0}
- Catégorie : ${action?.category || state?.category || "inconnue"}
- Titre : ${action?.title || state?.title || "Carte"}
- Effet exact à ne pas répéter : ${action?.text || state?.text || ""}
- Puissance : ${action?.powerLevel || state?.powerLevel || 1}
- Légendaire : ${(action?.isLegendary || state?.isLegendary) ? "oui" : "non"}

Écris uniquement une introduction de Bibi.
Maximum 2 phrases.
Ne répète jamais l'effet exact de la carte.
Ne répète jamais le texte de la carte.
Ne dis jamais au joueur quoi faire.
Ne redis jamais "Avance de", "Bois", "Recule", "Passe ton tour", "Relance", ni l'action exacte.
Tu dois uniquement créer de l'ambiance, du suspense ou une petite blague.
La carte affichera elle-même l'effet.
`;
}

module.exports = { buildAnnouncementPrompt };
