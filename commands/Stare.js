module.exports = {
    name: "Stare",
    ping: false,
    description: "Pings the user with a Stare . Stare is a 7TV emote depicting a pepe looking at you.",
    perm: 100,
    onlyOffline: false,
    execute: async (channel, user, input, perm) => {
        try {
            if (input.length >= 1) {
                return `@${input[0]}, Stare` 
            }
            return `@${user['username']}, Stare`;
        } catch (err) {
            console.log(err);
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}