import React, {useContext, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './bootstrap.min.css';
import './animate.css';
import './App.css';
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import PageLoader from "./PageLoader";

import IEAlert from "./components/Status/IEAlert";
import {SiteInfoContext, StatusContext, UserContext} from "./store/Store";
import axios from "axios";
import {API, LOGO_URL, TOKEN} from "./constants";
import {getUserByToken} from "./functions/userFunctions";
import LoadingModal from "./components/Status/LoadingModal";
import ScrollToTop from "./components/Utility/ScrollToTop";
import TagManager from "react-gtm-module";
import ReactPixel from "react-facebook-pixel";
import asyncComponent from "./components/asyncComponent";
import ReactGa from "react-ga";

const AsyncFrontPage = asyncComponent(() => import("./pages/FrontPage"));
const AsyncSearchPage = asyncComponent(() => import("./pages/SearchPage/SearchPage"));
const AsyncChangePasswordPage = asyncComponent(() => import("./pages/UserPages/PageChangePassword"));
const AsyncPageSpeakers = asyncComponent(() => import("./pages/PageSpeakers/PageSpeakers"));

const AsyncShowBookingsPage = asyncComponent(() => import("./pages/Admin/ShowBookingsPage"));

const tagManagerArgs = {
    gtmId: 'GTM-WWQSDJC'
};

TagManager.initialize(tagManagerArgs);
ReactPixel.init("369211320204307", null, {autoConfig: true, debug: false});

ReactGa.initialize('UA-107862858-1');
const ga = ReactGa.ga;
ga('require', 'ecommerce');

const App = () => {

    const [siteInfo, setSiteInfo] = useContext(SiteInfoContext);
    const [user, setUser] = useContext(UserContext);
    const [status, dispatchStatus] = useContext(StatusContext);

    const onMount = () => {
        dispatchStatus({type: "addConnection"});
        axios.get(API + 'siteinfo?' + TOKEN).then(res => {
            setSiteInfo(res.data.results);
        }).finally(() => dispatchStatus({type: "removeConnection"}));

        if (!user.id) {
            getUserByToken(null, setUser)
                .then(res => {
                }).catch(() => {
            })
        }
    };
    useEffect(onMount, []);


    const logo = LOGO_URL;
//  const logo = siteInfo.bloginfo ? siteInfo.logo : '';

    const headerMenu = siteInfo.bloginfo ? siteInfo.menus.menu48.menu_items : [];
    const footerMenu = siteInfo.bloginfo ? siteInfo.menus.menu528.menu_items : [];
    const termsMenu = siteInfo.bloginfo ? siteInfo.menus.menu529.menu_items : [];
    //const blogInfo = siteInfo.bloginfo ? siteInfo.bloginfo : [];
    const footerText = siteInfo.bloginfo ? siteInfo.footer_text : [];


    return (
        <>
            <Router>
                <div className="app">
                    {status.activeConnections > 0 && <LoadingModal timeoutCallback={() => {
                        dispatchStatus({type: "clearConnections"})
                    }}/>}


                    <IEAlert/>

                    <Header logo={logo} menu={headerMenu}/>
                    <div style={{minHeight: '60vh'}}>

                        <Switch>
                            <Route exact path="/" component={AsyncFrontPage}/>
                            <Route exact path="/index.html" component={AsyncFrontPage}/>

                            <Route path="/search/:query" render={x => (<AsyncSearchPage x={x}/>)}/>

                            <Route path="/speakercategories/:term" render={x => (<AsyncPageSpeakers taxonomy={"speakercategories"} x={x} id={x.location.pathname}/>)}/>
                            <Route path="/speakertags/:term" render={x => (<AsyncPageSpeakers taxonomy={"speakertags"} x={x} id={x.location.pathname}/>)}/>

                            <Route path="/change-password/" component={AsyncChangePasswordPage}/>


                            <Route path={"/show-bookings"} component={AsyncShowBookingsPage}/>


                            <Route path="/" render={x => (<PageLoader x={x}/>)}/>n

                        </Switch>

                    </div>

                    <Footer menu={footerMenu} termsMenu={termsMenu} logo={logo} footertext={footerText}/>

                </div>

                <ScrollToTop/>
            </Router>

        </>
    );
};


export default App;
