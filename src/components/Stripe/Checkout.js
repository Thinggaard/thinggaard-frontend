import axios from "axios";
import {API, STRIPE_PK, TOKEN} from "../../constants";
import {useEffect} from "react";

/*
YOUANDX stripe
pk_test_ImaGHS8u8lRCFY2nhNCQLcBo
pk_live_VjOXYVNkZkIlI6YTyJYFuxwp

Stripe demo key
pk_test_TYooMQauvdEDq54NiTphI7jx
*/

// Dansk Visa Kort test: 4000002080000001


const Checkout = ({submit, price, bookingId}) => {

    const stripe = window.Stripe ? window.Stripe(STRIPE_PK) : null;

    useEffect(doSubmit, [submit]);

    function doSubmit() {
        if (!submit) return;

        const postData = {
            price: price,
            bookingid: bookingId,
            token: "youandx",
        };

        axios.post(API + "stripe_charge?" + TOKEN, postData)
            .then(res => {
                console.log(res);
                if (res.data.status) {
                    if (!stripe || !stripe.redirectToCheckout) return;
                    const sessionId = res.data.results.session.id;
                    stripe.redirectToCheckout({sessionId}).then(result => {
                    });
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    return null;

};

export default Checkout;
