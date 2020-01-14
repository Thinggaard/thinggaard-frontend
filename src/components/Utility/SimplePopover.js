import React from 'react';
import Popover from '@material-ui/core/Popover';
import './SimplePopover.css';


function SimplePopover({trigger, children, active = true}) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    function handleClick(event) {
        event.preventDefault();
        if (active) setAnchorEl(event.currentTarget);
    }

    function handleClose(event) {
        event.preventDefault();
        setAnchorEl(null);
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : null;

    return (
        <>
            <span onClick={handleClick}>
                {trigger}
            </span>
            <Popover
                id={id}
                PaperProps={{classes: {root: 'simple-popover'}}}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                onClick={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {children}
            </Popover>
        </>
    );
}

export default SimplePopover;
