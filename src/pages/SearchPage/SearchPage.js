// File created : 11-05-2019 22:34
import React, {Component} from 'react';
import SearchResults from "../../components/Search/SearchResults";

class SearchPage extends Component {

    render() {

        const {x} = this.props;

        return (
            <div className="container" style={{paddingTop: "120px"}}>
                <h3>Du søgte på: {x.match.params.query}</h3>

                <SearchResults query={x.match.params.query}/>
            </div>
        );
    }
}

export default SearchPage;
