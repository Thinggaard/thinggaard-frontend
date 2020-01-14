// File created : 15-05-2019 10:29
import React from 'react';
import GalleryGrid from "../Lists/GalleryGrid";

const SpeakerGallery = props => {

    const {gallery} = props;

    return (
        <>
            {gallery && !!gallery.length &&
            <GalleryGrid images={gallery.map(img => ({
                thumb: img.sizes.thumbnail,
                title: img.title,
                img: img.url
            }))}/>
            }
        </>
    );

};

export default SpeakerGallery;
