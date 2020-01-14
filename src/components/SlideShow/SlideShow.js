import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios/index';
import ReactTouchEvents from "react-touch-events";
import {API, TOKEN} from '../../constants';
import './SlideShow.css';
import {Link} from "react-router-dom";
import Interval from "../WindowEvents/Interval";
import KeyPressListener from "../WindowEvents/KeyPressListener";
import {StatusContext} from "../../store/Store";
import MultiButtonSelect from "../Filtering/MultiButtonSelect";


function SlideShow() {
    const [sliders, setSliders] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [iteration, setiteration] = useState(0);
    const [userSwitch, setUserSwitch] = useState(false);
    const [windowKeyPress, setWindowKeyPress] = useState({code: null, count: 0});

    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [tags, setTags] = useState([]);

    const [, setStatus] = useContext(StatusContext);

    function heyComponentDidMount() {
        setStatus({type: 'addConnection'});
        axios.get(API + 'sliders?' + TOKEN)
            .then(res => {
                setSliders(res.data.results);
            }).finally(() => setStatus({type: 'removeConnection'})
        );
        axios.get(API + 'filter-options?' + TOKEN)
            .then(res => {
                setTags(res.data.results.speaker_tags);
                setCategories(res.data.results.speaker_categories);
            });
    }

    useEffect(heyComponentDidMount, []);

    function switchLeft() {
        setCurrentSlide(currentSlide < 1 ? sliders.length - 1 : currentSlide - 1)
    }

    const switchRight = () => {
        setCurrentSlide((currentSlide + 1) % sliders.length);
    };

    const autoSwitch = () => {
        if (!!sliders && !!iteration) {
            if (!userSwitch) switchRight();
            else setUserSwitch(false);
        }
    };
    useEffect(autoSwitch, [iteration, sliders]);


    const keyPress = () => {
        if (windowKeyPress.code === "ArrowLeft") {
            switchLeft();
            setUserSwitch(true)
        }
        if (windowKeyPress.code === "ArrowRight") {
            switchRight();
            setUserSwitch(true)
        }
    };
    useEffect(keyPress, [windowKeyPress]);

    const handleSwipe = (direction) => {
        switch (direction) {
            case "left":
                switchRight();
                setUserSwitch(true);
                break;
            case "right":
                switchLeft();
                setUserSwitch(true);
                break;
            default:
                break;
        }
    };

    const content = (
        <div className="slide-content">
            <div className="container h-100">
                <div className="row h-100">
                    <div className="col-12 text-center align-self-end">
                        <h1>YOUANDX, En verden af inspiration</h1>
                        <h3>
                            Foredrag fra passionerede foredragsholdere, der brænder for sit emne
                        </h3>
                        <h5 className={"mt-5 mb-4"}>Hvad interesserer dig?</h5>

                        <div className="m-auto" style={{maxWidth: '100%'}}>
                            <MultiButtonSelect
                                choices={categories}
                                idKey={"term_id"}
                                titleKey={"name"}
                                selected={selectedCategories}
                                setSelected={setSelectedCategories}
                            />
                        </div>


                        <div className={"mt-4"}>
                            <Link to={"foredragsholdere/?categories=" + selectedCategories.join(",")} className="btn btn-success">
                                Find foredragsholdere
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="slideshow-wrapper">

            <Interval callback={setiteration} interval={8000}/>
            <KeyPressListener
                callback={(e, count) => {
                    setWindowKeyPress({code: e.code, count});
                }}
                type={"keydown"}
            />

            <ReactTouchEvents onSwipe={handleSwipe}>
                <div className="slideshow" style={{width: '100%'}}>

                    {
                        sliders.map((slider, index) => (
                            <div
                                className={(slider.post.post_featured ? 'slider-featured' : '') + ' slider ' + (currentSlide === index ? 'slider-active' : '')}
                                key={slider.post.ID}
                                style={{
                                    width: '100%',
                                    position: 'absolute',
                                    opacity: currentSlide === index ? '1' : '0',
                                    pointerEvents: currentSlide === index ? 'auto' : 'none'
                                }}
                            >
                                <div className="slideShowImg" style={{
                                    backgroundImage: `url(${slider.image[0]})`,
                                    backgroundSize: 'cover',
                                    width: '100%',
                                }}/>

                            </div>
                        ))
                    }

                    {content}

                </div>
            </ReactTouchEvents>

        </div>
    )
}

export default SlideShow;
