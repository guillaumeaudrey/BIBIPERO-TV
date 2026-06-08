const roomNames = [
  "APERO", "BIBINE", "GLOU", "SHOT", "BIERE", "PIZZA",
  "BONUS", "GAGE", "DEFI", "FETE", "CHAUD", "FUSEE",
  "ROI", "REINE", "TAVERNE", "RIGOLO", "LOL", "YOLO",
  "PARTY", "GLAGLA", "POMPETTE", "MOUSSE", "RICARD",
  "PASTIS", "CULSEC", "TOURNEE", "LEGENDES", "WARRIOR",
  "CHAMPION", "COQUIN", "SINGE", "LICORNE", "DRAGON",
  "PIRATE", "VIKING", "TITAN", "BOSS", "CHEF", "KING",
  "SKOL", "TRINQUE", "GLING", "BOUM", "OUPS", "HOP"
];

const http = require("http");
const { Server } = require("socket.io");
const { getRandomAction } = require("./ActionService");
require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = "HPuvhU1J8dCjaKv9q7bM";
console.log("VOICE ID =", ELEVENLABS_VOICE_ID);
console.log("API KEY =", !!ELEVENLABS_API_KEY);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(express.static(__dirname));

function createEmptyState(roomCode = "") {
  return {
    source: "web",
    roomCode,
    playerName: "En attente",
    currentPlayer: "En attente",
    caseNumber: 0,
    category: "",
    title: "",
    text: "",
    powerLevel: 0,
    isLegendary: false,
    totalActions: 0,
    isLastRound: false,
    gameStarted: false,
    players: []
  };
}

function generateRoomCode() {
  let code;
  do {
    code = roomNames[Math.floor(Math.random() * roomNames.length)] + "-" +
      String(Math.floor(Math.random() * 100)).padStart(2, "0");
  } while (rooms[code]);
  return code;
}

function getRoom(roomCode) {
  if (!roomCode) return null;
  return rooms[roomCode] || null;
}

function emitRoom(roomCode) {
  const room = getRoom(roomCode);
  if (!room) return;

  room.state = {
    ...room.state,
    roomCode,
    players: [...room.players]
  };

  console.log(
    "EMIT ROOM =>",
    roomCode,
    room.players.map(p => ({
      name: p.name,
      isMaster: p.isMaster
    }))
  );

  io.to(roomCode).emit(
    "playersUpdated",
    [...room.players]
  );

  io.to(roomCode).emit(
    "stateUpdated",
    room.state
  );
}

const rooms = {};
const appRoomCode = "APP-TV";
rooms[appRoomCode] = {
  players: [],
  appPlayers: [],
  currentPlayerIndex: 0,
  gameMode: "none",
  state: createEmptyState(appRoomCode)
};

app.get("/", (req, res) => res.redirect("/tv.html"));

app.get("/state", (req, res) => {

  const roomCode =
    (req.query.roomCode || "")
      .toString()
      .toUpperCase();

  const room = getRoom(roomCode);

  if (!room) {
    return res.status(404).json({
      ok: false,
      message: "Salon introuvable"
    });
  }

  res.json(room.state);
});

app.post("/state", (req, res) => {
  const incoming = req.body || {};
  const roomCode = (incoming.roomCode || appRoomCode).toString().toUpperCase();

  if (!rooms[roomCode]) {
    rooms[roomCode] = {
      players: [],
      appPlayers: [],
      currentPlayerIndex: 0,
      gameMode: "app",
      state: createEmptyState(roomCode)
    };
  }

  const room = rooms[roomCode];
  room.state = { ...incoming, roomCode };

  if (room.state.resetGame === true) {
    room.players = [];
    room.appPlayers = [];
    room.currentPlayerIndex = 0;
    room.state = createEmptyState(roomCode);
    io.to(roomCode).emit("playersUpdated", []);
    io.to(roomCode).emit("gameReset");
  }

  io.to(roomCode).emit("stateUpdated", room.state);
  res.json({ ok: true, roomCode });
});

