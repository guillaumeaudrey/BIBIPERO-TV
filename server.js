const express = require("express");
const app = express();

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`BIBIPERO TV lancé sur le port ${PORT}`);
});

