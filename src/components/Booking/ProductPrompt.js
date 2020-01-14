import ProductTypePopOver from "../PostBox/ProductTypePopOver";
import React from "react";
import Overlay from "../Overlay/Overlay";
import LinkListItem from "../Lists/LinkListItem";
import {getRelativeURL} from "../../functions/parserFunctions";

export default ({speaker, open, toggleOverlay, action}) => {

    return (
        <>
            {
                !!speaker &&
                <Overlay
                    title={`Vælg produkt fra ${speaker.post.post_title}`}
                    toggleOverlay={toggleOverlay}
                    open={open}
                >
                    <h5 className="text-center mt-1 mb-3">Tilgængelige Produkter:</h5>
                    <div className={"booking-speaker-products row"}>
                        {
                            !!speaker &&
                            speaker.post.products.map((product, i) => (
                                    <div
                                        className="col-12"
                                        key={product.ID}
                                    >
                                        <LinkListItem
                                            title={product.meta.teaser_headline}
                                            link={getRelativeURL(product.link)+"?action="+action}
                                            image={product.images && product.images.thumbnail ? product.images.thumbnail[0]
                                                : speaker.images && speaker.images.thumbnail ? speaker.images.thumbnail[0]
                                                    : product.terms ? [product.terms[Math.floor(Math.random() * product.terms.length)].images[0].sizes['home-speaker']]
                                                        : ['']}
                                        >
                                            <h6 className="text-info font-weight-light">{product.meta.product_type === "workshop" && "WORKSHOP : "}{product.post_title}</h6>
                                            <ProductTypePopOver
                                                type={product.meta.product_appetizer ? "appetizer" : product.meta.product_type === "workshop" ? "workshop" : "foredrag"}/>

                                        </LinkListItem>
                                    </div>
                                )
                            )
                        }
                    </div>
                </Overlay>
            }
        </>
    )
};