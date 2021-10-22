/* eslint-disable no-undef */
// Main entry of the bot, init database and stuff.

const path = require('path')
const fs = require('fs');


global.ROOT = path.resolve(__dirname)
global.WEBSITE_ROOT = path.resolve(__dirname + "/website")

fs.mkdir(`${ROOT}/stats`, err => {
    if (err) {
        if (err.code === "EEXIST") return;
        console.log(err)
    }
})

// Init database
require("./tools/tools").initDatabase();
// Keep pinging database to keep the connection alive.
require("./credentials/login").pingDatabase();
// Bot
require("./bot");
// Website
require("./website/index");
// Loops.
require("./loops/loops")