// File created : 03-05-2019 19:50
import React from 'react';
import Post from "./Post";
import {Link} from "react-router-dom";
import FoldOut from "../../components/Overlay/FoldOut";

const ShotgunPost = props => {


    return (
        <>
            <Post
                id={props.id}
                rightSide={
                    <div className={"col-12 col-lg-4"}>
                        <FoldOut
                            title={"Alle episoder"}
                            expanded={true}
                        >
                            <ul className={"list-group"}>
                                <Link to={'/shotgun-1-peter-tanev/'}>
                                    <li className={"list-group-item bg-dark"}>SHOTGUN #1 | PETER TANEV</li>
                                </Link>

                                <Link
                                    to={'/shotgun-2-malena-sigurgeirsdottir-jessica-buhl-nielsen-insekter-paa-menuen/'}>
                                    <li className={"list-group-item bg-dark"}>SHOTGUN #2 | INSEKTER PÅ MENUEN</li>
                                </Link>

                                <Link to={'/shotgun-3-frej-prahl-i-kaerlighedens-tegn/ '}>
                                    <li className={"list-group-item bg-dark"}>SHOTGUN #3 - FREJ PRAHL | I KÆRLIGHEDENS
                                        NAVN
                                    </li>
                                </Link>

                                <Link to={'/shotgun-4-maria-flyvbjerg-bo-fintech-frihed-og-oekonomisk-uafhaengighed/'}>
                                    <li className={"list-group-item bg-dark"}>SHOTGUN #4 - Maria Flyvbjerg Bo | Fintech,
                                        frihed og økonomisk uafhængighed
                                    </li>
                                </Link>
                            </ul>
                        </FoldOut>
                    </div>
                }
            >

            </Post>
        </>
    );

};

export default ShotgunPost;
