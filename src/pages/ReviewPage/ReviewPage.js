import React, {useContext, useEffect, useState} from 'react';
import queryString from "query-string";
import './ReviewPage.css';
import {getBooking} from "../../functions/bookingFunctions";
import {StatusContext} from "../../store/Store";
import {getSpeaker} from "../../functions/APIFunctions";
import GravityForm from "../../components/Form/GravityForm/GravityForm";
import axios from "axios";
import {API, TOKEN} from "../../constants";
import {getUserToken} from "../../functions/userFunctions";

const ReviewPage = () => {

    const [, setStatus] = useContext(StatusContext);
    const [booking, setBooking] = useState(null);
    const [speaker, setSpeaker] = useState(null);
    const [ratingId, setRatingId] = useState(null);

    const parsed = queryString.parse(window.location.search);

    const onMount = () => {
        if (parsed.bookingid) {
            setStatus({type: "addConnection"});
            getBooking(parsed.bookingid, parsed.token).then(results => {
                setBooking(results.booking);

                //getSpeaker
                setStatus({type: "addConnection"});
                getSpeaker(results.booking.meta.booking_relation_speaker[0]).then(results => {
                    setSpeaker(results[0]);
                }).finally(() => {
                    setStatus({type: "removeConnection"})
                });

            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setStatus({type: "removeConnection"})
            });
        }
        else if(parsed.speakerid){
            setStatus({type: "addConnection"});
            getSpeaker(parsed.speakerid).then(results => {
                setSpeaker(results[0]);
            }).finally(() => {
                setStatus({type: "removeConnection"})
            });
        }
    };
    useEffect(onMount, []);

    const userToken = getUserToken();
    const authHeader =  !!userToken ? {Authorization: "Bearer " + getUserToken(),} :{};
    const onSubmit = (data, callback = () => {
    }) => {
        setStatus({type: "addConnection"});
        axios.post(API + "rating?" + TOKEN, data, {headers: authHeader}).then((res) => {
            if (!!res.data.results.rating) afterSubmit(res.data.results.rating);
            callback(res);
        }).catch(err => {
            callback(err);
        }).finally(() => {
            setStatus({type: "removeConnection"});
        })
    };

    const afterSubmit = (rating) => {
        setRatingId(rating.ID);
    };

    return (
        <div className="container" style={{paddingTop: 120}}>
            {
                !!speaker &&
                <div className={"row"}>
                    <div className="col-12 col-md-8">
                        <div className="entry-container">
                            {!!booking && <>
                            <h4 style={{marginBottom: 20}}>Kære {booking.meta.booking_customer_name[0] || booking.meta.booking_customer_name[0]}</h4>
                            <p>Vi bestræber os hele tiden på at give jer den bedste oplevelse, derfor håber vi i vil give os jeres feedback.</p>
                            </>}
                            <GravityForm
                                style={{borderTop: '1px solid rgba(255,255,255,0.4)', paddingTop: 30}}
                                onSubmit={onSubmit}
                                id={22}
                                successCallback={afterSubmit}
                                showTitle={false}
                                allowNew={false}
                                providedValues={{
                                    booking_token: parsed.token,
                                    rating_relation_booking: parsed.bookingid,
                                    rating_relation_rating: ratingId,
                                    rating_relation_speaker: speaker.post.ID,
                                }}
                            />
                            <p style={{marginTop: 30, textAlign: "center"}}><strong>Tusinde tak for din hjælp</strong>
                                <br/><br/>De bedste hilsener
                                <br/>{`YOUANDX og ${!!booking && booking.meta.booking_speaker_name}`}</p>

                        </div>
                    </div>
                    <div className="col">
                        <div className="entry-container p-2" style={{position: "sticky", top: 90}}>
                            {
                                !!speaker &&
                                <>
                                    <img className="rounded mb-2" src={speaker.images.medium[0]} width={"100%"}
                                         alt={speaker.post.post_title}/>
                                    <h4 style={{fontWeight: '400', letterSpacing: '2px'}}>{speaker.post.post_title}</h4>
                                    {!!booking && <>
                                        <h5 style={{
                                            fontSize: '19px',
                                            color: '#b1bfc4',
                                            fontWeight: '400'
                                        }}>{booking.meta.booking_product}</h5>
                                        <h5 style={{fontSize: '16px', textTransform: 'uppercase', fontWeight: '400'}}
                                            className={"green-marker"}>{booking.meta.booking_date_long}</h5>
                                    </>}
                                </>
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    )
};

export default ReviewPage
