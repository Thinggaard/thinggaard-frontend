import VisibilitySensor from "react-visibility-sensor";
import React, {useState} from "react";

export default ({style = {}, className="", image, children}) => {

    const [showImage, setShowImage] = useState(false);

    return (
        <VisibilitySensor
            partialVisibility={true}
            onChange={visible => {
                if (!showImage && visible) setShowImage(visible);
            }}
        >
            <div className={className}
                 style={{
                     opacity : showImage ? 1 : 0,
                     transition : "opacity .2s ease-in-out",
                     backgroundImage: showImage ? `url(${image})` : 'none',
                     backgroundSize: 'cover',
                     ...style
                 }}
            >
                {children}
            </div>
        </VisibilitySensor>
    )

}
