// File created : 15-04-2019 12:47
import React, {Component} from 'react';
import {FaChevronDown, FaChevronRight} from "react-icons/fa";

class FoldOut extends Component {

    state = {
        expanded: !!this.props.expanded,
        height: 20
    };

    toggleExpanded = () => {
        this.setState(prev => ({expanded: !prev.expanded}))
    };

    setHeight = () => {
        if (this.boxref) this.setState({height: this.boxref.clientHeight})
    };

    componentDidMount() {
        this.setHeight();
        window.addEventListener('resize', () => {
            this.setHeight();
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.boxref && prevState.height !== this.boxref.clientHeight) {
            this.setHeight();
        }
    }

    render() {

        if (this.boxref && this.state.height !== this.boxref.clientHeight) this.setState({height: this.boxref.clientHeight});

        const {children, title = "Læs mere", alwaysOpen = false, background = "#3f3f3f"} = this.props;

        return (
            <div className="input-box py-1 text-light-grey px-0" style={{backgroundColor: background}}>
                <div className="booking-input-title clearfix unselectable pointer px-2" onClick={this.toggleExpanded}>
                    <span className="float-left">{title}</span>
                    <span className="float-right text-light">
                        {this.state.expanded ?
                            !alwaysOpen && <FaChevronDown/>
                            : !alwaysOpen && <FaChevronRight/>
                        }

                    </span>
                </div>

                <div id="details-box" className="height-animate" style={{
                    height: this.state.expanded || alwaysOpen ? this.state.height + 'px' : '0px',
                    overflow: 'hidden',
                }}>
                    <div ref={element => this.boxref = element}>
                        {children}
                    </div>
                </div>

            </div>
        );
    }
}

export default FoldOut;
