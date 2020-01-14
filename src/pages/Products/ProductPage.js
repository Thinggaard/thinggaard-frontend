// File created : 27-03-2019 12:44
import React, {useContext, useEffect, useState} from 'react';
import {API, TOKEN} from "../../constants";
import axios from "axios";
import {Link} from "react-router-dom";
import Carousel from "../../components/Carousel/Carousel";
import SpeakerHero from "../../components/Speaker/SpeakerHero";
import SideBar from "../../components/SideBar/SideBar";
import OfferBanner from "../../components/Speaker/OfferBanner";
import moment from "moment-timezone";
import Tabs from "../../components/Filtering/Tabs";
import parse from "html-react-parser";
import SpeakerGallery from "../../components/Speaker/SpeakerGallery";
import ReactPlayer from "react-player";
import ProductItem from "../../components/Lists/ProductItem";
import {StatusContext} from "../../store/Store";
import ReviewCard from "../../components/Reviews/ReviewCard";
import OurHelmet from "../../components/Utility/OurHelmet";
import ProductTypePopOver from "../../components/PostBox/ProductTypePopOver";
import Price from "../../components/Utility/Price";
import SpeakerDetails from "../../components/Speaker/SpeakerDetails";
import {authHeader} from "../../functions/userFunctions";
import {FaLock} from "react-icons/fa";

