import React, {createContext, useReducer, useState} from 'react';
import StatusReducer from "./Reducers/StatusReducer";


//CONTEXTS
export const UserContext = createContext({});
export const SiteInfoContext = createContext({});
export const StatusContext = createContext({});


const Store = ({children}) => {
    const [user, setUser] = useState({});
    const [siteInfo, setSiteInfo] = useState({});
    const [status, dispatchStatus] = useReducer(StatusReducer, {activeConnections: 0, scripts: []});


    return (
        <UserContext.Provider value={[user, setUser]}>
            <SiteInfoContext.Provider value={[siteInfo, setSiteInfo]}>
                <StatusContext.Provider value={[status, dispatchStatus]}>
                    {children}
                </StatusContext.Provider>
            </SiteInfoContext.Provider>
        </UserContext.Provider>
    );
};

export default Store;
