function FindPipe(input) {
    for (const [index, element] of input.entries()) {
        if (element === '|') return index
    }
}

async function Command(channel, user, input, perm, command) {
    const requireDir = require("require-dir");
    const commands = requireDir("./");
    try {
        if(typeof commands[command] === "undefined") {
            return `${user.username} undefined command FeelsDankMan`;
        }
        return await commands[command].execute(channel, user, input, perm);
    } catch (err) {
        console.log(err)
        return `0 ${err}`
    }
}

module.exports = {
    name: "pipe",
    ping: false,
    description: "Pipes out the output of a command to another command. Only supports two commands, Example: pipe say 10 Okayge FeelsGoodMan | random",
    perm: 100,
    execute: async (channel, user, input, perm) => {
        // return `${user.username}, Does not work at the moment FeelsBadMan`
        try {
            const pipe = FindPipe(input); 
            const firstInput = input.splice(1, pipe - 1)
            const firstCommand = input[0]
            const secondCommand = input[2]

            // First command
            console.log(firstCommand)
            console.log(firstInput)
            console.log(secondCommand)
            console.log(pipe)
            
            const first = await Command(channel, user, firstInput, perm, firstCommand);
            if(first.substr(0, 0) === '0') {
                return first.substr(1, first.length)
            };
            const firstArr = first.split(" ");
            
            // Second command
            const second = await Command(channel, user, firstArr, perm, secondCommand)
            if(second.substr(0, 0) === '0') {
                return second.substr(1, second.length)
            };
            
            return second
        } catch (err) {
            console.log(err)
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan ${err}`
        }
    }
}