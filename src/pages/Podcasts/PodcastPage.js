// File created : 27-03-2019 12:44
import React, {Component} from 'react';
import {API, TOKEN} from "../../constants";
import axios from "axios";
import {Link} from "react-router-dom";
import Carousel from "../../components/Carousel/Carousel";
import SpeakerHero from "../../components/Speaker/SpeakerHero";
import OurHelmet from "../../components/Utility/OurHelmet";
import moment from "moment-timezone";
import parse from "html-react-parser";
import SideBar from "../../components/SideBar/SideBar";
import {getRelativeURL} from "../../functions/parserFunctions";

class PodcastPage extends Component {

    state = {
        podcast: [],
        speakers: [],
        coverImage: "",
        coverVideo: "",
        coverFilter: "",
        coverPosition: "",
        fullWidthImage: true,

        tab: "about",

        relatedSpeaker: [],
        tags: [],
    };

    mounted = true;

    componentDidMount() {
        this.mounted = true;
        this.getData(this.props.id);
    }


    componentWillUnmount() {
        this.mounted = false;
    }


    getData = (id) => {
        if (id) this.getPodcast(API + "podcast/?podcastid=" + id + "&" + TOKEN)
    };


    getPodcast = (url) => {
        axios.get(url)
            .then(res => {
                if (this.mounted) {
                    const podcast = res.data.results;

                    const terms = podcast[0].post.terms;
                    const speakers = podcast[0].post.speakers;

                    let coverImage = "";
                    let coverVideo = "";
                    let coverFilter = "60";
                    let coverPosition = "";
                    let fullWidth = false;

                    if (podcast[0].images && podcast[0].images.header) {
                        coverImage = podcast[0].images.header[0];
                        if (podcast[0].post.meta.podcast_video_link) coverVideo = podcast[0].post.meta.podcast_video_link;
                        if (podcast[0].post.meta.header_filter) coverFilter = podcast[0].post.meta.header_filter;
                        if (podcast[0].post.meta.header_position) coverPosition = podcast[0].post.meta.header_position;
                        fullWidth = true
                    } else if (terms && terms.length) {
                        coverImage = terms[0].images[0].url
                    }

                    if (terms) {
                        axios.get(API + "speakers/?numberposts=9&orderby=rand&order=ASC&tags=" + terms[0].term_id + "&" + TOKEN + "&exclude=" + podcast[0].post.ID)
                            .then(res => {
                                const related = res.data.results;
                                if (this.mounted)
                                    this.setState({relatedSpeaker: related})
                            });
                    }

                    if (speakers) {
                        axios.get(API + "speakers/?speakerid=" + speakers[0] + "&products=true&" + TOKEN)
                            .then(res => {
                                const speakers = res.data.results;
                                if (this.mounted)
                                    this.setState({speakers: speakers})
                            });
                    }

                    this.setState({
                        podcast: podcast,
                        coverImage: coverImage,
                        coverVideo: coverVideo,
                        coverFilter: coverFilter,
                        coverPosition: coverPosition,
                        fullWidthImage: fullWidth
                    })
                }
            });
    };


    componentDidUpdate(prevProps) {
        if (this.props.slug !== prevProps.slug) {
            this.setState({tab: "about"});
            this.getData();
        }
    }

    render() {
        //## These declarations were unused, causing warnings ##
        //const {tab, coverImage, product, productId, bookingType, fullWidthImage, questionOverlay, bookingOverlay, tags, coverFilter, coverPosition, relatedSpeaker} = this.state;

        const podcast = this.state.podcast[0];
        const speakers = this.state.speakers;

        moment().format("YYYYMMDD");


        return (
            <div className="podcastPage">
                {podcast && <OurHelmet
                    title={podcast.post.post_title}
                    fbTitle={podcast.post.post_title}
                    fbDescription={podcast.post.post_teaser}
                    fbImage={podcast.images.medium[0]}
                    fbType="article"
                    fbPublishedTime={podcast.post.post_date}
                    fbModifiedTime={podcast.post.post_modified}
                    fbTags={podcast.post.terms}
                    fbUrl={podcast.link}
                />}
                {
                    this.state.podcast.map((podcast, i) => (
                        <SpeakerHero
                            key={i}
                            title={podcast.post.post_title}
                            text={podcast.post.post_teaser}
                            coverVideo={this.state.coverVideo}
                            coverImage={this.state.coverImage}
                            coverFilter={this.state.coverFilter}
                            coverPosition={this.state.coverPosition}
                            readMore={true}
                            thumbnail={!this.state.fullWidthImage && podcast.images.medium[0]}
                            subtitle={
                                <>
                                    {!!speakers.length && <Link to={getRelativeURL(speakers[0].link)}>
                                        {speakers[0].post.post_title}

                                    </Link>
                                    }
                                    {podcast.post.terms && podcast.post.terms.map((term, i) => {
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
                    ))
                }


                <div className="container mb-4">
                    <div className="row justify-content-between">
                        <div className="col-12 col-lg-7 order-2 order-lg-0 pr-5 mt-5" id={"readMore"}>

                            {podcast &&
                            <>
                                <h3 style={{letterSpacing: '2px'}}
                                    className="h5 text-uppercase">Om {podcast.post.post_title}</h3>

                                <div className="mt-4">
                                    {parse(podcast.post.post_content)}
                                </div>
                            </>
                            }

                        </div>
                        {!!speakers.length &&
                        <SideBar speaker={speakers[0]} product={speakers[0].post.products[0]} pagetype={"speaker"}
                                 regions={speakers[0].post.meta.speaker_region_teaser}/>
                        }
                    </div>
                </div>


                <div className="container-fluid" id="products" style={{paddingTop: '30px'}}>

                    {

                        this.state.speakers.map(speaker => {
                            let posts = [];
                            speaker.post.products && speaker.post.products.forEach(post => {
                                posts.push(
                                    {
                                        link: "https://youandx.com/products/" + post.post_name,
                                        title: post.post_title,
                                        teaser: post.meta.teaser_headline,
                                        image: post.images ? post.images.thumbnail
                                            : speaker.images && speaker.images.thumbnail ? speaker.images.thumbnail
                                                : post.terms ? [post.terms[Math.floor(Math.random() * post.terms.length)].images[0].sizes['home-speaker']]
                                                    : [''],
                                        terms: post.terms,
                                        appetizer: post.meta.product_appetizer,
                                    }
                                )

                            });

                            if (posts && posts.length) return (
                                <Carousel title={"foredrag fra " + speaker.post.post_title} key={'f' + speaker.post.ID}
                                          posts={posts}/>
                            );
                            return null;
                        })
                    }
                </div>

                {
                    (!!this.state.relatedSpeaker) &&
                    <div className="mt-4">
                        <Carousel title={"Relaterede foredragsholdere"}
                                  posts={this.state.relatedSpeaker.map(speaker => (
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
                    </div>
                }

            </div>
        );
    }
}

export default PodcastPage;
