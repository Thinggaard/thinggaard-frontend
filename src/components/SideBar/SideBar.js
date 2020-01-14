// File created : 05-05-2019 12:18
import React, {Component} from 'react';
import './SideBar.css';
import QuestionOverlay from "../../components/Overlay/QuestionOverlay";
import queryString from "query-string";
import ReactGa from 'react-ga';
import ReactPixel from 'react-facebook-pixel';
import {FaRegStar, FaStar, FaStarHalfAlt} from "react-icons/fa";
import SidebarForms from "../Booking/SidebarForms";
import ProductPrompt from "../Booking/ProductPrompt";

const ga = ReactGa.ga;

class SideBar extends Component {

    initialState = {
        bookingOverlay: false,
        bookingId: null,
        bookingType: "booking",
        bookingStage: null,
        questionOverlay: false,
        reviewOverlay: false,
        hasClickedBook: false,
        hasClickedQuickBook: false,
        booker_companyName: "",
        booker_name: "",
        booker_phone: "",
        booker_email: "",
        booker_message: "",
        zip: "",
        region: null,
        action: "",
    };

    state = this.initialState;
    mounted = true;

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.props.speaker) return;
        if (this.props.speaker.post.ID !== prevProps.speaker.post.ID || (this.props.product && this.props.product.ID !== prevProps.product.ID)) {
            this.setState(this.initialState);
            this.setBookingStage();
        }
    };

    componentDidMount() {
        this.mounted = true;
        this.setBookingStage();
    };

    componentWillUnmount() {
        this.mounted = false;
    };

    setBookingStage = () => {
        const parsed = queryString.parse(window.location.search);
        if (parsed.bookingid || parsed.bookingstage) {
            if (parsed.bookingid) this.setState({bookingOverlay: true, bookingId: parseInt(parsed.bookingid)});
            if (parsed.bookingstage) this.setState({bookingOverlay: true, bookingStage: parseInt(parsed.bookingstage)});
        } else this.setState({bookingStage: 1});
    };

    getStars = (rating) => {
        let counter = rating;
        let stars = [];
        for (let i = 0; i < 5; i++) {
            if (counter < .25) {
                stars.push(<FaRegStar key={i} className="rating-star rating-star-empty"/>)
            } else if (counter < .8) {
                stars.push(<FaStarHalfAlt key={i} className="rating-star rating-star-half"/>)
            } else {
                stars.push(<FaStar key={i} className="rating-star rating-star-full"/>)
            }
            counter = counter - 1
        }
        return stars.map(star => (
            star
        ));
    };

    toggleBookingOverlay = () => {
        this.setState((prev => ({bookingOverlay: !prev.bookingOverlay, bookingType: "booking"})))
    };

    toggleQuestionOverlay = () => {
        this.setState((prev => ({questionOverlay: !prev.questionOverlay})));
    };

    bookingClick = (bookingType) => {
        this.setState({bookingOverlay: true, bookingType: bookingType});
        if (bookingType === "booking" && this.state.hasClickedBook) return;
        if (bookingType === "quickbooking" && this.state.hasClickedQuickBook) return;

        const speakerName = this.props.speaker ? this.props.speaker.post.post_title + "" : "";
        const productName = this.props.product && this.props.pagetype === "product" ? " - " + this.props.product.post_title : "";
        const formularType = bookingType + "Formular";
        //Register events
        ga('gtm1.send', 'event', 'Book', 'Åbnet ' + formularType, speakerName + productName, 0);
        ReactPixel.trackCustom("bookingformular", {bookingType, product: speakerName + productName, price: 0});

        //Only register events once
        if (bookingType === "booking") this.setState({hasClickedBook: true});
        else this.setState({hasClickedQuickBook: true});
    };


    render() {

        const {speaker, product, pagetype} = this.props;
        const {
            bookingOverlay, bookingId, questionOverlay, zip, region,
            booker_companyName, booker_name, booker_phone, booker_email, booker_message
        } = this.state;

        return (
            <div className={"sidebar-container col-12 col-lg-5 mt-3 mt-lg-5 order-1"}>

                {/*
                <BookingOverlay
                    type={bookingType}
                    toggleOverlay={this.toggleBookingOverlay}
                    getStars={this.getStars}
                    speaker={speaker}
                    product={product}
                    open={bookingOverlay}
                    selectedProduct={null}
                    bookingId={bookingId}
                    productId={product.ID}
                    pagetype={pagetype}
                    askQuestion={() => {
                        this.toggleQuestionOverlay();
                        this.toggleBookingOverlay();
                    }}
                    setParrentState={obj => this.setState(obj)}
                />
                */}

                <ProductPrompt
                    speaker={speaker}
                    open={!!this.state.action}
                    toggleOverlay={() => {this.setState({action: ""})}}
                    action={this.state.action}
                />


                <QuestionOverlay
                    toggleOverlay={this.toggleQuestionOverlay}
                    open={questionOverlay}
                    speaker={speaker}
                    product={product}
                    pagetype={pagetype}
                    booker_companyName={booker_companyName}
                    booker_name={booker_name}
                    booker_phone={booker_phone}
                    booker_email={booker_email}
                    booker_message={booker_message}
                    zip={zip}
                    region={region}
                    setParrentState={obj => this.setState(obj)}
                />

                <div className="sidebar pl-lg-5 h-100">
                    <div className={"sidebar-content h-100"} key={"sidebar"}>

                            <SidebarForms
                                toggleOverlay={this.toggleBookingOverlay}
                                getStars={this.getStars}
                                speaker={speaker}
                                product={product}
                                open={bookingOverlay}
                                selectedProduct={null}
                                bookingId={bookingId}
                                productId={!product ? 0 : product.ID}
                                pagetype={pagetype}
                                askQuestion={() => {
                                    this.toggleQuestionOverlay();
                                    this.toggleBookingOverlay();
                                }}
                                setParrentState={obj => this.setState(obj)}
                                setAction={action => {this.setState({action: action})}}
                            />


                    </div>



                </div>
            </div>
        )
    }
}


export default SideBar;
