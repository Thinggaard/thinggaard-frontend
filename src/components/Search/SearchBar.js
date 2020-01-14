// File created : 07-03-2019 12:45
import React, {Component} from 'react';
import SearchResults from "./SearchResults";
import {ClickAwayListener} from "@material-ui/core";

class SearchBar extends Component {

    initialState = {
        showResults: false,
        reset: true,
        input: "",
        query: "",
    };

    state = this.initialState;

    mounted = true;

    timeOut;

    userInput = (value) => {
        this.setState({input: value});
        if (this.timeOut) clearTimeout(this.timeOut);
        if (value.length >= 3) {
            this.setState({loading: true, showResults: true})
        } else {
            this.setState({reset: true, query: "", showResults: false});
        }
        this.timeOut = window.setTimeout(() => {
            this.setState({query: value});
        }, 500)
    };

    close = () => {
        this.setState({showResults: false});
    };


    render() {

        return (
            <>
                <form
                    className="searchBar"
                    style={{zIndex: 1301}}
                    action={"/search/" + this.state.input}
                    method={"GET"}
                    onSubmit={e => {
                        if (this.state.input === "") e.preventDefault();
                    }}
                >
                    <input onChange={(e) => this.userInput(e.target.value)} type="text"
                           placeholder="Søg blandt 500+ foredrag" className="responsive-searchbar" style={{
                        backgroundColor: 'rgba(0,0,0,0)',
                        border: 'none',
                        color: '#FFFFFF',
                        width: '100%'
                    }}/>
                </form>
                {!this.props.mobile && this.state.showResults &&
                <ClickAwayListener onClickAway={this.close}>
                    <div
                        style={{
                            position: "absolute",
                            top: "64px",
                            left: "14px",
                            right: "0",
                            zIndex: "999",
                            width: "640px",
                        }}
                    >
                        <SearchResults query={this.state.query} close={this.close} live={true}/>
                    </div>
                </ClickAwayListener>
                }
            </>
        )
    }
}


export default SearchBar;
