import { Link } from "react-router-dom";
import React from "react";
import CarouselComponent from "./CarouselComponent";

const Trip = ({ trip }) => {
  const {
    destination_name,
    return_date,
    travel_length,
    room_description,
    minimum_price,
    post,
  } = trip;

  if (!post) {
    return null;
  }

  return (
    <div className="m-4 shadow  md:flex">
      <CarouselComponent images={post.meta.gallery_settings} />
      <Link to="/hotel/details" className="block md:w-7/12">
        <div div className="p-3 ">
          <h2 className="mb-2 text-themeColor font-semibold text-xl">
            {post?.post_title},
            <span className="ml-2 text-gray-500 font-normal text-sm">
              {destination_name}
            </span>
          </h2>

          <p>{room_description}</p>

          {post?.meta?.hotel_beskrivelse && (
            <div
              className="hotel_beskrivelse"
              dangerouslySetInnerHTML={{
                __html: post?.meta?.hotel_beskrivelse,
              }}
            ></div>
          )}

          {/* {post?.meta?.hotel_beliggenhed && (
          <div
            className="hotel_beliggenhed"
            dangerouslySetInnerHTML={{
              __html: post?.meta?.hotel_beliggenhed,
            }}
          ></div>
        )} */}

          {/* {post?.meta?.hotel_fakta && (
          <div
            className="hotel_fakta"
            dangerouslySetInnerHTML={{
              __html: post?.meta?.hotel_fakta,
            }}
          ></div>
        )} */}

          <div className="flex justify-between">
            <div>
              <p>Rejselængde: {travel_length}</p>
              <p className="m-0">Hjemrejse: {return_date}</p>
            </div>
            <p className="m-0 self-end text-red-500 font-black text-right">{`Pris: ${minimum_price} kr.`}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Trip;

// <Link to="/hotel/details" className="p-4 flex flex-col space-y-6 "></Link>
