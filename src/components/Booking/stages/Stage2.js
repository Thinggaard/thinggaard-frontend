import {postBooking} from "../../../functions/bookingFunctions";
import LoadingLogo from "../../Status/LoadingLogo";
import TimeSelect from "../../Form/TimeSelect";
import NumberInput from "../../Form/NumberInput";
import Dropdown from "../../Form/Dropdown";
import React, {useContext, useEffect, useState} from "react";
import {FaCalendar, FaCircle, FaLanguage, FaMapMarker, FaQuestionCircle, FaTimes, FaUserCheck} from "react-icons/fa";
import {StatusContext} from "../../../store/Store";
import TextInput from "../../Form/TextInput";
import TextArea from "../../Form/TextArea";
import {formatDate} from "../../../functions/DateTimeFunctions";
import ChipSelector from "../../Form/ChipSelector";
import Radio from "@material-ui/core/Radio";
import {regions} from "../../../data/regions";

const targetGroupList = ["Medarbejdere", "Ledere", "Kunder", "Medlemmer", "Andet"];
const occasionList = ["Medarbejdermøde", "Ledermøde", "Medlemsarrangement", "Strategidag", "Kundearrangement", "Firmafest", "Andet"];

export default props => {

    const {
        bookingFields, updateField, bookingId,
        TimezoneOffset,
        type,
        hour, setHour,
        minute, setMinute,
        endTime, updateEndTime,
        product, speaker,
        participantOptions, printParticipantOptions, participantsSelection, setParticipantsSelection, participantsFee,
        selectedDate,
        transportPrice, updateTransport,
        stageNumber, setStageNumber,
        region, setRegion, regionSelected
    } = props;

    const [targetGroups, setTargetGroups] = useState([]);
    const [showTargetGroupTextField, setShowTargetGroupTextField] = useState(false);
    const [customTargetGroup, setCustomTargetGroup] = useState("");

    const [occasions, setOccasions] = useState([]);
    const [showOccasionTextField, setShowOccasionTextField] = useState(false);
    const [customOccasion, setCustomOccasion] = useState("");

    const [language, setLanguage] = useState("");

    const [, dispatchStatus] = useContext(StatusContext);

    const productMeta = product.meta || {};

    const minDuration =
        !!productMeta.product_duration_min && !isNaN(productMeta.product_duration_min) ?
            parseInt(productMeta.product_duration_min) : 15;
    const maxDuration =
        !!productMeta.product_duration_max && !isNaN(productMeta.product_duration_max) ?
            parseInt(productMeta.product_duration_max) : 60;


    const onProvidedData = () => {
        if (!speaker) return;
        if (!language && !!bookingFields.language) setLanguage(bookingFields.language);
        else if (!language && !!speaker.post.languages) setLanguage(speaker.post.languages[0].name);

        if (!!bookingFields.booking_info_targetgroup) {
            setTargetGroups(bookingFields.booking_info_targetgroup.split(",").map(x => x.trim()));
        }
        if (!!bookingFields.booking_info_purpose) {
            setOccasions(bookingFields.booking_info_purpose.split(",").map(x => x.trim()));
        }
    };
    useEffect(onProvidedData, [bookingId, speaker]);

    const dots = type === "quickbooking" ? [1,2,3] : [2,3];

    return (
        <form
            className="row my-3"
            onSubmit={e => {
                e.preventDefault();
                dispatchStatus({type: "addConnection"});

                // DATA
                const postData = {...bookingFields};
                postData.booking_datestamp = bookingFields.booking_datestamp - TimezoneOffset * 60;
                postData.booking_status = type === "quickbooking" ? "initiated" : "confirmed";
                postData.booking_type = type === "quickbooking" ? "quickbooking" : "booking";

                if (!!targetGroups.length) postData.booking_info_targetgroup = targetGroups.join(", ");
                if (!!occasions.length) postData.booking_info_purpose = occasions.join(", ");

                // POST
                postBooking(postData).then(res => {
                    updateField("booking_payment_total", res.booking.meta.booking_payment_total);
                    setStageNumber(3);
                }).finally(() => dispatchStatus({type: "removeConnection"}));
            }}
        >

            {type==="booking" &&
                <>
                    <div className="col-12">
                        <div className={"booking-input-title mb-3"}>
                            <FaMapMarker className="booking-icon"/>Lokation
                        </div>
                    </div>
                    { !regionSelected && <>

                        <div className="col-12 mb-2">
                            <TextInput
                                name={"booking_location_name"}
                                label={"Evt. navn på afholdelsessted"}
                                placeholder={"Eks. Gentofte Hotel"}
                                onChange={val => {updateField("booking_location_name", val)}}
                                value={bookingFields.booking_location_name}
                            />
                        </div>

                        <div className="col-12 mb-2">
                            <TextInput
                                name={"booking_location_address1"}
                                label={"Gadenavn og husnr."}
                                placeholder={"Eks. Gentoftegade 29"}
                                onChange={val => {updateField("booking_location_address1", val)}}
                                value={bookingFields.booking_location_address1}
                            />
                        </div>


                        <div className="col-12 col-sm-6 col-lg-12 col-xl-6 mb-2">
                            <TextInput
                                name={"booking_location_zip"}
                                label={"Postnr."}
                                placeholder={"Eks. 2820"}
                                onChange={val => {
                                    updateField("booking_location_zip", val);
                                    updateTransport(val);
                                }}
                                value={bookingFields["booking_location_zip"]}
                                required={!regionSelected}
                            />
                        </div>

                        <div className="col-12 col-sm-6 col-lg-12 col-xl-6 mb-2">
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
                                        x = x.value;
                                        setRegion(x);
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

                        <div className="text-success text-center d-flex justify-content-center" style={{height: 22}}>
                            {
                                transportPrice > 0 ?
                                    `+ DKK ${transportPrice}`
                                    : transportPrice < 0 && <LoadingLogo size={22}/>
                            }
                        </div>
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
                                    `d. ${formatDate(selectedDate)} `
                            }
                        </div>
                    </div>



                    <div className="col-6">
                        <TimeSelect
                            label={"Starttidspunkt"}
                            setHour={setHour}
                            hour={hour}
                            minute={minute}
                            setMinute={setMinute}
                            required={true}
                        >
                            <div className={"input-label text-right"}>(kl. 8 - 20)</div>
                        </TimeSelect>
                    </div>

                    <div className="col-6">
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
                    </div>

                    <div className="col-12 mb-2">
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
                </>
            }


            {speaker.post.languages.length > 1 &&
            <> {/* --------------- SPROG --------------- */}
                <div className="col-12">
                    <div className={"booking-input-title my-3"}>
                        <FaLanguage className="booking-icon"/>Sprog : {language}
                    </div>
                </div>


                <div className="col-12">
                    {
                        speaker.post.languages.map((lang, i) => (
                            <span key={i} className="pr-3">
                                <Radio color={'primary'}
                                       classes={{
                                           root: 'text-secondary',
                                           checked: 'text-success'
                                       }}
                                       checked={language === lang.name}
                                       onChange={e => {
                                           setLanguage(e.target.value);
                                           updateField("booking_language", e.target.value)
                                       }}
                                       value={lang.name}
                                       name={lang.name}
                                       aria-label={lang.name}
                                />{lang.name}
                            </span>
                        ))
                    }
                </div>

            </>
            }


            <> {/* --------------- ANDLEDNING --------------- */}
                <div className="col-12">
                    <div className={"booking-input-title my-3"}>
                        <FaQuestionCircle className="booking-icon"/>Andledning
                    </div>
                </div>

                <div className="col-12 mb-2 text-center">
                    <ChipSelector
                        selected={occasions} choices={occasionList}
                        customFieldToggle={setShowOccasionTextField}
                        updateSelection={setOccasions}
                    />
                </div>
                {
                    showOccasionTextField &&
                    <div className="col-12 mb-2">
                        <TextInput
                            placeholder={"Skriv målgruppe..."}
                            onChange={setCustomOccasion}
                            value={customOccasion}
                        />
                    </div>
                }
            </>


            <>  {/* --------------- MÅLGRUPPE ---------- */}
                <div className="col-12">
                    <div className={"booking-input-title my-3"}>
                        <FaUserCheck className="booking-icon"/>Målgruppe
                    </div>
                </div>

                <div className="col-12 mb-2 text-center">
                    <ChipSelector
                        selected={targetGroups} choices={targetGroupList}
                        customFieldToggle={setShowTargetGroupTextField}
                        updateSelection={setTargetGroups}
                    />
                </div>
                {
                    showTargetGroupTextField &&
                    <div className="col-12 mb-2">
                        <TextInput
                            placeholder={"Skriv målgruppe..."}
                            onChange={setCustomTargetGroup}
                            value={customTargetGroup}
                        />
                    </div>
                }
            </>


            <> {/* --------------- TEMA OG FORMÅL ---------- */}
                <div className="col-12">
                    <div className={"booking-input-title my-3"}>
                        <FaUserCheck className="booking-icon"/>Tema & Formål
                    </div>
                </div>

                <div className="col-12 mb-2">
                    <TextArea
                        name={"booking_info_theme"}
                        placeholder={"Skriv tema og formål..."}
                        onChange={val => {updateField("booking_info_theme", val)}}
                        value={bookingFields.booking_info_theme}
                    />
                </div>
            </>


            <div className="col-12">
                <div className="btn-group w-100">
                    {
                        type === "quickbooking" &&
                        <button className={`btn btn-dark`} type="button" onClick={() => {setStageNumber(1)}}>Tilbage</button>
                    }
                    <button className="btn btn-success" type="submit">Videre</button>
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
                        }}>
                            <FaCircle/>
                        </span>
                ))}
            </div>

        </form>
    );
}