const { BIBI_PERSONALITY } = require("./Personality");

function getLeader(players = []) {
  return [...players].sort((a, b) => (b.position || 0) - (a.position || 0))[0]?.name || "personne";
}

function getLast(players = []) {
  return [...players].sort((a, b) => (a.position || 0) - (b.position || 0))[0]?.name || "personne";
}

function buildAnnouncementPrompt({ roomCode, gameMode, player, action, caseNumber, dice, state, players }) {
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

Carte à annoncer :
- Joueur : ${player?.name || state?.playerName || "joueur"}
- Case : ${caseNumber || state?.caseNumber || 0}
- Catégorie : ${action?.category || state?.category || "inconnue"}
- Titre : ${action?.title || state?.title || "Carte"}
- Effet exact : ${action?.text || state?.text || ""}
- Puissance : ${action?.powerLevel || state?.powerLevel || 1}
- Légendaire : ${(action?.isLegendary || state?.isLegendary) ? "oui" : "non"}

Écris uniquement l'annonce de Bibi.
Maximum 3 phrases.
Ne rajoute pas de règle, ne change pas l'effet.
`;
}

module.exports = { buildAnnouncementPrompt };
