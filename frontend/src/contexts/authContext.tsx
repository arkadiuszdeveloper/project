import React, { createContext, useContext, useEffect, useState } from "react";
import { useAccessToken } from "../hooks/useApi";
import { ApiContext } from "./apiContext";

export const AuthContext = createContext({} as ReturnType<typeof useAccessToken>);

const AuthProvider: React.FunctionComponent<{ children: JSX.Element }> = ({ children }) => {
    const accessToken = useAccessToken();
    const [time, setTime] = useState<number>(0);

    const { verify, logout } = useContext(ApiContext);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await verify();
                if (!res.id) logout();
                console.log('user verified', res);

            } catch (error) {
                logout();
                console.log({ error })
            }
        }

        let intervalId: NodeJS.Timer;
        if (accessToken.accessToken && time < Date.now() - 30000) {
            checkUser();
            setTime(Date.now());
            intervalId = setInterval(checkUser, 30000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    })

    return <AuthContext.Provider value={ accessToken }>
        { children }
    </AuthContext.Provider>
}

export default AuthProvider;
