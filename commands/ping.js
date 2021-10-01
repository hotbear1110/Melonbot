module.exports = {
    name: "ping",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            return `pong FeelsOkayMan`;
        } catch (err) {
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}