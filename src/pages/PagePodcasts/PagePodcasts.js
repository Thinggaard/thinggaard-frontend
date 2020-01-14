// File created : 03-05-2019 19:50
import React, {Component} from 'react';
import axios from "axios";
import {API, TOKEN} from "../../constants";
import PostBox from "../../components/PostBox/PostBox";
import {Link} from "react-router-dom";
import ProgressBar from "../../components/Status/ProgressBar";
import OurHelmet from "../../components/Utility/OurHelmet";
import {getRelativeURL, parseShortCodes} from "../../functions/parserFunctions";

export default class PagePodcasts extends Component {

    constructor(props) {
        super(props);
        this.postsContainer = React.createRef();
    }

    state = {
        posts: [],
        speakers: [],
        loading: true,
        endLoad: false,
    };

    mounted = true;

    componentDidMount() {
        this.getPage(this.props.id);
        this.getPosts(20, 0);
        window.addEventListener("scroll", () => {
            if (this.mounted) this.scrollTrigger();
        })
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.id !== this.props.id) {
            this.getPage(this.props.id);
            this.getPosts(20, 0)
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        window.removeEventListener("scroll", this.scrollTrigger);
    }

    scrollTrigger() {
        const height = this.postsContainer.current.clientHeight;
        if (window.pageYOffset + window.innerHeight > height && !this.state.loading && !this.state.endLoad) {
            this.getPosts(20)
        }
    }

    getPage = (id) => {
        this.setState({posts: []});
        axios.get(API + "posts/?postid=" + id + "&" + TOKEN)
            .then(res => {
                if (this.mounted) this.setState({posts: res.data.results})
            })
    };


    getPosts = (postCount, offset) => {
        this.setState({loading: true});
        axios.get(`${API}posts/?posttype=podcast&numberposts=${postCount}&offset=${offset ? offset : this.state.speakers.length}&${TOKEN}`)
            .then(res => {
                if (this.mounted && res.data.status) {
                    this.setState(prev => ({
                        speakers: prev.speakers.concat(res.data.results),
                        loading: false
                    }))
                } else if (this.mounted) this.setState({loading: false, endLoad: true})
            })
    };


    render() {
        const {posts} = this.state;

        return (
            <>
                {!!posts.length && <OurHelmet
                    title={posts[0].post.post_title + " | YOUANDX"}
                    fbTitle={posts[0].post.post_title}
                    fbDescription={posts[0].post.post_teaser}
                    fbImage={"images" in posts[0] && "full" in posts[0].images && posts[0].images.full[0]}
                    fbType="article"
                    fbUrl={posts[0].link}
                />}

                <div className="container" style={{paddingTop: '120px '}}>
                    {
                        posts.map(x => (
                            <div key={x.post.ID}>
                                <h1 className="display-3">{x.post.post_title}</h1>
                                <div className="entry-content">
                                    {parseShortCodes(x.post.post_content)}
                                </div>
                            </div>
                        ))
                    }

                </div>
                <div className="container" ref={this.postsContainer}>
                    <div className="row">
                        {!!this.state.speakers && this.state.speakers.map((item, key) => {
                            return (
                                <PostBox
                                    key={key}
                                    className="mb-5"
                                    imageTitle={item.post.post_title}
                                    date={item.post.date_long}
                                    author={item.post.author}
                                    image={item.images ? item.images.thumbnail[0] : ""}
                                    link={getRelativeURL(item.link)}
                                    children={item.post.terms && item.post.terms.map((term, i) => {
                                        if (i < 3) return (
                                            !!term &&
                                            <span className="term-name" key={i}>
                                            <Link to={term.path}>{term.name}</Link>
                                            </span>
                                        );
                                        else return ""
                                    })}
                                />)
                        })}
                    </div>
                    {!!this.state.speakers && <div
                        className="my-3 text-center">Viser {this.state.endLoad && "alle "}{this.state.speakers.length} opslag</div>}
                    {this.state.loading && !this.state.endLoad && <ProgressBar/>}
                </div>
            </>

        )
    }
}
