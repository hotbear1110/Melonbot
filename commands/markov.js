const tools = require("../tools/tools")
const UnixServer = require("./../modules/socket").UnixSocket

module.exports = {
    name: "markov",
    ping: false,
    description: "Returns a sentence parsed from a markov bot on the channel.",
    perm: 100,
    execute: async (channel, user, input, perm) => {
        try {
            const socket = UnixServer;
            return socket.Read(input.join(" "));
        } catch (err) {
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan ${err}`
        }
    }
}