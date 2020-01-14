import React, {useContext, useEffect, useRef, useState} from 'react';
import BookingForm from "./BookingForm";
import QuestionForm from "./QuestionForm";
import './bookingForm.css';
import initialBookingFields from "./initialBookingFields";
import queryString from "query-string";
import {getBooking} from "../../functions/bookingFunctions";
import {StatusContext, UserContext} from "../../store/Store";
import {unwrapArraysInObject} from "../../functions/parserFunctions";
import AdminBookingForm from "./AdminBookingForm";
import ReactPixel from "react-facebook-pixel";
import ReactGa from "react-ga";

const ga = ReactGa.ga;

const TimezoneOffset = new Date().getTimezoneOffset(); // -120 minutes in DK summertime

export default (props) => {

    const {product, speaker, pagetype, setAction} = props;

    const initialFormtype =  !!speaker.post.meta.speaker_visibility_onrequest ? "question"
        :  !speaker.post.meta.speaker_visibility_quickbooking_disable ? "quickbooking" : "booking";

    const [bookingFields, setBookingFields] = useState(initialBookingFields);
    const [formType, setFormType] = useState(initialFormtype);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [transportPrice, setTransportPrice] = useState(0);
    const [bookingId, setBookingId] = useState(0);
    const [bookingStageNumber, setBookingStageNumber] = useState(1);
    const [scrollToForm, setScrollToForm] = useState(false);
    const [, setError] = useState("");
    const [, setSuccess] = useState("");

    // used to log GA and Pixel events | -1 = prevent log | 0 = not logged yet | 1 = do log |
    const [showInterest, setShowInterest] = useState(0);

    const [status, dispatchStatus] = useContext(StatusContext);

    const [user,] = useContext(UserContext);
    const isAdmin = !!user.roles && user.roles.includes("administrator");

    const formRef = useRef(null);

    const logBookingEvent = (eventType, postData = bookingFields, providedType = null) => {

        const speakerId = postData.booking_relation_speaker || speaker.post.ID;
        const speakerName = postData.booking_speaker_name || speaker.post.post_title;
        const productId = postData.booking_relation_product || product.ID;
        const productName = postData.booking_product || product.post_title;
        let revenue = eventType === "complete" ? ( postData.booking_payment_pretax || product.meta.product_price_with_fee) : "0";
        const type = providedType || postData.booking_type || formType;

        //GOOGLE ANALYTICS
        if (eventType === "complete") {
            ga('ecommerce:addTransaction', {
                type,
                id: postData.booking_relation_booking,
                revenue,
                speaker: speakerName,
                speaker_id: speakerId,
                product: productName,
                product_id: productId,
            });
            ga('ecommerce:send');
        }
        const eventTypeText = eventType === "complete" ? "Completed " : eventType === "init" ? "Initial submit " : "Interest ";
        ga('gtm1.send', 'event', 'Book', eventTypeText + type, speakerName + " - " + productName, revenue);

        //FACEBOOK PIXEL
        const pixelEventType = eventType === "complete" ? "purchase" : eventType === "init" ? "SubmitApplication" : "CustomizeProduct";
        if (eventType === "complete") ReactPixel.track( pixelEventType, {value: revenue, currency: "DKK"});
        else ReactPixel.track(pixelEventType);
    };

    const onInterest = () => {
        if (!isAdmin && showInterest === 1) {
            logBookingEvent("interest", bookingFields, pagetype === "speaker" ? "question" : null);
            setShowInterest(-1);
        }
    };
    useEffect(onInterest, [showInterest]);

    const onSpeakerChange = () => {
        setShowInterest(0);
    };
    useEffect(onSpeakerChange, [speaker]);


    const updateField = (name, value) => {
        if (showInterest === 0 && bookingStageNumber === 1 && name !== "booking_duration" && name !== "booking_datestamp"
            && name !== "booking_relation_speaker" && name !== "booking_relation_product"
        ) setShowInterest(1);
        setBookingFields(p => {
            p[name] = value;
            return p;
        });
    };

    const doScrollToForm = () => {
        if(status.activeConnections !== 0 || !scrollToForm) return;
        document.getElementById('form').scrollIntoView({ block: 'start',  behavior: 'smooth' });
    };
    useEffect(doScrollToForm, [scrollToForm, status]);

    const checkScrollToForm = () => {
        if (pagetype === "speaker") return;
        const parsed = queryString.parse(window.location.search);
        if (bookingId !== 0 || bookingStageNumber !== 1) setScrollToForm(true);
        else if (parsed.action === "quickbooking" || parsed.action ==="booking" || parsed.action === "question") {
            setFormType(parsed.action);
            setScrollToForm(true);
        }
        else setScrollToForm(false);
    };
    useEffect(checkScrollToForm, [bookingId, bookingStageNumber, pagetype, product]);

    const switchType = e => {
        setFormType(e.target.name);
    };

    const onBookingRelation = (id, token) => {
        dispatchStatus({type: "addConnection"});
        setShowInterest(-1);
        getBooking(id, token).then(res => {

            let meta = res.booking.meta;
            meta = unwrapArraysInObject(meta);
            meta.booking_datestamp = !isNaN(meta.booking_datestamp) ? parseInt(meta.booking_datestamp) + TimezoneOffset*60 : ""; // adapt to timezone;

            setBookingFields({
                ...bookingFields,
                ...meta,
                booking_relation_booking: id,
                selectedProduct: !isNaN(meta.booking_relation_product) && parseInt(meta.booking_relation_product),
            });
            setBookingId(id);
            setFormType(meta.booking_type);

        }).finally(() => dispatchStatus({type: "removeConnection"}));
    };

    const onPaymentSuccess = () => {
        setSuccess("stripe_payment");
    };

    const onPaymentFailed = () => {
        setError("stripe_payment");
    };

    const onMount = () => {
        const parsed = queryString.parse(window.location.search);
        if (parsed.cosuccess === "0") onPaymentFailed();
        if (parsed.cosuccess === "1") onPaymentSuccess();
        if (!!parsed.bookingid && !!parsed.token) onBookingRelation(parsed.bookingid, parsed.token);

        // set default duration to right between min and max:
        const maxDuration =
            product && !!product.meta.product_duration_max && !isNaN(product.meta.product_duration_max) ?
                parseInt(product.meta.product_duration_max) : 60;
        const minDuration =
            product && !!product.meta.product_duration_min && !isNaN(product.meta.product_duration_min) ?
                parseInt(product.meta.product_duration_min) : 15;
        const midDuration = parseInt( ((maxDuration+minDuration)/2)/5 ) * 5;
        updateField("booking_duration", midDuration);
        document.addEventListener("DOMContentLoaded", doScrollToForm);
    };
    useEffect(onMount, []);

    if (isAdmin) return (
        <AdminBookingForm
            {...props}
            updateField={updateField}
            bookingFields={bookingFields}
            bookingId={bookingId}
            stageNumber={bookingStageNumber} setStageNumber={setBookingStageNumber}
            timeZoneOffset={TimezoneOffset}
        />
    );

    return (
        <div className={"h-100"} ref={formRef} style={{position: "relative"}}>
            <div className={"form-scroll"} id={"form"} style={{position: "absolute", top: -80}}/>
            {
                pagetype==="speaker" ?
                    <div className="btn-group-lg btn-group-vertical w-100 mb-4">
                        {!speaker.post.meta.speaker_visibility_onrequest
                        && !speaker.post.meta.speaker_visibility_quickbooking_disable &&
                        <button
                            onClick={() => {
                                setAction("quickbooking");
                                if(showInterest === 0) {
                                    logBookingEvent("interest", bookingFields);
                                    setShowInterest(-1);
                                }
                            }}
                            style={{width: '100%'}}
                            className="btn btn-outline-primary btn-cta text-uppercase mb-3">
                                <span style={{
                                    fontSize: '14px',
                                    letterSpacing: '1.6px'
                                }}>Book {speaker.post.post_title}</span>
                        </button>
                        }

                        {!speaker.post.meta.speaker_visibility_onrequest &&
                        <button
                            onClick={() => {
                                if(showInterest === 0) {
                                    logBookingEvent("interest", bookingFields, "booking");
                                    setShowInterest(-1);
                                }
                                setAction("booking");
                            }}
                            style={{width: '100%'}}
                            className="btn btn-outline-primary btn-cta text-uppercase mb-3">
                                <span
                                    style={{
                                        fontSize: '14px',
                                        letterSpacing: '1.6px'
                                    }}
                                >Forespørg på {speaker.post.post_title}</span>
                        </button>
                        }

                    </div>

                    :

                bookingStageNumber === 1 && !bookingId && !bookingFields.booking_relation_booking?
                    !speaker.post.meta.speaker_visibility_onrequest &&
                    <div className="btn-group wrap-button-group mb-4 w-100" role="group" aria-label={"kontakt og booking"}>
                        {!speaker.post.meta.speaker_visibility_quickbooking_disable &&
                        <button onClick={switchType} name="quickbooking"
                                className={`btn ${formType === "quickbooking" ? "btn-light" : "btn-outline-secondary"} rounded-0`}>
                            BOOKING
                        </button>
                        }

                        <button onClick={switchType} name="booking"
                                className={`btn ${formType === "booking" ? "btn-light" : "btn-outline-secondary"} rounded-0`}>
                            FORESPØRGSEL
                        </button>

                        <button onClick={switchType} name="question"
                                className={`btn ${formType === "question" ? "btn-light" : "btn-outline-secondary"} rounded-0`}>
                            BESKED
                        </button>
                    </div>
                    :
                    <h6 style={{letterSpacing: 2}} className="text-uppercase bg-success text-center p-1">
                        {bookingStageNumber === 3 ? "Godkend og betal" : "Færdiggør din booking"}
                    </h6>
            }


            {
                (pagetype === "speaker" || formType === "question") ?
                    <QuestionForm className="sticky-pos" {...props} updateField={updateField} bookingFields={bookingFields} logBookingEvent={logBookingEvent}/>
                :
                    <BookingForm
                        {...props}
                        logBookingEvent={logBookingEvent}
                        doScrollToForm={doScrollToForm}
                        updateField={updateField}
                        bookingFields={bookingFields}
                        type={formType} setType={setFormType}
                        selectedProduct={selectedProduct}
                        setSelectedProduct={setSelectedProduct}
                        bookingId={bookingId} setBookingId={setBookingId}
                        stageNumber={bookingStageNumber} setStageNumber={setBookingStageNumber}
                        transportPrice={transportPrice} setTransportPrice={setTransportPrice}
                        timeZoneOffset={TimezoneOffset}
                    />
            }
        </div>
    )
}