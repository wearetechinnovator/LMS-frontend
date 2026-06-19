import React, { createContext, useState } from 'react';
import Sidebar from './components/Sidebar';
import getUser from './api/getUser';
import { useEffect } from 'react';
export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        getUser().then((res) => {
            setName(res[0]?.name);
        }).catch((err) => {
            console.error(err);
        });
    }, []);

    return (
        <UserContext.Provider value={name}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;