// File created : 03-05-2019 19:50
import React, {Component} from 'react';
import OurHelmet from "../../components/Utility/OurHelmet";
import {parseShortCodes} from "../../functions/parserFunctions";
import {getPost} from "../../functions/APIFunctions";

class Post extends Component {

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
        getPost(id).then(res => {
            if (this.mounted) this.setState({posts: res})
        })
        /*axios.get(API+"posts/?postid="+id+"&"+TOKEN)
            .then(res => {
                if(this.mounted) this.setState({posts: res.data.results})
            })*/
    };

    render() {
        const {posts} = this.state;
        const {preheading, postheading, leftSide, rightSide, paddingTop = 120} = this.props;

        return (
            <div className="container" style={{paddingTop}}>
                {!!posts.length && <OurHelmet
                    title={posts[0].post.post_title + " | YOUANDX"}
                    fbTitle={posts[0].post.post_title}
                    fbDescription={posts[0].post.post_teaser}
                    fbImage={"images" in posts[0] && "full" in posts[0].images && posts[0].images.full[0]}
                    fbType="article"
                    fbUrl={posts[0].link}
                />}

                <div className="row">
                    {leftSide}
                    <div className="col entry-container blog-entry-container">
                        {
                            posts.map(x => (
                                <div key={x.post.ID}>
                                    {preheading}
                                    <h1>{x.post.post_title}</h1>
                                    {postheading}
                                    <div className="entry-content blog-entry-content">
                                        {parseShortCodes(x.post.post_content)}
                                        <br/>
                                        {this.props.children}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    {rightSide}
                </div>


            </div>
        );
    }
}

export default Post;
