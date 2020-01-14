import React, {useContext, useState} from 'react';
import TextInput from "../Form/TextInput";
import TextArea from "../Form/TextArea";
import {FaComment} from "react-icons/fa";
import {postLead} from "../../functions/bookingFunctions";
import {StatusContext} from "../../store/Store";
import StatusMessage from "../Status/StatusMessage";
import {messageErrorUnexpected, messageSuccessQuestion} from "../../data/statusMessages";

export default props => {

    const {updateField, bookingFields, speaker, product, className="", logBookingEvent} = props;

    const [messageStatus, setMessageStatus] = useState("");

    const [, dispatchStatus] = useContext(StatusContext);

    if (messageStatus === "success_create") return (
        <StatusMessage
            title={<h1 className="text-success">TAK!</h1>}
            buttonText={"Nyt spørgsmål"}
            buttonClickHandler={() => {setMessageStatus("")}}
        >
            {messageSuccessQuestion}
        </StatusMessage>
    );

    if (messageStatus === "fail_create") return (
        <StatusMessage
            title={<h1 className="text-danger">UPS...</h1>}
            buttonText={"Nyt spørgsmål"}
            buttonClickHandler={() => {setMessageStatus("")}}
        >
            {messageErrorUnexpected}
        </StatusMessage>
    );

    return (
        <form
            className={"row my-3 " + className}
            onSubmit={e => {
                e.preventDefault();
                dispatchStatus({type: "addConnection"});
                const postData = {
                    lead_info_notes : bookingFields.lead_info_notes,
                    lead_relation_speaker : !!speaker.post ? speaker.post.ID : null,
                    lead_relation_product : !!product ? product.ID : null,
                    lead_customer_email: bookingFields.booking_customer_email,
                    lead_customer_name: bookingFields.booking_customer_name,
                    lead_customer_phone: bookingFields.booking_customer_phone,
                    lead_yxs : localStorage.getItem("yxs"),
                };
                logBookingEvent("init", {}, "question");
                postLead(postData).then(() => {
                    setMessageStatus("success_create")
                }).catch(() => {
                    setMessageStatus("fail_create");
                }).finally(() => {
                    dispatchStatus({type: "removeConnection"});
                })
            }}
        >

            <div className="col-12">
                <div className={"booking-input-title mb-3"}>
                    <FaComment className="booking-icon"/>Skriv til {speaker.post && speaker.post.post_title}
                </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-12 col-xl-6 mb-2">
                <TextInput
                    required={true}
                    label={"Kontaktperson"}
                    placeholder={"Eks. Maybritt Toft Bisp"}
                    onChange={val => {updateField("booking_customer_name", val)}}
                    value={bookingFields.booking_customer_name}
                />
            </div>

            <div className="col-12 col-sm-6 col-lg-12 col-xl-6 mb-2">
                <TextInput
                    label={"Firmanavn"}
                    placeholder={"Eks. YOUANDX Aps"}
                    onChange={val => {updateField("booking_company_name", val)}}
                    value={bookingFields.booking_company_name}
                />
            </div>

            <div className="col-12 col-sm-6 col-lg-12 col-xl-6 mb-2">
                <TextInput
                    required={true}
                    label={"Telefon nummer"}
                    placeholder={"Eks. +4570200449"}
                    onChange={val => {updateField("booking_customer_phone", val)}}
                    value={bookingFields.booking_customer_phone}
                />
            </div>

            <div className="col-12 col-sm-6 col-lg-12 col-xl-6 mb-2">
                <TextInput
                    required={true}
                    label={"Email"}
                    placeholder={"Eks. mtb@youandx.com"}
                    onChange={val => {updateField("booking_customer_email", val)}}
                    value={bookingFields.booking_customer_email}
                />
            </div>

            <div className="col-12">
                <TextArea
                    label={"Besked"}
                    required={true}
                    placeholder={`Skriv din besked til ${speaker.post && speaker.post.post_title} her...`}
                    onChange={val => {updateField("lead_info_notes", val)}}
                    value={bookingFields.lead_info_notes}
                />
            </div>

            <div className="col-12">
                <button className="btn btn-success w-100" type="submit">Send Besked</button>
            </div>
        </form>
    )
}