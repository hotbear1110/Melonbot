import { ChatUserstate } from 'tmi.js';
import requireDir from 'require-dir';


function FindPipe(input: string[]) {
    for (const [index, element] of input.entries()) {
        if (element === '|') return index
    }
}

async function Command(channel: string, user: ChatUserstate, input: string[], perm: number, command: string) {
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

export = {
    name: "pipe",
    ping: false,
    description: "Pipes out the output of a command to another command. Only supports two commands, Example: pipe say 10 Okayge FeelsGoodMan | random",
    perm: 100,
    onlyOffline: false,
    execute: async (channel: string, user: ChatUserstate, input: string[], self: boolean) => {
        // return `${user.username}, Does not work at the moment FeelsBadMan`
        try {
            const pipe = FindPipe(input); 
        
            if (typeof pipe === "undefined") {
                return;
            }
                
            const firstInput = input.splice(1, pipe - 1)
            const firstCommand = input[0]
            const secondCommand = input[2]

            // First command
            console.log(firstCommand)
            console.log(firstInput)
            console.log(secondCommand)
            console.log(pipe)
            
            const first = await Command(channel, user, firstInput, 100, firstCommand);
            if(first.substr(0, 0) === '0') {
                return first.substr(1, first.length)
            }
            const firstArr = first.split(" ");
            
            // Second command
            const second = await Command(channel, user, firstArr, 100, secondCommand)
            if(second.substr(0, 0) === '0') {
                return second.substr(1, second.length)
            }
            
            return second
        } catch (err) {
            console.log(err)
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan ${err}`
        }
    }
}