const express = require("express");
const router = express.Router(); 
const creds = require('./../../credentials/config');
const path = require("path")
const tools = require("../../tools/tools")

// /Bot
router
    .route("/")
    .get(async function(req, res) {
        res.sendFile(path.resolve(WEBSITE_ROOT, "flottorp/build/index.html"))
    });

// /Bot/Login
router
    .route("/login")
    .get(async function(req, res) {
        res.sendFile(path.resolve(WEBSITE_ROOT, "flottorp/build/index.html"))
    });

// /Bot/Login/Redirect
router
    .route("/login/redirect")    
    .get(async function(req, res) {
        const path =`https://id.twitch.tv/oauth2/authorize?client_id=${creds.TWITCH_CLIENT_ID}&redirect_uri=${creds.REDIRECT_URI}&response_type=code&scope=` + encodeURIComponent("user:read:email channel:manage:broadcast")
    
        res.redirect(301, path);
    });


// /Bot/Commands
router
    .route("/commands")
    .get(async function(req, res) {
        // Get array of json objects containing commands
        /*
            [
                {id: 1, name: "foo", description: "bar", perm: 100}
                {id: 2, name: "baz", description: "taz", perm: 100}
            ]
        */        
        
        const commands = await tools.query("SELECT * FROM commands");
        // console.log(commands)
        
        res.render('commands', { commands: commands, WEBSITE_ROOT: WEBSITE_ROOT });
    })


module.exports = router;