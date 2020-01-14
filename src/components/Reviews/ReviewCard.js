import React from 'react';
import {FaRegStar, FaStar, FaStarHalfAlt} from "react-icons/fa";
import {parseShortCodes} from "../../functions/parserFunctions";

const getStars = (rating) => {
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
export default function ({rating}) {
    return (
        <div className="reviewCard pb-4 mb-4">
            <div className="reviewStars mb-2">{getStars(parseFloat(rating.meta.rating_entry_average))}</div>
            <div className="reviewContent mb-2">{parseShortCodes(rating.post_content)}</div>
            <h6 className="reviewWriter">
                {rating.meta.rating_contact_name ? rating.meta.rating_contact_name : rating.meta.rating_name_first + ' ' + rating.meta.rating_name_last}
                {!!rating.meta.rating_contact_title && ', ' + rating.meta.rating_contact_title}{rating.meta.rating_company_name ? ' - ' + rating.meta.rating_company_name : ' - ' + rating.meta.rating_company}
            </h6>
        </div>
    )

}