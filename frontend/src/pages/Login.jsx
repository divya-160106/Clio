import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "./Auth.css";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            await login(username, password);
            navigate("/dashboard");
        }
        catch (err) {
            setError(
                err.response?.data?.detail ||
                "Login failed."
            );
        }
    }

    return (
        <div className="auth-container">
            <form
                className="auth-card"
                onSubmit={handleSubmit}
            >
                <h1>Welcome Back</h1>
                <p>Login to Clio</p>
                {error &&
                    <div className="error">
                        {error}
                    </div>
                }

                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e)=>
                        setUsername(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>
                        setPassword(e.target.value)
                    }
                />

                <button>
                    Login
                </button>

                <p>
                    Don't have an account?
                    <Link to="/register">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}