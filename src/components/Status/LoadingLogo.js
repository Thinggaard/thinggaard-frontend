import React from 'react'
import "./LoadingLogo.css";

const LoadingLogo = props => {

    const {children, size = 90} = props;

    return (
        <>
            <div className={"loading-logo"} style={{width: size, height: size}}>
                <div className={"square"}
                     style={{backgroundColor: "rgb(14, 70, 28)", animationDelay: "100ms", top: 0, left: 0}}/>
                <div className={"square"}
                     style={{backgroundColor: "rgb(22, 141, 65)", animationDelay: "200ms", top: 0, left: "66.7%"}}/>
                <div className={"square"} style={{backgroundColor: "rgb(38, 180, 74)", top: "33.3%", left: "33.3%"}}/>
                <div className={"square"}
                     style={{backgroundColor: "rgb(175, 217, 167)", animationDelay: "300ms", top: "66.7%", left: 0}}/>
                <div className={"square"}
                     style={{backgroundColor: "rgb(123, 197, 110)", animationDelay: "400ms", top: "66.7%", left: "66.7%"}}/>
                <div className={"square"}
                     style={{backgroundColor: "rgb(175, 217, 167)", animationDelay: "500ms", top: "100%", left: "-33.3%"}}/>
            </div>
            {children}
        </>
    )
};

export default LoadingLogo;
