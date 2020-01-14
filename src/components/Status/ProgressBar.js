import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    linearColorPrimary: {
        backgroundColor: '#0A0A0A',
    },
    linearBarColorPrimary: {
        backgroundColor: '#13ac10',
    },
});

function CustomizedProgress(props) {
    const {classes} = props;
    return (
        <LinearProgress
            classes={{
                colorPrimary: classes.linearColorPrimary,
                barColorPrimary: classes.linearBarColorPrimary,
            }}
        />
    );
}

CustomizedProgress.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomizedProgress);
