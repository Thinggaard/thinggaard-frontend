// File created : 24-05-2019 14:35
import React, {useContext} from 'react';
import SimplePopover from "../Utility/SimplePopover";
import {productTypeColors, productTypeNames, productTypes} from "../../data/ProductTypes";
import {SiteInfoContext} from "../../store/Store";
import {FaInfoCircle} from "react-icons/fa";

const ProductTypePopOver = ({className = "", type}) => {

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

    if (!type || !productTypes.indexOf(type) < 0) return null;

    return (
        <SimplePopover
            trigger={
                <span className={"sidebar-product-appetizer green-marker pointer text-light " + className}
                      style={{
                          backgroundColor: productTypeColors[type],
                          lineHeight: 1,
                          fontSize: 13,
                          padding: '4px 8px',
                          margin: '6px 6px 0 0',
                          border: '1px solid rgba(255,255,255,0.2)'
                      }}>
                    <FaInfoCircle/> {productTypeNames[type][0]}
                </span>
            }
        >
            <div className="appetizer-content"
                 style={{
                     padding: '20px',
                     textTransform: "none",
                     fontWeight: "400",
                     lineHeight: '1.35',
                     maxWidth: "350px",
                     backgroundColor: productTypeColors[type]
                 }}>
                {getDescription()}
            </div>
        </SimplePopover>
    );

};

export default ProductTypePopOver;
