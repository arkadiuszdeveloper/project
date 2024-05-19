import React, { useEffect } from "react";
import { createContext } from "react";
import { useAccessToken, useMessageApi, useRoomsApi, useSharedApi } from "../hooks/useApi";
import { navigate } from "gatsby";

type RoomDefault = {
    roomApi: ReturnType<typeof useRoomsApi>;
    messageApi: ReturnType<typeof useMessageApi>;
    sharedApi: ReturnType<typeof useSharedApi>;
}

export const RoomsContext = createContext({} as RoomDefault);

const RoomsProvider: React.FunctionComponent<{ children: JSX.Element }> = ({ children }) => {
    const sharedApi = useSharedApi();
    const roomApi = useRoomsApi();
    const messageApi = useMessageApi();

    const { accessToken } = useAccessToken();

    useEffect(() => {
        if (!accessToken)
            navigate('/login');
    }, []);

    if (!accessToken) {
        return <React.Fragment />
    }

    return <RoomsContext.Provider value={{ roomApi, messageApi, sharedApi }}>
        { children }
    </RoomsContext.Provider>
}

export default RoomsProvider;
