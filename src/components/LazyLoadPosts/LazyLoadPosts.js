import React, {Component} from 'react';
import axios from "axios";
import {TOKEN} from "../../constants";
import ProgressBar from "../Status/ProgressBar";

class LazyLoadPosts extends Component {

    constructor(props) {
        super(props);
        this.postsContainer = React.createRef();
    }

    state = {
        loading: true,
        endLoad: false,
        posts: [],
    };

    mounted = true;

    componentDidMount() {
        this.getPosts();
        window.addEventListener("scroll", () => {
            if (this.mounted) this.scrollTrigger();
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.reload !== this.props.reload) {
            // using a setState callback so that posts are always reset before API call:
            this.setState({loading: false, endLoad: false, posts: []}, this.getPosts);
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        window.removeEventListener("scroll", this.scrollTrigger)
    }

    scrollTrigger() {
        const height = this.postsContainer.current.clientHeight;
        if (window.pageYOffset + window.innerHeight > height && !this.state.loading && !this.state.endLoad) {
            this.getPosts()
        }
    }

    getPosts = () => {
        this.setState({loading: true});
        const {endpoint, postsPerLoad} = this.props;

        axios.get(`${endpoint}&numberposts=${postsPerLoad}&offset=${this.state.posts.length}&${TOKEN}`)
            .then(res => {
                if (this.mounted && res.data.status) {
                    this.setState(prev => ({
                        posts: prev.posts.concat(res.data.results),
                        loading: false
                    }))
                } else if (this.mounted) this.setState({loading: false, endLoad: true})
            })
    };


    render() {
        const {postLabel, containerClass, children, PostComponent} = this.props;
        const {posts, loading, endLoad} = this.state;

        return (
            <div className={containerClass} ref={this.postsContainer}>
                <div className="row">
                    {children}
                    {posts.map((post, i) => (
                        PostComponent(post, i)
                    ))}
                </div>
                {!!posts.length &&
                <div className="my-3 text-center">Viser {endLoad && "alle "}{posts.length} {postLabel}</div>}
                {loading && !endLoad ? <ProgressBar/> : null}
            </div>
        );
    }

}

export default LazyLoadPosts;
