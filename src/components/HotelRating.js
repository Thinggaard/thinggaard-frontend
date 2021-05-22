import React from "react";

const HotelRating = () => {
  const startCount = 3;
  var stars = [];
  for (var i = 0; i < startCount; i++) {
    stars.push("");
  }

  return (
    <div className="hotel-rating">
      Halvpension
      {stars.map((element, index) => {
        return (
          <span key={index} className="">
            *
          </span>
        );
      })}
    </div>
  );
};

export default HotelRating;
