const express = require("express");
const router = express.Router();
const path = require("path")
const fs = require("fs");
const cors = require("cors")
const tools = require("./../tools/tools")
const got = require("got")
const creds = require('./../credentials/config')

const app = express();
const port = creds.PORT;
const LOG_FOLDER = "./logs/";

(async () => {
    tools.initDatabase(true);
})();

if (!fs.existsSync(LOG_FOLDER)) {
    fs.mkdirSync(LOG_FOLDER)
}

app.use(express.static(path.resolve(__dirname, 'flottorp/build')))

app.use(cors());

app.use(express.json())

const logger = (req, res, next) => {
    var logToFile = fs.createWriteStream(LOG_FOLDER + tools.YMD(), {flags: 'a'});
    logToFile.write(process.platform === "win32" ? `\r\n${tools.YMDHMS()} ${req.ip} ${creds.SERVER}${req.path} ` : `\n${tools.YMDHMS()} ${req.ip} ${creds.SERVER}${req.path} `)
    logToFile.close();
    console.log(req.url)
    next();
}

app.use(logger)

// Main
app.get("/", async function(req, res) {
    res.sendFile(path.resolve(__dirname, "flottorp/build/index.html"));
});

// When the user clicks bot login.
app.get("/login", async function(req, res) {
    log(creds.TWITCH_CLIENT_ID)
    // const path =`https://id.twitch.tv/oauth2/authorize?client_id=${creds.TWITCH_CLIENT_ID}&redirect_uri=${creds.REDIRECT_URI}&response_type=code&scope=` + encodeURIComponent("user:read:email channel:manage:broadcast")
    
    res.render("<h1>Hi</h1>")
    // res.redirect(301, path)
})

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

// After user logs in to bot they get redirected here.
app.get("/v1/twitch/code", async function(req, res) {
    var logToFile = fs.createWriteStream(LOG_FOLDER + tools.YMD(), {flags: 'a'});
    const code = req.query.code
    // Ask twitch to authenticate our code and get the actual token we can use, with refresh token
    try {
        const url = `https://id.twitch.tv/oauth2/token` +
        `?client_id=${creds.TWITCH_CLIENT_ID}` +
        `&client_secret=${creds.TWITCH_CLIENT_SECRET}` +
        `&code=${code}` +
        `&grant_type=authorization_code` + 
        `&redirect_uri=${creds.REDIRECT_URI}`
        
        const authorize = await got(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).json();
        
        // Get some more info about the user, like user id and login name.
        const user = await got("https://api.twitch.tv/helix/users", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authorize.access_token}`,
                "Client-Id": creds.TWITCH_CLIENT_ID,
            }
        }).json();

        const userInfo = {
            user_id: user.data[0].id,
            access_token: authorize.access_token,
            login_name: user.data[0].login,
            refresh_token: authorize.refresh_token,
            scope: authorize.scope.join(" ")
        }

        const token = await tools.query('SELECT * FROM tokens WHERE user_id = ?', [userInfo.user_id])

        if (token.length !== 0) {
            res.status(200).json({
                    message: 
                        "Seems like you are already in my database, if this seems like an error. Please contact admin."
                })

            res.end();
            return
        }
        
        await tools.query(`INSERT IGNORE INTO tokens 
                            (user_id, access_token, 
                            login_name, refresh_token, scope)
                            VALUES (?,"?","?","?","?"
                            );`, 
                            [userInfo.user_id, userInfo.access_token, userInfo.login_name, userInfo.refresh_token, userInfo.scope])

        res.json({message: "User added to database. Thank you! FeelsOkayMan TeaTime"})
        res.end();
        return
    } catch (error) {
        if(error.name === "HTTPError") {
            res.status(400).json({message: "User error, try again? or contact admin.", error: error})
            res.end();
            return
        }
        res.status(500).json({"error": error})
        res.end()
        return   
    }
})



app.use('/', router);
app.listen(port, async function() {
    console.log(`App listening on port ${port}`)
});