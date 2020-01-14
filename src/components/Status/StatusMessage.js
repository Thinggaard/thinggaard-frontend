import React from "react";


export default ({title, children, textWidth = 250, buttonClickHandler = () => {}, buttonText}) => (
    <div className="d-flex justify-content-center align-items-center" style={{
        minHeight: '300px'
    }}>
        <div className="text-center">
            {title}
            <p style={{maxWidth: textWidth}}>
                {children}
            </p>
            <button onClick={buttonClickHandler} className="btn btn-outline-secondary mt-3">
                {buttonText}
            </button>
        </div>
    </div>
)