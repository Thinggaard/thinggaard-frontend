import React, {useContext} from 'react';
import LoginScreen from "../../components/User/LoginScreen";
import {UserContext} from "../../store/Store";
import {logOutUser} from "../../functions/userFunctions";
import UserIcon from "../../components/User/UserIcon";
import {Link} from "react-router-dom";


const PageLogin = () => {
    const [user, setUser] = useContext(UserContext);

    const logOut = () => {
        logOutUser(setUser);
    };

    return (
        <div className="container d-flex justify-content-center" style={{marginTop: 120}}>
            {
                !user.id ? <LoginScreen/>
                    :
                    <div className="row">
                        <div className="col-auto">
                            <UserIcon name={user.name} size={100}/>
                        </div>
                        <div className="col">
                            <div className={"text-secondary"}>Logget ind som</div>
                            <h3>{user.name}</h3>
                            <button className="btn btn-sm btn-outline-danger mr-2" onClick={logOut}>Log ud</button>
                            <Link to={"/profile"} className="btn btn-sm btn-outline-primary mr-2">Vis profil</Link>
                        </div>
                    </div>
            }

        </div>
    );

};

export default PageLogin;

