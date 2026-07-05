const { BIBINE_PERSONALITY } = require('./Personality');
const { phraseHints } = require('./personality/Phrases');

function listPlayers(players = []) {
  return players.map(p => `- ${p.name} : case ${p.position || 0}, boissons ${p.totalDrinks || 0}`).join('\n') || 'Aucun joueur connu.';
}

function recentHistory(state = {}) {
  return (state.history || [])
    .slice(0, 5)
    .map(h => `- ${h.playerName}: ${h.title} (${h.category})`)
    .join('\n') || 'Aucun historique.';
}

function buildAnnouncementPrompt(ctx = {}) {
  return `${BIBINE_PERSONALITY}

CONTEXTE DE PARTIE
Salon : ${ctx.roomCode || '?'}
Mode : ${ctx.gameMode || '?'}
Humeur actuelle : ${ctx.mood || 'animateur'}
Événement actif : ${ctx.activeEvent || 'aucun'}
Actions jouées : ${ctx.gameStats?.totalActions || ctx.state?.totalActions || 0}

JOUEURS
${listPlayers(ctx.players)}

ANALYSE
Premier : ${ctx.gameAnalysis?.leader || 'inconnu'} case ${ctx.gameAnalysis?.leaderPosition || 0}
Dernier : ${ctx.gameAnalysis?.last || 'inconnu'} case ${ctx.gameAnalysis?.lastPosition || 0}
Plus proche de la victoire : ${ctx.gameAnalysis?.closestToFinish ?? '?'} case(s)
Plus assoiffé : ${ctx.gameAnalysis?.drinker || 'inconnu'} (${ctx.gameAnalysis?.drinkerCount || 0})

JOUEUR ACTUEL
Nom : ${ctx.player?.name || 'Joueur'}
Case : ${ctx.caseNumber || ctx.state?.caseNumber || 0}
Stats partie : bonus ${ctx.playerStats?.bonuses || 0}, malus ${ctx.playerStats?.maluses || 0}, boissons ${ctx.playerStats?.drinks || 0}, légendaires ${ctx.playerStats?.legendary || 0}
Séries : bonus ${ctx.playerStats?.streakBonus || 0}, malus ${ctx.playerStats?.streakMalus || 0}
Mémoire longue : actions ${ctx.persistentStats?.actions || 0}, bonus ${ctx.persistentStats?.bonuses || 0}, malus ${ctx.persistentStats?.maluses || 0}, boissons ${ctx.persistentStats?.drinks || 0}, légendaires ${ctx.persistentStats?.legendary || 0}

CARTE
Catégorie : ${ctx.action?.category || ctx.state?.category || ''}
Titre : ${ctx.action?.title || ctx.state?.title || ''}
Effet exact à NE PAS RÉPÉTER : ${ctx.action?.text || ctx.state?.text || ''}
Puissance : ${ctx.action?.powerLevel || ctx.state?.powerLevel || 1}
Légendaire : ${(ctx.action?.isLegendary || ctx.state?.isLegendary) ? 'oui' : 'non'}

INSPIRATIONS BIBINE
- ${phraseHints(ctx)}

MISSION
Écris uniquement l'annonce de Bibine.
Maximum 2 phrases.
Ne répète jamais l'effet exact de la carte.
Ne dis jamais au joueur quoi faire.
Ne donne jamais de stratégie.
Tu peux commenter le classement, les séries ou l'événement seulement si c'est drôle ou intéressant.
Adapte le ton à l'humeur : animateur, tavernier, taquin, roi, epique ou chaos.
`;
}
module.exports = { buildAnnouncementPrompt };
