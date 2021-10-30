import { ChatUserstate } from 'tmi.js';

module.exports = {
    name: "say",
    ping: false,
    description: "Says what the user inputs.",
    perm: 100,
    onlyOffline: true,
    execute: async (channel: string, user: ChatUserstate, input: string[], self: boolean) => {
        try {
            let amount: number | string = input[0];
            // Is number
            if(typeof amount === "number") {
                if(amount > 64) {
                    amount = 64;
                }
                const joined = input.splice(1)
                .toString().replace(/,/g, ' ');
                let message = "";
                for (let i = 0; i < amount; i++) {
                    message += joined + " ";
                }
                return `${message}`;
            }
            else {
                return input.splice(0).toString().replace(/,/g, ' ');
            }
        } catch (err) {
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}