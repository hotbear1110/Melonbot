const creds = require("../credentials/config")

module.exports = {
    name: "console_user_info",
    ping: true,
    description: "Console log user info, meant as debug.",
    perm: 100,
    execute: async (channel, user, input, perm) => {
        try {
            if(user['user-id'] == creds.OWNER_USER_ID) {
                console.log(user);
                return 'Check console log BloodTrail'
            }
            return "";
        } catch (err) {
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}