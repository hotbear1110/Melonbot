const express = require("express");
const router = express.Router();
const path = require("path")
const fs = require("fs");
const cors = require("cors");
const tools = require("./../tools/tools");
const got = require("got");
const creds = require('./../credentials/config');
const shell = require("child_process")

const app = express();
const port = creds.PORT;
const LOG_FOLDER = "./logs/";


if (!fs.existsSync(LOG_FOLDER)) {
    fs.mkdirSync(LOG_FOLDER)
}

app.use(express.static(path.resolve(__dirname, 'flottorp/build')))

app.use(cors());

app.use(express.json())

async function logger(req, res, next) {
    var logToFile = fs.createWriteStream(LOG_FOLDER + tools.YMD(), {flags: 'a'});
    logToFile.write(process.platform === "win32" ? `\r\n${tools.YMDHMS()} ${creds.SERVER}${req.path} ` : `\n${tools.YMDHMS()} ${creds.SERVER}${req.path} `)
    logToFile.close();
    console.log(req.url)
    next();
}

app.use(logger);

//////////////////// Website //////////////////// 
app.get("/", async function(req, res) {
    res.sendFile(path.resolve(__dirname, "flottorp/build/index.html"));
});

app.get("/Bot", async function(req, res) {
    res.sendFile(path.resolve(__dirname, "flottorp/build/index.html"))
})

app.get("/bot/login", async function(req, res) {
    res.sendFile(path.resolve(__dirname, "flottorp/build/index.html"))
})

app.get("/bot/login/redirect", async function(req, res) {
    const path =`https://id.twitch.tv/oauth2/authorize?client_id=${creds.TWITCH_CLIENT_ID}&redirect_uri=${creds.REDIRECT_URI}&response_type=code&scope=` + encodeURIComponent("user:read:email channel:manage:broadcast")
    
    res.redirect(301, path);
})

//////////////////// API //////////////////// 

/*
    stats: {
        commitHash: "foo",
        commits: bar
        uptime: "baz",
        commandsHandled: taz,
        //// More to come ////
    }
*/
app.get("/v1/stats", async function(res, res) {

    const ch = await tools.query("SELECT commandsHandled FROM stats;")
    
    const stats = {
        commitHash: shell.execSync("git rev-parse --short HEAD").toString().replace("\n", ""),
        commits: Number(shell.execSync("git rev-list --all --count").toString()),
        uptime: tools.humanizeDuration(process.uptime()),
        commandsHandled: Number(ch[0].commandsHandled),
    }
    res.json(stats)
})

//////////////////// LOGIN //////////////////// 

// After user logs in to bot they get redirected here.
app.get("/v1/twitch/code", async function(req, res) {
    var logger = ""
    const code = req.query.code
    // Ask twitch to authenticate our code and get the actual token we can use, with refresh token
    try {
        
        if(typeof req.query.error !== "undefined") {
            logger += ` ${req.path} - ${req.query.error}`
            tools.logger(logger, "error")
            res.status(500).json({error: "Error with server. Contact admin."})
            res.end();
            return
        }

        const url = `https://id.twitch.tv/oauth2/token` +
        `?client_id=${creds.TWITCH_CLIENT_ID}` +
        `&client_secret=${creds.TWITCH_CLIENT_SECRET}` +
        `&code=${code}` +
        `&grant_type=authorization_code` + 
        `&redirect_uri=${creds.REDIRECT_URI}`

        const authorize = await got(url, {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
        }).json();
        console.log(authorize)
        
        // Get some more info about the user, like user id and login name.
        const user = await got("https://api.twitch.tv/helix/users", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authorize.access_token}`,
                "Client-Id": creds.TWITCH_CLIENT_ID,
            }
        }).json();
        console.log(user)

        const userInfo = {
            user_id: user.data[0].id,
            access_token: authorize.access_token,
            login_name: user.data[0].login,
            refresh_token: authorize.refresh_token,
            scope: authorize.scope.join(" ")
        }

        const token = await tools.query('SELECT * FROM tokens WHERE user_id = ?', [userInfo.user_id])

        if (token.length !== 0) {
            // Delete old token if the user decides to login again.
            tools.query("DELETE FROM tokens WHERE user_id = ?;", [userInfo.user_id])
        }
        
        await tools.query(`INSERT INTO tokens 
                            (user_id, access_token, 
                            login_name, refresh_token, scope)
                            VALUES (?,"?","?","?","?"
                            );`, 
                            [userInfo.user_id, userInfo.access_token, 
                            userInfo.login_name, userInfo.refresh_token, 
                            userInfo.scope])

        logger += `User_id: ${userInfo.user_id} - ${userInfo.login_name} added to database`, 
        tools.logger(logger, "info")

        const http = creds.HTTPS ? "https://" : "http://";
        
        res.redirect(`${creds.SERVER}/bot/login?loggedIn=true`)
        res.end();
        return
    } catch (error) {
        tools.logger(JSON.stringify(error), "error")
        res.status(500).json({"error": error})
        res.end()
        return   
    }
})

app.get("*", async function(req, res) {
    res.sendFile(path.resolve(__dirname, "public/error_404.html"))
})

app.use('/', router);
app.listen(port, async function() {
    console.log(`App listening on port ${port}`)
});