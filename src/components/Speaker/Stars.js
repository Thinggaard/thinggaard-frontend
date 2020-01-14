import React from "react";
import {FaRegStar, FaStar, FaStarHalfAlt} from "react-icons/fa";


export default ({rating, max = 5}) => {
    let counter = parseFloat(rating);
    let stars = [];
    for (let i = 0; i < max; i++) {
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