// File created : 29-03-2019 15:38
import React, {Component} from 'react';
import axios from 'axios';
import {API, TOKEN} from "../../constants";
import Overlay from "./Overlay";
import './Overlay.css';
import Dropdown from "../Form/Dropdown";
import {Link, Redirect} from "react-router-dom";
import cities from '../../data/cities';
import Modal from "@material-ui/core/Modal";
import Slider from "@material-ui/lab/Slider"
import Radio from "@material-ui/core/Radio";
import ChipSelector from "../Form/ChipSelector";
import queryString from "query-string";
import CitySelect from "../Form/CitySelect";
import ListItem from "../Lists/ListItem";
import NumberFormat from "react-number-format";
import moment from "moment-timezone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Checkout from "../Stripe/Checkout";
import Notification from "../Status/Notification";
import Spinner from "../Status/Spinner";
import ReactGa from 'react-ga';
import ReactPixel from 'react-facebook-pixel';
import LoadingModal from "../Status/LoadingModal";
import PaymentErrorOverlay from "../Stripe/PaymentErrorOverlay";
import ProductTypePopOver from "../PostBox/ProductTypePopOver";
import TextInput from "../Form/TextInput";
import {
    FaArrowLeft,
    FaBuilding,
    FaCalendar,
    FaCheck,
    FaClock,
    FaInfoCircle,
    FaLanguage,
    FaMapMarkerAlt,
    FaMoneyBill,
    FaQuestionCircle,
    FaUserCheck,
    FaUsers
} from "react-icons/fa";

const ga = ReactGa.ga;

class BookingOverlay extends Component {
    initialState = {
        bookingType: this.props.type,
        isPosting: false,
        missingFields: false,

        product: this.props.product,
        stage: this.props.stage,
        maxStage: 3,
        selectedProduct: null,
        showAlternativeProducts: false,
        redirect: "",

        stage1Confirmation: false,
        newBookingId: null,
        newBookingToken: null,
        stage1Error: false,

        transportPrice: 0,
        region: null,
        cityInput: "",
        city: "",
        zip: "",
        availableCities: cities.DK,
        cityMatches: [],
        regionOptions: [
            {value: 1, label: "Storkøbenhavn"},
            {value: 2, label: "Sjælland"},
            {value: 3, label: "Fyn"},
            {value: 4, label: "Jylland Syd"},
            {value: 5, label: "Jylland Midt"},
            {value: 6, label: "Jylland Nord"},
        ],
        cityHover: -1,
        regionAvailability: true,

        userAgreement: false,


        startTime: "",
        timeError: false,

        weekday: -1,
        year: 2019,
        date: ["DD", "MM"],
        dateLong: undefined,
        timestamp: null,
        dateSelect: false,

        booker_companyName: "",
        booker_name: "",
        booker_phone: "",
        booker_email: "",
        booker_message: "",


        //Stage 2
        stage2Error: false,
        durationInMinutes: 30,
        durationSetInBooking: false,
        product_duration_min: null,
        product_duration_max: null,
        min_start: 540,
        max_start: 1200,
        startTimeMinutes: 540,

        languages: [],
        selectedLanguage: 0,

        occasionList: ["Medarbejdermøde", "Ledermøde", "Medlemsarrangement", "Strategidag", "Kundearrangement", "Firmafest", "Andet"],
        occasions: [],
        addOccasion: false,
        customOccasion: "",

        participantOptions: [
            [1, 10],
            [10, 25],
            [25, 50],
            [50, 100],
            [100, 250],
            [250, 500],
            [500, "+"]
        ],
        appetizerParticipantOptions: [
            [1, 50],
            [50, 60],
            [60, 70],
            [70, 80],
            [80, 90],
            [90, 100],
        ],
        participants: 0,
        participantsFee: 0,

        targetGroupList: ["Medarbejdere", "Ledere", "Kunder", "Medlemmer", "Andet"],
        targetGroups: [],
        addTargetGroup: false,
        customTargetGroup: "",

        eventLocationName: "",
        eventAddress: "",
        // zip and cityname from stage 1

        stage2Message: "",


        //Stage 3
        booker_cvr: "",
        booker_ean: "",
        booker_company_address: "",
        booker_company_city: "",
        booker_company_zip: "",

        stage3Message: "",

        stage3Confirmation: false,
        stage3Error: false,

        //Payment
        booking_payment_product: null,
        booking_payment_product_with_fee: 0,
        booking_payment_fee: null,
        booking_payment_tax: null,
        booking_payment_total: null,
        booking_payment_method: "stripe",

        // STRIPE
        stripeSubmit: false,
        stripeResponse: {},
        paymentError: false,
    };

    state = this.initialState;

