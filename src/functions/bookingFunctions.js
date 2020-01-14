import axios from "axios";
import {API, TOKEN} from "../constants";
import {getUserToken} from "./userFunctions";

const userToken = getUserToken();
const authHeader =  !!userToken ? {Authorization: "Bearer " + userToken} :{};

export const getBooking = async (id, token, adminToken) => {
    const params = {
        booking_relation_booking : id,
    };
    if(!!token) params.booking_token=token;
    return await new Promise((resolve, reject) => {
        axios.get(API + "booking?" + TOKEN, {
            headers: authHeader,
            params: params,
        }).then(res => {
            if (res.data.status) {
                resolve(res.data.results);
            } else {
                reject(res);
            }
        }).catch(err => {
            reject(err)
        });
    });
};

export const postBooking = async (data) => {
    return await new Promise ((resolve, reject) => {
        axios.post(API + "booking?" + TOKEN, data, {headers: authHeader}).then(res => {
            if (res.data.status) {
                resolve(res.data.results);
            } else {
                reject(res);
            }
        }).catch(err => {
            reject(err);
        });
    })
};

export const postLead = async (data) => {
    return await new Promise ((resolve, reject) => {
        axios.post(API + "lead?" + TOKEN, data).then(res => {
            if (res.data.status) {
                resolve(res.data.results);
            } else {
                reject(res);
            }
        }).catch(err => {
            reject(err);
        });
    })
};

export const getTransportPrice = async (productId, fromZip, toZip, fromRegion, toRegion) => {
    return await new Promise((resolve, reject) => {
        if (!(fromZip || fromRegion) || !(toZip || toRegion)) reject();

        const fromQuery = fromRegion ? "&from_region="+fromRegion : "&from_zip="+(fromZip || 1000);
        const toQuery = (toRegion || !toZip) ? "&to_region="+toRegion : "&to_zip="+toZip;

        axios.get(API + "transport?" + TOKEN + fromQuery + toQuery + "&product=" + productId).then(res => {
            if (res.data.status) {
                resolve(res.data.results);
            } else {
                reject(res);
            }
        }).catch(err => {reject(err)})
    })
};


