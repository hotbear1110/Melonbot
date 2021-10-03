import "./../css/BotStats.css"
import { Image } from "react-bootstrap";
import "./../css/BotStats.css"

export default function BotStats() {

    return(
        <div className="BotStats">
            <p>
                <span>
                    <img
                        src="https://cdn.betterttv.net/emote/5c04c335693c6324ee6a23b2/1x"
                        alt="Person looking at you, mouth wide open. celebration. Happy"
                    ></img>
                    wow! Cool bot stats
                </span>
            </p>
            <h1>Scuffed page</h1>
            <Image 
                src="https://static-cdn.jtvnw.net/emoticons/v2/684688/default/dark/3.0"
                style={{height: '64px', width: '64px'}}
                alt="Person Laughing"
                id="image"
            ></Image>
        </div>

    )
}
