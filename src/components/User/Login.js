import TextInput from "../Form/GravityForm/TextInput";
import React, {useContext, useState} from "react";
import {getUserByEmailOrUsername, getUserByToken, logInWithUsername} from "../../functions/userFunctions";
import validate from 'validator';
import {UserContext} from "../../store/Store";
import LoadingModal from "../Status/LoadingModal";


const Login = ({setRedirect, setCreateUser, setForgotPassword}) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [, setUser] = useContext(UserContext);

    const usernameLogin = (userName) => {
        logInWithUsername(userName, password, keepLoggedIn).then(token => {
            getUserByToken(token, setUser).then(
                setRedirect("/profile")
            );
        }).catch(err => {
            console.log(err);
            setLoginFailed(true);
        }).finally(() => {
            setLoading(false);
        });
    };

    const logIn = () => {
        setLoginFailed(false);
        setEmailError(false);
        setLoading(true);
        if (validate.isEmail(username)){
            getUserByEmailOrUsername(username).then(res => {
                if(res.data.status) usernameLogin(res.data.results.user_login);
                else setEmailError(true);
            }).catch(()=> {
                setEmailError(true)
            }).finally(()=> {
                setLoading(false);
            })
        }
        else usernameLogin(username);
    };

    return (
        <div className="w-100" style={{maxWidth: 800}} >

            {
                isLoading &&
                <LoadingModal
                    timeout={10000}
                    timeoutCallback={()=> {
                        setLoading(false);
                        setLoginFailed(true);
                    }}
                />
            }
            <h1>Log ind</h1>
            {
                loginFailed &&
                <p className="text-danger">
                    Kunne ikke logge ind. kontroller venligst at brugernavn og kodeord er indtastet korrekt
                </p>
            }
            {
                emailError &&
                <p className="text-danger">
                    Kunne ikke logge ind. Den indtastede email er ikke registreret som bruger.
                </p>
            }
            <form className="row" onSubmit={ e => {
                e.preventDefault();
                logIn();
            }}>
                <TextInput className={"col-12 col-md-6"} field={{type: "text", label: "Brugernavn/Email", visibility:"visible", isRequired:true}} onChange={setUsername}/>
                <TextInput className={"col-12 col-md-6"} field={{type: "password", label: "Adgangskode", visibility:"visible", isRequired:true}} onChange={setPassword}/>
                <div className="form-group col-12">
                    <button className="btn btn-success form-control" type="submit">Log ind</button>
                </div>


                {/*keep me logged in*/}
                <div className={"form-check text-center w-100"}>
                    <input
                        type="checkbox" className="form-check-input"
                        onChange={(e) => {setKeepLoggedIn(e.target.checked)}}
                        checked={keepLoggedIn}
                    />
                    <label className="form-check-label">Forbliv logget ind</label>
                </div>


                <div className="col-12 d-flex flex-row justify-content-center mt-2">
                    <p className="link mx-3" onClick={()=>setCreateUser(true)}>Opret bruger</p>
                    <p className="link mx-3" onClick={()=>setForgotPassword(true)}>Glemt adgangskode?</p>
                </div>

            </form>
        </div>
    )
};

export default Login;
