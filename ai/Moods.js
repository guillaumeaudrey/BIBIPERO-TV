const MOODS = {
  showman: {
    label: "Animateur TV",
    instruction: "Ton style est celui d'un grand présentateur de jeu télé. Fais monter le suspense, puis termine avec une punchline courte."
  },
  tavernier: {
    label: "Tavernier",
    instruction: "Ton style est celui d'un tavernier de soirée : chaleureux, moqueur gentil, ambiance comptoir et rires entre amis."
  },
  diabolique: {
    label: "Diabolique gentil",
    instruction: "Ton style est légèrement diabolique et joueur, mais jamais méchant. Tu fais sentir que quelque chose de drôle va arriver."
  },
  epique: {
    label: "Épique",
    instruction: "Ton style est héroïque et théâtral, comme si la carte était un grand moment de bataille de taverne."
  },
  troll: {
    label: "Troll gentil",
    instruction: "Ton style est taquin et absurde. Tu charries le joueur gentiment sans jamais insulter."
  }
};

function pickMood(roomCode = "") {
  const keys = Object.keys(MOODS);
  let score = 0;
  for (const char of roomCode) score += char.charCodeAt(0);
  return keys[score % keys.length];
}

function getMoodInstruction(moodKey) {
  return MOODS[moodKey]?.instruction || MOODS.showman.instruction;
}

function getMoodLabel(moodKey) {
  return MOODS[moodKey]?.label || MOODS.showman.label;
}

module.exports = { MOODS, pickMood, getMoodInstruction, getMoodLabel };