app.post("/join-player", (req, res) => {
  const playerName =
    (req.body.playerName || "").toString().trim();

  const roomCode =
    (req.body.roomCode || "").toString().toUpperCase();

  const room = getRoom(roomCode);

  if (!room) {
    return res.status(404).json({
      ok: false,
      message: "Salon introuvable"
    });
  }

  if (room.state.gameStarted) {
    return res.status(400).json({
      ok: false,
      message: "La partie est déjà commencée"
    });
  }

  let player = room.players.find(
    p => p.name.toLowerCase() === playerName.toLowerCase()
  );

  if (!player) {
    player = {
      id: "app-" + playerName,
      name: playerName,
      position: 0,
      totalActions: 0,
      totalDrinks: 0,
      isMaster: room.players.length === 0,
      source: "app"
    };

    room.players.push(player);
  }

  room.state.source = "web";
  room.state.roomCode = roomCode;
  room.state.players = room.players;

  if (!room.state.currentPlayer || room.state.currentPlayer === "En attente") {
    room.state.currentPlayer =
      room.players[room.currentPlayerIndex]?.name || playerName;
  }

  emitRoom(roomCode);

  return res.json({
    ok: true,
    roomCode,
    playerName,
    isMaster: player.isMaster,
    players: room.players
  });
});

app.post("/scan-case", (req, res) => {
  const roomCode =
    (req.body.roomCode || "").toString().toUpperCase();

  const playerName =
    (req.body.playerName || "").toString().trim();

  const qr =
    (req.body.qr || req.body.qrValue || "").toString();

  const room = getRoom(roomCode);

  if (!room) {
    return res.status(404).json({
      ok: false,
      message: "Salon introuvable"
    });
  }

  if (!room.state.gameStarted) {
    return res.status(400).json({
      ok: false,
      message: "La partie n’a pas encore démarré"
    });
  }

  const player = room.players.find(
    p => p.name === playerName
  );

  if (!player) {
    return res.status(404).json({
      ok: false,
      message: "Joueur introuvable"
    });
  }

  const currentPlayer =
    room.players[room.currentPlayerIndex];

  if (currentPlayer && currentPlayer.name !== player.name) {
    return res.status(403).json({
      ok: false,
      message: `Ce n'est pas ton tour. C'est le tour de ${currentPlayer.name}`
    });
  }

  const parts = qr.split("/");
  const caseNumber = Number(parts[1]);

let category = parts[2] || "boire";

if (caseNumber >= 30) {
  category = "final-boire";
}



  const action = getRandomAction(category);

  player.position = caseNumber;
  player.totalActions += 1;

  if (["boire", "malus", "final-boire"].includes(action.category)) {
    player.totalDrinks += 1;
  }
const newHistoryItem = {
  playerName: player.name,
  title: action.title,
  text: action.text,
  category: action.category,
  caseNumber,
  time: Date.now()
};

const history =
  [newHistoryItem, ...(room.state.history || [])]
    .slice(0, 10);
  room.gameMode = "web";

  room.state = {
    ...room.state,
    roomCode,
    playerName: player.name,
    currentPlayer: player.name,
    caseNumber,
    category: action.category,
    title: action.title,
    text: action.text,
    history,
    powerLevel: action.powerLevel,
    isLegendary: action.isLegendary || false,
    isNewRound: false,
    totalActions: (room.state.totalActions || 0) + 1,
    gameMode: "web",
    players: room.players
  };

  emitRoom(roomCode);

  console.log(
  "SCAN APP =>",
  roomCode,
  action.category,
  action.title
);

  return res.json({
  ok: true,
  category: action.category,
  title: action.title,
  text: action.text,
  caseNumber,
  powerLevel: action.powerLevel,
  isLegendary: action.isLegendary || false,
  drinkMode: action.drinkMode || "none",
drinksTaken: action.drinksTaken || 0,
drinksGiven: action.drinksGiven || 0,
turnsToSkip: action.turnsToSkip || 0,
replay: action.replay || false
});
});

