import {useEffect} from "react";
import {withRouter} from "react-router-dom";

const ScrollToTop = ({location: {pathname}}) => {
    useEffect(() => {
        window.scrollTo({top: 0, left: 0})
    }, [pathname]);
    return null;
};

export default withRouter(ScrollToTop);
