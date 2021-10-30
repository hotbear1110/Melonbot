import { client } from './../bot';
import { isMod } from './../tools/tools';
import { ChatUserstate } from 'tmi.js';

module.exports = {
    name: "vanish",
    ping: false,
    description: `Vanishes the person who requests the command. Requires that the bot has the moderator role.`,
    perm: 100,
    live: true,
    onlyOffline: false,
    execute: async (channel: string, user: ChatUserstate, input: string[], self: boolean) => {
        try {
            if(isMod(user, channel)) {
                console.log("#",channel, "- Unable to vanish the rank mod or higher.")
                return "";
            }

            if (user['username'] === undefined) { return; }
            
            client.timeout(channel, user['username'], 1, "Vanish command issued")
            return "";
        } catch (err) {
            return err
        }
    }
} 