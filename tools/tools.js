const con = require('./../credentials/login.js').con
const mysql = require("mysql");
const tools = require("./tools.js");
const fs = require('fs');
const readline = require('readline')
const got = require('got')
const creds = require('./../credentials/config')
const axios = require("axios");
const humanize = require('humanize-duration');


exports.initDatabase = () => {
    con.ping((err) => {
        if (err) {
            console.log("No database exists or username, password, host, database is wrong.");
            process.exit(1);
        }
    })
    // Create a table for every line in init.sql
    var rl = readline.createInterface({
        input: fs.createReadStream('./init.sql'),
        terminal: false,
    });
    rl.on('line', async function(chunk) {
        await tools.query(chunk).catch((error) => {
            fs.writeFile('INIT_DATABASE_ERROR.txt', `ERROR INITIALIZING TABLES ERROR: \r\n${error}`)
            process.exit(1)
        })
    })

    // Create a row in stats. We only require one row. and will update this when we want to.
    tools.query("INSERT IGNORE INTO stats VALUES (1, 0)")
}

exports.query = (query, data = []) => new Promise((Resolve, Reject) => {
    con.query(mysql.format(query, data), async (err, results) => {
        if (err) {
            console.log(query, '\n//\n', err);
            await tools.query(`
                INSERT INTO error_logs (error_message) VALUES (?)`,
                [JSON.stringify(err)])
            Reject(err);
        } else {
            Resolve(results)
        }
    });
})

exports.logger = async (error_message, type = "info") => {
    // Logs to a file stream and to the error_logs table.
    // type can be info or error.
    
    const LOG_FOLDER = type === "info" ? "./logs/" : "./error_logs/"


    if (!fs.existsSync(LOG_FOLDER)) {
        fs.mkdirSync(LOG_FOLDER)
    }

    var logToFile = fs.createWriteStream(LOG_FOLDER + tools.YMD(), {flags: 'a'});
    logToFile.write(process.platform === "win32" ? `\r\n${tools.YMDHMS()} - ${error_message}` : `\n${tools.YMDHMS()} - ${error_message}`)
    
    if (type === "error") {
        await tools.query("INSERT INTO error_logs (error_message) VALUES (?)", [error_message]);
    }
    
    logToFile.close();
}

exports.convertHMS = (timeInSeconds) => {
    try {
        const sec = parseInt(timeInSeconds, 10); // convert value to number if it's string
        let hours   = Math.floor(sec / 3600); // get hours
        let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
        let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
        // add 0 if value < 10; Example: 2 => 02
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes+':'+seconds; // Return is HH : MM : SS
    } catch (err) {
        console.error(err)
    }
}

exports.YMD = () => {
    let date = new Date();
    return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}.log` 
}

exports.YMDHMS = () => {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)} ${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}` 
}

exports.isMod = (user, channel) => {
    let isMod = user.mod || user['user-type'] === 'mod';
    let isBroadcaster = channel === user.username;
    let isModUp = isMod || isBroadcaster;
    return isModUp
}

// Get the token for a user, this also refreshes the token if needed.
exports.token = async (id, debug = false) => {
    // Validate token [https://dev.twitch.tv/docs/authentication#validating-requests]
    try {
        var access_token = await tools.query('SELECT access_token FROM tokens WHERE user_id = ?;', [id])

        if(access_token.length <= 0) {
            return {status: "ERROR", token: `Sorry, user is not in our database. Please login: [ ${creds.HTTPS ? `https://${creds.SERVER}` : `http://${creds.SERVER}`} ]`}
        }

        access_token = access_token[0].access_token.replace(/'/g, "")

        if(debug) {
            console.log(access_token)
        }
    
        const verifiedToken = await axios.get('https://id.twitch.tv/oauth2/validate', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).then((data) => {
            // Token works, no further action is required
            tools.logger(`${id} has requested their access token and is alive for ${tools.convertHMS(data.data.expires_in)} hours`)
            return access_token
        }).catch(async function (error) {
            if (error.response.data["message"] === "invalid access token") {
                // // https://discuss.dev.twitch.tv/t/status-400-missing-client-id-when-refreshing-user-token-with-granttype-refresh-token-on-postman-it-works/26371/2
                // Refresh token
                const refresh_token = await tools.query('SELECT refresh_token FROM tokens WHERE user_id = ?', [id]);

                const params = new URLSearchParams();
                params.append("grant_type", "refresh_token");
                params.append("refresh_token", refresh_token[0].refresh_token.replace(/'/g, ""));
                params.append("client_id", creds.TWITCH_CLIENT_ID);
                params.append("client_secret", creds.TWITCH_CLIENT_SECRET);

                const refreshToken = axios({
                    method: 'POST',
                    url: "https://id.twitch.tv/oauth2/token",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                        Accept: "*/*",
                        "Accept-Encoding": "gzip, deflate, br",
                        Connection: "keep-alive"
                    },
                    data: params.toString()
                }).then(async function (data) {
                    console.log(data.data)
                    await tools.query(`UPDATE tokens SET access_token = "${data.data.access_token}", refresh_token = "${data.data.refresh_token}" WHERE user_id = ${id}`)
                    return data.data.access_token
                }).catch((error) => {
                    console.log(error)
                    throw error
                })
                return refreshToken
            }
        })
        return {status: "OK", token: verifiedToken};
    } catch (error) {
        return error
    }
}

// https://github.com/KUNszg/kbot/blob/19b5ec0648ff539b345013f36c8bb667d45f9ba0/lib/utils/utils.js#L197
// Yoink TriHard
const shortHumanize = humanize.humanizer({
    language: 'shortEn',
    languages: {
        shortEn: {
            y: () => 'y',
            mo: () => 'mo',
            w: () => 'w',
            d: () => 'd',
            h: () => 'h',
            m: () => 'm',
            s: () => 's',
        },
    },
});
exports.humanizeDuration = (seconds) => {
    const options = {
        units: ['y', 'mo', 'd', 'h', 'm', 's'],
        largest: 3,
        round: true,
        spacer: '',
    };
    return shortHumanize(seconds*1000, options);
}