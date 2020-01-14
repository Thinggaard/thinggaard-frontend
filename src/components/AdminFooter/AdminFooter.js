import React, {useContext} from 'react';
import './AdminFooter.css';
import {UserContext} from "../../store/Store";
import {WP_ROOT} from "../../constants";

const AdminFooter = ({postId}) => {

    const [user,] = useContext(UserContext);
    const isAdmin = !!user.roles && user.roles.includes("administrator");

    return (
        isAdmin &&
        <div className="admin-footer">
            <span className={"admin-footer-button"} onClick={() => {window.location.reload(true);}}>Refresh</span>
            <a target={"_blank"} className={"admin-footer-button"} href={WP_ROOT+"/wp-admin"}>WP Admin</a>
            <a target={"_blank"} className={"admin-footer-button"} href={`${WP_ROOT}/wp-admin/post.php?post=${postId}&action=edit`}>Edit page</a>
        </div>
    );
};

export default AdminFooter;