app.post("/give-drinks", (req, res) => {
  const roomCode = (req.body.roomCode || "").toString().toUpperCase();
  const fromPlayer = (req.body.fromPlayer || "").toString().trim();
  const toPlayer = (req.body.toPlayer || "").toString().trim();
  const drinks = Number(req.body.drinks || 0);

  const room = getRoom(roomCode);

  if (!room) {
    return res.status(404).json({
      ok: false,
      message: "Salon introuvable"
    });
  }

  const target = room.players.find(p => p.name === toPlayer);
  const giver = room.players.find(p => p.name === fromPlayer);

  if (!target) {
    return res.status(404).json({
      ok: false,
      message: "Joueur cible introuvable"
    });
  }

  target.totalDrinks = (target.totalDrinks || 0) + drinks;

  if (giver) {
    giver.totalDrinksGiven = (giver.totalDrinksGiven || 0) + drinks;
  }

  const newHistoryItem = {
    playerName: fromPlayer,
    title: "🍺 Distribution",
    text: `${fromPlayer} donne ${drinks} gorgée(s) à ${toPlayer}`,
    category: "boire",
    caseNumber: room.state.caseNumber || 0,
    time: Date.now()
  };

  room.state.history =
    [newHistoryItem, ...(room.state.history || [])]
      .slice(0, 10);

  room.state.players = room.players;

  emitRoom(roomCode);

  return res.json({
    ok: true,
    players: room.players
  });
});


app.post("/next-player", (req, res) => {
  const roomCode =
    (req.body.roomCode || "").toString().toUpperCase();

  const playerName =
    (req.body.playerName || "").toString().trim();

  const room = getRoom(roomCode);

  if (!room) {
    return res.status(404).json({
      ok: false,
      message: "Salon introuvable"
    });
  }

  const currentPlayer =
    room.players[room.currentPlayerIndex];

  if (currentPlayer && currentPlayer.name !== playerName) {
    return res.status(403).json({
      ok: false,
      message: "Ce n'est pas ton tour"
    });
  }

  room.currentPlayerIndex =
    (room.currentPlayerIndex + 1) % room.players.length;

  room.state = {
    ...room.state,
    roomCode,
    playerName: "",
    currentPlayer: room.players[room.currentPlayerIndex].name,
    category: "",
    title: "",
    text: "",
    powerLevel: 0,
    isLegendary: false,
    isNewRound: false,
    players: room.players
  };

  emitRoom(roomCode);

  return res.json({
    ok: true,
    currentPlayer: room.state.currentPlayer,
    players: room.players
  });
});

app.post("/start-game", (req, res) => {
  const roomCode = (req.body.roomCode || "").toString().toUpperCase();
  const playerName = (req.body.playerName || "").toString().trim();

  const room = getRoom(roomCode);

  if (!room) {
    return res.status(404).json({ ok: false, message: "Salon introuvable" });
  }
  if (room.players.length < 2) {
  return res.status(400).json({
    ok: false,
    message: "Il faut au moins 2 joueurs pour démarrer"
  });
}

  const player = room.players.find(p => p.name === playerName);

  if (!player || !player.isMaster) {
    return res.status(403).json({ ok: false, message: "Seul le maître peut démarrer" });
  }

  room.state.gameStarted = true;
  room.currentPlayerIndex = 0;
  room.state.currentPlayer = room.players[0]?.name || playerName;
  room.state.players = room.players;
  room.state.roomCode = roomCode;

  emitRoom(roomCode);

  return res.json({
    ok: true,
    currentPlayer: room.state.currentPlayer,
    players: room.players
  });
});
app.post("/create-room", (req, res) => {

  const playerName =
    (req.body.playerName || "").toString().trim();

  if (!playerName) {
    return res.status(400).json({
      ok: false,
      message: "Nom manquant"
    });
  }

  const roomCode = generateRoomCode();

 rooms[roomCode] = {
  players: [],
  appPlayers: [],
  currentPlayerIndex: 0,
  gameMode: "web",
  state: createEmptyState(roomCode)
};

const room = rooms[roomCode];

  const player = {
    id: "app-" + playerName,
    name: playerName,
    position: 0,
    totalActions: 0,
    totalDrinks: 0,
    isMaster: true,
    source: "app"
  };

  room.players.push(player);

  room.state.roomCode = roomCode;
  room.state.currentPlayer = playerName;
  room.state.players = room.players;

  emitRoom(roomCode);

  return res.json({
    ok: true,
    roomCode,
    playerName,
    isMaster: true,
    players: room.players
  });
});

