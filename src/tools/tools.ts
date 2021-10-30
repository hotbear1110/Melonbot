/* eslint-disable no-async-promise-executor */ 
// Need this disabled for await inside async promise functions
import { con } from './../credentials/login.js'
import mysql from "mysql";
import * as tools from "./tools.js";
import fs from 'fs';
import readline from 'readline';
import * as creds from './../credentials/config';
import axios from "axios";
import humanize from 'humanize-duration';
import * as regex from "./regex";
import process from 'process';
import { ChatUserstate } from 'tmi.js';

/**
 * Initializes the database.
 * @author JoachimFlottorp
 */
export const initDatabase = () => {
    con.ping((err: mysql.MysqlError) => {
        if (err) {
            console.log(err)
            process.exit(1);
        }
    })
    // Create a table for every line in init.sql
    const rl = readline.createInterface({
        input: fs.createReadStream('./init.sql'),
        terminal: false,
    });
    rl.on('line', async function(chunk) {
        await tools.query(chunk).catch((error) => {
            fs.writeFile('INIT_DATABASE_ERROR.txt', `ERROR INITIALIZING TABLES ERROR: \r\n${error}`, (error) => {
                if (error) { throw error; }
            })
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
export async function query(query: string, data: Array<any> = []): Promise<any> {
    return new Promise((Resolve, Reject) => {
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
})}

/**
 * @author JoachimFlottorp
 * @param {String} error_message Error message
 * @param {String} type info or error. Default is info
 */
export async function logger(error_message: string, type = "info") {
    if (error_message === "") { return; }
    // Logs to a file stream and to the error_logs table.
    // type can be info or error.
    
    const LOG_FOLDER = type === "info" ? "./logs/" : "./error_logs/"


    if (!fs.existsSync(LOG_FOLDER)) {
        fs.mkdirSync(LOG_FOLDER)
    }

    const logToFile = fs.createWriteStream(LOG_FOLDER + YMD(), {flags: 'a'});
    logToFile.write(process.platform === "win32" ? `\r\n${YMDHMS()} - ${error_message}` : `\n${YMDHMS()} - ${error_message}`)
    
    if (type === "error") {
        await tools.query("INSERT INTO error_logs (error_message) VALUES (?)", [error_message]);
    }
    
    logToFile.close();
}

/**
 * @author JoachimFlottorp
 * @param {Number} timeInSeconds Converts time in seconds to HOUR:MINUTES:SECONDS 
 * @returns HH:MM:SS as a String
 */
// [TODO]: Might not work.
export function convertHMS(timeInSeconds: number): string | undefined {
    try {
        const hours   = Math.floor(timeInSeconds / 3600); // get hours
        const minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60); // get minutes
        const seconds = timeInSeconds - (hours * 3600) - (minutes * 60); //  get seconds
        // add 0 if value < 10; Example: 2 => 02
        let returnValue = "";
        if (hours   < 10) {returnValue   += "0"+hours;}
        if (minutes < 10) {returnValue += ":0"+minutes;}
        if (seconds < 10) {returnValue += ":0"+seconds;}
        return returnValue
    } catch (err) {
        console.error(err)
    }
}

/**
 * @author JoachimFlottorp
 * @returns {string} Year Month Date 2021-10-09
 */
export function YMD(): string {
    const date = new Date();
    return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}` 
}

/**
 * @author JoachimFlottorp
 * @returns {string} Year Month Date Hour Minute Second 2021-10-09 02:35:33
 */
export function YMDHMS(): string {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)} ${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}` 
}

/**
 * @author JoachimFlottorp
 * @param {ChatUserstate} user User variable TMI gives. 
 * @param {string} channel Channel variable TMI gives.
 * @returns {boolean} true | false | If is mod
 */
export function isMod(user: ChatUserstate, channel: string): boolean {
    const isMod = user.mod || user['user-type'] === 'mod';
    const isBroadcaster = channel === user.username;
    const isModUp = isMod || isBroadcaster;
    return isModUp
}


type Token = {
    status: string,
    token: string,
    error: string
}
/**
    Returns the access token of a twitch account.
    @author JoachimFlottorp
    @param {Number} id User id of the requested user.
*/
export async function token(id: number): Promise<Token> {
    return new Promise(async (Resolve, Reject) => {
        // Validate token [https://dev.twitch.tv/docs/authentication#validating-requests]
        try {
            let access_token = await query('SELECT access_token FROM tokens WHERE user_id = ?;', [id])

            if(access_token.length <= 0) {
                return {status: "ERROR", token: `Sorry, user is not in our database. Please login: [ ${creds.SERVER} ]`}
            }

            access_token = access_token[0].access_token

            const verifiedToken: string = await axios.get('https://id.twitch.tv/oauth2/validate', {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).then((data) => {
                // Token works, no further action is required
                logger(`${id} has requested their access token and is alive for ${convertHMS(data.data.expires_in)} hours`)
                return access_token
            }).catch(async function (error) {
                if (error.response.data["message"] === "invalid access token") {
                    // // https://discuss.dev.twitch.tv/t/status-400-missing-client-id-when-refreshing-user-token-with-granttype-refresh-token-on-postman-it-works/26371/2
                    // Refresh token
                    const refresh_token = await tools.query('SELECT refresh_token FROM tokens WHERE user_id = ?', [id]);

                    const params: URLSearchParams = new URLSearchParams();
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
            Resolve( {status: "OK", token: verifiedToken, error: ""} );
        } catch (error) {
            Reject( {status: "ERROR", token: "", error: error} );
        }
    })
}

// https://github.com/KUNszg/kbot/blob/19b5ec0648ff539b345013f36c8bb667d45f9ba0/lib/utils/utils.js#L197
// Yoink TriHard
export function humanizeDuration(seconds: number): string {
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
    
    const options: humanize.Options = {
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
export function ascii(message: string): boolean {
    // return /^[\x00-\xFF]*$/.test(message);
    // return /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(message)
    return false;
}

/**
 * @author JoachimFlottorp
 * @param {String} channel Channel the command got triggered 
 * @param {String} message The message that needs to get checked fo banphrases.
 * @returns {Bool} True if there is a banphrase. False if it is safe. 
 */
export async function banPhrase(channel: string, message: string): Promise<boolean> {
    return new Promise(async (Resolve, Reject) => {
        try {
            const ban = [];
            
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
                        'bb', // BotBear
                    ]
                    // Check for channel specific words.
                    ban.push(blockWords.some(word => message.includes(word)))
                    
                    ban.push(await axios.post("https://nymn.pajbot.com/api/v1/banphrases/test", {
                        headers: {
                            'content-type': 'application/json'
                        },
                        message: message
                    }).then((res => res.data)).then((data) => {
                        return data.banned
                    }).catch((err) => {
                        console.log(err)
                        logger(err, "error")
                        throw err;
                    }))

                    ban.push(await axios.get(`https://paj.pajbot.com/api/channel/62300805/moderation/check_message?message=${encodeURIComponent(message).replace(/%0A/g, "")}`, {
                        headers: {
                            'content-type': 'application/json'
                        },
                        data: {
                            "message": message
                        }
                    }).then((res => res.data)).then((data) => {
                        return data.banned;
                    }).catch((err) => {
                        console.log(err);
                        logger(err, "error");
                        throw err;
                    }))
                }
            }
            
            console.log(ban)
            Resolve(ban.includes(true) ? true : false);
        } catch (error) {
            console.log(error);
            Reject(error);
        }
    })
}


async function CreateStatFile(): Promise<string> {
    return new Promise((Resolve, Reject) => {
        // eslint-disable-next-line no-undef
        const fileName = `${creds.ROOT}/stats/${YMD()}.json`;
        fs.stat(fileName, async function (err) {
            if (err === null) { Reject(fileName); return; }
            // Create a json element for every channel.
            const channels = await exports.query("SELECT * FROM channels");
            console.log("channels", channels)
            const data = channels.map((channel: { [x: string]: any; }) => {
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
export async function updateStats(channel: string, stat: string, increment = 1) {
    // [TODO]: This will not count the first stat of the day, because require throws and error while the file gets created.
    // Create if not exists.
    CreateStatFile()
    .catch((err) => {

        throw err;
        
    }).then((fileName) => {
        // Run this once the file is made.

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const file = require(fileName)

        switch (stat) {
            case "forsen": {
                
                // Update total stats for forsen
                tools.query("UPDATE channel_stats SET forsen = forsen + ? WHERE Channel = ?;", [increment, channel]);
    
                let count = -1;
                file.map(((c: { [x: string]: string; }) => {
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
export async function Live(channel: string): Promise<boolean> {
    const isLive = await tools.query("SELECT live FROM channels WHERE channel_name = ?", [channel.split("#")[1]])
    
    return isLive[0]['live'] === 1 ? true : false;
}