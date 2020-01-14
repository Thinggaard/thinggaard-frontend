// File created : 29-03-2019 13:35
import React, {Component} from 'react';
import Modal from '@material-ui/core/Modal'
import './Overlay.css';
import {FaTimesCircle} from "react-icons/fa";

class Overlay extends Component {


    render() {

        let {title = "Meddelelse", toggleOverlay, maxWidth = "550px"} = this.props;

        return (
            <Modal
                open={this.props.open}
                onClose={toggleOverlay}
                className={"h-100 d-flex align-items-center my-overlay"}
            >

                <div className="animated zoomIn faster bg-dark-grey" style={{
                    margin: 'auto',
                    width: '100%',
                    maxWidth: maxWidth,
                    maxHeight: '95vh',
                    minHeight: '100px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}>
                    <h6 className="text-center py-4 px-3 m-0 font-weight-bold text-uppercase bg-light-grey" style={{
                        borderBottom: '2px solid #1d1d1d',
                        position: 'relative',
                    }}>
                        <span style={{
                            cursor: 'pointer',
                            color: '#ccc',
                            fontSize: '22px',
                            right: '3px',
                            top: '3px',
                            position: 'absolute'
                        }}
                              onClick={toggleOverlay}

                        ><FaTimesCircle/></span>
                        {title}
                    </h6>
                    <div className="overlayContent m-0 p-2">
                        {this.props.children}
                    </div>
                </div>

            </Modal>
        );
    }
}

export default Overlay;
