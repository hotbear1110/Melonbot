// import { useState } from "react";
import { Nav, NavDropdown, Image } from "react-bootstrap";
import './../css/MiddleButtons.css'

export default function MiddleButtons() {
    // const [show, setShow] = useState(false);
    
    // const ShowDropdown = (event) => {
    //     setShow(!show)
    // }

    // const HideDropdown = (event) => {
    //     setTimeout(() => {
    //         setShow(false)
    //     }, 2000);
    // }

    return(
        <div className="RedirectButtons">
            <div className="Dropdown-Bot">
                <p className="Title-bot">Bot</p>
                <Nav id="Nav-bot">
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
                        id="basic-nav-dropdown"
                        // show={show}
                        // onMouseEnter={ShowDropdown}
                        // onMouseLeave={HideDropdown}>
                        >
                        <NavDropdown.Item eventKey={1.1} href="/bot" id="item">Bot Stats</NavDropdown.Item>
                        <NavDropdown.Item eventKey={1.2} href="/bot/login" id="item">Login Twitch</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </div>
        </div>
    )
}