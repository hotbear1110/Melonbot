const express = require("express");
const router = express.Router(); 
const path = require("path")

router
    .route("/*.css")
    .get(async function(req, res) {
        console.log(req.originalUrl)
        res.sendFile(path.resolve(WEBSITE_ROOT + req.originalUrl))
    });

module.exports = router;