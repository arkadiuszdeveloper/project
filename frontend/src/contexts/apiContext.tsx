import React from "react";
import { createContext } from "react";
import { useUserApi } from "../hooks/useApi";

export const ApiContext = createContext({} as ReturnType<typeof useUserApi>);

const ApiProvider: React.FunctionComponent<{ children: JSX.Element }> = ({ children }) => {
    const userApi = useUserApi();

    return <ApiContext.Provider value={ userApi }>
        { children }
    </ApiContext.Provider>
}

export default ApiProvider;
