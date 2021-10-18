const express = require("express");
const router = express.Router();
const shell = require("child_process");
const tools = require("../../../tools/tools")
const process = require('process')

/*
    stats: {
        commitHash: "foo",
        commits: bar
        uptime: "baz",
        commandsHandled: taz,
        //// More to come ////
    }
*/
router
    .route("/")
    .get(async function(req, res) {

    const ch = await tools.query("SELECT commandsHandled FROM stats;")
    
    const stats = {
        commitHash: shell.execSync("git rev-parse --short HEAD").toString().replace("\n", ""),
        commits: Number(shell.execSync("git rev-list --all --count").toString()),
        uptime: tools.humanizeDuration(process.uptime()),
        commandsHandled: Number(ch[0].commandsHandled),
    }
    res.json(stats)
})

module.exports = router;