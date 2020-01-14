// File created : 05-05-2019 12:18
import React, {Component} from 'react';
import './CTABox.css';
import {parseShortCodes} from "../../functions/parserFunctions";

class CTABox extends Component {

    render() {
        const {title, content, styles={}, cardStyles = {}, className = ""} = this.props;

        return (
            <div style={styles} className={"cta-box col-12 col-sm-6 col-lg-4 " + className}>
                <div className={"card"} style={cardStyles}>
                <h3>{title}</h3>
                <div className="cta-box-content">{parseShortCodes(content)}</div>
                </div>
            </div>
        )
    }
}


export default CTABox;
