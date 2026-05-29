const http = require("http");
const { Server } = require("socket.io");
const { getRandomAction } = require("./ActionService");

const express = require("express");
const app = express();

const axios = require("axios");
const ELEVENLABS_API_KEY =
  process.env.ELEVENLABS_API_KEY;

const ELEVENLABS_VOICE_ID =
  "JdwJ7jL68CWmQZuo7KgG";





const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(express.json());
app.use(express.static(__dirname));

let state = {
  playerName: "En attente",
  currentPlayer: "En attente",
  caseNumber: 0,
  category: "boire",
  title: "BIBIPERO TV",
  text: "En attente d’un scan...",
  totalActions: 0,
  isLastRound: false,
  gameStarted: false,
  players: []
};
app.get("/", (req, res) => {
  res.redirect("/tv.html");
});
app.get("/state", (req, res) => {
  res.json(state);
});

app.post("/state", (req, res) => {
  state = req.body;
  res.json({ ok: true });
});


app.post("/speak", async (req, res) => {

  try {

    const text = req.body.text;

    if (!text) {
  return res.status(400).send("Texte manquant");
}

if (!ELEVENLABS_API_KEY) {
  return res.status(500).send("Clé ElevenLabs manquante");
}

    const response = await axios({

      method: "POST",

      url:
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,

      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
      },

      responseType: "arraybuffer",

      data: {
        text,
        model_id: "eleven_multilingual_v2",

        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.8,
          style: 0.5,
          use_speaker_boost: true
        }
      }
    });

    res.set("Content-Type", "audio/mpeg");

    res.send(response.data);

  } catch (err) {

    console.error(
      "Erreur ElevenLabs :",
      err.response?.data || err.message
    );

    res.status(500).send("Erreur voix");
  }
});




const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`BIBIPERO TV lancé sur le port ${PORT}`);
});

let connectedPlayers = [];
let currentPlayerIndex = 0;



io.on("connection", (socket) => {

  console.log("Joueur connecté :", socket.id);

  socket.emit("stateUpdated", state);
socket.emit("playersUpdated", connectedPlayers);
  
socket.on("rejoinPlayer", (playerName) => {

  const player =
    connectedPlayers.find(
      p => p.name === playerName
    );

  if (player) {

    player.id = socket.id;

    console.log(
      playerName + " reconnecté"
    );
  }

  socket.emit("stateUpdated", state);
  socket.emit("playersUpdated", connectedPlayers);
});

  socket.on("joinPlayer", (playerName) => {

  const alreadyExists =
    connectedPlayers.some(p => p.name === playerName);

  if (!alreadyExists) {
    const isMaster =
  connectedPlayers.length === 0;

connectedPlayers.push({
  id: socket.id,
  name: playerName,
  position: 0,
  totalActions: 0,
  totalDrinks: 0,
  isMaster: isMaster
});
  }

  state.players = connectedPlayers;
  state.currentPlayer =
    connectedPlayers[currentPlayerIndex]?.name || playerName;

  io.emit("playersUpdated", connectedPlayers);
  io.emit("stateUpdated", state);

  console.log(playerName + " a rejoint la partie");
});

socket.on("playerScannedCase", (data) => {

  console.log("QR scanné :", data);

  if (!state.gameStarted) {
  socket.emit("scanError", {
    message: "La partie n’a pas encore démarré"
  });
  return;
}

  const qr = data.qr || data.qrValue || "";
  const parts = qr.split("/");

  const caseNumber = Number(parts[1]);
  const category = parts[2] || "boire";

  const player =
    connectedPlayers.find(p => p.name === data.playerName);

  if (!player) {
    console.log("Joueur inconnu :", data.playerName);
    return;
  }

  const currentPlayer =
    connectedPlayers[currentPlayerIndex];

  if (
    currentPlayer &&
    currentPlayer.name !== player.name
  ) {
    socket.emit("notYourTurn", {
      currentPlayer: currentPlayer.name
    });
    return;
  }

  const action = getRandomAction(category);

  player.position = caseNumber;
  player.totalActions += 1;

  if (
    action.category === "boire" ||
    action.category === "malus" ||
    action.category === "final-boire"
  ) {
    player.totalDrinks += 1;
  }

  state = {
    ...state,
    playerName: player.name,
    currentPlayer: player.name,
    caseNumber: caseNumber,

    category: action.category,
    title: action.title,
    text: action.text,
    powerLevel: action.powerLevel,
    isLegendary: action.isLegendary || false,
    totalActions: (state.totalActions || 0) + 1,
    players: connectedPlayers
  };

  io.emit("stateUpdated", state);
io.emit("playersUpdated", connectedPlayers);

});

socket.on("nextPlayer", () => {

  if (connectedPlayers.length === 0) return;

  currentPlayerIndex =
    (currentPlayerIndex + 1) % connectedPlayers.length;

  state = {
    ...state,
    playerName: "",
    currentPlayer: connectedPlayers[currentPlayerIndex].name,
    //caseNumber: 0,
    category: "",
    title: "",
    text: "",
    powerLevel: 0,
    isLegendary: false,
    players: connectedPlayers
  };

  io.emit("stateUpdated", state);
  io.emit("playersUpdated", connectedPlayers);

  console.log("Tour suivant :", state.currentPlayer);
});


socket.on("resetGame", () => {

  connectedPlayers.forEach(p => {
    p.position = 0;
    p.totalActions = 0;
    p.totalDrinks = 0;
  });

  currentPlayerIndex = 0;

  state = {
    playerName: "",
    currentPlayer: connectedPlayers[0]?.name || "En attente",
    caseNumber: 0,
    category: "",
    title: "",
    text: "",
    powerLevel: 0,
    isLegendary: false,
    totalActions: 0,
    isLastRound: false,
    gameStarted: false,
    players: connectedPlayers
  };

  io.emit("stateUpdated", state);

  console.log("Nouvelle partie lancée");
});

socket.on("startGame", () => {

  const player =
    connectedPlayers.find(
      p => p.id === socket.id
    );

  if (!player || !player.isMaster) {
    socket.emit("masterOnly");
    return;
  }

  if (connectedPlayers.length < 2) {
  socket.emit("startError", {
    message: "Il faut au moins 2 joueurs pour démarrer"
  });
  return;
}

  currentPlayerIndex = 0;

  state = {
    playerName: "",

    currentPlayer: connectedPlayers[0].name,

    caseNumber: 0,
    category: "",
    title: "",
    text: "",

    powerLevel: 0,
    isLegendary: false,

    totalActions: 0,
    isLastRound: false,
    gameStarted: true,
    
    players: connectedPlayers
  };

  io.emit("stateUpdated", state);
  io.emit("playersUpdated", connectedPlayers);

  console.log(
    "Partie démarrée :",
    state.currentPlayer
  );
});
socket.on("getState", () => {
  socket.emit("stateUpdated", state);
  socket.emit("playersUpdated", connectedPlayers);
});

socket.on("disconnect", () => {

  console.log("Socket déconnecté :", socket.id);

});

});