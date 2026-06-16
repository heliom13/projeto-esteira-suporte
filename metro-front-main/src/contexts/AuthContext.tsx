import React, {useCallback, useContext, useEffect, useState} from "react";
import Cookies from "js-cookie";
import jwt from "jwt-decode";

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

const AuthContext = React.createContext(
    {} as {
        user: User | null;
        authenticate(newToken: string): void;
        logout(): void;
        isAuthenticated: boolean;
        token: string | undefined;
        hasAnyRole(roles: string[]): boolean;
    }
);

type AuthType = {
    children: React.ReactNode;
};

const TOKEN = "token-lott";

const getUser = (token: string): User | null => {
    try {
        const userJwt = jwt(token) as {
            sub: string;
            iss: string;
            exp: number;
            jti: number;
            role: string;
        };

        const tokenExpired = userJwt.exp * 1000 < new Date().getTime();
        if (tokenExpired) {
            return null;
        }

        return {
            id: 1,
            name: userJwt.iss,
            email: userJwt.sub,
            role: userJwt.role
        };
    } catch (error) {
        console.error("Error decoding token", error);
        return null;
    }
};

export const AuthProvider = ({children}: AuthType) => {
    const [user, setUser] = useState<User | null>(null);

    const checkAuthentication = () => {
        const token = localStorage.getItem("token");
        if (token) {
            const user = getUser(token);
            if (user) {
                setUser(user);
                return true;
            }
        }
        return false;
    };

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuthentication);

    const authenticate = useCallback((token) => {
        const user = getUser(token);
        if (user) {
            setUser(user);
            setIsAuthenticated(true);
            Cookies.set(TOKEN, token, {
                expires: 1,
                path: "/",
            });
        } else {
            localStorage.setItem("token", "");
            Cookies.remove(TOKEN);
        }
    }, [setUser, setIsAuthenticated]);

    const logout = () => {
        localStorage.setItem("token", "");
        Cookies.remove(TOKEN);
        setUser(null);
        setIsAuthenticated(false);
    };

    const hasAnyRole = (roles: string[]) => {
        const token = localStorage.getItem("token");
        if (token) {
            const user = getUser(token);
            if (user) {
                return roles.includes(user.role);
            }
        }
        return false;
    };

    useEffect(() => {
        setIsAuthenticated(checkAuthentication());
    }, []);
    
    return (
        <AuthContext.Provider
            value={{
                user,
                authenticate,
                logout,
                isAuthenticated,
                token: Cookies.get(TOKEN),
                hasAnyRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// @ts-ignore
export const useAuth = () => useContext(AuthContext);
