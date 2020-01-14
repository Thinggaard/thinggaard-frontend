// File created : 09-04-2019 16:29
import React, {Component} from 'react';
import {Link} from "react-router-dom";

class CatSelect extends Component {

    state = {
        buttons: [
            ['Foredragsholdere', 'Find en foredragsholder', '/foredragsholdere'],
            ['Kategorier', 'Vidensdelere og storytellers', '/kategorier'],
            ['Emner', 'Vi dækker stort set alle emner', '/emner'],
            ['Blog', 'Indsigtsfuld viden og nyheder', '/blog']
        ]
    };

    render() {
        return (

            <div className="row">
                {
                    this.state.buttons.map((button, index) => (
                        <div key={index} className="col-sm-12 col-md-6 col-lg-6 col-xl-3 mt-4">
                            <Link to={button[2]}>
                                <button
                                    className="btn btn-outline-dark text-secondary w-100 py-4"
                                    style={{
                                        borderRadius: '5px'
                                    }}
                                >
                                    <h4 className="font-weight-bold text-light mb-0">{button[0]}</h4>
                                    {button[1]}
                                </button>
                            </Link>
                        </div>
                    ))
                }
            </div>
        );
    }

}

export default CatSelect;
