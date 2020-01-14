import TextInput from "../Form/GravityForm/TextInput";
import React, {useState} from "react";
import axios from 'axios';
import {getUserByEmailOrUsername, logInWithUsername} from "../../functions/userFunctions";
import validate from 'validator';
import {API, YX_TOKEN} from "../../constants";
import LoadingModal from "../Status/LoadingModal";


const CreateUser = ({setRedirect, setCreateUser}) => {

    const [username, setUsername] = useState("");
    const [usernameTaken, setUsernameTaken] = useState(false);
    const [email, setEmail] = useState("");
    const [emailAlreadyRegistered, setEmailAlreadyRegistered] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [passwordDiff, setPasswordDiff] = useState(false);
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [signupFailed, setSignupFailed] = useState(false);
    const [isLoading, setLoading] = useState(false);


    const signUp = () => {
        setEmailError(false);
        setSignupFailed(false);
        setPasswordDiff(false);
        setEmailAlreadyRegistered(false);
        setUsernameTaken(false);
        setLoading(true);

        if (!username || !email || !password || !repeatPassword) {
            setLoading(false);
            return;
        }
        if (password !== repeatPassword) {
            setPasswordDiff(true);
            setLoading(false);
            return;
        }
        if (!validate.isEmail(email)) {
            setEmailError(true);
            setLoading(false);
            return;
        }

        checkForDuplicateUsers(createUser);
    };

    const createUser = () => {
        axios.post(API + "user", {
            username, password, email, firstName, lastName, token: YX_TOKEN
        }).then((res) => {
            if (res.data.status) {
                login();
            } else setSignupFailed(true);
        }).catch(err => {
            console.log(err);
            setSignupFailed(true);
        }).finally(() => {
            setLoading(false);
        })
    };

    const login = () => {
        setLoading(true);
        logInWithUsername(username, password, keepLoggedIn).then(() => {
            setRedirect("/profile");
        }).finally(() => {
            setLoading(false)
        });
    };

    const checkForDuplicateUsers = (callback = () => {
    }) => {
        let finished = false;
        let duplicate = false;

        getUserByEmailOrUsername(email).then(res => {
            if (res.data.status && res.data.results.user_login) {
                setEmailAlreadyRegistered(true);
                duplicate = true;
                setLoading(false);
            }
            if (finished && !duplicate) callback();
            finished = true;
        }).catch();

        getUserByEmailOrUsername(null, username).then(res => {
            if (res.data.status && res.data.results.user_login) {
                setUsernameTaken(true);
                duplicate = true;
                setLoading(false);
            }
            if (finished && !duplicate) callback();
            finished = true;
        }).catch();
    };

    const emailDescription = emailError ?
        <span className="text-danger">Fejl i email-adresse</span>
        : emailAlreadyRegistered ? <span className="text-danger">Email-adressen er allerede i brug</span>
            : "";

    const usernameDescription = usernameTaken ?
        <span className="text-danger">Brugernavnet er allered taget</span> : "";

    return (
        <div>
            {
                isLoading &&
                <LoadingModal
                    timeout={10000}
                    timeoutCallback={() => {
                        setLoading(false);
                        setSignupFailed(true);
                    }}
                />
            }
            <h1>Opret bruger</h1>
            {
                signupFailed &&
                <p className="text-danger">
                    Kunne ikke oprette bruger. kontroller venligst at alle felter er udfyldt korrekt
                </p>
            }
            {
                passwordDiff &&
                <p className="text-danger">
                    De indtastede adgangskoder stemmer ikke overens. Prøv at taste dem igen.
                </p>
            }
            <form style={{maxWidth: 800}} className="row" onSubmit={e => {
                e.preventDefault();
                signUp();
            }}>
                <TextInput
                    className={"col-12 col-md-6"}
                    field={{
                        type: "email",
                        label: "Email",
                        visibility: "visible",
                        isRequired: true,
                        size: "large",
                        description: emailDescription
                    }}
                    status={emailAlreadyRegistered || emailError ? "error" : ""} value={email} onChange={setEmail}
                />
                <TextInput
                    className={"col-12 col-md-6"}
                    field={{
                        type: "text",
                        label: "Brugernavn",
                        visibility: "visible",
                        isRequired: true,
                        size: "large",
                        description: usernameDescription
                    }}
                    status={usernameTaken ? "error" : ""} value={username} onChange={setUsername}
                />
                <TextInput field={{type: "text", label: "Fornavn", visibility: "visible"}} value={firstName}
                           onChange={setFirstName} className={"col-12 col-md-6"}/>
                <TextInput field={{type: "text", label: "Efternavn", visibility: "visible"}} value={lastName}
                           onChange={setLastName} className={"col-12 col-md-6"}/>
                <TextInput field={{type: "password", label: "Adgangskode", visibility: "visible", isRequired: true}}
                           className={"col-12 col-md-6"} status={passwordDiff && "error"} value={password}
                           onChange={setPassword}/>
                <TextInput
                    field={{type: "password", label: "Gentag Adgangskode", visibility: "visible", isRequired: true}}
                    className={"col-12 col-md-6"} status={passwordDiff && "error"} value={repeatPassword}
                    onChange={setRepeatPassword}/>

                <div className="form-group col-12">
                    <button className="btn btn-success form-control" type="submit">Opret bruger</button>
                </div>


                {/*keep me logged in*/}
                <div className={"form-check text-center w-100"}>
                    <input
                        type="checkbox" className="form-check-input"
                        onChange={(e) => {
                            setKeepLoggedIn(e.target.checked)
                        }}
                        checked={keepLoggedIn}
                    />
                    <label className="form-check-label">Forbliv logget ind</label>
                </div>


                <div className={"text-center w-100 mt-2"}>
                    <p className="link" onClick={() => setCreateUser(false)}>Log ind med eksisterende bruger</p>
                </div>

            </form>
        </div>
    )
};

export default CreateUser;
