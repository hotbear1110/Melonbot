const tools = require("../tools/tools")

// Every stats that can be triggered.
const stats = [
    ".", // indexOf for some reason does not work on index 0.
    'forsen', // NymN channel specific.
    'help' // Returns every stats that the bot collects.
];

function help() {
    let returnData;
                    
    for (var i = 0; i < stats.length - 1; i++) {
        if (i === 0) {
            returnData = `${stats[1]} `
        } else {
            returnData += `| ${stats[i+1]}`
        }
    }
    
    // [TODO]: Add a way to check stats per date.
    return `Stats: ${returnData}`
}

async function getStat(stat, channel) {
    const sqlStat = await tools.query(`SELECT ${stat} FROM channel_stats WHERE Channel = ?`, [channel]);

    // eslint-disable-next-line no-undef
    const file = require(`${ROOT}/stats/${tools.YMD()}.json`)

    let count = -1;
    let today = file.map((c => {
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

module.exports = {
    name: "stats",
    ping: true,
    description: "Returns stats about certain things. This can be configured to anything. Example NymN channel: 'melon stats forsen' Says the total amount of times your chat has said 'forsen', and today.",
    perm: 100,
    execute: async (channel, user, input, perm) => {
        try {
            // If no stat was specified
            if (typeof input[0] === "undefined") {
                return help();
            } else {
                const stat = input[0].toLowerCase();
                // If the user chose a stat that exist
                if (stats.indexOf(stat) !== -1 && stat[0] !== '.') {
                    const a = await getStat(stat, channel);
                    switch (stat) {
                    case "forsen": // Forsen should say 'has been said' opposed to the normal 'has been used'.
                        return `${stat} has been said ${a['alltime']} times in this channel. And ${a['today']} today.`
                    case "help":
                        return help();
                    default:
                        return `${stat} has been used ${a['alltime']} times in this channel. And ${a['today']} today.`; 
                    }
                } else {
                    return `${input.join(" ")} is not in my database.`
                }
            }
        } catch (err) {
            console.log(err)
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}