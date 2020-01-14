// File created : 09-04-2019 15:58
import React, {Component} from 'react';

class SpecFilter extends Component {

    state = {
        buttons: [
            'datoer',
            'pris',
            'type',
            'tags',
            'flere filtre'
        ]
    };

    render() {
        return (


            <div className="d-flex flex-wrap py-3">
                {
                    this.state.buttons.map((button, index) => (
                        <button key={index}
                                className="btn btn-outline-dark text-uppercase text-secondary font-weight-bold px-3 my-1 mr-3"
                                style={{
                                    minWidth: '110px',
                                    borderRadius: '5px'
                                }}
                        >
                            {button}
                        </button>
                    ))
                }
            </div>
        );
    }
}

export default SpecFilter;
