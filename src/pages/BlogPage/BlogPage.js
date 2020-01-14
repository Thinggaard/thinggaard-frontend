// File created : 03-05-2019 19:50
import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {API, TOKEN} from "../../constants";
import OurHelmet from "../../components/Utility/OurHelmet";
import {getRelativeURL, parseShortCodes} from "../../functions/parserFunctions";
import {StatusContext} from "../../store/Store";
import LazyLoadPosts from "../../components/LazyLoadPosts/LazyLoadPosts";
import PostBox from "../../components/PostBox/PostBox";
import {Link} from "react-router-dom";

const postItem = (item, key) => (
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
    />
);

const BlogPage = ({id}) => {

    const [posts, setPosts] = useState([]);
    const [, setStatus] = useContext(StatusContext);

    const getPage = () => {
        setStatus({type: 'addConnection'});
        setPosts([]);
        axios.get(API + "posts/?postid=" + id + "&" + TOKEN)
            .then(res => {
                setPosts(res.data.results)
            }).finally(() => setStatus({type: 'removeConnection'}))
    };

    useEffect(getPage, [id]);

    return (
        <>
            {!!posts.length &&
            <OurHelmet
                title={posts[0].post.post_title + " | YOUANDX"}
                fbTitle={posts[0].post.post_title}
                fbDescription={posts[0].post.post_teaser}
                fbImage={"images" in posts[0] && "full" in posts[0].images && posts[0].images.full[0]}
                fbType="article"
                fbUrl={posts[0].link}
            />
            }

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

            <LazyLoadPosts
                endpoint={`${API}posts/?posttype=post&${TOKEN}`}
                postsPerLoad={20}
                pageId={id}
                reload={id}
                containerClass={"container"}
                postLabel={"opslag"}
                PostComponent={postItem}
            />

        </>

    )
};

export default BlogPage;
