module.exports = {
    name: "github",
    ping: true,
    description: "Pings the user with the github page.",
    perm: 100,
    execute: async (channel, user, input, perm) => {
        try {
            return "https://github.com/JoachimFlottorp/Melonbot";
        } catch (err) {
            console.log(err);
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}