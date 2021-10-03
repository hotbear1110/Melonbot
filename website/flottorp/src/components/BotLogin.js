import { Component } from "react"
import { Button } from "react-bootstrap"
import './../css/BotLogin.css'

export default class BotLogin extends Component {
    render() {
        return(
            <div className="BotLogin">
                <span>
                    <img 
                        src="https://static-cdn.jtvnw.net/emoticons/v2/304412445/default/dark/1.0"
                        alt="forsenSmug"
                        id="emote"
                    ></img>
                    <img
                        src="https://pajbot.com/static/emoji-v2/img/twitter/64/1f447.png"
                        alt="Hand pointing down"
                        style={{width: '28px', height: '28px'}}
                        id="emote"
                    ></img>
                    <br></br>
                    <Button variant="outline-info" href="/bot/login/redirect">
                        Login to twitch.
                    </Button>
                </span>
            </div>
        )
    }
}