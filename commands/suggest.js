const tools = require("../tools/tools")

module.exports = {
    name: "suggest",
    ping: true,
    description: "Allows a user to add a suggestion. This could be from adding new commands, to fixing bugs.",
    perm: 100,
    onlyOffline: true,
    execute: async (channel, user, input, perm) => {
        try {
            input = input.splice(0)
                .toString().replace(/,/g, ' ')

            // const hasSuggested = await tools.query("SELECT suggestion FROM suggestions WHERE request_username = ?", [user['username']])
            // console.log(hasSuggested)
            // User has suggestions
            // if (hasSuggested.length !== 0) {
                // CBA DOING THIS NOW #[TODO]: FIX THIS!
                // const alreadSuggested = () => {
                //     for (var i = 0; i < hasSuggested.length; i++) {
                //         if(hasSuggested[i].suggestion === input)  {
                //             return true
                //         }
                //     }
                //     return false
                // }
                // if (alreadSuggested) {
                //     const id = await tools.query("SELECT suggestion_id FROM suggestions WHERE suggestion = ?", [input])
                //     console.log(id)
                //     return `Looks like you have already requested this, #${id.suggestion_id}`
                // } else {
                //     return `Suggestion has been added, #${await insert(input)}` 
                // }
                // return `Suggestion has been added, #${await insert(input)}`
            // } else {
            await tools.query("INSERT INTO suggestions (suggestion, request_username) VALUES (?, ?)", [input, user.username]);
            const id = await tools.query("SELECT MAX(suggestion_id) AS id FROM suggestions WHERE request_username = ?", [user.username]);
            return `Suggestion has been added, #${id[0].id}`;
            // }
        } catch (err) {
            console.log(err)
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}