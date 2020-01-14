// File created : 03-05-2019 19:50
import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {API, TOKEN} from "../../constants";
import OurHelmet from "../../components/Utility/OurHelmet";
import LazyLoadPosts from "../../components/LazyLoadPosts/LazyLoadPosts";
import SingleSpeaker from "./SingleSpeaker";
import {StatusContext} from "../../store/Store";
import PostBox from "../../components/PostBox/PostBox";
import {getRelativeURL, insertParam} from "../../functions/parserFunctions";
import {Link} from "react-router-dom";
import {parse} from "query-string";
import MultiButtonSelect from "../../components/Filtering/MultiButtonSelect";
import ContentHero from "../../components/GeneralContent/ContentHero";

const TermSpeakerItem = ({item}) =>  (
    <PostBox
        classes="col-12 col-sm-6 col-lg-4 post"
        title={item.post.meta.teaser_headline}
        subtitle={item.post.post_title}
        image={item.images.thumbnail[0]}
        link={getRelativeURL(item.link)}
        video={item.post.meta.speaker_featured_video}
        children={item.post.categories && item.post.categories.map((term, i) => {
            return (
                !!term &&
                <span className="term-name" key={i}>
                    <Link to={term.path}>{term.name}</Link>
                </span>
            );
        })}
    />
);

const PageSpeakers = ({id, taxonomy, x}) => {

    const [posts, setPosts] = useState([]);
    const [termId, setTermId] = useState(0);

    const[showFilters, setShowFilters] = useState(false);
    const[categories, setCategories] = useState([]);
    const[selectedCategories, setSelectedCategories] = useState([]);
    const[tags, setTags] = useState([]);
    const[selectedTags, setSelectedTags] = useState([]);

    const[reloads, setReloads] = useState(0);

    const [, setStatus] = useContext(StatusContext);

    let endpoint = !!taxonomy ? "term/?taxonomy="+taxonomy+"&slug=" + x.match.params.term : "posts/?postid=" + id;
    const params = parse(window.location.search);

    const onMount = () => {
        if(!!params.categories) setSelectedCategories(params.categories.split(","));
        axios.get(API + 'filter-options?' + TOKEN)
            .then(res => {
                setTags(res.data.results.speaker_tags);
                setCategories(res.data.results.speaker_categories);
            });
    };
    useEffect(onMount, []);

    const onSearch = () => {
        if (reloads) {
            insertParam("categories", selectedCategories.join(","));
        }
    };
    useEffect(onSearch, [reloads]);

    const getPage = () => {

        setStatus({type: 'addConnection'});
        setPosts([]);

        axios.get(API + endpoint + "&" + TOKEN)
            .then(res => {
                if(!!taxonomy && res.data.results.term_id){
                    setTermId(res.data.results.term_id);
                }
                setPosts(res.data.results);
            }).finally(() => setStatus({type: 'removeConnection'}))
    };

    // mount, pageId
    useEffect(getPage, [id]);

    const categoryQuery = selectedCategories.length ? selectedCategories.join(",") : params.categories;

    let termQuery = taxonomy === "speakercategories" ? "&categories="+termId :
        taxonomy === "speakertags" ? "&tags="+termId :
            categoryQuery ? "&categories=" + categoryQuery : "";

    if (!!params.tags) termQuery+="&tags=" + params.tags;

    if (!!taxonomy){
        return (
            <>
                {!!posts && <>

                <OurHelmet
                    title={posts.doctitle ? posts.doctitle : posts.name}
                    fbTitle={posts.doctitle ? posts.doctitle : posts.name}
                    fbDescription={posts.teaser_headline}
                    fbImage={posts.header_image}
                    fbType="article"
                    fbUrl={posts.permalink}
                />

                <ContentHero
                    title={posts.name}
                    doctitle={posts.doctitle}
                    text={posts.intro_text}
                    coverImage={posts.header_image}
                    coverFilter='50'
                    coverPosition='center center'
                    thumbnail=''
                    subtitle=''
                    buttonText=''
                />

                    <div className="container postBoxList pt-3">

                        <div className="row">
                            <div className="col">
                                <h4 className="green-marker small-size">Foredrag om {posts.name} </h4>
                            </div>
                        </div>

                        { !!termId &&
                            <LazyLoadPosts
                                reload={termQuery}
                                endpoint={API + "speakers/?" + TOKEN + termQuery}
                                postsPerLoad={20}
                                id={id}
                                postLabel={"foredragsholdere"}
                                containerClass={"mt-4"}
                                PostComponent={(post, key) => <TermSpeakerItem item={post} key={key}/>}
                            />
                        }

                    </div>

                </>}


            </>
        )
    }

    return (
        <>

            {!!posts.length && <OurHelmet
                title={posts[0].post.post_title + " | YOUANDX"}
                fbTitle={posts[0].post.post_title}
                fbDescription={posts[0].post.post_teaser}
                fbImage={"images" in posts[0] && "header" in posts[0].images && posts[0].images.header[0]}
                fbType="article"
                fbUrl={posts[0].link}
            />}

            {
                posts.map((post, i) => (

                    <ContentHero
                        key={i}
                        title={post.post.post_title}
                        doctitle={post.post.post_title}
                        text={post.post.post_content}
                        coverImage={post.images.header[0]}
                        coverFilter=''
                        coverPosition='center center'
                        thumbnail=''
                        subtitle=''
                        buttonText=''
                        contentRight={
                            showFilters &&
                            <div className="text-center">
                                <h4>Emner</h4>
                                <div className="overflow-auto" style={{maxHeight: 480}}>
                                    <MultiButtonSelect
                                        choices={tags}
                                        idKey={"term_id"}
                                        titleKey={"name"}
                                        selected={selectedTags}
                                        setSelected={setSelectedTags}
                                        selectedClass={"btn btn-sm btn-light"}
                                        btnClass={"btn btn-sm btn-outline-light"}
                                    />
                                </div>

                            </div>
                        }
                    >
                        <div className={"mt-4"}>
                        <MultiButtonSelect
                            choices={categories}
                            idKey={"term_id"}
                            titleKey={"name"}
                            selected={selectedCategories}
                            setSelected={setSelectedCategories}
                        />
                        </div>
                        <div className="pt-3">
                            <button onClick={() => setShowFilters(p => !p)} className="btn btn-primary mr-3 d-none d-lg-inline-block">{showFilters ? "Skjul filtre" : "Flere filtre"}</button>
                            <button onClick={() => setSelectedCategories([])} className="btn btn-primary mr-3 d-none d-lg-inline-block">Nulstil</button>
                            <button className="btn btn-success" onClick={() => {setReloads(p => p+1)} }>Søg</button>
                        </div>
                    </ContentHero>

                ))
            }

            <LazyLoadPosts
                reload={reloads}
                endpoint={`${API}speakers/?orderby=post_title&order=ASC&${TOKEN}${termQuery}`}
                postsPerLoad={20}
                id={id}
                postLabel={"foredragsholdere"}
                containerClass={"container mt-4"}
                PostComponent={(post, key) => <SingleSpeaker post={post} key={key}/>}
            />

        </>

    )

};

export default PageSpeakers;
