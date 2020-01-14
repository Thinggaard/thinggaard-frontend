import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {API, TOKEN} from "../../constants";
import {StatusContext, UserContext} from "../../store/Store";
import Page404 from "../Page404";
import {getUserToken} from "../../functions/userFunctions";
import BookingsTable from "./BookingsTable";
import Price from "../../components/Utility/Price";
import {insertParam} from "../../functions/parserFunctions";
import {parse} from "query-string";


// TODO : This to replace all backend editing of bookings

const userToken = getUserToken();

const statusList = [
    {name: "booked", label : "Færdigbooket"},
    {name: "confirmed", label : "Bekræftet af speaker"},
    {name: "pending", label : "Afventer speaker"},
    {name: "initiated", label : "Ikke færdiggjort af kunde"},
    {name: "cancelinternal", label : "Annuleret"},
];

const ShowBookingsPage = () => {

    const [user] = useContext(UserContext);
    const isAdmin = !!user.roles && user.roles.includes("administrator");

    const [, dispatchStatus] = useContext(StatusContext);

    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [dateType, setDateType] = useState("event");
    const [bookings, setBookings] = useState([]);
    const [totals, setTotals] = useState({});
    const [sortBy, setSortBy] = useState("post_datestamp");
    const [sortNumeric, setSortNumeric] = useState(true);
    const [order, setOrder] = useState(-1);
    const [statusFilter, setStatusFilter] = useState([]);
    const [speaker, setSpeaker] = useState("");
    const [category, setCategory] = useState("");
    const [tag, setTag] = useState("");
    const [filterOptions, setFilterOptions] = useState({});
    const [numParams, setNumParams] = useState({total: 0, loaded: 0});


    const statusFilterChange = (status) => {
        if (statusFilter.includes(status)){
            setStatusFilter(p => (
                p.filter(x => x !== status)
            ));
        } else {
            setStatusFilter(p => [...p, status]);
        }
    };

    const getBookings = () => {
        dispatchStatus({type: "addConnection"});
        axios.get(API + "bookings/?"+TOKEN, {
            headers: {
                Authorization: "Bearer " + userToken,
            },
            params : {
                minDate,
                maxDate,
                dateType,
                bookingStatus : statusFilter,
                speaker,
                category,
                tag,
            },
        }).then(res => {
            if (res.data.status && res.data.results){
                sortBookings(res.data.results.bookings, sortBy, sortNumeric, true);
                setTotals(res.data.results.totals);
            }
        }).catch(err => console.log(err)).finally(() => {
            dispatchStatus({type: "removeConnection"});
        });
    };

    const onMount = () => {
        // Get filter options
        dispatchStatus({type: "addConnection"});
        axios.get(API + "filter-options/?"+TOKEN, {
            headers: {
                Authorization: "Bearer " + userToken,
            }
        }).then(res => {
            if (res.data.status && res.data.results){
                setFilterOptions(res.data.results);
            }
        }).catch(err => console.log(err)).finally(() => {
            dispatchStatus({type: "removeConnection"});
        });

        // Check for parameters :
        const parsed = parse(window.location.search);
        const keys = Object.keys(parsed).filter((key) => !!parsed[key]);
        keys.forEach(key => {
            if(key === "category") setCategory(parsed[key]);
            if(key === "minDate") setMinDate(parsed[key]);
            if(key === "maxDate") setMaxDate(parsed[key]);
            if(key === "dateType") setDateType(parsed[key]);
            if(key === "speaker") setSpeaker(parsed[key]);
            if(key === "tag") setTag(parsed[key]);
            if(key === "statusFilter") setStatusFilter(parsed[key].split(","));
            if(key === "sortBy") setSortBy(parsed[key]);
            if(key === "order") setOrder(parsed[key] === "1" ? 1 : -1);
            setNumParams(p => ({total: keys.length , loaded: p.loaded+1 }));
        });
    };
    useEffect(onMount, []);

    const onParamUpdate = () => {
        if(!!numParams.loaded) getBookings();
    };
    useEffect(onParamUpdate, [numParams]);

    const onStatusFilterUpdate = () => {
        insertParam("statusFilter", statusFilter.join(","));
    };
    useEffect(onStatusFilterUpdate, [statusFilter]);


    const changeDate = (e, type) => {
        const setter = type === "min" ? setMinDate : setMaxDate;
        setter(e.target.value);
    };

    const changeDateType = (type) => {
        setDateType(type);
    };

    const sortBookings = (entries, sort, numeric, newFetch = false) => {
        if (sort === sortBy && !newFetch) {
           setOrder(order * -1);
           insertParam("order", order * -1);
           setBookings(entries.reverse());
        } else{
            insertParam("sortBy", sort);
            setSortBy(sort);
            if(!numeric)
                setBookings(
                    entries.sort((a, b) => {
                        const nameA = a.meta[sort][0]+"".toUpperCase();
                        const nameB = b.meta[sort][0]+"".toUpperCase();
                        if (nameA < nameB) {
                            return -1*order;
                        }
                        if (nameA > nameB) {
                            return order;
                        }
                        // names must be equal
                        return 0;
                    })
                );
            else setBookings(
                entries.sort((a, b) => (parseInt(a.meta[sort][0]) - parseInt(b.meta[sort][0])) * order)
            )
        }
    };

    if(!isAdmin) return <Page404/>;

    return(
        <div className="container-fluid" style={{paddingTop: '120px '}}>
            <div className="row">
                <div className="col-12 my-2">
                    <h1>Bookinger</h1>
                    <strong> Booking status :</strong>
                    {
                        statusList.map((status) => (
                            <span key={status.name}>
                                <input
                                    className="ml-4" type={"checkbox"}
                                    name={status.name} checked={statusFilter.includes(status.name)}
                                    onChange={() => {statusFilterChange(status.name)}}
                                /> &nbsp;
                                {status.label}
                            </span>
                        ))
                    }
                </div>
                <div className="col-12 my-2">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">
                                <strong>Speaker :</strong>
                            </div>
                        </div>
                        <select className="form-control" value={speaker} onChange={e => {setSpeaker(e.target.value); insertParam("speaker", e.target.value);}}>
                            <option value="">Alle</option>
                            {
                                filterOptions.speakers &&
                                filterOptions.speakers.map(speaker => (
                                    <option key={speaker.ID} value={speaker.ID}>{speaker.post_title}</option>
                                ))
                            }
                        </select>
                        <div className="input-group-prepend">
                            <div className="input-group-text">
                                <strong>Kategori :</strong>
                            </div>
                        </div>
                        <select className="form-control" value={category} onChange={e => {setCategory(e.target.value); insertParam("category", e.target.value);}}>
                            <option value="">Alle</option>
                            {
                                filterOptions.speaker_categories &&
                                filterOptions.speaker_categories.map(x => (
                                    <option key={x.term_id} value={x.term_id}>{x.name}</option>
                                ))
                            }
                        </select>
                        <div className="input-group-prepend">
                            <div className="input-group-text">
                                <strong>Tag :</strong>
                            </div>
                        </div>
                        <select className="form-control" value={tag} onChange={e => {setTag(e.target.value); insertParam("tag", e.target.value);}}>
                            <option value="">Alle</option>
                            {
                                filterOptions.speaker_tags &&
                                filterOptions.speaker_tags.map(x => (
                                    <option key={x.term_id} value={x.term_id}>{x.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="col-12 my-2">
                    <div className="input-group">

                        <select className={"form-control"} value={dateType} onChange={e => {changeDateType(e.target.value); insertParam("dateType", e.target.value);}}>
                            <option value="event">Eventdato</option>
                            <option value="booking">Bookingdato (oprettet)</option>
                            <option value="change">Ændringsdato</option>
                        </select>

                        <div className="input-group-prepend">
                            <span className="input-group-text">Fra :</span>
                        </div>
                        <input type="date" className="form-control" value={minDate} onChange={e => {changeDate(e, "min"); insertParam("minDate", e.target.value);}}/>
                        <div className="input-group-prepend">
                            <span className="input-group-text">Til :</span>
                        </div>
                        <input type="date" className="form-control" value={maxDate} onChange={e => {changeDate(e, "max"); insertParam("maxDate", e.target.value);}}/>

                        <button
                            className="btn btn-secondary form-control"
                            onClick={() => {
                                setStatusFilter([]);
                                setCategory("");
                                setSpeaker("");
                                setTag("");
                                setMaxDate("");
                                setMinDate("");
                                window.history.pushState('', '', window.location.pathname.split("?")[0]);
                            }}
                        >
                            Nulstil filtre
                        </button>
                        <button className="form-control btn-success" onClick={getBookings}>
                            Søg
                        </button>
                    </div>
                </div>
                <div className="col d-flex mt-4">
                    <h6 className="mr-5">Bookinger : {bookings.length}</h6>
                    <h6 className="mr-5">Total omsætning : <Price price={totals.total_revenue}/></h6>
                    <h6 className="mr-5">Total DB : <Price price={totals.total_db}/></h6>
                    <h6 className="mr-5">Alt/option + klik for at redigere en booking</h6>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <BookingsTable
                        rows={bookings} dateType={dateType} sortRows={sortBookings} order={order} setOrder={setOrder}
                        sortBy={sortBy} setSortBy={setSortBy} sortNumeric={sortNumeric} setSortNumeric={setSortNumeric}
                    />
                </div>
            </div>
        </div>
    )
};


export default ShowBookingsPage;
