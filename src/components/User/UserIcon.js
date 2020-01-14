import React from 'react';
import PropTypes from 'prop-types';

const getInitials = name => {
    let initials = "";
    const names = name.split(" ");
    initials += names[0][0];
    if (names.length > 1) initials += names[names.length - 1][0];
    return initials;
};

const UserIcon = ({size = 40, name = "", imageUrl = ""}) => {

    const notifications = [];

    return (
        <div className="position-relative pr-2">
            <div
                className="rounded-circle bg-success d-flex align-items-center justify-content-center overflow-hidden"
                style={{width: size, height: size}}
            >
                {!imageUrl ? <h1 style={{fontSize: size / 2.2}}
                                 className="m-auto text-uppercase text-primary">{getInitials(name)}</h1>
                    : <img src={imageUrl} alt={name} width={size}/>}
            </div>
            <div className={size > 70 ? "h4 m-0" : ""}>
                {!!notifications.length &&
                    <span className="badge badge-pill badge-danger"
                          style={{position: "absolute", bottom: "5%", right: "5%"}}>
                        {notifications.length}
                    </span>
                }
            </div>
        </div>

    );
};

UserIcon.propTypes = {
    size: PropTypes.number,
    name: PropTypes.string,
    imageUrl: PropTypes.string,
};

export default UserIcon;
