const express = require("express");
const router = express.Router();
const creds = require("./../../../credentials/config")
const got = require("got")
const tools = require("../../../tools/tools")


// After user logs in to bot they get redirected here.
router
    .route("/code")
    .get(async function(req, res) {
        var logger = ""
        const code = req.query.code
        // Ask twitch to authenticate our code and get the actual token we can use, with refresh token
        try {
            
            if(typeof req.query.error !== "undefined") {
                logger += ` ${req.path} - ${req.query.error}`
                tools.logger(logger, "error")
                res.status(500).json({error: "Error with server. Contact admin."})
                res.end();
                return
            }

            const url = `https://id.twitch.tv/oauth2/token` +
            `?client_id=${creds.TWITCH_CLIENT_ID}` +
            `&client_secret=${creds.TWITCH_CLIENT_SECRET}` +
            `&code=${code}` +
            `&grant_type=authorization_code` + 
            `&redirect_uri=${creds.REDIRECT_URI}`

            const authorize = await got(url, {
                method: "POST",
                headers: {
                    "Accept": "application/json"
                },
            }).json();
            console.log(authorize)
            
            // Get some more info about the user, like user id and login name.
            const user = await got("https://api.twitch.tv/helix/users", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authorize.access_token}`,
                    "Client-Id": creds.TWITCH_CLIENT_ID,
                }
            }).json();
            console.log(user)

            const userInfo = {
                user_id: user.data[0].id,
                access_token: authorize.access_token,
                login_name: user.data[0].login,
                refresh_token: authorize.refresh_token,
                scope: authorize.scope.join(" ")
            }

            const token = await tools.query('SELECT * FROM tokens WHERE user_id = ?', [userInfo.user_id])

            if (token.length !== 0) {
                // Delete old token if the user decides to login again.
                tools.query("DELETE FROM tokens WHERE user_id = ?;", [userInfo.user_id])
            }
            
            await tools.query(`INSERT INTO tokens 
                                (user_id, access_token, 
                                login_name, refresh_token, scope)
                                VALUES (?,?,?,?,?
                                );`, 
                                [userInfo.user_id, userInfo.access_token, 
                                userInfo.login_name, userInfo.refresh_token, 
                                userInfo.scope])

            logger += `User_id: ${userInfo.user_id} - ${userInfo.login_name} added to database`, 
            tools.logger(logger, "info")

            res.redirect(`${creds.SERVER}/bot/login?loggedIn=true`)
            res.end();
            return
        } catch (error) {
            tools.logger(JSON.stringify(error), "error")
            res.status(500).json({"error": error})
            res.end()
            return   
        }
})

module.exports = router;