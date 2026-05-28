const http = require("http");
const { Server } = require("socket.io");

const express = require("express");
const app = express();

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

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`BIBIPERO TV lancé sur le port ${PORT}`);
});

let connectedPlayers = [];

io.on("connection", (socket) => {

  console.log("Joueur connecté :", socket.id);

  socket.on("joinPlayer", (playerName) => {

    connectedPlayers.push({
      id: socket.id,
      name: playerName
    });

    io.emit("playersUpdated", connectedPlayers);

    console.log(playerName + " a rejoint la partie");
  });

socket.on("playerScannedCase", (data) => {

  console.log("QR scanné :", data);

  io.emit("tvPlayerScanned", data);
});

  socket.on("disconnect", () => {

    connectedPlayers =
      connectedPlayers.filter(
        p => p.id !== socket.id
      );

    io.emit("playersUpdated", connectedPlayers);

    console.log("Joueur déconnecté");
  });
});