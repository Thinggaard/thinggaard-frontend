// File created : 15-05-2019 16:26
import React, {useContext, useState} from 'react';
import {productTypeColors, productTypeNames, productTypes} from "../../data/ProductTypes";
import {SiteInfoContext} from "../../store/Store";
import {FaInfoCircle, FaTimes} from "react-icons/fa";

const ProductTypeBadge = ({type}) => {

    const [show, setShow] = useState(false);

    const toggleInfo = (e) => {
        e.preventDefault();
        setShow(!show);
    };

    const [siteInfo] = useContext(SiteInfoContext);

    const getDescription = () => {
        if (!siteInfo.options) return  "";
        switch (type) {
            case "appetizer" :
                return siteInfo.options.yx_appetizer_text;
            case "workshop" :
                return siteInfo.options.yx_workshop_text;
            default :
                return siteInfo.options.yx_speak_text;
        }
    };

    if (!type || productTypes.indexOf(type) < 0) return null;

    return (
        <>
            <div onClick={toggleInfo}
                 className="appetizer"
                 style={{
                     position: "absolute",
                     bottom: "0",
                     right: "0",
                     padding: "20px 40px",
                     backgroundColor: productTypeColors[type],
                     opacity: .9,
                     transform: show ? "rotate(0)" : "rotate(-45deg)",
                     transformOrigin: "148% -5% 0",
                     fontWeight: "600",
                     fontSize: "13px",
                     textTransform: "uppercase",
                     borderRadius: show ? "0" : "5px 0 0 0",
                     cursor: "pointer",
                     zIndex: 2,
                     width: "100%",
                     height: "100%",
                     transition: "all 300ms ease-in-out",
                     maxWidth: "396px",
                     maxHeight: "335px"
                 }}
            >
                <div className="appetizer-headline" style={{
                    textTransform: "uppercase",
                    textAlign: "center",
                    transition: "margin 300ms ease-in-out",
                    marginBottom: "10px"
                }}>
                    <FaInfoCircle/> {productTypeNames[type][0]}</div>
                <div className="appetizer-content" style={{
                    opacity: show ? "1.0" : "0.0",
                    textTransform: "none",
                    textAlign: "justify",
                    lineHeight: "1.25",
                    transition: "opacity 300ms ease-in",
                    fontWeight: "500"
                }}
                >
                    {getDescription()}
                </div>

                <div className="h2 pointer" style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 3,
                }}>
                    <FaTimes/>
                </div>

            </div>
        </>
    );

};

export default ProductTypeBadge;
