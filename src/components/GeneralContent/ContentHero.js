// File created : 03-05-2019 15:31
import React from 'react';
import './ContentHero.css';
import parse from 'html-react-parser';

const ContentHero = (props) => {

    const {
        title = "", subtitle = "", text = "", coverImage, coverFilter = "0",
        coverPosition = "", children, contentRight
    } = props;

    const alpha = (100 - parseInt(coverFilter))/100;

    return (
        <div className={"speakerHero"} style={{
            overflow: "hidden",
            minHeight: 550,
        }}>
            <div className="page-hero" style={{
                backgroundImage: `url(${coverImage})`,
                backgroundPosition: `center ${coverPosition ? coverPosition : "center"}`,
                width: '100%',
                heigth: "100%"
            }}>

            <div className="page-hero-content"
                style={{backgroundColor: "rgba(0, 0, 0, "+ alpha+ ")", height: "100%"}}
            >
                <div className="container">
                    <div className="speaker-head row">

                        <div className="col-12 col-lg-8">
                            <div style={{maxWidth: "650px"}}>
                                <h1>{title}</h1>
                                <div className="page-hero-subtitle mt-4 mb-4">
                                    {subtitle}
                                </div>

                                <div className={`speaker-post-content`}>
                                    {parse(text)}
                                </div>

                                {children}
                            </div>
                        </div>

                        {
                            contentRight &&
                            <div className="d-none d-lg-block col-4">
                                {contentRight}
                            </div>
                        }
                    </div>
                </div>
            </div>

            </div>
        </div>
    );

};

export default ContentHero;
