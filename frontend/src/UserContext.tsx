import { createContext, ReactNode, useEffect, useState } from "react";
import HisaabLogin from "./login/HisaabLogin.react";
import { User } from "./types";

const UserContext = createContext({});

interface UserProviderProps {
    children: ReactNode
}

export const UserProvider = (props: UserProviderProps) => {
    const { children } = props;
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setCurrentUser(JSON.parse(loggedInUser));
        } else {
            setCurrentUser(null);
        }
    }, []);

    const handleLogin = (user: User) => {
        localStorage.setItem("user", JSON.stringify(user));
        setCurrentUser(user);
    }

    return (
        <UserContext.Provider value={[currentUser, setCurrentUser]}>
            {!currentUser ? <HisaabLogin onLogin={handleLogin} /> : children}
        </UserContext.Provider>
    );
}