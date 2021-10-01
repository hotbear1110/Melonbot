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
const LOG_FOLDER = "./logs/"

if (!fs.existsSync(LOG_FOLDER)) {
    fs.mkdirSync(LOG_FOLDER)
}

app.use(express.static(path.resolve(__dirname, 'twitchbot/build')))

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
    res.send("<h1>Hello</h1>")
    // res.sendFile(path.resolve(__dirname, "twitchbot/build"));
});

// When the user clicks bot login.
app.get("/login", async function(req, res) {
    log(creds.TWITCH_CLIENT_ID)
    // const path =`https://id.twitch.tv/oauth2/authorize?client_id=${creds.TWITCH_CLIENT_ID}&redirect_uri=${creds.REDIRECT_URI}&response_type=code&scope=` + encodeURIComponent("user:read:email channel:manage:broadcast")
    
    res.render("<h1>Hi</h1>")
    // res.redirect(301, path)
})

// After user logs in to bot they get redirected here.
app.get("/v1/twitch/code", async function(req, res) {
    var logToFile = fs.createWriteStream(LOG_FOLDER + tools.YMD(), {flags: 'a'});
    const code = req.query.code
    // Get code from login

    const url = `https://id.twitch.tv/oauth2/token` +
            `?client_id=${creds.TWITCH_CLIENT_ID}` +
            `&client_secret=${creds.TWITCH_CLIENT_SECRET}` +
            `&code=${code}` +
            `&grant_type=authorization_code` + 
            `&redirect_uri=${creds.REDIRECT_URI}`
    
    console.log(url)
    const authorize = await got(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).json();
    // authorize(code).then((tokens) => {
    //     // Ask twitch to authenticate our code and get the actual token we can use, with refresh token
    //     // Get some more info about the user, like user id and login name.
    //     users(tokens.data.access_token).then((id) => {
            
    //         const userInfo = {
    //             user_id: id.data.data[0].id,
    //             access_token: tokens.data.access_token,
    //             login_name: id.data.data[0].login,
    //             refresh_token: tokens.data.refresh_token,
    //             scope: tokens.data.scope.join(" ")
    //         }
            
    //         // Construct our SQL query
    //         tools.query(`INSERT IGNORE INTO tokens (user_id, access_token, login_name, refresh_token, scope)
    //         VALUES (?,"?","?","?","?"
    //         );`, 
    //         [userInfo.user_id, userInfo.access_token, userInfo.login_name, userInfo.refresh_token, userInfo.scope])

    //         .then(() => {
    //             logToFile.write(process.platform === "win32" ? `\r\n${tools.YMDHMS()} ${req.ip} ${process.env.SERVER}${req.path} ${userInfo.user_id} Added to database ` : `\n${tools.YMDHMS()} ${req.ip} ${process.env.SERVER}${req.path} ${userInfo.user_id} Added to database `)
    //             logToFile.close();
    //             console.log(userInfo.user_id + " Added to database")
    //             res.status(301).redirect("/?loggedIn=true")
    //         })
    //         .catch((error) => {
    //             logToFile.write(process.platform === "win32" ? `\r\n${tools.YMDHMS()} ${req.ip} ${process.env.SERVER}${req.path} ${userInfo.user_id} ${error} ` : `\n${tools.YMDHMS()} ${req.ip} ${process.env.SERVER}${req.path} ${userInfo.user_id} ${error} `)
    //             logToFile.insert()
    //             console.log(error)
    //             res.status(500).send("Sorry, error. Contact Admin.")
    //         })
    //     }).catch((err) => {
    //         console.log(err)
    //         res.sendStatus(401)
    //     })
    // }).catch((err) => {
    //     console.log(err)
    //     res.sendStatus(401)
    // })
})

app.get('*', async function(req, res) {
    res.sendFile(path.resolve(__dirname, "public/index.html"))
});

app.use('/', router);
app.listen(port, async function() {
    console.log(`App listening on port ${port}`)
});