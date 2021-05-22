import React from "react";
import { useParams } from "react-router";
import HotelRating from "../components/HotelRating";
import HotelReviews from "../components/HotelReviews";

const Details = () => {
  let { id } = useParams();

  return (
    <>
      <div className="relative">
        <div className="absolute top-4 right-4 h-36 w-36 rounded-full bg-themeColor grid place-content-center text-center">
          BOOK TIDLIG2.000,
        </div>
        <div
          className="h-80	w-full bg-cover bg-center "
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/715623/pexels-photo-715623.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500')",
          }}
        />
        <div className="p-4 bg-gray-200 md:absolute md:right-4 md:bottom-4 md:rounded text-center md:text-left">
          <div className="font-black line-through	">
            DKK <span className="">23.792,-</span>
          </div>
          <div className="font-black">
            DKK <span className="">21.792,-</span>
          </div>
          <div className="">Vælg værelser og bestil</div>
        </div>
      </div>
      <div className="p-3">
        <h2 className="mb-2 text-themeColor font-semibold text-xl">
          Hotel Name,
          <span className="ml-2 text-gray-500 font-normal text-sm">Sted</span>
        </h2>
        <HotelRating />
        <HotelReviews />
      </div>
    </>
  );
};

export default Details;

//https://thinggaard.dk/wp-json/thinggaard/v1/trips/combinations?destination_id=SBA&ages=30,30&duration=4&date=Sat%20Jan%2001%202022%2016:38:00%20GMT+0100%20(Central%20European%20Standard%20Time)&transport=0&token=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhYmFzZV9jcmVkZW50aWFscyI6eyJjb21wYW55X2lkIjoyLCJkYXRhYmFzZV9uYW1lIjoiVFJWMDA0X1RISU5HR0FBUkQifSwiZXhwIjoxNjIxNzgwNzI3fQ.ecV_wPrRjhgcpa0Sfg2yjPwiGiU7aFA1Ln-EDBLDo4w&accomodation_code=PEE&period_id=2225
