module.exports = {
    name: "byechat",
    ping: false,
    description: "Simply outputs the 'Okayge BYE CHAT' copypasta",
    perm: 100,
    execute: async (channel, user, input, perm) => {
        try {
            return "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀ ⠀⠀ ⠀ ⠀⠀ ⠀ ⠀⠀⎝ Okayge BYE CHAT⠀⠀ ⠀⠀⠀ ⠀⠀ ⠀ ⠀⠀ ⠀⠀ ⠀ ⠀⠀⠀⠀⠀ ⠀ ⠀┬─┬ 󠀀 ";
        } catch (err) {
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}