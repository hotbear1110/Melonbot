module.exports = {
    name: "console_channel_info",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            if(user['user-id'] == 146910710) {
                console.log(channel);
                return 'Check console log BloodTrail'
            }
            return "";
        } catch (err) {
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}