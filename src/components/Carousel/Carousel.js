// File created : 08-03-2019 12:43
import React, {Component} from 'react';
import ReactTouchEvents from "react-touch-events";
import './Carousel.css';
import {Link} from "react-router-dom";
import PostBox from "../PostBox/PostBox";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";
import CTABox from "../CTABox/CTABox";
import {getRelativeURL} from "../../functions/parserFunctions";

class Carousel extends Component {

    state = {
        page: 0,
        perView: 1,
    };

    mounted;


    setPerView = () => {
        const width = (window.innerWidth > 0) ? window.innerWidth : 0;
        if (width >= 992) this.setState({perView: 3});
        else if (width >= 576) this.setState({perView: 2});
        else this.setState({perView: 1});
    };


    componentDidMount() {
        this.mounted = true;
        this.setPerView();
        window.addEventListener("resize", () => {
            if (this.mounted) this.setPerView()
        });
    }

    componentWillUnmount() {
        this.mounted = false
    }

    handleSwipe = (direction) => {
        switch (direction) {
            case "top":
                break;
            case "bottom":
                break;
            case "left":
                this.slideRight();
                break;
            case "right":
                this.slideLeft();
                break;
            default:
                break;
        }
    };

    getNumSlides = () => {
        return this.props.posts.length - this.state.perView
    };


    slideRight = () => {
        if (this.state.page < this.getNumSlides()) {
            this.setState(prev => ({page: prev.page + 1}))
        }
    };

    slideLeft = () => {
        if (this.state.page > 0) {
            this.setState(prev => ({page: prev.page - 1}))
        }
    };


    render() {

        const isLastPage = this.props.posts.length - this.state.perView <= this.state.page;
        const isSlideable = this.props.posts.length > this.state.perView;

        const {posts} = this.props;

        const carouselPosition = {
            flexWrap: 'nowrap',
            transform: `translate(${-(this.state.page * 100) / this.state.perView}%, 0)`
        };

        return (
            <div className="row">
                <div style={{position: 'relative'}} className={!!this.mounted ? "container mb-5" : "d-none"}>
                    <h4 className="green-marker small-size"> {this.props.title} </h4>
                    {isSlideable && <div className="carousel-arrow" style={{left: '-30px'}} onClick={this.slideLeft}>
                        <FaChevronLeft style={{color: this.state.page === 0 ? '#505050' : '#ffffff',}}/>
                    </div>}

                    <div style={{overflow: 'hidden', position: 'relative'}}>
                        <ReactTouchEvents onSwipe={this.handleSwipe.bind(this)}>
                            <div className="row posts-carousel-inner" style={carouselPosition}>
                                {
                                    posts.map((post, i) => {
                                        return (
                                            post.type!=='cta' ?
                                                <PostBox
                                                    key={i}
                                                    link={post.link ? getRelativeURL(post.link) : ""}
                                                    title={post.teaser}
                                                    subtitle={post.title}
                                                    image={post.image && post.image[0]}
                                                    video={post.video}
                                                    appetizer={post.appetizer}
                                                    type={post.type}
                                                >
                                                    <>
                                                        {post.categories && post.categories.map((term, i) => {
                                                            if (i < 2)
                                                                return (
                                                                    !!term &&
                                                                    <Link className="category-name term-name text-primary" key={i} to={term.path ? term.path : "#"}>
                                                                        {term.name}
                                                                    </Link>
                                                                );
                                                            else return "" //Renders nothing, prevents warnings
                                                        })}
                                                        {post.terms && post.terms.map((term, i) => {
                                                            if (i < 3)
                                                                return (
                                                                    !!term &&
                                                                    <Link className="tag-name term-name" key={i} to={term.path ? term.path : "#"}>
                                                                        {term.name}
                                                                    </Link>
                                                                );
                                                            else return "" //Renders nothing, prevents warnings
                                                        })}
                                                    </>
                                                </PostBox>
                                                :
                                                <CTABox
                                                    key={i}
                                                    link={post.link ? getRelativeURL(post.link) : ""}
                                                    title={post.title}
                                                    type={post.type}
                                                    content={post.content}
                                                    cardStyles={{
                                                        backgroundColor: post.color_bg,
                                                        color: post.color_txt
                                                    }}
                                                />
                                        )
                                    })
                                }


                            </div>
                        </ReactTouchEvents>
                    </div>

                    {isSlideable && <div className="carousel-arrow" style={{right: '-30px'}} onClick={this.slideRight}>
                        <FaChevronRight style={{
                            color: isLastPage ? '#505050' : '#ffffff',
                        }}/>
                    </div>}
                </div>
            </div>
        );
    }

}


export default Carousel;
