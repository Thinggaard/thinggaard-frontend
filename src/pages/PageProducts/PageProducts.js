// File created : 03-05-2019 19:50
import React, {Component} from 'react';
import axios from "axios";
import {API, TOKEN} from "../../constants";
import OurHelmet from "../../components/Utility/OurHelmet";
import {parseShortCodes} from "../../functions/parserFunctions";

class PageProducts extends Component {

    state = {
        posts: []
    };

    mounted = true;

    componentDidMount() {
        this.getPage(this.props.id)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.id !== this.props.id) this.getPage(this.props.id)
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    getPage = (id) => {
        this.setState({posts: []});
        axios.get(API + "posts/?postid=" + id + "&" + TOKEN)
            .then(res => {
                if (this.mounted) this.setState({posts: res.data.results})
            })
    };

    /*replaceBreaksWithParagraphs = (input) => {
        input = input.split('\n').join('</p><p>');
        return '<p>' + input + '</p>';
    }*/

    render() {
        const {posts} = this.state;

        return (
            <div className="container" style={{paddingTop: '120px '}}>
                {!!posts.length && <OurHelmet
                    title={posts[0].post.post_title + " | YOUANDX"}
                    fbTitle={posts[0].post.post_title}
                    fbDescription={posts[0].post.post_teaser}
                    fbImage={"images" in posts[0] && "header" in posts[0].images && posts[0].images.header[0]}
                    fbType="article"
                    fbUrl={posts[0].link}
                />}
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
        );
    }
}

export default PageProducts;
