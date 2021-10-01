const axios = require("axios")
const got = require("got")
require("dotenv").config()


exports.users = (code) => {
    return new Promise((Resolve, Reject) => {
        try {
            const header = {
            }
            console.log(header)
        
            axios.get("https://api.twitch.tv/helix/users", {
                headers: {
                    "Authorization": `Bearer ${code}`,
                    "Client-Id": process.env.TWITCH_CLIENT_ID,
            
            }}).then((data) => {
                Resolve(data)
            }).catch((err) => {
                console.log(err)
                Reject(err)
            })
        } catch (err) {
            console.log(err)
            Reject(err)
        }
    })
}

exports.authorize = (code) => {
    return new Promise((Resolve, Reject) => {
        try {
            const url = `https://id.twitch.tv/oauth2/token` +
            `?client_id=${process.env.TWITCH_CLIENT_ID}` +
            `&client_secret=${process.env.TWITCH_CLIENT_SECRET}` +
            `&code=${code}` +
            `&grant_type=authorization_code` + 
            `&redirect_uri=${process.env.REDIRECT_URI}`
            axios.post(url).then((data) => {
                Resolve(data)
            }).catch((err) => {
                console.log(err)
                Reject(err)
            })
        } catch (err) {
            console.log(err)
            Reject(err)
        }
    })
}

exports.validate = (code) => {
    return new Promise((Resolve, Reject) => {
        try {
            axios.get('https://id.twitch.tv/oauth2/validate', {
                headers: {
                    Authorization: `Bearer ${code}`
                }
            }).then((data) => {
                Resolve({
                    expiration: data.data.expires_in,
                })
            }).catch((err) => {
                console.log(err)
                Reject(err)
            })
        } catch (err) {
            console.log(err)
            Reject(err)
        }
    })
}

exports.refresh = (refresh_token) => {
    return new Promise((Resolve, Reject) => {
        try {
            // https://discuss.dev.twitch.tv/t/status-400-missing-client-id-when-refreshing-user-token-with-granttype-refresh-token-on-postman-it-works/26371/2
            
            const _ = {
                grant_type: "refresh_token",
                refresh_token: refresh_token,
                client_id: process.env.TWITCH_CLIENT_ID,
                client_secret: process.env.TWITCH_CLIENT_SECRET
            }
            let query = []

            for (var property in _) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(_[property]);

                query.push(encodedKey + "=" + encodedValue)
            }

            query = query.join("&")

            axios({ 
                method: 'POST',
                url: "https://id.twitch.tv/oauth2/token",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    Accept: "*/*",
                    "Accept-Encoding": "gzip, deflate, br",
                    Connection: "keep-alive"
                  },
                  data: query
            }).then((data) => {
                // console.log(data)
                Resolve(data.data)
            }).catch((err) => {
                // console.log(err)
                Reject(err)
            })
        } catch (error) {
            console.log(error)
            Reject(error)
        }
    })
}