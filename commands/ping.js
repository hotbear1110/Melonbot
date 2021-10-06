const shell = require("child_process")
const tools = require("../tools/tools")

module.exports = {
    name: "ping",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            const commitCount = shell.execSync("git rev-list --all --count")
            const commitSha = shell.execSync("git rev-parse --short HEAD")
            
            return `pong FeelsOkayMan . Running for NaN hours. master, ${commitSha}, commit ${commitCount}`;
        } catch (err) {
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}