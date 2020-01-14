// File created : 11-05-2019 22:00
import React, {Component} from 'react';
import ProgressBar from "../Status/ProgressBar";
import Tabs from "../Filtering/Tabs";
import axios from "axios";
import {API, TOKEN} from "../../constants";
import LinkListItem from "../Lists/LinkListItem";
import {authHeader} from "../../functions/userFunctions";
import {FaLock} from "react-icons/fa";

// TODO: Label "workshop on searchresult products"

class SearchResults extends Component {

    initialState = {
        loading: true,
        category: "all",
        tabs: [{label: "Alt", value: "all"}],
        results: false,
    };

    state = this.initialState;

    mounted = true;

    componentDidMount() {
        this.search(this.props.query)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.query !== this.props.query) this.search(this.props.query);
        if (prevProps.loading !== this.props.loading) this.setState({loading: this.props.loading});
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    search = (query) => {

        if (query && query.length) {
            this.setState({loading: true});
            axios.get(API + "search/?keyword=" + query + "&" + TOKEN, {headers: authHeader})
                .then(res => {
                    if (this.mounted) {
                        const results = res.data.results.searchbase;
                        const resultstabs = res.data.results.searchtabs;
                        this.setState({
                            loading: false,
                            results: results,
                            tabs: resultstabs,
                        })
                    }
                })
        }
    };


    changeCategory = (i) => {
        this.setState({category: i})
    };

    render() {
        const {results, category, tabs, loading} = this.state;
        const {
            live = false, close = () => {
            }
        } = this.props;

        return (
            <div style={{maxWidth: "980px"}}>

                {loading && <ProgressBar/>}

                <Tabs tabs={tabs} onChange={this.changeCategory} value={category}/>

                <div style={{
                    minHeight: "50px",
                    maxHeight: live ? "75vh" : "auto",
                    overflow: "auto",
                    marginBottom: "20px",
                    backgroundColor: live ? "rgba(0,0,0, .8)" : "",
                }} className="p-4">
                    {
                        results && results.map((resultset) => (
                            (resultset.resulttype === category || category === "all") && resultset.searchresults.map((item, j) => (
                                <LinkListItem link={item.path} key={j}
                                              title={<>
                                                  {item.private && <FaLock style={{marginRight: 10}}/>}
                                                  {item.title}
                                              </>}
                                              onClick={close}
                                              image={item.image}
                                >
                                        <span style={{width: "100%"}}>
                                        <h5 className="green-marker small-size">
                                            {resultset.resulttitle}
                                        </h5>
                                        </span>
                                    <br/>
                                </LinkListItem>
                            ))
                        ))
                    }

                </div>
            </div>
        );
    }
}

export default SearchResults;
