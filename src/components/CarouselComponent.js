import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

const CarouselComponent = ({ images }) => {
  return (
    <Carousel
      className="md:w-5/12 md:min-h-full	"
      showIndicators={false}
      showThumbs={false}
    >
      {images?.map((img) => (
        <div
          className="w-full h-52 md:h-64 bg-cover bg-center"
          style={{
            backgroundImage: `url(${img.url})`,
          }}
        />
      ))}
    </Carousel>
  );
};

export default CarouselComponent;
