const util = require('util')

function shuffle(input) {
    let currentIndex = input.length, randomIndex;

    while(currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [input[currentIndex], input[randomIndex]] = [
            input[randomIndex], input[currentIndex]]

    }
    return input
}

module.exports = {
    name: "random",
    ping: false,
    description: "Randomizes input.",
    perm: 100,
    execute: async (channel, user, input, perm) => {
        try {
            input = input.splice(0).toString().split(",");
            
            shuffle(input)

            let message = input.join(" ")
            
            return `${message}`;
        } catch (err) {
            console.log(err)
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}