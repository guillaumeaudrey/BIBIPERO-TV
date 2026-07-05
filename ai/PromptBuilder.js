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

Écris uniquement une introduction de Bibi.
Maximum 2 phrases.

Ne répète jamais l'effet exact de la carte.
Ne répète jamais le texte de la carte.
Ne dis jamais au joueur quoi faire.
Ne redis jamais "Avance de...", "Bois...", "Recule...", etc.

Tu dois uniquement créer de l'ambiance, du suspense ou une petite blague.
La carte affichera elle-même l'effet.
`;
}

module.exports = { buildAnnouncementPrompt };
