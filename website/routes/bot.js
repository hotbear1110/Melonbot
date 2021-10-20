/* eslint-disable no-undef */
const express = require("express");
const router = express.Router(); 
const creds = require('./../../credentials/config');
const path = require("path")
const tools = require("../../tools/tools");

// /Bot
router
    .route("/")
    .get(async function(req, res) {

    let stats = "";
    console.log(req.query.channel);
    if (req.query.channel === undefined) {
        stats = await tools.query("SELECT * FROM channel_stats");
    } else {
        stats = await tools.query("SELECT * FROM channel_stats WHERE Channel = ?", req.query.channel)
    }

    console.log(stats);
        
    console.time('TimeRender')

    res.render('BasicTable', {data: stats, type: "STATS"}, function(err, html) {
        if (err) return console.log('Render error: ', err);
        res.send(html);
        console.timeEnd('TimeRender')
    })
        
})

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
// Unsure if there is a way to use a static react app considering i have to query the database.
// I don't personally like that i have one server rendered page. And then the rest of the page is static react.

router
    .route("/commands")
    .get(async function(req, res) {
        const commands = await tools.query("SELECT * FROM commands");
        console.time('TimeRender')

        res.render('BasicTable', { data: commands, type: "COMMANDS"}, function(err, html) {
            if (err) return console.log('Render error: ', err);
            res.send(html);
            console.timeEnd('TimeRender')
        });
    })




module.exports = router;