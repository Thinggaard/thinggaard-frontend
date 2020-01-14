import React, {useEffect, useRef} from 'react'
import {Modal} from "@material-ui/core";
import "./LoadingLogo.css";
import LoadingLogo from "./LoadingLogo";

const LoadingModal = props => {

    const {
        timeout = 15000,
        timeoutCallback = () => {
            console.log("timedOut")
        },
        children,
        close = () => {
        },
        disableBackdropClick = true,
    } = props;

    const thisTimeout = useRef();

    useEffect(
        () => {
            thisTimeout.current = window.setTimeout(timeoutCallback, timeout);
            return () => {
                window.clearTimeout(thisTimeout.current);
            };
        }, [timeout, timeoutCallback]
    );

    return (
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            disableAutoFocus={true}
            disableRestoreFocus={true}
            open={true}
            onClose={close}
            disableBackdropClick={disableBackdropClick}
            className={"loading-logo-modal h-100 d-flex align-items-center justify-content-center"}
        >
            <LoadingLogo>{children}</LoadingLogo>
        </Modal>
    )
};

export default LoadingModal;
