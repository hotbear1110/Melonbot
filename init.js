// Main entry of the bot, init database and stuff.
// ASDMAPSID
// Init database
require("./tools/tools").initDatabase();
// Keep pinging database to keep the connection alive.
require("./credentials/login").pingDatabase();
// Bot
require("./bot");
// Website
require("./website/index");