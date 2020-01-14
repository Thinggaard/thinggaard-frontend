import React, {useContext, useEffect, useState} from 'react';
import {getTimeFromStamp} from "../../functions/DateTimeFunctions";
import Stage1 from "./stages/Stage1";
import {getTransportPrice, postBooking} from "../../functions/bookingFunctions";
import Stage2 from "./stages/Stage2";
import Stage3 from "./stages/Stage3";
import Price from "../Utility/Price";
import BookingStatus from "./BookingStatus";
import queryString from "query-string";
import Notification from "../Status/Notification";
import {StatusContext} from "../../store/Store";

const today = new Date(new Date().getFullYear(), new Date().getMonth() , new Date().getDate());
const TimezoneOffset = new Date().getTimezoneOffset(); // -120 minutes in DK summertime


const getParticipantsFee = (selectedIndex, appetizer) => {
    if (selectedIndex < 0) return 0;
    if (appetizer) return Math.min(selectedIndex, 5)*1000;
    switch (selectedIndex) {
        case 5:
            return 5000;
        case 6:
            return 10000;
        default:
            return 0;
    }
};

export default (props) => {
    const {
        speaker, product,
        pagetype,
        updateField, bookingFields,
        selectedProduct, bookingId, setBookingId,
        stageNumber, setStageNumber,
        transportPrice, setTransportPrice,
        setType,
        logBookingEvent,
    } = props;

    const productMeta = product.meta || {};
    const speakerMeta = !!speaker.post ? speaker.post.meta :  {};

    const [selectedDate, setSelectedDate] = useState(today);
    const [hour, setHour] = useState("");
    const [minute, setMinute] = useState("");
    const [endTime, setEndTime] = useState("");
    const [participantsSelection, setParticipantsSelection] = useState(-1);
    const [region, setRegion] = useState(-1);
    const [participantsFee, setParticipantsFee] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("creditcard");
    const [formStatus, setFormStatus] = useState("");
    const [productPrice, setProductPrice] = useState(0);
    const [regionSelected, setRegionSelected] = useState(false);
    const [regionAvailability, setRegionAvailability ] = useState(true);
    const [paymentError, setPaymentError] = useState(false);
    const [stripeSubmit, setStripeSubmit] = useState(false);

    const [, dispatchStatus] = useContext(StatusContext);

    const regionChange = (reg) => {
        setRegionSelected(reg !== -1);
        setRegion(reg);
        updateTransport(reg === -1 ? bookingFields.booking_location_zip : null, reg);
        updateField("booking_location_region", reg);
    };

    const participantOptions =  productMeta.product_appetizer ?
        [[1, 50], [50, 60], [60, 70], [70, 80], [80, 90], [90, 100],]
        : [[1, 10], [10, 25], [25, 50], [50, 100], [100, 250], [250, 500], [500, null]];

    const printParticipantOptions = () => {
        return participantOptions.map((option, i) => {
            return {value: i, label: `${option[0]} ${!!option[1] ? " - " + option[1] : "+"}`}
        });
    };

    const updateTransport = (zip=null, reg=null) => {
        if (speakerMeta.speaker_transport_price_varies){
            setTransportPrice(0);
            return;
        }
        if (zip!==null || reg!==null) {
            const fromRegion = !!speakerMeta.speaker_region_home ? speaker.post.meta.speaker_region_home.value : 1;
            const fromZip = speakerMeta.speaker_zip;
            if (!zip || isNaN(zip) || zip.length !== 4) {
                zip = null;
                if (!reg) return;
                if (reg === -1){
                    setTransportPrice(0);
                    return;
                }
            }
            if(reg === -1) reg = null;

            setTransportPrice(-1);

            getTransportPrice(product.ID, fromZip, zip, fromRegion, reg).then(result => {
                setTransportPrice(parseFloat(result.price) + parseFloat(result.price_toll));
                setRegion(result.to_region);
            }).catch(err => console.log(err));

        } else {
            setTransportPrice(0);
        }
    };

    const onRegionChange = () => {
        let available = false;
        if (region === -1) available = true;
        else if (productMeta.product_appetizer) {
            const availableRegions = speakerMeta.speaker_region_teaser;
            availableRegions.forEach(reg => {
                if (reg.value + "" === region + "") {
                    available = true;
                }
            });
        } else available = true;
        setRegionAvailability(available);
    };
    useEffect(onRegionChange, [region, product]);

    const selectedTimeStamp =
        (hour*60*60*1000) +
        (minute*60*1000) +
        selectedDate.getTime();

    const afterPayment = () => {
        const postData = {
            ...bookingFields,
            booking_payment_type: "creditcard",
            booking_status : bookingFields.booking_status === "confirmed" ? "booked" : "prebooked",
        };

        delete postData.booking_datestamp;

        dispatchStatus({type: "addConnection"});
        postBooking(postData).then(res => {
            setFormStatus("success_payment");
            logBookingEvent("complete", postData);
        }).catch(err => {
            console.log(err);
            setFormStatus("error_unexpected");
        }).finally(() => {
            dispatchStatus({type: "removeConnection"});
            setStripeSubmit(false);
            window.history.replaceState(null, "YOUANDX", window.location.href.split("?")[0] );
        });
    };

    const onProvidedBooking = () => {
        if (bookingId === 0) return;

        const bookingType = bookingFields.booking_type;
        setType(bookingType === "quickbooking" ? "quickbooking" : "booking");

        const status = bookingFields.booking_status;
        const parsed = queryString.parse(window.location.search);
        if (parsed.cosuccess === "1"){
            setStageNumber(3);
            afterPayment();
        } else if (parsed.cosuccess === "0"){
            setStageNumber(3);
            setPaymentError(true);
        } else if (status === "initiated" || status === "confirmed") setStageNumber(2);
        else setStageNumber(1);

        if (!bookingFields.booking_location_zip && !isNaN(bookingFields.booking_location_region)) setRegionSelected(true);
        updateTransport(bookingFields.booking_location_zip, parseInt(bookingFields.booking_location_region));

        const datestamp = bookingFields.booking_datestamp;
        if (!!datestamp){
            const d = new Date(1000 * (parseInt(datestamp)));
            const dateWithTime = new Date( d.getTime());
            const date = new Date(dateWithTime.getFullYear(), dateWithTime.getMonth() , dateWithTime.getDate());
            setHour(("0"+dateWithTime.getHours()).slice(-2));
            setMinute(("0"+dateWithTime.getMinutes()).slice(-2));
            setSelectedDate(date);
        }
        const bookingParticipantsFee = bookingFields.booking_payment_participants_fee;
        if (!!bookingParticipantsFee) setParticipantsFee(bookingParticipantsFee);

        const minParticipants = bookingFields.booking_info_participants_min;
        let participantsSelect = -1;
        if (!!minParticipants) participantOptions.forEach((x, i) => {
            if (parseInt(minParticipants) === x[0]) participantsSelect = i;
        });
        setParticipantsSelection(participantsSelect);
    };
    useEffect(onProvidedBooking, [bookingId]);

    const updateEndTime = () => setEndTime(getTimeFromStamp(selectedTimeStamp+parseInt(bookingFields.booking_duration)*60*1000));

    const onDateTimeChange = () => {
        updateField("booking_datestamp", selectedTimeStamp/1000);
        updateEndTime();
    };
    useEffect(onDateTimeChange, [hour, minute, selectedDate]);

    const onSpeakerProductChange = () => {
        if (!!speaker) updateField("booking_relation_speaker", speaker.post.ID);
        if (!!selectedProduct && pagetype === "speaker")  updateField("booking_relation_product", selectedProduct);
        else if (!!product) updateField("booking_relation_product", product.ID);
        setParticipantsSelection(-1);
    };
    useEffect(onSpeakerProductChange, [speaker, product, selectedProduct]);

    const onParticipantsUpdate = () => {
        const fee = getParticipantsFee(participantsSelection, productMeta.product_appetizer);
        if (fee !== participantsFee) setParticipantsFee(fee);
    };
    useEffect(onParticipantsUpdate, [participantsSelection]);

    const getProductPrice = () => {

        let productPrice = product.meta.product_price_with_fee;

        const prices = product.meta.product_price_regions;
        const reg = parseInt(region);
        if (!!prices && reg > 0) {
            prices.forEach(price => {
                if (!!price.region)
                    price.region.forEach(priceRegion => {
                        if (reg === parseFloat(priceRegion.value)) {
                            productPrice = price.price_with_fee;
                        }
                    })
            });
        }
        setProductPrice(parseFloat(productPrice));
    };
    useEffect(getProductPrice, [product, region]);

    const stagesProps = {
        ...props,
        formStatus, setFormStatus,
        participantOptions, printParticipantOptions,
        participantsSelection, setParticipantsSelection,
        participantsFee,
        endTime, updateEndTime,
        hour, setHour,
        minute, setMinute,
        TimezoneOffset,
        selectedDate, setSelectedDate,
        transportPrice, updateTransport,
        stageNumber, setStageNumber,
        region, setRegion : regionChange, regionSelected, regionAvailability,
        paymentMethod, setPaymentMethod,
        stripeSubmit, setStripeSubmit,
        logBookingEvent,
    };

    const renderForm = () => {

        const formStatusArr = formStatus.split("_");

        if (formStatusArr.length === 2) return (
          <BookingStatus formStatusArr={formStatusArr} setFormStatus={setFormStatus} setStageNumber={setStageNumber} setBookingId={setBookingId}/>
        );

        switch(stageNumber) {
            case 3 :
                return (
                    <Stage3 {...stagesProps}/>
                );
            case 2 :
                return (
                    <Stage2 {...stagesProps}/>
                );
            default :
                return (
                    <Stage1 {...stagesProps}/>
                );
        }
    };

    const invoiceCost = paymentMethod === "invoice" ? 275 : 0;
    const totalExMoms = productPrice + parseFloat(transportPrice) + parseFloat(participantsFee) + invoiceCost;
    const taxTotal = totalExMoms/4;

    return (
        <>
            <Notification
                open={paymentError}
                type={"warning"}
                onClose={() => setPaymentError(false)}
            >
                Der optsod en fejl under betaling. Prøv igen eller vælg faktura.
            </Notification>
            <table className="table table-sm table-dark table-borderless w-100 mb-5 bg-transparent">
                <thead>
                    <tr>
                        <th><h5>Din pris</h5></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Foredragets pris:</td>
                        <td className={"text-right"}><Price price={productPrice}/></td>
                    </tr>
                    <tr>
                        <td>Transport: </td>
                        {
                            speakerMeta.speaker_transport_price_varies ?
                                <td className="text-right">Varierende pris</td> :
                                <td className={"text-right"}>{transportPrice < 0 ? "..." : <Price price={transportPrice}/>}</td>
                        }
                    </tr>
                    { participantsFee !== 0 &&
                        <tr>
                            <td>Ekstra deltagere:</td>
                            <td className={"text-right"}><Price price={participantsFee}/></td>
                        </tr>
                    }
                    { paymentMethod === "invoice" &&
                        <tr>
                            <td>Fakturagebyr:</td>
                            <td className={"text-right"}><Price price={275}/></td>
                        </tr>
                    }
                    <tr className="border-primary border-top">
                        <td>I alt:</td>
                        <td className={"text-right"}>
                            <Price tax={-1} price={totalExMoms} />
                        </td>
                    </tr>
                    <tr>
                        <td>25% moms :</td>
                        <td className={"text-right"}>
                            <Price price={taxTotal} />
                        </td>
                    </tr>
                    <tr>
                        <th>Total:</th>
                        <th className={"text-right"}>
                            <Price tax={1} price={totalExMoms + taxTotal} />
                            {
                                speakerMeta.speaker_transport_price_varies &&
                                <div>+ transport</div>
                            }
                        </th>
                    </tr>
                </tbody>
            </table>

            {renderForm()}
        </>
    );

}