const express = require("express");
const router = express.Router(); 
const path = require("path")

// /public/css/commands.css
router
    .route("/commands.css")
    .get(async function(req, res) {
        res.sendFile(path.resolve(WEBSITE_ROOT, "public/css/commands.css"))
    });

module.exports = router;