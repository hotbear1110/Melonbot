import { client } from "./../bot";
import { ChatUserstate } from 'tmi.js';

export = {
    name: "github",
    ping: true,
    description: "Pings the user with the github page.",
    perm: 100,
    onlyOffline: true,
    execute: async (channel: string, user: ChatUserstate, input: string[], self: boolean) => {
        try {
            client.say(channel, "https://github.com/JoachimFlottorp/Melonbot");
            return "";
        } catch (err) {
            console.log(err);
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}