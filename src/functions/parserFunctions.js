import GravityForm from "../components/Form/GravityForm/GravityForm";
import React from "react";
import parse from 'html-react-parser';
import ShowPhone from "../components/Utility/ShowPhone";
import {ROOT} from "../constants";

export function parseShortCodes(str) {

    const regex = /{%.*=\d+%}/;
    let parsed = str;
    let match;
    while ((match = regex.exec(parsed)) != null) {
        const codePosition = match.index;
        const codeLength = match[0].length;
        const values = match[0].split("{%")[1].split("=");
        const type = values[0];
        const id = values[1].split("%")[0];

        const component = `<div data-shortcode='${type}' data-id='${id}'></div>`;
        parsed = parsed.substring(0, codePosition) + component + parsed.substring(codePosition + codeLength)
    }

    return parse(parsed, {
        replace: ({attribs, children}) => {
            if (!attribs) return;

            if (attribs["data-shortcode"] === "showphonelink") {
                return <ShowPhone asLink={true}/>;
            }

            if (attribs["data-shortcode"] === "showphone") {
                return <ShowPhone asLink={false}/>;
            }

            if (attribs["data-shortcode"] === "form") {
                return <GravityForm id={attribs["data-id"]} classes={"my-4 py-4"}/>;
            }

            if (attribs["data-shortcode"] === "formclean") {
                return <GravityForm id={attribs["data-id"]} classes={""} showTitle={false}/>;
            }
        }
    });

}

export function getRelativeURL(fullURL) {
    return fullURL.replace(/^(?:\/\/|[^/]+)*\//, "/");
}

export function unwrapArraysInObject(obj) {
    Object.keys(obj).forEach(key => {
        obj[key] = unwrapSingleValueArray(obj[key]);
    });
    return obj;
}

export function unwrapSingleValueArray(arr) {
    if (!Array.isArray(arr)) return arr;
    if (arr.length > 1) return arr;
    if (arr.length === 0) return null;

    return arr[0];
}

export function insertParam(key, value) {
    key = encodeURI(key);
    value = encodeURI(value);

    const kvp = document.location.search.substr(1).split('&');

    let i = kvp.length;
    let x;
    while (i--) {
        x = kvp[i].split('=');

        if (x[0] === key) {
            x[1] = value;
            kvp[i] = x.join('=');
            break;
        }
    }

    if (i < 0) {
        kvp[kvp.length] = [key, value].join('=');
    }

    //this will reload the page, it's likely better to store this until finished
    window.history.pushState('', '', window.location.pathname.split("?")[0]+"?"+kvp.join('&'));
}

export function correctUrl(newUrl) {
    window.history.pushState('', '', ROOT + newUrl);
}