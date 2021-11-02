import { ChatUserstate } from 'tmi.js';
import * as tools from './../tools/tools';
import * as creds from './../credentials/config';
import { client } from './../bot';

// Every stats that can be triggered.
const stats = [
    ".", // indexOf for some reason does not work on index 0.
    'forsen', // forsen count 4Head.
    'help' // Returns every stats that the bot collects.
];

function help() {
    let returnData;
                    
    for (let i = 0; i < stats.length - 1; i++) {
        if (i === 0) {
            returnData = `${stats[1]} `
        } else {
            returnData += `| ${stats[i+1]}`
        }
    }
    
    // [TODO]: Add a way to check stats per date.
    return `Stats: ${returnData}`
}

async function getStat(stat: string, channel: string) {
    const sqlStat = await tools.query(`SELECT ${stat} FROM channel_stats WHERE Channel = ?`, [channel]);

    // eslint-disable-next-line no-undef
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const file = require(`${creds.ROOT}/stats/${tools.YMD()}.json`)

    let count = -1;
    let today = file.map(((c: { [x: string]: string; }) => {
        count++;
        if (c['channel'] === channel) {
            return file[count].forsen;
        }
    })) 
    
    today = today.filter( Number )

    return      {
                    "alltime": Number(sqlStat[0][stat]),
                    "today": Number(today)
                }
}   

export = {
    name: "stats",
    ping: true,
    description: "Returns stats about certain things. This can be configured to anything. Example NymN channel: 'melon stats forsen' Says the total amount of times your chat has said 'forsen', and today.",
    perm: 100,
    onlyOffline: false,
    execute: async (channel: string, user: ChatUserstate, input: string[], self: boolean) => {
        try {
            // If no stat was specified
            if (typeof input[0] === "undefined") {
                return help();
            } else {
                const stat = input[0].toLowerCase();
                // If the user chose a stat that exist
                if (stats.indexOf(stat) !== -1 && stat[0] !== '.') {
                    const a = await getStat(stat, channel);
                    if (stat === "help") {
                        return help();
                    }
                    client.say(channel, `${stat} Total: ${a['alltime']}. Today: ${a['today']}.`);
                } else {
                    client.say(channel, `${input.join(" ")} is not in my database.`);
                }
                return;
            }
        } catch (err) {
            console.log(err)
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}