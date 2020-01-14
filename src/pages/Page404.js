import React from 'react';
import {Link} from "react-router-dom";


const Page404 = ({url}) => (
    <div className="container" style={{paddingTop: '120px '}}>
        <p>{url}</p>
        <h1 style={{fontSize: '4rem'}}>404 :(</h1>
        <h3>Siden du leder efter findes ikke</h3>
        <Link to="/" className="btn btn-primary btn-lg">Til forsiden</Link>
    </div>
);

export default Page404;

