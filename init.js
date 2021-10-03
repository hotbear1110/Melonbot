// Main entry of the bot, init database and stuff.

// Init database
require("./tools/tools").initDatabase(false)
// Bot
require("./bot")