function ProductPage(props) {
    const [tab, setTab] = useState("products");
    const [relatedSpeaker, setRelatedSpeaker] = useState([]);
    const [product, setProduct] = useState( null);

    const heyStateObject = {
        speaker: [],

        coverImage: "",
        coverFilter: "",
        coverPosition: "",
        fullWidthImage: true,
        product: null,
        tags: [],
        primaryCategory: "",
    };

    const productMeta = !!product ? product.meta : {};

    const [heyState, setHeyState] = useState(heyStateObject);

    function heyComponentDidUpdate() {
        getSpeaker(API + "speakers/?productid=" + props.id + "&products=true&ratings=true&" + TOKEN);
    }

    useEffect(heyComponentDidUpdate, [props.id]);

    const [, setStatus] = useContext(StatusContext);

    const getSpeaker = (url) => {
        setStatus({type: 'addConnection'});
        axios.get(url, {headers: authHeader})
            .then(res => {
                const speaker = res.data.results;

                const theProduct = res.data.results[0].post.products.filter(product => {
                    return product.ID === props.id;
                });

                const terms = speaker[0].post.terms;

                let coverImage = "";
                let coverFilter = "";
                let coverPosition = "";
                let fullWidth = false;

                if (theProduct[0].images && theProduct[0].images.header) {
                    coverImage = theProduct[0].images.header[0];
                    if (theProduct[0].meta.header_filter) coverFilter = theProduct[0].meta.header_filter;
                    if (theProduct[0].meta.header_position) coverPosition = theProduct[0].meta.header_position;
                    fullWidth = true
                } else if (speaker[0].images && speaker[0].images.header) {
                    coverImage = speaker[0].images.header[0];
                    if (speaker[0].post.meta.header_filter) coverFilter = speaker[0].post.meta.header_filter;
                    if (speaker[0].post.meta.header_position) coverPosition = speaker[0].post.meta.header_position;
                    fullWidth = true
                } else if (terms && terms.length) {
                    coverImage = terms[0].images[0].url
                }

                if (speaker[0].post.meta.primary_category) {
                    setStatus({type: 'addConnection'});
                    axios.get(API + "speakers/?numberposts=9&orderby=rand&order=ASC&categories=" + speaker[0].post.meta.primary_category.term_id + "&" + TOKEN + "&exclude=" + speaker[0].post.ID)
                        .then(res => {
                            setRelatedSpeaker(res.data.results)
                        }).finally(() => setStatus({type: 'removeConnection'}));
                }

                setHeyState({
                    ...heyState,
                    speaker: speaker,
                    coverImage: coverImage,
                    coverFilter: coverFilter,
                    coverPosition: coverPosition,
                    fullWidthImage: fullWidth
                });

                setProduct(theProduct && theProduct[0]);

            }).finally(() => setStatus({type: 'removeConnection'}));
    };

    const speaker = heyState.speaker[0];
    const today = moment().format("YYYYMMDD");

    return (
        <div className="Speaker">
            {(!!product && !!speaker) && <OurHelmet
                title={product.post_title}
                fbTitle={product.post_title}
                fbDescription={product.post_teaser}
                fbImage={speaker.images.medium[0]}
                fbType="article"
                fbPublishedTime={product.post_date}
                fbModifiedTime={product.post_modified}
                fbTags={product.terms}
                fbUrl={product.link}
                javaScripts={[
                    {
                        source: 'https://js.stripe.com/v3/',
                        async: true,
                        defer: false,
                        identifier: window.Stripe,
                    }]}
            />
            }
            {
                heyState.speaker.map((speaker) => (
                    <SpeakerHero
                        key={speaker.post.ID}
                        title={<>
                            {(product && product.meta.private) && <FaLock style={{marginRight: 10}}/>}
                            {product && product.post_title}
                        </>}
                        text={product && product.post_teaser}
                        coverImage={heyState.coverImage}
                        readMore={true}
                        coverFilter={heyState.coverFilter}
                        coverPosition={heyState.coverPosition}
                        thumbnail={!heyState.fullWidthImage && speaker.images.medium[0]}
                        appetizer={productMeta.product_appetizer}
                        anchorLinkCallBack={() => setTab("products")}
                        type={productMeta.product_appetizer ? "appetizer" : productMeta.product_type === "workshop" ? "workshop" : "foredrag"}
                        subtitle={
                            <>
                                {speaker.private && <FaLock style={{marginRight: 5}}/>}
                                <Link to={'/speakers/' + speaker.post.post_name}>
                                    <strong>{speaker.post.post_title}</strong>
                                </Link>

                                {speaker.post.meta.primary_category &&
                                <Link
                                    to={'/speakertags/' + speaker.post.meta.primary_category.slug}>
                                    {' / ' + speaker.post.meta.primary_category.name}
                                </Link>
                                }
                            </>
                        }
                    />
                ))
            }

            {
                speaker && !!product && !!speaker.post.meta.speaker_campaign_heading && speaker.post.meta.speaker_campaign_products.includes(product.ID) &&
                today >= parseInt(speaker.post.meta.speaker_campaign_start_date) && today <= parseInt(speaker.post.meta.speaker_campaign_end_date) &&
                <div className="container">
                    <OfferBanner heading={speaker.post.meta.speaker_campaign_heading}>
                        {speaker.post.meta.speaker_campaign_text}
                    </OfferBanner>
                </div>
            }

            {!!product && !!productMeta.product_campaign_heading &&
            today >= parseInt(productMeta.product_campaign_start_date) && today <= parseInt(productMeta.product_campaign_end_date) &&
            <div className="container">
                <OfferBanner heading={productMeta.product_campaign_heading}>
                    {productMeta.product_campaign_text}
                </OfferBanner>
            </div>
            }


            <div className="container mb-4">
                <div className="row justify-content-between">

                    <div className="col-12 col-lg-7 mt-5 order-2 order-lg-0 pr-lg-5 mt-5" id={"readMore"}>
                        {
                            !!product && !!speaker &&
                            <>
                                <div className={"speaker-tabs"}>
                                    <Tabs value={tab}
                                          scroll={"off"}
                                          tabs={[
                                              {
                                                  value: "about",
                                                  label: "Om"
                                              },
                                              {
                                                  value: "products",
                                                  label: productMeta.product_type === "workshop" ? "Workshoppen" : "Foredraget"
                                              },
                                              !!speaker.post.meta.speaker_gallery &&
                                              {
                                                  value: "gallery",
                                                  label: "Galleri"
                                              },
                                              (speaker.post.meta.speaker_videos || speaker.post.meta.speaker_featured_video) &&
                                              {
                                                  value: "videos",
                                                  label: "Videoer"
                                              },
                                              (!!speaker.post.ratings) &&
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
                                            {!!speaker.post &&
                                            <h3 className={"h5 mb-3 text-uppercase"} style={{letterSpacing: 1.5}}>
                                                Om <Link
                                                to={"/speakers/" + speaker.post.post_name}>{speaker.post.post_title}</Link>
                                            </h3>
                                            }
                                            {parse(speaker.post.post_content)}

                                            <div className="row mt-2 mt-lg-3">
                                                <SpeakerDetails speaker={speaker} pagetype={"product"}/>
                                            </div>
                                        </div>
                                    </>
                                }
                                {
                                    tab === "products" &&
                                    <div className="mt-4">

                                        {!!product &&
                                        <div className={"mt-4"}>
                                            <h3 className={"h5 mt-0 text-uppercase"}>{product.post_title}</h3>
                                        </div>
                                        }
                                        <div className={"my-5"}>
                                            <div className="d-flex mt-2">
                                                <h6 style={{minWidth: 150}}>Pris fra: </h6>
                                                {productMeta.product_price_with_fee > 0 ?
                                                    <h6>
                                                        <Price price={productMeta.product_price_with_fee} tax={-1}/>
                                                    </h6>

                                                    : <h6>Pris på forespørgsel</h6>
                                                }

                                            </div>


                                            <div className="d-flex mt-2">
                                                <h6 style={{minWidth: 150}}>Varighed: </h6>
                                                <h6>{productMeta.product_duration_min !== productMeta.product_duration_max ? productMeta.product_duration_min + " - " + productMeta.product_duration_max + " min" : productMeta.product_duration_min + " min"}</h6>
                                            </div>

                                            <div className="d-flex mt-2">
                                                <h6 style={{minWidth: 150}}>Type: </h6>
                                                <ProductTypePopOver className={"m-0"}
                                                                    type={productMeta.product_appetizer ? "appetizer" : productMeta.product_type === "workshop" ? "workshop" : "foredrag"}/>
                                            </div>


                                            <div className="d-flex mt-2">
                                                <h6 style={{minWidth: 150}}>Tilgængelig i:</h6>
                                                <h6 className="text-break">
                                                    {productMeta.product_appetizer ? speaker.post.meta.speaker_region_teaser_text : "Hele landet"}
                                                </h6>
                                            </div>

                                            {!!speaker.post.languages &&
                                            <div className="d-flex mt-2">
                                                <h6 style={{minWidth: 150}}>Sprog: </h6>
                                                <h6>
                                                    {speaker.post.languages.map((lang, i) => (
                                                        <span key={i}>{`${lang.name}${i+1 === speaker.post.languages.length ? "" : ", "}`}</span>
                                                    ))}
                                                </h6>
                                            </div>
                                            }
                                        </div>
                                        {parse(product.post_content)}

                                        {!!speaker.post && speaker.post.products.length > 1 &&
                                        <>
                                            <h4 className={"green-marker small-size my-4"}
                                                style={{letterSpacing: 1.5, borderTop: "1px solid #232323"}}
                                            >
                                                Andre produkter fra {speaker.post.post_title}
                                            </h4>
                                            {speaker.post.products.map((post, i) => (
                                                post.ID !== product.ID &&
                                                <ProductItem key={i} post={post} speakerImages={speaker.images}/>
                                            ))}
                                        </>
                                        }

                                    </div>
                                }
                                {
                                    tab === "gallery" &&
                                    <div className="mt-4">
                                        {!!speaker.post && <h3 className={"h5 mb-3 text-uppercase"}
                                                               style={{letterSpacing: 1.5}}>Billeder
                                            af {speaker.post.post_title}</h3>}
                                        <SpeakerGallery
                                            gallery={speaker.post.meta.speaker_gallery || []}
                                        />
                                    </div>
                                }
                                {
                                    tab === "videos" &&
                                    <div className="mt-4">
                                        {!!speaker.post && <h3 className={"h5 mb-3 text-uppercase"}
                                                               style={{letterSpacing: 1.5}}>Videoer
                                            med {speaker.post.post_title}</h3>}
                                        <div style={{position: "relative", height: 400}}>
                                            <ReactPlayer className="react-player" playing={false} controls={false}
                                                         url={speaker.post.meta.speaker_featured_video}
                                                         width='100%' height='100%'/>
                                        </div>
                                        {speaker.post.meta.speaker_videos && speaker.post.meta.speaker_videos.map((video, i) => (
                                            <div style={{position: "relative", height: 400}} key={i}>
                                                <ReactPlayer className="react-player" playing={false}
                                                             controls={false} url={video.url}
                                                             width='100%' height='100%'/>
                                            </div>
                                        ))}
                                    </div>
                                }

                                {
                                    !!speaker && !!speaker.post.ratings && tab === "ratings" &&
                                    <div className="mt-4">
                                        <h3 className={"h5 mb-3 text-uppercase"} style={{letterSpacing: 1.5}}>Ratings
                                            af {speaker.post.post_title}</h3>
                                        {speaker.post.ratings.map((rating, i) => (
                                            <ReviewCard rating={rating} key={i}/>
                                        ))}
                                    </div>
                                }

                            </>
                        }

                    </div>

                    {(speaker && product) &&
                    <SideBar speaker={speaker} product={product} pagetype={"product"}
                             regions={speaker.post.meta.speaker_region_teaser_text}/>
                    }

                </div>
            </div>

            <div className="container-fluid" style={{paddingTop: 45}}>
                {
                    tab !== "products" &&
                    heyState.speaker.map(speaker => {
                        let posts = [];
                        speaker.post.products.forEach(post => {
                            if (product && post.ID !== props.id) {
                                posts.push(
                                    {
                                        link: "https://youandx.com/products/" + post.post_name,
                                        title: `${post.meta.product_type === "workshop" ? "Workshop : " : ""}${post.post_title}`,
                                        teaser: post.meta.teaser_headline,
                                        image: post.images ? post.images.thumbnail
                                            : speaker.images && speaker.images.thumbnail ? speaker.images.thumbnail
                                                : post.terms ? [post.terms[Math.floor(Math.random() * post.terms.length)].images[0].sizes['home-speaker']]
                                                    : [''],
                                        terms: post.terms,
                                        type: post.meta.product_appetizer ? "appetizer" : post.meta.product_type === "workshop" ? "workshop" : "foredrag"
                                    }
                                )
                            }
                        });
                        if (posts.length) return (
                            <Carousel title={"Mere fra " + speaker.post.post_title}
                                      key={'f' + speaker.post.ID} posts={posts}/>
                        );
                        return null;
                    })
                }

                {
                    !!relatedSpeaker.length &&

                    <Carousel title={"Relaterede foredragsholdere"}
                              posts={relatedSpeaker.map(speaker => (
                                  {
                                      link: speaker.link,
                                      title: speaker.post.post_title,
                                      teaser: speaker.post.meta.teaser_headline,
                                      image: speaker.images.thumbnail,
                                      terms: [speaker.post.meta.primary_category],
                                  }
                              ))}/>


                }
            </div>


        </div>
    );
}

export default ProductPage;
