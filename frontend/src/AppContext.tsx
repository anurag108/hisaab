import { createContext } from "react";
import { User } from "./types";

interface AppContextProps {
    user: User | null,
    handleLogin: (u: User) => void,
    handleLogout: () => Promise<void>,
}

export const AppContext = createContext<AppContextProps>({
    user: null,
    handleLogin: () => { },
    handleLogout: async () => { },
});