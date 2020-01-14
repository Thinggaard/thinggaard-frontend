import React from 'react';
import {Helmet} from "react-helmet-async";

function OurHelmet(props) {
    const {
        title = "YOUANDX - Foredrag, workshops og inspiration fra foredragsholdere og andre eksperter",
        fbTitle = "YOUANDX",
        fbDescription = "Danmarks førende formidler af foredrag, fra foredragsholdere hvor fagligheden er i fokus. Vores foredragsholdere er passionerede eksperter med grundig indsigt i deres respektive fagområder.",
        fbImage = "https://wp.youandx.com/wp-content/uploads/2018/02/Slide-1-Foredrag-Arne-Nielsson-til-nyt-website-e1556627041353-1600x900.jpg",
        fbUrl = "https://youandx.com",
        fbType = "article",
        fbTags = false,
        fbPublishedTime = false,
        fbModifiedTime = false,
        canonical = false,
        javaScripts = [],
    } = props;


    return (
        <Helmet><title>{title}</title>
            {canonical && <link rel="canonical" href={canonical}/>}
            <meta property="og:title" content={fbTitle}/>
            <meta property="og:type" content={fbType}/>
            <meta property="og:description" content={fbDescription}/>
            <meta property="og:url" content={fbUrl}/>
            <meta property="og:image" content={fbImage}/>
            <meta property="og:locale" content="da_DK"/>
            <meta property="og:site_name" content="YOUANDX"/>
            {!!javaScripts && javaScripts.map((js, i) => {
                // Prevents duplicate scripts :
                if (!!js.identifier) return null;

                return (<script key={i} src={js.source} async={js.async+""}/>);
            })
            }

            {fbPublishedTime && <meta property="og:published_time" content={fbPublishedTime}/>}
            {fbModifiedTime && <meta property="og:modified_time" content={fbModifiedTime}/>}
            {fbTags && fbTags.map((item, i) => {
                return (
                    <meta key={i} property="og:tag" content={item.name}/>
                )
            })}
            }
        </Helmet>
    );
}

export default OurHelmet;