import React, {useContext, useEffect, useState} from "react";
import Overlay from "../../components/Overlay/Overlay";
import initialBookingFields from "../../components/Booking/initialBookingFields";
import AdminBookingForm from "../../components/Booking/AdminBookingForm";
import {getBooking} from "../../functions/bookingFunctions";
import {unwrapArraysInObject} from "../../functions/parserFunctions";
import {StatusContext} from "../../store/Store";
import axios from "axios";
import {API, TOKEN} from "../../constants";
import {getUserToken} from "../../functions/userFunctions";

const TimezoneOffset = new Date().getTimezoneOffset(); // -120 minutes in DK summertime
const userToken = getUserToken();

const EditBooking = ({bookingId, setBookingId}) => {

    const [bookingFields, setBookingFields] = useState(initialBookingFields);
    const [feesObject, setFeesObject] = useState({});
    const [economicSecret, setEconomicSecret] = useState({});
    const [fetchedBookingId, setFetchedBookingId] = useState(0);

    const [, dispatchStatus] = useContext(StatusContext);

    const onMount  = () => {
        // Get Economic secrets :
        axios.get(API + "economic-secret/?" + TOKEN, {
            headers: {
                Authorization: "Bearer " + userToken,
            }
        }).then(res => {
            setEconomicSecret(res.data.results);
        });
    };
    useEffect(onMount, []);



    const updateField = (name, value) => {
        setBookingFields(p => {
            p[name] = value;
            return p;
        });
    };

    const onBookingRelation = () => {
        if (bookingId === 0) return;
        dispatchStatus({type: "addConnection"});

        setBookingFields({});

        getBooking(bookingId).then(res => {

            let meta = res.booking.meta;
            meta = unwrapArraysInObject(meta);
            meta.booking_datestamp = !isNaN(meta.booking_datestamp) ? parseInt(meta.booking_datestamp) + TimezoneOffset*60 : ""; // adapt to timezone;

            setBookingFields(meta);
            setFeesObject(res.fees);
            setFetchedBookingId(bookingId);

        }).finally(() => dispatchStatus({type: "removeConnection"}));
    };
    useEffect(onBookingRelation, [bookingId]);

    return (
        <Overlay title={"Rediger Booking"} open={bookingId !== 0} maxWidth={"100vw"} toggleOverlay={() => {setBookingId(0)}}>
            <AdminBookingForm
                bookingId={fetchedBookingId}
                reload={onBookingRelation}
                fees={feesObject}
                economicSecret={economicSecret}
                bookingFields={bookingFields}
                updateField={updateField}
                edit={bookingId}
                closeOverlay={() => {setBookingId(0)}}
            />
        </Overlay>
    );
};

export default EditBooking;