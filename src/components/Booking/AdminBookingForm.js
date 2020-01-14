import React, {useContext, useEffect, useState} from "react";
import {postBooking} from "../../functions/bookingFunctions";
import {StatusContext} from "../../store/Store";
import {FaBuilding, FaCalendar, FaComment, FaInfoCircle, FaMapMarker, FaMoneyBill, FaUserCheck, FaQuestionCircle} from "react-icons/fa";
import axios from "axios";
import TextInput from "../Form/TextInput";
import NumberInput from "../Form/NumberInput";
import Dropdown from "../Form/Dropdown";
import Radio from "@material-ui/core/Radio";
import {formatDate, getTimeFromStamp} from "../../functions/DateTimeFunctions";
import DatePicker from "react-datepicker";
import TimeSelect from "../Form/TimeSelect";
import TextArea from "../Form/TextArea";
import BookingStatus from "./BookingStatus";
import "react-datepicker/dist/react-datepicker.css";
import AdminPriceTable from "./AdminPriceTable";
import EconomicActionsView from "../Economic/EconomicActionsView";
import Notification from "../Status/Notification";

const currencies = [
    {value: "DKK", label: "DKK"},
    {value: "GBP", label: "GBP"},
    {value: "EUR", label: "EUR"},
    {value: "USD", label: "USD"},
];

const bookingStatusOptions = [
    {value: "prebooked", label: "Prebooked (afventer speaker)"},
    {value: "booked", label: "Færdigbooket"},
];

const editStatusOptions = [
    {value: "initiated", label: "Påbegyndt (QuickBooking 1/3)"},
    {value: "pending", label: "Pending (afventer speaker & customer)"},
    {value: "prebooked", label: "Prebooked (afventer speaker)"},
    {value: "confirmed", label: "Bekræftet af speaker"},
    {value: "booked", label: "Færdigbooket"},
    {value: "completed", label: "Event afholdt"},
    {value: "declined", label: "Afvist"},
    {value: "cancelcustomer", label: "Annuleret af kunden"},
    {value: "cancelspeaker", label: "Annuleret af speaker"},
    {value: "cancelinternal", label: "Annuleret af YOUANDX"},
];

const TimezoneOffset = new Date().getTimezoneOffset(); // -120 minutes in DK summertime

const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
const todayPlusOneYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
const todayLong = `${today.getDate()}/${today.getMonth()} - ${today.getFullYear()}`;

