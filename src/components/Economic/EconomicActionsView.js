import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import NumberInput from "../Form/NumberInput";
import Notification from "../Status/Notification";
import {API, TOKEN} from "../../constants";
import {StatusContext} from "../../store/Store";
import {getUserToken} from "../../functions/userFunctions";
import Overlay from "../Overlay/Overlay";
import TextInput from "../Form/TextInput";
import Price from "../Utility/Price";
import "./print.css";

const userToken = getUserToken();
const authHeader =  !!userToken ? {Authorization: "Bearer " + getUserToken(),} :{};

const EconomicActionsView = ({economicSecret, bookingFields, fees, updateField, noTax}) => {

    // INVOICE
    const [customerMatches, setCustomerMatches] = useState([]);
    const [customersFetched, setCustomersFetched] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(0);
    const [newCustomerNumber, setNewCustomerNumber] = useState(999999999);
    const [customerAlreadyExists, setCustomerAlreadyExists] = useState(false);
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [invoiced, setInvoiced] = useState(0);
    const [invoiceCreateSuccess, setInvoiceCreateSuccess] = useState(0);

    // SPEAKER INVOICE
    const [speakerMatches, setSpeakerMatches] = useState([]);
    const [speakersFetched, setSpeakersFetched] = useState(false);
    const [selectedSpeaker, setSelectedSpeaker] = useState(0);
    const [newSpeakerNumber, setNewSpeakerNumber] = useState(999999999);
    const [speakerAlreadyExists, setSpeakerAlreadyExists] = useState(false);
    const [editSpeakerInvoice, setEditSpeakerInvoice] = useState(false);
    const [speakerInvoiceNumber, setSpeakerInvoiceNumber] = useState("");
    const [speakerPaid, setSpeakerPaid] = useState("");
    // prices
    const [productText, setProductText] = useState("");
    const [paymentProduct, setPaymentProduct] = useState("0");
    const [paymentTransport, setPaymentTransport] = useState("0");
    const [paymentParticipants, setPaymentParticipants] = useState("0");

    const [print, setPrint] = useState(false);


    const [speaker, setSpeaker] = useState({});

    // ------------ SPEAKER INVOICE EDIT -------------------------
    // speaker info:
    const [speakerName, setSpeakerName] = useState("");
    const [speakerCVR, setSpeakerCVR] = useState("");
    const [speakerAddress, setSpeakerAddress] = useState("");
    const [speakerZip, setSpeakerZip] = useState("");
    const [speakerCity, setSpeakerCity] = useState("");
    const [speakerEmail, setSpeakerEmail] = useState("");
    const [speakerPhone, setSpeakerPhone] = useState("");
    const [speakerBank1, setSpeakerBank1] = useState("");
    const [speakerBank2, setSpeakerBank2] = useState("");
    const [speakerBankInternational, setSpeakerBankInternational] = useState(false);
    // dates:
    const [speakerInvoiceDate, setSpeakerInvoiceDate] = useState("");
    const [speakerInvoiceDelivery, setSpeakerInvoiceDelivery] = useState("");
    const [speakerInvoiceDueDate, setSpeakerInvoiceDueDate] = useState("");



    // --------- END speaker invoice edit ------------------------


    const [, dispatchStatus] = useContext(StatusContext);


    // We can use onmount because this component only renders after booking fetched.
    const onMount = () => {
        setInvoiced(parseInt(bookingFields.booking_accounting_invoiced));
        const numberInvoice = bookingFields.booking_accounting_invoicenumber;
        if (!isNaN(numberInvoice)) setInvoiceNumber(numberInvoice);
        if(!!bookingFields.booking_accounting_speakerpaid){
            const date = [
                bookingFields.booking_accounting_speakerpaid.slice(0, 4),
                bookingFields.booking_accounting_speakerpaid.slice(4, 6),
                bookingFields.booking_accounting_speakerpaid.slice(6, 8),
            ];
            setSpeakerPaid(date.join("-"));
        }
        setSpeakerInvoiceNumber(bookingFields.booking_accounting_speakerinvoicenumber);
    };
    useEffect(onMount, [bookingFields]);

    const onSpeakerPaidChange = () => {
        const date = speakerPaid.length === 10 ? speakerPaid.split("-").join("") : "";
        updateField("booking_accounting_speakerpaid", date);
    };
    useEffect(onSpeakerPaidChange, [speakerPaid]);

    const onInvoicedChange = () => {
        updateField("booking_accounting_invoiced", invoiced);
    };
    useEffect(onInvoicedChange, [invoiced]);

    const showSpeakerInvoice = () => {
        setPrint(true);
    };

    const onPrint = () => {
        if (print) {
            window.setTimeout(() => {window.print()}, 300);
            setPrint(false);
        }
    };
    useEffect(onPrint, [print]);

    const getEconomicCustomer = () => {
        if (customersFetched) return;

        const phone = bookingFields.booking_customer_phone;
        const cvr = bookingFields.booking_company_cvr;
        const company = bookingFields.booking_company_name;

        const queryParts = [];
        if (cvr) {
            queryParts.push(`corporateIdentificationNumber$like:${cvr}`);
            queryParts.push(`customerNumber$like:${cvr}`);
            queryParts.push(`vatNumber$like:${cvr}`);
            setNewCustomerNumber(cvr);
        }
        if (phone) {
            queryParts.push(`customerNumber$like:${phone}`);
            queryParts.push(`mobilePhone$like:${phone}`);
            queryParts.push(`telephoneAndFaxNumber$like:${phone}`);
            if (!cvr) setNewCustomerNumber(parseInt('1' + phone.slice(-8)));
        }
        if (company) queryParts.push(`name$like:${company}`);

        const query = queryParts.join("$or:");

        axios.get('https://restapi.e-conomic.com/customers/?pagesize=50&filter=' + query, {
            headers: economicSecret
        }).then(res => {
            setCustomerMatches(res.data.collection);
            setCustomersFetched(true);
            setSpeakersFetched(false);
        });
    };

    const postInvoice = (customerNumber) => {

        const today = new Date();
        const month = ("0"+(today.getMonth() + 1)).slice(-2);
        const day = ("0"+(today.getDate())).slice(-2);
        const todayLong = `${today.getFullYear()}-${month}-${day}`;

        const productPrice = parseFloat(bookingFields.booking_payment_product_with_fee) || 0;
        const transportPrice = parseFloat(bookingFields.booking_payment_transport) || 0;
        const feeNoTax = parseFloat(bookingFields.booking_payment_fee_notax) || 0;
        const invoiceCost = parseFloat(bookingFields.booking_payment_invoicecost) || 0;
        const tax = parseFloat(bookingFields.booking_payment_tax) || 0;
        const revenue = parseFloat(bookingFields.booking_payment_pretax) || 0;
        const total = parseFloat(bookingFields.booking_payment_total) || 0;
        const expenses = parseFloat(bookingFields.booking_payment_speaker_pretax) || 0;
        const speakerPyamentProduct = parseFloat(bookingFields.booking_payment_speaker_pretransport) || 0;
        const participantsFee = parseFloat(bookingFields.booking_payment_participants_fee) || 0;
        const db = revenue - expenses;
        let participantsFeeSpeaker = 0;
        const speakerPercentage = fees.speaker_percentage || 10;

        if(bookingFields.booking_payment_fee_type === "percentage") {
            participantsFeeSpeaker*= (1 - speakerPercentage/100);
        }

        let productNumber = "1015";
        if (!!bookingFields.booking_entity) {
            if (bookingFields.booking_entity === "Foqus") productNumber = "1060";
            else if (tax === 0) productNumber = "1030";
        } else {
            if (noTax) productNumber = "1030";
        }

        const postData = {
            date: todayLong,
            currency: 'DKK',
            exchangeRate: 100,
            netAmount: revenue,
            netAmountInBaseCurrency: revenue,
            grossAmount: total,
            vatAmount: parseFloat(bookingFields.booking_payment_tax),
            roundingAmount: 0.00,
            costPriceInBaseCurrency: expenses,
            customerGroup: {
                customerGroupNumber: 1,
                self: 'https://restapi.e-conomic.com/customer-groups/1'
            },
            paymentTerms: {
                'paymentTermsNumber': 1,
                'daysOfCredit': 8,
                'name': 'Netto 8 dage',
                'paymentTermsType': 'net',
                'self': 'https://restapi.e-conomic.com/payment-terms/1'
            },
            'customer': {
                'customerNumber': parseInt(customerNumber)
            },
            'recipient': {
                'name': bookingFields.booking_company_name,
                'address': bookingFields.booking_company_address1,
                'zip': bookingFields.booking_company_zip,
                'city': bookingFields.booking_company_city,
                'country': bookingFields.booking_company_name || "Danmark",
                'vatZone': {
                    'name': 'Domestic',
                    'vatZoneNumber': 1,
                    'enabledForSpeaker': true,
                    'enabledForSupplier': true
                }
            },
            'layout': {
                'layoutNumber': 19
            },
            'notes': {
                'heading': bookingFields.booking_product,
                'textLine1': 'V/' + bookingFields.booking_speaker_name + ' - ' + bookingFields.booking_date_long,
                'textLine2': "Booket af " + bookingFields.booking_customer_name,
            },
            'lines': [{
                'lineNumber': 1,
                'sortKey': 1,
                'unit': {
                    'unitNumber': 1,
                    'name': 'stk'
                },
                'product': {
                    'productNumber': productNumber
                },
                'description': 'Foredrag',
                'quantity': 1.00,
                'unitNetPrice': productPrice,
                'discountPercentage': 0.00,
                'unitCostPrice': speakerPyamentProduct,
                'totalNetAmount': productPrice,
            }]
        };

        // ------------------ TILFØJ GEBYRER --------------------------
        let lineNumber = 2;
        if (transportPrice > 0){
            postData.lines.push({
               lineNumber,
               sortKey : lineNumber,
               unit :  {
                   unitNumber : 1,
                   name : "stk",
               },
               product : {
                   productNumber,
               },
               description : "transport",
               quantity : 1.00,
               unitNetPrice : transportPrice,
               discountPercentage : 0.00,
               unitCostPrice : transportPrice,
               totalNetAmount : transportPrice,
            });
            lineNumber++;
        }

        if (participantsFee > 0){
            postData.lines.push({
                lineNumber,
                sortKey : lineNumber,
                unit :  {
                    unitNumber : 1,
                    name : "stk",
                },
                product : {
                    productNumber,
                },
                description : "Tillæg for større antal deltagere",
                quantity : 1.00,
                unitNetPrice : participantsFee,
                discountPercentage : 0.00,
                unitCostPrice : participantsFeeSpeaker,
                totalNetAmount : participantsFee,
            });
            lineNumber++;
        }

        if (invoiceCost > 0){
            postData.lines.push({
               lineNumber,
               sortKey : lineNumber,
               unit :  {
                   unitNumber : 1,
                   name : "stk",
               },
               product : {
                   productNumber,
               },
               description : "Faktureringsgebyr",
               quantity : 1.00,
               unitNetPrice : invoiceCost,
               discountPercentage : 0.00,
               unitCostPrice : 0,
               totalNetAmount : invoiceCost,
            });
            lineNumber++;
        }


        if (feeNoTax > 0){
            postData.lines.push({
                lineNumber,
                sortKey : lineNumber,
                unit :  {
                    unitNumber : 1,
                    name : "stk",
                },
                product : {
                    productNumber,
                },
                description : "Lønsumsafgift",
                quantity : 1.00,
                unitNetPrice : feeNoTax,
                discountPercentage : 0.00,
                unitCostPrice : 0,
                totalNetAmount : feeNoTax,
            });
            lineNumber++;
        }

        axios.post('https://restapi.e-conomic.com/invoices/drafts', postData, {
            headers: economicSecret
        }).then(res => {
            setInvoiceCreateSuccess(1);
        }).catch( e => {
            console.log(e);
            setInvoiceCreateSuccess(-1);
        });

    };

    const createCustomer = () => {

        const doCreate = () => {

            const postData = {
                customerNumber: parseInt(newCustomerNumber),
                address: bookingFields.booking_company_address1,
                city: bookingFields.booking_company_city,
                country: bookingFields.booking_company_country || "Danmark",
                currency: "DKK",
                customerGroup: {
                    customerGroupNumber: 1,
                    self: 'https://restapi.e-conomic.com/customer-groups/1'
                },
                email: bookingFields.booking_customer_email,
                name: bookingFields.booking_company_name,
                telephoneAndFaxNumber: bookingFields.booking_customer_phone,
                vatZone: {
                    vatZoneNumber: 1,
                    self: 'https://restapi.e-conomic.com/vat-zones/1'
                },
                paymentTerms: {
                    paymentTermsNumber: 1,
                    self: 'https://restapi.e-conomic.com/payment-terms/1'
                },
            };

            if (!!bookingFields.booking_company_cvr) postData.corporateIdentificationNumber = bookingFields.booking_company_cvr + "";

            axios.post('https://restapi.e-conomic.com/customers/', postData, {
                headers: economicSecret
            }).then(() => {
                postInvoice(newCustomerNumber);
            });
        };

        // check if customer exists
        axios.get('https://restapi.e-conomic.com/customers/?filter=customerNumber$eq:' + newCustomerNumber, {
            headers: economicSecret
        }).then(res => {
            if (res.data.collection.length) {
                setCustomerAlreadyExists(true);
            } else doCreate();
        })
    };

    const createInvoice = () => {
        if (selectedCustomer === -1) createCustomer();
        else {
            const customerNumber = customerMatches[selectedCustomer].customerNumber;
            postInvoice(customerNumber);
        }
    };

    const createSpeaker = () => {

        const doCreate = () => {

            dispatchStatus({type: "addConnection"});

            axios.get(`${API}speakers/?speakerid=${bookingFields.booking_relation_speaker}${TOKEN}`, {
                headers : authHeader
            }).then(res => {

                if(res.data.status) return;
                const speaker = res.data.results.post;

                const bankAccount = speaker.speaker_payment_reg && speaker.speaker_paymnet_account ?
                    speaker.speaker_payment_reg + " " + speaker.speaker_paymnet_account
                    : speaker.speaker_paymnet_swift && speaker.speaker_payment_iban ?
                        "SWIFT: " + speaker.speaker_paymnet_swift + ", IBAN: " + speaker.speaker_payment_iban : "";

                const postData = {
                    supplierNumber: parseInt(newSpeakerNumber),
                    address: speaker.speaker_address_1,
                    city: speaker.speaker_city,
                    country: speaker.speaker_country || "Danmark",
                    currency: speaker.speaker_payment_currency || "DKK",
                    email: speaker.speaker_email,
                    name: speaker.post_title,
                    phone : speaker.speaker_phone,
                    vatZone: { //sættes til Indland, som udgangspunkt
                        vatZoneNumber: 1,
                        self: 'https://restapi.e-conomic.com/vat-zones/1'
                    },
                    paymentTerms: {
                        paymentTermsNumber: 1,
                        self: 'https://restapi.e-conomic.com/payment-terms/1'
                    },
                    supplierGroup : {  // sættes altid til "foredragsholder"
                        supplierGroupNumber : 2,
                        self : "https://restapi.e-conomic.com/supplier-groups/2",
                    },
                    bankAccount,
                };

                if (speaker.speaker_cvr) postData.corporateIdentificationNumber = speaker.speaker_cvr + "";

                dispatchStatus({type: "addConnection"});

                axios.post('https://restapi.e-conomic.com/suppliers/', postData, {
                    headers: economicSecret
                }).then(() => {
                    doEditSpeakerInvoice();
                }).finally(() => dispatchStatus({type: "removeConnection"}));
            }).finally(() => dispatchStatus({type: "removeConnection"}));


        };

        // check if supplier exists
        axios.get('https://restapi.e-conomic.com/suppliers/?filter=supplierNumber$eq:' + newSpeakerNumber, {
            headers: economicSecret
        }).then(res => {
            if (res.data.collection.length) {
                setSpeakerAlreadyExists(true);
            } else doCreate();
        })
    };

    const doEditSpeakerInvoice = () => {

        const economicSupplier = selectedSpeaker === -1 || !speakerMatches[selectedSpeaker] ? {} : speakerMatches[selectedSpeaker];
        setSpeakerName(economicSupplier.name || speaker.meta.speaker_company_name || speaker.post_title);

        if (economicSupplier.address && economicSupplier.zip && economicSupplier.city) {
            setSpeakerAddress(economicSupplier.address);
            setSpeakerZip(economicSupplier.zip);
            setSpeakerCity(economicSupplier.city);
        } else {
            setSpeakerAddress(speaker.meta.speaker_address_1);
            setSpeakerZip(speaker.meta.speaker_zip);
            setSpeakerCity(speaker.meta.speaker_city);
        }

        setSpeakerCVR(economicSupplier.corporateIdentificationNumber || speaker.meta.speaker_cvr);

        setSpeakerEmail(speaker.meta.speaker_email);
        setSpeakerPhone(speaker.meta.speaker_phone);

        if (speaker.meta.speaker_payment_reg && speaker.meta.speaker_payment_account){
            setSpeakerBank1(speaker.meta.speaker_payment_reg);
            setSpeakerBank2(speaker.meta.speaker_payment_account);
            setSpeakerBankInternational(false);
        } else if (speaker.meta.speaker_payment_swift && speaker.meta.speaker_payment_iban) {
            setSpeakerBank1(speaker.meta.speaker_payment_swift);
            setSpeakerBank2(speaker.meta.speaker_payment_iban);
            setSpeakerBankInternational(true);
        }

        setPaymentProduct(bookingFields.booking_payment_speaker_pretransport || "0");
        setPaymentTransport(bookingFields.booking_payment_transport || "0");
        const participantsPay = parseFloat(bookingFields.booking_payment_participants_fee) - parseFloat(bookingFields.booking_payment_speaker_fee_participants);
        setPaymentParticipants(isNaN(participantsPay) ? "0" : participantsPay + "");
        setProductText(`Foredrag hos ${bookingFields.booking_company_name || bookingFields.booking_customer_name} - ${bookingFields.booking_date_long}`);

        setSpeakerInvoiceNumber(invoiceNumber + "a");

        setEditSpeakerInvoice(true);
    };

    const createSpeakerInvoice = () => {
        if (selectedSpeaker === -1) createSpeaker();
        else doEditSpeakerInvoice();
    };

    const getSpeakerAccounts = () => {

        dispatchStatus({type: "addConnection"});

        axios.get(`${API}speakers/?speakerid=${bookingFields.booking_relation_speaker}&${TOKEN}`, {
            headers : authHeader
        }).then(res => {

            const theSpeaker = res.data.results[0].post;
            setSpeaker(theSpeaker);

            const speakerEmail = theSpeaker.meta.speaker_email;
            const speakerName = theSpeaker.post_title;
            const speakerCVR = theSpeaker.meta.speaker_cvr;
            const speakerBankAccount = theSpeaker.speaker_payment_account;

            if (speakersFetched) return;

            const queryParts = [];
            if (!!speakerEmail && !speakerEmail.includes("youandx.com")) {
                queryParts.push(`email$eq:${speakerEmail}`);
            }
            if (!!speakerName) queryParts.push(`name$like:${speakerName}`);
            if (!!speakerCVR) queryParts.push(`corporateIdentificationNumber$like:${speakerCVR}`);
            if (!!speakerBankAccount) queryParts.push(`bankAccount$like:${speakerBankAccount}`);

            const query = queryParts.join("$or:");

            axios.get('https://restapi.e-conomic.com/suppliers/?pagesize=50&filter=' + query, {
                headers: economicSecret
            }).then(res => {
                setSpeakerMatches(res.data.collection);
                setSpeakersFetched(true);
                setCustomersFetched(false);
            });

        }).finally(dispatchStatus({type: "removeConnection"}));
    };

    const speakerPayment = (parseFloat(paymentProduct) + parseFloat(paymentTransport) + parseFloat(paymentParticipants));


    return (
        <div>

            <div id={"speakerInvoice"} className={"container"}>
                <div className="row mt-3">

                    <div className="col-12 my-3 text-right">
                        <img src={"https://img.youandx.com/2019/12/YX_Final_Logo_Master_Logo_Positivt_Green_09012019-640x305.png"}
                             width={"20%"} alt="YOUANDX"
                        />
                    </div>

                    <div className="col-6">
                        <p>
                            {speakerName} <br/>
                            {speakerAddress} <br/>
                            {speakerZip} {speakerCity} <br/>
                            {speakerCVR}
                        </p>
                        <p>
                            {speakerEmail} <br/>
                            {speakerPhone}
                        </p>
                    </div>
                    <div className="col-6 text-right">
                        <p>
                            Sydbank <br/>
                            Reg. nr.: 6813 <br/>
                            Kontonr.: 1106913 <br/>
                            IBAN no.: DK6668130001106913 <br/>
                            Swift code: SYBKDK22 <br/>
                        </p>
                        <div className="row mb-3">
                            <div className="col-8 text-right">Udbetalingsnr.:</div>
                            <div className="col-4 text-right">{speakerInvoiceNumber}</div>
                            <div className="col-8 text-right">Bilagsdato:</div>
                            <div className="col-4 text-right">{speakerInvoiceDate}</div>
                            <div className="col-8 text-right">Leveringsdato:</div>
                            <div className="col-4 text-right">{speakerInvoiceDelivery}</div>
                            <div className="col-8 text-right">Forfaldsdato:</div>
                            <div className="col-4 text-right">{speakerInvoiceDueDate}</div>
                            <div className="col-8 text-right mt-3"><strong>Udbetaling til:</strong></div>
                            <div className="col-4 text-right"/>
                            <div className="col-8 text-right">{speakerBankInternational? "SWIFT:" : "reg.:"}</div>
                            <div className="col-4 text-right">{speakerBank1}</div>
                            <div className="col-8 text-right">{speakerBankInternational? "IBAN:" : "konto nr.:"}</div>
                            <div className="col-4 text-right">{speakerBank2}</div>
                        </div>
                    </div>

                </div>
                <div className="row mt-2">
                    <div className="col-12">
                        <h4 style={{width: "100%", borderBottom: "3px #666666 solid"}}>Udbetaling foredragsholder</h4>
                    </div>
                    <div className="col-9 mb-2">{productText}</div>
                    <div className={"col-1 text-right"}>kr.</div>
                    <div className="col-2 text-right"><Price prefix={""} price={paymentProduct}/></div>
                    {paymentParticipants !== "0" &&
                        <>
                        <div className="col-9 mb-2">Tillæg for ekstra deltagere</div>
                        <div className={"col-1 text-right"}>kr.</div>
                        <div className="col-2 text-right"><Price prefix={""} price={paymentParticipants}/></div>
                        </>
                    }
                    {paymentTransport !== "0" &&
                     <>
                         <div className="col-9 mb-2">Transport</div>
                         <div className={"col-1 text-right"}>kr.</div>
                         <div className="col-2 text-right"><Price prefix={""} price={paymentTransport}/></div>
                     </>
                    }
                </div>
                <div style={{borderBottom: "grey 1px solid"}} />
                <div className="row">
                    <div className="col-9"><strong>I alt</strong></div>
                    <div className="col-1 text-right"><strong>kr.</strong></div>
                    <div className="col-2 text-right"><strong><Price prefix={""} price={speakerPayment}/></strong></div>
                </div>
                {
                    !noTax &&
                        <>
                            <div className="row">
                                <div className="col-9"><strong>25% Moms</strong></div>
                                <div className="col-1 text-right"><strong>kr.</strong></div>
                                <div className="col-2 text-right"><strong><Price prefix={""} price={speakerPayment/4}/></strong></div>
                            </div>
                        </>
                }
                <div style={{borderBottom: "grey 1px solid"}} />

                <div className="row">
                    <div className="col-9"><strong>I alt udbetales</strong></div>
                    <div className="col-1 text-right"><strong>kr.</strong></div>
                    <div className="col-2 text-right"><strong><Price prefix={""} price={speakerPayment + (noTax ? 0 : speakerPayment/4)}/></strong></div>
                </div>

                <div
                    style={{
                        borderBottom: "1px solid black",
                        borderTop: "1px solid black",
                        marginBottom: 10,
                        height: 3,
                    }}
                />

                <div className="row">
                    <div className="col-12">
                        <small>OBS: Vi bestræber os på honoraret bliver udbetalt når foredraget er gennemført +3 bankdage, dog med forbehold for kundens betaling.</small>
                    </div>
                </div>

                <footer className={"text-center"} style={{
                    position: "fixed",
                    bottom: 40,
                    left: 0,
                    right:0,
                }}>
                    Sundkaj 7, 3. sal • dk-2150 Nordhavn • tlf. 40 20 87 31 <br/>
                    info@youandx.dk • www.youandx.dk • Sydbank 6813 1106913
                </footer>

            </div>


            <Notification type={invoiceCreateSuccess === 1 ? "success" : "warning"} open={invoiceCreateSuccess !== 0} onClose={() => setInvoiceCreateSuccess(0)}>
                {
                    invoiceCreateSuccess === 1 ? "Faktura oprettet!" : "Fejl! Kunnne ikke oprette faktura"
                }
            </Notification>


            <Overlay title={"Opret Udbetalingsbilag"} maxWidth={"100%"} open={editSpeakerInvoice} toggleOverlay={() => {setEditSpeakerInvoice(p => !p)}}>

                <div className="row" >

                    <div className="col-4">
                        <h4>Modtager</h4>
                        <TextInput
                            label={"Navn"}
                            value={speakerName}
                            name={"speakerName"}
                            onChange={val => setSpeakerName(val)}
                        />
                        <TextInput
                            label={"CVR"}
                            value={speakerCVR}
                            name={"speakerCVR"}
                            onChange={val => setSpeakerCVR(val)}
                        />
                        <TextInput
                            label={"Adresse"}
                            value={speakerAddress}
                            name={"speakerAddress"}
                            onChange={val => setSpeakerAddress(val)}
                        />
                        <div className="row">
                            <div className="col-3">
                                <TextInput
                                    label={"Postnummer"}
                                    value={speakerZip}
                                    name={"speakerZip"}
                                    onChange={val => setSpeakerZip(val)}
                                />
                            </div>
                            <div className="col">
                                <TextInput
                                    label={"By"}
                                    value={speakerCity}
                                    name={"speakerCity"}
                                    onChange={val => setSpeakerCity(val)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <TextInput
                                    label={"Email"}
                                    value={speakerEmail}
                                    name={"speakerEmail"}
                                    onChange={val => setSpeakerEmail(val)}
                                />
                            </div>
                            <div className="col-6">
                                <TextInput
                                    label={"Tlf."}
                                    value={speakerPhone}
                                    name={"speakerPhone"}
                                    onChange={val => setSpeakerPhone(val)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <TextInput
                                    label={speakerBankInternational ? "SWIFT" : "Reg."}
                                    value={speakerBank1}
                                    name={"speakerBank1"}
                                    onChange={val => setSpeakerBank1(val)}
                                />
                            </div>
                            <div className="col-6">
                                <TextInput
                                    label={speakerBankInternational ? "IBAN" : "Konto nr."}
                                    value={speakerBank2}
                                    name={"speakerBank2"}
                                    onChange={val => setSpeakerBank2(val)}
                                />
                            </div>
                        </div>
                    </div>



                    <div className="col-4">
                        <h4>Priser</h4>
                        <TextInput
                            label={"Honorar beskrivelse"}
                            value={productText}
                            name={"productText"}
                            onChange={val => setProductText(val)}
                        />
                        <TextInput
                            label={"Honorar"}
                            value={paymentProduct}
                            name={"paymentProduct"}
                            onChange={val => setPaymentProduct(val)}
                        />
                        <TextInput
                            label={"Tillæg for ekstra deltagere"}
                            value={paymentParticipants}
                            name={"paymentParticipants"}
                            onChange={val => setPaymentParticipants(val)}
                        />
                        <TextInput
                            label={"Transport"}
                            value={paymentTransport}
                            name={"paymentTransport"}
                            onChange={val => setPaymentTransport(val)}
                        />

                        <table className="table table-sm table-dark table-borderless w-100 mb-5 bg-transparent">
                            <tbody>

                            <tr>
                                <th>I alt:</th>
                                <th className={"text-right"}>
                                    <Price price={speakerPayment}/>
                                </th>
                            </tr>


                            {
                                !noTax &&
                                    <tr>
                                        <td>25% moms :</td>
                                        <td className={"text-right"}>
                                            <Price price={speakerPayment/4}/>
                                        </td>
                                    </tr>
                            }


                            <tr>
                                <th>Total:</th>
                                <th className={"text-right"}>
                                    <Price tax={noTax ? 0 : 1} price={noTax ? speakerPayment : speakerPayment + speakerPayment/4}/>
                                </th>
                            </tr>

                            </tbody>
                        </table>


                    </div>

                    <div className="col-4">

                        <h4>Detaljer</h4>

                        <div className="input-group pb-2">
                            <div className="input-container">
                                <div className={"input-label clearfix text-left"}>
                                    Bilagsdato
                                </div>
                                <input type="date" className="form-control" value={speakerInvoiceDate} name={"speakerInvoiceDate"} onChange={e => {setSpeakerInvoiceDate(e.target.value)}}/>
                            </div>
                        </div>

                        <div className="input-group pb-2">
                            <div className="input-container">
                                <div className={"input-label clearfix text-left"}>
                                    Leveringsdato
                                </div>
                                <input type="date" className="form-control" value={speakerInvoiceDelivery} name={"speakerInvoiceDelivery"} onChange={e => {setSpeakerInvoiceDelivery(e.target.value)}}/>
                            </div>
                        </div>

                        <div className="input-group pb-2">
                            <div className="input-container">
                                <div className={"input-label clearfix text-left"}>
                                    Forfaldsdato
                                </div>
                                <input type="date" className="form-control" value={speakerInvoiceDueDate} name={"speakerInvoiceDueDate"} onChange={e => {setSpeakerInvoiceDueDate(e.target.value)}}/>
                            </div>
                        </div>

                        <TextInput
                            label={"Bilags nr."}
                            value={speakerInvoiceNumber}
                            name={"speakerInvoiceNumber"}
                            onChange={val => setSpeakerInvoiceNumber(val)}
                        />

                        <button className={"btn btn-success"} onClick={showSpeakerInvoice}>
                            Opret Bilag
                        </button>

                    </div>

                </div>

            </Overlay>


            <div className="row">
                <div className="col-auto pt-3">
                    <input
                        type="checkbox" className={"mr-2"} checked={!!invoiced}
                        onChange={() => {
                            setInvoiced(p => p === 0 ? 1 : 0);
                        }}
                    />
                    Kunde faktureret
                </div>
                <div className="col">
                    <NumberInput
                        value={invoiceNumber}
                        onChange={val => {
                            setInvoiceNumber(val);
                            updateField("booking_accounting_invoicenumber", val);
                        }}
                        label={"Faktura nr."}
                    />
                </div>

                    <div className="col-auto pt-3">
                        <button type="button" onClick={getEconomicCustomer} className="btn btn-primary ml-2">
                            Ny
                        </button>
                    </div>

            </div>

            <div className="row">

                <div className="col">
                    <div className="input-group pb-2">
                        <div className="input-container">
                            <div className={"input-label clearfix text-left"}>
                                Speaker betalt
                            </div>
                            <input type="date" className="form-control" value={speakerPaid} onChange={e => {setSpeakerPaid(e.target.value)}}/>
                        </div>
                    </div>
                </div>

                <div className="col">
                    <TextInput
                        className="col" value={speakerInvoiceNumber}
                        onChange={val => {
                            setSpeakerInvoiceNumber(val);
                            updateField("booking_accounting_speakerinvoicenumber", val);
                        }}
                        label={"Udbetaling nr."}
                    />
                </div>

                <div className="col-auto pt-3">
                    <button type="button" onClick={getSpeakerAccounts} className="btn btn-primary ml-2">
                        Ny
                    </button>
                </div>
            </div>


            {customersFetched &&
            <div className={"mt-3"}>
                Fandt {customerMatches.length} matchende {customerMatches.length === 1 ? "kunde" : "kunder"} i E-conomic

                <ul style={{listStyle: "none"}}>
                    {
                        customerMatches.map((customer, i) => (
                            <li key={i}>
                                <input
                                    type="radio" className="mr-2" checked={selectedCustomer === i}
                                    onClick={() => {
                                        setSelectedCustomer(i)
                                    }}
                                    onChange={() => {}} //prevent warnings
                                />
                                #{customer.customerNumber} : {customer.name}
                            </li>
                        ))
                    }
                    <li>
                        <input
                            type="radio" className="mr-2" checked={selectedCustomer === -1}
                            onClick={() => {
                                setSelectedCustomer(-1)
                            }}
                            onChange={() => {}} //prevent warnings
                        />
                        Opret ny kunde : #
                        <input type={"number"} className={"w-25"} placeholder={"kunde nr."} min={1} max={999999999}
                               value={newCustomerNumber} onChange={e => {
                            setNewCustomerNumber(e.target.value);
                        }}/>
                    </li>
                    {
                        customerAlreadyExists &&
                        <li className="text-danger">En kunde med dette kundenummer findes allerede</li>
                    }
                </ul>

                <button className="btn btn-success" type="button" onClick={createInvoice}>
                    Opret faktura til valgte kunde
                </button>

            </div>
            }

            {speakersFetched &&
            <div className={"mt-3"}>
                Fandt {speakerMatches.length} matchende {speakerMatches.length === 1 ? "leverandør" : "leverandører"} i E-conomic

                <ul style={{listStyle: "none"}}>
                    {
                        speakerMatches.map((speaker, i) => (
                            <li key={i}>
                                <input
                                    type="radio" className="mr-2" checked={selectedSpeaker === i}
                                    onClick={() => {
                                        setSelectedSpeaker(i)
                                    }}
                                    onChange={() => {}} //prevent warnings
                                />
                                #{speaker.supplierNumber} : {speaker.name}
                            </li>
                        ))
                    }
                    <li>
                        <input
                            type="radio" className="mr-2" checked={selectedSpeaker === -1}
                            onClick={() => {
                                setSelectedSpeaker(-1)
                            }}
                            onChange={() => {}} //prevent warnings
                        />
                        Opret ny leverandør : #
                        <input type={"number"} className={"w-25"} placeholder={"kunde nr."} min={1} max={999999999}
                               value={newSpeakerNumber} onChange={e => {
                            setNewSpeakerNumber(e.target.value);
                        }}/>
                    </li>
                    {
                        speakerAlreadyExists &&
                        <li className="text-danger">En leverandør med dette nummer findes allerede</li>
                    }
                </ul>

                <button className="btn btn-success" type="button" onClick={createSpeakerInvoice}>
                    Opret betalingbilag til valgte leverandør
                </button>

            </div>
            }
        </div>
    )
};

export default EconomicActionsView;
