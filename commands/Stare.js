module.exports = {
    name: "Stare",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            return `Stare`;
        } catch (err) {
            console.log(err);
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}