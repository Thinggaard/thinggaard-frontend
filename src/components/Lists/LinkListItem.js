// ONLY ONE LINK ALLOWED

import React from 'react';
import {Link} from "react-router-dom";
import './ListItem.css';

export default function ({title, image, children, link = "#", onClick = () => {}}) {

    return (
        <Link to={link} onClick={onClick} className="d-flex flex-grow-0 flex-column flex-sm-row mb-3 no-textdec list-item">
            {image &&
            <div className={"mr-sm-2 list-item-image-container"}>
                    <div className={"list-item-image-bg"} style={{backgroundImage: `url(${image})`}}/>
                    <div className="list-item-image" style={{backgroundImage: `url(${image})`}}/>
            </div>
            }
            <div className="p-2 list-item-text w-100">
                <h4 className={"list-item-headline"}>{title}</h4>
                {children}
            </div>
        </Link>
    );

}


