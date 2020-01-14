import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';


export default function Spinner(props) {

    const {size = 25, color = "#0f8b0d"} = props;

    return (
        <CircularProgress style={{
            color,
            height: size,
            width: size
        }}/>
    );
}
