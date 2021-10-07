import "./../css/BotStats.css"
import { Image } from "react-bootstrap";
import "./../css/BotStats.css"
import { Component } from "react";
require("dotenv").config();

export default class BotStats extends Component {
    constructor(props) {
        super(props);
            
        this.state = {
            error: null,
            isLoaded: false,
            commitHash: "",
            commits: 0,
            uptime: "",
            commandsHandled: 0
        };
    }

    componentDidMount() {
        const url = process.env.REACT_APP_SERVER + "/v1/stats"
        fetch(url)
        .then((res => res.json()))
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    commitHash: result.commitHash,
                    commits: result.commits,
                    uptime: result.uptime,
                    commandsHandled: result.commandsHandled
                });
                console.log(result)
            },

            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
    };

    render() {
        const { error, isLoaded, commitHash, commits, uptime, commandsHandled } = this.state;

        if (error) {
            return (
                <div className="BotStats">
                    <p>
                        Error: {error.message}
                    </p>
                </div>
            )
        } else if (!isLoaded) {
            return ( 
            <div className="BotStats">
                <p>
                    Loading...
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
        } else {
            return(
            <div className="BotStats">
                <p>
                    <span>
                        <ul>
                            <li>
                                wow! Cool bot stats
                                <img
                                    src="https://cdn.betterttv.net/emote/5c04c335693c6324ee6a23b2/1x"
                                    alt="Person looking at you, mouth wide open. celebration. Happy"
                                ></img>
                            </li>
                            <li>Bot has been awake for: {uptime}</li>
                            <li>Total commits: {commits}</li>
                            <li>Commit hash: {commitHash}</li>
                            <li> <a href="https://github.com/JoachimFlottorp/Melonbot">
                                    Github 
                                </a>
                            </li>
                            <li>Total commands handled by the bot: {commandsHandled}</li>
                        </ul>
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
    }
    
}
