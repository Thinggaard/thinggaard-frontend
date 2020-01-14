// File created : 03-05-2019 19:50
import React, {Component} from 'react';
import axios from "axios";
import {API, TOKEN} from "../../constants";
import PostBox from "../../components/PostBox/PostBox";
import OurHelmet from "../../components/Utility/OurHelmet";
import {getRelativeURL, parseShortCodes} from "../../functions/parserFunctions";

class PageBoardMembers extends Component {

    constructor(props) {
        super(props);
        this.postsContainer = React.createRef();
    }

    state = {
        posts: [],
        employees: [],
        loading: true,
        endLoad: false,
    };

    mounted = true;

    componentDidMount() {
        this.getPage(this.props.id);
        this.getEmployees()
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.id !== this.props.id) {
            this.getPage(this.props.id);
            this.getEmployees()
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        window.removeEventListener("scroll", this.scrollTrigger)
    }

    getPage = (id) => {
        this.setState({posts: []});
        axios.get(API + "posts/?postid=" + id + "&" + TOKEN)
            .then(res => {
                if (this.mounted) this.setState({posts: res.data.results})
            })
    };


    getEmployees = () => {
        this.setState({loading: true});
        axios.get(`${API}employees/?orderby=menu_order&order=ASC&filter=boardmembers&${TOKEN}`)
            .then(res => {
                if (this.mounted && res.data.status) {
                    this.setState(prev => ({
                        employees: prev.employees.concat(res.data.results),
                        loading: false
                    }))
                } else if (this.mounted) this.setState({loading: false, endLoad: true})
            })
    };


    render() {
        const {posts} = this.state;

        return (
            <>
                {!!posts.length && <OurHelmet
                    title={posts[0].post.post_title + " | YOUANDX"}
                    fbTitle={posts[0].post.post_title}
                    fbDescription={posts[0].post.post_teaser}
                    fbImage={"images" in posts[0] && "full" in posts[0].images && posts[0].images.full[0]}
                    fbType="article"
                    fbUrl={posts[0].link}
                />}
                <div className="container" style={{paddingTop: '120px '}}>
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
                <div className="container" ref={this.postsContainer}>
                    <div className="row">
                        {!!this.state.employees.length && this.state.employees.map((item, key) => {
                            return (
                                <PostBox
                                    styles={{pointerEvents: "none"}}
                                    key={key}
                                    className="mb-5"
                                    subtitle={item.post.meta.employee_title}
                                    title={item.post.post_title}
                                    image={item.images.thumbnail[0]}
                                    link={getRelativeURL(item.link)}
                                    video={item.post.meta.employee_featured_video}
                                    smallspacing={true}
                                >
                                    <p style={{pointerEvents: "auto"}}>
                                        <a href={`mailto:${item.post.meta.employee_email}`}>
                                            {item.post.meta.employee_email}
                                        </a>
                                        {!!item.post.meta.employee_email && !!item.post.meta.employee_phone && " / "}
                                        {item.post.meta.employee_phone}
                                    </p>

                                </PostBox>)
                        })}
                    </div>
                </div>
            </>

        )
    }
}

export default PageBoardMembers;
