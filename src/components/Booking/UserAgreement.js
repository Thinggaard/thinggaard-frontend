import {Link} from "react-router-dom";
import React from "react";
import {FaCheckCircle, FaCircle} from "react-icons/fa";

const UserAgreement = ({userAgrees = false, setUserAgrees}) => {

    const toggleAgreement = () => {
        setUserAgrees(!userAgrees);
    };

    return(
        <>
            {userAgrees ?
                <FaCheckCircle onClick={toggleAgreement} className="booking-icon text-success" style={style}/>
                : <FaCircle onClick={toggleAgreement} className="booking-icon text-secondary" style={style}/>
            }
            <small><span onClick={toggleAgreement}>Jeg har læst og accepterer</span>
                <Link to={'/forretnings-og-betalingsbetingelser/'} target={"_blank"}>
                    <span className="text-success"> forretningsbetingelserne</span>
                </Link>
            </small>
        </>
    );
};

const style = {
    fontSize: 20,
    cursor : "pointer"
};

export default UserAgreement;