// File created : 07-03-2019 09:46
import React, {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import SearchBar from "../Search/SearchBar";
import './Header.css';
import parse from 'html-react-parser';
import {UserContext} from "../../store/Store";
import {FaCaretDown, FaTimes} from "react-icons/fa";
import MenuDropdown from "./MenuDropdown";
import Resize from "../WindowEvents/Resize";
import {getRelativeURL} from "../../functions/parserFunctions";
import ShowPhone from "../Utility/ShowPhone";
import UserIcon from "../User/UserIcon";

const Header = ({logo, menu}) => {

    const [headerClass, setHeaderClass] = useState('');
    const [showNavItems, setShowNavItems] = useState(false);
    const [openMenus, setOpenMenus] = useState([]);
    const [isHamburger, setIsHamburger] = useState(window.innerWidth < 960);

    const hamburgerUpdate = () => {
        setIsHamburger(window.innerWidth < 1200);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const handleScroll = () => {
        if (window.pageYOffset > 20) {
            setHeaderClass('black-header')
        } else {
            setHeaderClass('')
        }
    };

    const [user,] = useContext(UserContext);

    const renderMenuItem = (item, key) => {
        if (!item.children || !item.children.length) return (
            <li className="nav-item" key={key} onClick={() => setShowNavItems(false)}>
                <Link className="nav-link"
                      to={getRelativeURL(item.url)}>
                    <span>{parse(item.title)}</span>
                </Link>
            </li>
        );

        //Recursive dropdown nesting:
        return (
            <MenuDropdown
                key={key}
                open={openMenus.includes(item.ID)}
                isHamburger={isHamburger}
                doOpen={() => {
                    if(!openMenus.includes(item.ID)) setOpenMenus(p => [...p, item.ID]);
                }}
                doClose={() => {
                    setOpenMenus(p => p.filter(x => {
                        return x !== item.ID
                    }))
                }}
                top={30}
                titleComponent={
                    <span key={key} onClick={() => setShowNavItems(false)}>
                        <Link to={getRelativeURL(item.url)} className={"nav-link"}>
                            {parse(item.title)}
                            {
                                !isHamburger &&
                                <FaCaretDown/>
                            }
                        </Link>
                    </span>
                }
            >
                {
                    item.children.map(subitem => renderMenuItem(subitem, subitem.ID))
                }
            </MenuDropdown>
        )
    };

    return (
        <header className={'top-navigation ' + headerClass}>

            <Resize callback={hamburgerUpdate}/>

            <div className="container">
                <div className="row justify-content-between">
                    <div className="col col-sm-11 col-lg">
                        <h1 className="site-title">
                            <Link to={'/'}
                                  style={{
                                      background: `url("${logo}") no-repeat`
                                  }}
                            ><span style={{display: 'none'}}>YOUANDX</span></Link>
                        </h1>
                        <span className="desktop-searchbar"><SearchBar/></span>
                    </div>

                    <div className="col">
                        <div className="row">
                            <div className="col">
                                {!isHamburger &&
                                <div className="row">
                                    <div className={"col text-right m-0 header-phone"}>
                                        <ShowPhone/>
                                    </div>
                                </div>
                                }
                                <div className="row">

                                    <div onClick={() => setShowNavItems(!showNavItems)}
                                         className="menu-icon">
                                        {
                                            showNavItems ? <FaTimes/> :
                                                <div className={"hamburger"}>
                                                    <div style={{backgroundColor: "rgb(38, 180, 74)"}}/>
                                                    <div style={{backgroundColor: "rgb(123, 197, 110)"}}/>
                                                    <div style={{backgroundColor: "rgb(175, 217, 167)"}}/>
                                                </div>
                                        }
                                    </div>
                                    <ul className={`col nav justify-content-end nav-items ${showNavItems ? '' : 'hidden-nav'}`}>
                                        <span className="mobile-searchbar"><SearchBar mobile={true}/></span>
                                        {
                                            menu.map(item => (
                                                renderMenuItem(item, item.ID)
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>

                            {
                                !!user.id &&
                                <ul className={`col-auto nav justify-content-end nav-items ${showNavItems ? '' : 'hidden-nav'}`}>
                                    <li className="nav-item" key="profile" onClick={() => setShowNavItems(false)}>
                                        <Link className={"nav-link h-100 d-flex align-items-center justify-content-center"} to="/profile">
                                            <UserIcon name={user.name} size={40}/>
                                        </Link>
                                    </li>
                                </ul>
                            }

                        </div>
                    </div>

                </div>

            </div>
        </header>
    );
};

export default Header;
