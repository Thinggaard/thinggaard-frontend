// File created : 12-03-2019 11:51
import React, {Component} from 'react';
import './Footer.css';
import {Link} from "react-router-dom";
import {FaEnvelope, FaFacebookF, FaLinkedinIn, FaYoutube} from "react-icons/fa";
import {getRelativeURL} from "../../functions/parserFunctions";
import ShowPhone from "../Utility/ShowPhone";
import {SITE_HOST} from "../../constants";

const year = new Date().getFullYear();

class Footer extends Component {

    render() {
        const {menu, termsMenu} = this.props;

        return (
            <footer style={{
                backgroundColor: '#3B3D40',
            }}>
                {
                    SITE_HOST !== "production" &&
                    <div
                        className="bg-danger text-center w-100"
                        style={{
                            position: "fixed",
                            bottom: 0,
                            zIndex: 100,
                        }}
                    >
                        TEST SITE
                    </div>
                }

                <div className="container">
                    <div className="row justify-content-between footer-content">
                        <div className="col-12 col-md-5 col-lg-3">
                            <div className={"footerText"}>{this.props.footertext}</div>
                            <h1 className="site-title">
                                <Link to={'/'}
                                      style={{
                                          margin: '15px 0',
                                          background: `url("${this.props.logo}") no-repeat`
                                      }}
                                ><span style={{display: 'none'}}>YOUANDX</span></Link>
                            </h1>
                        </div>
                        <div className="col-12 col-md-5 col-lg-4 align-top">
                            <div className="nav flex-column align-text-top">
                                {
                                    menu.map((item) => (
                                        <li className="nav-item" key={item.ID}>
                                            <Link className="nav-link"
                                                  to={getRelativeURL(item.url)}>{item.title}</Link></li>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="col-12 col-lg-3">
                            <p>YOUANDX / UPTOWN<br/>
                            <a target="_blank" rel="noopener noreferrer" href="https://goo.gl/maps/FysRLyA2Zak25ZjF7">
                                Sundkaj 125, Pakhus 47 3th.
                            </a><br/>
                            2150 Nordhavn</p>
                            <p>Ring til os: <ShowPhone/></p>


                            <div className="nav social-icons">
                                <a href="mailto:info@youandx.com" className="nav-link">
                                    <li className="nav-item"><FaEnvelope/></li>
                                </a>
                                <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/youandx/"
                                   className="nav-link">
                                    <li className="nav-item"><FaFacebookF/></li>
                                </a>
                                <a target="_blank" rel="noopener noreferrer"
                                   href="https://dk.linkedin.com/company/youandx"
                                   className="nav-link">
                                    <li className="nav-item"><FaLinkedinIn/></li>
                                </a>
                                <a target="_blank" rel="noopener noreferrer"
                                   href="https://www.youtube.com/channel/UC6M0dTYFMssqaNAlQw_s6hQ"
                                   className="nav-link">
                                    <li className="nav-item"><FaYoutube/></li>
                                </a>
                            </div>
                            
                            <div className={"pt-3"}>
                                <a href="https://www.ingenco2.dk/crt/dispcust/c/5044/l/2" target="_blank" rel="noopener noreferrer">
                                    <img src="/img/ingenco2-logo.png" alt="CO2 neutralt website"/>
                                </a>
                            </div>

                        </div>
                    </div>

                    <hr className="site-footer-border"/>
                    <div className="site-footer row">
                        <div className="col col-md-8">
                            <div className="nav align-text-top">
                                {
                                    termsMenu.map((item) => (
                                        <li className="nav-item" key={item.ID}>
                                            <Link className="nav-link"
                                                  to={getRelativeURL(item.url)}>{item.title}
                                            </Link>
                                        </li>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="col col-md-4" style={{textAlign: 'right'}}>    &#9400; {year} youandx
                        </div>
                    </div>
                </div>

            </footer>
        );
    }
}

export default Footer;
