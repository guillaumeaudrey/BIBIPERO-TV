const { BIBI_PERSONALITY } = require("./Personality");
const { getMoodInstruction, getMoodLabel } = require("./Moods");

function getLeader(players = []) {
  return [...players].sort((a, b) => (b.position || 0) - (a.position || 0))[0]?.name || "personne";
}

function getLast(players = []) {
  return [...players].sort((a, b) => (a.position || 0) - (b.position || 0))[0]?.name || "personne";
}

function categoryHint(category = "") {
  const hints = {
    bonus: "ambiance chance, petit sourire, destin favorable",
    malus: "ambiance danger drôle, suspense, galère qui arrive",
    boire: "ambiance comptoir et pression de soirée, sans ordonner de boire",
    "final-boire": "ambiance finale épique, dernier moment fort",
    de: "ambiance hasard, roulette, destin du dé",
    relance: "ambiance rebondissement, deuxième chance ou piège",
    designation: "ambiance choix cruel, regard vers les autres joueurs",
    "gage-social": "ambiance scène sociale, moment gênant mais drôle",
    retour: "ambiance marche arrière, destin qui se moque",
    reveil: "ambiance coup de théâtre, réveil brutal",
    "devant-derriere": "ambiance choix impossible, suspense"
  };
  return hints[category] || "ambiance festive et mystérieuse";
}

function buildAnnouncementPrompt({ roomCode, gameMode, player, action, caseNumber, dice, state, players, memory, mood }) {
  const safePlayers = players || [];
  const category = action?.category || state?.category || "inconnue";
  const playerName = player?.name || state?.playerName || "joueur";
  const history = (state?.history || [])
    .slice(0, 5)
    .map(h => `- ${h.playerName}: ${h.title} (${h.category})`)
    .join("\n");

  return `${BIBI_PERSONALITY}

Humeur actuelle de Bibi : ${getMoodLabel(mood)}
${getMoodInstruction(mood)}

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

Mémoire de Bibi :
- Durée environ : ${memory?.room?.durationMin || 1} min
- Annonces de Bibi : ${memory?.room?.totalAnnouncements || 0}
- Catégorie la plus fréquente : ${memory?.room?.mostUsedCategory || "aucune"}
- Cartes légendaires vues : ${memory?.room?.legendaryCount || 0}
- Actions du joueur : ${memory?.player?.actions || 0}
- Bonus du joueur : ${memory?.player?.bonus || 0}
- Malus du joueur : ${memory?.player?.malus || 0}
- Série actuelle du joueur : ${memory?.player?.streak || 0} fois la catégorie ${memory?.player?.lastCategory || "aucune"}

Carte qui va s'afficher après ton annonce :
- Joueur : ${playerName}
- Case : ${caseNumber || state?.caseNumber || 0}
- Catégorie : ${category}
- Titre : ${action?.title || state?.title || "Carte"}
- Effet exact, à NE PAS répéter : ${action?.text || state?.text || ""}
- Puissance : ${action?.powerLevel || state?.powerLevel || 1}
- Légendaire : ${(action?.isLegendary || state?.isLegendary) ? "oui" : "non"}

Style attendu : ${categoryHint(category)}.

Écris uniquement une introduction de Bibi.
Maximum 2 phrases.
Ne répète jamais l'effet exact de la carte.
Ne répète jamais le texte de la carte.
Ne dis jamais au joueur quoi faire.
Ne redis jamais les mots d'action comme : avance, recule, bois, passe ton tour, donne, prends, relance.
Tu dois uniquement créer de l'ambiance, du suspense ou une petite blague.
La carte affichera elle-même l'effet.
`;
}

module.exports = { buildAnnouncementPrompt };
