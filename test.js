const API = require('./dist/');
const teamTrees = new API.TeamTrees();

// Get all total donation amount
teamTrees.getTotalTrees(true).then(console.log);

// Get the most recent donations
teamTrees.getMostRecent().then(console.log);

// Get the top donations (where Elon Musk is)
teamTrees.getMostTrees().then(console.log);