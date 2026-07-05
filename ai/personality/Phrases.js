const { INTRO } = require('./Intro');
const { BONUS } = require('./Bonus');
const { MALUS } = require('./Malus');
const { BOIRE } = require('./Boire');
const { LEADER } = require('./Leader');
const { LOSER } = require('./Loser');
const { LEGENDARY } = require('./Legendary');
const { CHAOS } = require('./Chaos');
const { VICTORY } = require('./Victory');
const { AMBIENT } = require('./Ambient');
const { FAKE_ADS } = require('./FakeAds');
const { RADIO } = require('./Radio');
const { PUBLIC } = require('./Public');

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function phraseHints(context = {}) {
  const category = context.action?.category || context.category || '';
  const event = context.activeEvent || '';
  const hints = [pick(INTRO), pick(AMBIENT), pick(PUBLIC)];
  if (category === 'bonus') hints.push(pick(BONUS));
  if (category === 'malus') hints.push(pick(MALUS));
  if (['boire','final-boire'].includes(category)) hints.push(pick(BOIRE));
  if (event === 'legendary' || context.action?.isLegendary) hints.push(pick(LEGENDARY));
  if (event === 'chaos') hints.push(pick(CHAOS));
  if (event === 'final') hints.push(pick(VICTORY));
  if (Math.random() < 0.15) hints.push(pick(FAKE_ADS));
  if (Math.random() < 0.12) hints.push(pick(RADIO));
  if (context.gameAnalysis?.leader) hints.push(`Premier actuel : ${context.gameAnalysis.leader}. ${pick(LEADER)}`);
  if (context.gameAnalysis?.last) hints.push(`Dernier actuel : ${context.gameAnalysis.last}. ${pick(LOSER)}`);
  return hints.slice(0, 6).join('\n- ');
}
module.exports = { phraseHints };
