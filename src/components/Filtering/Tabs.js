import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: "100%",
        backgroundColor: '#111111',
    },
    tabsRoot: {
        minHeight: "42px",
        backgroundColor: 'rgba(0,0,0,0)',
        borderRadius: '0',
        borderTop: '1px solid #a2a2a2',
        borderBottom: '1px solid #a2a2a2',
    },
    tabsIndicator: {
        backgroundColor: '#ffffff',
    },
    tabRoot: {
        overflow: 'hidden',
        textTransform: 'initial',
        minWidth: "90px",
        minHeight: "42px",
        fontSize: "1rem",
        fontWeight: '400',
        marginRight: theme.spacing.unit * 0,
        letterSpacing: 1.3,
        '&:hover': {
            color: '#0f9f0d',
            opacity: 1,
        },
        '&$tabSelected': {
            color: '#ffffff',
            fontWeight: '400',
            textStroke: '.75px white',
        },
        '&:focus': {
            color: '#ffffff',
        },
    },
    tabSelected: {
        backgroundColor: 'rgba(0,0,0,0)',
    },
});

class CustomizedTabs extends React.Component {

    handleChange = (event, value) => {
        this.props.onChange(value);
    };

    render() {
        const {classes, tabs, value, scroll = "auto"} = this.props;

        return (
            <div className={classes.root}>

                <Tabs
                    value={value}
                    onChange={this.handleChange}
                    classes={{root: classes.tabsRoot, indicator: classes.tabsIndicator}}
                    variant="scrollable"
                    scrollButtons={scroll}
                >

                    {
                        tabs.map((tab, i) => {
                            if (tab) return (
                                <Tab key={i}
                                     disableRipple
                                     classes={{root: classes.tabRoot, selected: classes.tabSelected}}
                                     label={tab.label}
                                     value={tab.value}
                                />);
                            return null;
                        })
                    }

                </Tabs>

            </div>
        );
    }
}

CustomizedTabs.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomizedTabs);
