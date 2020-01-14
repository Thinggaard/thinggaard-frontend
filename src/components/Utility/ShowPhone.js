import React from 'react';
import queryString from "query-string";

function ShowPhone(props) {
    const {
        asLink = true,
    } = props;

    let yxs=localStorage.getItem("yxs");

    let phonetext="+45 70 200 449";
    let phoneurl="tel:+4570200449";

    if(!yxs)
    {
        let search = window.location.search;
        let params = queryString.parse(search);
        let yxs = params.yxs;

        if(yxs) localStorage.setItem("yxs", yxs);
    }

    if(!!yxs) {
        switch (yxs) {
            case 'facebook' :
                phonetext = "+45 70 200 919";
                phoneurl = "tel:+4570200919";
                break;
            case 'linkedin' :
                phonetext = "+45 70 200 919";
                phoneurl = "tel:+4570200919";
                break;
            case 'google' :
                phonetext = "+45 70 200 919";
                phoneurl = "tel:+4570200919";
                break;
            default:
                phonetext = "+45 70 200 449";
                phoneurl = "tel:+4570200449";
                break;
        }
    }

    return (

        asLink ? <a href={phoneurl}><span>{phonetext}</span></a> : <span>{phonetext}</span>
    );
}

export default ShowPhone;