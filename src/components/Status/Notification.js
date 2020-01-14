import React from 'react';
import Snackbar from "@material-ui/core/Snackbar";
import {SnackbarContent} from "@material-ui/core";
import {FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaTimes} from "react-icons/fa";

const Notification = props => {

    const {
        type, children, viewTime = 6000, mouseEvent = "onClick", onClose = () => {}, open = false,
    } = props;

    const typeProps = () => {
        switch (type) {
            case "warning":
                return {className: "bg-warning", icon: <FaExclamationTriangle/>};
            case "error":
                return {className: "bg-danger", icon: <FaExclamationCircle/>};
            case "success":
                return {className: "bg-success", icon: <FaCheckCircle/>};
            default:
                return {className: "bg-dark", icon: <FaInfoCircle/>};
        }
    };

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={open}
            autoHideDuration={viewTime}
            onClose={onClose}
            ClickAwayListenerProps={{
                mouseEvent: mouseEvent
            }}
        >
            <SnackbarContent
                className={typeProps().className}
                message={
                    <div className="d-flex justify-content-center align-items-center">
                        <h4 className="mb-0 pr-3">{typeProps().icon}</h4>
                        {children}
                    </div>
                }
                action={<h4 className="mb-0 pointer" onClick={onClose}><FaTimes/></h4>}
            />
        </Snackbar>
    )
};

export default Notification;
