import { ChatUserstate } from 'tmi.js';

function shuffle(input: string[]) {
    let currentIndex = input.length, randomIndex;

    while(currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [input[currentIndex], input[randomIndex]] = [
            input[randomIndex], input[currentIndex]]

    }
    return input
}

export = {
    name: "random",
    ping: false,
    description: "Randomizes input.",
    perm: 100,
    onlyOffline: false,
    execute: async (channel: string, user: ChatUserstate, input: string[], self: boolean) => {
        try {
            shuffle(input.splice(0).toString().split(","));

            const message = input.join(" ")
            
            return `${message}`;
        } catch (err) {
            console.log(err)
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}