const AdminBookingForm = (
    {
        bookingFields, updateField, closeOverlay, economicSecret, fees, reload,
        pagetype, product = {}, speaker = {post: {}}, edit = false, bookingId,
    }
) => {

    const [, dispatchStatus] = useContext(StatusContext);

    const [formStatus, setFormStatus] = useState("");

    const [exchangeRates, setExchangeRates] = useState({});
    const [oldRates, setOldRates] = useState({});

    const [stage, setStage] = useState(1);

    const [bookingStatus, setBookingStatus] = useState("booked");

    const [updateCurrencies, setUpdateCurrencies] = useState(false);
    const [currencyTransport, setCurrencyTransport] = useState(bookingFields.booking_payment_transport_currency);
    const [currencyProduct, setCurrencyProduct] = useState(bookingFields.booking_payment_product_currency);
    const [currencyFees, setCurrencyFees] = useState(bookingFields.booking_payment_fee_currency);
    const [currencyParticipants, setCurrencyParticipants] = useState(bookingFields.booking_payment_participants_fee_currency || "DKK");

    const [feeSpeaker, setFeeSpeaker] = useState(0);
    const [feeCustomer, setFeeCustomer] = useState(0);
    const [feeType, setFeeType] = useState("fixed");

    const [sameAddress, setSameAddress] = useState(false);

    const [productPrice, setProductPrice] = useState(0);
    const [transportPrice, setTransportPrice] = useState(0);
    const [participantsPrice, setParticipantsPrice] = useState(0);
    const [invoiceFee, setInvoiceFee] = useState(275);
    const [noTax, setNoTax] = useState(false);

    const [hour, setHour] = useState("");
    const [minute, setMinute] = useState("");
    const [selectedDate, setSelectedDate] = useState(today);
    const [endTime, setEndTime] = useState("");

    const [updateSuccess, setUpdateSuccess] = useState(0);

    const toggleSameAddress = () => {
        if (!sameAddress) {
            setSameAddress(true);
        } else setSameAddress(false);
    };

    console.log(sameAddress);

    const selectedTimeStamp =
        (hour * 60 * 60 * 1000) +
        (minute * 60 * 1000) +
        selectedDate.getTime();

    const updateEndTime = () => setEndTime(getTimeFromStamp(selectedTimeStamp + parseInt(bookingFields.booking_duration) * 60 * 1000));

    const productMeta = product.meta || {};
    const speakerMeta = speaker.post.meta || {};

    const minDuration =
        !!productMeta.product_duration_min && !isNaN(productMeta.product_duration_min) ?
            parseInt(productMeta.product_duration_min) : "??";
    const maxDuration =
        !!productMeta.product_duration_max && !isNaN(productMeta.product_duration_max) ?
            parseInt(productMeta.product_duration_max) : "??";

    const ratesDate = !bookingFields.booking_exchange_rates_datestamp ? false : new Date(parseInt(bookingFields.booking_exchange_rates_datestamp) * 1000);
    const ratesDateLong = !ratesDate ? "" : `${ratesDate.getDate()}/${ratesDate.getMonth()} - ${ratesDate.getFullYear()}`;

    const getDKKprice = (price, currency) => {
        const rates = (!edit || updateCurrencies || !oldRates.DKK) ? exchangeRates : oldRates;
        if (!rates || !rates[currency]) return parseFloat(price);
        return parseInt(parseFloat(price) / rates[currency]);
    };

    const formStatusArr = formStatus.split("_");

    const toggleTax = e => {
        const taxfree = e.target.checked;
        setNoTax(taxfree);
    };


    const onDateTimeChange = () => {
        updateField("booking_datestamp", selectedTimeStamp / 1000);
        updateEndTime();
    };
    useEffect(onDateTimeChange, [hour, minute, selectedDate]);

    const onMount = () => {
        axios.get("https://api.exchangeratesapi.io/latest?base=DKK").then(res => {
            setExchangeRates(res.data.rates);
        });

        updateField("booking_speaker_name", speaker.post.post_title);

        if (pagetype === "product") updateField("booking_product", product.post_title);
    };
    useEffect(onMount, []);

    const onSpeakerProductChange = () => {
        if (edit) return;
        if (!!speaker) updateField("booking_relation_speaker", speaker.post.ID);
        if (!!product) {
            updateField("booking_relation_product", product.ID);
            updateField("booking_product", product.post_title);
            setProductPrice(productMeta.product_price);
            setFeeCustomer(parseInt(productMeta.product_price_with_fee) - parseInt(productMeta.product_price));
            const speakerPercentage = !!speakerMeta.speaker_fees_public ? parseInt(speakerMeta.speaker_fees_public[0].speaker_percentage) : 10;
            setFeeSpeaker(parseInt((speakerPercentage/100) * parseInt(productMeta.product_price)));
        }
    };
    useEffect(onSpeakerProductChange, [speaker, product]);

    const onEditBooking = () => {

        setCurrencyProduct(!bookingFields.booking_currency_product ? "DKK" : bookingFields.booking_currency_product);
        setCurrencyParticipants(!bookingFields.booking_currency_participants ? "DKK" : bookingFields.booking_currency_participants);
        setCurrencyTransport(!bookingFields.booking_currency_transport ? "DKK" : bookingFields.booking_currency_transport);
        setCurrencyFees(!bookingFields.booking_currency_fees ? "DKK" : bookingFields.booking_currency_fees);

        if (!edit) { // IF on speaker page, not editing booking
            setBookingStatus("booked");
            return;
        }

        // ---- PRICES ---------------------------------
        const priceProduct = bookingFields.booking_payment_product_local || bookingFields.booking_payment_product;
        const priceTransport = bookingFields.booking_payment_transport_local || bookingFields.booking_payment_transport;
        const priceParticipants = bookingFields.booking_payment_participants_fee_local || bookingFields.booking_payment_participants_fee;
        const speakerFee = bookingFields.booking_payment_speaker_fee_local;
        const customerFee = bookingFields.booking_payment_fee_local;
        const invoicePrice = bookingFields.booking_payment_invoicecost;
        const speakerPercentage = bookingFields.booking_speaker_fee_percentage;
        const customerPercentage = bookingFields.booking_customer_fee_percentage;

        if (!isNaN(priceProduct)) setProductPrice(parseFloat(priceProduct) || 0);
        if (!isNaN(priceTransport)) setTransportPrice(parseFloat(priceTransport) || 0);
        if (!isNaN(priceParticipants)) setParticipantsPrice(parseFloat(priceParticipants) || 0);
        if (!isNaN(invoicePrice)) setInvoiceFee(parseFloat(invoicePrice) || 0);

        if (bookingFields.booking_payment_fee_type === "percentage") {
            setFeeType("percentage");
            if(!isNaN(speakerPercentage)) setFeeSpeaker(parseFloat(speakerPercentage));
            if(!isNaN(customerPercentage)) setFeeCustomer(parseFloat(customerPercentage));
        } else {
            setFeeType("fixed");
            if (!isNaN(speakerFee)) setFeeSpeaker(parseFloat(speakerFee) || 0);
            if (!isNaN(customerFee)) setFeeCustomer(parseFloat(customerFee) || 0);
        }


        if (bookingFields.booking_exchange_rates) setOldRates(bookingFields.booking_exchange_rates);
        if (!bookingFields.booking_payment_tax || parseInt(bookingFields.booking_payment_tax) === 0) setNoTax(true);
        else setNoTax(false);

        // --------------------------------------------------

        if(!!bookingFields.booking_status) setBookingStatus(bookingFields.booking_status);

        const datestamp = bookingFields.booking_datestamp;
        if (!!datestamp){
            const d = new Date(1000 * (parseInt(datestamp)));
            const dateWithTime = new Date( d.getTime());
            const date = new Date(dateWithTime.getFullYear(), dateWithTime.getMonth() , dateWithTime.getDate());
            setHour(("0"+dateWithTime.getHours()).slice(-2));
            setMinute(("0"+dateWithTime.getMinutes()).slice(-2));
            setSelectedDate(date);
        }

    };
    useEffect(onEditBooking, [bookingFields, bookingId]);

    const doSubmit = () => {
        if (stage < 3 && !edit) {
            setStage(stage + 1);
            return;
        }

        dispatchStatus({type: "addConnection"});

        const dkkProductPrice = getDKKprice(productPrice, currencyProduct);
        const dkkTransportPrice = getDKKprice(transportPrice, currencyTransport);
        const dkkParticipantsPrice = getDKKprice(participantsPrice, currencyParticipants);

        // DATA
        let postData = {
            booking_origin_url: bookingFields.booking_origin_url || window.location.href,
            ...bookingFields,
            booking_datestamp: selectedTimeStamp / 1000 - TimezoneOffset * 60,
            booking_payment_product: dkkProductPrice,
            booking_payment_transport: dkkTransportPrice,
            booking_payment_participants_fee: dkkParticipantsPrice,
            booking_payment_fee_type : feeType,
            booking_payment_fee: feeType === "percentage" ?
                (parseInt(feeCustomer) / 100) * dkkProductPrice : getDKKprice(feeCustomer, currencyFees),
            booking_payment_speaker_fee_product: feeType === "percentage" ?
                (parseInt(feeSpeaker) / 100) * (dkkProductPrice): getDKKprice(feeSpeaker, currencyFees),
            booking_payment_speaker_fee_participants: feeType === "percentage" ?
                (parseInt(feeSpeaker) / 100) * (dkkParticipantsPrice): 0,
            booking_payment_invoicecost: invoiceFee,
            booking_status: bookingStatus,
            booking_payment_taxfree: noTax
        };
        if (!edit) postData.booking_type = "quickbooking";
        if (edit) postData.booking_relation_booking = edit;

        if (sameAddress) {
            postData = {
                ...postData,
                booking_company_address1 : bookingFields.booking_location_address1,
                booking_company_zip : bookingFields.booking_location_zip,
                booking_company_city : bookingFields.booking_location_city,
            }
        }

        if (feeType === "percentage") {
            postData.speaker_fee_percentage = feeSpeaker;
            postData.customer_fee_percentage = feeCustomer;
        }

        const feeLocal = feeType === "percentage" ? (parseInt(feeCustomer) / 100) * parseInt(productPrice) : parseFloat(feeCustomer);
        const speakerFeeLocalProduct = feeType === "percentage" ? (parseInt(feeSpeaker) / 100) * parseInt(productPrice): parseFloat(feeSpeaker);
        const speakerFeeLocalParticipants = feeType === "percentage" ? (parseInt(feeSpeaker) / 100) * parseInt(participantsPrice) : 0;

        postData.booking_payment_product_local = productPrice;
        postData.booking_payment_transport_local = transportPrice;
        postData.booking_payment_participants_fee_local = participantsPrice;

        postData.booking_payment_fee_local = feeLocal;
        postData.booking_payment_speaker_fee_product_local = speakerFeeLocalProduct;
        postData.booking_payment_speaker_fee_participants_local = speakerFeeLocalParticipants;


        if (currencyTransport !== "DKK" || currencyProduct !== "DKK" || currencyFees !== "DKK" || currencyParticipants !== "DKK") {

            postData.booking_has_foreign_currency = true;
            if(!edit || updateCurrencies || !bookingFields.booking_has_foreign_currency) {
                postData.booking_exchange_rates = exchangeRates;
                postData.booking_exchange_rates_datestamp = today / 1000;
            }
            postData.booking_currency_product = currencyProduct;
            postData.booking_currency_transport = currencyTransport;
            postData.booking_currency_fees = currencyFees;
            postData.booking_currency_participants = currencyParticipants;
        }


        // POST
        postBooking(postData).then(res => {
            if (edit){
                setUpdateSuccess(1);
                reload();
            }
            else setFormStatus("success_request");
        }).catch(() => {
            if (edit) setUpdateSuccess(-1);
            else setFormStatus("error_unexpected");
        }).finally(() => dispatchStatus({type: "removeConnection"}));
    };

    const Stage1 = () => <>
        <>
            <div className="col-12">
                <div className={"booking-input-title mb-3"}>
                    <FaInfoCircle className="booking-icon"/>Produkt
                </div>
            </div>

            <div className="col-12 mb-2">
                <TextInput
                    name={"booking_product"}
                    label={"Produktnavn"}
                    placeholder={"Skriv nyt produktnavn..."}
                    onChange={val => {
                        updateField("booking_product", val);
                    }}
                    value={bookingFields.booking_product}
                    required={true}
                />
            </div>

            <div className="col-12 mb-2">
                <TextInput
                    required={true}
                    name={"booking_speaker_name"}
                    label={"Speakernavn"}
                    placeholder={"Skriv nyt speakernavn..."}
                    onChange={val => {
                        updateField("booking_speaker_name", val);
                    }}
                    value={bookingFields.booking_speaker_name}
                />
            </div>

            <div className="col-12 col-sm-6 col-lg-12 col-xl-6 mb-2">
                <TextInput
                    label={"Ny Speaker email"}
                    onChange={val => {
                        updateField("booking_speaker_email", val);
                    }}
                    value={bookingFields.booking_speaker_email}
                />
            </div>

            <div className="col-12 col-sm-6 col-lg-12 col-xl-6 mb-2">
                <TextInput
                    label={"Ny Speaker Tlf."}
                    onChange={val => {
                        updateField("booking_speaker_phone", val);
                    }}
                    value={bookingFields.booking_speaker_phone}
                />
            </div>
        </>


        <>
            <div className="col-12">
                <div className={"booking-input-title mb-3"}>
                    <FaMoneyBill className="booking-icon"/>Pris
                </div>
            </div>

            <div className="col-12 col-sm-8 col-lg-12 col-xl-8 mb-2">
                <NumberInput
                    required={true}
                    name={"booking_payment_product"}
                    label={"Kundens pris"}
                    onChange={val => {
                        setProductPrice(val)
                    }}
                    value={productPrice}
                />
            </div>

            <div className={`col-12 col-sm-4 col-lg-12 col-xl-4 mb-2`}>
                <Dropdown
                    className={"mt-4"}
                    onChange={(x) => {
                        setCurrencyProduct(x.value);
                    }}
                    options={currencies}
                    selected={currencyProduct || "DKK"}
                />
            </div>

            <div className="col-12 col-sm-8 col-lg-12 col-xl-8 mb-2">
                <NumberInput
                    name={"booking_payment_transport"}
                    label={"Transportpris"}
                    onChange={val => {
                        setTransportPrice(val)
                    }}
                    value={transportPrice}
                />
            </div>

            <div className={`col-12 col-sm-4 col-lg-12 col-xl-4 mb-2`}>
                <Dropdown
                    className={"mt-4"}
                    onChange={(x) => {
                        setCurrencyTransport(x.value);
                    }}
                    options={currencies}
                    selected={currencyTransport || "DKK"}
                />
            </div>

            <div className="col-12 col-sm-8 col-lg-12 col-xl-8 mb-2">
                <NumberInput
                    name={"booking_payment_participants_fee"}
                    label={"Ekstra deltagere"}
                    onChange={val => {
                        setParticipantsPrice(val);
                    }}
                    value={participantsPrice}
                />
            </div>

            <div className={`col-12 col-sm-4 col-lg-12 col-xl-4 mb-2`}>
                <Dropdown
                    className={"mt-4"}
                    onChange={(x) => {
                        setCurrencyParticipants(x.value);
                    }}
                    options={currencies}
                    selected={currencyParticipants || "DKK"}
                />
            </div>


            <div className="col-12 col-sm-6 col-lg-12 col-xl-6 my-2">
                <div className={"input-label clearfix text-left"}>Gebyrer</div>
                <span className="pr-3">
                        <Radio color={'primary'}
                               classes={{
                                   root: 'text-secondary',
                                   checked: 'text-success'
                               }}
                               checked={feeType === "fixed"}
                               onChange={e => {
                                   setFeeType(e.target.value);
                               }}
                               value={"fixed"}
                               name={"fixed"}
                               aria-label={"fixed"}
                        />Fixed
                    </span>
                <span className="pr-3">
                        <Radio color={'primary'}
                               classes={{
                                   root: 'text-secondary',
                                   checked: 'text-success'
                               }}
                               checked={feeType === "percentage"}
                               onChange={e => {
                                   setFeeType(e.target.value);
                               }}
                               value={"percentage"}
                               name={"percentage"}
                               aria-label={"percentage"}
                        /> %
                    </span>
            </div>

            <div className={`col-12 col-sm-3 col-lg-12 col-xl-3 my-2`}>
                <Dropdown
                    className={"mt-4"}
                    onChange={(x) => {
                        setCurrencyFees(x.value);
                    }}
                    options={currencies}
                    selected={currencyFees || "DKK"}
                />
            </div>

            <div className={`col-12 col-sm-3 col-lg-12 col-xl-3 my-2`}>
                <div className="form-check mt-4">
                    <input type="checkbox" className="form-check-input" checked={noTax} onChange={toggleTax}/>
                    <label className="form-check-label"> Momsfri</label>
                </div>
            </div>


            <div className="col-12 col-sm-4 col-lg-12 col-xl-4 mb-2">
                <NumberInput
                    label={`Speaker fee ${feeType === "fixed" ? currencyFees : "%"}`}
                    onChange={val => {
                        setFeeSpeaker(val)
                    }}
                    value={feeSpeaker}
                />
                <div><small>Fratrækkes speaker</small></div>
            </div>

            <div className="col-12 col-sm-4 col-lg-12 col-xl-4 mb-2">
                <NumberInput
                    label={`Customer fee ${feeType === "fixed" ? currencyFees : "%"}`}
                    onChange={val => {
                        setFeeCustomer(val)
                    }}
                    value={feeCustomer}
                />
                <div><small>Betales af kunden</small></div>
            </div>

            <div className="col-12 col-sm-4 col-lg-12 col-xl-4 mb-2">
                <NumberInput
                    label={"Fakturagebyr DKK"}
                    onChange={val => {
                        setInvoiceFee(val)
                    }}
                    value={invoiceFee}
                />
            </div>

            {
                !edit &&
                <div className="col-12">
                    <button className={`btn btn-success w-100`} type="button" onClick={doSubmit}>Videre</button>
                </div>
            }


        </>
    </>;

    const Stage2 = () => <>
        <>
            <div className="col-12">
                <div className={"booking-input-title mb-3"}>
                    <FaMapMarker className="booking-icon"/>Lokation
                </div>
            </div>

            <div className="col-12 mb-2">
                <TextInput
                    name={"booking_location_name"}
                    label={"Evt. navn på afholdelsessted"}
                    placeholder={"Eks. Gentofte Hotel"}
                    onChange={val => {
                        updateField("booking_location_name", val);
                    }}
                    value={bookingFields.booking_location_name}
                />
            </div>

            <div className="col-12 mb-2">
                <TextInput
                    name={"booking_location_address1"}
                    label={"Gadenavn og husnr."}
                    placeholder={"Eks. Gentoftegade 29"}
                    onChange={val => {
                        updateField("booking_location_address1", val);
                    }}
                    value={bookingFields.booking_location_address1}
                />
            </div>

            <div className={`col-12 col-sm-6 col-lg-12 col-xl-6 mb-2`}>
                <TextInput
                    required={true}
                    name={"booking_location_zip"}
                    label={"Postnr."}
                    placeholder={"Eks. 2820"}
                    onChange={val => {
                        updateField("booking_location_zip", val);
                    }}
                    value={bookingFields.booking_location_zip}
                />
            </div>

            <div className={`col-12 col-sm-6 col-lg-12 col-xl-6 mb-2`}>
                <TextInput
                    name={"booking_location_city"}
                    label={"By"}
                    placeholder={"Eks. Gentofte"}
                    onChange={val => {
                        updateField("booking_location_city", val)
                    }}
                    value={bookingFields.booking_location_city}
                />
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

            <div className="col">
                <DatePicker
                    className="date-picker"
                    canClearSelection={false}
                    inline
                    selected={selectedDate}
                    minDate={today}
                    maxDate={todayPlusOneYear}
                    onChange={(date, change) => {
                        if (change) setSelectedDate(date);
                    }}
                />
            </div>


            <div className="col h-100 m-auto">

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

                <NumberInput
                    label={"Varighed i minutter"}
                    required={true}
                    step={5}
                    aria-label={"timer"}
                    value={bookingFields.booking_duration}
                    inputClass={"text-center"}
                    onChange={value => {
                        updateField("booking_duration", value);
                        updateEndTime();
                    }}
                />
                <div className={"input-label clearfix text-right"}>({minDuration} - {maxDuration})</div>

                <div className="row">
                    <NumberInput
                        className={"col-6 p-0"}
                        label={"min. deltagere"}
                        required={true}
                        step={1}
                        aria-label={"min. deltagere"}
                        value={bookingFields.booking_info_participants_min || ""}
                        inputClass={"text-center"}
                        onChange={value => {
                            updateField("booking_info_participants_min", value);
                        }}
                    />
                    <NumberInput
                        className={"col-6 p-0"}
                        label={"max deltagere"}
                        required={true}
                        step={1}
                        aria-label={"max deltagere"}
                        value={bookingFields.booking_info_participants_max || ""}
                        inputClass={"text-center"}
                        onChange={value => {
                            updateField("booking_info_participants_max", value);
                        }}
                    />
                </div>

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
                    onChange={val => {
                        updateField("booking_company_name", val)
                    }}
                    value={bookingFields.booking_company_name}
                />
            </div>

            <div className="col-12 col-sm-6 col-lg-12 col-xl-6 mb-2">
                <TextInput
                    required={true}
                    name={"booking_customer_name"}
                    label={"Kontaktperson"}
                    placeholder={"Eks. Maybritt Toft Bisp"}
                    onChange={val => {
                        updateField("booking_customer_name", val)
                    }}
                    value={bookingFields.booking_customer_name}
                />
            </div>

            <div className="col-12 col-sm-6 col-lg-12 col-xl-6 mb-2">
                <TextInput
                    required={true}
                    name={"booking_customer_phone"}
                    label={"Telefon nummer"}
                    placeholder={"Eks. +4570200449"}
                    onChange={val => {
                        updateField("booking_customer_phone", val)
                    }}
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
                    onChange={val => {
                        updateField("booking_customer_email", val)
                    }}
                    value={bookingFields.booking_customer_email}
                />
            </div>

            {
                !edit &&
                <>
                    <div className="col-6">
                        <button className={`btn btn-dark w-100`} type="button" onClick={() => {
                            setStage(stage - 1)
                        }}>Forrige
                        </button>
                    </div>

                    <div className="col-6">
                        <button className={`btn btn-success w-100`} type="button" onClick={doSubmit}>Videre</button>
                    </div>
                </>
            }

        </>
    </>;

    const Stage3 = () => <>
        <>
            <div className="col-12">
                <div className={"booking-input-title mb-3"}>
                    <FaBuilding className="booking-icon"/>Firmadetaljer
                </div>
            </div>

            <div className="col-12 mb-2">
                <div className="form-check">
                    <input type="checkbox" className="form-check-input" checked={sameAddress} onChange={toggleSameAddress}/>
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
                    onChange={val => {
                        updateField("booking_company_cvr", val)
                    }}
                    value={bookingFields.booking_company_cvr}
                />
            </div>

            <div className="col-12 col-sm-6 col-lg-12 col-xl-6 mb-2">
                <TextInput
                    name={"booking_accounting_ean"}
                    label={"EAN nummer"}
                    placeholder={"Eks. 7384756382912"}
                    onChange={val => {
                        updateField("booking_accounting_ean", val)
                    }}
                    value={bookingFields.booking_accounting_ean}
                />
            </div>
        </>



        <> {/* --------------- ANDLEDNING --------------- */}
            <div className="col-12">
                <div className={"booking-input-title my-3"}>
                    <FaQuestionCircle className="booking-icon"/>Andledning
                </div>
            </div>


            <div className="col-12 mb-2">
                <TextInput
                    placeholder={"Skriv anledning..."}
                    onChange={val => {updateField("booking_info_purpose", val)}}
                    value={bookingFields.booking_info_purpose}
                />
            </div>

        </>


        <>  {/* --------------- MÅLGRUPPE ---------- */}
            <div className="col-12">
                <div className={"booking-input-title my-3"}>
                    <FaUserCheck className="booking-icon"/>Målgruppe
                </div>
            </div>

            <div className="col-12 mb-2">
                <TextInput
                    placeholder={"Skriv målgruppe..."}
                    onChange={val => {updateField("booking_info_targetgroup", val)}}
                    value={bookingFields.booking_info_targetgroup}
                />
            </div>

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


        <>
            <div className="col-12">
                <div className={"booking-input-title my-3"}>
                    <FaComment className="booking-icon"/>Kommentarer til bookingen
                </div>
            </div>

            <div className="col-12 mb-2">
                <TextArea
                    rows={6}
                    name={"booking_info_notes"}
                    placeholder={"Her kan du skrive en kommentar til din booking..."}
                    onChange={val => {
                        updateField("booking_info_notes", val)
                    }}
                    value={bookingFields.booking_info_notes}
                />
            </div>
        </>



        <div className="col-12">
            <div className="row my-3">
                <div className="col-2">
                    Status:
                </div>

                <div className="col-10">
                    <Dropdown
                        onChange={(x) => {
                            setBookingStatus(x.value)
                        }}
                        options={edit ? editStatusOptions : bookingStatusOptions}
                        selected={bookingStatus}
                    />
                </div>
            </div>
        </div>

        {
            !edit &&
            <>
                <div className="col-6">
                    <button className={`btn btn-dark w-100`} type="button" onClick={() => {
                        setStage(stage - 1)
                    }}>Forrige
                    </button>
                </div>

                <div className="col-6">
                    <button className={`btn btn-success w-100`} type="button" onClick={doSubmit}>Indsend</button>
                </div>
            </>
        }

    </>;


    const prices =
        <AdminPriceTable
            bookingFields={bookingFields}
            cached={false}
            currencyProduct={currencyProduct}
            currencyParticipants={currencyParticipants}
            currencyTransport={currencyTransport}
            currencyFees={currencyFees}
            getDKKprice={getDKKprice}
            priceProduct={productPrice}
            priceTransport={transportPrice}
            feeSpeaker={feeSpeaker}
            feeCustomer={feeCustomer}
            feeParticipants={participantsPrice}
            feeInvoice={invoiceFee}
            noTax={noTax}
            feeType={feeType}
        />;

    const cachedPrices = (
      <AdminPriceTable
          bookingFields={bookingFields}
          cached={true}
          currencyProduct={!bookingFields.booking_currency_product ? "DKK" : bookingFields.booking_currency_product}
          currencyParticipants={!bookingFields.booking_currency_participants ? "DKK" : bookingFields.booking_currency_participants}
          currencyTransport={!bookingFields.booking_currency_transport ? "DKK" : bookingFields.booking_currency_transport}
          currencyFees={!bookingFields.booking_currency_fees ? "DKK" : bookingFields.booking_currency_fees}
          getDKKprice={getDKKprice}
          priceProduct={parseFloat(bookingFields.booking_payment_product_local || bookingFields.booking_payment_product)}
          priceTransport={parseFloat(bookingFields.booking_payment_transport_local || bookingFields.booking_payment_transport)}
          feeSpeaker={parseFloat(bookingFields.booking_payment_speaker_fee_local || bookingFields.booking_payment_speaker_fee)}
          feeCustomer={parseFloat(bookingFields.booking_payment_fee_local || bookingFields.booking_payment_fee)}
          feeParticipants={parseFloat(bookingFields.booking_payment_participants_fee_local || bookingFields.booking_payment_participants_fee)}
          feeInvoice={parseFloat(bookingFields.booking_payment_invoicecost)}
          totalExMoms={parseFloat(bookingFields.booking_payment_pretax)}
          taxTotal={parseFloat(bookingFields.booking_payment_tax)}
          feeNoTax={parseFloat(bookingFields.booking_payment_fee_notax)}
          total={parseFloat(bookingFields.booking_payment_total)}
          speakerPayment={parseFloat(bookingFields.booking_payment_speaker_pretax)}
          noTax={noTax}
          feeType={feeType}
      />
    );

    return (
        <>
            {!edit && <>
                <h3>ADMIN BOOKING</h3>
                <div className="row">
                    <div className={"col-12"}>
                        {prices}
                    </div>
                </div>
            </>
            }
            <form
                onSubmit={e => {e.preventDefault();}}
            >
                {
                    formStatusArr.length === 2 ?
                        <BookingStatus formStatusArr={formStatusArr} setFormStatus={setFormStatus}
                                       setStageNumber={setStage}/>
                        :
                        edit ?
                            <>
                                <Notification type={updateSuccess === 1 ? "success" : "warning"} open={updateSuccess !== 0} onClose={() => setUpdateSuccess(0)}>
                                    {
                                        updateSuccess === 1 ? "Booking opdateret!" : "Fejl! Kunnne ikke opdatere booking"
                                    }
                                </Notification>
                            <div className="row my-3 border-bottom border-light">

                                <div className="col-12 text-center">
                                    <button className={`btn btn-outline-light px-5 mr-4 mb-4`} onClick={closeOverlay} type="button">Annullér</button>
                                    <button className={`btn btn-success px-5 mb-4`} type="button" onClick={doSubmit}>Gem ændringer</button>
                                </div>
                                <div className="col">
                                    <div className="row">
                                        <Stage1/>
                                        <div className="col-12 mt-4">
                                            {
                                                !!bookingFields.booking_has_foreign_currency &&
                                                <div>
                                                    {
                                                        updateCurrencies ?
                                                        <button type="button" className="btn btn-sm btn-warning mb-2 mr-3" onClick={() => setUpdateCurrencies(false)}>
                                                            Anullér opdatering
                                                        </button>
                                                        :
                                                        <button type="button" className="btn btn-sm btn-light mb-2 mr-3" onClick={() => setUpdateCurrencies(true)}>
                                                            Opdater Valutakurser
                                                        </button>
                                                    }
                                                    Kurser fra d. {updateCurrencies ? todayLong : ratesDateLong}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="row">
                                        <Stage2/>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="row"><Stage3/></div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <h5>NYE PRISER</h5>
                                    {prices}
                                </div>
                                <div className="col">
                                    <div className="col-12">
                                        <div className="bg-light-grey">
                                            <h5>GEMTE PRISER</h5>
                                            {cachedPrices}
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <h5>ECONOMIC</h5>
                                    <h6>Obs! benytter gemte priser</h6>
                                    <EconomicActionsView noTax={noTax} fees={fees} economicSecret={economicSecret} bookingFields={bookingFields} updateField={updateField}/>
                                </div>
                            </div>
                            </>
                            :
                            stage === 1 ?
                                <div className="row"><Stage1/></div> :
                                    stage === 2 ?
                                        <div className="row"><Stage2/></div>
                                        : <div className="row"><Stage3/></div>
                }
            </form>
        </>
    );
};

export default AdminBookingForm;
