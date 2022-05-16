import React, { useContext } from 'react';

/* useState (Local State) vs. useContext (Global State) */
export const DBContext = React.createContext();

export const useDB = () => {
    return useContext(DBContext);
};