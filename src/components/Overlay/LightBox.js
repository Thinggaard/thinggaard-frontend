// File created : 15-05-2019 12:39
import React from 'react';
import Modal from "@material-ui/core/Modal";
import {FaAngleLeft, FaAngleRight, FaTimes} from "react-icons/fa";

const LightBox = props => {

    const {open, onClose, images, current = 0, changeImage} = props;

    const arrowStyle = {
        color: "#000000",
        position: "absolute",
        top: "42%",
        fontSize: "2rem",
        cursor: "pointer",
        background: "rgba(200, 200, 200, 0.7)"
    };


    return (
        <Modal className="text-center" open={open} onClose={onClose} style={{paddingTop: "10vh"}}>
            <>

                <div className="h2 pointer" onClick={onClose} style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px"
                }}>
                    <FaTimes/>
                </div>

                <i className="p-2" style={{...arrowStyle, left: 0, opacity: current === 0 ? 0.3 : 1}} onClick={() => {
                    changeImage(-1)
                }}>
                    <FaAngleLeft/>
                </i>

                <img className="unselectable" alt={images[current].alt} style={{
                    maxHeight: "80vh",
                    maxWidth: "90vw",
                    width: "auto"
                }} src={images[current].image}/>
                <a className="mx-auto btn btn-secondary"
                   href={images[current].image}
                   target={"_blank"}
                   style={{
                       borderRadius: "0 0 10px 10px",
                       display: "block",
                       width: "150px",
                       height: "40px",
                   }}>
                    Download
                </a>

                <i className="p-2" style={{...arrowStyle, right: 0, opacity: current === images.length - 1 ? 0.3 : 1}}
                   onClick={() => {
                       changeImage(1)
                   }}>
                    <FaAngleRight/>
                </i>

            </>


        </Modal>
    );

};

export default LightBox;
