// File created : 22-03-2019 13:57
import React, {Component} from 'react';
import SlideShow from "../components/SlideShow/SlideShow";
import Carousel from "../components/Carousel/Carousel";
import ReferenceLogos from "../components/ReferenceLogos/ReferenceLogos";
import CatSelect from "../components/Filtering/CatSelect";
import axios from "axios";
import {API, TOKEN} from "../constants";
import './FrontPage.css';
import OurHelmet from "../components/Utility/OurHelmet";
import {FaCaretDown} from "react-icons/fa";
import {parseShortCodes} from "../functions/parserFunctions";

class FrontPage extends Component {

    state = {
        carousels: [],
        content: ""
    };

    mounted;

    componentDidMount() {
        this.mounted = true;

        this.setWindowSize();

        window.addEventListener("resize", () => {
            if (this.mounted) this.setWindowSize();
        });

        axios.get(API + "carousels?numberposts=10&offset=0&" + TOKEN)
            .then(res => {
                const carousels = res.data.results;
                if (this.mounted) this.setState({carousels: carousels})
            });

        axios.get(API + "posts/?postid=2&" + TOKEN)
            .then(res => {
                if (this.mounted) this.setState({content: res.data.results[0].post.post_content});
            })
    }

    setWindowSize() {
        const windowWidth = window.innerWidth;
        this.setState({windowWidth: windowWidth})
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.setWindowSize);
        this.mounted = false;
    }

    render() {
        const windowWidth = this.state.windowWidth;
        const isDesktop = windowWidth > 640;

        return (
            <>
                <OurHelmet/>
                <SlideShow/>
                <div>
                    <div className="d-flex mb-2">
                        <div className="flex-grow-1 border-top border-light"/>
                    </div>
                </div>

                <div className="frontpage-container container mb-5 pb-3 pt-3">
                    <h5 className="my-4 mx-auto text-center" style={{maxWidth: 720, fontWeight: 400}}>
                        YOUANDX er Danmarks førende formidler af foredrag, hvor fagligheden er i fokus.
                        Vores foredragsholdere er passionerede eksperter med grundig indsigt i deres respektive fagområder.
{/*
                        {parseShortCodes(this.state.content)}
*/}
                    </h5>

                    <CatSelect/>
                </div>

                <div className="container-fluid mt-4">
                    {this.state.carousels.map((carousel, i) => (
                        <Carousel key={i}
                                  posts={isDesktop ? carousel.items : carousel.items.slice(0, 3)}
                                  title={carousel.post_title}
                        />
                    ))}
                </div>

                <ReferenceLogos/>

            </>
        );
    }
}

export default FrontPage;