    componentDidMount() {
        this.update();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.productId !== this.props.productId) {
            this.setState(this.initialState);
            this.update();
        }
        if (prevProps.product.ID !== this.props.product.ID) this.setState({product: this.props.product});
        if (prevProps.type !== this.props.type) this.setState({bookingType: this.props.type});
    }

    getBookingPrice() {
        if (!!this.state.booking_payment_total) return this.state.booking_payment_total;
        return 0;
    }

    getProductPrice() {
        const region = !!this.state.region ? this.state.region.value : false;
        let productPrice = this.state.booking_payment_product_with_fee || this.props.product.meta.product_price_with_fee;

        const prices = this.props.product.meta.product_price_regions;
        if (!!prices) {
            prices.forEach(price => {
                if (!!price.region)
                    price.region.forEach(priceRegion => {
                        if (region === parseFloat(priceRegion.value)) {
                            productPrice = parseFloat(price.price_with_fee);
                        }
                    })
            });
        }

        return productPrice;
    }


    update = () => {
        this.getAvailableHours();
        this.setState({languages: this.props.speaker.post.languages});
        const parsed = queryString.parse(window.location.search);
        this.getDuration();
        if (parsed.bookingstage) this.setState({stage: parseInt(parsed.bookingstage)});


        if (parsed.bookingid && parsed.token) {
            this.getBooking(parsed.bookingid, parsed.token);
            this.setState({booking_token: parsed.token});
        }
    };

    afterPayment = (bookingId, token, status, bookingType) => {
        const postData = {
            booking_relation_booking: bookingId,
            booking_token: token,
            booking_status: status,
            booking_type: bookingType
        };
        this.completeBooking(postData, true);
    };


    getBooking = (id, token) => {
        this.setState({isPosting: true});

        axios.get(API + "booking?booking_relation_booking=" + id + "&booking_token=" + token + "&" + TOKEN)
            .then(res => {

                const result = res.data.results;
                const booking = result.booking;
                const meta = booking.meta;

                const parsed = queryString.parse(window.location.search);
                const bookingstage = meta.booking_status[0];
                const stageNumber =
                    !!parsed.bookingstage ? parseInt(parsed.bookingstage) :
                        (parsed.cosuccess === "0" || parsed.cosuccess === "1") ? 3 :
                            bookingstage === "confirmed" || bookingstage === "initiated" ? 2
                                : bookingstage === "cancelCustomer" ? -1
                                : bookingstage === "cancelSpeaker" ? -2
                                    : bookingstage === "cancelInternal" ? -3
                                        : 1;

                const startHour = meta.booking_time[0] ? meta.booking_time[0].slice(0, 2) : "12";
                const startMinute = meta.booking_time[0] ? meta.booking_time[0].slice(-2) : "00";
                const startTimeInMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
                const theDateStamp = parseInt(meta.booking_datestamp[0]) - startTimeInMinutes * 60;
                const minStart = meta.booking_time[0] ?
                    parseInt(meta.booking_time[0].slice(0, 2)) * 60 + parseInt(meta.booking_time[0].slice(-2)) - 120 : 600;
                const maxStart = meta.booking_time[0] ?
                    parseInt(meta.booking_time[0].slice(0, 2)) * 60 + parseInt(meta.booking_time[0].slice(-2)) + 120 : 1200;

                const bookingType = meta.booking_type[0];

                this.setState(prev => ({
                    bookingType: bookingType,
                    stage: stageNumber,

                    city: meta.booking_location_city[0],
                    zip: meta.booking_location_zip[0],
                    eventLocationName: meta.booking_location_name[0] || "",
                    eventAddress: meta.booking_location_address1[0] || "",

                    startTime: meta.booking_time[0] || "",
                    startTimeMinutes: startTimeInMinutes,
                    timestamp: theDateStamp * 1000,
                    durationInMinutes: meta.booking_duration[0] !== null ? parseInt(meta.booking_duration[0]) : prev.durationInMinutes,
                    durationSetInBooking: meta.booking_duration[0] !== null,
                    min_start: minStart,
                    max_start: maxStart,

                    booker_companyName: meta.booking_company_name || "",
                    booker_name: meta.booking_customer_name || "",
                    booker_phone: meta.booking_customer_phone || "",
                    booker_email: meta.booking_customer_email || "",

                    booker_cvr: meta.booking_company_cvr[0] || "",
                    booker_ean: meta.booking_accounting_ean[0] || "",
                    booker_company_address: meta.booking_company_address1[0] || "",
                    booker_company_city: meta.booking_company_city[0] || "",
                    booker_company_zip: meta.booking_company_zip[0] || "",

                    booker_message: meta.booking_info_prenotes[0] || "",
                    stage2Message: meta.booking_info_theme[0] || "",
                    stage3Message: meta.booking_info_notes[0] || "",

                    transportPrice: meta.booking_payment_transport[0] ? parseInt(meta.booking_payment_transport[0]) : meta.booking_location_zip[0] ? this.getTransportFee(meta.booking_location_zip[0]) : prev.booking_payment_transport,
                    booking_payment_product: meta.booking_payment_product[0] ? parseInt(meta.booking_payment_product[0]) : prev.booking_payment_product,
                    booking_payment_product_with_fee: meta.booking_payment_product_with_fee[0] ? parseInt(meta.booking_payment_product_with_fee[0]) : prev.booking_payment_product_with_fee,
                    booking_payment_fee: meta.booking_payment_fee[0] ? parseInt(meta.booking_payment_fee[0]) : prev.booking_payment_fee,
                    booking_payment_tax: meta.booking_payment_tax[0] ? parseInt(meta.booking_payment_tax[0]) : prev.booking_payment_tax,
                    booking_payment_total: meta.booking_payment_total[0] ? parseInt(meta.booking_payment_total[0]) : prev.booking_payment_total,

                    booking_stripe_session_id: meta.booking_stripe_session_id,
                    booking_stripe_payment_intent: meta.booking_stripe_payment_intent,

                    isPosting: false,
                }));

                if (parsed.cosuccess === "0") {
                    this.setState({paymentError: true})
                } else if (parsed.cosuccess === "1") {
                    const stage = bookingstage === "initiated" ? "prebooked" : "booked";
                    this.afterPayment(id, token, stage, bookingType);
                }
            })

    };


    getWeekday = (i) => {
        switch (i) {
            case 0:
                return "Søndag";
            case 1:
                return "Mandag";
            case 2:
                return "Tirsdag";
            case 3:
                return "Onsdag";
            case 4:
                return "Torsdag";
            case 5:
                return "Fredag";
            case 6:
                return "Lørdag";
            default:
                return "---dag"
        }
    };

    getDisabledWeekDays = () => {
        let disabled = [];
        if (this.props.speaker && this.props.speaker.post.meta) {
            if (!this.props.speaker.post.meta.speaker_day_sunday) disabled.push(0);
            if (!this.props.speaker.post.meta.speaker_day_monday) disabled.push(1);
            if (!this.props.speaker.post.meta.speaker_day_tuesday) disabled.push(2);
            if (!this.props.speaker.post.meta.speaker_day_wednesday) disabled.push(3);
            if (!this.props.speaker.post.meta.speaker_day_thursday) disabled.push(4);
            if (!this.props.speaker.post.meta.speaker_day_friday) disabled.push(5);
            if (!this.props.speaker.post.meta.speaker_day_saturday) disabled.push(6);
        }
        if (disabled.length === 7) return [];
        return disabled;
    };

    toggleDateSelect = () => {
        this.setState(prev => ({dateSelect: !prev.dateSelect}))
    };

    getAvailableHours = (day, noStartTimeUpdate) => {

        let hours = [];

        let defaultHours = [{label: "09:00", value: "09:00"}, {label: "09:30", value: "09:30"}]; //Keep entries starting with 0X:XX here
        for (let i = 10; i < 21; i++) { //Fill the rest
            defaultHours.push({label: i + ":00", value: i + ":00"}, {label: i + ":30", value: i + ":30"})
        }
        defaultHours.push({label: "21:00", value: "21:00"}); //Push 21:00 so we don't include 21:30

        if (!!this.props.speaker && this.props.speaker.post.meta) {

            const hourItem = () => {
                switch (day) {
                    case 0:
                        return this.props.speaker.post.meta.speaker_day_sunday ? this.props.speaker.post.meta.speaker_day_sunday[0] : false;
                    case 2:
                        return this.props.speaker.post.meta.speaker_day_tuesday ? this.props.speaker.post.meta.speaker_day_tuesday[0] : false;
                    case 3:
                        return this.props.speaker.post.meta.speaker_day_wednesday ? this.props.speaker.post.meta.speaker_day_wednesday[0] : false;
                    case 4:
                        return this.props.speaker.post.meta.speaker_day_thursday ? this.props.speaker.post.meta.speaker_day_thursday[0] : false;
                    case 5:
                        return this.props.speaker.post.meta.speaker_day_friday ? this.props.speaker.post.meta.speaker_day_friday[0] : false;
                    case 6:
                        return this.props.speaker.post.meta.speaker_day_saturday ? this.props.speaker.post.meta.speaker_day_saturday[0] : false;
                    default:
                        return this.props.speaker.post.meta.speaker_day_monday ? this.props.speaker.post.meta.speaker_day_monday[0] : false;
                }
            };

            if (hourItem()) {
                let min = parseInt(hourItem().hour_start.substring(0, 2));
                let max = parseInt(hourItem().hour_end.substring(0, 2));

                // FOR THE SLIDER
                const {min_start, max_start, startTimeMinutes} = this.state;
                if ((min_start !== min * 60 || max_start !== max * 60) && !noStartTimeUpdate) {
                    const start =
                        startTimeMinutes < min * 60 ? min * 60
                            : startTimeMinutes > max * 60 ? max * 60
                            : startTimeMinutes;
                    this.setState({
                        min_start: min * 60,
                        max_start: max * 60,
                        startTimeMinutes: start
                    });
                }

                while (min <= max) {
                    hours.push({label: min + ":00", value: min + ":00"});
                    min++
                }

                if (!hours.length) hours = defaultHours;

            } else if (!(this.props.speaker.post.meta.speaker_day_sunday && this.props.speaker.post.meta.speaker_day_monday &&
                this.props.speaker.post.meta.speaker_day_tuesday && this.props.speaker.post.meta.speaker_day_wednesday &&
                this.props.speaker.post.meta.speaker_day_thursday && this.props.speaker.post.meta.speaker_day_friday &&
                this.props.speaker.post.meta.speaker_day_saturday)) return defaultHours;

        } else {
            hours = defaultHours
        }

        return hours;
    };


    dateChange = (date) => {
        this.getAvailableHours();
        const theDate = new Date(date);
        const timeStamp = theDate.getTime();
        const weekDay = theDate.getDay();
        const day = theDate.getDate();
        const month = theDate.getMonth() + 1;
        const year = theDate.getFullYear();
        if (!!timeStamp) this.setState({
            date: [('0' + day).slice(-2), ('0' + month).slice(-2)],
            dateLong: theDate,
            weekday: weekDay,
            year: year,
            timestamp: timeStamp
        });
        this.toggleDateSelect();
    };

    /* STATUS ---   0: not set, 1: success, -1: error */
    timeStatus = () => {
        if (this.state.timeError) {
            return -1;
        }
        if (!!this.state.timestamp && (!!this.state.startTime || this.state.bookingType === "quickbooking")) return 1;
        return 0
    };

    contactInfoStatus = () => {
        if (!!this.state.booker_phone && !!this.state.booker_email && !!this.state.booker_name) return 1;
        return 0
    };

    getClassfromStatus = (status) => {
        switch (status) {
            case 1:
                return "border-success";
            case -1:
                return "border-failure";
            default:
                return "";
        }
    };

    hasFullProduct = () => {
        let bool = false;
        this.props.speaker.post.products.forEach(product => {
            if (!product.meta.product_appetizer) bool = true;
        });
        return bool;
    };

    getTransportFee = (zip, region) => {
        if (!!zip || !!region) {

            this.setState({transportPriceLoading: true});

            let fromQuery = "";
            let toQuery = "";

            if (!!this.props.speaker && this.props.speaker.post.meta.speaker_region_home) {
                fromQuery = "from_region=" + this.props.speaker.post.meta.speaker_region_home.value
            } else {
                fromQuery = "from_zip=" + (this.props.speaker.post.meta.speaker_zip || 1000)
            }

            if (region) {
                toQuery = "to_region=" + region.value
            } else if (zip) {
                toQuery = "to_zip=" + zip
            }

            const productQuery = this.props.product ? `product=${this.state.product.ID}&` : "";

            axios.get(API + "transport?" + fromQuery + "&" + toQuery + "&" + productQuery + TOKEN)
                .then(res => {
                    if (!res.data.status) return;

                    const toReg = res.data.results.to_region;

                    let available = false;
                    if (this.state.product.meta.product_appetizer) {
                        const availableRegions = this.props.speaker.post.meta.speaker_region_teaser;
                        availableRegions.forEach(reg => {
                            if (reg.value + "" === toReg + "") {
                                available = true;
                            }
                        });
                    } else available = true;

                    this.setState({
                        transportPrice: parseInt(res.data.results.price) + parseInt(res.data.results.price_toll),
                        region: {
                            label: parseInt(toReg),
                            value: parseInt(toReg)
                        },
                        regionAvailability: available
                    });

                }).finally(() => {
                this.setState({transportPriceLoading: false})
            });
        }
    };


    // STAGE 2
    getHours = (x) => {
        return ('0' + (Math.floor(x / 60)) % 24).slice(-2)
    };

    getMinutes = (x) => {
        return ('0' + (x % 60)).slice(-2);
    };

    handleSliderChange = (e, value) => {
        this.setState({
            startTimeMinutes: Math.max(value, this.state.min_start),
        })
    };

    handleDurationChange = (e, value) => {
        this.setState({
            durationInMinutes: value,
        });
        this.handleSliderChange(null, this.state.startTimeMinutes)
    };


    getDuration = () => {
        if (
            this.props.product && !this.state.product_duration_min && !this.state.product_duration_max &&
            (this.props.product.meta.product_duration_max || this.props.product.meta.product_duration_min)
        ) {
            const durationInMinutes = this.props.product.meta.product_duration_max ? parseInt(this.props.product.meta.product_duration_max)
                : this.props.product.meta.product_duration_min ? parseInt(this.props.product.meta.product_duration_min) : 30;
            this.setState(prev => ({
                product_duration_min: this.props.product.meta.product_duration_min ? parseInt(this.props.product.meta.product_duration_min) : null,
                product_duration_max: this.props.product.meta.product_duration_max ? parseInt(this.props.product.meta.product_duration_max) : null,
                durationInMinutes: !this.state.durationSetInBooking ? durationInMinutes : prev.durationInMinutes
            }))
        }
    };

    completeBooking = (postData, ready) => {
        if (this.state.isPosting && !ready) return;
        if (postData === false) return;

        this.setState({isPosting: true});
        axios.post(API + "booking?" + TOKEN, postData)
            .then(res => {
                if (!res.data.status) {
                    this.setState({stage3Error: true});
                    return;
                }
                this.setState({stage3Confirmation: true});
                this.logCompletedBookingEvent()
            })
            .catch(error => {
                this.setState({stage3Error: true});
            })
            .finally(() => this.setState({isPosting: false}));
    };

    logCompletedBookingEvent = () => {
        const speakerName = this.props.speaker ? this.props.speaker.post.post_title + "" : "";
        const productName = this.props.product && this.props.pagetype === "product" ? " - " + this.props.product.post_title : "";
        ga('gtm1.send', 'event', 'Book', 'Completed ' + this.state.bookingType, speakerName + productName, this.getBookingPrice());
        ReactPixel.trackCustom("CompletedBooking", {
            bookingType: this.state.bookingType,
            product: speakerName + productName,
            price: this.getBookingPrice()
        });
    };

    switchToQuestion = () => {
        const {booker_companyName, booker_name, booker_phone, booker_email, booker_message, region, zip} = this.state;
        this.props.setParrentState({
            booker_companyName,
            booker_name,
            booker_phone,
            booker_email,
            booker_message,
            region,
            zip
        });
        this.props.askQuestion()
    };

    render() {
        const {
            bookingType, missingFields, stage, startTimeMinutes, durationInMinutes, languages, selectedLanguage, region, city, zip, booker_name, booker_companyName, booker_company_address, booker_company_city, booker_company_zip, booker_email, booker_phone, targetGroupList, targetGroups, eventLocationName, eventAddress,
            booker_message, product, timestamp, startTime, userAgreement, maxStage, occasions, occasionList, appetizerParticipantOptions, participantOptions, participants, stage2Message, booker_cvr, booker_ean, stage3Message,
        } = this.state;
        const {
            speaker, open, bookingId, type
        } = this.props;

        const today = new Date();
        const todayPlusOneYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

        const submitReady =
            stage === 3 ? booker_company_city && booker_company_zip && booker_company_address
                : stage === 2 ? city && zip && zip.length === 4 && !isNaN(zip) && eventAddress && this.state.regionAvailability
                : userAgreement && (region || city || bookingType === "quickbooking") && this.timeStatus() === 1 && this.contactInfoStatus() === 1 && this.state.regionAvailability;

        const missingFieldsInfo = missingFields &&
            <Notification mouseEvent={null} type={"warning"} onClose={() => {
                this.setState({missingFields: false})
            }}>
                Du mangler at udfylde et eller flere påkrævede felter
            </Notification>;

        const details =
            <div className={"container"}>

                <div className="mb-2 text-light row">
                    <div className="col-12 text-center"><span style={{fontWeight: 700, textTransform: 'uppercase'}}
                                                              className={"booking-headline-speaker"}>{speaker && speaker.post.post_title}</span> - <span
                        className={"booking-headline-product"}>{product && product.post_title}</span></div>
                </div>


                <div className="mb-2 text-light row">
                    <div className="col-12 text-center">
                        <div>{product && product.meta.product_price ?
                            <NumberFormat
                                value={this.getProductPrice()}
                                displayType={'text'}
                                thousandSeparator={'.'} decimalScale={0} decimalSeparator={','}
                                prefix={'DKK '} suffix={',- ex. moms'}/>
                            : "Pris på forespørgsel"}</div>
                        {this.state.transportPrice > 0 && <div>Transport:
                            + <NumberFormat value={(this.state.transportPrice)} displayType={'text'}
                                            thousandSeparator={'.'} decimalScale={0} decimalSeparator={','}
                                            prefix={'DKK '}/>
                        </div>}
                    </div>
                </div>

            </div>;

        const timeSliders =
            <>
                <div className="p-2 mt-1 separator-top text-light row">
                    <div className="col-12 py-2 px-4">
                        <h5 className="text-center">
                            Kl. {this.getHours(startTimeMinutes)}:{this.getMinutes(startTimeMinutes)}
                            {" - "}
                            {this.getHours(startTimeMinutes + durationInMinutes)}
                            :{this.getMinutes(startTimeMinutes + durationInMinutes)}</h5>
                        <Slider
                            classes={{
                                track: "bg-success",
                                thumb: "bg-success slider-thumb-custom",
                            }}
                            value={this.state.startTimeMinutes}
                            min={this.state.min_start}
                            max={this.state.max_start}
                            step={15}
                            onChange={this.handleSliderChange}
                        />
                    </div>
                </div>
                {this.state.product_duration_max && this.state.product_duration_min
                && this.state.product_duration_max !== this.state.product_duration_min &&
                <div className="p-2 mt-1 separator-top text-light row">
                    <div className="col-12 py-2 px-4">
                        <h5 className="text-center">{this.state.durationInMinutes} Minutter</h5>
                        <Slider
                            classes={{
                                track: "bg-success",
                                thumb: "bg-success slider-thumb-custom",
                            }}
                            value={this.state.durationInMinutes}
                            min={this.state.product_duration_min}
                            max={this.state.product_duration_max}
                            step={5}
                            onChange={this.handleDurationChange}
                        />
                    </div>
                </div>}
            </>;

        const error =
            <div className="d-flex justify-content-center align-items-center" style={{
                minHeight: '300px'
            }}>
                <div className="text-center">
                    <h1 className="text-danger">Ups...</h1>
                    <p style={{maxWidth: '250px'}}>
                        Der opstod en uventet fejl.
                        prøv igen eller kontakt os på <a href="mailto:info@youandx.com">info@youandx.com</a>
                    </p>
                    <button onClick={() => {
                        window.location.reload();
                    }} className="btn btn-outline-secondary mt-3">Prøv igen
                    </button>
                </div>
            </div>;

        const regionUnavailable =
            <div className="border border-warning m-2 mb-0 p-2 text-center rounded">
                <h5>Beklager! </h5>
                <p>
                    Produktet af typen <strong>appetizer</strong> er kun tilgængeligt i regionerne: <br/>
                    {speaker.post.meta.speaker_region_teaser_text}
                </p>
                <div className="btn-group">
                    {this.hasFullProduct() && <button type={"button"} onClick={() => {
                        this.setState({showAlternativeProducts: true})
                    }} className="btn btn-outline-primary">Se alternativer</button>}
                    <button type={"button"} onClick={this.switchToQuestion} className="btn btn-outline-primary">Skriv
                        til {speaker.post.post_title}</button>
                </div>
            </div>;

        if (!!this.state.redirect) return <Redirect to={this.state.redirect}/>;

        if ((this.props.pagetype === "speaker" && this.state.selectedProduct === null) || this.state.showAlternativeProducts) return (
            <Overlay
                title={`Vælg produkt fra ${speaker.post.post_title}`}
                toggleOverlay={() => {
                    this.setState({showAlternativeProducts: false});
                    this.props.toggleOverlay();
                }}
                open={open}
            >
                {this.state.showAlternativeProducts &&
                <h5 className="text-center mt-1 mb-3">Tilgængelige Produkter:</h5>}
                <div className={"booking-speaker-products row"}>
                    {
                        !!speaker &&
                        speaker.post.products.map((product, i) => (
                                (!this.state.showAlternativeProducts || !product.meta.product_appetizer) &&
                                <div
                                    className="col-12"
                                    key={product.ID}
                                    onClick={() => {
                                        if (!this.state.showAlternativeProducts) this.setState({
                                            selectedProduct: i,
                                            product
                                        });
                                        else this.setState({redirect: "/products/" + product.post_name});
                                    }}
                                >
                                    <ListItem
                                        title={product.meta.teaser_headline}
                                        image={product.images && product.images.thumbnail ? product.images.thumbnail[0]
                                            : speaker.images && speaker.images.thumbnail ? speaker.images.thumbnail[0]
                                                : product.terms ? [product.terms[Math.floor(Math.random() * product.terms.length)].images[0].sizes['home-speaker']]
                                                    : ['']}
                                    >
                                        <h6 className="text-info font-weight-light">{product.meta.product_type === "workshop" && "WORKSHOP : "}{product.post_title}</h6>
                                        <ProductTypePopOver
                                            type={product.meta.product_appetizer ? "appetizer" : product.meta.product_type === "workshop" ? "workshop" : "foredrag"}/>

                                    </ListItem>
                                </div>
                            )
                        )
                    }
                </div>
                {this.state.showAlternativeProducts &&
                <div className={"text-center w-100"}>
                    <h5 className="link" onClick={() => this.setState({showAlternativeProducts: false})}>
                        <FaArrowLeft/> Tilbage til booking
                    </h5>
                </div>
                }
            </Overlay>
        );

        if (stage === 2 && maxStage >= 2) {
            return (
                <Overlay title={"Booking specifikation"} toggleOverlay={this.props.toggleOverlay}
                         open={open}>
                    {missingFieldsInfo}
                    {this.state.isPosting && <LoadingModal timeoutCallback={() => {
                        this.setState({stage3Error: true, isPosting: false})
                    }}/>}

                    {this.state.stage2Error ? error
                        :
                        <form className="w-100" style={{position: 'relative'}}
                              onSubmit={e => {
                                  e.preventDefault();
                                  if (submitReady) {
                                      this.setState({missingFields: false});
                                      let purpose = "";
                                      let i = 0;
                                      occasionList.forEach(occasion => {
                                          if (occasions.includes(i)) purpose += occasion + ", ";
                                          i++
                                      });
                                      if (!!this.state.customOccasion) purpose += this.state.customOccasion;

                                      let targetgroup = "";
                                      let j = 0;
                                      targetGroupList.forEach(target => {
                                          if (targetGroups.includes(j)) targetgroup += target + ", ";
                                          j++
                                      });
                                      if (!!this.state.customTargetGroup) targetgroup += this.state.customTargetGroup;

                                      const stamp = this.state.startTimeMinutes * 60 * 1000 + timestamp;

                                      const postData = {
                                          booking_relation_booking: bookingId || this.state.newBookingId,
                                          booking_token: this.state.booking_token,

                                          booking_location_name: eventLocationName,
                                          booking_location_address1: eventAddress,
                                          booking_location_city: city,
                                          booking_location_zip: zip,

                                          booking_timezone: "Europe/Copenhagen",

                                          booking_time: this.getHours(startTimeMinutes) + ":" + this.getMinutes(startTimeMinutes),
                                          booking_duration: durationInMinutes,

                                          booking_info_targetgroup: targetgroup,
                                          booking_info_participants_min: product.meta.product_appetizer ?
                                              appetizerParticipantOptions[participants][0]
                                              : participantOptions[participants][0],
                                          booking_info_participants_max: product.meta.product_appetizer ?
                                              appetizerParticipantOptions[participants][1]
                                              : participantOptions[participants][1],
                                          booking_info_theme: stage2Message,
                                          booking_info_purpose: purpose,


                                          booking_language: languages[selectedLanguage].name,
                                          booking_type: this.state.bookingType,
                                      };

                                      if (bookingType !== "quickbooking") {
                                          postData.booking_datestamp = stamp / 1000;
                                      }

                                      if (this.state.isPosting) return;

                                      this.setState({isPosting: true});
                                      axios.post(API + "booking?" + TOKEN, postData)
                                          .then(res => {
                                              if (res.data.status) {
                                                  this.setState({booking_payment_total: parseFloat(res.data.results.booking.meta.booking_payment_total[0])})
                                              }
                                              this.setState({stage: 3})
                                          })
                                          .catch(error => {
                                              this.setState({stage3Error: true});
                                          })
                                          .finally(() => this.setState({isPosting: false}));
                                  } else {
                                      this.setState({missingFields: true});
                                  }
                              }}
                        >
                            {details}

                            {bookingType !== "quickbooking" &&
                            <div className={"input-box bg-light-grey py-1 text-light-grey px-0"}>
                                <div className={"px-2 booking-input-title clearfix"}>
                                    <FaClock className="booking-icon"/>Tidspunkt & Varighed
                                </div>
                                {timeSliders}
                            </div>
                            }

                            {!!this.state.languages && (this.state.languages.length >= 1 ?
                                    <div className={"input-box bg-light-grey py-1 text-light-grey px-0"}>
                                        <div className={"px-2 booking-input-title clearfix"}>
                                            <span className=""><FaLanguage className="booking-icon"/></span>Sprog
                                            : {languages[selectedLanguage].name}
                                        </div>
                                        {this.state.languages.length > 1 &&
                                        <div className="p-2 mt-1 separator-top text-light row">
                                            <div className="col">
                                                {
                                                    this.state.languages.map((language, i) => (
                                                        <span key={i} className="pr-3">
                                                            <Radio color={'primary'}
                                                                   classes={{
                                                                       checked: 'text-success'
                                                                   }}
                                                                   checked={selectedLanguage === i}
                                                                   onChange={() => {
                                                                       this.setState({selectedLanguage: i})
                                                                   }}
                                                                   value={language.name}
                                                                   name={language.name}
                                                                   aria-label={language.name}
                                                            />{language.name}
                                                        </span>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        }
                                    </div>
                                    :
                                    <div className={"text-center mb-2"}>Sprog : {languages[selectedLanguage].name}</div>
                            )
                            }

                            <div className={"input-box bg-light-grey py-1 text-light-grey px-0"}>
                                <div className={"px-2 booking-input-title clearfix"}>
                                    <FaUsers className="booking-icon"/>Antal deltagere
                                </div>

                                <div className="p-2 mt-1 separator-top text-light row">
                                    {
                                        product && product.meta.product_appetizer ?
                                            <div className="col-12 py-2 px-4">
                                                <h5 className="text-center">
                                                    {appetizerParticipantOptions[participants][0]}
                                                    {" - "}
                                                    {appetizerParticipantOptions[participants][1]}
                                                </h5>
                                                <Slider
                                                    classes={{
                                                        track: "bg-success",
                                                        thumb: "bg-success slider-thumb-custom",
                                                    }}
                                                    value={participants}
                                                    min={0}
                                                    max={5}
                                                    step={1}
                                                    onChange={(e, value) => {
                                                        const fee = () => {
                                                            switch (value) {
                                                                case 1:
                                                                    return 1000;
                                                                case 2:
                                                                    return 2000;
                                                                case 3:
                                                                    return 3000;
                                                                case 4:
                                                                    return 4000;
                                                                case 5:
                                                                    return 5000;
                                                                default:
                                                                    return 0
                                                            }
                                                        };
                                                        this.setState({
                                                            participants: value,
                                                            participantsFee: fee()
                                                        })
                                                    }}
                                                />
                                            </div>
                                            :
                                            <div className="col-12 py-2 px-4">
                                                <h5 className="text-center">
                                                    {participantOptions[participants][0]}
                                                    {participants !== participantOptions.length - 1 && " - "}
                                                    {participantOptions[participants][1]}
                                                </h5>
                                                <Slider
                                                    classes={{
                                                        track: "bg-success",
                                                        thumb: "bg-success slider-thumb-custom",
                                                    }}
                                                    value={participants}
                                                    min={0}
                                                    max={6}
                                                    step={1}
                                                    onChange={(e, value) => {
                                                        const fee = () => {
                                                            switch (value) {
                                                                case 5:
                                                                    return 5000;
                                                                case 6:
                                                                    return 10000;
                                                                default:
                                                                    return 0
                                                            }
                                                        };
                                                        this.setState({
                                                            participants: value,
                                                            participantsFee: fee()
                                                        })
                                                    }}
                                                />
                                            </div>
                                    }

                                    {!!this.state.participantsFee &&
                                    <div
                                        className="col-12 text-center text-success">+{this.state.participantsFee} DKK</div>}
                                </div>
                            </div>

                            <div className={"input-box bg-light-grey py-1 text-light-grey px-0"}>
                                <div className={"px-2 booking-input-title clearfix"}>
                                    <FaQuestionCircle className="booking-icon"/>Anledning
                                </div>

                                <div className="pt-3 px-2 mt-1 separator-top text-light row">
                                    <div className="col-12 text-center">
                                        <ChipSelector
                                            selected={occasions} choices={occasionList}
                                            customFieldToggle={show =>
                                                this.setState({addOccasion: show})
                                            }
                                            updateSelection={list => {
                                                this.setState({occasions: list})
                                            }}
                                        />
                                    </div>
                                    {this.state.addOccasion &&
                                    <div className="col-12 mb-2">
                                        <TextInput
                                            placeholder={"Skriv anledning"}
                                            onChange={value => this.setState({customOccasion: value})}
                                            value={this.state.customOccasion}
                                        />
                                    </div>
                                    }
                                </div>


                            </div>


                            <div className={"input-box bg-light-grey py-1 text-light-grey px-0"}>
                                <div className={"px-2 booking-input-title clearfix"}>
                                    <FaUserCheck className="booking-icon"/>Målgruppe
                                </div>

                                <div className="pt-3 px-2 mt-1 separator-top text-light row">
                                    <div className="col-12 text-center">
                                        <ChipSelector
                                            selected={targetGroups} choices={targetGroupList}
                                            customFieldToggle={show =>
                                                this.setState({addTargetGroup: show})
                                            }
                                            updateSelection={list => {
                                                this.setState({targetGroups: list})
                                            }}
                                        />
                                    </div>
                                    {this.state.addTargetGroup &&
                                    <div className="col-12 mb-2">
                                        <TextInput
                                            placeholder={"Skriv målgruppe"}
                                            onChange={value => this.setState({customTargetGroup: value})}
                                            value={this.state.customTargetGroup}
                                        />
                                    </div>
                                    }
                                </div>


                            </div>

                            <div className={"input-box bg-light-grey py-1 text-light-grey px-0"}>
                                <div className={"px-2 booking-input-title clearfix"}>
                                    <FaUserCheck className="booking-icon"/>Tema & Formål
                                </div>

                                <div className="separator-top col-12 d-flex py-3">
                                <textarea className="form-control flex-grow-1" style={{
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    color: '#ffffff',
                                }} placeholder="Skriv tema og formål..."
                                          value={stage2Message} onChange={(e) => {
                                    this.setState({stage2Message: e.target.value})
                                }}/>
                                </div>


                            </div>

                            <div className={"input-box bg-light-grey py-1 text-light-grey px-0"}>
                                <div className={"px-2 booking-input-title clearfix"}>
                                    <FaMapMarkerAlt className="booking-icon"/>Adresse for begivenhed
                                </div>

                                <div className="p-2 mt-1 separator-top text-light row">

                                    <div className="col-12 mb-2">
                                        <TextInput
                                            label={"Evt. navn på afholdelsessted"}
                                            placeholder={"Eks. Gentofte hotel"}
                                            onChange={value => this.setState({eventLocationName: value})}
                                            value={eventLocationName}
                                        />
                                    </div>

                                    <div className="col-12 mb-2">
                                        <TextInput
                                            label={"Gadenavn og husnr."}
                                            placeholder={"Eks. Gentoftegade 29"}
                                            onChange={value => this.setState({eventAddress: value})}
                                            value={eventAddress}
                                        />
                                    </div>


                                    <div className="col-12 col-md-6 mb-2">
                                        <TextInput
                                            label={"Postnr."}
                                            placeholder={"Eks. 2820"}
                                            value={zip}
                                            onChange={
                                                (value) => {
                                                    const zip = value;
                                                    if (zip.length === 4) this.getTransportFee(value);
                                                    if (zip.length === 0) this.setState({transportPrice: 0});
                                                    this.setState({zip: zip})
                                                }
                                            }
                                        >
                                            <div className="text-success"
                                                 style={{position: "absolute", right: 5, bottom: 15}}>
                                                {this.state.transportPriceLoading ?
                                                    <Spinner/>
                                                    : <NumberFormat value={(this.state.transportPrice)}
                                                                    displayType={'text'}
                                                                    thousandSeparator={'.'} decimalScale={0}
                                                                    decimalSeparator={','}
                                                                    prefix={'+ DKK '} className={"p-0"}/>
                                                }
                                            </div>
                                        </TextInput>
                                    </div>


                                    <div className="col-12 col-md-6 mb-2">
                                        <TextInput
                                            label={"By"}
                                            placeholder={"Eks. Gentofte"}
                                            onChange={value => this.setState({city: value})}
                                            value={city}
                                        />
                                    </div>

                                    {
                                        !this.state.regionAvailability &&
                                        <div className={"col-12"}>
                                            {regionUnavailable}
                                        </div>
                                    }

                                </div>

                            </div>

                            <button
                                className={`btn btn-large w-100 ${submitReady ? "btn-success" : "btn-dark disabled"}`}
                                style={{
                                    borderRadius: '6px'
                                }}
                                type={"submit"}
                            >
                                <h5 className="font-weight-bold p-1">Videre til betaling</h5>
                            </button>

                        </form>
                    }

                </Overlay>
            )
        }

        if (stage === 3 && maxStage >= 3) {
            return (
                <Overlay title={"Betaling og bekræftelse"} toggleOverlay={this.props.toggleOverlay}
                         open={open}>


                    {missingFieldsInfo}
                    {this.state.isPosting && <LoadingModal timeoutCallback={() => {
                        this.setState({stage3Error: true, isPosting: false})
                    }}/>}
                    {this.state.paymentError &&
                    <PaymentErrorOverlay onClose={() => this.setState({paymentError: false})}/>}
                    {
                        this.state.stage3Error ? error
                            : this.state.stage3Confirmation ?
                            <div className="d-flex justify-content-center align-items-center" style={{
                                minHeight: '300px'
                            }}>
                                <div className="text-center">
                                    <h1 className="text-success">TAK</h1>
                                    <p style={{maxWidth: '250px'}}>
                                        Din booking er hermed bekræftet.<br/>
                                        Du vil modtage en mail med alle detaljer.
                                    </p>
                                </div>
                            </div>
                            :

                            <form className="w-100"
                                  onSubmit={e => {
                                      e.preventDefault();

                                      if (submitReady) {
                                          this.setState({missingFields: false});
                                          const postData = {
                                              booking_relation_booking: bookingId || this.state.newBookingId,
                                              booking_token: this.state.booking_token,

                                              booking_company_address1: booker_company_address,
                                              booking_company_city: booker_company_city,
                                              booking_company_zip: booker_company_zip,
                                              booking_company_cvr: booker_cvr,
                                              booking_accounting_ean: booker_ean,

                                              booking_info_notes: stage3Message,

                                              booking_payment_type: this.state.booking_payment_method === "stripe" ? "creditcard" : "invoice"
                                          };

                                          if (this.state.bookingStage === "initiated") postData.booking_type = "quickbooking";

                                          switch (this.state.booking_payment_method) {

                                              case "stripe":
                                                  this.setState({isPosting: true});
                                                  axios.post(API + "booking?" + TOKEN, postData)
                                                      .then(res => {
                                                          if (!res.data.status) {
                                                              this.setState({stage3Error: true, isPosting: false});
                                                              return;
                                                          }
                                                          this.setState({stripeSubmit: true});
                                                      })
                                                      .catch(error => {
                                                          this.setState({stage3Error: true, isPosting: false});
                                                      });
                                                  break;


                                              case "invoice":
                                                  postData.booking_status = this.state.booking_status === "initiated" || this.state.bookingType === "quickbooking" ? "prebooked" : "booked";
                                                  this.completeBooking(postData);
                                                  break;
                                              default:
                                                  break;
                                          }


                                      } else this.setState({missingFields: true});
                                  }}
                            >

                                {details}

                                <div className={"input-box bg-light-grey py-1 text-light-grey px-0"}>
                                    <div className={"px-2 booking-input-title clearfix"}>
                                        <FaBuilding className="booking-icon"/>Firmadetaljer
                                    </div>

                                    <div className="p-2 mt-1 separator-top text-light row">

                                        <div className="col-12 mb-2">
                                            <TextInput
                                                label={"Gadenavn og husnummer"}
                                                placeholder={"Eks. Fabriksparken 17, 1. sal"}
                                                onChange={value => this.setState({booker_company_address: value})}
                                                value={booker_company_address}
                                            />
                                        </div>

                                        <div className="col-12 col-md-6 mb-2">
                                            <TextInput
                                                label={"Postnr."}
                                                placeholder={"Eks. 2600"}
                                                onChange={value => this.setState({booker_company_zip: value})}
                                                value={booker_company_zip}
                                            />
                                        </div>


                                        <div className="col-12 col-md-6 mb-2">
                                            <TextInput
                                                label={"By"}
                                                placeholder={"Eks. Glostrup"}
                                                onChange={value => this.setState({booker_company_city: value})}
                                                value={booker_company_city}
                                            />
                                        </div>

                                        <div className="col-12 col-md-6 mb-2">
                                            <TextInput
                                                label={"CVR nummer"}
                                                placeholder={"Eks. 15362718"}
                                                onChange={value => this.setState({booker_cvr: value})}
                                                value={booker_cvr}
                                            />
                                        </div>


                                        <div className="col-12 col-md-6 mb-2">
                                            <TextInput
                                                label={"EAN nummer"}
                                                placeholder={"Eks. 7384756382912"}
                                                onChange={value => this.setState({booker_ean: value})}
                                                value={booker_ean}
                                            />
                                        </div>


                                        <div className="col-12 d-flex">
                                            <TextInput
                                                label={"Kommentarer til booking"}
                                                placeholder={"Her kan du skrive en kommentar til din booking..."}
                                                onChange={value => this.setState({stage3Message: value})}
                                                value={stage3Message}
                                            />
                                        </div>
                                    </div>


                                </div>

                                <div className={"input-box bg-light-grey py-1 text-light-grey px-0"}>
                                    <div className={"px-2 booking-input-title clearfix"}>
                                        <FaMoneyBill className="booking-icon"/>Betalingsmetode
                                    </div>

                                    <div className="p-2 mt-1 separator-top text-light row justify-content-center">


                                        <span className="pr-3">
                                            <Radio color={'primary'}
                                                   classes={{
                                                       checked: 'text-success'
                                                   }}
                                                   checked={this.state.booking_payment_method === "invoice"}
                                                   onChange={() => {
                                                       this.setState({booking_payment_method: "invoice"})
                                                   }}
                                                   value={"invoice"}
                                                   name={"invoice"}
                                                   aria-label={"Faktura"}
                                            />Faktura
                                        </span>
                                        <span className="pr-3">
                                            <Radio color={'primary'}
                                                   classes={{
                                                       checked: 'text-success'
                                                   }}
                                                   checked={this.state.booking_payment_method === "stripe"}
                                                   onChange={() => {
                                                       this.setState({booking_payment_method: "stripe"})
                                                   }}
                                                   value={"stripe"}
                                                   name={"stripe"}
                                                   aria-label={"Kreditkortbetaling"}
                                            />Kreditkortbetaling
                                        </span>
                                    </div>


                                    {
                                        this.state.booking_payment_method === "stripe" ?

                                            <>
                                                <p className={"m-1 text-secondary text-center"}>
                                                    <FaInfoCircle className="booking-icon"/>Betalingsoplysninger
                                                    udfyldes på næste side
                                                </p>
                                                <Checkout
                                                    submit={this.state.stripeSubmit}
                                                    bookingId={this.props.bookingId || this.state.newBookingId}
                                                    price={this.getBookingPrice()}
                                                />
                                            </>
                                            :
                                            <p className={"m-1 text-secondary text-center"}>
                                                <FaInfoCircle className="booking-icon"/> Fakturagebyr : DKK 275 ex. moms
                                            </p>
                                    }

                                </div>

                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-3 p-0">
                                            <button
                                                className={`btn btn-large w-100 btn-dark`}
                                                style={{
                                                    borderRadius: '0 0 0 6px'
                                                }}
                                                onClick={() => {
                                                    this.setState({stage: 2})
                                                }}
                                            >
                                                <h5 className="font-weight-bold p-1">
                                                    <FaArrowLeft className="booking-icon"/>
                                                </h5>
                                            </button>
                                        </div>

                                        <div className="col-9 p-0">
                                            <button
                                                className={`btn btn-large w-100 ${submitReady ? "btn-success" : "btn-dark disabled"}`}
                                                style={{
                                                    borderRadius: '6px'
                                                }}
                                                type={"submit"}
                                            >
                                                <h5 className="font-weight-bold p-1">Bekræft booking</h5>
                                            </button>
                                        </div>
                                    </div>
                                </div>


                            </form>
                    }
                </Overlay>
            )
        }

        return (
            <Overlay
                title={bookingType === "booking" ? "Forespørgsel på " + speaker.post.post_title : "Book " + speaker.post.post_title}
                toggleOverlay={() => {
                    this.setState({stage1Confirmation: false, selectedProduct: null});
                    this.props.toggleOverlay();
                }}
                open={open}
            >
                {missingFieldsInfo}
                {this.state.isPosting && <LoadingModal timeoutCallback={() => {
                    this.setState({stage3Error: true, isPosting: false})
                }}/>}

                {this.state.stage1Error ? error
                    : this.state.stage1Confirmation ?
                        <div className="d-flex justify-content-center align-items-center" style={{
                            minHeight: '300px'
                        }}>
                            <div className="text-center">
                                <h1 className="text-success">TAK</h1>
                                <p style={{maxWidth: '250px'}}>
                                    Din forespørgsel er sendt til
                                    speakeren. Du vil blive kontaktet
                                    via mail så snart forespørgslen er
                                    behandlet.
                                </p>
                                <button onClick={() => {
                                    this.setState({stage1Confirmation: false})
                                }} className="btn btn-outline-secondary mt-3">Ny forespørgsel
                                </button>
                            </div>
                        </div>
                        : <form className="w-100" style={{position: 'relative'}}
                                onSubmit={e => {
                                    e.preventDefault();

                                    if (submitReady) {
                                        this.setState({missingFields: false});

                                        const timeZone = "Europe/Copenhagen";
                                        const stamp =
                                            !!startTime ? (parseInt(startTime.slice(0, 2)) * 60 * 60 * 1000) + timestamp
                                                : this.state.startTimeMinutes * 60 * 1000 + timestamp;
                                        const offset = moment(stamp).tz(timeZone).utcOffset();

                                        const postData = {

                                            booking_relation_speaker: speaker ? speaker.post.ID : speaker.post.ID,
                                            booking_relation_product: product ? product.ID : null,

                                            booking_customer_name: booker_name,
                                            booking_customer_email: booker_email,
                                            booking_customer_phone: booker_phone,

                                            booking_company_name: booker_companyName,

                                            booking_location_region: region && region.value ? region.value : null,
                                            booking_location_city: city,
                                            booking_location_zip: zip,
                                            booking_location_country: "DK",

                                            booking_datestamp: stamp / 1000 + offset * 60,
                                            booking_timezone: timeZone,

                                            booking_info_prenotes: booker_message,

                                            booking_type: this.state.bookingType,
                                            booking_origin_url: window.location.href,
                                        };

                                        if (bookingType === "quickbooking") {
                                            postData.booking_status = "initiated";
                                            postData.booking_time = this.getHours(startTimeMinutes) + ":" + this.getMinutes(startTimeMinutes);
                                            postData.booking_duration = durationInMinutes;
                                        }


                                        if (this.state.isPosting) return;

                                        this.setState({isPosting: true});
                                        axios.post(`${API}booking?type=${type}&${TOKEN}`, postData)
                                            .then(res => {
                                                if (bookingType === "quickbooking") {
                                                    if (res.data.status && !!res.data.results) {

                                                        this.setState({
                                                            stage: 2,
                                                            newBookingId: res.data.results.ID,
                                                            booking_token: res.data.results.booking.meta.booking_token[0],
                                                        });
                                                    }

                                                } else {
                                                    this.setState({stage1Confirmation: true})
                                                }
                                            })
                                            .catch(error => {
                                                this.setState({stage1Error: true})
                                            })
                                            .finally(() => this.setState({isPosting: false}));
                                    } else this.setState({missingFields: true});
                                }}
                        >

                            {/* DATE SELECT POPUP */}
                            <Modal open={this.state.dateSelect} onClose={() => this.setState({dateSelect: false})}
                                   className="bp3-dark d-flex justify-content-center align-items-center">

                                <DatePicker className="date-picker" canClearSelection={false} minDate={today}
                                            maxDate={todayPlusOneYear}
                                            filterDate={date => !this.getDisabledWeekDays().includes(date.getDay())}
                                            inline
                                            selected={this.state.dateLong}
                                            onChange={(date, change) => {
                                                if (change) this.dateChange(date);
                                            }}/>
                            </Modal>


                            {product && details}


                            {/* VÆLG BY */}
                            {bookingType === "quickbooking" ?
                                null
                                :
                                <div
                                    className={`input-box bg-light-grey text-center city-input py-3 px-0 ${this.state.region && this.state.regionAvailability && "border-success"}`}
                                    style={{position: 'relative'}}>
                                    <div className="text-light-grey font-weight-bold">Lokation</div>

                                    <CitySelect options={this.state.availableCities} onChange={(zip, city) => {
                                        this.setState({zip, city});
                                        this.getTransportFee(zip);
                                    }}/>


                                    {!this.state.city &&
                                    <Dropdown buttonClass="btn-bold" buttonLabel="Region/Landsdel"
                                              onChange={(x) => {
                                                  this.setState({region: x});
                                                  this.getTransportFee(null, x);
                                              }}
                                              selected={this.state.region}
                                              placeholder={"Region/landsdel"}
                                              options={this.state.regionOptions}>
                                    </Dropdown>}
                                    {
                                        this.state.transportPriceLoading ?
                                            <Spinner/>
                                            : !this.state.regionAvailability ?
                                            regionUnavailable
                                            : this.state.transportPrice > 0 &&
                                            <div className="mt-1 text-success">Transport:
                                                + <NumberFormat value={(this.state.transportPrice)} displayType={'text'}
                                                                thousandSeparator={'.'} decimalScale={0}
                                                                decimalSeparator={','}
                                                                prefix={'DKK '}/>
                                            </div>

                                    }
                                </div>
                            }


                            {/* dato og tid */}
                            <div
                                className={`input-box bg-light-grey text-center p-3 unselectable ${this.getClassfromStatus(this.timeStatus())}`}
                                style={{position: 'relative'}}>

                                {bookingType === "quickbooking" ?
                                    this.state.date[0] === "DD" ?
                                        <button className={"btn btn-outline-primary mb-2"} onClick={e => {
                                            e.preventDefault();
                                            this.toggleDateSelect()
                                        }}>Vælg dato</button>
                                        : <div>
                                            <div
                                                className="text-light-grey font-weight-bold pointer d-flex justify-content-center align-items-center"
                                                onClick={this.toggleDateSelect}>

                                                <div
                                                    className="text-light font-weight-bold">{this.getWeekday(this.state.weekday)}</div>
                                                <div className="px-2">
                                                    <h3 className="font-weight-bold text-light">{this.state.date[0]}.{this.state.date[1]}</h3>
                                                </div>
                                                <div className="text-light font-weight-bold">{this.state.year}</div>

                                            </div>
                                        </div>
                                    : <div className="row justify-content-between">

                                        <div className="col-5 text-light-grey font-weight-bold pointer"
                                             onClick={this.toggleDateSelect}>
                                            Dato
                                            <div className="my-2">
                                                <h3 className="font-weight-bold text-light">{this.state.date[0]}.{this.state.date[1]}</h3>
                                            </div>
                                            <div
                                                className="text-light font-weight-bold">{this.getWeekday(this.state.weekday)}, {this.state.year}</div>
                                        </div>


                                        <div className="d-none d-sm-flex col-2 flex-column"
                                             style={{margin: '-16px 0',}}>
                                            <div className="flex-grow-1" style={{
                                                width: '100%',
                                            }}>
                                                <div className="bg-secondary mx-auto" style={{
                                                    height: '100%',
                                                    width: '3px'
                                                }}/>
                                            </div>
                                            <div onClick={this.toggleDateSelect}>
                                                <h3 className="calendar-button bg-light-grey mb-0 pointer">
                                                    <FaCalendar/>
                                                </h3>
                                            </div>
                                            <div className="flex-grow-1" style={{
                                                width: '100%',
                                            }}>
                                                <div className="bg-secondary mx-auto" style={{
                                                    height: '100%',
                                                    width: '3px'
                                                }}/>
                                            </div>
                                        </div>


                                        <div className="col-5 text-light-grey font-weight-bold pointer">
                                            Tid

                                            <Dropdown options={this.getAvailableHours(this.state.weekday, true)}
                                                      selectedClass={"h3 font-weight-bold text-light"}
                                                      selected={{
                                                          label: this.state.startTime,
                                                          value: this.state.startTime
                                                      }}
                                                      placeholder={"TT:MM"} className={"my-2"} showArrow={false}
                                                      onChange={(x) => {
                                                          this.setState({startTime: x.label, timeError: false})
                                                      }}
                                                      onError={() => {
                                                          if (!this.state.timeError) this.setState({timeError: true});
                                                      }}
                                            />


                                            <div className="text-light font-weight-bold">ca. starttid</div>
                                        </div>
                                    </div>}
                                {bookingType === "quickbooking" &&
                                <div style={{maxWidth: "100%", overflow: "hidden"}}>
                                    {timeSliders}
                                </div>
                                }
                            </div>


                            {/* kontaktinfo */}
                            <div className={"input-box bg-light-grey py-1 text-light-grey px-0"}>
                                <div className={"px-2 booking-input-title clearfix"}>
                                    <FaBuilding className="booking-icon"/>Kontaktinformation
                                </div>

                                <div className="p-2 mt-1 separator-top text-light row">

                                    <div className="col-12 col-md-6 mb-2">
                                        <TextInput
                                            label={"Firmanavn"}
                                            placeholder={"Eks. YOUANDX Aps"}
                                            onChange={value => this.setState({booker_companyName: value})}
                                            value={booker_companyName}
                                        />
                                    </div>

                                    <div className="col-12 col-md-6 mb-2">
                                        <TextInput
                                            label={"Kontaktperson"}
                                            placeholder={"Eks. Maybritt Toft Bisp"}
                                            onChange={value => this.setState({booker_name: value})}
                                            value={booker_name}
                                        />
                                    </div>


                                    <div className="col-12 col-md-6 mb-2">
                                        <TextInput
                                            label={"Telefon nummer"}
                                            placeholder={"Eks. +4570200449"}
                                            onChange={value => this.setState({booker_phone: value})}
                                            value={booker_phone}
                                        />
                                    </div>

                                    <div className="col-12 col-md-6 mb-2">
                                        <TextInput
                                            label={"Email"}
                                            placeholder={"Eks. mtb@youandx.com"}
                                            onChange={value => this.setState({booker_email: value})}
                                            value={booker_email}
                                        />
                                    </div>


                                    <div className="col-12 d-flex">

                                        <div className={"input-container"}>
                                            <div className={"input-label clearfix"}>Evt. besked</div>

                                            <textarea className="form-control flex-grow-1" style={{
                                                backgroundColor: 'rgba(0,0,0,0)',
                                                color: '#fff'
                                            }} placeholder="Skriv en besked..."
                                                      value={booker_message} onChange={(e) => {
                                                this.setState({booker_message: e.target.value});
                                            }}/>
                                        </div>
                                    </div>


                                </div>
                            </div>


                            <div className="d-flex mb-2">


                            <span style={{cursor: 'pointer'}}
                                  onClick={() => this.setState(prev => ({userAgreement: !prev.userAgreement}))}>
                                {this.state.userAgreement ?
                                    <div className="bg-success" style={{
                                        height: '20px',
                                        width: '20px',
                                        borderRadius: '50%',
                                        fontSize: '14px',
                                        paddingLeft: '3px'
                                    }}>
                                        <FaCheck className="booking-icon text-light"/>
                                    </div>
                                    :
                                    <div className="bg-dark" style={{
                                        height: '20px',
                                        width: '20px',
                                        borderRadius: '50%',
                                    }}/>
                                }

                            </span>

                                <small className="pl-2">Jeg har læst og accepterer
                                    <Link to={'/forretnings-og-betalingsbetingelser/'}>
                                        <span className="text-success"> forretningsbetingelserne</span>
                                    </Link>
                                </small>


                            </div>


                            <button
                                className={`btn btn-large w-100 ${submitReady ? "btn-success" : "btn-dark disabled"}`}
                                style={{
                                    borderRadius: '6px'
                                }}
                                type={"submit"}
                            >
                                <h5 className="font-weight-bold p-1">{bookingType === "quickbooking" ? "Videre" : "Send forespørgsel"}</h5>
                            </button>
                        </form>
                }

            </Overlay>
        );
    }
}


export default BookingOverlay;