app.post("/new-round", (req, res) => {
  const roomCode = (req.body.roomCode || "").toString().toUpperCase();
  const playerName = (req.body.playerName || "").toString().trim();

  const room = getRoom(roomCode);

  if (!room) {
    return res.status(404).json({ ok: false, message: "Salon introuvable" });
  }

  const player = room.players.find(p => p.name === playerName);

  if (!player || !player.isMaster) {
    return res.status(403).json({ ok: false, message: "Seul le maître peut relancer" });
  }

  room.players.forEach(p => {
    p.position = 0;
    p.totalActions = 0;
    p.totalDrinks = 0;
  });

  room.currentPlayerIndex = 0;
  room.gameMode = "web";

  room.state = {
    ...room.state,
    source: "web",
    roomCode,
    playerName: "",
    currentPlayer: room.players[0]?.name || "En attente",
    caseNumber: 0,
    category: "",
    title: "",
    text: "",
    powerLevel: 0,
    isLegendary: false,
    totalActions: 0,
    isLastRound: false,
    isNewRound: false,
    gameStarted: true,
    gameMode: "web",
    players: room.players
  };

  emitRoom(roomCode);

  return res.json({
    ok: true,
    currentPlayer: room.state.currentPlayer,
    players: room.players
  });
});

app.post("/leave-room", (req, res) => {
  const roomCode = (req.body.roomCode || "").toString().toUpperCase();
  const playerName = (req.body.playerName || "").toString().trim();

  const room = getRoom(roomCode);

  if (!room) {
    return res.json({ ok: true });
  }

  room.players = room.players.filter(p => p.name !== playerName);

  if (room.players.length === 0) {
    room.currentPlayerIndex = 0;
    room.gameMode = "none";
    room.state = createEmptyState(roomCode);
    emitRoom(roomCode);
    return res.json({ ok: true });
  }

  if (!room.players.some(p => p.isMaster)) {
    room.players[0].isMaster = true;
  }

  if (room.currentPlayerIndex >= room.players.length) {
    room.currentPlayerIndex = 0;
  }

  room.state.players = [...room.players];

console.log(
  "LEAVE ROOM =>",
  roomCode,
  room.players.map(p => p.name)
);

emitRoom(roomCode);

  room.state.currentPlayer =
    room.players[room.currentPlayerIndex]?.name || "En attente";

  emitRoom(roomCode);

  return res.json({ ok: true });
});

