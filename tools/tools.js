const con = require('./../credentials/login.js').con
const mysql = require("mysql");
const tools = require("./tools.js");
const fs = require('fs');
const readline = require('readline')
const got = require('got')
const creds = require('./../credentials/config')


exports.initDatabase = () => {
    con.ping((err) => {
        if (err) {
            console.log("No database exists or username, password, host, database is wrong.");
            process.exit(1);
        }
    })
    var rl = readline.createInterface({
        input: fs.createReadStream('./init.sql'),
        // input: fs.createReadStream(website ? './../init.sql' : './init.sql'),
        terminal: false,
    });
    rl.on('line', async function(chunk) {
        const a = await tools.query(chunk).catch((error) => {
            fs.writeFile('INIT_DATABASE_ERROR.txt', `ERROR INITIALIZING TABLES ERROR: \r\n${error}`)
            process.exit(1)
        })
    })
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
        const token = await tools.query('SELECT access_token FROM tokens WHERE user_id = ?;', [id])
        if(!token.length) {
            return "Sorry, user is not in our database. Please login: [ flottorp.org ]"
        }

        if(debug) {
            console.log(token)
        }
        
        const validate = await got('https://id.twitch.tv/oauth2/validate', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token[0].access_token.replaceAll("'", "")}`,
            }
        }).json();

        if(debug) {
            console.log(validate)
        }

        return token[0].access_token.replaceAll("'", "");
    } catch (error) {
        console.log(error.response.body)
        if(error.response.body["message"] === "invalid access token" && error.response.body["status"] === 401) {
        //     // Refresh token

        //     const a = await tools.query('SELECT refresh_token FROM tokens WHERE user_id = ?', [id])
        //     console.log(a[0].refresh_token)
            // const _ = {
            //     grant_type: "refresh_token",
            //     refresh_token: await tools.query('SELECT refresh_token FROM tokens WHERE user_id = ?', [id])[0].refresh_token,
            //     client_id: creds.TWITCH_CLIENT_ID,
            //     client_secret: creds.TWITCH_CLIENT_SECRET
            // }
            // let query = []

            // for (var property in _) {
            //     var encodedKey = encodeURIComponent(property);
            //     var encodedValue = encodeURIComponent(_[property]);

            //     query.push(encodedKey + "=" + encodedValue)
            // }
            
            // const refresh = await got("https://id.twitch.tv/oauth2/token", {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            //         Accept: "*/*",
            //         "Accept-Encoding": "gzip, deflate, br",
            //         Connection: "keep-alive"
            //     },
            //     data: query
            // }).json();
            // console.log(refresh)
        } else {
            // Different error.
            return error
        }
    }
}