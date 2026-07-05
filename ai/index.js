const { BibineAI } = require('./BibineAI');
function createBibineAI(options = {}) { return new BibineAI(options); }
module.exports = { BibineAI, createBibineAI };
