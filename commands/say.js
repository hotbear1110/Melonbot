const { client } = require("../bot");

module.exports = {
    name: "say",
    ping: false,
    execute: async (channel, user, input, perm) => {
        try {
            var amount = input[0];
            // Is number
            if(Number(amount)) {
                if(amount > 64) {
                    amount = 64;
                }
                input = input.splice(1)
                .toString().replace(/,/g, ' ');
                var message = "";
                for (var i = 0; i < amount; i++) {
                    message += input + " ";
                }
                return `${message}`;
            }
            else {
                input = input.splice(0)
                .toString().replace(/,/g, ' ');
    
                return `${input}`;
            }
        } catch (err) {
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}