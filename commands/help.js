
const fs = require("fs");
const dir = "./commands";

module.exports = {
    name: "help",
    ping: false,
    description: "Prints out the description of a command if a command is specified.",
    perm: 100,
    execute: async (channel, user, input, perm) => {
        try {
            const files = fs.readdirSync(dir)

            let commands = "Commands are: ";
            for(let i = 0; i < files.length; i++) {
                commands += files[i].replace('.js', '') + "\n";
            }

        
            return commands;
        } catch (err) {
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan ${err}`
        }
    }
}