import axios from "axios";
import {API, JWT_API, TOKEN, WP_API} from "../constants";

export function getUserToken() {
    let token = sessionStorage.getItem("YX-usertoken");
    if (!token) token = localStorage.getItem("YX-usertoken");
    return token;
}

export function setUserToken(token, keepLoggedIn) {
    sessionStorage.setItem("YX-usertoken", token);
    if (keepLoggedIn) localStorage.setItem("YX-usertoken", token);
}

export function logOutUser(setUser = () => {
}) {
    sessionStorage.removeItem("YX-usertoken");
    localStorage.removeItem("YX-usertoken");
    setUser({});
}

export async function getUserByToken(userToken, setUser = () => {
}) {

    if (!userToken) userToken = getUserToken();

    let promise = new Promise((resolve, reject) => {
        if (!userToken) {
            return reject();
        }

        axios.post(WP_API + "users/me", null, {
            headers: {
                Authorization: "Bearer " + userToken,
            }
        })
            .then(res => {
                setUser(res.data);
                resolve(res);
            })
            .catch(err => {
                logOutUser();
                reject(err);
            });
    });

    return await promise;
}

export async function getUserByEmailOrUsername(email, username) {

    const query = email ? "user?email=" + email : "user?username=" + username;

    let promise = new Promise((resolve, reject) => {
        axios.get(API + query + "&" + TOKEN)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    });

    return await promise;
}

export async function logInWithUsername(username, password, keepLoggedIn) {
    const postData = {username, password};

    return await new Promise((resolve, reject) => {
        axios.post(JWT_API + "token", postData, {
            'Access-Control-Allow-Origin': '*',
        })
            .then(res => {
                setUserToken(res.data.token, keepLoggedIn);
                resolve(res.data.token);
            })
            .catch(err => {
                reject(err);
            });
    });

}

const userToken = getUserToken();
export const authHeader =  !!userToken ? {Authorization: "Bearer " + userToken} :{};
