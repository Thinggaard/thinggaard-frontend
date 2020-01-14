import {postBooking} from "../../../functions/bookingFunctions";
import LoadingLogo from "../../Status/LoadingLogo";
import DatePicker from "react-datepicker";
import TimeSelect from "../../Form/TimeSelect";
import NumberInput from "../../Form/NumberInput";
import Dropdown from "../../Form/Dropdown";
import React, {useContext, useEffect, useState} from "react";
import {FaBuilding, FaCalendar, FaCircle, FaMapMarker, FaTimes, FaInfoCircle} from "react-icons/fa";
import {StatusContext} from "../../../store/Store";
import TextInput from "../../Form/TextInput";
import TextArea from "../../Form/TextArea";
import {formatDate} from "../../../functions/DateTimeFunctions";
import Notification from "../../Status/Notification";
import "react-datepicker/dist/react-datepicker.css";
import UserAgreement from "../UserAgreement";
import {regions} from "../../../data/regions";
import RegionUnavailable from "../RegionUnavailable";


export default props => {

    const {
        speaker, product,
        bookingFields, updateField,
        TimezoneOffset,
        type, setType,
        hour, setHour,
        minute, setMinute,
        endTime, updateEndTime,
        participantOptions, printParticipantOptions, participantsSelection ,setParticipantsSelection, participantsFee,
        selectedDate, setSelectedDate,
        transportPrice, updateTransport,
        stageNumber, setStageNumber,
        setFormStatus,
        region, setRegion, regionSelected, regionAvailability,
        logBookingEvent,
    } = props;

    const today = new Date();
    const todayPlusOneYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

    const [disabledWeekDays, setDisabledWeekDays] = useState([]);
    const [missingFields, setMissingFields] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAgreementAlert, setShowAgreementAlert] = useState(false);
    const [userAgrees, setUserAgrees] = useState(false);

    const [, dispatchStatus] = useContext(StatusContext);

    const productMeta = product.meta || {};
    const speakerMeta = !!speaker.post ? speaker.post.meta :  {};

    const minDuration =
        !!productMeta.product_duration_min && !isNaN(productMeta.product_duration_min) ?
            parseInt(productMeta.product_duration_min) : 15;
    const maxDuration =
        !!productMeta.product_duration_max && !isNaN(productMeta.product_duration_max) ?
            parseInt(productMeta.product_duration_max) : 60;


    const updateDisabledWeekDays = () => {
        let disabled = [];
        if (!!speaker && !!speaker.post.meta) {
            if (!speaker.post.meta.speaker_day_sunday) disabled.push(0);
            if (!speaker.post.meta.speaker_day_monday) disabled.push(1);
            if (!speaker.post.meta.speaker_day_tuesday) disabled.push(2);
            if (!speaker.post.meta.speaker_day_wednesday) disabled.push(3);
            if (!speaker.post.meta.speaker_day_thursday) disabled.push(4);
            if (!speaker.post.meta.speaker_day_friday) disabled.push(5);
            if (!speaker.post.meta.speaker_day_saturday) disabled.push(6);
        }
        if (disabled.length === 7) disabled = [];
        setDisabledWeekDays(disabled);
    };
    useEffect(updateDisabledWeekDays, [speaker, product]);

    const dots = type === "quickbooking" ? [1,2,3] : [];


    // MIGHT BE OVERKILL
    const requiredBookingFields = [
        //type === "quickbooking" && "booking_location_address1",
        //"booking_location_zip",
        //"booking_location_city",
        "booking_duration",
        "booking_customer_name",
        "booking_customer_email",
        "booking_customer_phone",
    ];
    const checkFields = () => {
        const missing = [];
        requiredBookingFields.forEach(field => {
            if (!!field && !bookingFields[field]) missing.push(field);
        });
        if (participantsSelection < 0) missing.push("participants");
        if (minute === "" || hour === "") missing.push("time");
        setMissingFields(missing);
        if(missing.length > 0) setShowAlert(true);
        return missing.length;
    };

    const canSubmit = type === "quickbooking" || userAgrees;


    return (
        <form
            className="row my-3"
            onSubmit={e => {
                e.preventDefault();

                if (checkFields() !== 0) return;

                if (!canSubmit) {
                    setShowAgreementAlert(true);
                    return;
                }

                dispatchStatus({type: "addConnection"});

                // DATA
                const postData = {
                    booking_type: type,
                    booking_origin_url: window.location.href,
                    booking_status: type === "quickbooking" ? "initiated" : "pending",
                    booking_yxs : localStorage.getItem("yxs"),
                    ...bookingFields,
                };
                postData.booking_datestamp = bookingFields.booking_datestamp - TimezoneOffset * 60;

                // POST
                postBooking(postData).then(res => {
                    logBookingEvent("init");
                    if (type === "quickbooking") {
                        setStageNumber(2);
                        updateField("booking_relation_booking", res.ID);
                    } else {
                        setFormStatus("success_request");
                        props.doScrollToForm();
                    }
                }).catch(() => {
                    setFormStatus("error_unexpected");
                    props.doScrollToForm();
                }).finally(() => dispatchStatus({type: "removeConnection"}));
            }}
        >

            <Notification
                open={showAlert}
                type={"warning"}
                onClose={() => setShowAlert(false)}
            >
                Du mangler at udfylde {missingFields.length} {missingFields.length === 1 ? "påkrævet felt" : "påkrævede felter"}
            </Notification>

            <Notification
                open={showAgreementAlert}
                type={"warning"}
                onClose={() => setShowAgreementAlert(false)}
            >
                Du mangler at acceptere betingleserne
            </Notification>

            <div className="col-12">
                <div className={"booking-input-title mb-3"}>
                    <FaMapMarker className="booking-icon"/>Lokation
                </div>
            </div>

            { !regionSelected && <>

            {type === "quickbooking" &&
            <>
                <div className="col-12 mb-2">
                    <TextInput
                        name={"booking_location_name"}
                        label={"Evt. navn på afholdelsessted"}
                        placeholder={"Eks. Gentofte Hotel"}
                        onChange={val => {updateField("booking_location_name", val);}}
                        value={bookingFields.booking_location_name}
                    />
                </div>

                <div className="col-12 mb-2">
                    <TextInput
                        name={"booking_location_address1"}
                        label={"Gadenavn og husnr."}
                        placeholder={"Eks. Gentoftegade 29"}
                        onChange={val => {updateField("booking_location_address1", val);}}
                        value={bookingFields.booking_location_address1}
                    />
                </div>
            </>
            }

            <div className={`col-12 col-sm-6 col-lg-12 col-xl-6 mb-2`}>
                <TextInput
                    name={"booking_location_zip"}
                    label={"Postnr."}
                    placeholder={"Eks. 2820"}
                    onChange={val => {
                        updateField("booking_location_zip", val);
                        updateTransport(val);
                    }}
                    value={bookingFields.booking_location_zip}
                    required={!regionSelected}
                />
            </div>

            <div className={`col-12 col-sm-6 col-lg-12 col-xl-6 mb-2`}>
                <TextInput
                    name={"booking_location_city"}
                    label={"By"}
                    placeholder={"Eks. Gentofte"}
                    onChange={val => {updateField("booking_location_city", val)}}
                    value={bookingFields.booking_location_city}
                    required={!regionSelected}
                />

            </div>
            </>}

            <div className="col-12 mb-2">
                <span className="w-100">
                    {regionSelected ? "Region" : <strong>Eller, vælg region</strong>}
                </span>

                <div className="row">
                    <div className="col">
                        <Dropdown
                            onChange={(x) => {
                                setRegion(x.value);
                            }}
                            placeholder={"Vælg region"}
                            options={regions}
                            selected={region}
                        />
                    </div>
                    <div className="col-auto text-center">
                        <FaTimes
                            className="booking-icon h3 pointer"
                            onClick={() => {
                                setRegion(-1);
                            }}
                        />
                    </div>
                </div>

                {
                    regionAvailability ?
                    <div className="text-success text-center d-flex justify-content-center" style={{height: 22}}>
                        {
                            transportPrice > 0 ?
                                `+ DKK ${transportPrice}`
                                : transportPrice < 0 && <LoadingLogo size={22}/>
                        }
                    </div>
                        :
                    <RegionUnavailable
                        regions={speaker.post.meta.speaker_region_teaser_text}
                        speakerName={speaker.post.post_title}
                        switchToQuestion={() => setType("question")}
                    />
                }

                {
                    !!speakerMeta.speaker_transport_information &&
                    <div className="alert alert-dark" role="alert">
                        <FaInfoCircle className={"mr-2"}/>
                        <strong>Transport: </strong>
                        {speakerMeta.speaker_transport_information}
                    </div>
                }

            </div>


            <div className="col-12">
                <div className={"booking-input-title my-3"}>
                    <FaCalendar className="booking-icon"/>
                    {
                        !!hour && !!minute && !!bookingFields.booking_duration ?
                            <>
                                {`d. ${formatDate(selectedDate)} `}
                                &bull;
                                {` ${hour}:${minute}`} - {endTime}
                            </>
                            :
                            "Dato og tid"
                    }
                </div>
            </div>

            <DatePicker
                className="col-auto date-picker"
                canClearSelection={false}
                filterDate={date => !disabledWeekDays.includes(date.getDay())}
                inline
                selected={selectedDate}
                minDate={today}
                maxDate={todayPlusOneYear}
                onChange={(date, change) => {
                    if (change) setSelectedDate(date);
                }}
            />

            <div className="col h-100 m-auto">

                <TimeSelect
                    label={type === "booking" ? "Ca. starttidspunkt" : "Starttidspunkt"}
                    setHour={setHour}
                    hour={hour}
                    minute={minute}
                    setMinute={setMinute}
                    required={true}
                >
                    <div className={"input-label text-right"}>(kl. 8 - 20)</div>
                </TimeSelect>

                <NumberInput
                    label={"Varighed i minutter"}
                    required={true}
                    min={minDuration}
                    max={maxDuration}
                    step={5}
                    aria-label={"timer"}
                    value={bookingFields.booking_duration}
                    inputClass={"text-center"}
                    onChange={value => {
                        updateField("booking_duration", value);
                        updateEndTime();
                    }}
                >
                    <div className={"input-label clearfix text-right"}>({minDuration} - {maxDuration})</div>
                </NumberInput>

                <div className={"input-label text-left"}>Antal deltagere<span className={"text-danger"}>*</span></div>

                <Dropdown
                    onChange={(x) => {
                        x = x.value;
                        updateField("booking_info_participants_min", participantOptions[x][0]);
                        updateField("booking_info_participants_max", participantOptions[x][1]);
                        setParticipantsSelection(x);
                    }}
                    options={printParticipantOptions(participantOptions)}
                    selected={participantsSelection}
                />
                {
                    participantsFee > 0 &&
                    <div className="col-12 text-center text-success">+ DKK {participantsFee}</div>
                }

            </div>

            <div className="col-12">
                <div className={"booking-input-title my-3"}>
                    <FaBuilding className="booking-icon"/>Kontaktinformation
                </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-12 col-xl-6 mb-2">
                <TextInput
                    name={"booking_company_name"}
                    label={"Firmanavn"}
                    placeholder={"Eks.YOUANDX Aps"}
                    onChange={val => {updateField("booking_company_name", val)}}
                    value={bookingFields.booking_company_name}
                />
            </div>

            <div className="col-12 col-sm-6 col-lg-12 col-xl-6 mb-2">
                <TextInput
                    required={true}
                    name={"booking_customer_name"}
                    label={"Kontaktperson"}
                    placeholder={"Eks. Maybritt Toft Bisp"}
                    onChange={val => {updateField("booking_customer_name", val)}}
                    value={bookingFields.booking_customer_name}
                />
            </div>

            <div className="col-12 col-sm-6 col-lg-12 col-xl-6 mb-2">
                <TextInput
                    required={true}
                    name={"booking_customer_phone"}
                    label={"Telefon nummer"}
                    placeholder={"Eks. +4570200449"}
                    onChange={val => {updateField("booking_customer_phone", val)}}
                    value={bookingFields.booking_customer_phone}
                />
            </div>

            <div className="col-12 col-sm-6 col-lg-12 col-xl-6 mb-2">
                <TextInput
                    required={true}
                    type={"email"}
                    name={"booking_customer_email"}
                    label={"Email"}
                    placeholder={"Eks. mtb@youandx.com"}
                    onChange={val => {updateField("booking_customer_email", val)}}
                    value={bookingFields.booking_customer_email}
                />
            </div>

            {
                type === "booking" &&
                <>
                    <div className="col-12 mb-2">
                        <TextArea
                            name={"booking_info_prenotes"}
                            label={"Besked"}
                            placeholder={"Skriv evt. en besked her..."}
                            onChange={val => {updateField("booking_info_prenotes", val)}}
                            value={bookingFields.booking_info_prenotes}
                        />
                    </div>
                    <div className="col-12 mb-2">
                        <UserAgreement userAgrees={userAgrees} setUserAgrees={setUserAgrees}/>
                    </div>
                </>
            }

            <div className="col-12">
                <button className={`btn ${canSubmit ? "btn-success" : "btn-dark"} w-100`} type="submit">
                    {type === "booking" ? "Indsend" : "Videre"}
                </button>
                <div className="text-center w-100 mt-2">
                    {dots.map(dot => (
                        <span
                            key={dot}
                            style={{
                                fontSize: '.7rem',
                                marginRight: '5px',
                                color: stageNumber === dot ? '#ffffff' : '#777777'
                            }}>
                                <FaCircle/>
                        </span>
                    ))}
                </div>
            </div>
        </form>
    );
};