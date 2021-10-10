const express = require("express");
const router = express.Router(); 
const creds = require('./../../credentials/config');
const path = require("path")

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
        res.render('commands', { name: 'John' });
    })


module.exports = router;