const client = require("../bot").client
const isMod = require("../tools/tools").isMod

module.exports = {
    name: "vanish",
    ping: false,
    description: `Vanishes the person who requests the command.`,
    perm: 100,
    execute: async (channel, user, input, perm) => {
        try {
            if(isMod(user, channel)) {
                console.log("#",channel, "- Unable to vanish the rank mod or higher.")
                return "";
            }

            client.timeout(channel, user['username'], 1, "Vanish command issued")
            return "";
        } catch (err) {
            return err
        }
    }
} 