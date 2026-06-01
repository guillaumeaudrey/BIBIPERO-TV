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
  room.state.roomCode = roomCode;
  room.state.players = room.players;
  io.to(roomCode).emit("playersUpdated", room.players);
  io.to(roomCode).emit("stateUpdated", room.state);
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
  const roomCode = (req.query.roomCode || appRoomCode).toString().toUpperCase();
  const room = getRoom(roomCode) || rooms[appRoomCode];
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
      powerLevel: action.powerLevel,
      isLegendary: action.isLegendary || false,
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
    const roomCode = (data.roomCode || appRoomCode).toString().toUpperCase();
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

    const qr = data.qr || data.qrValue || "";
    const parts = qr.split("/");
    const caseNumber = Number(parts[1]);
    const category = parts[2] || "boire";
    const playerName = data.playerName || data.currentPlayer || "Joueur appli";

    let player = room.appPlayers.find(p => p.name === playerName);
    if (!player) {
      player = { id: "app-" + playerName, name: playerName, position: 0, totalActions: 0, totalDrinks: 0 };
      room.appPlayers.push(player);
    }

    const action = getRandomAction(category);
    player.position = caseNumber;
    player.totalActions += 1;
    if (["boire", "malus", "final-boire"].includes(action.category)) player.totalDrinks += 1;

    room.gameMode = "app";
    room.state = {
      ...room.state,
      eventId: Date.now(),
      roomCode,
      gameMode: "app",
      gameStarted: true,
      playerName: player.name,
      currentPlayer: player.name,
      caseNumber,
      category: action.category,
      title: action.title,
      text: action.text,
      powerLevel: action.powerLevel,
      isLegendary: action.isLegendary || false,
      totalActions: (room.state.totalActions || 0) + 1,
      players: room.appPlayers
    };

    io.to(roomCode).emit("stateUpdated", room.state);
    io.to(roomCode).emit("playersUpdated", room.appPlayers);
  });

  socket.on("disconnect", () => {
    console.log("Socket déconnecté :", socket.id);
  });
});
