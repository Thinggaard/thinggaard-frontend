import {postBooking} from "../../../functions/bookingFunctions";
import React, {useContext, useState} from "react";
import {FaBuilding, FaCircle, FaComment, FaInfoCircle, FaMoneyBill} from "react-icons/fa";
import {StatusContext} from "../../../store/Store";
import TextInput from "../../Form/TextInput";
import TextArea from "../../Form/TextArea";
import Radio from "@material-ui/core/Radio";
import Checkout from "../../Stripe/Checkout";
import Notification from "../../Status/Notification";
import UserAgreement from "../UserAgreement";

const paymentMethods = [{name: "creditcard", label: "Betalingskort"}, {name : "invoice", label: "Faktura"},];

export default props => {

    const {
        bookingFields, updateField, type,
        setFormStatus,
        paymentMethod, setPaymentMethod, TimezoneOffset,
        stageNumber, setStageNumber,
        stripeSubmit, setStripeSubmit,
        logBookingEvent
    } = props;

    const [userAgrees, setUserAgrees] = useState(false);
    const [showAgreementAlert, setShowAgreementAlert] = useState(false);
    const [sameAddress, setSameAddress] = useState(false);

    const [, dispatchStatus] = useContext(StatusContext);

    const canSubmit = type === "booking" || userAgrees;

    const dots = type === "quickbooking" ? [1,2,3] : [2,3];

    return (
        <form
            className="row my-3"
            onSubmit={e => {
                e.preventDefault();
                if(!canSubmit) {
                    setShowAgreementAlert(true);
                    return;
                }
                dispatchStatus({type: "addConnection"});

                // DATA
                let postData = {...bookingFields,};
                postData.booking_payment_type = paymentMethod;
                postData.booking_datestamp = bookingFields.booking_datestamp - TimezoneOffset * 60;
                postData.booking_type = type === "quickbooking" ? "quickbooking" : "booking";

                if (sameAddress) {
                    postData = {
                        ...postData,
                        booking_company_address1 : bookingFields.booking_location_address1,
                        booking_company_zip : bookingFields.booking_location_zip,
                        booking_company_city : bookingFields.booking_location_city,
                    }
                }


                if (paymentMethod !== "creditcard") {
                    postData.booking_status = type === "quickbooking" ? "prebooked" : "booked";
                }


                // POST
                postBooking(postData).then(res => {
                    if (paymentMethod === "creditcard") {
                        setStripeSubmit(true);
                        return;
                    }
                    setFormStatus(type === "quickbooking" ? "success_booked" : "success_booking");
                    logBookingEvent("complete");
                    props.doScrollToForm();
                }).finally(() => dispatchStatus({type: "removeConnection"}));

            }}
        >
            <Notification
                open={showAgreementAlert}
                type={"warning"}
                onClose={() => setShowAgreementAlert(false)}
            >
                Du mangler at acceptere betingleserne
            </Notification>

            <>
                <div className="col-12">
                    <div className={"booking-input-title mb-3"}>
                        <FaBuilding className="booking-icon"/>Firmadetaljer
                    </div>
                </div>

                <div className="col-12 mb-2">
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" checked={sameAddress} onChange={() => {setSameAddress(p => !p)}}/>
                        <label className="form-check-label"> Samme adresse som afholdelsessted</label>
                    </div>
                </div>

                <div className="col-12 mb-2">
                    <TextInput
                        required={true}
                        name={"booking_company_address1"}
                        label={"Gadenavn og husnr."}
                        readOnly={sameAddress}
                        placeholder={"Eks. Fabriksparken 17, 1. sal"}
                        onChange={val => {
                            updateField("booking_company_address1", val)
                        }}
                        value={sameAddress ? bookingFields.booking_location_address1 : bookingFields.booking_company_address1}
                    />
                </div>

                <div className="col-12 col-sm-6 col-lg-12 col-xl-6 mb-2">
                    <TextInput
                        required={true}
                        readOnly={sameAddress}
                        name={"booking_company_zip"}
                        label={"Postnr."}
                        placeholder={"Eks. 2600"}
                        onChange={val => {
                            updateField("booking_company_zip", val)
                        }}
                        value={sameAddress ? bookingFields.booking_location_zip : bookingFields.booking_company_zip}
                    />
                </div>

                <div className="col-12 col-sm-6 col-lg-12 col-xl-6 mb-2">
                    <TextInput
                        required={true}
                        readOnly={sameAddress}
                        name={"booking_company_city"}
                        label={"By"}
                        placeholder={"Eks. Glostrup"}
                        onChange={val => {
                            updateField("booking_company_city", val)
                        }}
                        value={sameAddress ? bookingFields.booking_location_city : bookingFields.booking_company_city}
                    />
                </div>

                <div className="col-12 col-sm-6 col-lg-12 col-xl-6 mb-2">
                    <TextInput
                        name={"booking_company_cvr"}
                        label={"CVR nummer"}
                        placeholder={"Eks. 15362718"}
                        onChange={val => {updateField("booking_company_cvr", val)}}
                        value={bookingFields.booking_company_cvr}
                    />
                </div>

                <div className="col-12 col-sm-6 col-lg-12 col-xl-6 mb-2">
                    <TextInput
                        name={"booking_accounting_ean"}
                        label={"EAN nummer"}
                        placeholder={"Eks. 7384756382912"}
                        onChange={val => {updateField("booking_accounting_ean", val)}}
                        value={bookingFields.booking_accounting_ean}
                    />
                </div>
            </>



            <> {/* --------------- TEMA OG FORMÅL ---------- */}
                <div className="col-12">
                    <div className={"booking-input-title my-3"}>
                        <FaComment className="booking-icon"/>Kommentarer til bookingen
                    </div>
                </div>

                <div className="col-12 mb-2">
                    <TextArea
                        name={"booking_info_notes"}
                        placeholder={"Her kan du skrive en kommentar til din booking..."}
                        onChange={val => {updateField("booking_info_notes", val)}}
                        value={bookingFields.booking_info_notes}
                    />
                </div>
            </>

            <> {/* --------------- BETALING ---------- */}
                <div className="col-12">
                    <div className={"booking-input-title my-3"}>
                        <FaMoneyBill className="booking-icon"/>Betalingsmetode
                    </div>
                </div>

                <div className="col-12 text-center mb-3">
                    {paymentMethods.map(method => (
                        <span className="pr-4" key={method.name}>
                            <Radio color={'primary'}
                                   classes={{
                                       root: 'text-secondary',
                                       checked: 'text-success'
                                   }}
                                   checked={paymentMethod === method.name}
                                   onChange={() => setPaymentMethod(method.name)}
                                   value={method.name}
                                   name={method.name}
                                   aria-label={method.label}
                            />
                            {method.label}
                        </span>
                    ))}

                    {
                        paymentMethod === "creditcard" ?
                            <>
                                <p className={"m-1 text-secondary text-center"}>
                                    <FaInfoCircle className="booking-icon"/>Betalingsoplysninger
                                    udfyldes på næste side
                                </p>
                                <Checkout
                                    submit={stripeSubmit}
                                    bookingId={bookingFields.booking_relation_booking}
                                    price={parseFloat(bookingFields.booking_payment_total)}
                                />
                            </>
                            :
                            <p className={"m-1 text-secondary text-center"}>
                                <FaInfoCircle className="booking-icon"/> Fakturagebyr : DKK 275 ex. moms
                            </p>
                    }
                </div>
                {
                    type === "quickbooking" &&
                    <div className="col-12 my-2">
                        <UserAgreement userAgrees={userAgrees} setUserAgrees={setUserAgrees}/>
                    </div>

                }

            </>


            <div className="col-12">
                <div className="btn-group w-100">
                    <button className={`btn btn-dark`} type="button" onClick={() => {setStageNumber(2)}}>Tilbage</button>
                    <button className={`btn ${canSubmit ? "btn-success" : "btn-dark bg-dark-grey"}`} type="submit">Indsend</button>
                </div>
            </div>

            <div className="text-center w-100 mt-2">
                {dots.map(dot => (
                    <span
                        key={dot}
                        style={{
                            fontSize: '.7rem',
                            marginRight: '5px',
                            color: stageNumber === dot ? '#ffffff' : '#777777'
                        }}
                    >
                        <FaCircle/>
                    </span>
                ))}
            </div>
        </form>
    );
}
