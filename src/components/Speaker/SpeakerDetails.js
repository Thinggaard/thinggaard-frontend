import React from "react";
import Stars from "./Stars";
import {Link} from "react-router-dom";

export default ({speaker}) => {

    const ratingsAverage = !!speaker && speaker.post.ratingsaverage;
    const ratingsCount = !!speaker && speaker.post.ratingscount;

    return (
        <div className="col">
            {(ratingsCount && ratingsCount > 2) &&
            <div className={"speaker-ratings mb-4"}>
                <h6 className={"sidebar-meta-headline mb-2"}>Rating af {speaker.post.post_title}</h6>
                <div className={"speaker-ratings-stars"}><Stars rating={ratingsAverage}/>
                    <span className={"speaker-ratings-stars-text"}>{100 / 5 * ratingsAverage}% tilfredshed</span>
                </div>
                <div className={"speaker-ratings-count"}>Baseret på {ratingsCount} anmeldelser.</div>
            </div>
            }
            <div className={"speaker-categories mb-4"}>
                <h6 className={"sidebar-meta-headline mb-2"}>Roller</h6>
                {
                    speaker.post.meta.speaker_roles && speaker.post.meta.speaker_roles.map((tag, index) => (
                        <div key={index} className="sidebar-categories">
                            {tag === "OneToOne" ? "1:1" : tag}
                        </div>
                    ))
                }
            </div>
            <div className={"speaker-categories mb-4"}>
                <h6 className={"sidebar-meta-headline mb-2"}>Kategorier</h6>
                {
                    speaker.post.categories && speaker.post.categories.map((tag, index) => (
                        !!tag && tag.slug && tag.name &&
                        <Link to={'/speakercategories/' + tag.slug}
                              className="sidebar-categories"
                              key={index}>
                            {tag.name}
                        </Link>
                    ))
                }
            </div>


            <div className={"speaker-tags"}>
                <h6 className={"sidebar-meta-headline mb-2"}>Emner</h6>
                {

                    speaker.post.terms && speaker.post.terms.map((tag, index) => (
                        !!tag && tag.slug && tag.name &&
                        <Link to={'/speakertags/' + tag.slug}
                              className="sidebar-tags"
                              key={index}>
                            {tag.name}
                        </Link>
                    ))
                }
            </div>

        </div>
    );
}