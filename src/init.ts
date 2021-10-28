/* eslint-disable no-undef */
// Main entry of the bot, init database and stuff.

import fs from 'fs';
import * as creds from "./credentials/config"

fs.mkdir(`${creds.ROOT}/stats`, err => {
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
require("./bot").run();
// Loops.
require("./loops/loops")