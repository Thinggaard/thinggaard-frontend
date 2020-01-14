// File created : 29-03-2019 15:53
import React, {Component} from 'react';
import Overlay from "./Overlay";
import {FaRegStar, FaStar, FaStarHalfAlt} from "react-icons/fa";

export default class ReviewOverlay extends Component {
    state = {
        stage1Error: false,
        stage1Confirmation: false,

        userAgreement: false,

        booker_name: null,
        booker_companyName: null,
        booker_phone: null,
        booker_email: null,
        booker_message: null,
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

    render() {
        const {speaker, open} = this.props;

        return (
            <Overlay title={`Anmeldelser af ${speaker.post && speaker.post.post_title}`}
                     toggleOverlay={() => {
                         this.setState({stage1Confirmation: false});
                         this.props.toggleOverlay();
                     }}
                     open={open}>
                {
                    this.props.ratings.map((r, i) => {
                        const averageRating = parseInt(r.meta.rating_entry_average);
                        return (
                            <div className="reviewCard" key={i}>
                                <div className="reviewWriter">
                                    <p dangerouslySetInnerHTML={{__html: r.meta.rating_name_first + " siger: "}}/>
                                    {this.getStars(averageRating)}
                                </div>
                                <div className="reviewContent" dangerouslySetInnerHTML={{__html: r.post_content}}/>
                            </div>);
                    })
                }

            </Overlay>
        );
    }
}
