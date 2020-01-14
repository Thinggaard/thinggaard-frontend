// File created : 14-06-2019 12:03
import React, {useState} from 'react';
import {FaRegStar, FaStar} from "react-icons/fa";

const StarRatingInput = props => {
    const {
        initialRating = 0, maxStars = 5, field, className, onChange = () => {
        }
    } = props;
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(-1);

    const numberStars = props.value || rating;

    const stars = () => {
        let stars = [];

        for (let i = 0; i < maxStars; i++) {
            let type = numberStars > i ?
                <FaStar key={i} className="rating-star rating-star-full"/>
                : <FaRegStar key={i} className="rating-star rating-star-empty"/>
            ;
            if (hover >= 0) type = hover > i ?
                <FaStar key={i} className="rating-star rating-star-full"/>
                : <FaRegStar key={i} className="rating-star rating-star-empty"/>;

            stars.push(
                <span
                    key={i}
                    onClick={() => {
                        setRating(i + 1);
                        onChange(i + 1);
                    }}
                    onMouseEnter={() => {
                        setHover(i + 1)
                    }}
                >
                    {type}
                </span>
            )
        }

        return (
            <span
                onMouseLeave={() => {
                    setHover(-1)
                }}
            >
                {stars}
            </span>
        );

    };

    return (
        <div className={`form-group pointer ${className}`}>
            <label>
                {field.label} {field.isRequired && <span className="text-danger">*</span>}
            </label>
            <div style={{fontSize: 24}}>
                {stars()}
            </div>
            <small className="form-text text-muted">{field.description}</small>
        </div>
    );

};

export default StarRatingInput;
