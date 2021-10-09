const shell = require("child_process")
const tools = require("../tools/tools")
const creds = require("../credentials/config")

module.exports = {
    name: "ping",
    ping: true,
    description: "Pings the user with some small info.",
    perm: 100,
    execute: async (channel, user, input, perm) => {
        try {
            const commitCount = shell.execSync("git rev-list --all --count")
            const commitSha = shell.execSync("git rev-parse --short HEAD")

            const devBot = creds.DEVELOPMENT ? " Development Bot" : "";
            
            return `pong FeelsOkayMan . Running for ${tools.humanizeDuration(process.uptime())}. master, ${commitSha}, commit ${commitCount}.${devBot}`;
        } catch (err) {
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}