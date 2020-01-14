// File created : 26-03-2019 07:44
import React, {Component} from 'react';
import axios from "axios";
import {API, TOKEN} from "../../constants";
import './ReferenceLogos.css';
import BackgroundImage from "../Utility/BackgroundImage";

class ReferenceLogos extends Component {

    state = {
        references: []
    };

    rendered;

    componentDidMount() {
        this.rendered = true;
        axios.get(API + 'references?' + TOKEN)
            .then(res => {
                if (this.rendered) this.setState({references: res.data.results});
            })
    }

    componentWillUnmount() {
        this.rendered = false
    }

    render() {
        return (
            <div className="reference-logos">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col d-flex flex-wrap justify-content-center pb-5">
                            {
                                this.state.references.map(ref => {
                                    return (
                                        <div key={ref.post.ID} className="col-lg-2 col-md-3 col-sm-4 mt-5 px-4">
                                            <BackgroundImage image={ref.image[0]} className="reference-image"
                                                             style={{backgroundSize: "contain"}}/>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ReferenceLogos;
