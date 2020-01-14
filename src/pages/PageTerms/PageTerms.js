// File created : 03-05-2019 19:50
import React, {Component} from 'react';
import axios from "axios";
import {API, TOKEN} from "../../constants";
import PostBox from "../../components/PostBox/PostBox";
import './PageTerms.css';
import {parseShortCodes} from "../../functions/parserFunctions";
import OurHelmet from "../../components/Utility/OurHelmet";
import {getUserToken} from "../../functions/userFunctions";

class PageTerms extends Component {

    state = {
        posts: [],
        items: []
    };

    mounted = true;

    componentDidMount() {
        this.getPage(this.props.id);
        this.getItems(this.props.template)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.id !== this.props.id) {
            this.getPage(this.props.id);
            this.getItems(this.props.template)
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    getPage = (id) => {
        this.setState({posts: []});
        const userToken = getUserToken();
        const authHeader =  !!userToken ? {Authorization: "Bearer " + userToken,} :{};
        axios.get(API + "posts/?postid=" + id + "&" + TOKEN,{headers: authHeader})
            .then(res => {
                if (this.mounted) this.setState({posts: res.data.results})
            })
    };

    getItems = (template) => {
        const userToken = getUserToken();
        const authHeader =  !!userToken ? {Authorization: "Bearer " + userToken,} :{};
        const endpoint =
            template === "categories" ? "terms?taxonomy=speakercategories&"
                : template === "tags" ? "terms?taxonomy=speakertags&"
                : "";
        this.setState({speakers: []});
        axios.get(`${API}${endpoint}${TOKEN}`,{headers: authHeader})
            .then(res => {
                const results = res.data.results;
                if (this.mounted) {
                    this.setState({
                        items: results.terms
                    })
                }
            })
    };

    render() {
        const {posts} = this.state;

        return (
            <>
                <div className="container" style={{paddingTop: '120px '}}>
                    {!!posts.length && <OurHelmet
                        title={posts[0].post.post_title + " | YOUANDX"}
                        fbTitle={posts[0].post.post_title}
                        fbDescription={posts[0].post.post_teaser}
                        fbImage={"images" in posts[0] && "full" in posts[0].images && posts[0].images.full[0]}
                        fbType="article"
                        fbUrl={posts[0].link}
                        />
                    }
                    <div className="entry-container">
                        {
                            posts.map(x => (
                                <div key={x.post.ID}>
                                    <h1>{x.post.post_title}</h1>
                                    <div className="entry-content">
                                        {parseShortCodes(x.post.post_content)}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="container tag-container">
                    <div className="row">
                        {this.state.items.map((item, key) => {
                            return (
                                <PostBox
                                    key={key}
                                    className="col-xl-3 tag post"
                                    title={item.name}
                                    /*subtitle={item.post.post_title}*/
                                    image={[item.images[0].sizes["home-speaker"]]}
                                    link={item.path}
                                />)
                        })}
                    </div>
                </div>
            </>

        )
    }
}

export default PageTerms;
