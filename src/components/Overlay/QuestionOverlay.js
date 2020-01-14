// File created : 29-03-2019 15:53
import React, {Component} from 'react';
import Overlay from "./Overlay";
import axios from "axios";
import {API, TOKEN} from "../../constants";
import ReactGa from 'react-ga';
import ReactPixel from 'react-facebook-pixel';
import TextInput from "../Form/TextInput";

const ga = ReactGa.ga;


class QuestionOverlay extends Component {

    state = {
        stage1Error: false,
        stage1Confirmation: false,

        userAgreement: false,
    };

    contactInfoStatus = () => {
        if (!!this.props.booker_email && !!this.props.booker_name && !!this.props.booker_message) return 1;
        return 0
    };

    render() {

        const {
            setParrentState, booker_name, booker_email, booker_phone,
            booker_message, booker_companyName, product, speaker, open
        } = this.props;

        const submitReady = this.contactInfoStatus() === 1;

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


        return (
            <Overlay title={`Spørg ${speaker.post && speaker.post.post_title}`}
                     toggleOverlay={() => {
                         this.setState({stage1Confirmation: false});
                         this.props.toggleOverlay();
                     }}
                     open={open}>
                {
                    this.state.stage1Error ? error
                        : this.state.stage1Confirmation ?
                        <div className="d-flex justify-content-center align-items-center" style={{
                            minHeight: '300px'
                        }}>
                            <div className="text-center">
                                <h1 className="text-success">TAK</h1>
                                <p style={{maxWidth: '250px'}}>
                                    Dit spørgmsål er sendt til
                                    speakeren. Du vil blive kontaktet
                                    via mail så snart forespørgslen er
                                    behandlet.
                                </p>
                                <button onClick={() => {
                                    this.setState({stage1Confirmation: false})
                                }} className="btn btn-outline-secondary mt-3">Nyt spørgsmål
                                </button>
                            </div>
                        </div>
                        : <form className="w-100" style={{position: 'relative'}}
                                onSubmit={e => {
                                    e.preventDefault();
                                    if (submitReady) {
                                        const postData = {

                                            lead_relation_speaker: speaker[0] ? speaker[0].post.ID : speaker.post.ID,
                                            lead_relation_product: product ? product.ID : null,

                                            lead_company_name: booker_companyName,
                                            lead_customer_name: booker_name,
                                            lead_customer_email: booker_email,
                                            lead_customer_phone: booker_phone,

                                            lead_info_notes: booker_message,
                                            lead_status: "pending",
                                        };


                                        axios.post(API + "lead?" + TOKEN, postData)
                                            .then(res => {
                                                this.setState({stage1Confirmation: true});
                                                const speakerName = this.props.speaker ? this.props.speaker.post.post_title + "" : "";
                                                const productName = this.props.product && this.props.pagetype === "product" ? " - " + this.props.product.post_title : "";
                                                ga('gtm1.send', 'event', 'Book', 'Skriv en besked', speakerName + productName, 0);
                                                ReactPixel.trackCustom("bookingformular", {
                                                    bookingType: "Skriv en besked",
                                                    product: speakerName + productName,
                                                    price: 0
                                                });
                                            })
                                            .catch(error => {
                                                //console.log(error);
                                                this.setState({stage1Error: true})
                                            });
                                    }
                                }}
                        >

                            <div className="input-box bg-light-grey text-center p-3 mb-2">
                                <div className="row">

                                    <div className="col-12 col-md-6 mb-3">
                                        <TextInput
                                            label={"Kontaktperson"}
                                            placeholder={"Eks. Maybritt Toft Bisp"}
                                            onChange={booker_name => setParrentState({booker_name})}
                                            value={booker_name}
                                        />
                                    </div>

                                    <div className="col-12 col-md-6 mb-2">
                                        <TextInput
                                            label={"Firmanavn"}
                                            placeholder={"Eks. YOUANDX Aps"}
                                            onChange={booker_companyName => setParrentState({booker_companyName})}
                                            value={booker_companyName}
                                        />
                                    </div>

                                    <div className="col-12 col-md-6 mb-2">
                                        <TextInput
                                            label={"Telefon nummer"}
                                            placeholder={"Eks. +4570200449"}
                                            onChange={booker_phone => setParrentState({booker_phone})}
                                            value={booker_phone}
                                        />
                                    </div>

                                    <div className="col-12 col-md-6 mb-2">
                                        <TextInput
                                            label={"Email"}
                                            placeholder={"Eks. mtb@youandx.com"}
                                            onChange={booker_email => setParrentState({booker_email})}
                                            value={booker_email}
                                        />
                                    </div>


                                    <div className="col-12">
                                        <textarea
                                            rows="8"
                                            className="flex-grow-1 input-container"
                                            style={{
                                                backgroundColor: 'rgba(0,0,0,0)',
                                                color: '#ffffff',
                                            }}
                                            placeholder={`Skriv din besked til ${speaker.post && speaker.post.post_title} her...`}

                                            value={booker_message}
                                            onChange={(e) => {
                                                setParrentState({booker_message: e.target.value})
                                            }}/>
                                    </div>


                                </div>
                            </div>


                            <button
                                className={`btn btn-large w-100 ${submitReady ? "btn-success" : "btn-dark disabled"}`}
                                style={{
                                    borderRadius: '0 0 6px 6px'
                                }}
                                type={"submit"}
                            >
                                <h5 className="font-weight-bold p-1">Send besked</h5>
                            </button>
                        </form>
                }

            </Overlay>
        );
    }
}

export default QuestionOverlay;
