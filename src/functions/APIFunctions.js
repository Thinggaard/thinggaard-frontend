import axios from "axios";
import {API, TOKEN} from "../constants";

export const getPost = async (id) => {
    return await new Promise((resolve, reject) => {
        axios.get(API + "posts/?postid=" + id + "&" + TOKEN).then(res => {
            if (res.data.status) resolve(res.data.results);
            else reject(res);
        }).catch(err => reject(err));
    })
};

export const getSpeaker = async (id) => {
    return await new Promise((resolve, reject) => {
        axios.get(API + "speakers/?speakerid=" + id + "&products=true&ratings=true&" + TOKEN).then(res => {
            if (res.data.status) resolve(res.data.results);
            else reject(res);
        }).catch(err => reject(err));
    })
};

