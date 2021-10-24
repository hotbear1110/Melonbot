const express = require("express");
const path = require('path');
const router = express.Router();

// Testing out three.js
router
    .route("/")
    .get(async function(req, res) {
        res.sendFile(path.resolve(WEBSITE_ROOT, `public/game/game.html`));
})

// router
//     .route("js/three.js")
//     .get(async function(req, res) {
//         console.log(req.originalUrl)
//         res.sendFile(path.resolve(WEBSITE_ROOT, `public/game/js`));
// })


module.exports = router;
