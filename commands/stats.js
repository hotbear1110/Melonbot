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

async function getStat(stat) {
    const sqlStat = await tools.query(`SELECT ${stat} FROM stats WHERE where_placeholder = 1`);

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
            if (typeof input[0] === "undefined") {
                return help();
            } else {
                if (stats.indexOf(input[0].toLowerCase() > 1)) {
                    
                    if (input[0].toLowerCase() !== "forsen") {
                        return `${input[0].toLowerCase()} has been used ${await getStat(input[0].toLowerCase())} times!`; 
                    } else {
                        return `${input[0].toLowerCase()} has been said ${await getStat(input[0].toLowerCase())} times!`
                    }
                } else {
                    return help();
                }
            }
        } catch (err) {
            console.log(err)
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}