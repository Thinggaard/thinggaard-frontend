// File created : 27-03-2019 12:44
import React, {useContext, useEffect, useState} from 'react';
import {API, TOKEN} from "../../constants";
import axios from "axios";
import {Link} from "react-router-dom";
import Carousel from "../../components/Carousel/Carousel";
import SpeakerHero from "../../components/Speaker/SpeakerHero";
import parse from 'html-react-parser';
import Tabs from "../../components/Filtering/Tabs";
import SpeakerGallery from "../../components/Speaker/SpeakerGallery";
import SideBar from "../../components/SideBar/SideBar";
import ReactPlayer from "react-player";
import OurHelmet from "../../components/Utility/OurHelmet";
import OfferBanner from "../../components/Speaker/OfferBanner";
import moment from "moment-timezone";
import ProductItem from "../../components/Lists/ProductItem";
import {StatusContext, UserContext} from "../../store/Store";
import ReviewCard from "../../components/Reviews/ReviewCard";
import SpeakerDetails from "../../components/Speaker/SpeakerDetails";
import {authHeader} from "../../functions/userFunctions";
import {FaLock} from "react-icons/fa";

function SpeakerProductPage(props) {

    const heyStateObject = {
        speaker: [],
        coverImage: "",
        coverVideo: "",
        coverFilter: "",
        coverPosition: "",
        fullWidthImage: true,
        tags: [],
        primaryCategory: "",
    };

    const [tab, setTab] = useState("about");
    const [relatedSpeaker, setRelatedSpeaker] = useState([]);

    const [heyState, setHeyState] = useState(heyStateObject);

    const [user] = useContext(UserContext);
    const isAdmin = !!user.roles && user.roles.includes("administrator");

    function heyComponentDidUpdate() {
        getSpeaker(API + "speakers/?speakerid=" + props.id + "&products=true&ratings=true&" + TOKEN);
        setTab("about");
    }

    useEffect(heyComponentDidUpdate, [props.id]);

    const [, setStatus] = useContext(StatusContext);

    const getSpeaker = (url) => {
        setStatus({type: 'addConnection'});
        axios.get(url, {headers: authHeader})
            .then(res => {
                const speaker = res.data.results;

                const terms = speaker[0].post.terms;

                let coverImage = "";
                let coverVideo = "";
                let coverFilter = "";
                let coverPosition = "";
                let fullWidth = false;

                if (speaker[0].images && speaker[0].images.header) {
                    coverImage = speaker[0].images.header[0];
                    if (speaker[0].post.meta.speaker_featured_video) coverVideo = speaker[0].post.meta.speaker_featured_video;
                    if (speaker[0].post.meta.header_filter) coverFilter = speaker[0].post.meta.header_filter;
                    if (speaker[0].post.meta.header_position) coverPosition = speaker[0].post.meta.header_position;
                    fullWidth = true
                } else if (terms && terms.length) {
                    for (let i = 0; i < terms.length; i++) {
                        if (!!terms[i].images && !!terms[i].images[0]) {
                            coverImage = terms[i].images[0].url;
                            break;
                        }
                    }
                }
                if (speaker[0].post.primary_category) {
                    setStatus({type: 'addConnection'});
                    axios.get(API + "speakers/?numberposts=9&orderby=rand&order=ASC&primary=" + speaker[0].post.primary_category.term_id + "&" + TOKEN + "&exclude=" + speaker[0].post.ID)
                        .then(res => {
                            const related = res.data.results;
                            setRelatedSpeaker(related)
                        }).finally(() => setStatus({type: 'removeConnection'}));
                }


                setHeyState({
                    speaker: speaker,
                    coverImage: coverImage,
                    coverVideo: coverVideo,
                    coverFilter: coverFilter,
                    coverPosition: coverPosition,
                    fullWidthImage: fullWidth
                })
            }).finally(() => setStatus({type: 'removeConnection'}));
    };


    const speaker = heyState.speaker[0];
    const today = moment().format("YYYYMMDD");

    return (
        <div className="SpeakerPage">
            {!!speaker && <OurHelmet
                title={speaker.post.post_title}
                fbTitle={speaker.post.post_title}
                fbDescription={speaker.post.post_teaser}
                fbImage={speaker.images.medium[0]}
                fbType="article"
                fbPublishedTime={speaker.post.post_date}
                fbModifiedTime={speaker.post.post_modified}
                fbTags={speaker.post.terms}
                fbUrl={speaker.link}
                javaScripts={[
                    {
                        source: 'https://js.stripe.com/v3/',
                        async: true,
                        defer: false,
                        identifier: window.Stripe,
                    }
                ]}
            />
            }
            {
                !!speaker && <SpeakerHero
                    title={<>
                            {speaker.private && <FaLock style={{marginRight: 10}}/>}
                            {speaker.post.post_title}
                        </>}
                    text={speaker.post.post_teaser}
                    coverVideo={heyState.coverVideo}
                    coverImage={heyState.coverImage}
                    coverFilter={heyState.coverFilter}
                    coverPosition={heyState.coverPosition}
                    readMore={true}
                    thumbnail={!heyState.fullWidthImage && speaker.images.medium[0]}
                    anchorLinkCallBack={() => setTab("about")}
                    subtitle={
                        <>
                            <Link
                                to={speaker.post.primary_category.path}>
                                {speaker.post.primary_category.name}

                            </Link>
                            {speaker.post.terms && speaker.post.terms.map((term, i) => {
                                if (i < 2)
                                    return (
                                        !!term &&
                                        <Link className={"speaker-hero-subtitle-tag"} key={i}
                                              to={term.path}>{term.name}</Link>
                                    );
                                return null;
                            })}
                        </>
                    }
                />
            }

            {speaker && !!speaker.post.meta.speaker_campaign_heading &&
            today >= parseInt(speaker.post.meta.speaker_campaign_start_date) && today <= parseInt(speaker.post.meta.speaker_campaign_end_date) &&
            <div className="container">
                <OfferBanner heading={speaker.post.meta.speaker_campaign_heading}>
                    {speaker.post.meta.speaker_campaign_text}
                </OfferBanner>
            </div>
            }


            <div className="container mb-4">
                <div className="row justify-content-between">
                    <div className="col-12 col-lg-7 order-2 order-lg-0 pr-lg-5 mt-5" id={"readMore"}>

                        {speaker &&
                        <>
                            <div className={"speaker-tabs"}>
                                <Tabs value={tab}
                                      scroll={"off"}
                                      tabs={[
                                          {
                                              value: "about",
                                              label: "Om"
                                          },
                                          !!speaker.post.products && {
                                              value: "products",
                                              label: "Produkter"
                                          },
                                          !!speaker.post.meta.speaker_gallery &&
                                          {
                                              value: "gallery",
                                              label: "Galleri"
                                          },
                                          (!!speaker.post.meta.speaker_videos || speaker.post.meta.speaker_featured_video) &&
                                          {
                                              value: "videos",
                                              label: "Videoer"
                                          },
                                          (!!speaker.post.ratings || isAdmin) &&
                                          {
                                              value: "ratings",
                                              label: "Ratings"
                                          },
                                      ]}
                                      onChange={(i) => {
                                          setTab(i)
                                      }}
                                />
                            </div>

                            {
                                tab === "about" &&
                                <>
                                    <div className="mt-4">
                                        {!!speaker.post && <h3 className={"h5 mb-3 text-uppercase"}
                                            style={{letterSpacing: 1.5}}>Om {speaker.post.post_title}</h3>}
                                        {parse(speaker.post.post_content)}
                                        <div className="row mt-2 mt-lg-3">
                                            <SpeakerDetails speaker={speaker}/>
                                        </div>
                                    </div>
                                </>

                            }
                            {
                                tab === "products" &&
                                <div className="mt-4">
                                    {!!speaker.post &&
                                    <h3 className={"h5 mb-3 text-uppercase"} style={{letterSpacing: 1.5}}>Produkter
                                        fra {speaker.post.post_title}</h3>}

                                    {
                                        speaker.post.products.map((post, i) => (
                                            <ProductItem key={i} post={post} speakerImages={speaker.images}/>
                                        ))
                                    }

                                </div>
                            }
                            {
                                tab === "gallery" &&
                                <div className="mt-4">
                                    {!!speaker.post &&
                                    <h3 className={"h5 mb-3 text-uppercase"} style={{letterSpacing: 1.5}}>Billeder
                                        af {speaker.post.post_title}</h3>}
                                    <SpeakerGallery
                                        gallery={speaker.post.meta.speaker_gallery || []}
                                    />
                                </div>
                            }
                            {
                                tab === "videos" &&
                                <div className="mt-4">
                                    {!!speaker.post &&
                                    <h3 className={"h5 mb-3 text-uppercase"} style={{letterSpacing: 1.5}}>Videoer
                                        med {speaker.post.post_title}</h3>}
                                    <div className="react-player-wrapper">
                                        <ReactPlayer className="react-player" playing={false} controls={true}
                                                     url={speaker.post.meta.speaker_featured_video}
                                                     width='100%' height='100%'/>
                                    </div>
                                    {speaker.post.meta.speaker_videos && speaker.post.meta.speaker_videos.map((video, i) => (
                                        <div className="react-player-wrapper" key={i}>
                                            <ReactPlayer key={i} className="react-player" playing={false} controls={true}
                                                         url={video.url}
                                                         width='100%' height='100%'/>
                                        </div>
                                    ))}
                                </div>
                            }

                            {
                                !!speaker && (!!speaker.post.ratings || isAdmin) && tab === "ratings" &&
                                <div className="mt-4">
                                    <h3 className={"h5 mb-3 text-uppercase"} style={{letterSpacing: 1.5}}>
                                        Ratings af {speaker.post.post_title}
                                    </h3>
                                    {isAdmin && <Link className={"link"} to={`/review-rating-af-ekspert/?speakerid=${speaker.post.ID}`}>Ny Rating</Link>}
                                    {!!speaker.post.ratings && speaker.post.ratings.map((rating, i) => (
                                        <ReviewCard rating={rating} key={i}/>
                                    ))}
                                </div>
                            }
                        </>
                        }
                    </div>

                    {speaker &&
                    <SideBar speaker={speaker} product={speaker.post.products[0]} pagetype={"speaker"}
                             regions={speaker.post.meta.speaker_region_teaser}/>
                    }
                </div>
            </div>

            <div className="container-fluid" id="products" style={{paddingTop: 45}}>

                {tab !== "products" && !!speaker &&
                <Carousel title={"produkter fra " + speaker.post.post_title} key={'f' + speaker.post.ID}
                          posts={
                              speaker.post.products.map(post => ({
                                  link: post.link,
                                  title: post.post_title,
                                  teaser: post.meta.teaser_headline,
                                  image: post.images ? post.images.thumbnail
                                      : speaker.images && speaker.images.thumbnail ? speaker.images.thumbnail
                                          : post.terms ? [post.terms[Math.floor(Math.random() * post.terms.length)].images[0].sizes['home-speaker']]
                                              : [''],
                                  terms: post.terms,
                                  type: post.meta.product_appetizer ? "appetizer" : post.meta.product_type === "workshop" ? "workshop" : "foredrag"
                              }))
                          }
                />
                }
            </div>

            <div className="container-fluid" id={"related"}>
                {
                    (!!relatedSpeaker) &&

                    <Carousel title={"Relaterede foredragsholdere"}
                              posts={relatedSpeaker.map(speaker => (
                                  {
                                      link: speaker.link,
                                      title: speaker.post.post_title,
                                      teaser: speaker.post.meta.teaser_headline,
                                      image: speaker.images ? speaker.images.thumbnail : "",
                                      terms: speaker.post.categories,
                                      video: speaker.post.meta.speaker_featured_video
                                  }
                              ))}
                    />

                }
            </div>
        </div>
    );
}

export default SpeakerProductPage;
