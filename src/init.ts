/* eslint-disable no-undef */
// Main entry of the bot, init database and stuff.

import fs from 'fs';
import * as creds from "./credentials/config"
import { initDatabase } from "./tools/tools";
import { pingDatabase } from "./credentials/login" 
import { run } from './bot';

fs.mkdir(`${creds.ROOT}/stats`, err => {
    if (err) {
        if (err.code === "EEXIST") return;
        console.log(err)
    }
})

// Init database
initDatabase();
// Keep pinging database to keep the connection alive.
pingDatabase();
// Bot
// eslint-disable-next-line @typescript-eslint/no-var-requires
run().finally();
// Loops.
require("./loops/loops")