// File created : 05-05-2019 12:18
import React, {Component} from 'react';
import {Link} from "react-router-dom";
import './PostBox.css';
import VideoModal from "../Video/VideoModal";
import ProductTypeBadge from "./ProductTypeBadge";
import {FaClock, FaUser} from "react-icons/fa";
import BackgroundImage from "../Utility/BackgroundImage";


class PostBox extends Component {

    state = {
        videoPlaying: false
    };

    closeVideo = () => {
        this.setState({videoPlaying: false})
    };


    render() {
        const {link, title, imageTitle, subtitle, image, children, styles = {}, className = "", video, date, author, type, rating, smallspacing} = this.props;

        return (
            <div style={styles} className={"post-card-container col-12 col-sm-6 col-lg-4 post " + className}>

                {video &&
                <VideoModal video={video} videoPlaying={this.state.videoPlaying} closeVideo={this.closeVideo}/>}

                <div className="card post-card">
                    <div className={"image-container-wrap"} style={{position: "relative", overflow: "hidden"}}>
                        <Link to={link}>
                            <BackgroundImage image={image} className="image-container" style={{overflow: "hidden"}}/>
                        </Link>

                        {imageTitle && <div className={"postbox-image-title"}><Link to={link}>{imageTitle}</Link></div>}
                        {rating}
                        <ProductTypeBadge type={type}/>
                        {
                            video &&
                            <div className="postbox-play-button-container"
                                 style={{position: "absolute", top: "14px", right: "14px"}}
                                 onClick={(e) => {
                                     e.preventDefault();
                                     this.setState({videoPlaying: true})
                            }}
                            >
                            </div>
                        }

                    </div>


                    {(author || date) &&
                    <div className={"postbox-meta-container mt-2"}>
                        {author && <span className="postbox-meta-element postbox-author"><FaUser
                            className="postbox-meta-icon"/> af {author}</span>}
                        {date && <span className="postbox-meta-element postbox-date"><FaClock
                            className="postbox-meta-icon"/> {date}</span>}
                    </div>
                    }
                    {
                        (title || subtitle || children) &&
                        <div className="text-info" style={{paddingTop: '10px'}}>

                            {title && <Link className="teaser-headline" to={link} style={{
                                marginBottom: smallspacing && 5,
                                minHeight: smallspacing && "auto"
                            }}>{title}</Link>}
                            {(subtitle || children) &&
                            <div className="carousel-meta mt-0">
                                <Link  className="carousel-headline" to={link}>{subtitle}</Link>
                                <div className="carousel-children">{children}</div>
                            </div>
                            }
                        </div>
                    }

                </div>

            </div>
        )
    }
}


export default PostBox;
