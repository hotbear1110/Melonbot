import { Component } from "react";
import { Nav, NavDropdown, Image, Navbar } from "react-bootstrap";
import './../css/MiddleButtons.css'

export default class MiddleButtons extends Component {
    render() {
        return(
            <div className="RedirectButtons">
                <div className="Dropdown-Bot">
                    <span>Bot</span>
                    <Nav>
                        <NavDropdown eventKey={1}
                            title={
                                <div className="pull-left">
                                    <Image className="thumbnail-image"
                                        style={{height: '64px', width: '64px'}}
                                        src="https://cdn.7tv.app/emote/60ae4f960e35477634a0bbbe/4x"
                                        alt="Green cartoonical frog smiling at you."
                                        roundedCircle
                                        ></Image>
                                </div>
                            }                       
                            id="basic-nav-dropdown">
                            <NavDropdown.Item eventKey={1.1} href="/bot/login">Login Twitch</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </div>
            </div>
        )
    }
}