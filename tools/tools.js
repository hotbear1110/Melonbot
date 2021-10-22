const con = require('./../credentials/login.js').con
const mysql = require("mysql");
const tools = require("./tools.js");
const fs = require('fs');
const readline = require('readline')
const creds = require('./../credentials/config')
const axios = require("axios");
const humanize = require('humanize-duration');
const regex = require("./regex")
const process = require('process')

/**
 * Initializes the database.
 * @author JoachimFlottorp
 */
exports.initDatabase = () => {
    con.ping((err) => {
        if (err) {
            console.log(err)
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
    // [NOTE]: Add a 0, for every stats that gets added.
    tools.query("INSERT IGNORE INTO stats VALUES (1, 0)")
}

/**
 * @author JoachimFlottorp
 * @param {String} query The query string. Any user input should be set to a ? Example: [SELECT * WHERE x=?] 
 * @param {Array} data Array containing user input. Changes ? in query string to that of the array. 
 * @returns {Promise} Array of json with data. Access element as foo[0].bar
 */
exports.query = (query, data = []) => new Promise((Resolve, Reject) => {
    con.query(mysql.format(query, data), async (err, results) => {
        if (err !== null) {
            await tools.query(`
                INSERT INTO error_logs (error_message) VALUES (?)`,
                [JSON.stringify(err)])
            Reject(err);
        } else {
            Resolve(results)
        }
    });
})

/**
 * @author JoachimFlottorp
 * @param {String} error_message Error message
 * @param {String} type info or error. Default is info
 */
exports.logger = async (error_message, type = "info") => {
    if (error_message === "") { return; }
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

/**
 * @author JoachimFlottorp
 * @param {Number} timeInSeconds Converts time in seconds to HOUR:MINUTES:SECONDS 
 * @returns HOUR:MINUTES:SECONDS as a String
 */
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

/**
 * @author JoachimFlottorp
 * @returns Year Month Date 2021-10-09
 */
exports.YMD = () => {
    let date = new Date();
    return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}` 
}

/**
 * @author JoachimFlottorp
 * @returns Year Month Date Hour Minute Second 2021-10-09 02:35:33
 */
exports.YMDHMS = () => {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)} ${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}` 
}

/**
 * @author JoachimFlottorp
 * @param {*} user User variable TMI gives. 
 * @param {*} channel Channel variable TMI gives.
 * @returns true | false | If is mod
 */
exports.isMod = (user, channel) => {
    let isMod = user.mod || user['user-type'] === 'mod';
    let isBroadcaster = channel === user.username;
    let isModUp = isMod || isBroadcaster;
    return isModUp
}

/**
    Returns the access token of a twitch account.
    @author JoachimFlottorp
    @param {Number} id User id of the requested user.
*/
exports.token = async (id) => {
    // Validate token [https://dev.twitch.tv/docs/authentication#validating-requests]
    try {
        var access_token = await tools.query('SELECT access_token FROM tokens WHERE user_id = ?;', [id])

        if(access_token.length <= 0) {
            return {status: "ERROR", token: `Sorry, user is not in our database. Please login: [ ${creds.SERVER} ]`}
        }

        access_token = access_token[0].access_token

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
                params.append("refresh_token", refresh_token[0].refresh_token);
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
        return {status: "ERROR", token: error}
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

/**
 * @author JoachimFlottorp
 * @param {String} message 
 * @return {Boolean} Wether it is ascii or not.
 * @deprecated For now, i personally don't like the regex it is using.
 */
// eslint-disable-next-line no-unused-vars
exports.ascii = async function(message) {
    // return /^[\x00-\xFF]*$/.test(message);
    // return /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(message)
}

/**
 * @author JoachimFlottorp
 * @param {String} channel Channel the command got triggered 
 * @param {String} message The message that needs to get checked fo banphrases.
 * @returns {Bool} True if there is a banphrase. False if it is safe. 
 */
exports.banPhrase = async function(channel, message) {
    try {
        let ban = [];
        
        ban.push(regex.racism1.test(message));
        ban.push(regex.racism2.test(message));
        ban.push(regex.racism3.test(message));
        ban.push(regex.racism4.test(message));
        ban.push(regex.url.test(message));
        ban.push(regex.invisChar.test(message));

        // Does not work atm. Triggers on example: #
        // ban.push(await tools.ascii(message));

        // https://gist.github.com/RAnders00/5653be6d9bef01b314145062752e7aef | Example NymN's banphrases
        // NymN, forsen and many others have personal banphrases tied to pajladas bot.         
        switch (channel) {
            case "#nymn": {

                // Bot prefixes.
                const blockWords = [
                    '?', // Thepositivebot
                    '!', // Botnextdoor
                    '$', // Supibot
                ]
                
                ban.push(await axios.post("https://nymn.pajbot.com/api/v1/banphrases/test", {
                    headers: {
                        'content-type': 'application/json'
                    },
                    message: message
                }).then((res => res.data)).then((data) => {
                    return data.banned
                }).catch((err) => {
                    console.log(err)
                    tools.logger(err, "error")
                    throw err;
                }))

                ban.push(await axios.get(`https://paj.pajbot.com/api/channel/62300805/moderation/check_message?message=${encodeURIComponent(message).replace(/%0A/g, "")}`, {
                    headers: {
                        'content-type': 'application/json'
                    },
                    message: message
                }).then((res => res.data)).then((data) => {
                    return data.banned;
                }).catch((err) => {
                    console.log(err);
                    tools.logger(err, "error");
                    throw err;
                }))

                // Check for channel specific words.
                ban.push(blockWords.some(word => message.includes(word)))
                
            }
        }
        
        console.log(ban)
        return ban.includes(true) ? true : false;
    } catch (error) {
        console.log(error);
        throw error;
    }

}


async function CreateStatFile() {
    return new Promise((Resolve, Reject) => {
        // eslint-disable-next-line no-undef
        const fileName = `${ROOT}/stats/${tools.YMD()}.json`;
        fs.stat(fileName, async function (err) {
            if (err === null) { Reject(fileName); return; }
            // Create a json element for every channel.
            const channels = await exports.query("SELECT * FROM channels");
            console.log("channels", channels)
            const data = channels.map(channel => {
                console.log({"channel": channel['channel_name'], "forsen": 0 })
                return {"channel": channel['channel_name'], "forsen": 0 }
            })
            // Write to file.
            fs.writeFile(fileName, JSON.stringify(data, null, 2), err => {
                if (err) Reject(err);
            })
        });
        Resolve(fileName);
    });
}

/**
 * @author JoachimFlottorp
 * @param {String} channel The channel to update
 * @param {String} stat The stat to update
 * @param {Number} increment The amount to update | Default - 1
 */
exports.updateStats = async function(channel, stat, increment = 1) {
    // [TODO]: This will not count the first stat of the day, because require throws and error while the file gets created.
    // Create if not exists.
    CreateStatFile()
    .catch((err) => {

        throw err;
        
    }).then((fileName) => {
        // Run this once the file is made.

        const file = require(fileName)

        switch (stat) {
            case "forsen": {
                
                // Update total stats for forsen
                tools.query("UPDATE channel_stats SET forsen = forsen + ? WHERE Channel = ?;", [increment, channel]);
    
                let count = -1;
                file.map((c => {
                    count++;
                    if (c['channel'] === channel) {
                        const forsen = file[count].forsen
                        
                        file[count].forsen = forsen + 1;

                        fs.writeFile(fileName, JSON.stringify(file, null, 2), (err) => {
                            if (err) throw err;
                        })
                    }
                }))
                
                break;
            }
    
            default: {
                break;
            }
        }
    })
}

/**
 * @author JoachimFlottorp
 * @param {String} channel Name of channel 
 * @returns {Boolean} True if is live, False if not live.
 */

exports.Live = async (channel) => {
    const isLive = await tools.query("SELECT live FROM channels WHERE channel_name = ?", [channel.split("#")[1]])
    
    return isLive['live']
}