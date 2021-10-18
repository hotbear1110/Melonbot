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
    
    return `Current stats you can get: ${returnData}`
}

async function getStat(stat, channel) {
    const sqlStat = await tools.query(`SELECT ${stat} FROM channel_stats WHERE Channel = ?`, [channel]);

    console.log(sqlStat[0][stat]);
    return sqlStat[0][stat];
}   

module.exports = {
    name: "stats",
    ping: true,
    description: "Returns stats about certian things. This can be configured to anything. Example NymN channel: 'melon stats forsen' Returns the amount of times NymNs chat has said 'forsen'.",
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
                    switch (stat) {
                    case "forsen": // Forsen should say 'has been said' opposed to the normal 'has been used'.
                        return `${stat} has been said ${await getStat(stat, channel)} times in this channel.`
                    case "help":
                        return help();
                    default:
                        return `${stat} has been used ${await getStat(stat, channel)} times in this channel.`; 
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