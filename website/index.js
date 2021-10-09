const express = require("express");
const path = require("path")
const fs = require("fs");
const cors = require("cors");
const tools = require("./../tools/tools");
const got = require("got");
const creds = require('./../credentials/config');
const shell = require("child_process")

const app = express();
const router = express.Router();
const port = creds.PORT;

const LOG_FOLDER = "./logs/";

global.WEBSITE_ROOT = path.resolve(__dirname)

if (!fs.existsSync(LOG_FOLDER)) {
    fs.mkdirSync(LOG_FOLDER)
}

app.use("/", router);

app.use(express.static(path.resolve(__dirname, 'flottorp/build')))

app.use(cors());

app.use(express.json())

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

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

app.use('/bot', require('./routes/bot'))

//////////////////// API //////////////////// 

app.use("/v1/stats", require("./routes/api/stats"))

//////////////////// LOGIN //////////////////// 

app.use("/login/twitch", require("./routes/authentication/twitch"))

//////////////////// MISC ////////////////////

app.get("*", async function(req, res) {
    res.sendFile(path.resolve(__dirname, "public/error_404.html"))
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});