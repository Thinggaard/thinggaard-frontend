import React from "react";

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
    <div className="shadow md:flex">
      <div
        className="w-full md:w-5/12 h-52 min-h-full bg-cover bg-center md:h-auto"
        style={{
          backgroundImage: `url(${post.images?.full[0]})`,
        }}
      />
      <div className="p-3 md:w-7/12">
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
        {/* <pre>{JSON.stringify(trip, null, 2)}</pre> */}
      </div>
    </div>
  );
};

export default Trip;
