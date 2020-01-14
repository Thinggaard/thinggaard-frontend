// File created : 31-05-2019 09:41
import React from 'react';

const OfferBanner = props => {

    return (
        <div className="mt-5 text-center p-2" style={{borderRadius: 3, backgroundColor: "rgb(30, 70, 29)"}}>
            <div className="mx-auto" style={{maxWidth: 850}}>
                <h6 className="text-uppercase" style={{letterSpacing: 2}}>{props.heading}</h6>
                <div className="pre-line">{props.children}</div>
            </div>
        </div>
    );

};

export default OfferBanner;
