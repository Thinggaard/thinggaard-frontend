import React, {useState} from 'react';
import {Redirect} from "react-router-dom";
import Login from "./Login";
import CreateUser from "./CreateUser";
import ForgotPassword from "./ForgotPassword";

const LoginScreen = ({shouldRedirect = true}) => {
    const [redirect, setRedirect] = useState("");
    const [createUser, setCreateUser] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);

    const renderRedirect = () => {
        if (!!redirect && shouldRedirect) {
            return <Redirect to={redirect}/>
        }
    };

    return (
        <>
            {renderRedirect()}
            {
                forgotPassword ? <ForgotPassword/> :
                createUser ?
                    <CreateUser setRedirect={setRedirect} setCreateUser={setCreateUser}/>
                    :
                    <Login setRedirect={setRedirect} setCreateUser={setCreateUser} setForgotPassword={setForgotPassword}/>

            }
        </>
    );

};

export default LoginScreen;

