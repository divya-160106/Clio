import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadUser();
    }, []);

    async function loadUser() {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await api.get("/auth/me");
            setUser(res.data);
        }
        catch {
            localStorage.removeItem("token");
            setUser(null);
        }
        finally {
            setLoading(false);
        }
    }

    async function login(email, password) {
        const res = await api.post(
            "/auth/login",
            {
                email,
                password
            }
        );
        localStorage.setItem(
            "token",
            res.data.access_token
        );
        await loadUser();
    }

    async function register(username, email, password) {
        await api.post("/auth/register", {
            username,
            email,
            password
        });
        await login(email, password);
    }

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                loadUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}