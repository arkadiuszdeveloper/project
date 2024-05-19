import React, { useContext } from "react";
import { ApiContext } from "../../../contexts/apiContext";

const LogoutComponent: React.FunctionComponent = () => {
    const { logout } = useContext(ApiContext);

    const logoutUser = () => {
        logout();
    }

    return <button onClick={ logoutUser }>Logout</button>
}

export default LogoutComponent;