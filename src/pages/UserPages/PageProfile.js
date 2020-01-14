// File created : 28-06-2019 15:05
import React, {useContext, useEffect} from 'react';
import {UserContext} from '../../store/Store';
import {getUserByToken, logOutUser} from "../../functions/userFunctions";
import LoginScreen from "../../components/User/LoginScreen";
import UserIcon from "../../components/User/UserIcon";
import {WP_ROOT} from "../../constants";
import {Link} from "react-router-dom";

const LinkButton = ({href, children, color="btn-light"}) => {
    return (
        <a className={`btn btn-sm ml-4 ${color}`} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
    )
};

const date = new Date();
const dateQuery = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

const PageProfile = () => {

    const [user, setUser] = useContext(UserContext);


    useEffect(() => {
        getUserByToken(null, setUser)
            .then(res => {

            })
            .catch(err => {

            })
    }, [setUser]);

    const isAdmin = !!user.roles && user.roles.includes("administrator");

    return (
        <>

            {!user.id ?
                <div className="container d-flex justify-content-center" style={{marginTop: 120}}>
                    <LoginScreen shouldRedirect={false}/>
                </div>
                :
                <div className="container" style={{marginTop: 120}}>
                    <div className="row">

                        <div className="col">
                            <div className="row">
                                <div className="col-auto align-self-end">
                                    <UserIcon name={user.name} size={100}/>
                                </div>
                                <div className="col align-self-end">
                                    <h3 className="m-0">{user.name}</h3>
                                    <ul className="list-unstyled mt-0 mb-2">
                                        <li>{user.email}</li>
                                    </ul>
                                    <button onClick={() => logOutUser(setUser)}
                                            className="btn btn-outline-danger btn-sm mr-3">Log ud
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {isAdmin &&
                        <div className="row">
                            <div className="col my-4 border-primary border-top">
                                <h3 className="mt-5 text-success">
                                    LIVE :
                                    <LinkButton color={"btn-success"} href={"https://wp.youandx.com/wp-admin/"}>WordPress Admin</LinkButton>
                                </h3>
                                <h3 className="mt-5 text-danger">
                                    TEST :
                                    <LinkButton color={"btn-danger"} href={"https://qa.youandx.com/"}>QA site</LinkButton>
                                    <LinkButton color={"btn-danger"} href={"https://wp.qa.youandx.com/wp-admin/"}>QA WordPress</LinkButton>
                                </h3>
                                <small>Ændringer der foretages her betyder ikke noget for live siden. Mails bliver ikke sendt ud fra dette site</small>

                                <h3 className="mt-5">
                                    Interne sider :
                                    <Link className={`btn btn-sm ml-4 btn-light`} to={"/show-bookings?&statusFilter=&minDate="+dateQuery+"&sortBy=booking_datestamp&order=1"} >Vis bookinger</Link>
                                    <LinkButton href={WP_ROOT+"/export-speakers/"}>Eksporter speakers</LinkButton>
                                    <LinkButton href={"https://tasks.office.com/youandx.com/en-US/Home/Planner#/plantaskboard?groupId=ade3f61c-26f9-440b-95ba-a9808c23fed3&planId=CYVJ776SBkae-DayxqVnDJcAEbUy"}>Website TO DO</LinkButton>
                                </h3>

                                <h2 className="mt-5">Guides</h2>
                                <ul>
                                    <li>Åbn den nuværende side som gæst : Kopier linket og åbn privat/incognito vindue (Chrome : cmd/ctrl + shift + n). Gå til link i det nye vindue</li>
                                </ul>

                            </div>
                        </div>
                    }

                </div>

            }
        </>

    );

};

export default PageProfile;
