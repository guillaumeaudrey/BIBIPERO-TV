const actions = [
  { category: "boire", title: "Le Patron T’offre Un Verre", text: "Bois avec le proprio du jeu.", powerLevel: 1 },
  { category: "boire", title: "Tout le monde boit", text: "Tous les joueurs boivent 1 gorgée.", powerLevel: 1 },
  { category: "boire", title: "À gauche", text: "La personne à ta gauche boit 2 gorgées.", powerLevel: 1 },
  { category: "boire", title: "À droite", text: "La personne à ta droite boit 2 gorgées.", powerLevel: 1 }
];

let lastAction = null;

function getRandomAction(category) {
  let list = actions.filter(a => a.category === category);

  if (list.length === 0) {
    return {
      category: "inconnu",
      title: "QR inconnu",
      text: "Cette catégorie n’existe pas encore",
      powerLevel: 1
    };
  }

  if (lastAction && list.length > 1) {
    list = list.filter(a =>
      a.title !== lastAction.title ||
      a.text !== lastAction.text
    );
  }

  const action = list[Math.floor(Math.random() * list.length)];

  lastAction = action;
  return action;
}

module.exports = {
  getRandomAction
};