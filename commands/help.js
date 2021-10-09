const tools = require("./../tools/tools")

module.exports = {
    name: "help",
    ping: true,
    description: "Prints out the description of a command if a command is specified.",
    perm: 100,
    execute: async (channel, user, input, perm) => {
        try {

            if (input.length <= 0) { return; }

            const description = await tools.query("SELECT description FROM commands WHERE name=?", input[0])

            return description[0].description
        } catch (err) {
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan ${err}`
        }
    }
}