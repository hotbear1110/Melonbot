const tools = require("../tools/tools")
const UnixServer = require("./../modules/socket");

module.exports = {
    name: "markov",
    ping: false,
    description: "Returns a sentence parsed from a markov bot on the channel.",
    perm: 100,
    execute: async (channel, user, input, perm) => {
        try {
            return UnixServer("READ", input.join(" "));
        } catch (err) {
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan ${err}`
        }
    }
}