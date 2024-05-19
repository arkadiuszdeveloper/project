import Avatar from "../../ui/avatar/avatar";
import "./userDetails.sass";

import { IoAdd } from "react-icons/io5";

import React from "react";

const UserDetails: React.FunctionComponent<TUser & { onClick: () => void, remove: boolean }> = ({ onClick, remove, ...user }) => {
    return <div className={`userDetails${remove ? ' remove' : ''}`} onClick={ onClick }>
        <div className="userDetails-avatar">
            <Avatar userId={ user.id } title={ user.firstName[0] + user.lastName[0] } />
        </div>
        <div className="userDetails-title">
            <span>{ user.firstName } { user.lastName }</span>
        </div>
        { remove ? <span className="userDetails-remove-icon">
            <IoAdd />
        </span> : <React.Fragment /> }
    </div>
}

export default UserDetails;