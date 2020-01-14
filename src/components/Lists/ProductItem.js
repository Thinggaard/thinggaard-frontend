import ProductTypePopOver from "../PostBox/ProductTypePopOver";
import ListItem from "./ListItem";
import React from "react";
import {Link} from "react-router-dom";

const ProductItem = ({post, speakerImages}) => {

    return (
        <ListItem link={"/products/" + post.post_name}
                  title={post.meta.teaser_headline}
                  image={post.images && post.images.thumbnail ? post.images.thumbnail[0]
                      : speakerImages && speakerImages.thumbnail ? speakerImages.thumbnail[0]
                          : post.terms ? [post.terms[Math.floor(Math.random() * post.terms.length)].images[0].sizes['home-speaker']]
                              : ['']}
        >
            <Link to={"/products/" + post.post_name}><h6 className="text-info font-weight-light">{post.post_title}</h6>
            </Link>
            <div className="d-flex flex-wrap">
                <ProductTypePopOver
                    type={post.meta.product_appetizer ? "appetizer" : post.meta.product_type === "workshop" ? "workshop" : "foredrag"}/>
                {post.terms && post.terms.map((term, i) => {
                    if (i < 4)
                        return (
                            !!term &&
                            <Link key={i} to={term.path}>
                                <span
                                    className="tag-name term-name"
                                    style={{lineHeight: 1}}
                                >
                                   {term.name}
                                </span>
                            </Link>
                        );
                    else return "" //Renders nothing, prevents warnings
                })}
            </div>

        </ListItem>
    )
};

export default ProductItem;
