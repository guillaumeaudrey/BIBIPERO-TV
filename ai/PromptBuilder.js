const { BIBINE_PERSONALITY } = require("./Personality");

function leader(players = []) {

    if (!players.length) return "personne";

    return [...players]
        .sort((a, b) => (b.position || 0) - (a.position || 0))[0].name;

}

function last(players = []) {

    if (!players.length) return "personne";

    return [...players]
        .sort((a, b) => (a.position || 0) - (b.position || 0))[0].name;

}

function buildAnnouncementPrompt(ctx = {}) {

    const history = (ctx.state?.history || [])
        .slice(-5)
        .map(h => `• ${h.playerName} : ${h.title}`)
        .join("\n");

    return `
${BIBINE_PERSONALITY}

CONTEXTE

Salon : ${ctx.roomCode || "?"}

Mode : ${ctx.gameMode || "?"}

Joueurs :
${(ctx.players || []).map(p => "- " + p.name).join("\n")}

Premier :
${leader(ctx.players)}

Dernier :
${last(ctx.players)}

Historique :
${history || "Aucun"}

JOUEUR

Nom :
${ctx.player?.name || "Joueur"}

Case :
${ctx.caseNumber || 0}

CARTE

Catégorie :
${ctx.action?.category || ""}

Titre :
${ctx.action?.title || ""}

Effet :
${ctx.action?.text || ""}

Puissance :
${ctx.action?.powerLevel || 1}

Légendaire :
${ctx.action?.isLegendary ? "Oui" : "Non"}

MISSION

Fais UNE annonce de Bibine.

Maximum 2 phrases.

Ne répète jamais le texte de la carte.

Ne répète jamais son effet.

Ne dis jamais quoi faire.

Ne change jamais les règles.

Fais uniquement monter l'ambiance.

Réponds uniquement par l'annonce.
`;

}

module.exports = {

    buildAnnouncementPrompt

};