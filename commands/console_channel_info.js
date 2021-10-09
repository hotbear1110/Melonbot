const creds = require("../credentials/config")

module.exports = {
    name: "console_channel_info",
    ping: true,
    description: "Console log channel info, only meant as a debugging tool.",
    perm: 100,
    execute: async (channel, user, input, perm) => {
        try {
            if(user['user-id'] == creds.OWNER_USER_ID) {
                console.log(channel);
                return 'Check console log BloodTrail'
            }
            return "";
        } catch (err) {
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}