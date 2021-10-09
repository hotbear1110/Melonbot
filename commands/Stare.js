module.exports = {
    name: "Stare",
    ping: true,
    description: "Pings the user with a Stare . Stare is a 7TV emote depicting a pepe looking at you.",
    perm: 100,
    execute: async (channel, user, input, perm) => {
        try {
            return `Stare`;
        } catch (err) {
            console.log(err);
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}