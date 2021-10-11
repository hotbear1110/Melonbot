import { Component } from "react"

export default class Header extends Component {
    constructor(props) {
        super(props);

        this.hoverHome = this.hoverHome.bind(this);
        this.removeHome = this.removeHome.bind(this);
        this.optionClick = this.optionClick.bind(this);
    }
    
    hoverHome = (event) => {
        event.target.style.color = "white";
    }

    removeHome = (event) => {
        event.target.style.color = "#FF5349";
    }

    optionClick = (event) => {
        document.location = event.target.value
    }
    
    render() {
    return(
        <>
        <header style={{
            top: "20px",
            bottom: "20px",
            right: "20px",
            left: "20px",
            display: "flex", 
            verticalAlign: "top", 
            columnGap: "20px", 
            borderStyle: "solid",
            borderColor: "#FF5349",
            boxSizing: "border-box",
            padding: "20px",
            }}>
            <a href="/" style={{
                textDecoration: "none",
                padding: "0 5px",
                color: "#FF5349",
                transition: "all .9s",
            }}
            onMouseEnter={this.hoverHome}
            onMouseLeave={this.removeHome}
            >Home</a>
            <select name="Bot" id="Bot-Dropdowm" style={{
                display: "inline-block",
                backgroundColor: "transparent",
                border: "none",
                color: "#FF5349",
                transition: "all .9s",
            }}
            onMouseEnter={this.hoverHome}
            onMouseLeave={this.removeHome}
            onChange={this.optionClick}
            >
                <option style={{color: "black", display: "none"}}>Bot</option>
                <option style={{color: "black"}} value="/bot">Bot Stats</option>
                <option style={{color: "black"}} value="/bot/login">Login Twitch</option>
                <option style={{color: "black"}} value="/bot/commands">View Commands</option>
            </select>
        </header>
        </>
        )
    }
}