module.exports = {
    name: "console_user_info",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            if(user['user-id'] == 146910710) {
                console.log(user);
                return 'Check console log BloodTrail'
            }
            return "";
        } catch (err) {
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}