app.post("/speak", async (req, res) => {
  try {
    const text = req.body.text;
    if (!text) return res.status(400).send("Texte manquant");
    if (!ELEVENLABS_API_KEY) return res.status(500).send("Clé ElevenLabs manquante");

    const response = await axios({
      method: "POST",
      url: `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
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
    if (err.response?.data) console.error("Erreur ElevenLabs :", err.response.data.toString());
    else console.error("Erreur ElevenLabs :", err.message);
    res.status(500).send("Erreur voix");
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`BIBIPERO TV lancé sur le port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("Socket connecté :", socket.id);

  socket.on("joinTvRoom", (data = {}) => {
  const roomCode = (data.roomCode || "").toString().toUpperCase();

  socket.join(roomCode);
  socket.data.roomCode = roomCode;

  const room = getRoom(roomCode);

  if (!room) {
    socket.emit("stateUpdated", createEmptyState(roomCode));
    socket.emit("playersUpdated", []);
    return;
  }

  socket.emit("stateUpdated", room.state);
  socket.emit("playersUpdated", room.players);
});
socket.on("joinPlayerRoom", (data = {}) => {
  const roomCode = (data.roomCode || "").toString().toUpperCase();

  if (!roomCode) return;

  socket.join(roomCode);
  socket.data.roomCode = roomCode;

  const room = getRoom(roomCode);

  if (!room) {
    socket.emit("stateUpdated", createEmptyState(roomCode));
    socket.emit("playersUpdated", []);
    return;
  }

  socket.emit("stateUpdated", room.state);
  socket.emit("playersUpdated", room.players);
});

  socket.on("getState", (data = {}) => {
    const roomCode = (data.roomCode || socket.data.roomCode || "").toString().toUpperCase();
    const room = getRoom(roomCode);
    socket.emit("stateUpdated", room ? room.state : createEmptyState(roomCode));
    socket.emit("playersUpdated", room ? room.players : []);
  });

  socket.on("createRoom", (data = {}) => {
    const roomCode = generateRoomCode();
    const playerName = (data.playerName || "").trim();

    rooms[roomCode] = {
      players: [{
        id: socket.id,
        name: playerName,
        position: 0,
        totalActions: 0,
        totalDrinks: 0,
        isMaster: true,
        source: "web"
      }],
      appPlayers: [],
      currentPlayerIndex: 0,
      gameMode: "web",
      state: {
        source: "web",
        roomCode,
        playerName,
        currentPlayer: playerName,
        caseNumber: 0,
        category: "",
        title: "",
        text: "",
        powerLevel: 0,
        isLegendary: false,
        totalActions: 0,
        isLastRound: false,
        gameStarted: false,
        players: []
      }
    };

    const room = rooms[roomCode];
    room.state.players = room.players;

    socket.join(roomCode);
    socket.data.roomCode = roomCode;

    socket.emit("roomCreated", { roomCode, playerName });
    emitRoom(roomCode);

    console.log("Salon créé :", roomCode, "par", playerName);
  });

  socket.on("joinPlayer", (data = {}) => {
    const playerName = (typeof data === "string" ? data : data.playerName || "").trim();
    const roomCode = (typeof data === "string" ? socket.data.roomCode : data.roomCode || "").toString().toUpperCase();
    const room = getRoom(roomCode);

    if (!room) {
      socket.emit("joinError", { message: "Mauvais code salon" });
      return;
    }
    if (room.state.gameStarted) {
  socket.emit("joinError", {
    message: "La partie est déjà commencée"
  });
  return;
}

    socket.join(roomCode);
    socket.data.roomCode = roomCode;

    let existingPlayer = room.players.find(p => p.name.toLowerCase() === playerName.toLowerCase());
    if (existingPlayer) {
      existingPlayer.id = socket.id;
    } else {
      existingPlayer = {
        id: socket.id,
        name: playerName,
        position: 0,
        totalActions: 0,
        totalDrinks: 0,
        isMaster: room.players.length === 0,
        source: "web"
      };
      room.players.push(existingPlayer);
    }

    room.state.source = "web";
    room.state.roomCode = roomCode;
    room.state.players = room.players;
    if (!room.state.currentPlayer || room.state.currentPlayer === "En attente") {
      room.state.currentPlayer = room.players[room.currentPlayerIndex]?.name || playerName;
    }

    socket.emit("joinSuccess", {
      playerName,
      roomCode,
      isMaster: !!existingPlayer.isMaster
    });

    socket.to(roomCode).emit("playerJoined", { playerName, roomCode });
    emitRoom(roomCode);

    console.log(playerName + " a rejoint", roomCode);
  });
  socket.on("leaveRoom", (data = {}) => {
  const roomCode =
    (data.roomCode || socket.data.roomCode || "")
      .toString()
      .toUpperCase();

  const playerName =
    (data.playerName || "")
      .toString()
      .trim();

  const room = getRoom(roomCode);

  if (!room || !playerName) return;

  room.players = room.players.filter(
    p => p.name !== playerName
  );

  room.appPlayers = room.appPlayers.filter(
    p => p.name !== playerName
  );

  if (room.currentPlayerIndex >= room.players.length) {
    room.currentPlayerIndex = 0;
  }

  room.state.players = room.players;

  if (room.players.length > 0) {
    room.state.currentPlayer =
      room.players[room.currentPlayerIndex]?.name || "";
  } else {
    room.state.currentPlayer = "";
    room.state.gameStarted = false;
  }

  emitRoom(roomCode);

  console.log(`${playerName} a quitté le salon ${roomCode}`);
});

  socket.on("rejoinPlayer", (data = {}) => {
    const playerName = (typeof data === "string" ? data : data.playerName || "").trim();
    const roomCode = (typeof data === "string" ? socket.data.roomCode : data.roomCode || "").toString().toUpperCase();
    const room = getRoom(roomCode);

    if (!room) {
      socket.emit("stateUpdated", createEmptyState(roomCode));
      socket.emit("playersUpdated", []);
      return;
    }

    socket.join(roomCode);
    socket.data.roomCode = roomCode;

    const player = room.players.find(p => p.name.toLowerCase() === playerName.toLowerCase());
    if (player) player.id = socket.id;

    socket.emit("stateUpdated", room.state);
    socket.emit("playersUpdated", room.players);
  });

  socket.on("startGame", (data = {}) => {
    const roomCode = (data.roomCode || socket.data.roomCode || "").toString().toUpperCase();
    const room = getRoom(roomCode);
    if (!room) return socket.emit("startError", { message: "Salon introuvable" });

    const player = room.players.find(p => p.id === socket.id);
    if (!player || !player.isMaster) {
      socket.emit("masterOnly");
      return;
    }

    if (room.players.length < 2) {
      socket.emit("startError", { message: "Il faut au moins 2 joueurs pour démarrer" });
      return;
    }

    room.currentPlayerIndex = 0;
    room.gameMode = "web";
    room.state = {
  source: "web",
  roomCode,
  playerName: "",
  currentPlayer: room.players[0].name,
  caseNumber: 0,
  category: "",
  title: "",
  text: "",
  powerLevel: 0,
  isLegendary: false,
  totalActions: 0,
  isLastRound: false,
  isNewRound: false,
  gameStarted: true,
  gameMode: "web",
  players: room.players
};

    emitRoom(roomCode);
    console.log("Partie démarrée", roomCode, ":", room.state.currentPlayer);
  });

  socket.on("playerScannedCase", (data = {}) => {
    const roomCode = (data.roomCode || socket.data.roomCode || "").toString().toUpperCase();
    const room = getRoom(roomCode);
    if (!room) return socket.emit("scanError", { message: "Salon introuvable" });

    if (!room.state.gameStarted) {
      socket.emit("scanError", { message: "La partie n’a pas encore démarré" });
      return;
    }

    const qr = data.qr || data.qrValue || "";
    const parts = qr.split("/");
    const caseNumber = Number(parts[1]);
    const category = parts[2] || "boire";

    const player = room.players.find(p => p.name === data.playerName);
    if (!player) return;

    const currentPlayer = room.players[room.currentPlayerIndex];
    if (currentPlayer && currentPlayer.name !== player.name) {
      socket.emit("notYourTurn", { currentPlayer: currentPlayer.name });
      return;
    }

    const action = getRandomAction(category);
    player.position = caseNumber;
    player.totalActions += 1;

    if (["boire", "malus", "final-boire"].includes(action.category)) {
      player.totalDrinks += 1;
    }
   const newHistoryItem = {
  playerName: player.name,
  title: action.title,
  text: action.text,
  category: action.category,
  caseNumber,
  time: Date.now()
};

const history =
  [newHistoryItem, ...(room.state.history || [])]
    .slice(0, 10);

    room.gameMode = "web";
    room.state = {
      ...room.state,
      roomCode,
      playerName: player.name,
      currentPlayer: player.name,
      caseNumber,
      category: action.category,
      title: action.title,
      text: action.text,
      history,
      powerLevel: action.powerLevel,
      isLegendary: action.isLegendary || false,
      isNewRound: false,
      totalActions: (room.state.totalActions || 0) + 1,
      gameMode: "web",
      players: room.players
    };

    emitRoom(roomCode);

    socket.emit("stateUpdated", room.state);
socket.emit("playersUpdated", room.players);
  });

  socket.on("nextPlayer", (data = {}, callback) => {
  const roomCode =
    (data.roomCode || socket.data.roomCode || "")
      .toString()
      .toUpperCase();

  const room = getRoom(roomCode);

  if (!room || room.players.length === 0) {
    if (callback) callback({ ok: false });
    return;
  }

  room.currentPlayerIndex =
    (room.currentPlayerIndex + 1) % room.players.length;

  room.state = {
    ...room.state,
    roomCode,
    playerName: "",
    currentPlayer: room.players[room.currentPlayerIndex].name,
    category: "",
    title: "",
    text: "",
    powerLevel: 0,
    isLegendary: false,
    isNewRound: false,
    players: room.players
  };

  emitRoom(roomCode);

  socket.emit("stateUpdated", room.state);
  socket.emit("playersUpdated", room.players);

  if (callback) {
    callback({
      ok: true,
      state: room.state,
      players: room.players
    });
  }
});
socket.on("newRound", (data = {}) => {
  const roomCode =
    (data.roomCode || socket.data.roomCode || "")
      .toString()
      .toUpperCase();

  const room = getRoom(roomCode);
  if (!room) return;

  room.players.forEach(p => {
    p.position = 0;
    p.totalActions = 0;
    p.totalDrinks = 0;
  });

  room.currentPlayerIndex = 0;
  room.gameMode = "web";

  room.state = {
    ...room.state,
    source: "web",
    roomCode,
    playerName: "",
    currentPlayer: room.players[0]?.name || "En attente",
    caseNumber: 0,
    category: "",
    title: "",
    text: "",
    powerLevel: 0,
    isLegendary: false,
    totalActions: 0,
    isLastRound: false,
    isNewRound: false,
    gameStarted: true,
    gameMode: "web",
    players: room.players
  };

  emitRoom(roomCode);

  io.to(roomCode).emit("newRoundReady", {
    roomCode
  });
});
  socket.on("resetGame", (data = {}) => {
    const roomCode = (data.roomCode || socket.data.roomCode || "").toString().toUpperCase();
    const room = getRoom(roomCode);
    if (!room) return;

    room.players = [];
    room.appPlayers = [];
    room.currentPlayerIndex = 0;
    room.gameMode = "none";
    room.state = createEmptyState(roomCode);

    io.to(roomCode).emit("playersUpdated", []);
    io.to(roomCode).emit("stateUpdated", room.state);
    setTimeout(() => {
      io.to(roomCode).emit("hardReset");
      io.to(roomCode).emit("gameReset");
    }, 100);

    console.log("Salon reset :", roomCode);
  });

  socket.on("playerScanned", (data = {}) => {
  const roomCode =
    (data.roomCode || socket.data.roomCode || "")
      .toString()
      .toUpperCase();

  const room = getRoom(roomCode);

  if (!room) {
    socket.emit("scanError", {
      message: "Salon introuvable"
    });
    return;
  }

  if (!room.state.gameStarted) {
    socket.emit("scanError", {
      message: "La partie n’a pas encore démarré"
    });
    return;
  }

  const qr = data.qr || data.qrValue || "";
  const parts = qr.split("/");
  const caseNumber = Number(parts[1]);

  let category = parts[2] || "boire";

  if (caseNumber >= 30) {
    category = "final-boire";
  }

  const playerName =
    data.playerName ||
    data.currentPlayer ||
    room.state.currentPlayer ||
    "";

  let player = room.players.find(
    p => p.name === playerName
  );

  if (!player) {
    socket.emit("scanError", {
      message: "Joueur introuvable dans le salon"
    });
    return;
  }

  const currentPlayer =
    room.players[room.currentPlayerIndex];

  if (currentPlayer && currentPlayer.name !== player.name) {
    socket.emit("notYourTurn", {
      currentPlayer: currentPlayer.name
    });
    return;
  }

  const action = getRandomAction(category);

  player.position = caseNumber;
  player.totalActions += 1;

  if (["boire", "malus", "final-boire"].includes(action.category)) {
    player.totalDrinks += 1;
  }

  const newHistoryItem = {
    playerName: player.name,
    title: action.title,
    text: action.text,
    category: action.category,
    caseNumber,
    time: Date.now()
  };

  const history =
    [newHistoryItem, ...(room.state.history || [])]
      .slice(0, 10);

  room.gameMode = "web";

  room.state = {
    ...room.state,
    roomCode,
    playerName: player.name,
    currentPlayer: player.name,
    caseNumber,
    category: action.category,
    title: action.title,
    text: action.text,
    history,
    powerLevel: action.powerLevel,
    isLegendary: action.isLegendary || false,
    isNewRound: false,
    totalActions: (room.state.totalActions || 0) + 1,
    gameMode: "web",
    players: room.players
  };

  emitRoom(roomCode);

  socket.emit("stateUpdated", room.state);
  socket.emit("playersUpdated", room.players);

  console.log(
    "SCAN APP SOCKET =>",
    roomCode,
    player.name,
    action.category,
    action.title
  );
});

  socket.on("disconnect", () => {
  console.log("Socket déconnecté :", socket.id);

  const roomCode =
    (socket.data.roomCode || "")
      .toString()
      .toUpperCase();

  const room = getRoom(roomCode);
  if (!room) return;

  const leavingPlayer =
    room.players.find(p => p.id === socket.id);

  if (!leavingPlayer) return;

  const leavingName = leavingPlayer.name;

  setTimeout(() => {
    const latestRoom = getRoom(roomCode);
    if (!latestRoom) return;

    const samePlayer =
      latestRoom.players.find(p => p.name === leavingName);

    // Si le joueur est revenu avec un nouveau socket, on ne le supprime pas
    if (!samePlayer || samePlayer.id !== socket.id) {
      return;
    }

    latestRoom.players = latestRoom.players.filter(
      p => p.id !== socket.id
    );

    if (latestRoom.players.length === 0) {
      latestRoom.currentPlayerIndex = 0;
      latestRoom.gameMode = "none";
      latestRoom.state = createEmptyState(roomCode);
      emitRoom(roomCode);
      return;
    }

    if (!latestRoom.players.some(p => p.isMaster)) {
      latestRoom.players[0].isMaster = true;
    }

    if (latestRoom.currentPlayerIndex >= latestRoom.players.length) {
      latestRoom.currentPlayerIndex = 0;
    }

    latestRoom.state.players = latestRoom.players;
    latestRoom.state.currentPlayer =
      latestRoom.players[latestRoom.currentPlayerIndex]?.name || "En attente";

    emitRoom(roomCode);

  }, 5000);
});
});
