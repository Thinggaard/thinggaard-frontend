import React from 'react';
import PostBox from "../../components/PostBox/PostBox";
import {Link} from "react-router-dom";
import {getRelativeURL} from "../../functions/parserFunctions";

const SingleSpeaker = ({post}) => {

    if (!post) return null;

    return (
        <PostBox
            className="mb-5"
            title={post.post.meta.teaser_headline}
            subtitle={post.post.post_title}
            image={post.images.thumbnail[0]}
            link={getRelativeURL(post.link)}
            video={post.post.meta.speaker_featured_video}
        >
            {
                post.post &&
                <>
                    {post.post.categories && post.post.categories.map((term, i) => {

                            return (
                                !!term &&
                                <Link className="category-name term-name text-primary" key={i} to={term.path ? term.path : "#"}>
                                    {term.name}
                                </Link>
                            );
                    })}
                    {post.post.terms && post.post.terms.map((term, i) => {

                            return (
                                !!term &&
                                <Link className="tag-name term-name" key={i} to={term.path ? term.path : "#"}>
                                    {term.name}
                                </Link>
                            );
                    })}
                </>
            }
        </PostBox>
    )
};

export default SingleSpeaker;
