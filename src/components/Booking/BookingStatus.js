import React from "react";
import {
    messageErrorUnexpected,
    messageSuccessBooking,
    messageSuccessBookingComplete,
    messageSuccessBookingRequest
} from "../../data/statusMessages";
import StatusMessage from "../Status/StatusMessage";

const BookingStatus = ({formStatusArr, setFormStatus, setStageNumber, setBookingId}) => {

    const statusType = formStatusArr[0];
    const statusMessageName = formStatusArr[1];

    let msg = "";
    switch (statusMessageName) {
        case "request" :
            msg = messageSuccessBookingRequest; break;
        case "booked" :
            msg = messageSuccessBookingComplete; break;
        default : //success_booking
            msg = messageSuccessBooking;
    }

    if (statusType === "success") return (
        <StatusMessage
            title={<h1 className="text-success">TAK!</h1>}
            buttonText={"Ny indesendelse"}
            buttonClickHandler={() => {
                setBookingId(0);
                setStageNumber(1);
                setFormStatus("")
            }}
        >
            {msg}
        </StatusMessage>
    );
    else if (statusType === "error") return (
        <StatusMessage
            title={<h1 className="text-danger">UPS...</h1>}
            buttonText={"Prøv igen"}
            buttonClickHandler={() => {
                setFormStatus("")
            }}
        >
            {messageErrorUnexpected}
        </StatusMessage>
    );

    return null;
};

export default BookingStatus;