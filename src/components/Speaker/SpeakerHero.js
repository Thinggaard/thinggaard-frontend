// File created : 03-05-2019 15:31
import React, {Component} from 'react';
import './SpeakerHero.css';
import ReactPlayer from 'react-player'
import AnchorLink from 'react-anchor-link-smooth-scroll'
import parse from 'html-react-parser';
import ProductTypeBadge from "../PostBox/ProductTypeBadge";
import {FaPlayCircle, FaRegTimesCircle} from "react-icons/fa";

class SpeakerHero extends Component {

    state = {
        moreToRead: true,
        readMore: false,
        videoPlaying: false,
    };

    render() {
        const {
            type, title = "", subtitle = "", text = "", readMore = false, coverImage,
            coverVideo, thumbnail, buttonText = "Læs mere", coverFilter = "",
            coverPosition = "", anchorLinkCallBack = () => {}, children, contentRight
        } = this.props;
        const teaserText = readMore ? text + "..." : text;

        return (
            <div className={"speakerHero"} style={{
                overflow: "hidden",
                paddingTop: this.props.coverVideo ? '56.25%' : '45%'
            }}>
                <div className="page-hero" style={{
                    backgroundImage: `url(${coverImage})`,
                    filter: `brightness(${coverFilter}%)`,
                    backgroundPosition: `center ${coverPosition ? coverPosition : "center"}`,
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                }}>
                </div>

                <ProductTypeBadge type={type} onClick={() => {
                }}/>

                {coverVideo &&
                <div className={"page-hero-video-wrapper"} style={{
                    opacity: this.state.videoPlaying ? '1.0' : '0.0',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                }}>
                    <div className={"page-hero-video"} style={{
                        position: 'relative',
                        paddingTop: coverVideo ? '56.25%' : '45%',
                        zIndex: this.state.videoPlaying && 10
                    }}>
                        {
                            coverVideo &&
                            <ReactPlayer className="react-player" playing={this.state.videoPlaying} controls
                                         url={coverVideo} width='100%' height='100%'/>
                        }
                    </div>
                </div>
                }

                {
                    coverVideo &&
                    <div
                        className={`page-hero-video-controls ${this.state.videoPlaying ? 'video-playing' : 'video-stopped'}`}>
                        <i className={`hero-play-button`}
                           onClick={() => this.setState(prev => ({videoPlaying: !prev.videoPlaying}))}>
                            {this.state.videoPlaying ? <FaRegTimesCircle/> : <FaPlayCircle/>}
                        </i>
                    </div>

                }
                <div className="page-hero-content" style={{
                    opacity: this.state.videoPlaying ? '0.0' : '1.0',
                    backgroundColor: thumbnail && "rgba(0,0,0,0.6)",
                }}>
                    <div className="container">
                        <div className="speaker-head row pb-5 justify-content-center">
                            <div className="col-8 col-lg-4 order-lg-last mb-4 text-center text-lg-left">
                                {
                                    thumbnail &&
                                    <img className="shadow" src={thumbnail}
                                         alt={title}/>
                                }
                            </div>

                            <div className="col-12 col-lg-8">
                                <div style={{maxWidth: coverVideo ? "480px" : "650px"}}>
                                    <h1>{title}</h1>
                                    <div className="page-hero-subtitle mt-4 mb-4">
                                        {subtitle}
                                    </div>

                                    <div className={`speaker-post-content`}>
                                        {parse(teaserText)}
                                        {buttonText && <AnchorLink onClick={anchorLinkCallBack} offset="100"
                                                                   className={"page-hero-readmore"} href={"#readMore"}>Læs
                                            mere</AnchorLink>}
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
        );
    }
}

export default SpeakerHero;
