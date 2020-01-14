// File created : 03-05-2019 12:05
import React, {Component} from 'react';
import axios from "axios";
import {API, TOKEN, WP_ROOT} from "./constants";
import asyncComponent from "./components/asyncComponent";
import AdminFooter from "./components/AdminFooter/AdminFooter";
import {correctUrl} from "./functions/parserFunctions";
import {getUserToken} from "./functions/userFunctions";

const AsyncProductPage = asyncComponent(() => import("./pages/Products/ProductPage"));
const AsyncPage404 = asyncComponent(() => import("./pages/Page404"));
const AsyncSpeakerPage = asyncComponent(() => import("./pages/Speakers/SpeakerPage"));
const AsyncPodcastPage = asyncComponent(() => import("./pages/Podcasts/PodcastPage"));
const AsyncPage = asyncComponent(() => import("./pages/Page/Page"));
const AsyncPost = asyncComponent(() => import("./pages/Post/Post"));
const AsyncPageEmployees = asyncComponent(() => import("./pages/PageEmployees/PageEmployees"));
const AsyncPageBoardMembers = asyncComponent(() => import("./pages/PageBoardMembers/PageBoardMembers"));
const AsyncPageSpeakers = asyncComponent(() => import("./pages/PageSpeakers/PageSpeakers"));
const AsyncPageProducts = asyncComponent(() => import("./pages/PageProducts/PageProducts"));
const AsyncBlogPage = asyncComponent(() => import("./pages/BlogPage/BlogPage"));
const AsyncPagePodcasts = asyncComponent(() => import("./pages/PagePodcasts/PagePodcasts"));
const AsyncPageTerms = asyncComponent(() => import("./pages/PageTerms/PageTerms"));
const AsyncShotgunPost = asyncComponent(() => import("./pages/Post/ShotgunPost"));
const AsyncPageProfile = asyncComponent(() => import("./pages/UserPages/PageProfile"));
const AsyncPageLogin = asyncComponent(() => import("./pages/UserPages/PageLogin"));
const AsyncReviewPage = asyncComponent(() => import("./pages/ReviewPage/ReviewPage"));

const userToken = getUserToken();
const authHeader =  !!userToken ? {Authorization: "Bearer " + userToken} :{};


export default class PageLoader extends Component {

    state = {
        type: null,
        template: null,
        typeLoaded: false,
        postId: null,
    };

    mounted = false;

    componentDidMount() {
        this.mounted = true;
        this.getPage();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const slug = this.props.x.location.pathname;
        const prevSlug = prevProps.x.location.pathname;
        if (!!prevSlug && slug !== prevSlug) {
            this.getPage();
        }
    }

    getPage = () => {
        const {x} = this.props;
        const slug = x.location.pathname;
        this.setState({typeLoaded: false});
        axios.get(API + "urlinfo?url=" + slug + "&" + TOKEN, {headers: authHeader})
            .then(res => {
                const results = res.data.results;
                if (results.redirect) correctUrl(results.slug);
                if (this.mounted) {
                    this.setState({
                        type: results && results.posttype ? results.posttype : null,
                        template: results && results.posttemplate ? results.posttemplate : null,
                        postId: results && results.ID ? results.ID : null,
                        typeLoaded: true,
                    })
                }
            });
    };

    templateLoader = (type, template) => {
        const {postId} = this.state;

        if (type === "page" && (!template || template === "default")) return (<AsyncPage id={postId}/>);
        if (type === "post" && (!template || template === "default")) return (<AsyncPost id={postId}/>);

        switch (template) {
            case "blog":
                return (<><AsyncBlogPage id={postId}/><AdminFooter postId={postId}/></>);

            case "employees":
                return (<AsyncPageEmployees id={postId}/>);

            case "boardmembers":
                return (<AsyncPageBoardMembers id={postId}/>);

            case "speakers":
                return (<AsyncPageSpeakers id={postId}/>);

            case "products":
                return (<AsyncPageProducts id={postId}/>);

            case "profile":
                return (<AsyncPageProfile id={postId}/>);

            case "login":
                return (<AsyncPageLogin id={postId}/>);

            case "podcast":
                return (<AsyncPagePodcasts id={postId}/>);

            case "tags" :
                return (<AsyncPageTerms id={postId} template={template}/>);

            case "categories" :
                return (<AsyncPageTerms id={postId} template={template}/>);

            case "review" :
                return (<AsyncReviewPage id={postId}/>);

            case "shotgun" :
                return <AsyncShotgunPost id={postId}/>;

            default:
                return (<AsyncPage id={postId}/>);
        }
    };


    heyRender() {
        const {type, template, typeLoaded, postId} = this.state;
        const {x} = this.props;
        const slug = x.location.pathname;

        switch (type) {
            case "speakers" :
                return (<AsyncSpeakerPage slug={slug} type={"speakers"} id={postId}/>);

            case "products" :
                return (<AsyncProductPage slug={slug} type={"products"} id={postId}/>);

            case "podcast" :
                return (<AsyncPodcastPage slug={slug} type={"podcast"} id={postId}/>);

            case "page" :
                return this.templateLoader(type, template);

            case "post" :
                return this.templateLoader(type, template);

            default: //Do nothing..
        }

        if (typeLoaded) return (<AsyncPage404 url={slug}/>);

        return (
            <div className="container" style={{paddingTop: '120px '}}>
                {/*<h3>Henter...</h3>*/}
            </div>
        );
    }

    render()
    {
        const {postId} = this.state;
        return (
            <>
                {this.heyRender()}
                <AdminFooter postId={postId}/>
            </>
        )
    }
}
