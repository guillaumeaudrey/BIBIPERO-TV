const actions = [
  { category: "boire", title: "Le Patron T’offre Un Verre", text: "Bois avec le proprio du jeu.", powerLevel: 1, drinkMode: "manual" },

{ category: "boire", title: "Tout le monde boit", text: "Tous les joueurs boivent 1 gorgée.", powerLevel: 1, drinkMode: "all", drinksTaken: 1 },

{ category: "boire", title: "À gauche", text: "La personne à ta gauche boit 2 gorgées.", powerLevel: 1, drinkMode: "choice", drinksGiven: 2 },

{ category: "boire", title: "À droite", text: "La personne à ta droite boit 2 gorgées.", powerLevel: 1, drinkMode: "choice", drinksGiven: 2 },

{ category: "boire", title: "Avec toi", text: "Tout le monde boit avec toi.", powerLevel: 2, drinkMode: "all", drinksTaken: 1 },

{ category: "boire", title: "Solo", text: "Bois 3 gorgées.", powerLevel: 2, drinkMode: "auto", drinksTaken: 3 },

{ category: "boire", title: "Santé", text: "Choisis un joueur. Vous buvez ensemble.", powerLevel: 2, drinkMode: "choice", drinksGiven: 1 },

{ category: "boire", title: "Le dernier", text: "Le dernier joueur à lever son verre boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "boire", title: "Cul sec chrono", text: "Bois ton verre pendant que le groupe compte jusqu’à 5.", powerLevel: 4, drinkMode: "auto", drinksTaken: 10 },

{ category: "boire", title: "Freeze", text: "Le dernier à s’arrêter de bouger boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "boire", title: "Cul sec immédiat", text: "Finis ton verre.", powerLevel: 5, drinkMode: "auto", drinksTaken: 10 },

{ category: "boire", title: "Double cul sec", text: "Choisis quelqu’un. Vous finissez vos verres ensemble.", powerLevel: 5, drinkMode: "choice", drinksGiven: 10 },

{ category: "boire", title: "Le traître", text: "Tout le monde pointe quelqu’un. Le plus pointé boit 5 gorgées.", powerLevel: 3, drinkMode: "manual" },

{ category: "boire", title: "BIBIPERO", text: "Le dernier qui crie BIBIPERO boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "boire", title: "La victime", text: "Choisis une victime. Elle boit pendant 5 secondes.", powerLevel: 3, drinkMode: "choice", drinksGiven: 5 },

{ category: "boire", title: "Regard intense", text: "Fixe un joueur. Le premier qui rigole boit 4 gorgées.", powerLevel: 3, drinkMode: "manual" },

{ category: "boire", title: "Main collée", text: "Le dernier qui pose sa main sur la table boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "boire", title: "Le roi", text: "Distribue 6 gorgées comme tu veux.", powerLevel: 3, drinkMode: "choice", drinksGiven: 6 },

{ category: "boire", title: "Le clown", text: "Fais rire quelqu’un en 5 secondes ou bois.", powerLevel: 2, drinkMode: "auto", drinksTaken: 3 },

{ category: "boire", title: "Le plus bourré", text: "Le groupe désigne le plus bourré. Il boit.", powerLevel: 3, drinkMode: "manual" },

{ category: "boire", title: "No hands", text: "Bois sans les mains.", powerLevel: 3, drinkMode: "auto", drinksTaken: 3 },

{ category: "boire", title: "Le démon", text: "Tout le monde boit sauf toi.", powerLevel: 4, drinkMode: "all", drinksTaken: 1 },

{ category: "boire", title: "Shot surprise", text: "Le groupe prépare un mélange. Tu le bois.", powerLevel: 5, drinkMode: "manual" },

{ category: "boire", title: "Tremblement", text: "Tiens ton verre bras tendu pendant 10 secondes ou bois.", powerLevel: 3, drinkMode: "auto", drinksTaken: 3 },

{ category: "boire", title: "Le juge", text: "Tu choisis qui boit 3 gorgées.", powerLevel: 2, drinkMode: "choice", drinksGiven: 3 },

{ category: "boire", title: "Le fantôme", text: "Ne parle plus jusqu’à ton prochain tour ou bois.", powerLevel: 2, drinkMode: "manual" },

{ category: "boire", title: "La roulette", text: "Choisis gauche ou droite. Le joueur choisi boit.", powerLevel: 2, drinkMode: "choice", drinksGiven: 2 },

{ category: "boire", title: "Le chef d’orchestre", text: "Tout le monde boit quand tu lèves la main jusqu’à ton prochain tour.", powerLevel: 4, drinkMode: "all", drinksTaken: 1 },

{ category: "boire", title: "Le piège", text: "Le prochain qui regarde son téléphone boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "boire", title: "Silence radio", text: "Le premier qui parle boit 3 gorgées.", powerLevel: 2, drinkMode: "manual" },

{ category: "boire", title: "Le missile", text: "Distribue 10 gorgées.", powerLevel: 4, drinkMode: "choice", drinksGiven: 10 },

{ category: "boire", title: "Apéro sauvage", text: "Tout le monde boit debout.", powerLevel: 3, drinkMode: "all", drinksTaken: 1 },

{ category: "boire", title: "Le survivant", text: "Le dernier assis boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "boire", title: "Bombe", text: "Tout le monde boit immédiatement.", powerLevel: 3, drinkMode: "all", drinksTaken: 1 },

{ category: "boire", title: "Le lâche", text: "Refuse de boire ? Recule de 3 cases.", powerLevel: 3, drinkMode: "choice" },

{ category: "boire", title: "Le vampire", text: "Bois une gorgée dans le verre d’un autre joueur.", powerLevel: 3, drinkMode: "manual" },

{ category: "boire", title: "Hardcore", text: "Bois 6 gorgées sans pause.", powerLevel: 4, drinkMode: "auto", drinksTaken: 6 },

{ category: "boire", title: "L’inconnu", text: "Le joueur à ta droite choisit combien tu bois.", powerLevel: 3, drinkMode: "manual" },

{ category: "boire", title: "Le miroir", text: "La prochaine fois que tu bois, un joueur choisi boit aussi.", powerLevel: 4, drinkMode: "choice", drinksGiven: 1 },

{ category: "boire", title: "Case piégée", text: "Le prochain joueur qui tombe sur ta case boit 2 gorgées.", powerLevel: 3, drinkMode: "manual" },

{ category: "boire", title: "La sentence", text: "Le groupe vote : 2 gorgées ou cul sec.", powerLevel: 4, drinkMode: "manual" },

{ category: "boire", title: "Le gladiateur", text: "Défi bras de fer. Le perdant boit.", powerLevel: 3, drinkMode: "manual" },

{ category: "boire", title: "Le chaos", text: "Inverse les verres de deux joueurs.", powerLevel: 4, drinkMode: "manual" },

{ category: "boire", title: "Le champion", text: "Si tu arrives à faire rire le groupe, distribue 5 gorgées.", powerLevel: 3, drinkMode: "choice", drinksGiven: 5 },

    // =========================
    // BOIRE
   // =========================

{ category: "designation", title: "Désigne quelqu’un", text: "Choisis un joueur qui boit 2 gorgées.", powerLevel: 1, drinkMode: "choice", drinksGiven: 2 },

{ category: "designation", title: "Double cible", text: "Choisis 2 joueurs. Ils boivent 1 gorgée chacun.", powerLevel: 2, drinkMode: "choice", drinksGiven: 2 },

{ category: "designation", title: "Vengeance", text: "Choisis quelqu’un qui t’a déjà fait boire. Il boit 2 gorgées.", powerLevel: 2, drinkMode: "choice", drinksGiven: 2 },

{ category: "designation", title: "Le voisin", text: "Choisis ton voisin de gauche ou de droite. Il boit.", powerLevel: 1, drinkMode: "choice", drinksGiven: 1 },

{ category: "designation", title: "Le plus drôle", text: "Le joueur le plus drôle boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "designation", title: "Le plus suspect", text: "Le joueur le plus suspect boit 2 gorgées.", powerLevel: 2, drinkMode: "manual" },

{ category: "designation", title: "Le plus lent", text: "Le joueur le plus lent à réagir boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "designation", title: "La victime", text: "Choisis quelqu’un qui boit 3 gorgées.", powerLevel: 2, drinkMode: "choice", drinksGiven: 3 },

{ category: "designation", title: "Le suspect", text: "Le groupe désigne le plus suspect. Il boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "designation", title: "Le plus bourré", text: "Le joueur qui semble le plus bourré boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "designation", title: "Le mytho", text: "Choisis le plus gros mytho. Il boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "designation", title: "Le BG", text: "Le plus beau joueur distribue 3 gorgées.", powerLevel: 2, drinkMode: "manual" },

{ category: "designation", title: "Le clown", text: "Le joueur qui fait le plus rire le groupe distribue 3 gorgées.", powerLevel: 2, drinkMode: "manual" },

{ category: "designation", title: "Le téléphone", text: "Le dernier à toucher son téléphone boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "designation", title: "Le regard", text: "Fixe un joueur. Le premier qui rigole boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "designation", title: "Le traître", text: "Tout le monde pointe quelqu’un. Le plus pointé boit.", powerLevel: 3, drinkMode: "manual" },

{ category: "designation", title: "Le dormeur", text: "Le joueur le moins réveillé boit 4 gorgées.", powerLevel: 3, drinkMode: "manual" },

{ category: "designation", title: "Mains en l’air", text: "Le dernier à lever les mains boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "designation", title: "Le sniper", text: "Choisis quelqu’un. Il boit immédiatement 2 gorgées.", powerLevel: 3, drinkMode: "choice", drinksGiven: 2 },

{ category: "designation", title: "Voisin de verre", text: "Ton voisin boit avec toi.", powerLevel: 2, drinkMode: "choice", drinksGiven: 1 },

{ category: "designation", title: "La cible", text: "Choisis quelqu’un. Tout le monde lui donne une gorgée.", powerLevel: 3, drinkMode: "choice", drinksGiven: 1 },

{ category: "designation", title: "Le juge", text: "Choisis quelqu’un qui boit 4 gorgées.", powerLevel: 5, drinkMode: "choice", drinksGiven: 4 },

{ category: "designation", title: "Le fou rire", text: "Le prochain qui rigole boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "designation", title: "Température élevée", text: "Le groupe vote : qui est le plus chaud ce soir ? Il boit 2 gorgées.", powerLevel: 2, drinkMode: "manual" },

{ category: "designation", title: "Le cerveau lent", text: "Le dernier à répondre à une question simple boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "designation", title: "Le regard bizarre", text: "Le joueur avec le regard le plus bizarre boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "designation", title: "Le fragile", text: "Le joueur qui tient le moins l’alcool boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "designation", title: "Le roi de l’apéro", text: "Choisis quelqu’un pour distribuer 5 gorgées.", powerLevel: 3, drinkMode: "choice", drinksGiven: 5 },

{ category: "designation", title: "Le survivant", text: "Choisis quelqu’un qui ne boit pas. Tous les autres boivent.", powerLevel: 4, drinkMode: "choice" },

{ category: "designation", title: "La punition", text: "Choisis un joueur. Il boit pendant 5 secondes.", powerLevel: 3, drinkMode: "choice", drinksGiven: 5 },

{ category: "designation", title: "Le détective", text: "Choisis quelqu’un. Il doit répondre à une question ou boire.", powerLevel: 2, drinkMode: "choice", drinksGiven: 2 },

{ category: "designation", title: "Le cascadeur", text: "Choisis quelqu’un pour commencer une cascade.", powerLevel: 3, drinkMode: "choice" },

{ category: "designation", title: "Le coupable", text: "Le groupe décide qui est coupable. Il boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "designation", title: "Le héros", text: "Choisis quelqu’un pour boire à ta place.", powerLevel: 2, drinkMode: "choice", drinksGiven: 1 },

{ category: "designation-retour", title: "Le retardataire", text: "Choisis un joueur. Il recule d’1 case puis rescane.", powerLevel: 3, drinkMode: "choice" },

{ category: "designation-avance", title: "Le guide", text: "Choisis quelqu’un pour avancer d’1 case et rescanner.", powerLevel: 3, drinkMode: "choice" },

{ category: "designation", title: "La case maudite", text: "Choisis un joueur. S’il tombe sur ta case plus tard, il boit 2 gorgées.", powerLevel: 3, drinkMode: "choice", drinksGiven: 2 },

// =========================
// DÉ
// =========================

{ category: "de", title: "Lance le dé", text: "Bois le nombre obtenu.", powerLevel: 2, drinkMode: "dice" },

{ category: "de", title: "Pair ou impair", text: "Pair = tu bois. Impair = tu distribues.", powerLevel: 2, drinkMode: "dice" },

{ category: "de", title: "Dé méchant", text: "Choisis un joueur. Il boit le résultat du dé.", powerLevel: 3, drinkMode: "dice-choice" },

{ category: "de", title: "Double dé", text: "Lance deux dés. Additionne le résultat.", powerLevel: 4, drinkMode: "double-dice" },

{ category: "de", title: "Dé surprise", text: "Si tu fais 1, tout le monde boit. Sinon tu bois.", powerLevel: 3, drinkMode: "dice" },

{ category: "de", title: "Dé BIBIPERO", text: "Le dernier qui crie BIBIPERO boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "de", title: "Dé rapide", text: "Le dernier à taper la table boit le résultat du dé.", powerLevel: 2, drinkMode: "dice" },

{ category: "de", title: "Dé du roi", text: "Si tu fais 6, distribue 10 gorgées.", powerLevel: 4, drinkMode: "dice" },

{ category: "de", title: "Dé x2", text: "Le résultat du dé est doublé.", powerLevel: 4, drinkMode: "double-dice" },

{ category: "de", title: "Dé apocalypse", text: "Si tu fais 6, tout le monde boit 3 gorgées.", powerLevel: 5, drinkMode: "dice" },

{ category: "de", title: "Dé fatal", text: "Si tu fais 1 ou 2, bois 4 gorgées.", powerLevel: 5, drinkMode: "dice" },

{ category: "de", title: "Dé téléphone", text: "Si tu fais 6, montre ta dernière photo ou bois.", powerLevel: 3, drinkMode: "dice" },

{ category: "de", title: "Dé de la honte", text: "Si tu fais moins de 3, raconte une honte ou bois.", powerLevel: 2, drinkMode: "dice" },

{ category: "de", title: "Dé ultime", text: "6 = distribue 6 gorgées. 1 = bois 4 gorgées.", powerLevel: 4, drinkMode: "dice" },

{ category: "de", title: "Dé du chaos", text: "Le groupe invente une règle selon ton résultat.", powerLevel: 3, drinkMode: "manual" },

{ category: "de-rescan", title: "Dé du voyage", text: "Si tu fais 5 ou 6, avance d’1 case et rescane.", powerLevel: 3, drinkMode: "dice-rescan" },

{ category: "de-rescan", title: "Dé piégé", text: "Si tu fais 1, recule d’1 case et rescane.", powerLevel: 3, drinkMode: "dice-rescan" },

{ category: "de", title: "Dé chanceux", text: "Pair = avance d’1 case. Impair = bois 2 gorgées.", powerLevel: 2, drinkMode: "dice" },

// =========================
// RELANCE
// =========================

{ category: "relance", title: "Rejoue", text: "Bois 1 gorgée puis rejoue.", powerLevel: 2, drinkMode: "auto", drinksTaken: 1, replay: true },

{ category: "relance", title: "Double tour", text: "Relance le dé et avance encore.", powerLevel: 3, drinkMode: "replay-dice" },

{ category: "relance", title: "Turbo", text: "Relance immédiatement sans attendre.", powerLevel: 2, drinkMode: "replay" },

{ category: "relance", title: "Combo", text: "Rejoue et distribue 2 gorgées.", powerLevel: 3, drinkMode: "replay-choice", drinksGiven: 2 },

{ category: "relance", title: "Full chance", text: "Si tu fais 6 au prochain lancer, distribue 6 gorgées.", powerLevel: 2, drinkMode: "replay-dice" },

{ category: "relance", title: "Mode boss", text: "Tu rejoues et choisis qui boit.", powerLevel: 3, drinkMode: "replay-choice", drinksGiven: 3 },

{ category: "relance", title: "Le comeback", text: "Recule d’1 case puis rejoue.", powerLevel: 2, drinkMode: "replay" },

{ category: "relance", title: "Le tricheur", text: "Tu peux relancer le dé une deuxième fois.", powerLevel: 2, drinkMode: "replay-dice" },

{ category: "relance", title: "Double impact", text: "Le prochain joueur boit le double de gorgées.", powerLevel: 4, drinkMode: "manual" },

{ category: "relance", title: "Le moteur", text: "Si ton prochain lancer est pair, rejoue encore.", powerLevel: 4, drinkMode: "replay-dice" },

{ category: "relance", title: "Relance infernale", text: "Rejoue mais bois avant chaque lancer.", powerLevel: 4, drinkMode: "auto", drinksTaken: 1, replay: true },

{ category: "relance", title: "Boost", text: "Avance encore du résultat du prochain dé.", powerLevel: 3, drinkMode: "replay-dice" },

{ category: "relance", title: "Le missile", text: "Rejoue avec un bonus de +2 cases.", powerLevel: 3, drinkMode: "replay-dice" },

{ category: "relance", title: "Overdrive", text: "Rejoue immédiatement. Si tu refais une relance, bois 3 gorgées.", powerLevel: 5, drinkMode: "replay" },

{ category: "relance", title: "La fusée", text: "Avance de 3 cases puis rejoue.", powerLevel: 3, drinkMode: "replay" },

{ category: "relance", title: "L’inarrêtable", text: "Rejoue une fois supplémentaire.", powerLevel: 4, drinkMode: "replay" },

{ category: "relance-rescan", title: "La catapulte", text: "Avance d’1 case puis rescane immédiatement.", powerLevel: 3, drinkMode: "replay-rescan" },

{ category: "relance-rescan", title: "Hyper boost", text: "Relance le dé. Avance encore puis rescane.", powerLevel: 4, drinkMode: "replay-rescan" },

{ category: "relance", title: "Combo apéro", text: "Rejoue et fais boire le joueur de ton choix.", powerLevel: 3, drinkMode: "replay-choice", drinksGiven: 2 },

// =========================
// MALUS
// =========================

{category: "malus",title: "Piégé",text: "Bois 2 gorgées immédiatement.",powerLevel: 2,drinkMode: "auto",drinksTaken: 2},

{category: "malus",title: "Chaos",text: "Tout le monde choisit une règle contre toi.",powerLevel: 4,drinkMode: "manual"},

{category: "malus",title: "La punition",text: "Bois 3 gorgées.",powerLevel: 3,drinkMode: "auto",drinksTaken: 3},

{category: "malus",title: "Le fragile",text: "Tu bois pendant 5 secondes.", powerLevel: 3,drinkMode: "auto",drinksTaken: 5},

{category: "malus",title: "La honte",text: "Raconte une honte ou bois.",powerLevel: 2,drinkMode: "manual"},

{category: "malus",title: "Le silence",text: "Tu ne peux plus parler jusqu’à ton prochain tour.",powerLevel: 2,drinkMode: "manual"},

{category: "malus",title: "La sentence",text: "Le groupe décide de ton nombre de gorgées.",powerLevel: 4,drinkMode: "manual"},

{category: "malus",title: "Le regard gênant",text: "Fixe un joueur pendant 10 secondes ou bois.",powerLevel: 2,drinkMode: "manual"},

{category: "malus",title: "Le téléphone",text: "Montre ta dernière photo ou bois 4 gorgées.",powerLevel: 3,drinkMode: "manual"},

{category: "malus",title: "Le démon",text: "Tout le monde distribue 1 gorgée contre toi.",powerLevel: 4,drinkMode: "all",drinksTaken: 1},

{category: "malus",title: "L’injustice",text: "Bois alors que tu n’as rien fait.",powerLevel: 2,drinkMode: "auto",drinksTaken: 2},

{category: "malus",title: "Le challenge",text: "Tiens sur un pied 10 secondes ou bois.",powerLevel: 2,drinkMode: "manual"},

{category: "malus",title: "La malédiction",text: "Chaque fois que quelqu’un dit ton prénom, tu bois.",powerLevel: 5, drinkMode: "manual"},

{category: "malus",title: "Le boss final",text: "Le groupe choisit ta punition.",powerLevel: 5,drinkMode: "manual"},

{category: "malus",title: "Le poissard",text: "Relance le dé et bois le résultat x2.",powerLevel: 5,drinkMode: "dice"},

{category: "malus",title: "Le traître",text: "Choisis un joueur… puis bois à sa place.",powerLevel: 3,drinkMode: "choice",drinksGiven: 3},

// =========================
// MALUS RETOUR
// =========================

{ category: "retour", title: "Recule", text: "Recule de 2 cases et bois 1 gorgée.", powerLevel: 2, drinkMode: "return", drinksTaken: 1 },

{ category: "retour", title: "Retour", text: "Retourne à ta case précédente.", powerLevel: 1, drinkMode: "return" },

{ category: "retour", title: "Le boulet", text: "Tu recules de 3 cases.", powerLevel: 2, drinkMode: "return" },

{ category: "retour", title: "Le retour violent", text: "Retourne à la dernière case malus.", powerLevel: 3, drinkMode: "return" },

{ category: "retour", title: "Retour départ", text: "Si tu refuses le défi, retourne au départ.", powerLevel: 4, drinkMode: "choice" },

{ category: "retour", title: "Retour arrière", text: "Recule de 3 cases puis scanne la nouvelle case.", powerLevel: 3, drinkMode: "return-rescan" },

{ category: "retour", title: "Mauvaise direction", text: "Recule de 2 cases puis scanne la nouvelle case.", powerLevel: 2, drinkMode: "return-rescan" },

{ category: "retour", title: "Chemin perdu", text: "Retourne à ta précédente case spéciale puis scanne-la.", powerLevel: 4, drinkMode: "return-rescan" },

{ category: "retour", title: "Demi-tour", text: "Recule jusqu’à la case précédente et applique son effet.", powerLevel: 3, drinkMode: "return-rescan" },

{ category: "retour", title: "Retour forcé", text: "Recule de 1 case OU bois 2 gorgées pour rester ici.", powerLevel: 2, drinkMode: "choice", drinksTaken: 2 },

{ category: "retour", title: "Erreur de parcours", text: "Le joueur à ta droite choisit : recule de 2 cases ou bois 3 gorgées.", powerLevel: 3, drinkMode: "choice", drinksTaken: 3 },

{ category: "retour", title: "Mauvais chemin", text: "Recule de 5 cases puis scanne la nouvelle case.", powerLevel: 4, drinkMode: "return-rescan" },

{ category: "retour", title: "Retour surprise", text: "Recule jusqu’à la dernière case QR scannée.", powerLevel: 4, drinkMode: "return" },

// =========================
// MALUS DEVANT / DERRIÈRE
// =========================

{ category: "devant-derriere", title: "Devant ou derrière ?", text: "Choisis maintenant : avance de 2 cases OU recule de 2 cases. Scanne la nouvelle case.", powerLevel: 3, drinkMode: "move-choice-rescan" },

{ category: "devant-derriere", title: "Pile ou face du chemin", text: "Lance le dé : pair = avance de 3 cases, impair = recule de 3 cases. Scanne la nouvelle case.", powerLevel: 3, drinkMode: "dice-move-rescan" },

{ category: "devant-derriere", title: "Chemin instable", text: "Le joueur à ta gauche choisit : tu avances de 2 cases OU tu recules de 2 cases. Scanne la nouvelle case.", powerLevel: 2, drinkMode: "move-choice-rescan" },

{ category: "devant-derriere", title: "Choix risqué", text: "Choisis : avance de 1 case OU recule de 3 cases. Scanne la nouvelle case.", powerLevel: 3, drinkMode: "move-choice-rescan" },

{ category: "devant-derriere", title: "Le groupe tranche", text: "Le groupe vote : tu avances de 2 cases OU tu recules de 2 cases. Scanne la nouvelle case.", powerLevel: 2, drinkMode: "move-choice-rescan" },

{ category: "devant-derriere", title: "Mauvais pressentiment", text: "Lance le dé : 1, 2 ou 3 = recule de 2 cases. 4, 5 ou 6 = avance de 2 cases. Scanne la nouvelle case.", powerLevel: 3, drinkMode: "dice-move-rescan" },

{ category: "devant-derriere", title: "Double chemin", text: "Choisis un joueur. Il décide : avance de 3 cases OU recule de 1 case. Scanne la nouvelle case.", powerLevel: 3, drinkMode: "move-choice-rescan" },

{ category: "devant-derriere", title: "Retour piégé", text: "Recule de 2 cases et scanne la nouvelle case. Si c’est encore un malus, applique-le aussi.", powerLevel: 4, drinkMode: "return-rescan" },

{ category: "devant-derriere", title: "Avance empoisonnée", text: "Avance de 2 cases, bois 1 gorgée, puis scanne la nouvelle case.", powerLevel: 2, drinkMode: "move-rescan", drinksTaken: 1 },

{ category: "devant-derriere", title: "Le mauvais sens", text: "Recule d’1 case et scanne la nouvelle case.", powerLevel: 2, drinkMode: "return-rescan" },

{ category: "devant-derriere", title: "Dernière chance", text: "Lance le dé : si tu fais 6, avance de 4 cases. Sinon recule de 2 cases. Scanne la nouvelle case.", powerLevel: 4, drinkMode: "dice-move-rescan" },

{ category: "devant-derriere", title: "Chemin maudit", text: "Avance de 1 case, puis recule de 2 cases. Au final, tu recules donc d’1 case. Scanne la nouvelle case.", powerLevel: 2, drinkMode: "return-rescan" },

{ category: "devant-derriere", title: "Pas de chance", text: "Choisis : recule de 3 cases OU bois 2 gorgées pour rester sur ta case.", powerLevel: 3, drinkMode: "choice", drinksTaken: 2 },

{ category: "devant-derriere", title: "Coup de poker", text: "Annonce pair ou impair, puis lance le dé. Si tu gagnes : avance de 3 cases. Sinon : recule de 3 cases. Scanne la nouvelle case.", powerLevel: 4, drinkMode: "dice-move-rescan" },

{ category: "devant-derriere", title: "Le piège", text: "Avance de 3 cases et scanne la nouvelle case, même si elle semble mauvaise.", powerLevel: 3, drinkMode: "move-rescan" },

{ category: "devant-derriere", title: "Marche arrière", text: "Recule jusqu’à la dernière case spéciale déjà croisée, puis scanne-la.", powerLevel: 4, drinkMode: "return-rescan" },

// =========================
// REVEIL
// =========================

{ category: "reveil", title: "Passe ton tour", text: "Tu passes ton prochain tour.", powerLevel: 2, drinkMode: "skip-turn", turnsToSkip: 1 },

{ category: "reveil", title: "Le crash", text: "Passe tes 2 prochains tours.", powerLevel: 4, drinkMode: "skip-turn", turnsToSkip: 2 },

{ category: "reveil", title: "Trop fatigué", text: "Tu t’endors… passe ton prochain tour.", powerLevel: 3, drinkMode: "skip-turn", turnsToSkip: 1 },

{ category: "reveil", title: "Mode veille", text: "Tu dois jouer ton prochain tour avec une seule main.", powerLevel: 2, drinkMode: "manual" },

{ category: "reveil", title: "Réveil brutal", text: "Bois 1 gorgée par joueur encore réveillé.", powerLevel: 3, drinkMode: "all" },

{ category: "reveil", title: "Nuit blanche", text: "Tu dois parler doucement jusqu’à ton prochain tour.", powerLevel: 2, drinkMode: "manual" },

// =========================
// FINAL BOIRE
// =========================

{ category: "final-boire", title: "Dernière tournée", text: "Bois 1 gorgée pour célébrer ton arrivée à la fin du plateau !", powerLevel: 3, drinkMode: "auto", drinksTaken: 1 },

{ category: "final-boire", title: "Dernière tournée", text: "Bois 1 gorgée pour célébrer ton arrivée à la fin du plateau 👑", powerLevel: 3, drinkMode: "auto", drinksTaken: 1 },

{ category: "final-boire", title: "Le Roi de l’Apéro", text: "Tu atteins la dernière case. Bois 2 gorgées de gloire 🍻", powerLevel: 4, drinkMode: "auto", drinksTaken: 2 },

// =========================
// BONUS TROLL
// =========================

{ category: "malus", title: "⚠ Erreur système", text: "Ton téléphone décide que tu bois.", powerLevel: 3, drinkMode: "auto", drinksTaken: 3 },

{ category: "malus", title: "📡 QR corrompu", text: "Recommence… après 3 gorgées.", powerLevel: 3, drinkMode: "auto", drinksTaken: 3 },

{ category: "malus", title: "🛜 Mauvaise connexion", text: "Le dernier qui parle boit.", powerLevel: 2, drinkMode: "manual" },

{ category: "malus", title: "💀 Bug critique", text: "Tout le monde boit sauf toi.", powerLevel: 4, drinkMode: "all" },

{ category: "malus", title: "📱 Mise à jour obligatoire", text: "Bois pendant le chargement.", powerLevel: 2, drinkMode: "auto", drinksTaken: 2 },

{ category: "malus", title: "🤖 IA incontrôlable", text: "Le jeu choisit une victime au hasard.", powerLevel: 4, drinkMode: "random-player", drinksGiven: 3 },

{ category: "malus", title: "🔋 Batterie faible", text: "Le joueur avec le moins de batterie boit.", powerLevel: 2, drinkMode: "manual" },

// =========================
// BONUS
// =========================

{ category: "bonus", title: "Sauve-toi", text: "Tu ne bois pas. Tous les autres boivent.", powerLevel: 4, drinkMode: "all" },

{ category: "bonus", title: "Protection", text: "Tu peux annuler une action contre toi.", powerLevel: 2, drinkMode: "protection" },

{ category: "bonus", title: "Immunité", text: "Tu ne bois pas pendant 1 tour.", powerLevel: 2, drinkMode: "immunity", turns: 1 },

{ category: "bonus", title: "Distribue", text: "Distribue 3 gorgées aux joueurs de ton choix.", powerLevel: 2, drinkMode: "choice", drinksGiven: 3 },

{ category: "bonus", title: "Roi de la table", text: "Personne ne peut te faire boire avant ton prochain tour.", powerLevel: 3, drinkMode: "immunity", turns: 1 },

{ category: "bonus", title: "Vol", text: "Donne tes gorgées à quelqu’un d’autre.", powerLevel: 3, drinkMode: "choice" },

{ category: "bonus", title: "Le boss", text: "Distribue 10 gorgées.", powerLevel: 4, drinkMode: "choice", drinksGiven: 10 },

{ category: "bonus", title: "Le survivant", text: "Tout le monde boit sauf toi.", powerLevel: 4, drinkMode: "all" },

{ category: "bonus", title: "L’immunisé", text: "Ignore les 2 prochaines punitions.", powerLevel: 4, drinkMode: "immunity", turns: 2 },

{ category: "bonus", title: "Le roi", text: "Tu choisis qui finit son verre.", powerLevel: 5, drinkMode: "choice", drinksGiven: 10 },

{ category: "bonus", title: "Le sniper", text: "Quand tu veux avant ton prochain tour, fais boire quelqu’un.", powerLevel: 3, drinkMode: "choice", drinksGiven: 2 },

{ category: "bonus", title: "Le démon", text: "Choisis 2 joueurs qui boivent ensemble.", powerLevel: 3, drinkMode: "choice", drinksGiven: 2 },

{ category: "bonus", title: "Le VIP", text: "Tu ne peux plus être ciblé pendant 2 tours.", powerLevel: 4, drinkMode: "immunity", turns: 2 },

{ category: "bonus", title: "La revanche", text: "Renvoie la prochaine punition à quelqu’un d’autre.", powerLevel: 3, drinkMode: "protection" },

{ category: "bonus", title: "Le cheat code", text: "Tu peux relancer un défi une fois.", powerLevel: 2, drinkMode: "manual" },

{ category: "bonus", title: "La carte UNO", text: "Annule une punition contre toi.", powerLevel: 2, drinkMode: "protection" },

{ category: "bonus", title: "Le tyran", text: "Pendant 1 tour, tu choisis qui boit.", powerLevel: 4, drinkMode: "choice-master" },

{ category: "bonus", title: "Le miraculé", text: "Tu ignores le prochain malus.", powerLevel: 2, drinkMode: "protection" },

{ category: "bonus", title: "Le distributeur", text: "Distribue autant de gorgées que tu veux jusqu’à 8.", powerLevel: 4, drinkMode: "choice", drinksGiven: 8 },

{ category: "bonus", title: "L’injustice", text: "Choisis quelqu’un qui boit à ta place pendant 1 tour.", powerLevel: 3, drinkMode: "choice" },

{ category: "bonus", title: "Le maître du jeu", text: "Tu peux modifier une règle pendant 1 tour.", powerLevel: 4, drinkMode: "manual" },

{ category: "bonus", title: "Le fantôme", text: "Tu peux ignorer une règle quand tu veux.", powerLevel: 3, drinkMode: "protection" },

{ category: "bonus", title: "La protection divine", text: "Tu es immunisé contre les défis hardcore.", powerLevel: 4, drinkMode: "immunity" },

{ category: "bonus", title: "Le braquage", text: "Prends les gorgées distribuées à un autre joueur.", powerLevel: 3, drinkMode: "choice" },

{ category: "bonus", title: "Le jackpot", text: "Tout le monde boit 2 gorgées sauf toi.", powerLevel: 3, drinkMode: "all", drinksTaken: 2 },

{ category: "bonus", title: "Le manipulateur", text: "Choisis 2 joueurs qui doivent boire ensemble.", powerLevel: 3, drinkMode: "choice", drinksGiven: 2 },

{ category: "bonus", title: "Le héros", text: "Tu peux sauver un joueur d’une punition.", powerLevel: 2, drinkMode: "choice" },

{ category: "bonus", title: "Le camouflage", text: "Tu deviens intouchable jusqu’à ton prochain tour.", powerLevel: 3, drinkMode: "immunity", turns: 1 },

{ category: "bonus", title: "Le chef", text: "Tu décides du prochain joueur.", powerLevel: 3, drinkMode: "manual" },

{ category: "bonus", title: "Le voleur", text: "Prends l’immunité d’un autre joueur.", powerLevel: 4, drinkMode: "choice" },

{ category: "bonus", title: "Le miracle", text: "Avance de 3 cases gratuitement.", powerLevel: 2, drinkMode: "move-rescan" },

{ category: "bonus", title: "Le chaos positif", text: "Inverse une punition contre quelqu’un d’autre.", powerLevel: 4, drinkMode: "choice" },

{ category: "bonus", title: "Le boss final", text: "Tout le monde doit trinquer avec toi et boire.", powerLevel: 4, drinkMode: "all", drinksTaken: 1 },

{ category: "bonus", title: "Le roi du BIBIPERO", text: "Tu contrôles les distributions pendant 1 tour.", powerLevel: 5, drinkMode: "choice-master" },

// =========================
// GAGE SOCIAL
// =========================

{ category: "gage-social", title: "Question gênante", text: "Réponds à une question du groupe ou bois 2 gorgées.", powerLevel: 2, drinkMode: "manual" },
{ category: "gage-social", title: "Compliment", text: "Fais un compliment sincère à un joueur ou bois.", powerLevel: 1, drinkMode: "manual" },
{ category: "gage-social", title: "Vérité", text: "Dis une vérité embarrassante ou bois 3 gorgées.", powerLevel: 3, drinkMode: "manual" },
{ category: "gage-social", title: "Le téléphone piégé", text: "Le prochain qui touche son téléphone boit.", powerLevel: 2, drinkMode: "manual" },
{ category: "gage-social", title: "Le plus bizarre", text: "Le groupe désigne le plus bizarre. Il boit.", powerLevel: 2, drinkMode: "manual" },
{ category: "gage-social", title: "Le bruit", text: "Fais un bruit bizarre à chaque fois que tu bois.", powerLevel: 2, drinkMode: "manual" },
{ category: "gage-social", title: "Le prénom interdit", text: "Tu n’as plus le droit de dire ton prénom.", powerLevel: 2, drinkMode: "manual" },
{ category: "gage-social", title: "Le regard bizarre", text: "Regarde quelqu’un sans parler pendant 10 secondes.", powerLevel: 2, drinkMode: "manual" },
{ category: "gage-social", title: "Le narrateur", text: "Commente tout ce que fait le joueur à ta droite jusqu’à ton prochain tour.", powerLevel: 2, drinkMode: "manual" },
{ category: "gage-social", title: "Le perroquet", text: "Répète la fin des phrases des autres joueurs.", powerLevel: 2, drinkMode: "manual" },
{ category: "gage-social", title: "Le chef", text: "Tout le monde doit trinquer avec toi.", powerLevel: 2, drinkMode: "all", drinksTaken: 1 },
{ category: "gage-social", title: "Le freeze", text: "Le dernier qui s’arrête de bouger boit.", powerLevel: 2, drinkMode: "manual" },
{ category: "gage-social", title: "Le vote", text: "Le groupe vote pour le joueur le plus drôle.", powerLevel: 1, drinkMode: "manual" },
{ category: "gage-social", title: "Le survivor", text: "Le dernier à lever les mains boit.", powerLevel: 2, drinkMode: "manual" },

// =========================
// DÉPART
// =========================

{ category: "depart", title: "Départ", text: "Bois 1 gorgée puis lance le dé.", powerLevel: 1, drinkMode: "dice", drinksTaken: 1 },
{ category: "depart", title: "Départ explosif", text: "Bois puis lance le dé.", powerLevel: 2, drinkMode: "dice", drinksTaken: 1 },
{ category: "depart", title: "Apéro time", text: "Tout le monde boit avant le premier lancer puis lance le dé.", powerLevel: 2, drinkMode: "dice", drinksTaken: 1 },
{ category: "depart", title: "La chauffe", text: "Bois 2 gorgées avant de jouer puis lance le dé.", powerLevel: 2, drinkMode: "auto", drinksTaken: 2 },
{ category: "depart", title: "Départ sauvage", text: "Tout le monde crie APÉRO puis boit et lance le dé", powerLevel: 2, drinkMode: "dice", drinksTaken: 1 },
{ category: "depart", title: "Tournée générale", text: "Tout le monde boit avec toi puis lance le dé.", powerLevel: 2, drinkMode: "dice", drinksTaken: 1 },
{ category: "depart", title: "Le lancement", text: "Lance le dé, bois le résultat et avance.", powerLevel: 2, drinkMode: "dice" },

];

const legendaryActions = [

  {
    category: "legendary",
    title: "👑 Roi de l’apéro",
    text: "Pendant 1 tour, tu choisis qui boit.",
    powerLevel: 5,
    isLegendary: true
  },

  {
    category: "legendary",
    title: "💎 Carte légendaire",
    text: "Tout le monde boit sauf toi.",
    powerLevel: 5,
    isLegendary: true
  },

  {
    category: "legendary",
    title: "🔥 Chaos total",
    text: "Le groupe invente une règle qui dure 1 tour.",
    powerLevel: 5,
    isLegendary: true
  }

];


let lastAction = null;

function getRandomAction(category) {

  let list =
    actions.filter(a => a.category === category);

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

  // 5% de chance de carte légendaire
  if (
    category !== "depart" &&
    Math.floor(Math.random() * 100) < 5
  ) {

    const legendary =
      legendaryActions[
        Math.floor(Math.random() * legendaryActions.length)
      ];

    lastAction = legendary;

    return legendary;
  }

  const action =
    list[Math.floor(Math.random() * list.length)];

    
  lastAction = action;

  return action;
}

module.exports = {
  getRandomAction
};