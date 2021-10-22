/* eslint-disable no-undef */
const express = require("express");
const router = express.Router(); 
const creds = require('./../../credentials/config');
const tools = require("../../tools/tools");
const requireDir = require('require-dir')


// /Bot
router
    .route("/")
    .get(async function(req, res) {
        const date = new Date();
    
    // #[TODO]: Does not support switching years through the ui at the moment.
    // #[TODO]: Sometimes it just fails. dayStat returns undefined, no idea why. Even though the file very clearly exists..

    try {
        let stats = "";
        let single = req.query.channel === undefined ? false : true 
        let year = req.query.year === undefined ? Number(date.getFullYear()) : Number(req.query.year);
        let month = req.query.month === undefined ? Number((date.getMonth()) + 1) : Number(req.query.month);
        let day = req.query.day === undefined ? Number(date.getDate()) : Number(req.query.day);
        let dayStat;

        // Probably good enough 4Head
        if (month >= 13) {
            month = 12
        }

        if (month <= 0) {
            month = 1;
        }

        if (!single) {
            stats = await tools.query("SELECT * FROM channel_stats");
        } else {
            stats = await tools.query("SELECT * FROM channel_stats WHERE Channel = ?", req.query.channel)
            // Get the stats from files. Maybe we should not store this in files. Unsure.
            const statFiles = requireDir("./../../stats");

            // Key = file
            // Value = every stat per file [Every Channel]
            for (const [key, value] of Object.entries(statFiles)) {
                const a = key.split("-")
                const fileYear = Number(a[0]);
                const fileMonth = Number(a[1]);
                const fileDay = Number(a[2]);
                // Get the correct file for the specified date.
                if (fileYear === year && fileMonth === month && fileDay === day) {
                    for (var property of value) {
                        // Adding two console logs seems to fix it on development box. But this probably does not fix it...
                        console.log(value)
                        console.log(property)
                        if (property.channel === req.query.channel) {
                            dayStat = property
                            delete dayStat['channel']
                            break;
                        }
                    }
                }
            }
            console.log(dayStat)
        }
        console.time('TimeRender')

        res.render('stats', {stats: stats, 
                            title: "Stats", 
                            specific: single, 
                            year: year, 
                            month: Number(month), 
                            day: Number(day), 
                            dayStat: dayStat}, 
            function(err, html) {
            if (err) return console.log('Render error: ', err);
            res.send(html);
            console.timeEnd('TimeRender')
        })
    } catch (error) {
        console.log(error);
        res.send(error);
        return;
    }
})

// /Bot/Login
router
    .route("/login")
    .get(async function(req, res) {
        res.render('login', {title: "Login", 
                            server: creds.SERVER, 
                            LoggedIn: req.query.loggedIn}, 
            function(err, html) {
            if (err) return console.log('Render error: ', err);
            res.send(html);
        })
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
        const commands = await tools.query("SELECT * FROM commands");

        res.render('commands', { commands: commands, 
                                title: "Commands"}, 
            function(err, html) {
            if (err) return console.log('Render error: ', err);
            res.send(html);
        });
    })




module.exports = router;