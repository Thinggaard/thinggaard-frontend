import React, {useEffect, useRef, useState} from 'react';
import {FaCaretDown, FaCaretUp} from "react-icons/fa";
import "./Header.css";

export default ({
    titleComponent,
    children,
    open=false,
    containerClass="",
    doClose = ()=> {},
    top = 0,
    doOpen = () => {},
    isHamburger
}) => {

    const [containerHeight, setContainerHeight] = useState(0);

    useEffect(() => {setContainerHeight(!!menuContainer && !!menuContainer.current ? menuContainer.current.clientHeight : 0)}, [open]);

    const menuContainer = useRef(null);

    return(
        <li className="nav-item d-inline-block"  style={{position: "relative"}} onMouseEnter={doOpen} onMouseLeave={doClose}>
            {titleComponent}
            <span className={"p-3 desktop-hidden"} onClick={open ? doClose : doOpen}>
                {
                    open ?
                        <FaCaretUp/>
                    :
                        <FaCaretDown/>
                }

            </span>
            {
                    <ul
                        className={`subMenu ${containerClass}`}
                        style={{
                            position: isHamburger ? "static" : "absolute",
                            top: top,
                            left: 0,
                            backgroundColor: "#333",
                            padding: 0,
                            height: containerHeight
                        }}
                    >
                        <div ref={menuContainer} >
                            {
                                open &&
                                children
                            }
                        </div>
                    </ul>
            }
        </li>

    );

};